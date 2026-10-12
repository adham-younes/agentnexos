# Dependency security review — 13 October 2026 Cairo

`pnpm audit --prod` initially reported 8 advisories: 2 high, 5 moderate, 1 low. Upgraded Next.js and its ESLint config from 16.3.7 to the verified patch 16.3.8; pinned source-map-js 1.2.2 using a pnpm override and committed the lockfile. The audit afterward reports 0 high/critical/low and 1 moderate on 473 production/optional dependencies. This is not an assurance that every security issue is absent.

Primary references checked:
- https://github.com/advisories/GHSA-cjq9-62q9-8jv4 — Next.js image optimization SSRF, fixed 16.3.8. This app also has image optimization disabled and no remotePatterns.
- https://github.com/advisories/GHSA-68fv-2mgg-jv7q — source-map-js indexed section offsets, fixed 1.2.2.
- https://github.com/advisories/GHSA-hp3w-g68c-fv3c — sprintf-js unbounded format precision; affected through 1.1.3, no published fixed version. Registry latest verified as 1.1.3.

Residual: sprintf-js 1.0.3 is a transitive dependency through @mastra/core → gray-matter → js-yaml → argparse. Its inspected usages are in argparse CLI help/error formatting. Application source imports Mastra workflows, not skill/frontmatter loading or argparse, and does not pass user-controlled format strings to sprintf-js. No exposed exploit path was found in the inspected public route; that is scoped source evidence, not a guarantee of non-exploitability. A major parser override or unreviewed custom patch would add unrelated compatibility risk, so no speculative replacement was applied.

The audit still exits nonzero for the unresolved moderate advisory; no audit rule, threshold or CI protection was weakened. Hosted CI status must be reported independently. Local typecheck, translation checks, 38 tests, lint and build were rerun after the security updates; browser checks rerun against the final build.
