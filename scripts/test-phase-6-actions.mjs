/**
 * Golden Integration & Evaluation Test for Phase 6:
 * Action Tools, SSRF Protection, Idempotency, Human-in-the-Loop Approvals, Memory & Audit Trail.
 */

import assert from "node:assert";
import { validateSafeDestinationUrl } from "../lib/security/ssrf.ts";
import { executeExportReport, executeNotifyDispatch } from "../lib/ai/tools/action-tools.ts";
import { storeMemory, getMemory, listMemories } from "../lib/ai/memory.ts";
import { recordAuditEvent, verifyAuditEventIntegrity, listAuditEvents } from "../lib/ai/audit.ts";
import { createApprovalRequest, decideApproval, getApproval } from "../lib/ai/approvals.ts";

console.log("--> Running Phase 6: Action Tools, Approvals, Memory & Security Evaluation...");

// TEST 1: SSRF Protection
const ssrfLoopback = validateSafeDestinationUrl("https://127.0.0.1:8080/admin");
assert.strictEqual(ssrfLoopback.isValid, false, "Loopback IP must be blocked");

const ssrfMetadata = validateSafeDestinationUrl("https://169.254.169.254/latest/meta-data/");
assert.strictEqual(ssrfMetadata.isValid, false, "Cloud metadata IP must be blocked");

const ssrfPrivateA = validateSafeDestinationUrl("https://10.0.1.5/api/export");
assert.strictEqual(ssrfPrivateA.isValid, false, "Private RFC1918 Class A must be blocked");

const ssrfHttp = validateSafeDestinationUrl("http://external-partner.com/webhook");
assert.strictEqual(ssrfHttp.isValid, false, "Non-HTTPS URL must be rejected");

const ssrfValid = validateSafeDestinationUrl("https://api.partner-hub.com/v1/compliance/upload");
assert.strictEqual(ssrfValid.isValid, true, "Valid external HTTPS URL must be accepted");
console.log("  [PASS] Test 1: SSRF boundary correctly halts all internal/metadata vector exploits");

// TEST 2: Action Tool execution with Zod validation
const idempKey1 = "idemp_test_alpha_928172648172";
const exportResult = await executeExportReport({
  organizationId: "org_test_101",
  reportType: "compliance",
  destinationUrl: "https://api.partner-hub.com/v1/compliance/upload",
  evidenceHash: "a".repeat(64),
  idempotencyKey: idempKey1,
  approvalId: "app_verified_101",
});
assert.strictEqual(exportResult.success, true);
assert.strictEqual(exportResult.isDuplicate, false);
assert.strictEqual(exportResult.receiptHash.length, 64, "Receipt hash must be 64-char SHA-256");
console.log("  [PASS] Test 2: Action tool executes with strict Zod schema and generates cryptographic receipt");

// TEST 3: Idempotency Protection (duplicate execution prevention)
const duplicateExport = await executeExportReport({
  organizationId: "org_test_101",
  reportType: "compliance",
  destinationUrl: "https://api.partner-hub.com/v1/compliance/upload",
  evidenceHash: "a".repeat(64),
  idempotencyKey: idempKey1,
  approvalId: "app_verified_101",
});
assert.strictEqual(duplicateExport.isDuplicate, true, "Same idempotencyKey must be flagged as duplicate");
assert.strictEqual(duplicateExport.receiptHash, exportResult.receiptHash, "Duplicate must return identical original receipt");
console.log("  [PASS] Test 3: Idempotency guard blocks unintended duplicate write execution");

// TEST 4: Operational Memory & Multi-Tenant Isolation
await storeMemory({
  organizationId: "org_alpha",
  scope: "organization",
  key: "vat_registration_number",
  value: { taxNumber: "300000000000003", certifiedDate: "2026-01-15" },
  tags: ["tax", "zatca"],
});

const alphaMem = await getMemory({
  organizationId: "org_alpha",
  key: "vat_registration_number",
});
assert.ok(alphaMem, "Alpha should retrieve its stored memory");
assert.strictEqual(alphaMem.value.taxNumber, "300000000000003");

const betaMem = await getMemory({
  organizationId: "org_beta",
  key: "vat_registration_number",
});
assert.strictEqual(betaMem, null, "Beta must NOT be able to view Alpha memory");

const betaList = await listMemories({ organizationId: "org_beta" });
assert.strictEqual(betaList.length, 0, "Beta memory vault must be empty");
console.log("  [PASS] Test 4: Operational Memory enforces strict tenant isolation");

// TEST 5: Immutable Audit Logging & Cryptographic Checksum Integrity
const auditEvent = await recordAuditEvent({
  organizationId: "org_audit_test",
  runId: "run_audit_999",
  eventType: "action_executed",
  actorId: "supervisor_adham",
  payload: { action: "enterprise_export_report", status: "success" },
});
assert.ok(auditEvent.checksum, "Audit checksum must be generated");
assert.strictEqual(verifyAuditEventIntegrity(auditEvent), true, "Legitimate audit event must pass integrity verification");

// Tampering simulation
const tamperedEvent = { ...auditEvent, payload: { ...auditEvent.payload, status: "hacked" } };
assert.strictEqual(verifyAuditEventIntegrity(tamperedEvent), false, "Tampered audit event must fail checksum check");
console.log("  [PASS] Test 5: Immutable audit logger cryptographically flags any data tampering");

// TEST 6: Human-in-the-Loop Approvals Gateway Lifecycle
const approval = await createApprovalRequest({
  organizationId: "org_approval_test",
  runId: "run_appr_111",
  actionType: "enterprise_notify_dispatch",
  actionSummary: "Dispatch sensitive operational alert to compliance lead",
  actionPayload: {
    recipientRole: "compliance_officer",
    summary: "Suspicious volume spike flagged on foreign procurement invoices",
  },
  idempotencyKey: "idemp_notify_918273645123",
});
assert.strictEqual(approval.status, "pending");

const approvedResult = await decideApproval({
  approvalId: approval.id,
  decision: "approved",
  actorId: "ciso_reviewer_44",
  reason: "Reviewed and verified as urgent compliance matter",
});
assert.strictEqual(approvedResult.approval.status, "approved");
assert.ok(approvedResult.actionResult, "Approved decision must trigger corresponding action tool");
assert.strictEqual(approvedResult.actionResult.success, true);
assert.strictEqual(approvedResult.actionResult.isDuplicate, false);

// Duplicate decision guard
await assert.rejects(
  async () => {
    await decideApproval({
      approvalId: approval.id,
      decision: "rejected",
      actorId: "ciso_reviewer_44",
    });
  },
  /already decided/,
  "Attempting to re-decide an already decided approval must be rejected"
);
console.log("  [PASS] Test 6: Human-in-the-Loop approval gateway enforces one-time human decision & triggers tool");

console.log("--> All Phase 6 Action Tools, Approvals, Memory & Security tests passed successfully!");
