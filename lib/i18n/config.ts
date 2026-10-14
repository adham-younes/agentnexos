export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDir: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export const localeLabel: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export const localeBcp47: Record<Locale, string> = {
  ar: "ar-EG",
  en: "en-US",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
