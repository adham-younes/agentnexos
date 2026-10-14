# Remove rejected platform visuals — 2026-10-14

Owner rejected the added computational PNG/SVG and their explanatory captions. Remove both figures and imports from the platform renderer in both languages. Retain package originals as delivery history and retain existing Cyber Serif hero and full approved page text.

Provenance: page prose is from revision content/ar/platform.md and content/en/platform.md, converted into lib/content/revision-20261014.json. The removed captions were implementation-authored, not source prose.

Local typecheck, i18n:check, lint and build pass. No new tests for this reversible presentational removal; focused bilingual viewport verification follows on Preview and production. No database, environment, runtime or dependency changes. Rollback by normal revert PR for this removal only.
