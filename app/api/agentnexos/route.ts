import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { z } from "zod/v4";
import { conversationText, contextLimits } from "@/lib/agents/context";
import { demoPolicy } from "@/lib/agents/policy";
import { createRunJournal } from "@/lib/agents/journal";
import { runAgentWorkflow } from "@/lib/agents/workflow";
import { reservationSchema, previewLimitsSchema } from "@/lib/agents/reservation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const bodySchema = z.object({ locale: z.enum(["ar", "en"]), messages: z.array(z.object({ role: z.enum(["user", "assistant"]), parts: z.array(z.object({ type: z.literal("text"), text: z.string().max(contextLimits.messageCharacters) })).min(1).max(8) })).min(1).max(contextLimits.messages) });
const headers = { "Cache-Control": "no-store" };
function unavailable() { return Response.json({ code: "DEMO_NOT_READY" }, { status: 503, headers }); }
function database() {
  if (process.env.AGENTNEXOS_DEMO_ENABLED !== "true") throw new Error("FEATURE_DISABLED");
  const url = process.env.AGENTNEXOS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.AGENTNEXOS_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("DATABASE_UNCONFIGURED");
  if (!process.env.GROQ_API_KEY || !process.env.GROQ_API_KEY1 || !process.env.GROQ_API_KEY2) throw new Error("PROVIDER_UNCONFIGURED");
  if (new URL(url).hostname !== "ruereqpvykwnakcnmxha.supabase.co") throw new Error("DATABASE_PROJECT_MISMATCH");
  return { client: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }) } }), key };
}

export async function GET() {
  try {
    const db = database();
    if (!db) return Response.json({ ready: false }, { headers });
    const [health, budget] = await Promise.all([
      db.client.rpc("agentnexos_demo_ready"),
      db.client.from("agentnexos_demo_limits").select("connection_daily_limit,global_daily_limit").eq("singleton", true).single(),
    ]);
    const limits = previewLimitsSchema.safeParse({ perConnectionDaily: budget.data?.connection_daily_limit, globalDaily: budget.data?.global_daily_limit, windowSeconds: 86400 });
    if (health.error || health.data !== true || budget.error || !limits.success) return Response.json({ ready: false, code: "DATABASE_UNAVAILABLE" }, { headers });
    return Response.json({ ready: true, limits: limits.data }, { headers });
  } catch (error) {
    // Safe readiness codes only: never provider errors, keys, URLs or stack traces.
    const allowed = ["FEATURE_DISABLED", "DATABASE_UNCONFIGURED", "PROVIDER_UNCONFIGURED", "DATABASE_PROJECT_MISMATCH"];
    const code = error instanceof Error && allowed.includes(error.message) ? error.message : "DATABASE_UNAVAILABLE";
    return Response.json({ ready: false, code }, { headers });
  }
}

export async function POST(request: Request) {
  // Same-origin browser surface, not a public integration API.
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin) return Response.json({ code: "ORIGIN_DENIED" }, { status: 403, headers });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ code: "JSON_REQUIRED" }, { status: 415, headers });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ code: "EMPTY_REQUEST" }, { status: 400, headers });
  const decoder = new TextDecoder(); let raw = "", bytes = 0;
  try { while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 40000) { await reader.cancel(); return Response.json({ code: "REQUEST_TOO_LARGE" }, { status: 413, headers }); } raw += decoder.decode(value, { stream: true }); } raw += decoder.decode(); } catch { return Response.json({ code: "INVALID_REQUEST" }, { status: 400, headers }); }
  let parsed;
  try { parsed = bodySchema.safeParse(JSON.parse(raw)); } catch { return Response.json({ code: "INVALID_REQUEST" }, { status: 400, headers }); }
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") return Response.json({ code: "INVALID_REQUEST" }, { status: 400, headers });
  const conversation = conversationText(parsed.data.messages);
  if (conversation.length > contextLimits.characters || !parsed.data.messages.at(-1)?.parts.some(p => p.text.trim())) return Response.json({ code: "CONTEXT_LIMIT" }, { status: 400, headers });
  let db;
  try { db = database(); } catch { return unavailable(); }
  if (!db) return unavailable();
  // Vercel supplies this trusted header. Do not accept a client-selected tenant/IP.
  const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : null;
  if (!ip) return unavailable();
  const subject = createHmac("sha256", db.key).update(ip).digest("hex");
  let runId: string;
  try {
    const { data, error } = await db.client.rpc("reserve_agentnexos_demo_v3", { p_subject_hash: subject });
    if (error) return unavailable();
    const reservation = reservationSchema.safeParse(data);
    if (!reservation.success) return unavailable();
    if (reservation.data.code !== "RESERVED") return Response.json(reservation.data, { status: 429, headers: { ...headers, "Retry-After": String(reservation.data.retryAfterSeconds) } });
    runId = reservation.data.runId;
  } catch { return unavailable(); }
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(demoPolicy.deadlineMs)]);
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const journal = createRunJournal(async events => {
        const saved = await db.client.from("agentnexos_demo_requests")
          .update({ stages: events }).eq("id", runId).select("id").single();
        if (saved.error || !saved.data) throw new Error("PERSISTENCE_UNAVAILABLE");
      });
      try {
        signal.throwIfAborted();
        const started = await db.client.from("agentnexos_demo_requests")
          .update({ status: "running" }).eq("id", runId).select("id").single();
        if (started.error || !started.data) throw new Error("PERSISTENCE_UNAVAILABLE");
        writer.write({ type: "start" });
        writer.write({ type: "text-start", id: "answer" });
        await runAgentWorkflow({ conversation,
          latestRequest: parsed.data.messages.at(-1)!.parts.map(part => part.text).join("\n"),
          locale: parsed.data.locale, signal,
          onPhase: index => writer.write({ type: "data-phase", data: { index }, transient: true }),
          onText: delta => writer.write({ type: "text-delta", id: "answer", delta }),
          onEvent: event => journal.append(event),
        });
        signal.throwIfAborted();
        const saved = await db.client.from("agentnexos_demo_requests")
          .update({ status: "completed", stages: journal.snapshot(), completed_at: new Date().toISOString() })
          .eq("id", runId).select("id").single();
        if (saved.error || !saved.data) throw new Error("PERSISTENCE_UNAVAILABLE");
        writer.write({ type: "text-end", id: "answer" });
        writer.write({ type: "finish" });
      } catch (error) {
        // Best-effort terminal status. A failed save never becomes a success response.
        await db.client.from("agentnexos_demo_requests")
          .update({ status: signal.aborted ? "cancelled" : "failed", stages: journal.snapshot(), completed_at: new Date().toISOString() })
          .eq("id", runId);
        throw error;
      }
    },
    onError: () => "AGENT_REQUEST_FAILED",
  });
  return createUIMessageStreamResponse({ stream, headers });
}
