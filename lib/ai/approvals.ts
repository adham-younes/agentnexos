/**
 * Approvals Service: Human-in-the-Loop Gateway
 * Tracks pending authorizations, executes post-approval actions, and logs tamper-proof audit trails.
 */

import { z } from "zod";
import { recordAuditEvent } from "./audit.ts";
import { executeExportReport, executeNotifyDispatch, type ActionToolResult } from "./tools/action-tools.ts";

export const approvalRecordSchema = z.object({
  id: z.string(),
  organizationId: z.string().min(1),
  runId: z.string().min(1),
  actionType: z.string().min(1),
  actionSummary: z.string().min(1),
  actionPayload: z.record(z.unknown()),
  idempotencyKey: z.string().min(16),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  approvedBy: z.string().optional(),
  decisionReason: z.string().optional(),
  decidedAt: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type ApprovalRecord = z.infer<typeof approvalRecordSchema>;

const APPROVALS_STORE = new Map<string, ApprovalRecord>();

export async function createApprovalRequest(input: {
  organizationId: string;
  runId: string;
  actionType: string;
  actionSummary: string;
  actionPayload: Record<string, unknown>;
  idempotencyKey: string;
}): Promise<ApprovalRecord> {
  const id = `app_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const record: ApprovalRecord = {
    id,
    organizationId: input.organizationId,
    runId: input.runId,
    actionType: input.actionType,
    actionSummary: input.actionSummary,
    actionPayload: input.actionPayload,
    idempotencyKey: input.idempotencyKey,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const validated = approvalRecordSchema.parse(record);
  APPROVALS_STORE.set(id, validated);

  // Record in immutable audit log
  await recordAuditEvent({
    organizationId: validated.organizationId,
    runId: validated.runId,
    eventType: "approval_requested",
    payload: {
      approvalId: id,
      actionType: validated.actionType,
      summary: validated.actionSummary,
      idempotencyKey: validated.idempotencyKey,
    },
  });

  return validated;
}

export async function getApproval(approvalId: string): Promise<ApprovalRecord | null> {
  return APPROVALS_STORE.get(approvalId) || null;
}

export async function listApprovals(organizationId: string, status?: "pending" | "approved" | "rejected"): Promise<ApprovalRecord[]> {
  const results: ApprovalRecord[] = [];
  for (const record of APPROVALS_STORE.values()) {
    if (record.organizationId !== organizationId) continue;
    if (status && record.status !== status) continue;
    results.push(record);
  }
  return results;
}

export async function decideApproval(input: {
  approvalId: string;
  decision: "approved" | "rejected";
  actorId: string;
  reason?: string;
}): Promise<{ approval: ApprovalRecord; actionResult?: ActionToolResult }> {
  const record = APPROVALS_STORE.get(input.approvalId);
  if (!record) {
    throw new Error(`Approval record [${input.approvalId}] not found.`);
  }

  if (record.status !== "pending") {
    throw new Error(`Approval [${input.approvalId}] is already decided (status: ${record.status}).`);
  }

  const decidedAt = new Date().toISOString();
  record.status = input.decision;
  record.approvedBy = input.actorId;
  record.decisionReason = input.reason || "Manual user decision in Agent Space console.";
  record.decidedAt = decidedAt;

  // Log decision to audit log
  await recordAuditEvent({
    organizationId: record.organizationId,
    runId: record.runId,
    eventType: input.decision === "approved" ? "approval_granted" : "approval_rejected",
    actorId: input.actorId,
    payload: {
      approvalId: record.id,
      decision: input.decision,
      reason: record.decisionReason,
    },
  });

  let actionResult: ActionToolResult | undefined;

  // If approved, trigger corresponding action tool
  if (input.decision === "approved") {
    if (record.actionType === "enterprise_export_report") {
      actionResult = await executeExportReport({
        organizationId: record.organizationId,
        reportType: (record.actionPayload.reportType as "compliance" | "procurement" | "operations") || "compliance",
        destinationUrl: (record.actionPayload.destinationUrl as string) || "https://audit.agentnexos.com/v1/compliance/export",
        evidenceHash: (record.actionPayload.evidenceHash as string) || "0".repeat(64),
        idempotencyKey: record.idempotencyKey,
        approvalId: record.id,
      });
    } else if (record.actionType === "enterprise_notify_dispatch") {
      actionResult = await executeNotifyDispatch({
        organizationId: record.organizationId,
        recipientRole: (record.actionPayload.recipientRole as "compliance_officer" | "procurement_lead" | "operations_admin") || "compliance_officer",
        summary: (record.actionPayload.summary as string) || record.actionSummary,
        idempotencyKey: record.idempotencyKey,
        approvalId: record.id,
      });
    }

    if (actionResult) {
      await recordAuditEvent({
        organizationId: record.organizationId,
        runId: record.runId,
        eventType: "action_executed",
        actorId: input.actorId,
        payload: {
          action: actionResult.action,
          idempotencyKey: actionResult.idempotencyKey,
          receiptHash: actionResult.receiptHash,
          isDuplicate: actionResult.isDuplicate,
        },
      });
    }
  }

  return { approval: record, actionResult };
}
