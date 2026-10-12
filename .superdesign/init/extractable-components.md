> Source snapshot: baseline b8e5a24, captured before the owner-selected Cyber Serif implementation. Refresh affected context when resuming design.

# Extractable UI catalog

## Navigation
- Source: `components/landing/navigation.tsx`
- Category: layout
- Description: Fixed responsive navigation with focus trapping and locale controls
- Extractable props: none; state internal
- Hardcoded: brand, menu labels/URLs resolved with locale, icons, classes

## FooterSection
- Source: `components/landing/footer-section.tsx`
- Category: layout
- Description: Editorial footer and product links
- Extractable props: none
- Hardcoded: links, labels, panoramic image, CSS

## PageHeader
- Source: `components/site/page-header.tsx`
- Category: layout
- Description: Secondary-page header
- Extractable props: none; locale from provider
- Hardcoded: logo, page links, home link, icons

## LocaleSwitcher
- Source: `components/site/locale-switcher.tsx`
- Category: basic
- Description: Locale path switching
- Extractable props: inverted boolean default false
- Hardcoded: language labels and locales, CSS

## PublicPage
- Source: `components/site/public-page.tsx`
- Category: layout
- Description: Content-driven public page shell
- Extractable props: page, locale
- Hardcoded: layout classes, imagery mapping, navigation labels

## Button
- Source: `components/ui/button.tsx`
- Category: basic
- Description: Radix Slot button with variants
- Extractable props: disabled; asChild
- Hardcoded: variants, CSS

## Card
- Source: `components/ui/card.tsx`
- Category: basic
- Description: Composable card primitives
- Extractable props: none
- Hardcoded: CSS and semantic sections

## Badge
- Source: `components/ui/badge.tsx`
- Category: basic
- Description: Compact status/tag primitive
- Extractable props: none
- Hardcoded: variant CSS

## ProjectBriefForm
- Source: `components/site/project-brief.tsx`
- Category: basic
- Description: Local workflow brief form
- Extractable props: locale
- Hardcoded: field labels, effects, validation messages

## Conversation
- Source: `components/ai-elements/conversation.tsx`
- Category: basic
- Description: Auto-scrolling chat region
- Extractable props: initial, resize
- Hardcoded: scroll affordance and layout

## Message
- Source: `components/ai-elements/message.tsx`
- Category: basic
- Description: Message display and markdown response
- Extractable props: from
- Hardcoded: styling and markdown rendering

