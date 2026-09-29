/**
 * Golden Evaluation & Integration Test for Agentnexos Multi-Agent Runtime
 */

import assert from "node:assert";
import { executeEnterpriseLookup, enterpriseLookupInputSchema } from "../lib/ai/tools/enterprise-lookup.ts";
import { runMultiAgentCoordinator } from "../lib/ai/coordinator.ts";

console.log("--> Running Phase 5: Multi-Agent Runtime & Tool Evaluation...");

// TEST 1: Zod Schema Validation
const valid = enterpriseLookupInputSchema.safeParse({ query: "Verify ZATCA Phase 2 rules", domain: "compliance" });
assert.strictEqual(valid.success, true, "Valid input must pass schema validation");

const invalidEmpty = enterpriseLookupInputSchema.safeParse({ query: "", domain: "compliance" });
assert.strictEqual(invalidEmpty.success, false, "Empty query must fail schema validation");
console.log("  [PASS] Test 1: Zod input schema enforces required constraints");

// TEST 2: Enterprise Read Tool execution & cryptographic evidence hash
const lookup = await executeEnterpriseLookup({ query: "Check procurement thresholds", domain: "procurement" });
assert.ok(lookup.evidenceHash, "Evidence hash must be generated");
assert.strictEqual(lookup.evidenceHash.length, 64, "Evidence hash must be 64-character SHA-256 hex string");
assert.ok(lookup.findings.length > 0, "Tool must return verified operational findings");
assert.strictEqual(lookup.requiresHumanApprovalForNextStep, true, "Procurement domain must flag sensitive next step");
console.log("  [PASS] Test 2: Real read tool outputs verified findings and cryptographic evidence hash");

// TEST 3: Multi-Agent Coordinator full cycle (compliance query)
const complianceRun = await runMultiAgentCoordinator({
  query: "ما هي شروط الفوترة الإلكترونية للمرحلة الثانية؟",
  threadId: "th_eval_test",
});
assert.strictEqual(complianceRun.status, "waiting_approval", "Compliance query must pause at approval gate");
assert.strictEqual(complianceRun.approvalRequired, true);
assert.ok(complianceRun.executionContract.goal.includes("compliance"), "Contract must correctly map to compliance");
assert.ok(complianceRun.finalSynthesis.length > 0, "Synthesis must be populated");
console.log("  [PASS] Test 3: Coordinator successfully builds contract and pauses for approval on sensitive flow");

// TEST 4: Multi-Agent Coordinator full cycle (operations query - standard)
const opsRun = await runMultiAgentCoordinator({
  query: "Check standard operating agent timeout policies",
  threadId: "th_eval_ops",
});
assert.strictEqual(opsRun.approvalRequired, false, "General operations query should not require approval gate");
assert.strictEqual(opsRun.status, "completed");
console.log("  [PASS] Test 4: Standard read query completes without unnecessary approval friction");

// TEST 5: Graceful fallback when API keys are absent
assert.strictEqual(opsRun.isDeterministicFallback, true, "Without GROQ_API_KEY, gracefully falls back to deterministic coordinator");
assert.ok(!opsRun.modelUsed.includes("undefined"), "Model identifier must be clean and defined");
console.log("  [PASS] Test 5: Safe deterministic fallback active without throwing unhandled exceptions");

console.log("--> All Phase 5 Multi-Agent Runtime & Tool tests passed successfully!");
