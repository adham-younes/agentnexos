# Phase 4 — customer workspace and verified identity

Status as of 2026-10-15: planning draft only; not implemented or released. Historical baseline below is not the current production revision. Customer phases remain deferred while the owner focuses on public content.

Baseline: main 84f0d56552858eab5d025172a88e24b8b3a96085, phase 3 public acceptance recorded. Scope: separate private/noindex workspace, server Supabase Auth validation on every capabilities read, actual session identity, bilingual navigation for seven customer areas, honest missing project/storage/tool capabilities. No DB/schema/environment changes; legacy enterprise APIs remain closed. Existing anonymous public assistant remains separate.

Acceptance: source gates, actual unauthenticated and invalid-session API behavior, loading/error/retry/login/setup/permission UI states, AR/EN at 390/768/1440, focus and reduced motion, Preview and matching main Production READY. Authenticated positive/revoked real-user sessions and ownership must be marked unverified unless actually tested. Only disabled/setup-required customer capabilities may ship without those proofs.

Observed through direct Supabase connector: five public tables and owner-only profile/conversation/message policies; no organization/membership/project/approval/knowledge tables. No development branches. New institutional execution cannot be enabled from these observations alone.
