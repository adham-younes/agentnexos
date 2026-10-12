> Source snapshot: baseline b8e5a24, captured before the owner-selected Cyber Serif implementation. Refresh affected context when resuming design.

# Shared layouts

LocaleLayout provides HTML language, direction, fonts, skip link, translation context, analytics. Home uses Navigation and FooterSection; public/start pages use PageHeader. Workspace embeds a separate header/sidebar in components/agent/workspace.tsx. ThemeProvider exists but is not wired into LocaleLayout.

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
## `components/landing/navigation.tsx`

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { useT, useLocale } from "@/lib/i18n/use-t";

const navLinks = [
  { key: "nav.capabilities", name: "Platform", href: "/platform" },
  { key: "nav.solutions", name: "Solutions", href: "/solutions" },
  { key: "nav.process", name: "Process", href: "#how-it-works" },
  { key: "nav.infra", name: "Industries", href: "/industries" },
  { key: "nav.security", name: "Security", href: "/security" },
  { key: "nav.agentSpace", name: "Agent Space", href: "/agentnexos" },
];

export function Navigation() {
  const t = useT();
  const locale = useLocale();
  const resolveHref = (href: string) => (href.startsWith("/") ? `/${locale}${href}` : href);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDark = !isScrolled && !isMobileMenuOpen;
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [...document.querySelectorAll<HTMLElement>("#main-content, #site-footer")].map(element => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    const focusFrame = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
      if (event.key === "Tab") {
        const controls = [...(headerRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])].filter(element => element.tabIndex >= 0 && element.offsetParent !== null && !element.closest("[inert]"));
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const closeOnDesktop = () => { if (window.innerWidth >= 1024) setIsMobileMenuOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => { element.inert = inert; });
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
      if (toggle?.isConnected) toggle.focus();
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed z-50 left-3 right-3 sm:left-5 sm:right-5 transition-[top] duration-500 ${
        isScrolled ? "top-3" : "top-4"
      }`}
    >
      <nav
        aria-label={t("nav.primary", "Primary navigation")}
        className={`relative z-50 mx-auto max-w-[1320px] rounded-2xl border backdrop-blur-xl transition-all duration-500 ${
          isDark
            ? "bg-black/35 border-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
            : "bg-background/92 border-foreground/10 shadow-[0_18px_60px_rgba(0,0,0,0.12)]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-4 sm:px-6 lg:px-8 ${
            isScrolled ? "h-16" : "h-[72px]"
          }`}
        >
          {/* Logo */}
          <a href="#top" tabIndex={isMobileMenuOpen ? -1 : undefined} className="flex items-center gap-2.5 group shrink-0">
            <span className={`font-sans text-[22px] sm:text-[25px] font-semibold tracking-[-0.035em] leading-none transition-colors duration-500 ${isDark ? "text-white" : "text-foreground"}`}>Agentnexos</span>
            <span className={`hidden sm:inline font-mono text-[9px] tracking-[0.12em] transition-colors duration-500 ${isDark ? "text-white/45" : "text-muted-foreground"}`}>AI</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={resolveHref(link.href)}
                className={`text-[13px] xl:text-sm font-medium transition-colors duration-300 relative group ${isDark ? "text-white/65 hover:text-white" : "text-foreground/65 hover:text-foreground"}`}
              >
                {t(link.key, link.name)}
                <span className={`absolute -bottom-1.5 start-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isDark ? "bg-white" : "bg-foreground"}`} />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <LocaleSwitcher inverted={isDark} />
            <a href="#how-it-works" className={`text-[13px] font-medium transition-colors duration-500 ${isDark ? "text-white/65 hover:text-white" : "text-foreground/65 hover:text-foreground"}`}>
              {t("nav.signIn", "Our process")}
            </a>
            <Button asChild
              size="sm"
              className={`h-10 rounded-full px-5 text-[13px] font-semibold transition-all duration-500 ${isDark ? "bg-white hover:bg-white/90 text-black" : "bg-foreground hover:bg-foreground/90 text-background"}`}
            >
              <a href={`/${locale}/start`}>{t("nav.deployAgent", "Start a project")}</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            ref={toggleRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-full border transition-colors duration-500 ${isDark ? "border-white/20 text-white hover:bg-white/10" : "border-foreground/15 text-foreground hover:bg-foreground/5"}`}
            aria-label={t("nav.toggleMenu", "Toggle menu")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        ref={menuRef}
        id="mobile-navigation"
        role="dialog"
        aria-label={t("nav.primary", "Primary navigation")}
        aria-modal={isMobileMenuOpen || undefined}
        aria-owns={isMobileMenuOpen ? "mobile-menu-toggle" : undefined}
        inert={!isMobileMenuOpen}
        aria-hidden={!isMobileMenuOpen}
        className={`lg:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full overflow-y-auto px-6 sm:px-8 pt-32 pb-8">
          {/* Navigation Links */}
          <div className="flex-1 shrink-0 flex flex-col justify-center gap-5 sm:gap-8 pb-6">
            {navLinks.map((link, i) => (
              <a
                key={link.key}
                href={resolveHref(link.href)}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-4xl sm:text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {t(link.key, link.name)}
              </a>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div className={`pt-8 border-t border-foreground/10 transition-all duration-500 ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            {/* Switcher sits on its own row: sharing the CTA row overflowed the
                viewport on narrow screens once a third item was added. */}
            <LocaleSwitcher />
            <div className="flex items-center gap-4 mt-4">
              <Button asChild
                variant="outline"
                className="flex-1 rounded-full h-14 text-base"
              >
                <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>{t("nav.signIn", "Our process")}</a>
              </Button>
              <Button asChild
                className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
              >
                <a href={`/${locale}/start`} onClick={() => setIsMobileMenuOpen(false)}>{t("nav.deployAgent", "Start a project")}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

```
## `components/landing/footer-section.tsx`

```tsx
"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useT, useLocale } from "@/lib/i18n/use-t";

// Navigation labels are resolved from the dictionary via key; hrefs stay fixed.
const footerLinks = {
  footer: { titleKey: "footer.products", title: "Product", links: [
    { nameKey: "footer.capabilities", name: "Agent capabilities", href: "/solutions" },
    { nameKey: "footer.howItWorks", name: "How it works", href: "#how-it-works" },
    { nameKey: "footer.pricing", name: "Delivery approach", href: "#pricing" },
    { nameKey: "footer.integrations", name: "Integrations", href: "#integrations" },
  ] },
  developers: { titleKey: "footer.sdk", title: "Engineering & guides", links: [
    { nameKey: "footer.docs", name: "Agent Space", href: "/agentnexos" },
    { nameKey: "footer.sdk", name: "Platform engineering", href: "/platform" },
    { nameKey: "footer.api", name: "Practical guides", href: "/resources" },
    { nameKey: "footer.status", name: "Success criteria", href: "/resources#acceptance" },
  ] },
  company: { titleKey: "footer.company", title: "Company", links: [
    { nameKey: "footer.about", name: "About", href: "/about" },
    { nameKey: "footer.blog", name: "Architecture", href: "/platform" },
    { nameKey: "footer.careers", name: "Industries", href: "/industries" },
    { nameKey: "footer.contact", name: "Project brief", href: "/start" },
  ] },
  legal: { titleKey: "footer.legal", title: "Legal", links: [
    { nameKey: "footer.privacy", name: "Privacy", href: "/privacy" },
    { nameKey: "footer.terms", name: "Terms", href: "/terms" },
    { nameKey: "footer.security", name: "Security", href: "/security" },
  ] },
};

const socialLinks = [
  { key: "footer.capabilities", name: "Capabilities", href: "#features" },
  { key: "footer.howItWorks", name: "Process", href: "#how-it-works" },
  { key: "footer.security", name: "Security", href: "#security" },
];

function AnimatedWaveCanvas() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(100, 200, 150, 0.3)";
      ctx.lineWidth = 1;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.01 + time + wave * 0.5) * 30 +
            Math.sin(x * 0.02 + time * 1.5 + wave) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += 0.02;
      if (!reducedMotion) animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function FooterSection() {
  const t = useT();
  const locale = useLocale();
  const resolveHref = (href: string) => (href.startsWith("/") ? `/${locale}${href}` : href);

  return (
    <footer className="relative bg-black">
      {/* Panoramic banner image */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img
                  width={2720}
                  height={811}
                  loading="lazy"
                  decoding="async"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2810%29-UnDKstODkIENp5xqTYUEpt0Sm8tNOw.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Footer content — black background, white text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#top" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display text-white">
                  {t("footer.brand", "Agentnexos")}
                </span>
                <span className="text-xs text-white/40 font-mono">TM</span>
              </a>

              <p className="text-white/50 leading-relaxed mb-8 max-w-xs text-sm">
                {t("footer.tagline", "Custom AI agent systems for MENA enterprises, built to automate real operations with explicit controls.")}
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {t(link.key, link.name)}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-90" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([key, column]) => (
              <div key={key}>
                <h3 className="text-sm font-medium text-white mb-6">
                  {t(column.titleKey, column.title)}
                </h3>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.nameKey}>
                      <a
                        href={resolveHref(link.href)}
                        className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        {t(link.nameKey, link.name)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            {t("footer.copyright", "\u00a9 2026 Agentnexos. All rights reserved.")}
          </p>

          <div className="flex items-center gap-4 text-sm text-white/30">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eca8d6]" />
              {t("footer.operational", "Platform under staged development")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

```
## `components/site/page-header.tsx`

```tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale, useT } from "@/lib/i18n/use-t";
import { LocaleSwitcher } from "./locale-switcher";

/** Compact navigation for secondary pages; the landing template keeps its header. */
export function PageHeader() {
  const locale = useLocale();
  const t = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
        <Link href={`/${locale}`} dir="ltr" className="text-xl font-semibold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">
          Agentnexos
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav className="hidden items-center gap-5 md:flex" aria-label={locale === "ar" ? "صفحات المنصة" : "Platform pages"}>
            <Link href={`/${locale}/platform`} className="text-sm text-foreground/70 hover:text-foreground">{locale === "ar" ? "المنصة" : "Platform"}</Link>
            <Link href={`/${locale}/solutions`} className="text-sm text-foreground/70 hover:text-foreground">{locale === "ar" ? "الحلول" : "Solutions"}</Link>
            <Link href={`/${locale}/resources`} className="text-sm text-foreground/70 hover:text-foreground">{locale === "ar" ? "الأدلة" : "Guides"}</Link>
          </nav>
          <LocaleSwitcher />
          <Link href={`/${locale}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground/80 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            <span className="hidden sm:inline">{t("agent.backToHome", "Back to Home")}</span>
            <span className="sm:hidden">{t("nav.home", "Home")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

```
## `components/site/locale-switcher.tsx`

```tsx
"use client";

import { usePathname } from "next/navigation";
import { localeLabel, locales, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/use-t";

/** Swaps the locale segment of the current path, preserving everything else. */
function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  parts[1] = next;
  return parts.join("/") || `/${next}`;
}

export function LocaleSwitcher({ inverted = false }: { inverted?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname() || "/";

  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <a
            key={l}
            href={swapLocale(pathname, l)}
            aria-current={active ? "true" : undefined}
            className={
              active
                ? inverted
                  ? "text-white underline decoration-white/60 underline-offset-4"
                  : "text-foreground underline underline-offset-4"
                : inverted
                  ? "text-white/55 hover:text-white transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            {localeLabel[l]}
          </a>
        );
      })}
    </div>
  );
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
## `lib/i18n/use-t.tsx`

```tsx
"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import { getDictionary } from "./dictionaries";

type Translator = (key: string, fallback: string) => string;

const LocaleContext = createContext<Locale>("ar");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/**
 * Returns a translator bound to the active locale.
 *
 * `t("hero.title", "Distributed compute,")` renders the Arabic string for
 * `ar` and the original English fallback for `en` (or for any missing key),
 * so /en cannot drift from the template copy.
 */
export function useT(): Translator {
  const locale = useLocale();
  if (locale === "en") {
    return (_key, fallback) => fallback;
  }
  const dict = getDictionary(locale);
  return (key, fallback) => dict[key] ?? fallback;
}

export function useIsRtl(): boolean {
  return useLocale() === "ar";
}

```
