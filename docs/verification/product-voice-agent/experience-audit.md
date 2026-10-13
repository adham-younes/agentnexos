# Experience audit and implementation decisions

Source: live production main45398da, captured with user-authorized Playwright before UI changes. Screenshots: output/product-upgrade/before-ar-home.png (1440), before-ar-start.png (1280), before-en-start-mobile.png (390). Images inspected, not inferred from source alone.

1. Homepage: visual identity is consistent and the console makes a workflow tangible. The main promise describes smart work/human direction without naming the product category. Replace it with custom agent systems and practical process examples; keep the approved visual system.
2. Brief entry: clear local-only disclosure is useful, but a broad headline and seven empty required fields demand domain knowledge before offering help. Add field guidance and an explicit fictional example. Never overwrite a populated brief when loading the example. Keep download and no-submission semantics.
3. Mobile brief: stacked layout is legible. Long descriptive copy and disclosure dominate the entry; prioritize what the brief produces and why the team would use it. Verify new text wrapping and tap targets at390/768/1440.
4. Design assistant: product copy should say what output the user can prepare. Runtime inspection shows narrow followups lose workflow routing when they omit explicit keywords. Inherit only a previous USER task for referential followups; keep greetings and new topics independent. Explicit tool review must happen before claiming a reviewed design.

Accessibility: screenshots support visual hierarchy observations only. Keyboard order, collapsed-menu inertness, reduced-motion, field descriptions, overflow and actual export/reset require interactive checks. No usability study or conversion lift is claimed.

Follow-up changes preserve Cyber Serif colors/fonts/layout/effects. No new visual concept or fabricated integration. Existing legal provider/privacy limits retained.
