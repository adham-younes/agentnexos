# AGYNEXA global positioning and English-first release

Owner authorizes AGYNEXA display branding, unchanged Cyber Serif/emerald, English default with full Arabic, worldwide offer and planned agynexa.si domain. Existing institution/runtime phases 4–6 remain separate; this release changes public branding/content and the public assistant's company name only.

Full copy and source boundaries: docs/brand/agynexa-20261014/direction.md. Marketing source remains lib/content/revision-20261014.json and existing typed UI sources. Full detailed service and solution prose retained, six service deliverables clarified, finance/public-service development scopes added equivalently. Delivery archive preserved. Internal route/API/DB names stay unchanged to preserve URLs and data.

Local typecheck, i18n:check, lint (0 errors, 5 existing warnings), build completed. One existing mail-subject test expected the old brand; its expected subject was updated to AGYNEXA and the 50-test suite passed. No model suite rerun for a display-name-only change; actual public identity smoke follows deployment. Site/content/viewport acceptance pending. Domain inspection: agynexa.si not found under connected Vercel team; centralized NEXT_PUBLIC_SITE_URL support prepared, current working canonical and sitemap origin retained until domain/DNS connection. No env/DB/DNS changes or registration.

Rollback: normal revert PR of this brand release, preserving prior runtime/content data and rejected-image removal.

Local rendered acceptance: 102 route/locale/width cases and two interaction journeys pass; 30 nonlegal full-content comparisons and four exact downloads pass against the current source. Six focused brand viewport cases pass display wordmark/headline, Newsreader/Arabic display fonts, black/emerald palette, RTL/LTR and no overflow; root redirects to /en. Fresh English desktop and Arabic mobile screenshots reviewed. One remaining uppercase editorial marker was corrected; affected lint and build pass after correction. Final Preview/production checks will include that marker; prior home screenshots remain valid because that correction affects inner-page marker text only.
