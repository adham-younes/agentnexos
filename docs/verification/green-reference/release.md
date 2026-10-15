# Green reference release

Owner-authorized scope, 15 October 2026 (Africa/Cairo): implement the five supplied visual references across the existing bilingual platform, agent workspace and login gateway; retain actual content and runtime boundaries; deliver through a normal pull request and verify production.

## Implementation

- Michroma geometric Latin headings, Inter body and Tajawal Arabic, self-hosted by Next Font. These are close available matches; the source screenshot's proprietary font identity is not asserted.
- Centered ribbon hero, light/heavy heading hierarchy, green navigation tray, dark oblique capability cards, raised surfaces, reference-led footer and original generated neural artwork. Existing bilingual source copy remains unchanged.
- Echo-inspired workspace: quiet green illumination, narrow rail, centered welcome/suggestions and glowing composer. Existing transport, readiness, phase updates, cancellation, retry, downloads and copy remain intact.
- Localized Nexora-inspired login with original architectural imagery, inset labeled fields, password visibility, real Supabase password sign-in only when configured, honest unavailable/rejected-account states and the public assistant fallback. No social-provider or enterprise-access claims.
- Fixed the existing reveal observer's proportional threshold, which could leave tall sections hidden.
- Three original WebP assets total approximately 664 KB. No new dependency or lockfile change.

## Validation status before PR review

- Frozen installation repeated with Node 22.23.3 / pnpm 11.19.0.
- Typecheck, i18n, 50/50 workflow/policy/brief tests and production Turbopack build passed.
- Lint: zero errors, five existing warnings; no new warnings.
- Production dependency audit: one existing moderate `sprintf-js` denial-of-service advisory. The audit recommends `>=1.1.4`, but `pnpm view sprintf-js@1.1.4` returned no published matching version. No suppression or speculative override was introduced.
- Initial reference-specific verification: 18 pages and 12 interactions passed. A first test-harness locator matched Next's hidden route announcer as well as the login alert; the locator was scoped to the actual form and rerun successfully. Minor visual refinements were then rebuilt; final checks are recorded below when complete.
- Full browser regression and final screenshots: running at the time this draft was prepared. Do not interpret this line as a passed check.
- Live authentication and live model calls: not verified locally; no production secrets copied.

## Hosted CI limitation

The main baseline's GitHub Actions run `38662692161` failed without starting any steps. Check run `116187413808` explicitly reports: “The job was not started because your account is locked due to a billing issue.” This is not a successful CI run. The repository's protection configuration cannot be read with the current integration (403); ordinary PR merge must enforce whatever protections GitHub applies. No admin merge or protection change is allowed.

## Environment setup

The current cloud instance was installed and validated. `install_script`, `start_skill` and font/browser download domains were saved in the environment draft. Environment publication is a separate user action in environment settings; this does not publish the website.

## Rollback

Use a normal revert PR for the release merge commit, wait for Vercel Production READY on the reverted main commit, then verify `/ar`, `/en`, `/ar/agentnexos` and legacy API closure. No production database migration belongs to this release.

## Final repository and deployment evidence

Pending final browser/visual checks, normal PR review/merge and a matching-commit production deployment. No production publication is claimed at this draft stage.
