# Agentnexos

Agentnexos is an Arabic and English platform for designing governed enterprise agent systems for organizations in the Middle East. The product starts from a business process, source of truth, authority model, and measurable outcome—not from a generic chatbot.

## Phase 1 release

- A rebuilt bilingual website with truthful positioning, symmetric responsive layout, and no fabricated customers, metrics, integrations, prices, or certifications.
- Agentnexos 01, a Vercel AI SDK `ToolLoopAgent` that turns an operational description into a typed automation blueprint. It is analysis-only in this release.
- A Supabase foundation migration for tenants, memberships, workflow blueprints, runs, events, approvals, tool executions, and audit records with RLS.
- Health, robots, sitemap, release SHA, security headers, lint, typecheck, and production build gates.

## Stack and development

Next.js 16, React 19, TypeScript, Vercel AI SDK and AI Gateway, and Supabase/Postgres.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `AI_GATEWAY_API_KEY` for local model calls. Then run `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Verify `/ar`, `/en`, `/api/health`, `robots.txt`, `sitemap.xml`, responsive layouts, and the agent request flow before promotion.

## Documentation

- [Phase 1 release record](docs/releases/phase-1-foundation.md)
- [MENA market content research](docs/research/mena-agent-platforms.md)
- [Upgrade plan](docs/UPGRADE-PLAN.md)
- [Content and product guardrails](docs/GUARDRAILS.md)

Capabilities described as available must exist in the deployed artifact and pass a user-journey test. Planned integrations, compliance work, pricing, and customer proof remain explicitly planned until verifiable.
