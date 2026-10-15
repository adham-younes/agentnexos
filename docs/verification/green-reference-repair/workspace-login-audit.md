# Workspace and login reference audit — 15 October 2026

Evidence: inspected original attachments from `6a19e6c3-cfec-40ef-8e7c-c1e8eaf451ee`: Echo 1280×1000, Nexora 853×1280, AgentFlow 752×564. Also inspected repository `green-reference/workspace-comparison.webp`, `login-comparison.webp`, current workspace/login components, `globals.css` and `green-reference.css`. Comparison composites are historical evidence, not newly captured runtime screenshots. Coordinates below are approximate visual readings on the originals; RGB values are actual individual pixel samples, not extracted design tokens or broad region averages.

## Direct reference observations

Echo shell is approximately x67–1213, y92–908. Rail divider x234 gives ~14.6% rail/shell width. Main area x235–1205: composer x432–1007 gives ~59.3% main width; its y779–875 is ~96px tall. Welcome title y439, three suggestion cards y513–603, and composer below leave generous dark negative space. Neutral charcoal dominates: actual sampled pixels (300,650)=(27,28,30), (1000,650)=(28,28,30), (150,700)=(27,28,30). Local violet illumination occupies upper-right, emblem, and composer outline. Replace violet light with original emerald, not a green surface tint. Thin neutral borders, understated sans title, compact rail. Light grey page margin is presentation framing, not a required product background.

Nexora scene ends around x277 (~32.5% width). Panel x336–810 (~55.6% total width), y149–1117. Inner field x379–767 (~82% panel width). Panel corner radius about 28–32px visually. Field height ~60px; CTA ~64px. Actual panel sample (560,450)=(25,24,30), confirming near-neutral charcoal. Depth comes from recessed architecture, a raised panel, slight inner highlight and broad black shadow. The warm CTA should translate to a restrained original emerald treatment, not mint. Side imagery retains stone, plant, shadow and perspective rather than an overall green wash.

AgentFlow graphic is volumetric, mostly black and grey, with fine particulate neural connections and sparse points of light. Emerald should affect selected highlights only. Avoid uniformly neon brains, flat stock illustrations or unrelated visual styles.

## Confirmed implementation mismatches

- `green-reference.css:3` replaces root semantic `--primary`, `--ring`, `--cyber-emerald` with `#85ef95`; `globals.css` originally separates near-white primary from `#10b981` ring and emerald artwork. Restore semantic tokens before scoped adjustments.
- Workspace override line 84 makes all surfaces green-grey (`#171b18`, `#171c19`, `#202822`) and primary `#87ed98`; line 112 assigns pale green send control. Historical comparison visibly shows an overall green wash. Echo instead keeps surfaces neutral.
- Current markup adds a full-width 76px branded header, then a second 64px toolbar. Echo puts brand/navigation in rail and leaves main top mostly empty. Relocate brand, locale and account to rail, retain a discreet useful toolbar, use real existing Sheet on narrow screens.
- Current empty state has intro, details and four cards. These real content requirements differ from three reference cards; preserve all four, but reduce card ornament, avoid opaque green fill, retain clear whitespace. Do not fabricate history, model selection, voice or attachments.
- Current composer cap 850px and full-width utility wrapper cause a broader composition than reference at desktop. Target ~60–65% main width on sufficiently wide screens; full useful width on smaller screens. Keep readiness, limits, context and privacy readable, separate from the input surface.
- Historical workspace comparison shows welcome above center with several competing text rows, and large boundary block in rail. Retain all material but make rail scroll independently; minimize border density and move secondary context into clearly labelled disclosure where appropriate.
- Login CSS line 145 uses `#93e9a4` and hover `#a4f3b4`, producing the broad mint rectangle seen in historical comparison. Restore original emerald accent. Surface/background currently green-tinted, unlike near-neutral reference.
- Login scene proportions were corrected late at lines 171–177, but multiple overriding declarations obscure intended responsive geometry. Replace with a single scoped layout rule set. At 853px choose proportions near source only while keeping form usable; do not hard-code the source panel height just to compensate for absent social auth.
- Login currently has functional email/password, visibility toggle, contact help, public assistant and project brief routes. Preserve these; source social buttons and password reset are not current implementations and must not be invented.

## Repair architecture

Remove the global reference overlay. Keep original semantic tokens. Dedicated workspace stylesheet scoped to `.agent-workspace` and portal `.workspace-sheet`; dedicated login styles scoped separately. Use existing shadcn/Radix Sheet for mobile rail; no new dependencies or changes to primitive implementation. Operational headings use Instrument/Inter sans, not display serif. Arabic retains actual Arabic family. Keep production runtime and API logic untouched.

## Acceptance captures and interactions

Capture source-ratio workspace 1280×1000 and login 853×1280, then AR and EN at 390, 768 and 1440px. Record actual viewport height alongside width. These are required checks, not completed results.

- Desktop: rail about 14–16%, no full-width branding header, neutral charcoal, local emerald light, quiet welcome, four real suggestions; composer near bottom, roughly 60–65% main width where practical. All existing scope text remains reachable.
- 768: mobile Sheet opens from logical start, has accessible title/description, keyboard focus trap, Escape/overlay close and restored trigger focus; conversation and composer remain available. No invisible required scope text.
- 390: no horizontal document overflow; all four cards readable; privacy and budget wrap; composer remains visible while message area scrolls, with safe-area padding. Very short viewports must allow content access rather than clipping or hiding it.
- Arabic: rail/drawer uses logical start, textarea and text alignment RTL, email remains LTR, directional arrows correct, line-height preserves Arabic marks. English remains neutral sans. Brand wordmark remains LTR.
- Runtime states: readiness checking/ready/offline/retry, empty state, seeded suggestion, real streaming response, cancel, copy/download, errors/rate limits, expanded details, long messages/code/table. No unsupported controls.
- Login: default, email focus, password focus/visibility, busy, validation, missing-config notice and failed auth; all actual links work. No bogus OAuth or recovery route.
- Keyboard/200% zoom/reduced-motion: visible focus, no obscured controls, dialog close accessible, text contrast validated. Broad green glow or pale mint fills are rejection criteria.

## Publication gate

Historical build or screenshot composites do not prove current quality. Require fresh screenshots and interaction checks after repair, existing typecheck/i18n/build and relevant regression, then normal PR/main publication with live production SHA evidence. This audit does not claim those checks have passed.
