import { z } from "zod";
import crypto from "node:crypto";
import { validateSafeDestinationUrl } from "../../security/ssrf.ts";

// In-memory idempotency registry (backed by database records in production)
const IDEMPOTENCY_STORE = new Map<string, { executedAt: string; receiptHash: string; output: unknown }>();

export const exportReportInputSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  reportType: z.enum(["compliance", "procurement", "operations"]),
  destinationUrl: z.string().url("Valid URL required"),
  evidenceHash: z.string().length(64, "Evidence hash must be 64-character SHA-256 string"),
  idempotencyKey: z.string().min(16, "Idempotency key must be at least 16 characters"),
  approvalId: z.string().min(1, "Approval ID is required for sensitive export action"),
});

export type ExportReportInput = z.infer<typeof exportReportInputSchema>;

export interface ActionToolResult {
  success: boolean;
  action: string;
  idempotencyKey: string;
  isDuplicate: boolean;
  receiptHash: string;
  executedAt: string;
  details: Record<string, unknown>;
}

export async function executeExportReport(input: ExportReportInput): Promise<ActionToolResult> {
  const validated = exportReportInputSchema.parse(input);

  // 1. SSRF Protection check
  const ssrfCheck = validateSafeDestinationUrl(validated.destinationUrl);
  if (!ssrfCheck.isValid) {
    throw new Error(`SSRF Security Violation: ${ssrfCheck.error}`);
  }

  // 2. Idempotency Check
  const existing = IDEMPOTENCY_STORE.get(validated.idempotencyKey);
  if (existing) {
    return {
      success: true,
      action: "enterprise_export_report",
      idempotencyKey: validated.idempotencyKey,
      isDuplicate: true,
      receiptHash: existing.receiptHash,
      executedAt: existing.executedAt,
      details: {
        message: "Duplicate operation blocked by idempotency safeguard. Returning original receipt.",
        cachedOutput: existing.output,
      },
    };
  }

  // 3. Execution & Cryptographic Receipt Generation
  const executedAt = new Date().toISOString();
  const rawReceipt = `EXPORT|${validated.organizationId}|${validated.reportType}|${validated.destinationUrl}|${validated.evidenceHash}|${validated.idempotencyKey}|${executedAt}`;
  const receiptHash = crypto.createHash("sha256").update(rawReceipt).digest("hex");

  const outputDetails = {
    destination: ssrfCheck.sanitizedUrl,
    recordsExported: 1,
    verifiedEvidenceHash: validated.evidenceHash,
    status: "transmitted",
  };

  IDEMPOTENCY_STORE.set(validated.idempotencyKey, {
    executedAt,
    receiptHash,
    output: outputDetails,
  });

  return {
    success: true,
    action: "enterprise_export_report",
    idempotencyKey: validated.idempotencyKey,
    isDuplicate: false,
    receiptHash,
    executedAt,
    details: outputDetails,
  };
}

export const notifyDispatchInputSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  recipientRole: z.enum(["compliance_officer", "procurement_lead", "operations_admin"]),
  summary: z.string().min(5, "Summary too short").max(500, "Summary too long"),
  idempotencyKey: z.string().min(16, "Idempotency key must be at least 16 characters"),
  approvalId: z.string().min(1, "Approval ID is required"),
});

export type NotifyDispatchInput = z.infer<typeof notifyDispatchInputSchema>;

export async function executeNotifyDispatch(input: NotifyDispatchInput): Promise<ActionToolResult> {
  const validated = notifyDispatchInputSchema.parse(input);

  const existing = IDEMPOTENCY_STORE.get(validated.idempotencyKey);
  if (existing) {
    return {
      success: true,
      action: "enterprise_notify_dispatch",
      idempotencyKey: validated.idempotencyKey,
      isDuplicate: true,
      receiptHash: existing.receiptHash,
      executedAt: existing.executedAt,
      details: {
        message: "Duplicate notification blocked by idempotency safeguard.",
      },
    };
  }

  const executedAt = new Date().toISOString();
  const rawReceipt = `NOTIFY|${validated.organizationId}|${validated.recipientRole}|${validated.summary}|${validated.idempotencyKey}|${executedAt}`;
  const receiptHash = crypto.createHash("sha256").update(rawReceipt).digest("hex");

  const outputDetails = {
    channel: "encrypted_internal_audit_bus",
    dispatchedTo: validated.recipientRole,
    status: "delivered",
  };

  IDEMPOTENCY_STORE.set(validated.idempotencyKey, {
    executedAt,
    receiptHash,
    output: outputDetails,
  });

  return {
    success: true,
    action: "enterprise_notify_dispatch",
    idempotencyKey: validated.idempotencyKey,
    isDuplicate: false,
    receiptHash,
    executedAt,
    details: outputDetails,
  };
}
