# Agentnexos — Agent Instructions (updated 2026-10-15)

These are repository-specific instructions for Codex and other coding agents, **not** an OpenAI system prompt. The owner's current task and explicit recent decisions take priority over historical plans, while security requirements always apply.

## Product and current decisions

Agentnexos is an Arabic-first enterprise agentic AI platform for Egypt and the GCC, integrating business tools and workflows with scoped permissions, human approval for sensitive actions, auditability, and verifiable results. Do not present a design demo as a working production integration.

Current owner-approved visual direction (15 October 2026): matte **#050505** background, **#0b0b0b** marketing cards, **#ebebeb** text, restrained **#10b981** accents/focus; preserve neutral `--primary`, bilingual copy, Radix/shadcn behavior, and fail-closed APIs. Current repair/release evidence: `docs/verification/green-reference-repair/repair-release.md`, `docs/verification/green-reference/design-audit.md`, and `design-qa.md`. Read only the evidence relevant to the task, not every design report.

Older plans, handoffs and audits in `docs/` are **historical references**, not mandatory startup reading or permission to undo the latest approved design. In particular, do not re-open disabled `/api/chat`, `/api/approvals`, or `/api/telemetry` routes without the actual authentication, persistence, permissions and safety requirements. `/api/agentnexos` is a bounded, read-only design demo. Qwen remains Preview unless live verification proves otherwise.

## Work scope and context budget

1. Clarify the requested change from the owner's latest instruction; make the smallest complete change. Preserve unrelated behavior and the current visual identity.
2. Inspect `AGENTS.md`, the directly relevant source files, and **only the documentation needed for the task**. Do not repeatedly ingest all handoffs, old phases, the entire repository or the whole `node_modules` tree.
3. Read framework docs only for an affected API or when uncertain. For Next.js changes, consult the relevant version-specific guide under `node_modules/next/dist/docs/`.
4. Reuse existing patterns; do not install tools, add abstractions, or spawn subagents for work a single agent can handle. Delegate only independent, bounded tasks with an explicit deliverable.
5. Preserve Arabic/English meaning, RTL/LTR, secrets, permissions, and approved design. Never invent implemented features, customers, metrics, integration success or test outcomes.

## Proportional verification: no redundant test loops

**Do not run the entire test suite after every edit.** Choose verification by risk and the files actually changed:

- **Documentation, prompts or `AGENTS.md` only:** inspect the diff, links and wording. No `pnpm build`, typecheck, i18n suite, browser audit or deployment required.
- **Small component or isolated logic change:** run the narrow relevant test, lint or typecheck as applicable **after a meaningful edit batch**. Prefer focused commands/results over a whole-project sweep.
- **Translation or RTL-related changes:** run `pnpm i18n:check` and inspect only affected Arabic/English states.
- **Significant UI/layout changes:** inspect affected screens in both languages, and check 390/768/1440px at the relevant milestone. Do not repeat full screenshot sweeps after every cosmetic edit.
- **Auth, data, API, permissions, external actions or migrations:** verify the changed behavior, relevant regression and fail-closed paths; never bypass safeguards or apply historical migrations blindly.
- **Before merging/releasing application-code changes:** after the implementation is stable, run `pnpm typecheck`, `pnpm i18n:check`, `pnpm build`, and pertinent tests **once as a final gate**. Fix actual failures and rerun only the affected check first; rerun the full gate only when a change could invalidate it. Never claim a check passed unless it ran successfully.

**GitHub Actions failures before tests start (do not waste tokens):**
- The owner uses GitHub Free; this repository is **public** and the CI job selects the standard `ubuntu-latest` runner. Standard GitHub-hosted runners are free for public repositories. Do not presume a paid subscription is required or advise paying without evidence.
- If a GitHub Actions run fails within seconds with **zero job steps** and **no assigned runner**, this is **not evidence of a failing application test**. Inspect workflow syntax/metadata and the run summary **once**; possible causes include account/billing restrictions, disabled Actions, runner availability, or GitHub service issues.
- When no tests were executed, **do not edit source, tests, dependencies, or CI repeatedly to 'fix' the failure**, and do not rerun identical workflows. Record the failed run URL, runner/step evidence, and the appropriate account/settings or GitHub Support follow-up. Account billing settings require owner action.
- If a runner actually starts and a named test step fails, address that specific test under the proportional verification rules. Never claim CI is green if GitHub has not run the checks.

**Hard stop against loops:**
- Never rerun an unchanged failing test or command without a concrete diagnosis, relevant code/config change, or evidence of a transient issue.
- If the same failure recurs after one reasoned fix-and-retry, **stop**, report the cause/evidence and what is blocked; request direction rather than launching an open-ended repair loop.
- Do not repeat successful checks without a relevant intervening change. Never run autonomous exhaustive code reviews, repetitive test sweeps or parallel subagent verification unless the owner expressly requests them.
- If a tool reaches an unclear or expensive state, stop and summarize progress instead of consuming the remaining budget.
- Prefer small, filtered tool responses; avoid dumping entire repositories, logs and documents into context.

## Safety, review and publication

- Never expose secrets, write to external systems outside approved scope, or execute sensitive operations without appropriately scoped permissions, idempotency, audit trail and human approval.
- If a missing owner decision would materially change scope or safety, mark `BLOCKED: requires owner decision` for that portion; finish independent safe work.
- Use normal branch → PR → permitted merge-to-`main` workflow. Production is `https://compute-the-platform-to-build-six-fawn.vercel.app/` via Vercel project `compute-the-platform-to-build`; do **not** claim deployment from a local build or Preview.
- When application code is deployed, verify the changed routes/flows in production, bilingual where relevant, and record the commit SHA. **Instructions-only edits do not warrant an application deployment.**
- End with files changed, checks actually run/skipped, outstanding risks, and concrete result. Do not repeatedly reread all documentation or restart passed tests while writing the report.

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
