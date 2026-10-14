# Phase 2 — additive computational visuals

Baseline: production/main 8a91a674d59ae1fab9e50c8e39f971e2d988dd50, phase 1 gates complete. Scope: approved SVG/CSS and selected graph-4 only, inside platform knowledge/tools editorial containers. Existing hero WorkflowConsole, page composition, tokens/fonts/colors preserved. SVG labelled conceptual; image 1280x720, lazy, responsive with fixed dimensions. Reduced motion disables pulse animation. No new dependencies, DB, environment or public assistant changes.

Acceptance: source gates, exact asset hash; platform AR/EN at 390/768/1440, no overflow/broken images/browser exceptions, focus and reduced motion. Preview then ordinary merge, matching Production READY and live platform checks. Rollback: ordinary PR revert of this phase; no data changes.

Local gates pass: typecheck/i18n/build, affected lint; 6 platform language/width cases, no overflow/browser errors, original fonts and hero present, reduced-motion pulse disabled, lazy image dimensions and original asset SHA match. First verifier run had a fetch status accessor error after page checks; fixed the verifier, then reran successfully. No application workaround. See phase2-local-visual.json. Preview pending.
