# Complete Cyber Serif rebuild and database consolidation

Owner explicitly rejected the partial first redesign and requested a complete rebuild from the original reference. Baseline main:426336746165b80ff049c9b4256d25f0eb1d3b95. Isolated branch:redesign/cyber-serif-complete. Prior publication evidence preserved; user work not reset.

## Design and content

The actual reference lives in an iframe on the Superdesign library page. The outer gallery extraction was rejected as unrelated; the iframe was extracted and rendered separately. Selected draft was regenerated in place to version3, title Agentnexos - Intelligent work. Human direction. Actual implementation uses a transparent edge-to-edge header, rotating command mark, oversized Newsreader display, Inter body, Space Grotesk labels, and distinct Arabic Noto Naskh display / Noto Sans body. All public routes share the new header/footer and editorial glass layout. Start form and assistant surfaces inherit the same system.

13 unused legacy landing components and seven unrelated template images (including whale/bridge) were removed. No active route renders them. Public-page composition was replaced, not recolored. Platform, sectors, approach and guide copy was rewritten around actual working situations. Home and project brief copy were revised; legal truth and assistant execution limits are retained. No fabricated metrics, customers or integrations.

Actual reference discharge effect: a procedural emerald WebGL background with low-power rendering capped around30fps, paused offscreen/hidden tabs, static SVG fallback for mobile/reduced motion/context unavailability. Other effects: floating console, scan line, morphing blur, continuous shimmer border, pointer spotlight, icon rotation, weighted scroll reveals, pulse CTA and shifting gradient closing headline. Reduced-motion stops decorative motion. No new animation dependency.

## Database comparison and copy

Source ruereqpvykwnakcnmxha was inspected after authentication; full nonprivate inventory saved in source-inventory.json and source-functions-grants.json. Five public application tables; zero auth users/profiles/conversations/messages/storage objects. One limits row (1000/10000 per24h); two ephemeral technical request journal rows, not marketing content or business records.

Target yhjyaytbrsuwaefkqkqg was verified empty (no public tables/functions, users or storage objects). Added five application tables, five functions,21constraints,12indexes,6ownership policies, grants, identity sequence permissions, and matching limits. Migration:20261013003126_consolidate_agentnexos_source_schema.sql. It is a target-only bootstrap with an explicit populated-target guard; do not replay onto the source or an already populated database. No source tables modified or removed. Ephemeral source request journal rows were left in the original project; later source access was revoked by account reauthentication, so they are not claimed as copied. No business/user records required migration.

Target function definitions and ACLs, constraints, and indexes match the saved source exactly (database-comparison.json:zero differences). RLS enabled on all five tables. Service-role reservation and same-subject concurrency verified in a rolled-back transaction; zero test requests remained. Anonymous users cannot read request journal or call reserve RPC; authenticated/service role cannot update limits. Security advisor returns two INFO findings for RLS tables without policies: these are intentionally service-only journal/config tables; no anon/authenticated grants were added to silence them.

The public assistant is changed to use the existing Vercel integration's SUPABASE_URL/SECRET_KEY credentials, pinned to the new target host. Stale AGENTNEXOS_SUPABASE_* overrides are no longer consumed. No secret values copied into source, logs or browser code. Existing old-project variables remain available for rollback; no credential rotation or old-project deletion. Regression test confirms stale overrides cannot select the old project and unexpected hosts fail before network calls.

## Verification and release

39 tests pass. Build passes. Lint:0errors,4preexisting warnings (down from18 after deleting legacy components). i18n audit passes. Browser gate includes66route/locale/viewport cases and2interaction journeys, actual fonts, RTL/LTR, known routes, focus/menu behavior, local-only brief validation/export/reset, language query/hash retention, no legacy images, reduced motion, floating/shimmer effects and scroll reveal. Early failures and repairs are retained in local logs; final result recorded separately.

Publication must follow matching-commit Vercel preview verification, normal merge, READY production alias verification, production browser gate and one fictional model smoke test. No GitHub Actions billing workaround or branch-protection relaxation. Known dependency residual unchanged:one moderate sprintf-js advisory without published fix, previously documented in cyber-serif/security-review.md.
