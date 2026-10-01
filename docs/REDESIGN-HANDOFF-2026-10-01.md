# AgentNexos comprehensive redesign — source and release handover

## Scope and current truth

The owner authorized all four successive releases: public matte-black/green design; professional Arabic/English enterprise editorial; verified Supabase accounts protecting only the workspace/account; private conversations; final quality and documentation. The old nature-photo template was explicitly superseded by the later owner-approved redesign/editorial. Existing Next.js/AI SDK/Mastra and shadcn foundations are retained.

**Source implemented; production publication pending authentication configuration.** Last verified production before this work is main commit `b8e5a24378ea993e5539efc22e2ecdece34ee726`. No redesign production merge is claimed. The database has additive, isolated account/conversation tables, but the old production application does not use them.

| Stage | Source commit | Review | State |
|---|---|---|---|
| REDESIGN-01 | 1235be42979096a647dd3ea7dbf68b2eeeb36a01 | https://github.com/adham-younes/agentnexos/pull/20 | Preview READY; rendered authentication configured=false |
| REDESIGN-02 | 5df57cd64d053e81c313ce350870253c4517673d | https://github.com/adham-younes/agentnexos/pull/21 | Preview READY; public browser checks recorded |
| REDESIGN-03 | e976f12a7388dd3191ecf8771b86b8c879c30e9f | https://github.com/adham-younes/agentnexos/pull/22 | Preview READY; live account checks blocked |
| REDESIGN-04 | recorded in release evidence after publication | dependent review | Quality and handover source; pending release |

The PRs are stacked to keep each source stage independently reviewable. After merging #20 into main, retarget #21 to main rather than merging it into the feature branch; repeat for #22 and the final quality PR. Each stage requires its own exact production SHA and READY deployment verification.

## Configuration required — no paid upgrade

In [Vercel environment settings](https://vercel.com/adhamlouxors-projects/compute-the-platform-to-build/settings/environment-variables), set for both Preview and Production:

- `NEXT_PUBLIC_SUPABASE_URL`: authorized project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the publishable key from [Supabase API keys](https://supabase.com/dashboard/project/ruereqpvykwnakcnmxha/settings/api-keys), or existing legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the same project. Never put a secret/service-role key here.

The attached cloud runtime reports no credentials or outbound identities. The connected Vercel toolset exposes deployment inspection, not an environment-write operation. Its advertised direct-deploy call also returned `Tool deploy_to_vercel not found`; GitHub-triggered Preview deployments work. The owner was asked for configuration; existing authorization to deploy remains valid and should not be requested again.

In [Supabase Auth URL configuration](https://supabase.com/dashboard/project/ruereqpvykwnakcnmxha/auth/url-configuration), use the official site as Site URL and permit the production and project-specific Preview callback URLs, including query parameters used by locale and recovery. Preserve required email confirmation. Verify actual email delivery: default SMTP restrictions may require an authorized sender/custom SMTP. Do not promise unrestricted registration because the form renders or a signup API returns a result.

## Applied database changes

Authorized project only: `ruereqpvykwnakcnmxha`.

- `20261001080819_workspace_identity`: own-user profiles.
- `20261001083506_workspace_conversations`: owned conversations/messages, cascading deletion and server-only transactional turn creation.

RLS and explicit grants deny anonymous private reads, cross-user reads/deletion and client-forged model output. Live SQL fixture tests rolled back all data. No password, provider secret or production service key was copied into source or local files. Database chat history is not durable external execution.

## Verification and operational commands

```bash
pnpm typecheck
pnpm i18n:check
pnpm test:agentnexos
pnpm lint
pnpm dev
# In another terminal, one at a time:
pnpm verify:site
pnpm verify:workspace
pnpm verify:journey
# After fixture verification exits and removes its development route:
pnpm build --webpack
```

For an external Preview use `SITE_URL=https://<preview-host> VERIFY_DIR=docs/verification/<stage>/preview pnpm verify:site`. Browser-origin API checks use Chromium, avoiding the local Node direct-network/proxy difference. Evidence JSON and six final compressed screenshots are committed under docs/verification/redesign-04; larger earlier PNG screenshots are retained in the execution workspace and visually reviewed. Historical image-layout verifier remains an archive, not the current release contract.

GitHub Actions previously failed due account billing. Local checks and Vercel checks are independent evidence, not a claim that Actions passed. No paid upgrade or new paid Supabase branch is required by this source.

## Remaining live gates and next engineering work

Before merging each phase: verify public routes plus a controlled confirmed account; email confirmation and recovery; private workspace; two model turns; stored reload; deletion; no cross-user access. If configuration is missing, keep the last working production deployment rather than publishing a locked-out workspace. Record exact SHAs, deployment IDs, official-domain checks and limitations in the release evidence.

Subsequent enterprise work: organizational identity/roles; durable event-sourced execution and cancellation/recovery; capability policy gateway; filesystem/network sandbox containment; memory provenance and poison resistance; trace/evaluation pipeline; one scoped integration with idempotency and effect verification. These are future engineering scopes and are not advertised as enabled preview features.

Commercial prerequisites for future lead collection: owner-approved receiving channel, data-controller/privacy contact, processing and retention terms, and delivery/support scope. The current conversion path is a local downloadable project brief; it does not silently send customer data or invent a booking endpoint.

## Rollback

Keep the verified predecessor for each release. Prefer disabling live model execution while retaining verified login if a provider fails. Do not delete account/conversation tables or user data as a code rollback. Additive unused tables remain RLS-protected; schema changes require a separate reviewed migration. Never bypass expected-head checks, branch protection, billing or email confirmation to finish publication.
