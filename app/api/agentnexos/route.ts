import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { z } from "zod/v4";
import { runAgentWorkflow } from "@/lib/agents/workflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const bodySchema = z.object({ locale: z.enum(["ar", "en"]), messages: z.array(z.object({ role: z.enum(["user", "assistant"]), parts: z.array(z.object({ type: z.literal("text"), text: z.string().max(4000) })).min(1).max(8) })).min(1).max(12) });
const headers = { "Cache-Control": "no-store" };
function unavailable() { return Response.json({ code: "DEMO_NOT_READY" }, { status: 503, headers }); }
function database() {
  if (process.env.AGENTNEXOS_DEMO_ENABLED !== "true") return null;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key || !process.env.GROQ_API_KEY || !process.env.GROQ_API_KEY1 || !process.env.GROQ_API_KEY2) return null;
  if (new URL(url).hostname !== "ruereqpvykwnakcnmxha.supabase.co") return null;
  return { client: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }) } }), key };
}

export async function GET() {
  try {
    const db = database();
    if (!db) return Response.json({ ready: false }, { headers });
    const { data, error } = await db.client.rpc("agentnexos_demo_ready");
    return Response.json({ ready: !error && data === true }, { headers });
  } catch { return Response.json({ ready: false }, { headers }); }
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
  const conversation = parsed.data.messages.map(m => `${m.role}: ${m.parts.map(p => p.text).join("\n")}`).join("\n\n");
  if (conversation.length > 12000 || !parsed.data.messages.at(-1)?.parts.some(p => p.text.trim())) return Response.json({ code: "CONTEXT_LIMIT" }, { status: 400, headers });
  let db;
  try { db = database(); } catch { return unavailable(); }
  if (!db) return unavailable();
  // Vercel supplies this trusted header. Do not accept a client-selected tenant/IP.
  const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : null;
  if (!ip) return unavailable();
  const subject = createHmac("sha256", db.key).update(ip).digest("hex");
  let runId: string;
  try {
    const { data, error } = await db.client.rpc("reserve_agentnexos_demo", { p_subject_hash: subject });
    if (error) return unavailable();
    if (typeof data !== "string") return Response.json({ code: "DEMO_LIMIT" }, { status: 429, headers: { ...headers, "Retry-After": "30" } });
    runId = data;
  } catch { return unavailable(); }
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(150000)]);
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const stages: { role: string; model: string; tokens: number | undefined }[] = [];
      const started = await db.client.from("agentnexos_demo_requests").update({ status: "running" }).eq("id", runId);
      if (started.error) throw new Error("PERSISTENCE_UNAVAILABLE");
      writer.write({ type: "start" });
      writer.write({ type: "text-start", id: "answer" });
      try { await runAgentWorkflow({ conversation, locale: parsed.data.locale, signal,
        onPhase: index => writer.write({ type: "data-phase", data: { index }, transient: true }),
        onText: delta => writer.write({ type: "text-delta", id: "answer", delta }),
        onStage: stage => { stages.push(stage); },
      });
      const saved = await db.client.from("agentnexos_demo_requests").update({ status: "completed", stages, completed_at: new Date().toISOString() }).eq("id", runId);
      if (saved.error) throw new Error("PERSISTENCE_UNAVAILABLE");
      writer.write({ type: "text-end", id: "answer" });
      writer.write({ type: "finish" });
      } catch (error) {
        await db.client.from("agentnexos_demo_requests").update({ status: signal.aborted ? "cancelled" : "failed", stages, completed_at: new Date().toISOString() }).eq("id", runId);
        throw error;
      }
    },
    onError: () => "AGENT_REQUEST_FAILED",
  });
  return createUIMessageStreamResponse({ stream, headers });
}
