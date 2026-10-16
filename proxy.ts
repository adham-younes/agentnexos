import { NextResponse, type NextRequest } from "next/server";
import { siteOrigin } from "@/lib/site";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";
/**
 * Sends `/` (and any path missing a supported locale prefix) to the default
 * locale, leaving already-localised paths untouched.
 */
export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    if (process.env.VERCEL_ENV === 'production' && request.nextUrl.hostname === 'compute-the-platform-to-build-six-fawn.vercel.app') {
        return NextResponse.redirect(new URL(pathname + search, siteOrigin), 308);
    }
    const first = pathname.split("/")[1];
    if (isLocale(first))
        return NextResponse.next();
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
        "/((?!api|og(?:/|$)|_next|.*\\..*).*)",
    ],
};
// Keep locales referenced so the matcher stays in sync if extended.
void locales;
