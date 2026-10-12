> Source snapshot: baseline b8e5a24, captured before the owner-selected Cyber Serif implementation. Refresh affected context when resuming design.

# Complete local import trees

Every route includes the shared locale layout tree. External packages omitted. Repeated local branches retained; cycles marked.

## Shared locale layout
```text
- app/globals.css
- lib/i18n/use-t.tsx
  - lib/i18n/config.ts
  - lib/i18n/dictionaries.ts
    - lib/i18n/config.ts
- lib/i18n/config.ts
```

## /[locale]/[page]
Entry: `app/[locale]/[page]/page.tsx`

```text
- components/site/public-page.tsx
  - components/site/page-header.tsx
    - lib/i18n/use-t.tsx
      - lib/i18n/config.ts
      - lib/i18n/dictionaries.ts
        - lib/i18n/config.ts
    - components/site/locale-switcher.tsx
      - lib/i18n/config.ts
      - lib/i18n/use-t.tsx
        - lib/i18n/config.ts
        - lib/i18n/dictionaries.ts
          - lib/i18n/config.ts
  - lib/content/public-pages.ts
    - lib/content/product-pages.ts
  - lib/i18n/config.ts
- lib/content/product-pages.ts
- lib/i18n/config.ts
```

## /[locale]/agentnexos
Entry: `app/[locale]/agentnexos/page.tsx`

```text
- lib/i18n/config.ts
- components/agent/workspace.tsx
  - components/ai-elements/conversation.tsx
    - components/ui/button.tsx
      - lib/utils.ts
    - lib/utils.ts
  - components/ai-elements/message.tsx
    - components/ui/button.tsx
      - lib/utils.ts
    - components/ui/button-group.tsx
      - lib/utils.ts
      - components/ui/separator.tsx
        - lib/utils.ts
    - components/ui/tooltip.tsx
      - lib/utils.ts
    - lib/utils.ts
  - components/site/locale-switcher.tsx
    - lib/i18n/config.ts
    - lib/i18n/use-t.tsx
      - lib/i18n/config.ts
      - lib/i18n/dictionaries.ts
        - lib/i18n/config.ts
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
  - lib/agents/context.ts
  - lib/content/agent-workspace.ts
  - lib/agents/reservation.ts
```

## /[locale]
Entry: `app/[locale]/page.tsx`

```text
- components/landing/navigation.tsx
  - components/ui/button.tsx
    - lib/utils.ts
  - components/site/locale-switcher.tsx
    - lib/i18n/config.ts
    - lib/i18n/use-t.tsx
      - lib/i18n/config.ts
      - lib/i18n/dictionaries.ts
        - lib/i18n/config.ts
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/hero-section.tsx
  - hooks/use-reduced-motion.ts
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/features-section.tsx
  - hooks/use-reduced-motion.ts
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/how-it-works-section.tsx
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/infrastructure-section.tsx
  - hooks/use-reduced-motion.ts
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/metrics-section.tsx
  - hooks/use-reduced-motion.ts
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/integrations-section.tsx
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/security-section.tsx
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/developers-section.tsx
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/testimonials-section.tsx
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/pricing-section.tsx
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/cta-section.tsx
  - components/ui/button.tsx
    - lib/utils.ts
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
- components/landing/footer-section.tsx
  - hooks/use-reduced-motion.ts
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
```

## /[locale]/privacy
Entry: `app/[locale]/privacy/page.tsx`

```text
- components/site/public-page.tsx
  - components/site/page-header.tsx
    - lib/i18n/use-t.tsx
      - lib/i18n/config.ts
      - lib/i18n/dictionaries.ts
        - lib/i18n/config.ts
    - components/site/locale-switcher.tsx
      - lib/i18n/config.ts
      - lib/i18n/use-t.tsx
        - lib/i18n/config.ts
        - lib/i18n/dictionaries.ts
          - lib/i18n/config.ts
  - lib/content/public-pages.ts
    - lib/content/product-pages.ts
  - lib/i18n/config.ts
- lib/content/public-pages.ts
  - lib/content/product-pages.ts
- lib/i18n/config.ts
```

## /[locale]/security
Entry: `app/[locale]/security/page.tsx`

```text
- components/site/public-page.tsx
  - components/site/page-header.tsx
    - lib/i18n/use-t.tsx
      - lib/i18n/config.ts
      - lib/i18n/dictionaries.ts
        - lib/i18n/config.ts
    - components/site/locale-switcher.tsx
      - lib/i18n/config.ts
      - lib/i18n/use-t.tsx
        - lib/i18n/config.ts
        - lib/i18n/dictionaries.ts
          - lib/i18n/config.ts
  - lib/content/public-pages.ts
    - lib/content/product-pages.ts
  - lib/i18n/config.ts
- lib/content/public-pages.ts
  - lib/content/product-pages.ts
- lib/i18n/config.ts
```

## /[locale]/solutions
Entry: `app/[locale]/solutions/page.tsx`

```text
- components/site/public-page.tsx
  - components/site/page-header.tsx
    - lib/i18n/use-t.tsx
      - lib/i18n/config.ts
      - lib/i18n/dictionaries.ts
        - lib/i18n/config.ts
    - components/site/locale-switcher.tsx
      - lib/i18n/config.ts
      - lib/i18n/use-t.tsx
        - lib/i18n/config.ts
        - lib/i18n/dictionaries.ts
          - lib/i18n/config.ts
  - lib/content/public-pages.ts
    - lib/content/product-pages.ts
  - lib/i18n/config.ts
- lib/content/public-pages.ts
  - lib/content/product-pages.ts
- lib/i18n/config.ts
```

## /[locale]/start
Entry: `app/[locale]/start/page.tsx`

```text
- components/site/page-header.tsx
  - lib/i18n/use-t.tsx
    - lib/i18n/config.ts
    - lib/i18n/dictionaries.ts
      - lib/i18n/config.ts
  - components/site/locale-switcher.tsx
    - lib/i18n/config.ts
    - lib/i18n/use-t.tsx
      - lib/i18n/config.ts
      - lib/i18n/dictionaries.ts
        - lib/i18n/config.ts
- components/site/project-brief.tsx
  - lib/project-brief.ts
  - lib/i18n/config.ts
- lib/i18n/config.ts
```

## /[locale]/terms
Entry: `app/[locale]/terms/page.tsx`

```text
- components/site/public-page.tsx
  - components/site/page-header.tsx
    - lib/i18n/use-t.tsx
      - lib/i18n/config.ts
      - lib/i18n/dictionaries.ts
        - lib/i18n/config.ts
    - components/site/locale-switcher.tsx
      - lib/i18n/config.ts
      - lib/i18n/use-t.tsx
        - lib/i18n/config.ts
        - lib/i18n/dictionaries.ts
          - lib/i18n/config.ts
  - lib/content/public-pages.ts
    - lib/content/product-pages.ts
  - lib/i18n/config.ts
- lib/content/public-pages.ts
  - lib/content/product-pages.ts
- lib/i18n/config.ts
```

