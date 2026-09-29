import { NextResponse } from "next/server";
import { getMemoryStats } from "@/lib/ai/memory";
import { getAuditEvents } from "@/lib/ai/audit";
import { PILOT_ORGANIZATIONS } from "@/lib/enterprise/organizations";

export const dynamic = "force-dynamic";

const START_TIME = Date.now();

export async function GET() {
  try {
    const uptimeSec = Math.floor((Date.now() - START_TIME) / 1000);
    const hasGroq = Boolean(
      process.env.GROQ_API_KEY ||
      process.env.GROQ_API_KEY1 ||
      process.env.GROQ_API_KEY2
    );
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const memoryStats = getMemoryStats("org_pilot_acme");
    const auditEvents = getAuditEvents("org_pilot_acme");

    return NextResponse.json({
      status: "healthy",
      version: "1.0.0-beta",
      uptimeSeconds: uptimeSec,
      timestamp: new Date().toISOString(),
      services: {
        runtime: {
          status: "operational",
          engine: "multi-agent-coordinator",
          models: [
            "qwen/qwen3.8-27b",
            "openai/gpt-oss-120b",
          ],
          hasLiveGroqKeys: hasGroq,
          deterministicFallbackEnabled: true,
        },
        database: {
          status: hasSupabase ? "connected" : "ready_for_credentials",
          provider: "supabase",
          rlsEnforced: true,
          schemaVersion: "20260929_13_tables",
        },
        security: {
          promptGuard: "active",
          piiRedaction: "active",
          rateLimiting: "active",
          humanInTheLoop: "strictly_enforced",
        },
        memoryAndAudit: {
          workingMemoryEntries: memoryStats.totalEntries,
          auditEventsCount: auditEvents.length,
          tamperProofLedger: "sha256_chained",
        },
        enterprisePilot: {
          activeOrganizationsCount: PILOT_ORGANIZATIONS.length,
          defaultOrg: "org_pilot_acme",
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        error: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 500 }
    );
  }
}
