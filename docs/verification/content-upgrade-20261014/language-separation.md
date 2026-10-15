Configuration correction — 2026-10-15

Owner requested independent language versions. English source excerpts remain unchanged on English pages only. Arabic pages now use Arabic equivalents; the redundant English hero sentence was removed. IBM Plex Sans Arabic and the existing template remain. This supersedes the earlier requirement to render ten English excerpts in both locales. No database or runtime changes.

Rollback: revert this correction to 2630f58272ccc1235db3e3eecdc3af7c6c374b49.

Release verified: PR #45, main ecdd2d360759c0da693ed8708b6aa107db72f6db; Production deployment dpl_kCK4r7SUUGwKt1ZeuLgAwnQRCgwF READY, matched through GitHub commit status. Preview and canonical production checks each passed 6 locale/viewport cases and 34 routes. Ten English excerpts retained; none appears in Arabic routes. Typecheck, i18n audit, build passed; lint has 0 errors and 5 existing warnings. Evidence: output/quoted-content/separation-* and output/agynexa-reference/separation-*-brand.json.
