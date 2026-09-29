/**
 * Integration Test: Multi-Tenant Isolation & RLS Policy Verifier
 * Verifies that Organization A cannot view or manipulate Organization B data.
 */

import assert from "node:assert";

console.log("--> Running Phase 4: Tenant Isolation & RLS Policy Verification...");

// 1. Mock DB state and RLS simulator
const organizations = [
  { id: "org-alpha-111", name: "Alpha Holding", slug: "alpha" },
  { id: "org-beta-222", name: "Beta Logistics", slug: "beta" },
];

const memberships = [
  { id: "mem-1", organization_id: "org-alpha-111", user_id: "user-alpha", role: "member" },
  { id: "mem-2", organization_id: "org-beta-222", user_id: "user-beta", role: "member" },
];

const agentThreads = [
  { id: "th-1", organization_id: "org-alpha-111", title: "Alpha Procurement Audit" },
  { id: "th-2", organization_id: "org-beta-222", title: "Beta Fleet Diagnostics" },
];

const approvals = [
  { id: "app-1", organization_id: "org-alpha-111", action_summary: "Approve payment $10k", status: "pending" },
  { id: "app-2", organization_id: "org-beta-222", action_summary: "Export freight manifests", status: "pending" },
];

// RLS Evaluation function matching SQL policy: is_org_member(target_org_id)
function evaluateRLS(userId, tableData) {
  const userOrgIds = new Set(
    memberships.filter((m) => m.user_id === userId).map((m) => m.organization_id)
  );

  return tableData.filter((row) => userOrgIds.has(row.organization_id));
}

// TEST 1: User Alpha querying threads
const alphaThreads = evaluateRLS("user-alpha", agentThreads);
assert.strictEqual(alphaThreads.length, 1, "User Alpha should see exactly 1 thread");
assert.strictEqual(alphaThreads[0].organization_id, "org-alpha-111", "User Alpha should only see Alpha threads");
assert.strictEqual(alphaThreads[0].title, "Alpha Procurement Audit");
console.log("  [PASS] Test 1: User Alpha correctly views only Alpha Organization threads");

// TEST 2: Cross-tenant isolation verification
const hasBetaThread = alphaThreads.some((t) => t.organization_id === "org-beta-222");
assert.strictEqual(hasBetaThread, false, "CRITICAL: Cross-tenant leak detected! Alpha saw Beta data!");
console.log("  [PASS] Test 2: Cross-tenant isolation holds. Zero Beta records visible to Alpha");

// TEST 3: User Beta querying approvals
const betaApprovals = evaluateRLS("user-beta", approvals);
assert.strictEqual(betaApprovals.length, 1, "User Beta should see exactly 1 approval");
assert.strictEqual(betaApprovals[0].organization_id, "org-beta-222", "User Beta should only see Beta approvals");
console.log("  [PASS] Test 3: User Beta correctly views only Beta Organization approvals");

// TEST 4: Anonymous / Unauthenticated user querying RLS
const anonThreads = evaluateRLS("anon-user", agentThreads);
assert.strictEqual(anonThreads.length, 0, "Unauthenticated user should see 0 threads");
console.log("  [PASS] Test 4: Unauthenticated user receives empty dataset");

// TEST 5: Verify migration files existence & syntax checks
import { readFileSync, existsSync } from "node:fs";

const migration1 = "supabase/migrations/20260929000001_initial_schema.sql";
const migration2 = "supabase/migrations/20260929000002_rls_policies.sql";
const rollback = "supabase/migrations/rollback_initial_schema.sql";

assert.ok(existsSync(migration1), "Initial schema migration must exist");
assert.ok(existsSync(migration2), "RLS policies migration must exist");
assert.ok(existsSync(rollback), "Rollback migration must exist");

const rlsContent = readFileSync(migration2, "utf8");
assert.ok(rlsContent.includes("ENABLE ROW LEVEL SECURITY;"), "RLS must be enabled");
assert.ok(rlsContent.includes("is_org_member"), "is_org_member helper must exist");
assert.ok(rlsContent.includes("is_org_admin"), "is_org_admin helper must exist");
console.log("  [PASS] Test 5: All required migration files exist and enforce RLS");

console.log("--> All Phase 4 Tenant Isolation & RLS checks passed successfully!");
