> Source snapshot: baseline b8e5a24, captured before the owner-selected Cyber Serif implementation. Refresh affected context when resuming design.

# Current theme tokens

## Compact summary

Actual current palette (pre-redesign), no separate .dark token palette:
```css

  --background: oklch(0.06 0.008 260);
  --foreground: oklch(0.94 0.005 90);
  --card: oklch(0.09 0.008 260);
  --card-foreground: oklch(0.94 0.005 90);
  --popover: oklch(0.09 0.008 260);
  --popover-foreground: oklch(0.94 0.005 90);
  --primary: oklch(0.94 0.005 90);
  --primary-foreground: oklch(0.06 0.008 260);
  --secondary: oklch(0.12 0.008 260);
  --secondary-foreground: oklch(0.94 0.005 90);
  --muted: oklch(0.12 0.008 260);
  --muted-foreground: oklch(0.55 0.015 90);
  --accent: oklch(0.14 0.01 260);
  --accent-foreground: oklch(0.94 0.005 90);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.94 0.005 90);
  --border: oklch(0.18 0.008 260);
  --input: oklch(0.14 0.008 260);
  --ring: oklch(0.94 0.005 90);
  --chart-1: oklch(0.94 0.005 90);
  --chart-2: oklch(0.72 0.01 90);
  --chart-3: oklch(0.52 0.015 90);
  --chart-4: oklch(0.35 0.01 90);
  --chart-5: oklch(0.20 0.008 90);
  --radius: 0.25rem;
  --sidebar: oklch(0.06 0.008 260);
  --sidebar-foreground: oklch(0.94 0.005 90);
  --sidebar-primary: oklch(0.94 0.005 90);
  --sidebar-primary-foreground: oklch(0.06 0.008 260);
  --sidebar-accent: oklch(0.12 0.008 260);
  --sidebar-accent-foreground: oklch(0.94 0.005 90);
  --sidebar-border: oklch(0.18 0.008 260);
  --sidebar-ring: oklch(0.55 0.015 90);
```

Fonts: Instrument Sans body; Instrument Serif display; JetBrains Mono metadata; IBM Plex Sans Arabic 400/500/600/700 Arabic override. Sizes use Tailwind scale (text-xs 12px, sm 14px, base 16px, lg 18px, xl 20px, 2xl 24px, 3xl 30px, 4xl 36px, 5xl 48px). Spacing follows Tailwind default 4px unit. Radius token .25rem; sm calc(-4px), md calc(-2px), lg token, xl calc(+4px); actual editorial panels frequently override rounded-2xl/3xl and pills. Breakpoints default sm640/md768/lg1024/xl1280/2xl1536. Common page max-width 6xl (1152px), home1400px, workspace1600px. Navigation shadows 0 18px 60px rgba(0,0,0,.22/.12). Existing accents #eca8d6 plus multicolor word gradient. Global reduced-motion styles present.

User-authorized target: #050505 background, #EBEBEB foreground, restrained #10b981, Newsreader display, Inter body, Space Grotesk metadata, Arabic companion required. Weighted easing cubic-bezier(.16,1,.3,1), glass2%/blur12px, 24px panel corners/pill controls. This target supersedes historical preservation rules; runtime restrictions remain.

## Complete raw source

## `app/globals.css`

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@source "../node_modules/streamdown/dist/*.js";

/* Fix utility-layer precedence without changing the English template font. */
html[lang^="ar"] body,
html[lang^="ar"] button,
html[lang^="ar"] input,
html[lang^="ar"] textarea {
  font-family: var(--font-arabic), var(--font-instrument), sans-serif;
}

/* Inherit the template's dark palette; only workspace contrast is scoped here. */
.agent-workspace {
  --muted-foreground: oklch(0.72 0.01 90);
  color-scheme: dark;
}
.agent-workspace :is(button, a, textarea):focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 4px;
}
.agent-workspace [data-streamdown="table-wrapper"] { max-width: 100%; overflow-x: auto; }
.agent-workspace pre { max-width: 100%; overflow-x: auto; direction: ltr; }

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.06 0.008 260);
  --foreground: oklch(0.94 0.005 90);
  --card: oklch(0.09 0.008 260);
  --card-foreground: oklch(0.94 0.005 90);
  --popover: oklch(0.09 0.008 260);
  --popover-foreground: oklch(0.94 0.005 90);
  --primary: oklch(0.94 0.005 90);
  --primary-foreground: oklch(0.06 0.008 260);
  --secondary: oklch(0.12 0.008 260);
  --secondary-foreground: oklch(0.94 0.005 90);
  --muted: oklch(0.12 0.008 260);
  --muted-foreground: oklch(0.55 0.015 90);
  --accent: oklch(0.14 0.01 260);
  --accent-foreground: oklch(0.94 0.005 90);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.94 0.005 90);
  --border: oklch(0.18 0.008 260);
  --input: oklch(0.14 0.008 260);
  --ring: oklch(0.94 0.005 90);
  --chart-1: oklch(0.94 0.005 90);
  --chart-2: oklch(0.72 0.01 90);
  --chart-3: oklch(0.52 0.015 90);
  --chart-4: oklch(0.35 0.01 90);
  --chart-5: oklch(0.20 0.008 90);
  --radius: 0.25rem;
  --sidebar: oklch(0.06 0.008 260);
  --sidebar-foreground: oklch(0.94 0.005 90);
  --sidebar-primary: oklch(0.94 0.005 90);
  --sidebar-primary-foreground: oklch(0.06 0.008 260);
  --sidebar-accent: oklch(0.12 0.008 260);
  --sidebar-accent-foreground: oklch(0.94 0.005 90);
  --sidebar-border: oklch(0.18 0.008 260);
  --sidebar-ring: oklch(0.55 0.015 90);
}

@theme inline {
  --font-sans: var(--font-instrument), 'Instrument Sans', system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), 'JetBrains Mono', monospace;
  --font-display: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    overflow-x: clip;
    max-width: 100%;
  }
  html {
    scroll-behavior: smooth;
    overflow-x: clip;
    max-width: 100%;
  }

  /* Arabic face is opt-in via :lang(ar), never a global override, so the
     Latin template layout (LTR) keeps rendering with the original fonts. */
  :lang(ar) body,
  :lang(ar) button,
  :lang(ar) input,
  :lang(ar) select,
  :lang(ar) textarea {
    font-family: var(--font-arabic), var(--font-instrument), system-ui, sans-serif;
  }

  /* The template's display face is a Latin serif; Arabic has no serif companion,
     so display headings in Arabic use the Arabic sans face instead of falling
     back to a system font. */
}

@layer utilities {
  .font-display {
    font-family: var(--font-display);
  }

  /* Arabic display override lives here (not in @layer base) because the base
     .font-display rule above would otherwise win by layer order. */
  :lang(ar) .font-display {
    font-family: var(--font-arabic), var(--font-instrument), system-ui, sans-serif;
  }
  
  .text-stroke {
    -webkit-text-stroke: 1.5px currentColor;
    -webkit-text-fill-color: transparent;
  }
  
  .marquee {
    animation: marquee 30s linear infinite;
  }
  
  .marquee-reverse {
    animation: marquee-reverse 25s linear infinite;
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  @keyframes marquee-reverse {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  
  .line-reveal {
    clip-path: inset(0 100% 0 0);
    animation: line-reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
  }
  
  @keyframes line-reveal {
    to { clip-path: inset(0 0 0 0); }
  }
  
  .hover-lift {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .hover-lift:hover {
    transform: translateY(-4px);
  }
  
  .letter-spin {
    display: inline-block;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .letter-spin:hover {
    transform: rotateY(360deg);
  }
  
  .animate-char-in {
    animation: char-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    opacity: 0;
    transform: translateY(60%);
  }
  
  @keyframes char-in {
    0% {
      opacity: 0;
      transform: translateY(60%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .noise-overlay {
    position: relative;
  }
  
  .noise-overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 1;
  }
  
  .how-it-works-bg {
    background-color: oklch(0.10 0.008 260);
  }

  .word-gradient {
    background: linear-gradient(
      45deg,
      #eca8d6 0%,
      #a78bfa 25%,
      #67e8f9 50%,
      #fbbf24 75%,
      #eca8d6 100%
    );
    background-size: 300% 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-shift 1.5s ease infinite;
  }

  @keyframes gradient-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
}

/* Keyboard access and motion preferences leave the default template intact. */
.skip-link { position: fixed; inset-inline-start: 1rem; top: 1rem; z-index: 100; padding: .75rem 1rem; background: var(--foreground); color: var(--background); transform: translateY(-200%); border-radius: .5rem; }
.skip-link:focus { transform: translateY(0); outline: 2px solid var(--foreground); outline-offset: 4px; }
:where(a, button, input, select, textarea):focus-visible { outline: 2px solid var(--foreground); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; animation-delay: 0s !important; transition-duration: 0s !important; transition-delay: 0s !important; scroll-behavior: auto !important; }
  .animate-char-in { opacity: 1; transform: none; }
  .hover-lift:hover, .letter-spin:hover { transform: none; }
}

```
## `components/theme-provider.tsx`

```tsx
'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

```
## `app/[locale]/layout.tsx`

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "../globals.css";
import { LocaleProvider } from "@/lib/i18n/use-t";
import {
  isLocale,
  localeBcp47,
  localeDir,
  locales,
  type Locale,
} from "@/lib/i18n/config";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

// Arabic companion face — added alongside the template fonts, never replacing
// them, so the English (LTR) rendering stays identical.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr
    ? "Agentnexos — أنظمة وكيلة للمؤسسات"
    : "Agentnexos — Enterprise Agent Systems";
  const description = isAr
    ? "أنظمة وكلاء مخصصة لعمليات المؤسسات في مصر والخليج والشرق الأوسط. اكتشف حالات الاستخدام ومنهج ربط المعرفة والأدوات والموافقات، واستكشف مثال عمل توضيحيًا."
    : "Custom agent systems for enterprise workflows in Egypt, the Gulf, and MENA. Explore use cases, our approach to knowledge, tools and approvals, and an illustrative workflow.";

  const baseUrl = "https://compute-the-platform-to-build-six-fawn.vercel.app";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "Agentnexos",
      locale: isAr ? "ar_AR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-dark-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
        { url: "/icon-light-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      ],
      apple: "/apple-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typed: Locale = locale;

  return (
    <html lang={localeBcp47[typed]} dir={localeDir[typed]}>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${plexArabic.variable} font-sans antialiased`}
      >
        <a href="#main-content" className="skip-link">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
        <LocaleProvider locale={typed}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}

```

No tailwind.config file exists: Tailwind v4 configuration is CSS-first in globals.css.

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;

```
