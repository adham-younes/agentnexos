import { isLocale } from "@/lib/i18n/config";

export const LOCALE_COOKIE = "agynexa_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Public, same-origin path for an internal route, with query/hash preserved. */
export function publicPath(path = "/"): string {
  // This helper accepts paths, never an absolute URL or a browser-normalized
  // backslash URL. Auth destinations still need their own route allowlist.
  if (!path.startsWith("/") || path.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(path)) {
    return "/";
  }

  const suffixStart = path.search(/[?#]/);
  const pathname = suffixStart < 0 ? path : path.slice(0, suffixStart);
  const suffix = suffixStart < 0 ? "" : path.slice(suffixStart);
  const segments = pathname.split("/");
  if (isLocale(segments[1] ?? "")) segments.splice(1, 1);
  const clean = segments.join("/") || "/";
  if (clean.startsWith("//")) return "/";
  return `${clean}${suffix}`;
}
