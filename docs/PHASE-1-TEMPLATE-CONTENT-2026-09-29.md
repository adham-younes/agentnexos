# Phase 1 — template-preserving content upgrade

Date: 2026-09-29
Branch: `phase-1-template-content`

## Objective

Reposition Agentnexos as a MENA-focused builder of enterprise agent systems without replacing the approved Vercel template, its imagery, its section order, or its core visual language.

## Preserved

- Existing hero video and all section images.
- Existing section order, dark visual system, display typography, motion language, cards, and spacing model.
- Arabic and English routes (`/ar` and `/en`).

## Updated

- Replaced the document-processing proposition with enterprise agent-system positioning.
- Reframed capabilities around workflow discovery, custom agents, tool integrations, and controlled operations.
- Reframed delivery as discover, build, and operate.
- Removed user-visible infrastructure, certification, pricing, testimonial, and performance claims that are not backed by production evidence.
- Replaced dead `#` navigation actions with working page anchors.
- Added real metadata and existing project icons.
- Improved the mobile developer section width and mobile menu behaviour, including scroll locking and Escape-to-close.

## Verification gates

- `pnpm run typecheck`: passed.
- `pnpm run i18n:check`: passed with no missing Arabic keys or blank fallbacks.
- `pnpm run build`: passed for `/ar` and `/en`.
- Browser checks at 390, 768, and 1440 CSS pixels: no horizontal overflow.
- Visual captures cover Arabic and English, mobile, tablet, and desktop.
- Link audit: no rendered empty or `#` links.
- Known local-only console noise: Vercel Analytics returns 404 outside Vercel. The favicon metadata now points to the existing `/icon.svg` and `/apple-icon.png` assets.

## Release rule

This phase is published as a Vercel Preview first. It must not be promoted or merged to production until the template and content are visually approved.
