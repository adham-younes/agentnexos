import assert from "node:assert";
import { execSync } from "node:child_process";
import {
  PILOT_ORGANIZATIONS,
  listOrganizations,
  getOrganizationById,
  onboardPilotOrganization,
} from "../lib/enterprise/organizations.ts";
import {
  listConnectorsForOrg,
  getConnectorById,
  checkConnectorHealth,
} from "../lib/enterprise/connectors.ts";
import {
  getFeatureFlagsForOrg,
  setOrgFeatureFlag,
} from "../lib/enterprise/flags.ts";
import {
  getOrgQuotaStatus,
  checkAndConsumeRunQuota,
  releaseConcurrentRun,
  recordTokenUsage,
} from "../lib/enterprise/quotas.ts";
import { runMultiAgentCoordinator } from "../lib/ai/coordinator.ts";
import { decideApproval, getApproval } from "../lib/ai/approvals.ts";
import { getAuditEvents } from "../lib/ai/audit.ts";

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log("\n=======================================================");
console.log("   AGENTNEXOS PHASE 9: ENTERPRISE BETA TEST SUITE      ");
console.log("=======================================================\n");

// --- 1. Organization Onboarding & Multi-Tenant Management ---
console.log("--- 1. Organization Onboarding & Tenant Context ---");

runTest("Default pilot organizations are pre-configured", () => {
  const orgs = listOrganizations();
  assert(orgs.length >= 3, "Expected at least 3 default pilot organizations");
  
  const acme = getOrganizationById("org_pilot_acme");
  assert(acme, "Acme Saudi Logistics must be present");
  assert.strictEqual(acme.country, "SA");
  assert.strictEqual(acme.doaLimitSar, 100000);
  assert(acme.complianceFrameworks.includes("zatca_phase_2"));

  const gulf = getOrganizationById("org_pilot_gulf_fin");
  assert(gulf, "Gulf Finance Holding must be present");
  assert.strictEqual(gulf.country, "AE");
});

runTest("Dynamic onboarding creates compliant enterprise tenant", () => {
  const newOrg = onboardPilotOrganization({
    name: "Riyadh Pharma Distribution",
    nameAr: "شركة توزيع أدوية الرياض",
    industry: "healthcare",
    country: "SA",
    adminEmail: "security@riyadhpharma.sa",
    doaLimitSar: 120000,
    complianceFrameworks: ["zatca_phase_2", "pdpl_saudi"],
  });

  assert(newOrg.id.startsWith("org_"));
  assert.strictEqual(newOrg.status, "active");
  assert.strictEqual(newOrg.slug, "riyadh-pharma-distribution");
  assert.strictEqual(newOrg.doaLimitSar, 120000);
  assert.strictEqual(newOrg.allowedDomains[0], "riyadhpharma.sa");

  const retrieved = getOrganizationById(newOrg.id);
  assert.strictEqual(retrieved?.name, "Riyadh Pharma Distribution");
});

// --- 2. Enterprise Connectors & Cryptographic Handshakes ---
console.log("\n--- 2. Enterprise Connectors & Cryptographic Health ---");

runTest("Lists enterprise connectors bound to organization", () => {
  const connectors = listConnectorsForOrg("org_pilot_acme");
  assert.strictEqual(connectors.length, 3, "Expected 3 default connectors");

  const zatca = connectors.find((c) => c.type === "zatca_einvoicing");
  const erp = connectors.find((c) => c.type === "erp_integration");
  const dw = connectors.find((c) => c.type === "data_warehouse");

  assert(zatca, "ZATCA connector must exist");
  assert(erp, "ERP gateway connector must exist");
  assert(dw, "Governed data warehouse connector must exist");
});

await runAsyncTest("ZATCA connector passes simulated cryptographic handshake", async () => {
  const health = await checkConnectorHealth("conn_zatca_fatoora");
  assert.strictEqual(health.status, "healthy");
  assert(health.latencyMs > 0, "Latency must be positive");
  assert.strictEqual(health.checks.networkReachable, true);
  assert.strictEqual(health.checks.tlsValid, true);
  assert.strictEqual(health.checks.credentialsAuthenticated, true);
  assert(health.handshakeHash.length === 64, "Expected SHA-256 64-char hex hash");
});

await runAsyncTest("ERP gateway connector validates bounded permissions", async () => {
  const erp = getConnectorById("conn_erp_core");
  assert(erp, "ERP connector must exist");
  assert(erp.permissions.includes("po:read"));
  assert(erp.permissions.includes("po:approve_bounded"));

  const health = await checkConnectorHealth("conn_erp_core");
  assert.strictEqual(health.status, "healthy");
  assert.strictEqual(health.checks.permissionsBounded, true);
});

await runAsyncTest("Disconnected state returned for non-existent connector", async () => {
  const health = await checkConnectorHealth("conn_unknown_random");
  assert.strictEqual(health.status, "disconnected");
  assert.strictEqual(health.checks.networkReachable, false);
});

// --- 3. Feature Flags & Guardrails Overrides ---
console.log("\n--- 3. Feature Flags & Safety Guardrail Overrides ---");

runTest("Feature flags default to strict human-in-the-loop and PII redaction", () => {
  const flags = getFeatureFlagsForOrg("org_pilot_acme");
  assert.strictEqual(flags.enableHumanInTheLoopGates, true);
  assert.strictEqual(flags.enablePiiAutoRedaction, true);
  assert.strictEqual(flags.enableZatcaComplianceAgent, true);
});

runTest("Security Exception thrown when attempting to disable Human-in-the-Loop", () => {
  assert.throws(() => {
    setOrgFeatureFlag("org_pilot_acme", "enableHumanInTheLoopGates", false);
  }, /Security Exception: Cannot disable foundational guardrail/);
});

runTest("Security Exception thrown when attempting to disable PII Auto-Redaction", () => {
  assert.throws(() => {
    setOrgFeatureFlag("org_pilot_acme", "enablePiiAutoRedaction", false);
  }, /Security Exception: Cannot disable foundational guardrail/);
});

runTest("Allows toggling non-critical operational flags", () => {
  const updated = setOrgFeatureFlag("org_pilot_acme", "enableExtendedTokenBudget", true);
  assert.strictEqual(updated.enableExtendedTokenBudget, true);
});

// --- 4. Quotas, Rate Limiting & Usage Metering ---
console.log("\n--- 4. Multi-Tenant Quotas & Usage Metering ---");

runTest("Calculates quota status and remaining budgets accurately", () => {
  const status = getOrgQuotaStatus("org_pilot_test_quota", {
    monthlyRuns: 10,
    hourlyTokens: 1000,
    maxConcurrency: 2,
  });

  assert.strictEqual(status.monthlyRunsLimit, 10);
  assert.strictEqual(status.monthlyRunsRemaining, 10);
  assert.strictEqual(status.isThrottled, false);
});

runTest("Enforces monthly run limit exhaustion", () => {
  const orgId = "org_quota_exhaustion_test";
  const limits = { monthlyRuns: 3, hourlyTokens: 50000, maxConcurrency: 5 };

  const r1 = checkAndConsumeRunQuota(orgId, limits);
  assert.strictEqual(r1.allowed, true);
  releaseConcurrentRun(orgId);

  const r2 = checkAndConsumeRunQuota(orgId, limits);
  assert.strictEqual(r2.allowed, true);
  releaseConcurrentRun(orgId);

  const r3 = checkAndConsumeRunQuota(orgId, limits);
  assert.strictEqual(r3.allowed, true);
  releaseConcurrentRun(orgId);

  const r4 = checkAndConsumeRunQuota(orgId, limits);
  assert.strictEqual(r4.allowed, false);
  assert(r4.reason?.includes("Monthly run quota exhausted"));
});

runTest("Enforces maximum concurrent active runs limit", () => {
  const orgId = "org_concurrency_test";
  const limits = { monthlyRuns: 100, hourlyTokens: 50000, maxConcurrency: 2 };

  const r1 = checkAndConsumeRunQuota(orgId, limits);
  assert.strictEqual(r1.allowed, true);

  const r2 = checkAndConsumeRunQuota(orgId, limits);
  assert.strictEqual(r2.allowed, true);

  const r3 = checkAndConsumeRunQuota(orgId, limits);
  assert.strictEqual(r3.allowed, false);
  assert(r3.reason?.includes("Maximum concurrent runs reached"));

  // Release one active run
  releaseConcurrentRun(orgId);
  const r4 = checkAndConsumeRunQuota(orgId, limits);
  assert.strictEqual(r4.allowed, true);
  releaseConcurrentRun(orgId);
  releaseConcurrentRun(orgId);
});

// --- 5. Full End-to-End Enterprise User Journey ---
console.log("\n--- 5. Full End-to-End Enterprise User Journey ---");

await runAsyncTest("Complete enterprise user journey: query -> contract -> tool -> approval -> receipt -> audit", async () => {
  const tenantId = "org_pilot_acme";
  const threadId = `th_e2e_${Date.now()}`;

  // 1. User submits compliance query
  const result = await runMultiAgentCoordinator({
    query: "تحقق من قواعد الفوترة الإلكترونية ZATCA واعتمد تصدير تقرير الامتثال لشركة أكمي",
    threadId,
    organizationId: tenantId,
  });

  // 2. Validate step 0 prompt guard
  assert.strictEqual(result.securityGuard?.safe, true);

  // 3. Validate step 1 contract
  assert.strictEqual(result.lookupResult.domain, "compliance");
  assert(result.executionContract.safetyBoundary.length > 0);

  // 4. Validate step 2 tool execution & evidence hash
  assert(result.lookupResult.findings.length > 0);
  assert.strictEqual(result.evidenceHash.length, 64);

  // 5. Validate step 3 approval gate requirement
  assert.strictEqual(result.approvalRequired, true);
  assert(result.approvalId, "Approval ID must be assigned");
  assert(result.idempotencyKey, "Idempotency key must be assigned");

  // 6. Supervisor resolves approval via API
  const approvalRes = await decideApproval({
    approvalId: result.approvalId,
    decision: "approved",
    actorId: "acme_finance_director",
    reason: "Approved via Phase 9 E2E Journey",
  });

  assert.strictEqual(approvalRes.approval.status, "approved");
  assert(approvalRes.actionResult?.receiptHash, "Receipt hash must be generated upon approval");
  assert.strictEqual(approvalRes.actionResult.receiptHash.length, 64);

  // 7. Check audit ledger contains tamper-proof history
  const auditEvents = getAuditEvents(tenantId);
  assert(auditEvents.length > 0);
  const hasApprovalGranted = auditEvents.some((e) => e.eventType === "approval_granted");
  assert(hasApprovalGranted, "Audit trail must record approval_granted event");

  // 8. Record tokens used
  recordTokenUsage(tenantId, result.estimatedTokens);
  const quota = getOrgQuotaStatus(tenantId);
  assert(quota.hourlyTokensConsumed >= result.estimatedTokens);
});

// --- 6. Safe Rollback Script Verification ---
console.log("\n--- 6. Safe Rollback Script Rehearsal ---");

runTest("Rollback script exists, is executable, and passes dry-run rehearsal", () => {
  const output = execSync("bash scripts/rollback-plan.sh --dry-run", {
    encoding: "utf-8",
    cwd: process.cwd(),
  });
  assert(output.includes("AGENTNEXOS SAFE ROLLBACK REHEARSAL"));
  assert(output.includes("Rollback rehearsal passed successfully"));
});

console.log("\n=======================================================");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}
