# Cyber Serif redesign — release record

Date: 13 October 2026 (Africa/Cairo). Owner selected https://superdesign.dev/library/cyber-serif-style and explicitly requested a full adaptation, richer human content, component/database inspection and production publication. This authorization supersedes earlier visual-preservation rules; it does not reopen enterprise actions.

## Baseline and scope

Fresh isolated checkout of main `b8e5a24378ea993e5539efc22e2ecdece34ee726`; original production `dpl_BYkMPcDLQzYWo3zoZSmEfmnb4B8R`. Branch `redesign/cyber-serif-production`. Original workspace path was unavailable. Existing work was not reset or overwritten.

The homepage now tells a coherent story: concrete outcome and two real actions, illustrative purchase review, workflow design capabilities, keyboard-operable use cases, three-step approach, honest availability table, data/operating boundaries, FAQ, and next step. Arabic and English content are equivalent, with no invented clients, numbers, prices or integration claims. Historical landing components/assets remain in source, but homepage composition intentionally changes under the selected redesign.

Approved typography: Newsreader English display (including italic), Inter body, Space Grotesk labels, IBM Plex Sans Arabic for Arabic joining and readability. Black #050505, off-white #EBEBEB, limited emerald #10b981; glass cards, cursor spotlights, hover shimmer borders, weighted easing and reduced-motion alternatives. Removed the homepage's continuous video/canvas work in favor of an informative illustrative workflow. Secondary pages and assistant inherit the palette/fonts and accent treatments.

Usability: language links preserve query/hash; navigation initializes scroll state; local brief accepts Arabic/Persian digits and the Arabic decimal mark while rejecting ambiguous/invalid numbers. Numeric behavior has additional regression tests. The public assistant stays read-and-plan only; brief answers remain local; legacy enterprise endpoints stay disabled.

## Design and inspection

Superdesign existing project reused; source context init captured all shared primitives/layouts, route dependencies and tokens. Current selected draft version 2: https://p.superdesign.dev/draft/e9172d2f-2b3e-4537-9631-8bcbd1125ad5 . Canvas: https://superdesign.dev/teams/e6c9d27d-54d2-48ee-a5c3-ed32d202f75c/projects/21c27e57-9860-4ad3-8ab1-a8b4cb624110 . Gemini 3.1 Pro selected from the authenticated account's live model list; baseline reproduction then one in-place adaptation, no exploratory branches.

Source inventory: 8 page entry files produce 11 public paths per locale; all 66 page/language/width cases checked. Shared Radix/shadcn primitives and page dependency trees are recorded in `.superdesign/init/`; this inventory is not a claim of manual security auditing every line of every dependency. Visually inspected the actual render at mobile/desktop and intermediate width, including content below the first viewport and representative public/assistant pages. Evidence screenshots remain local in output/playwright and output/release-verification/screenshots.

## Verification

- Baseline: typecheck, i18n, 36 tests pass. 66 page cases pass; English skip-link check was racy and now waits for actual focus rather than asserting immediately. Baseline report retains that failure.
- Final source gates: typecheck, i18n, 38 tests, build pass; lint has no errors and 18 pre-existing warnings. New home/content/localized-number files have no lint errors.
- First redesigned local build: 66 page cases and 2 interaction journeys pass. Final security-patched build verification recorded separately in local-final-report.json.
- Browser gates check HTTP, Arabic/English/RTL/LTR, fonts, landmarks, internal routes, broken images, overflow, browser exceptions, actual home actions/disclosures, tabs, FAQ, focus-trapped mobile menu, skip link, reduced motion, brief validation/download/reset/local-only boundary, and query/hash-preserving language switching.
- Production runtime before change: ready:true with actual limits (1000 per connection, 10000 global / 24 hours) and one successful fictional-data Arabic response. Local environment deliberately has FEATURE_DISABLED, with no copied model/database secrets.
- Dependency patch: Next/eslint-config-next 16.3.8; source-map-js 1.2.2. Audit fell from 8 advisories (2 high) to 1 moderate with no published fix; see security-review.md. Audit still exits nonzero and is not suppressed.

## Limits and publication

Supabase connector cannot access the actual target `ruereqpvykwnakcnmxha`; full live database audit is incomplete. Schema/source review and public readiness are recorded in database-audit.md; unrelated projects untouched, no migrations applied. `test:rls` is a historical simulator, not live tenant-isolation evidence, and is not cited as such.

Preview, hosted CI and production are distinct gates. Publication status is updated after a matching-commit preview check and ordinary PR merge; no production success is claimed at this pre-publication point. Production source must remain main, and the official Arabic/English URL and bounded assistant readiness must be rechecked after READY. No admin merge, branch-protection change or audit threshold relaxation is authorized by this report.

Rollback: ordinary PR revert of this release or restore the recorded previous deployment; do not reset user work. Prefer preserving the dependency security patch if reverting only the visual direction.
