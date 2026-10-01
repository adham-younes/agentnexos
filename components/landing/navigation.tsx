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
