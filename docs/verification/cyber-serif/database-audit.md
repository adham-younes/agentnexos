# Database and runtime review

Target identified from the repository: Supabase `ruereqpvykwnakcnmxha`. On 13 October 2026 Cairo, the connected account listed two other projects, and explicitly reading public table metadata for this target returned `You do not have permission to perform this action`. No unrelated database was inspected or modified. No migrations were applied.

Source review: five versioned migrations separate legacy enterprise schema/RLS from the public demo request quota and limits. The active public route calls `reserve_agentnexos_demo_v3`; the function validates the hashed subject, serializes reservations with a transaction lock, limits concurrency and 24-hour per-connection/global usage, and expires old requests. Limits and demo requests have RLS enabled; API roles lack direct access; execution is granted to service_role. v3 is security invoker with a pinned empty search_path. Source-level policies do not prove the deployed schema, grants, indexes or retention behavior.

Active API: validates same-origin requests, JSON content type, 40KB byte limit, input schema and bounded context. Trusted Vercel IP is hashed server-side with HMAC. Journal/save errors prevent a success stream. Credentials stay server-side. Enterprise /api/chat, /api/approvals and /api/telemetry are still disabled with 503; no identity/integration boundary was reopened.

Observed production health before change: ready:true; perConnectionDaily:1000, globalDaily:10000, windowSeconds:86400. Health is evidence of the route's readiness query, not a complete database security audit or a successful model response. Existing unit tests cover policy, reservation schema, runtime boundaries and context; new tests cover localized numeric brief input. A bounded fictional-data model smoke test is recorded separately if successful.

Remaining limitation: live schema, permissions, advisors and tenant isolation cannot be audited with this connector until this exact target is accessible. Enterprise isolation is not claimed as live. Direct target access is necessary to complete the requested database audit.
