import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

/**
 * Sends `/` (and any path missing a supported locale prefix) to the default
 * locale, leaving already-localised paths untouched.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Skip: API routes, Next internals, and any path with a file extension
     * (static assets, images, fonts, robots, sitemap...).
     */
    "/((?!api|_next|.*\\..*).*)",
  ],
};

// Keep locales referenced so the matcher stays in sync if extended.
void locales;
