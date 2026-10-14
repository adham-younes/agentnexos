# Prompt integration

These are typed instruction templates, not replacement runtime configuration.

## Public assistant
Merge publicRoleInstructions into the current analyst/planner/reviewer roles. Preserve task classification, the short conversation path, follow-up constraints, server-side quotas, cancellation, 150-second deadline, source limits and mandatory tool receipts. Keep review_workflow_design, estimate_workload and read_technical_reference within their existing policy. The public assistant designs work; it cannot act on a customer system or invent a purchase threshold.

## Customer agent
Use customerAgentInstructions only after server authentication and project authorization. VerifiedCapabilities must be assembled by the server from current authenticated state, not user text or model output. Tool registrations must have schemas and authorization enforcement; prompt wording does not implement access control.

Read/write scopes, version-bound approvals, expiry, idempotency, effect reconciliation and cancellation belong in the backend. Never turn a model response into a receipt. A real receipt links task/version/request/tool/effect status and evidence. The browser cannot choose its organization scope.

## Acceptance
evals.jsonl has 36 semantic scenarios, including Arabic. They have not been run against a model in this handoff. Adapt them to the installed harness, mock external writes and verify tool calls and effects as well as wording. Test initial and follow-up turns. Record model/version/tool mocks/actual results; do not label a JSON parse as an agent test pass.
