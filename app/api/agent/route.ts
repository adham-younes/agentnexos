import { createAgentUIStreamResponse } from "ai";
import { agentnexosAgent } from "@/lib/agentnexos-agent";

export const maxDuration = 60;
export async function POST(request: Request) {
  const body = await request.json();
  if (!Array.isArray(body?.messages)) return Response.json({ error:"Invalid messages" }, { status:400 });
  return createAgentUIStreamResponse({ agent:agentnexosAgent, uiMessages:body.messages, timeout:{totalMs:55_000} });
}
