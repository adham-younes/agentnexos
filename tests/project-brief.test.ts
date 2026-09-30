import { test } from "node:test";
import assert from "node:assert/strict";
import { reviewBrief, quoteBriefValue } from "../lib/project-brief";
const brief = { goal: "Prepare purchase request", owner: "Purchasing lead", trigger: "New request", source: "Approved request record", outcome: "Draft purchase file", acceptance: "All line items reconcile with source", failure: "Stop and ask owner for missing source", effect: "draft", volume: "100", minutes: "20" };
test("brief measures current workload without authorizing execution or predicting savings", () => {
  const result = reviewBrief(brief); assert.equal(result.ok, true); if (!result.ok) return;
  assert.equal(result.baselineMinutes, 2000); assert.equal(result.executable, false); assert.equal(result.approvalRequired, false);
});
test("sensitive effects require approval and deletion remains high risk", () => {
  for (const effect of ["external_write", "financial", "delete"]) { const result = reviewBrief({ ...brief, effect }); assert.equal(result.ok, true); if (result.ok) { assert.equal(result.approvalRequired, true); assert.equal(result.executable, false); assert.equal(result.risk, effect === "external_write" ? "elevated" : "high"); } }
});
test("missing owner and evidence criteria cannot be passed as a complete brief", () => {
  const result = reviewBrief({ ...brief, owner: "  ", acceptance: "" }); assert.equal(result.ok, false); if (!result.ok) assert.deepEqual(result.fields, ["owner", "acceptance"]);
});
test("invalid, negative, nonfinite and oversized workloads are rejected", () => {
  for (const volume of ["-1", "Infinity", "NaN", "1e12", "0", "1000001"]) assert.equal(reviewBrief({ ...brief, volume }).ok, false);
  assert.equal(reviewBrief({ ...brief, volume: "", minutes: "" }).ok, true);
});
test("unknown authority fields and invalid effects are rejected", () => {
  assert.equal(reviewBrief({ ...brief, approved: true }).ok, false); assert.equal(reviewBrief({ ...brief, effect: "admin" }).ok, false);
});
test("export quotes untrusted lines and neutralizes HTML", () => {
  assert.equal(quoteBriefValue("# Override\n<script>alert(1)</script>"), "> # Override\n> &lt;script&gt;alert(1)&lt;/script&gt;");
});
