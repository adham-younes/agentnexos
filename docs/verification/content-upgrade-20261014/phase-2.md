# Phase 2 — additive computational visuals

Baseline: production/main 8a91a674d59ae1fab9e50c8e39f971e2d988dd50, phase 1 gates complete. Scope: approved SVG/CSS and selected graph-4 only, inside platform knowledge/tools editorial containers. Existing hero WorkflowConsole, page composition, tokens/fonts/colors preserved. SVG labelled conceptual; image 1280x720, lazy, responsive with fixed dimensions. Reduced motion disables pulse animation. No new dependencies, DB, environment or public assistant changes.

Acceptance: source gates, exact asset hash; platform AR/EN at 390/768/1440, no overflow/broken images/browser exceptions, focus and reduced motion. Preview then ordinary merge, matching Production READY and live platform checks. Rollback: ordinary PR revert of this phase; no data changes.

Local gates pass: typecheck/i18n/build, affected lint; 6 platform language/width cases, no overflow/browser errors, original fonts and hero present, reduced-motion pulse disabled, lazy image dimensions and original asset SHA match. First verifier run had a fetch status accessor error after page checks; fixed the verifier, then reran successfully. No application workaround. See phase2-local-visual.json. Preview pending.

## Verified release

PR #36 merged normally to 5012cb55845d9f5a81b97c98235a3b7856936eef. Preview dpl_FD5FbHLWmfGnjz9JPcxC7HRjtpcj READY at c55e164cdc568f6e0a92931775a977bc777e0eac; six cases and original asset hash pass. Production dpl_2hbs1gHqDPWoGsGSyXfuZM1FmSn4 READY, canonical alias confirmed by Vercel CLI; GitHub deployment 7065645496 links successful Production to exact merge SHA and matching hostname. Live six cases and original hash pass. No DB/env changes. Evidence: phase2-preview-visual.json and phase2-production-visual.json. Rollback through normal PR revert of c55e164.
