# Agentnexos editorial / systems experience upgrade

Date: 2026-10-13. Intended release: **Vercel Preview, not production**.
Origin: isolated copy of `feature/enterprise-story-preview-20261013` (`eb276b1`) to preserve earlier review and stable production `49f4627`.

## Independent perspective checks

1. Market/strategy: compare 2026 enterprise use-case patterns and customer adoption guardrails with published Microsoft, ServiceNow, UiPath, Glean.
2. Operations and domain engineering: each of eight sector patterns defines business trigger, failure, source evidence, human owner, testable output and operational KPI, not a collection of generic cards.
3. Design-engineering: retaining selected Cyber Serif typography and black/emerald palette, with refined floating rounded navigation, cross-language layout, motion-aware and reduced-motion circuit visualizations, stage exploration, ROI visualization.
4. Technical product safety: no database schema or policy changes, no new API exposure, no production secrets in Preview.
5. Editorial/Humanizer: scenario-first copy without repetitive hype, fictitious clients, headline inflation or asserted savings. Native Arabic and English narratives, not keyword-stuffed translations.

Research links (read October 13 2026):
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-use-case-blueprints (baseline, KPIs, value drivers)
- https://learn.microsoft.com/en-nz/agents/adoption-patterns/pattern-core-business-process (least privilege, approvals, evaluations)
- https://www.uipath.com/platform/agentic-automation/agentic-ai (code-first orchestration and governed operational agents)
- https://www.glean.com/ (data context, permission-aware knowledge, integrations)
- https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-expands-AI-agent-governance-through-deeper-integration-with-Microsoft/ (agent control plane governance)
- https://www.zuora.com/guides/agentic-ai-enterprise-use-cases/ (business owner, trigger, output, measurable value)
- https://www.expresscomputer.in/news/start-with-the-outcome-oracle-indias-vivek-gupta-on-taking-ai-from-pilot-to-production/139678/ (business outcome before technology)
External case-study statistics were **not** imported as our own results.

## New user journey and deliverables
- Homepage copy states who benefits from agentic workflows and why scattered operations create waiting time.
- Sector atlas: eight grounded vertical industry studies: energy/field operations, distribution, construction, finance, nonclinical healthcare admin, regulated financial services, customer operations, agriculture and food.
- Each industry study exposes source records, failure mode, four processing steps, human decision, output, acceptance and KPI; local client selection opens a *draft* design prompt for a specific industry.
- Educational interactive system anatomy: trigger → bounded context → orchestration/tools → human approval → outcome/evaluation, with evidence and disclosure. Engineering glossary is understandable to business owners.
- Business value modeling tool: volume × eligible share × (manual - assisted - human review) × hourly cost minus entered running costs. All initial values fictional; operational readiness and project ROI must be measured.
- Local workshop in the agent UI when Preview LLM access is disabled: manual, deterministic browser-only structured design draft with Markdown download. **Not** an AI answer; no server submission. Live AI remains available only on suitably configured environments.
- Founder contact details carried from authorized owner input and the previous branch.
- Revised system prompt version `operational-engineer-v3` for supplied facts, exception handling, evidence, decision owners and grounded pilot criteria.

## Database / deployment safety
- Supabase connector list_projects was unavailable because an eligible linked account was not present. No SQL executed and no schema migrations were applied.
- Vercel project environment inventory was read **without decrypting values**: model access and Agentnexos service credentials are scoped only to production, while integration-managed generic Supabase keys exist in Preview. The project-specific Demo flag, service key and model keys were **not copied to Preview**.
- Keep production's operational runtime and quota database separate from design Preview. Do not call the Preview tool a production agent.
- No edits were made to `app/api/agentnexos`, database migrations, Supabase policies, migrations, service role grants, real integrations, payments or execution permissions.

## Known release blockers and conditions
- GitHub Actions CI has recently exited before job steps were reported. Automated local gates and Vercel build can pass, but CI service configuration remains to investigate.
- Known upstream moderate `sprintf-js` audit finding remains until an appropriate upstream fix is reviewed.
- A Groq tool-choice protocol mismatch / EMPTY_REVIEW was previously observed in production logs. Prompt improvements do not constitute a verified provider fix; a live, safely fictional read-only smoke run is needed, along with provider models and rate-limit evaluation.
- No real ROI or client results are promised. Manual local model input assumptions and payback exclude upfront implementation/quality-risk costs.
- Rollback: the feature is isolated in its own branch and does not merge to main. No data migration needs reversing.

## Visual QA conditions
- All six combinations of ar/en at 390/768/1440 must pass main route and interaction suites, with centered navigation geometry, non-overflowing panels, accessible focus, optional animations respecting reduced motion, download and privacy disclosures.
- Review before and after production/preview screenshots on the same dimensions; record any notable visual difference.

## Live evidence and defects observed
- Production GET /api/agentnexos reported ready true; Preview GET reported FEATURE_DISABLED. This is consistent with environment-variable scope and should not be bypassed by copying production secrets.
- A single authorized read-only, fictional production request produced a substantive Arabic response. No customer data or external action was used. The response also **invented review departments, an e-signature, a PDF archive and a closed/cancelled state** despite unspecified company policy. These were recorded as product defects, not customer success.
- `lib/agents/prompts.ts` updated with explicit no-fabricated-approver and unresolved-policy rules. It remains a prompt-level change; it **does not prove** deterministic enforcement. Before production promotion, add a regression dataset and execute live model tests for scenarios with missing authority, conflicting evidence and refusal to perform external actions.
- Local validation: typecheck pass, i18n pass, 49 unit tests pass, Next 16.3.8 build pass, lint 0 errors / four existing warnings.
- Local browser matrix: 78/78 page-locale-viewport checks; two baseline interaction journeys passed after selector and layout fixes. Additional E2E covered nav geometry at widths 390/1440, eight-domain selector and deep link, offline local Markdown generation with zero POST requests, ROI input recalculation and invalid input rejection.
- Visual QA detected floating nav position error caused by an incorrectly overridden logical CSS inset, then fixed and confirmed centered: x=12 / width=366 on 390px mobile and x=40 / width=1360 on 1440px desktop. CSS rounded corners 18px/25px.
- ROI demonstration values are purely fictional: 600 cases/month, 60% eligible, 18 baseline minutes, 9 assisted minutes, 3 minutes human review, USD 8 loaded hourly cost, USD 150 monthly running costs. Illustrative net: USD 138/month before implementation costs and other quality risks. Do not represent this as measured savings or ROI.
