import { NextRequest, NextResponse } from "next/server";
import { getTelemetryLogs } from "@/lib/telemetry/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const correlationId = searchParams.get("correlationId") || undefined;
    const organizationId = searchParams.get("organizationId") || undefined;

    const events = getTelemetryLogs({ correlationId, organizationId });

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      count: events.length,
      events,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
