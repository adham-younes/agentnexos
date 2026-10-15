> Historical rejected implementation. The owner rejected the mint palette and fidelity judgment recorded here. This document is retained as evidence, not current approval. See `../green-reference-repair/repair-release.md` and the root `design-qa.md` for the repair and fresh evidence.

# Green reference redesign — 15 October 2026

## Owner request and scope

The owner supplied five images and explicitly requested adapting the existing platform to their layout, typography, green/black palette, agent workspace, raised login panel and generated-image style, followed by repository delivery and verified production publication. This supersedes historical visual preservation rules for this task. Existing Arabic/English content, API boundaries, real assistant behavior and approved claims remain mandatory.

Targets: shared typography/navigation/surfaces, the home page, the existing `/agentnexos` workspace and a new localized `/login` gateway. No enterprise actions, production migrations, invented customers, fabricated testimonials, fake integrations or production-secret exports.

Acceptance: real generated artwork rather than CSS stand-ins; reference-led geometry and hierarchy; equivalent Arabic/English; visible keyboard focus; mobile navigation and composer remain functional; password visibility and truthful login errors; 390/768/1440 rendering; passing typecheck/i18n/workflow tests/build; honest lint/audit outcomes; normal PR and matching production commit before claiming publication.

## Reference inventory and close visual inspection

1. AI.Now composite, 1600 × 1200: large crop of hero/about plus reduced right-side continuation.
2. AI.Now full page, 752 × 3517: complete vertical rhythm, services, quote cards, articles, contact and footer. The grey outside the first composite is presentation canvas, not a site surface.
3. Echo, 1280 × 1000: inset desktop agent application within a light presentation board.
4. Nexora, 853 × 1280: architectural split-screen account gateway.
5. AgentFlow, 752 × 564: black visual field, translucent anatomical brain and fine particle network.

### Marketing template

| Element | Observed construction | Adaptation |
| --- | --- | --- |
| Palette | True black hero, almost-black green lower sections, dark sage cards, lime/mint edge highlights, white primary type | Keep the platform's green/black identity; separate foreground contrast from decorative green |
| Header | Narrow centered tray, dark transparent green, rounded lower corners, wordmark left, small six-link row right | Retain existing brand/routes and language switcher inside a dark green tray |
| Hero composition | Centered content over a diagonal 3D ribbon; ribbon extends beyond both horizontal edges | Use a generated continuous glass ribbon image, full-bleed and cropped responsively |
| Display type | Very broad geometric Latin forms, flattened curves, squared terminals; heavy first line and very thin second line | Michroma is a freely available close stylistic match, not a verified identification of the screenshot's original font; Tajawal provides genuine Arabic shaping and matching light/heavy contrast |
| Body type | Small clean sans, restrained measure and compact line spacing | Keep Inter for body copy; preserve all source paragraphs rather than replacing them with the sample's shorter text |
| Eyebrow | Dark green rectangular label with a small bright round arrow/icon | Quiet dark-green label with existing semantic copy and brand indicator |
| Hero actions | Two outlined dark rounded rectangles, green light around the bottom edge; significant gap above them | Keep actual assistant/brief actions; dark green border and inset highlight |
| About | Centered two-line green heading, then asymmetric explanation and small staggered process blocks | Preserve platform capability copy, actual illustrative workflow and generated neural visual |
| Cards | Three columns, soft charcoal-green, subtly oblique silhouette, generous padding and small headings | Use consistent dark raised cards and readable multiline content; no skew applied to text |
| Lower-page rhythm | Black negative space, green ribbons/glows between sections, groups separated by small centered labels | Retain actual use cases, acceptance, security and FAQs; do not import fake testimonials, claims or newsletter behavior |
| Contact | Brain sculpture left, form right, low horizontal contact strip | Reuse brain artwork with the actual brief/assistant next steps; preserve local-only brief behavior |
| Footer | Dark green zone with a raised inner tray and small legal line | Use existing real routes, legal links and brand in a sage inner panel |

### Agent workspace

The Echo image uses a roughly 160px sidebar within a 1145px frame, a charcoal main surface, minimal separators, a small centered emblem, a large single welcome question and compact suggestion cards. The empty middle provides breathing room. A wide rounded composer sits near the bottom with a thin colored stroke and a soft external glow. The top-right colored haze is lighting, not content.

Apply this hierarchy with green lighting. Preserve the current model transport, readiness checks, phase reporting, request cancellation, retry, copy/download, bounded context and fail-closed states. Do not copy fabricated chat history, subscription upsells, attachment/audio/image-generation controls or a model selector for unsupported capabilities. All existing suggestions and scope details remain available.

### Login gateway

The Nexora image is a 32% architecture / 68% account split. The architecture has a near-black stone entry, a recessed staircase, tree silhouette and narrow warm lights. The account panel floats above a black surface: approximately 32px corner radius, a faint top edge, heavy lower shadow, a circular emblem, centered heading, inset fields and one prominent raised action. Fields use labels outside the input, leading icons and a trailing password-visibility control. Secondary options are separated by a fine rule.

Adapt the lighting and action color to green. Generate a matching architectural image. Email/password uses the existing Supabase browser client when actual public configuration exists; missing configuration and rejected credentials must show honest errors. The gateway does not grant enterprise permissions. Social provider buttons are omitted because provider configuration is not established. No fake successful login, account creation, reset link or social sign-in is presented.

### Graphic style

AgentFlow's artwork is photographic/volumetric rather than flat iconography: dark translucent anatomy, hairline connections, sparse particles, concentrated highlights, black margins and intentional negative space. Generate original green ribbon, architectural and neural assets in this family; keep UI text editable. The supplied brands and foreign text are references, not replacement identity.

## Baseline evidence

Checkout initially clean at `b681198948bf70ece7bd86732c32518db51de764`. Node 22.23.3, pnpm 11.19.0, frozen installation repeated successfully. Typecheck, i18n and all 50 tests passed. Production build with Turbopack passed. Lint: 0 errors, 5 existing warnings. Audit: one moderate `sprintf-js` advisory. Arabic/English production-mode and development-mode requests succeeded; local assistant reported `FEATURE_DISABLED`, as expected without production credentials.

The existing browser suite completed 102 page cases and two interaction journeys with three failures: unrevealed content on both desktop homepages and an effects-readiness timeout on English desktop procurement. These are baseline failures, not passing results. Original report is retained locally in `output/green-reference/baseline-report.json`. Desktop viewport captures are retained in that directory. The first optional full-height screenshot attempt timed out; viewport baseline captures subsequently succeeded.

The reveal observer used a proportional threshold on potentially very tall content; the redesign changes it to first intersection and retains a real assertion that all scrolled content becomes visible.

## Tooling and assets

Cloud setup saved `install_script`, `start_skill` and four font/browser download domains in the environment draft. Saving is separate from publication. Existing Node 24 initially downloaded dependencies; Node 22 and pnpm 11.19 subsequently repeated frozen installation and ran the validation.

Superdesign preflight found no authenticated session. Its login required an external authorization, so canvas work was stopped and direct implementation used the owner's already-selected screenshots. No canvas approval or canvas-generated result is claimed. Image generation produced the three original artwork assets; WebP conversion uses the project's installed Sharp dependency.

See `release.md` for final checks and actual repository/deployment outcome.
