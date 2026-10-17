# Agentnexos — Agent Instructions (updated 2026-10-16)

These are repository-specific instructions for Codex and other coding agents, **not** an OpenAI system prompt. The owner's current task and explicit recent decisions take priority over historical plans, while security requirements always apply.

## Mandatory Production Engineering strategy

The owner adopted [AGYNEXA Production Engineering](docs/upgrade/PRODUCTION-ENGINEERING.md) on 16 October 2026 as the binding execution reference, with the complete [master specification](docs/upgrade/AGYNEXA-CODEX-MASTER-UPGRADE-PLAN-AR-EN.md) and one [execution status ledger](docs/upgrade/EXECUTION-STATUS.md). This explicitly adopted plan is **not** an optional historical document.

Follow the M0–M8 dependencies and M9 for each authorized production release. Read the governing document and current ledger, then only the source sections relevant to the task; do not ingest the full master plan on every turn. Reuse established baseline evidence and completed work. Update the ledger with actual progress, blockers, evidence and rollback; never mark planned capabilities as implemented.

The owner's production-deployment-only test policy and bounded context/retry rules below remain mandatory. Stage-specific test instructions in the master plan apply only within an authorized production-release process. Integrating the plan does not itself authorize executing its quoted task prompt, deploying, purchasing services, sending email, modifying production data/access, or activating customer integrations. Preserve the approved bilingual copy and distinguish publication conditions from visitor-facing text.

## Product and current decisions

AGYNEXA designs enterprise agentic AI systems for companies and institutions worldwide. English is the default at clean public URLs; Arabic is selectable through the header and the `agynexa_locale` cookie, without visible language prefixes. Do not geographically restrict the product. Keep designed enterprise capabilities distinct from the currently bounded public assistant; never present a design demo as a working customer integration.

Current owner-approved visual direction (17 October 2026): matte **#050505** background, **#0b0b0b** marketing cards, **#ebebeb** text, restrained **#10b981** accents/focus; preserve neutral `--primary`, bilingual copy, Radix/shadcn behavior, and fail-closed APIs. Use Almarai for Arabic, a full-width header, a larger desktop wordmark and integrated original infrastructure imagery with absolutely no people. Leadership card is Adham Younes / أدهم يونس, CEO / الرئيس التنفيذي, adham@agynexa.si only. Do not reintroduce rejected hero calls to action or long founder biographies. Current repair/release evidence: `docs/verification/green-reference-repair/repair-release.md`, `docs/verification/green-reference/design-audit.md`, and `design-qa.md`. Read only the evidence relevant to the task, not every design report.

Older plans, handoffs and audits in `docs/` are **historical references**, not mandatory startup reading or permission to undo the latest approved design. In particular, do not re-open disabled `/api/chat`, `/api/approvals`, or `/api/telemetry` routes without the actual authentication, persistence, permissions and safety requirements. `/api/agentnexos` is a bounded, read-only design demo. Current provider routing has three roles using two model IDs; credentials do not imply three distinct models. Report final production verification as evidence rather than inferring model quality or capability from configuration.

## Owner operating rules — mandatory, 16 October 2026

- Current release instruction: each appropriately sized implementation package ends in an authorized production deployment, followed by exactly one scoped verification run against production. Do not run tests locally, on Preview or in staging for this package; deployment compilation is required to ship.

- Run tests only as part of an explicitly authorized production deployment. No routine tests after edits, for Preview, or because an existing deployment was mentioned.
- Keep responses balanced: state the result, essential evidence and any real blocker concisely. Avoid long narration, repeated explanations and unnecessary reports.
- Do not repeat completed tasks, successful checks, documentation reads or tool calls unless a relevant change or concrete unresolved issue requires it. Reuse established results.
- No open-ended loops. After a failed action, diagnose once and make at most one justified retry; if still blocked, report the blocker and continue independent authorized work without cycling through tools.
- Minimize context and tool use: read only needed excerpts, filter output before returning it, and avoid full DOM/log dumps, broad audits, redundant screenshots, unsolicited tool installation and extra agents.
- Prioritize delivering the requested project development. Do not replace implementation with unsolicited testing, analysis or documentation. Documentation-only requests require a bounded edit and brief confirmation, with no tests or deployment.
- These owner rules override broader testing or audit recommendations in skills and older project documents within the owner's authorized scope.

## Work scope and context budget

1. Clarify the requested change from the owner's latest instruction; make the smallest complete change. Preserve unrelated behavior and the current visual identity.
2. Inspect `AGENTS.md`, the directly relevant source files, and **only the documentation needed for the task**. Do not repeatedly ingest all handoffs, old phases, the entire repository or the whole `node_modules` tree.
3. Read framework docs only for an affected API or when uncertain. For Next.js changes, consult the relevant version-specific guide under `node_modules/next/dist/docs/`.
4. Reuse existing patterns; do not install tools, add abstractions, or spawn subagents for work a single agent can handle. Delegate only independent, bounded tasks with an explicit deliverable.
5. Preserve Arabic/English meaning, RTL/LTR, secrets, permissions, and approved design. Never invent implemented features, customers, metrics, integration success or test outcomes.

## Verification policy — owner decision, 16 October 2026

**Run tests only as part of each production deployment.** This owner decision supersedes earlier instructions to test after edits, before merging, during Preview deployments, or as routine verification.

- Outside a production deployment, do not run unit/integration/end-to-end tests, typecheck, lint, i18n checks, builds for verification, accessibility scans, browser interaction tests, or automated audit/screenshot sweeps. Do not install testing tools or invoke extra agents/integrations for these checks.
- Routine code, content, design, documentation and instruction changes: inspect only the relevant source and diff. Do not start a testing cycle.
- A requested visual/content/design review means inspecting the requested rendered screens and capturing only necessary evidence. It does not authorize functional tests, API probes, automated scans or a site-wide audit.
- Owner clarification (16 October 2026): the review requested for production `https://agynexa.si/`, deployment `CjmYmWZyh7Kny7tAUBRRveCaBvA6` (`compute-the-platform-to-build-m72v34iqo-adhamlouxors-projects.vercel.app`), source `main` at `d285e1629a37086631905bb9b28f9214c11e511b`, is **visual content and design review only**. Deployment identifiers and Ready status were supplied by the owner; do not claim independent deployment verification. Supplying an existing production deployment is not a request for another deployment or a new functional test cycle.
- For each authorized production deployment, run the relevant release checks once as part of that deployment, then verify only the changed production routes/flows and record the deployed commit SHA. Keep checks bounded to the change; do not repeat successful checks without a relevant change.
- This policy does not authorize deploying. Documentation/instructions-only changes require no tests and no deployment.
- Preserve security/privacy safeguards in implementation. If a concern cannot be resolved by source/diff inspection outside a production deployment, report it without autonomously launching tests.
- Keep tool output and evidence small. Do not dump full DOMs/logs, repeat screenshot sweeps or create lengthy diagnostic reports unless expressly requested.

**GitHub Actions failures before tests start (do not waste tokens):**
- The owner uses GitHub Free; this repository is **public** and the CI job selects the standard `ubuntu-latest` runner. Standard GitHub-hosted runners are free for public repositories. Do not presume a paid subscription is required or advise paying without evidence.
- If a GitHub Actions run fails within seconds with **zero job steps** and **no assigned runner**, this is **not evidence of a failing application test**. Inspect workflow syntax/metadata and the run summary **once**; possible causes include account/billing restrictions, disabled Actions, runner availability, or GitHub service issues.
- When no tests were executed, **do not edit source, tests, dependencies, or CI repeatedly to 'fix' the failure**, and do not rerun identical workflows. Record the failed run URL, runner/step evidence, and the appropriate account/settings or GitHub Support follow-up. Account billing settings require owner action.
- If a runner actually starts and a named test step fails, address that specific test under the production-deployment-only policy. Never claim CI is green if GitHub has not run the checks.

**Hard stop against loops:**
- Never rerun an unchanged failing test or command without a concrete diagnosis, relevant code/config change, or evidence of a transient issue.
- If the same failure recurs after one reasoned fix-and-retry, **stop**, report the cause/evidence and what is blocked; request direction rather than launching an open-ended repair loop.
- Do not repeat successful checks without a relevant intervening change. Never run autonomous exhaustive code reviews, repetitive test sweeps or parallel subagent verification unless the owner expressly requests them.
- If a tool reaches an unclear or expensive state, stop and summarize progress instead of consuming the remaining budget.
- Prefer small, filtered tool responses; avoid dumping entire repositories, logs and documents into context.

## Safety, review and publication

- Never expose secrets, write to external systems outside approved scope, or execute sensitive operations without appropriately scoped permissions, idempotency, audit trail and human approval.
- If a missing owner decision would materially change scope or safety, mark `BLOCKED: requires owner decision` for that portion; finish independent safe work.
- Use normal branch → PR → permitted merge-to-`main` workflow. Production is `https://agynexa.si/` via Vercel project `compute-the-platform-to-build` (the existing `compute-the-platform-to-build-six-fawn.vercel.app` remains a deployment alias); do **not** claim deployment from a local build or Preview.
- When application code is deployed, verify the changed routes/flows in production, bilingual where relevant, and record the commit SHA. **Instructions-only edits do not warrant an application deployment.**
- End with files changed, checks actually run/skipped, outstanding risks, and concrete result. Do not repeatedly reread all documentation or restart passed tests while writing the report.

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
