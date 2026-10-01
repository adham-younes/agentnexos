import { authenticatedUser } from "@/lib/auth/server";
import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { z } from "zod/v4";
import { conversationMessages } from "@/lib/workspace/history";
import { conversationText, contextLimits, projectConversation } from "@/lib/agents/context";
import { demoPolicy } from "@/lib/agents/policy";
import { createRunJournal } from "@/lib/agents/journal";
import { runAgentWorkflow } from "@/lib/agents/workflow";
import { reservationSchema, previewLimitsSchema } from "@/lib/agents/reservation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const bodySchema = z.object({ conversationId: z.uuid().nullable().optional(), requestId: z.uuid().optional(), locale: z.enum(["ar", "en"]), messages: z.array(z.object({ role: z.enum(["user", "assistant"]), parts: z.array(z.object({ type: z.literal("text"), text: z.string().max(contextLimits.messageCharacters) })).min(1).max(8) })).min(1).max(contextLimits.messages) });
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
  let conversation = conversationText(parsed.data.messages);
  const latestRequest = parsed.data.messages.at(-1)!.parts.map(p=>p.text).join("\n");
  if(latestRequest.length>4000) return Response.json({code:"CONTEXT_LIMIT"},{status:400,headers});
  if (conversation.length > contextLimits.characters || !parsed.data.messages.at(-1)?.parts.some(p => p.text.trim())) return Response.json({ code: "CONTEXT_LIMIT" }, { status: 400, headers });
  const auth=await authenticatedUser();
  if (!auth) return Response.json({ code: "AUTH_REQUIRED" }, {status:401,headers});
  if(!parsed.data.requestId) return Response.json({code:"REQUEST_ID_REQUIRED"},{status:400,headers});
  let db;
  try { db = database(); } catch { return unavailable(); }
  if (!db) return unavailable();
  // The subject comes from verified Auth, never a client-selected user or IP.
  const subject = createHmac("sha256", db.key).update(`user:${auth.user.id}`).digest("hex");
  let runId: string;
  try {
    const { data, error } = await db.client.rpc("reserve_agentnexos_demo_v3", { p_subject_hash: subject });
    if (error) return unavailable();
    const reservation = reservationSchema.safeParse(data);
    if (!reservation.success) return unavailable();
    if (reservation.data.code !== "RESERVED") return Response.json(reservation.data, { status: 429, headers: { ...headers, "Retry-After": String(reservation.data.retryAfterSeconds) } });
    runId = reservation.data.runId;
  } catch { return unavailable(); }
  let conversationId: string;
  try {
    const started=await db.client.rpc("agentnexos_begin_turn",{p_user_id:auth.user.id,p_conversation_id:parsed.data.conversationId??null,p_request_id:parsed.data.requestId,p_content:latestRequest,p_locale:parsed.data.locale});
    if(started.error||!z.uuid().safeParse(started.data).success) throw Error("CONVERSATION_UNAVAILABLE");
    conversationId=started.data;
    const history=await conversationMessages(auth.client,auth.user.id,conversationId);
    conversation=conversationText(projectConversation(history.map(x=>({role:x.role,parts:[{type:"text",text:x.content}]}))));
  } catch {
    await db.client.from("agentnexos_demo_requests").update({status:"failed",completed_at:new Date().toISOString()}).eq("id",runId);
    return Response.json({code:"CONVERSATION_UNAVAILABLE"},{status:409,headers});
  }
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
        writer.write({type:"data-conversation",data:{id:conversationId},transient:true});
        writer.write({ type: "start" });
        writer.write({ type: "text-start", id: "answer" });
        const result = await runAgentWorkflow({ conversation,
          latestRequest,
          locale: parsed.data.locale, signal,
          onPhase: index => writer.write({ type: "data-phase", data: { index }, transient: true }),
          onText: delta => writer.write({ type: "text-delta", id: "answer", delta }),
          onEvent: event => journal.append(event),
        });
        signal.throwIfAborted();
        const answer=await db.client.from("agentnexos_messages").insert({conversation_id:conversationId,user_id:auth.user.id,request_id:parsed.data.requestId,role:"assistant",content:result.text}).select("id").single();
        if(answer.error||!answer.data)throw Error("PERSISTENCE_UNAVAILABLE");
        const touched=await db.client.from("agentnexos_conversations").update({updated_at:new Date().toISOString()}).eq("id",conversationId).eq("user_id",auth.user.id).select("id").single();
        if(touched.error||!touched.data)throw Error("PERSISTENCE_UNAVAILABLE");
        const saved = await db.client.from("agentnexos_demo_requests")
          .update({ status: "completed", stages: journal.snapshot(), completed_at: new Date().toISOString() })
          .eq("id", runId).select("id").single();
        if (saved.error || !saved.data) throw new Error("PERSISTENCE_UNAVAILABLE");
        writer.write({ type: "text-end", id: "answer" });
        writer.write({type:"data-persistence",data:{saved:true},transient:true});
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
