# Green reference design QA

final result: passed

## Source and implementation evidence

Owner-selected references: AI.Now composite `1000109824.png` (1600×1200), AI.Now full page `1000109825.png` (752×3517), Echo workspace `1000109821.jpg` (1280×1000), Nexora login `1000109822.jpg` (853×1280), and AgentFlow artwork `1000109820.png` (752×564). Original attachments were opened and visually inspected in this task; their exact task-local paths are recorded in the conversation.

Browser-rendered implementation: Next production build at the current local instance, Chromium 153, deviceScaleFactor 1, empty/default states, reduced motion for stable captures. Additional standard captures cover Arabic and English at 390, 768 and 1440 CSS pixels with 900px height.

Combined source/implementation inputs, opened together before judging:

- [Hero comparison](docs/verification/green-reference/hero-comparison.webp): source hero cropped to 981×633, implementation captured at 1440×929. Equal panel widths normalize the presentation board; the original source's actual CSS viewport is unknown. No pixel-exact source font identification is claimed.
- [Workspace comparison](docs/verification/green-reference/workspace-comparison.webp): source app interior cropped to 1130×798 to remove the light presentation canvas; implementation captured at 1440×1017. These share the same aspect ratio, normalized by width, without stretching.
- [Login comparison](docs/verification/green-reference/login-comparison.webp): source and implementation both 853×1280 pixels / CSS viewport at density 1. The implementation is captured after readiness and before interaction.
- [Focused field comparison](docs/verification/green-reference/login-fields-comparison.webp): enlarged source and implementation email/password/action regions. Labels, icon placement, inset surfaces, rounded corners, spacing, visibility control and raised action were checked at readable scale.

Raw implementation captures: `output/green-local-final/qa-en.png`, `qa-en-agentnexos.png`, `qa-en-login.png`; standard mobile/desktop and below-fold captures use the `final-{locale}-{route}-{width}.png` names in the same directory. Runtime reports are separate from the normalized comparison boards.

## Comparison history and fixes

1. **P2, Arabic mobile hero:** the heavy heading wrapped into two rows above its light companion, unlike the intended two-line hierarchy. Reduced the Arabic mobile display size to 44px. Post-fix `final-ar-home-390.png` visibly retains “ذكاء اصطناعي” on one row and “من الأساس.” on its own light row; both actions remain visible.
2. **P2, workspace density:** excessive welcome padding pushed suggestion details below the conversation viewport. Reduced content/welcome padding and compacted the side-rail rhythm. The matched-aspect workspace comparison now shows the complete emblem, heading, four actual suggestions and composer. The 18-case browser run checks composer bounds and functional suggestions/reset.
3. **P2, login proportion:** the initial architectural area occupied about 40% of desktop width. Changed the split to approximately 32.5% / 67.5% and corrected intermediate-width padding. The 853×1280 comparison confirms the architectural strip and raised panel relationships.
4. **P2, composer focus:** the browser's textarea outline created a second inner rectangle. Moved the visible focus outline to the enclosing form, retaining an explicit two-pixel keyboard indicator around the composer instead.
5. **P2, lower-page reveal baseline defect:** tall sections could fail the proportional observer threshold. Changed to first intersection and retained the assertion that scrolled content becomes visible; the complete release suite reports this separately.

These corrections were rebuilt before final captures. Initial browser-harness issues (a broad alert locator matching Next's route announcer, and screenshots taken before hydration) were corrected by scoping the locator and waiting for actual client readiness. They are not represented as successful application tests before the rerun.

The full 108-case regression later found one intermittent Arabic mobile reveal-timing failure. Standalone reproduction showed every reveal visible after rendering; the runner now waits for two actual animation frames per scroll step instead of relying on a wall-clock delay alone. The final affected-scope rerun passed all six homepage cases and both complete interaction journeys, with the same visibility assertions retained. The complete route catalog is preserved when selecting only homepage cases.

## Required fidelity surfaces

| Surface | Result and intentional adaptations |
| --- | --- |
| Fonts / typography | Michroma closely follows the wide geometric Latin reference; Inter preserves small UI readability; genuine Tajawal Arabic supports joining, numerals and light/heavy hierarchy. The screenshot's original font cannot be conclusively identified from raster pixels. Marketing headlines are geometric; workspace/login retain the reference's calmer sans hierarchy. |
| Spacing / rhythm | Centered hero, raised navigation tray, two primary actions, oblique dark cards, section labels, architectural split, inset fields and illuminated composer are present. Long approved product copy intentionally increases section heights. Mobile stacks preserve readable text and persistent composer access. |
| Color / tokens | Black and deep green surfaces, mint/emerald highlights, white primary copy and muted secondary copy. Purple from Echo and copper from Nexora were deliberately replaced with the owner's green palette. |
| Images | Three inspected original raster assets: continuous glossy glass ribbon, emerald neural anatomy and dark stone architecture with green lighting. WebP compression preserves fine detail and black edge blending. No generated text, CSS illustration substitute or foreign reference branding is used. |
| Copy / content | Existing Arabic/English marketing and assistant content is retained. Four real suggestions replace the reference's three sample cards. Unsupported attachments, music, image generation, subscription upsells, fabricated history, social auth and fake testimonials are deliberately absent. The login gateway discloses unavailable/rejected sign-in honestly. |

Calculated sRGB token contrast: login action text 11.22:1, field labels 11.87:1, input placeholders 4.73:1 and green section headings 13.56:1 against their specified solid surfaces. These checks support the inspected controls; they do not constitute a complete accessibility audit of every state or image background.

## Behavior and responsive evidence

`scripts/verify-green-reference.mjs` completed 18 page cases and 12 interactions with no failures on the final built styles. It checks HTTP, RTL/LTR, loaded heading fonts, horizontal overflow, JavaScript/hydration exceptions, visible composer bounds, suggestion population, new-conversation reset, password show/hide, and rejected/unconfigured sign-in without sending credentials to a real account service. The screenshot state is reset after interactions. Live authentication remains unverified.

The existing release regression additionally covers public routes, real internal links, images, canonical metadata, menus, focus containment, Escape, skip links, reduced motion, keyboard tabs/FAQ, local brief validation/download/reset and legacy API closure. Its final outcomes and hosted checks are recorded in `docs/verification/green-reference/release.md`.

## Residual P3 differences

- Generated artwork is an original close art-direction match rather than the reference author's exact mesh or photograph.
- The original screenshot's font name is unknown; freely available matching typography is used and documented.
- Existing product scope and copy mean section counts, suggestion counts, labels and account options differ deliberately from the reference products. No unsupported feature is added to imitate decorative chrome.

No actionable P0/P1/P2 visual finding remains in the inspected target states. This is visual/interaction QA, not a claim of live account access, comprehensive WCAG certification or production publication.
