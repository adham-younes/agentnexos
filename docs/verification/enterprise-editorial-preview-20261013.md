# Agentnexos enterprise narrative and experience preview
Date: 2026-10-13. Delivery scope: isolated branch, Vercel Preview only. No push to `main`, live database migration, or changes to enterprise action permissions.

## Product promise
Agentnexos is an Arabic-first independent engineering offering for organizations in Egypt and the Gulf. The available public application is a bounded workflow-design assistant and a locally prepared project brief. Integration with CRM/ERP, approval persistence, production orchestration, actions and customer datasets must be scoped and validated per deployment; they are **not implemented customer services in this preview**.

Audience: business owners, operations managers, finance/procurement leaders, technical sponsors. Their alternatives are disconnected forms, email follow-ups, spreadsheets, and ad hoc prompts. The site helps them select one operational bottleneck, understand evidence and ownership boundaries, form a measurable pilot hypothesis, and contact the engineer after reading their locally prepared brief.

## Research references (retrieved 13 October 2026)
Research informs examples and structure only. It is not evidence of Agentnexos capabilities.
- Microsoft Learn: [Agent business value blueprints](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-use-case-blueprints) aligns use cases with baseline, KPI, and reviewer.
- UiPath: [Procure to pay agentic automation](https://www.uipath.com/solutions/department/finance-and-accounting-automation/procure-to-pay) describes procurement intake, exception handling, ERP as system of record and supervised workflow.
- ServiceNow: [AI agents in customer service](https://www.servicenow.com/docs/r/customer-service-management/now-assist-for-csm/csm-ai-agents-use-cases.html) describes case triage, data validation and escalations across teams.
- Glean: [Agent governance](https://www.glean.com/ai-agents/agent-governance) emphasizes data permissions, access scoping and admin guardrails.
- Kore.ai: [Enterprise agent platform](https://kore.ai/ai-agent-platform) emphasizes operational outcomes, evaluation and controls. Do not reuse competitors' performance metrics.

## Delivered feature scope
- Reversible design extension through a dedicated `app/enterprise.css` imported into existing Cyber Serif theme.
- Reworked website narratives for six industry/business functions, each with friction, authorized inputs, workflow, human handoff, inspectable output and pilot metric, in Arabic and English.
- Distinct engineering diagram on product, industries, resources and security pages rather than repeating an illustrative purchase order console everywhere.
- Platform-specific system blueprint with read / orchestration / approval / evidence boundaries.
- Public founder page with user-provided full legal name, phone and email; no degrees, fictitious customers, certifications, revenue, or deployment claims.
- Deep links from use cases into a localized workflow starter in the public assistant; this fills a *draft* and does not send automatically.
- Browser-tab-only brief draft persistence across language switching. No network submission; mailto link merely opens the user's email client and requires user review and attachment. Privacy notices updated for browser session storage and the owner-provided contact channel.
- Founder navigation and bilingual sitemap inclusion.

## Safeguards
- Preserve existing `/api/agentnexos` logic, read-only policy, quotas and isolated Supabase configuration.
- Do not enable `/api/chat`, approvals, telemetry, payments or code execution. No backend writes were added.
- Public examples use fictional case framing and include explicit disclaimers.
- Branch created from production commit `49f4627ec934bba066294cb0740ad6ea0f21a80a`.
- Baseline screenshots, browser diagnostics and final preview QA will be recorded separately from local source gates.
- Rollback: revert feature PR or restore recorded production deployment; no DB rollback necessary, because no migrations are in this change.

## Outstanding gate before any production merge
- Confirm matching SHA deployed to Vercel Preview with HTTP success for Arabic/English at 390/768/1440.
- Verify locale retention, system map rendering, contact link, sector prefill, and downloadable brief.
- GitHub CI is currently failing with no reported job steps on production main; determine provider reason rather than bypass CI.
- Past Groq `Tool choice is none, but model called a tool` / `EMPTY_REVIEW` errors need a separate reproducible runtime repair and live model check. Do not declare multi-agent runtime fully production-reliable from static browser tests.
- Privileged live Supabase tenant-isolation audit remains outside this UI release and must precede connecting enterprise data.

## Local verification complete
- `pnpm typecheck`: pass.
- `pnpm i18n:check`: pass.
- `pnpm test:agentnexos`: 46 tests passed, zero failures.
- `pnpm lint`: pass, zero errors, four pre-existing warnings in unrelated UI helper components.
- `pnpm build`: pass, Next.js 16.3.8.
- `pnpm verify:site http://localhost:4005`: 72 page / locale / viewport cases passed at 390, 768, 1440px, including 2 built-in interaction journeys; zero failures; browser report at `output/release-verification/report.json`.
- Additional read-only and form interactions tested via Chrome: 6 sector tabs, case-specific assistant prompt on deep link, session draft retention between Arabic and English, form validation, Markdown download, clear-on-reload, founder email/tel anchors, mobile-menu escape. All checks passed.
- `pnpm audit --prod`: still exits 1 due to a known moderate transitive `sprintf-js` advisory; no unreviewed dependency override and no suppression applied.
- The **local** assistant readiness is `FEATURE_DISABLED` intentionally because local tests do not copy production model and database secrets. A preview deployment must be tested independently; no local LLM inference success is claimed.
