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
