"use client";

import { locales, type Locale } from "@/lib/i18n/config";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, publicPath } from "@/lib/i18n/routing";
import { useLocale } from "@/lib/i18n/use-t";

export function LocaleSwitcher({ inverted = false, compact = true }: {
  inverted?: boolean;
  compact?: boolean;
}) {
  const locale = useLocale();

  function changeLocale(next: Locale) {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
    // A full navigation invalidates prefetched RSC content and the client router
    // cache. The address stays on the same clean page with its query and hash.
    const path = publicPath(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    window.history.replaceState(window.history.state, "", path);
    window.location.reload();
  }

  return <div className="upgrade-locale-switcher">
    {locales.filter(next => !compact || next !== locale).map(next => {
      const active = next === locale;
      return <button
        key={next}
        type="button"
        onClick={() => changeLocale(next)}
        lang={next}
        aria-label={next === "ar" ? "التبديل إلى العربية" : "Switch to English"}
        aria-pressed={active}
        title={next === "ar" ? "العربية" : "English"}
        className={active
          ? inverted ? "text-white underline decoration-white/60 underline-offset-4" : "text-foreground underline underline-offset-4"
          : inverted ? "text-white/55 hover:text-white transition-colors" : "text-muted-foreground hover:text-foreground transition-colors"}
      >{next === "ar" ? "ع" : "EN"}</button>;
    })}
  </div>;
}
