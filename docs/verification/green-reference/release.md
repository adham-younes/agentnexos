# Green reference release

Owner-authorized scope, 15 October 2026 (Africa/Cairo): implement the five supplied visual references across the existing bilingual platform, agent workspace and login gateway; retain actual content and runtime boundaries; deliver through a normal pull request and verify production.

## Implementation

- Michroma geometric Latin headings, Inter body and Tajawal Arabic, self-hosted by Next Font. These are close available matches; the source screenshot's proprietary font identity is not asserted.
- Centered ribbon hero, light/heavy heading hierarchy, green navigation tray, dark oblique capability cards, raised surfaces, reference-led footer and original generated neural artwork. Existing bilingual source copy remains unchanged.
- Echo-inspired workspace: quiet green illumination, narrow rail, centered welcome/suggestions and glowing composer. Existing transport, readiness, phase updates, cancellation, retry, downloads and copy remain intact.
- Localized Nexora-inspired login with original architectural imagery, inset labeled fields, password visibility, real Supabase password sign-in only when configured, honest unavailable/rejected-account states and the public assistant fallback. No social-provider or enterprise-access claims.
- Fixed the existing reveal observer's proportional threshold, which could leave tall sections hidden.
- Three original WebP assets total approximately 664 KB. No new dependency or lockfile change.

## Completed local and preview validation

- Frozen installation repeated with Node 22.23.3 / pnpm 11.19.0.
- Typecheck, i18n, 50/50 workflow/policy/brief tests and production Turbopack build passed.
- Lint: zero errors, five existing warnings; no new warnings.
- Production dependency audit: one existing moderate `sprintf-js` denial-of-service advisory. The audit recommends `>=1.1.4`, but `pnpm view sprintf-js@1.1.4` returned no published matching version. No suppression or speculative override was introduced.
- Final reference-specific verification: 18 pages and 12 interactions passed on the final local production build, and the same 18/12 passed on Vercel Preview. No horizontal overflow or JavaScript/hydration exceptions in those cases. Evidence: `reference-validation.json` and the comparison boards in this directory.
- Full regression: 108 page cases completed, with 107 passing and one Arabic mobile homepage reveal timing failure; both complete interaction journeys passed. A standalone reproduction found no hidden content after rendering settled. The runner's rapid scrolling could outrun rendering under load, so it now waits for two actual animation frames per scroll step while retaining all assertions. The six homepage language/width cases and both interaction journeys were then rerun successfully, with zero failures. This is combined evidence from the complete run and affected-scope rerun, not a claim that the initial 108-case run passed.
- The focused runner initially treated routes outside the selected test subset as unknown. The complete route catalog is now independent of the selected subset; link validation remains enabled. The final six-case rerun passed after that harness correction.
- Final visual QA passed; desktop/phone/medium layouts, font hierarchy, actual imagery, controls and focused source/implementation comparisons are documented in root `design-qa.md`.
- Live authentication and live model calls: not verified locally; no production secrets copied.

## Hosted CI limitation

The main baseline's GitHub Actions run `38662692161` failed without starting any steps. Check run `116187413808` explicitly reports: “The job was not started because your account is locked due to a billing issue.” This is not a successful CI run. The repository's protection configuration cannot be read with the current integration (403); ordinary PR merge must enforce whatever protections GitHub applies. No admin merge or protection change is allowed.

## Environment setup

The current cloud instance was installed and validated. `install_script`, `start_skill` and font/browser download domains were saved in the environment draft. Environment publication is a separate user action in environment settings; this does not publish the website.

## Rollback

Use a normal revert PR for the release merge commit, wait for Vercel Production READY on the reverted main commit, then verify `/ar`, `/en`, `/ar/agentnexos` and legacy API closure. No production database migration belongs to this release.

## Final repository and deployment evidence

Implementation commit: `73639c6b7e9f7928c9c84f5319f0c6bcd4dbd54f`. Its Vercel Preview deployment `7091011919` completed successfully and the public preview passed the 18-page/12-interaction reference checks: https://compute-the-platform-to-build-g2dcfnom2-adhamlouxors-projects.vercel.app . Later verification/documentation changes do not change application rendering or dependencies.

The final matching-head preview, normal merge commit, Vercel production deployment, timestamps and post-publication functional verification are maintained in [PR #50](https://github.com/adham-younes/agentnexos/pull/50). Read that live record for the actual publication outcome; this file does not infer publication from a successful local build or preview. The production origin is https://compute-the-platform-to-build-six-fawn.vercel.app/ .

Before this change, production readiness returned `ready:true`, limits 1000 per connection / 10000 global / 24 hours. Post-publication readiness and legacy API status are checked independently and recorded in the PR. No live model answer or real account login is claimed without a specific corresponding test.

## External blocker at the final push

The implementation commit and draft PR #50 were successfully pushed, and their Vercel Preview passed the checks above. During the subsequent verification/documentation push, the existing GitHub authentication stopped working: GitHub API returned `401 Bad credentials`; ordinary Git push/read could no longer obtain accepted authentication. Read-only Git was also tried without token variables to check the existing native/proxy route, and failed. The managed environment remains connected, with no separately configured outbound identity available. No token value was inspected, exported or requested in chat.

The final verification changes are committed locally on `redesign/green-reference-2026-10-15`. They still need a normal push, matching-head preview check, PR ready/ordinary merge, and matching-commit production verification after GitHub authorization is refreshed. The PR is still a draft and no new production publication is claimed. GitHub Actions billing is a separate pre-existing problem; refreshing authentication does not resolve that billing lock.
