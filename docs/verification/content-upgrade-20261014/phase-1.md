# Phase 1 — complete content and public routes

Implemented on clean main 49f4627. Only approved revision imported; rejected parent archive excluded. Complete reviewed Markdown converted deterministically into structured content, preserving paragraphs and links. Existing Cyber Serif classes, tokens, fonts, hero artwork, interactive tabs, FAQ and workflow demo retained. Services, methodology and four detailed solutions use explicit route allowlists. Four localized resources copied byte-for-byte to public/downloads/agentnexos. Sitemap and localized metadata cover seventeen routes. Public assistant instructions use an expandable section inside its scroll region; chat transport and backend unchanged.

Legal exception: published privacy/terms retained. Proposed replacements require complete configuration and legal-entity verification; this is the explicit package exception, not an unreported content omission. No enterprise capability or database/environment mutation in this phase.

Verification before Preview: typecheck, i18n, build, 43 agent tests pass; affected TS/TSX lint clean. Repository baseline lint has five pre-existing warnings. Existing scripts are ESLint-ignored; script syntax executes successfully. First browser matrix: 102 page/language/width cases + two interaction journeys, zero failures. First parity pass found four unchanged home section titles; corrected, then all thirty nonlegal localized pages and four exact downloads pass. Final visual adjustments restore serif/emerald headline emphasis and retain the third capability card to preserve the published grid. Final exact-commit Preview validation pending. Screenshots/logs kept under output/content-upgrade-baseline and output/release-verification.

Acceptance still required: Preview READY for implementation SHA, full matrix + visual/interaction inspection, normal PR merge, matching Production READY, canonical live verification. Do not label this release deployed until these complete.

Rollback: ordinary PR revert of phase 1 implementation. Database unchanged; retain baseline 49f4627 and original package commit. Preserve unrelated work.

## Production release verified

PR #35 merged normally to 8a91a674d59ae1fab9e50c8e39f971e2d988dd50. Preview dpl_3VHmvZjbEK5rFNkTbeoRaCD1X3RY READY at implementation 061859bdaa6bc38b57c130cbb3fb2827fc06ba83: 102 cases, 2 interactions, zero failures; 30 nonlegal page variants and four byte-identical downloads pass. Production dpl_HrN5AXJgUSA36bMhC15C5ny2iM4N READY, git/main matches merge SHA, canonical alias verified. Production repeats 102 cases + 2 journeys with zero failures and ready:true; content/download parity passes. See phase1-preview-*.json and phase1-production-*.json. Before screenshots preserved separately at output/content-upgrade-baseline/production-before/screenshots; Preview at output/release-verification/screenshots. Visual inspection included actual AR/EN phone heroes and desktop platform, including serif/emerald treatment.

Hosted Actions did not start due to account billing; owner explicitly directed continuation with local verification and Vercel Preview instead. No protection/admin bypass. Production audit still reports the pre-existing sprintf-js moderate advisory with no patched version; no high/critical advisories, no lockfile changes or audit threshold weakening.

No DB or environment changes. Rollback: normal PR reverting implementation commit 061859b while preserving imported approved package and baseline documentation.
