import { NextRequest, NextResponse } from "next/server";
import { decideApproval, listApprovals, getApproval } from "@/lib/ai/approvals";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId") || "org_default";
    const approvalId = searchParams.get("id");
    const status = searchParams.get("status") as "pending" | "approved" | "rejected" | null;

    if (approvalId) {
      const record = await getApproval(approvalId);
      if (!record) {
        return NextResponse.json({ error: "Approval not found" }, { status: 404 });
      }
      return NextResponse.json({ approval: record });
    }

    const records = await listApprovals(orgId, status || undefined);
    return NextResponse.json({ approvals: records });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { approvalId, decision, actorId, reason } = body || {};

    if (!approvalId || typeof approvalId !== "string") {
      return NextResponse.json({ error: "approvalId is required" }, { status: 400 });
    }

    if (decision !== "approved" && decision !== "rejected") {
      return NextResponse.json(
        { error: "decision must be either 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    const result = await decideApproval({
      approvalId,
      decision,
      actorId: actorId || "supervisor_admin",
      reason,
    });

    return NextResponse.json({
      success: true,
      approval: result.approval,
      actionResult: result.actionResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
