import { NextRequest, NextResponse } from "next/server";
import { runMultiAgentCoordinator } from "@/lib/ai/coordinator";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;
    const threadId = body?.threadId || `th_${Date.now().toString(36)}`;
    const tenantId = body?.tenantId || body?.organizationId || "org_default";

    // Rate Limiting Check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimitKey = `${tenantId}:${clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: rateLimit.error || "Rate limit exceeded. Please back off and retry.",
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetInSeconds),
          },
        }
      );
    }

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must not be empty" },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt exceeds maximum allowed length of 2000 characters" },
        { status: 400 }
      );
    }

    // Execute multi-agent coordinator with prompt guard and telemetry
    const result = await runMultiAgentCoordinator({
      query: prompt,
      threadId,
      organizationId: tenantId,
    });

    // Create a streaming SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Emit Step 0: Security & Policy Validation
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "step",
              step: 0,
              name: "security_guard",
              security: result.securityGuard,
            })}\n\n`
          )
        );

        // Emit Step 1: Process Analysis & Contract
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "step",
              step: 1,
              name: "process_analysis",
              contract: result.executionContract,
            })}\n\n`
          )
        );

        // Emit Step 2: Tool Execution (if not blocked)
        if (result.status !== "rejected") {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "step",
                step: 2,
                name: "tool_execution",
                tool: "enterprise_lookup",
                output: result.lookupResult,
              })}\n\n`
            )
          );

          // Emit Step 3: Approval Assessment
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "step",
                step: 3,
                name: "approval_gate",
                required: result.approvalRequired,
                prompt: result.approvalPrompt,
                approvalId: result.approvalId,
                idempotencyKey: result.idempotencyKey,
              })}\n\n`
            )
          );
        }

        // Stream synthesis tokens in chunks
        const tokens = result.finalSynthesis.split(" ");
        for (let i = 0; i < tokens.length; i++) {
          const chunk = (i === 0 ? "" : " ") + tokens[i];
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "token",
                token: chunk,
              })}\n\n`
            )
          );
          // brief yield for stream fluidity
          await new Promise((r) => setTimeout(r, 15));
        }

        // Emit Step 4 / Complete
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "complete",
              runId: result.runId,
              status: result.status,
              evidenceHash: result.evidenceHash,
              modelUsed: result.modelUsed,
              isDeterministicFallback: result.isDeterministicFallback,
              approvalId: result.approvalId,
              idempotencyKey: result.idempotencyKey,
              latencyMs: result.latencyMs,
              securityGuard: result.securityGuard,
            })}\n\n`
          )
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
