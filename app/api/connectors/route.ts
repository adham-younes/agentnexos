import { NextRequest, NextResponse } from "next/server";
import {
  listConnectorsForOrg,
  checkConnectorHealth,
  getConnectorById,
} from "@/lib/enterprise/connectors";
import { getOrgQuotaStatus } from "@/lib/enterprise/quotas";
import { getFeatureFlagsForOrg } from "@/lib/enterprise/flags";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("organizationId") || "org_pilot_acme";

    const connectors = listConnectorsForOrg(orgId);
    const quota = getOrgQuotaStatus(orgId);
    const flags = getFeatureFlagsForOrg(orgId);

    // Run health checks in parallel
    const healthResults = await Promise.all(
      connectors.map((c) => checkConnectorHealth(c.id))
    );

    const enrichedConnectors = connectors.map((c) => {
      const health = healthResults.find((h) => h.connectorId === c.id);
      return {
        ...c,
        status: health?.status || c.status,
        latencyMs: health?.latencyMs || c.latencyMs,
        handshakeHash: health?.handshakeHash || "",
      };
    });

    return NextResponse.json({
      success: true,
      organizationId: orgId,
      connectors: enrichedConnectors,
      quota,
      flags,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to retrieve connectors",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectorId } = body;

    if (!connectorId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter 'connectorId'" },
        { status: 400 }
      );
    }

    const connector = getConnectorById(connectorId);
    if (!connector) {
      return NextResponse.json(
        { success: false, error: `Connector '${connectorId}' not found` },
        { status: 404 }
      );
    }

    const health = await checkConnectorHealth(connectorId);

    return NextResponse.json({
      success: true,
      connectorId,
      health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Connector test failed",
      },
      { status: 500 }
    );
  }
}
