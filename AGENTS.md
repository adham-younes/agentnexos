# Agentnexos repository guidance

## Product contract

Agentnexos builds governed enterprise agent systems for the Middle East. Start from the business process, source of truth, authority boundaries, approval points, and measurable outcome. Do not reduce the platform to document processing or a generic chatbot.

## Truth and safety

- Never publish invented customers, testimonials, metrics, SLAs, regions, integrations, prices, or certifications.
- Available capabilities must exist in production and pass the relevant user journey.
- Model output cannot directly authorize a sensitive external action. Use typed tools, least privilege, idempotency, server-owned approval state, and audit events.
- Keep Arabic and English semantically equivalent, while writing naturally in each language.

## Architecture and gates

- Prefer Server Components; isolate interaction in small client components.
- Use Vercel AI SDK `ToolLoopAgent` for the current agent and verify APIs against installed docs.
- Introduce Mastra only with a documented durable-workflow requirement and clear ownership of persistence and retries.
- All exposed Supabase tables require RLS and tenant-aware policies. Never expose secret or service-role keys.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`. For production, verify both locales on desktop and mobile, metadata routes, the agent endpoint, Git SHA, and deployment URL.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
