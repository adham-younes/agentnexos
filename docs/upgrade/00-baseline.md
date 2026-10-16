# Baseline scoped to release R01 — 16 October 2026

Reuses the verified production baseline in EXECUTION-STATUS.md; no repeated crawl, SQL queries or audits.

- Source and remote main: d285e1629a37086631905bb9b28f9214c11e511b. Working branch: upgrade/production-content-20261016.
- Production: agynexa.si, Vercel compute-the-platform-to-build. Previous release: dpl_CjmYmWZyh7Kny7tAUBRRveCaBvA6.
- Runtime: Next.js 16.3.8, React 19, pnpm lockfile; existing Supabase SSR clients and bounded Groq design assistant retained.
- Marketing routes: app/[locale]/{page,solutions,start,login,agentnexos}; content formerly revision-20261014.json, now approved section-16 content extracted verbatim to master-upgrade.json.
- Identity paths: lib/site.ts, localized metadata, robots/sitemap/proxy, contact links and downloadable Markdown.
- Auth baseline: login UI called signInWithPassword; no sign-up or confirmation/recovery callback existed. No private workspace entitlement follows from account creation.
- Database: previously verified yhjyaytbrsuwaefkqkqg, five public tables with RLS. No schema, RLS, retention, provider or execution-policy modifications in this release.
- No test suites run in development or Preview. Deployment compilation is required to ship. Exactly one scoped test run will target production after release.

## Findings disposition

| Findings | R01 scope / evidence |
|---|---|
| F01–F05 | Central official origin/contact; route-specific metadata, OG image endpoint, reciprocal alternates, sitemap and robots; production checks pending release |
| F06 | Apply approved contact correction only; retain truthful processing/retention details. Final legal/business identity remains gated under section 17.1 |
| F07 | Deferred to retention phase; no claim of scheduled cleanup |
| F08–F10 | Approved copy, direct independent page links, concise local brief and separate engagement page |
| F11–F13 | Labeled fictional workflow, card layout, readable typography, compact footer/navigation; no claim of live enterprise execution |
| F14 | Superseded narrowly by latest owner instruction: implement self-registration/sign-in for the public assistant, confirmation and recovery. No organizational access granted |
| F15 | Approved service H1/intro/metadata |
| F16 | Deferred security hardening; no unsupported claim that full headers/security audit is complete |
| F17–F18 | Approved bilingual copy and founder narrative; no invented clients, years, ratings or certificates |
| F19 | Add favicon fallback from existing icon asset |
| F20–F21 | One production verification for affected routes, local brief, account validation, navigation and browser errors. Valid-account authentication not claimed without evidence |

## Design provenance

MagicPath project 461034654921793536; component 461784903932055552, revision 461784903932055553. Actual production hero/card layout rendered with the existing brain asset and unchanged palette. One TypeScript narrowing error in the isolated preview was corrected once; the next build completed and its image was inspected. No further design sweeps.

## Scope changes authorized by latest owner request

R01 combines identity/content/reading layout/local brief and the minimal account flow. Existing M5/M6 tenant, persistence and connected-execution gates remain. The approved invite-only login wording is superseded for public self-registration; it must not advertise an implemented private enterprise workspace.
