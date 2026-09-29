# Phase 2 — navigation structure and template review

Date: 2026-09-29

## Reference review

The supplied archive `compute-the-platform-to-build-and-ship-ai-agents.zip` was extracted to a temporary directory and used only as a read-only reference. Its navigation implementation confirmed that the original template intentionally used a full-width transparent header, an 80px bar, and the serif display face for the brand. Those choices made the header read as part of the hero image rather than a stable navigation surface.

## Changes

- Preserved the hero, all template imagery, section order, and page content.
- Converted the header into a restrained glass navigation surface with a consistent maximum width, border, blur, and external spacing.
- Increased the visual weight of the Agentnexos wordmark and changed only the wordmark to the straight sans face.
- Added a small AI descriptor at wider viewports.
- Increased the compact scrolled state from 56px to 64px.
- Moved the desktop navigation breakpoint from 768px to 1024px so tablet widths use the menu instead of compressing links, languages, and calls to action.
- Added light/dark-aware locale-switcher colors.
- Kept mobile scroll locking, Escape-to-close, `aria-expanded`, and the labelled primary navigation landmark.

## Verification

- `pnpm run typecheck`: passed.
- `pnpm run i18n:check`: passed with no missing Arabic keys or blank fallbacks.
- `pnpm run build`: passed for `/ar` and `/en`.
- Visual checks completed at 390px, 768px, and 1440px in Arabic, plus 1440px in English.
- Initial, scrolled, open-menu, and Escape-to-close states verified.
- No horizontal overflow at 390px.
- The only local console error is the expected Vercel Analytics script 404 outside Vercel; production verification is required after deployment.
