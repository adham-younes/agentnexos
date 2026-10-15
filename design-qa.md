# Reference repair design QA — 15 October 2026

final result: passed

The owner rejected the earlier charcoal workspace palette in screenshot `1000109850.jpg`; its pass remains withdrawn. This current verdict covers the subsequent black revision (#050505/#0b0b0b/#ebebeb), clearer text, raised dark suggestions/composer, removal of the repeated badge, and measured44px touch areas. The final independent review recaptured all six workspace AR/EN widths, drawers and short scrolled states. It is a new review, not a reinstatement of the rejected palette. It is not owner acceptance, pixel identity, live authentication success or production publication. The previous verdict for `73639c6` and its “no actionable P0/P1/P2” claim are explicitly **withdrawn**. That rejected report remains unchanged apart from a withdrawal banner at [historical assessment](docs/verification/green-reference/design-qa-rejected-20261015.md).

## Reference and implementation evidence

The five original supplied images were opened visually: AI.Now composite `1000109824.png` (1600×1200), AI.Now full page `1000109825.png` (752×3517), Echo `1000109821.jpg` (1280×1000), Nexora `1000109822.jpg` (853×1280), and AgentFlow `1000109820.png` (752×564). The source files are local attachments under `/tmp/codex-remote-attachments/01a13fa1-5dc9-714d-91af-f2d41bc47066/`.

The final Next.js production build, rebuilt after the black palette and touch-area corrections, was served at `http://localhost:3001`. Chromium captures use density 1, loaded self-hosted fonts, default/empty state and reduced motion unless explicitly noted. Arabic and English were captured at 390/768/1440×900; login also at 853×1280. Workspace short-height tests include 400px and 570px. Source and final result were opened together before judging these boards, source on the left:

- [Hero](docs/verification/green-reference-repair/hero-comparison.webp): source crop x44/y44/981×633; app viewport1440×929, normalized to the same panel width and aspect, with subpixel rounding only. The presentation canvas is excluded.
- [Owner feedback before/after](docs/verification/green-reference-repair/workspace-owner-feedback-comparison.webp): supplied555×1280 screenshot and final390×900 state normalized into555×1280 panels with subpixel rounding; this directly shows the rejected washed surface versus platform black.
- [Workspace](docs/verification/green-reference-repair/workspace-comparison.webp): Echo app interior x74/y100/1130×798; app1440×900, normalized by width into the same panel with black padding below; no aspect stretching.
- [Login](docs/verification/green-reference-repair/login-comparison.webp): both853×1280, no aspect normalization.
- [Fields](docs/verification/green-reference-repair/login-fields-comparison.webp): source390×340 and app372×345 enlarged into equal panels. This focused board deliberately normalizes field width/height for inspection; exact60/64px measurements are separate DOM evidence.
- [Full page](docs/verification/green-reference-repair/full-page-comparison.webp): each page normalized to600px wide, preserving its own height; black padding only below the shorter panel. This compares section rhythm and content differences, not equal content length.

## Corrections and independent review

Removed `app/green-reference.css` completely, including its global mint tokens and route-specific green surfaces. The new marketing stylesheet has no global token overrides. Restored neutral primary, original Newsreader for other editorial pages and IBM Plex Sans Arabic, while marketing uses a dedicated geometric Anybody family with real700/200 English weights and real700/300 Arabic faces. The source font name is unknown; no identification is claimed.

The hero uses a trapezoid tray, black actions with emerald lower edges, a dark smoked ribbon and quiet existing lightning. About now pairs explanatory copy with small staggered actual workflow blocks. The huge brain/console pairing is removed; generated dark neural artwork belongs in the final CTA. Card/footer backgrounds are slanted independently of text and focusable content. Workspace uses a real Radix Sheet, scoped CSS, platform black surfaces, actual account/language routes in the rail and44px action targets. Login has isolated neutral surfaces, a raised dark card,60px fields and64px action.

Independent review found and then visually rechecked four P2 findings: tablet artwork clipping, a visible black brain rectangle, missing card/footer slopes, and duplicated about copy. All were corrected before the final recheck. See [independent review](docs/verification/green-reference-repair/independent-visual-review.md) for its exact evidence and limits.

## Verified surfaces and deliberate adaptations

| Surface | Evidence / adaptation |
| --- | --- |
| Color | Original background#050505/card#0b0b0b/text#ebebeb/ring#10b981 retained. Workspace now uses the exact platform black surfaces per the latest owner correction; Echo supplies geometry, and emerald stays local. Neutral primary is not replaced with green. |
| Type | Actual browser-loaded Anybody variable100–900/wdth50–150; Inter UI; IBM Plex Arabic joining and real weights. No synthetic bold or scaled glyphs. |
| Workspace | Rail14.60%; composer59.18% of main. Four actual suggestions, truthful scope/status and request stages replace the reference's fictional history/tools. Welcome is higher and wider because current product content remains. |
| Login | Scene32.5%; fields60px; action64px. Card is shorter and lower than Nexora because no unsupported OAuth row is copied. Existing public assistant/brief links remain. |
| Graphics | Image Gen assets saved as WebP and visually inspected: smoked ribbon and dark neural brain. Existing architectural artwork reused. No Superdesign canvas result is claimed: CLI preflight reported unauthenticated. |
| Interaction | 18 page cases/12 interactions; separate workspace Sheet/focus/retry/short-height checks; login visibility/validation/missing configuration; marketing keyboard tabs/FAQ/menu/skip link/reveals. |
| Responsive / motion | AR/EN390/768/1440, normal-motion reveals and reduced-motion captures. Text scaling200% checked separately; this is not a browser zoom or screen-reader certification. |

No actionable P1/P2 visual defect remains **in the positions and states rechecked**, not every possible application state. Full approved product copy makes some sections taller than AI.Now; testimonials/newsletter/OAuth/history were not invented. Mobile omits the large decorative CTA brain intentionally. Real Supabase sign-in and live provider streaming remain unverified locally; browser SSE/error cases are explicitly simulated. Build/test success is recorded separately from this visual verdict.

## Final measurement review

Better Design inspect-spacing completed on actual AR/EN DOM at390/1440/1728. The initial report found touch targets below44px; those defects were fixed and recaptured. Final report has no touch-target finding, but still records0 critical/8 serious/6 moderate heuristic findings. Independent review documents why the remaining auto-margin/semantic-group gaps and unequal text wrapping inside equal-height buttons are not release-blocking defects; it does **not** claim an automated tool pass. Both reports remain beside the independent review. Contrast arithmetic: #ebebeb on#05050517.10:1, #b3b3b3 on#0b0b0b9.39:1, and #10b981 on#0b0b0b7.76:1. This is token contrast evidence, not comprehensive WCAG certification.

The final density repair displays all four suggestion frames at390×900 in both languages, and EN768×900. The existing short question is visible; the complete original introduction remains inside the scope disclosure. At short heights conversation scrolling remains available and context/privacy stay visible.

Latest measured spacing report: `spacing-review-density-final.json` (0 critical/7 serious/6 moderate heuristics, zero touch-target findings). The same independent reasoning applies to the remaining intentional auto-margins, semantic groups and differing text lengths. Final production-build density and disclosure lengths are in `workspace-final-density.json`. No further local tests are planned after the owner’s instruction to proceed to release.
