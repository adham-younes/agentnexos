import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { siteOrigin } from "@/lib/site";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, publicPath } from "@/lib/i18n/routing";
import type { Database } from "@/lib/supabase/types";

/** Cookie-dependent HTML and authenticated responses must never be shared. */
function privateResponse(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.append("Vary", "Cookie");
  return response;
}

function rememberLocale(response: NextResponse, locale: Locale, request: NextRequest) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
  });
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // Keep the existing production alias canonicalization; preview URLs remain usable.
  if (process.env.VERCEL_ENV === "production" && request.nextUrl.hostname === "compute-the-platform-to-build-six-fawn.vercel.app") {
    const canonicalUrl = new URL(siteOrigin);
    canonicalUrl.pathname = pathname;
    canonicalUrl.search = search;
    return privateResponse(NextResponse.redirect(canonicalUrl, 308));
  }

  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    // A legacy language URL establishes its explicit preference before redirecting.
    // Temporary + no-store avoids persisting a cookie-setting redirect in caches.
    const url = request.nextUrl.clone();
    url.pathname = publicPath(pathname);
    const response = privateResponse(NextResponse.redirect(url, 307));
    rememberLocale(response, first, request);
    return response;
  }

  const preference = request.cookies.get(LOCALE_COOKIE)?.value;
  // Email links may open on a different device without the preference cookie.
  const callbackLocale = pathname === "/auth/callback" ? request.nextUrl.searchParams.get("lang") : null;
  const locale = callbackLocale && isLocale(callbackLocale)
    ? callbackLocale
    : preference && isLocale(preference) ? preference : defaultLocale;

  const pendingCookies = new Map<string, { name: string; value: string; options: CookieOptions }>();
  const refreshHeaders = new Headers();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasAuthCookie = request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));

  // The callback owns code exchange. All other session-bearing page requests
  // refresh before rendering, with the same cookies forwarded to the browser.
  if (supabaseUrl && supabaseKey && hasAuthCookie && pathname !== "/auth/callback") {
    const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          for (const cookie of cookiesToSet) {
            request.cookies.set(cookie.name, cookie.value);
            pendingCookies.set(cookie.name, cookie);
          }
          for (const [name, value] of Object.entries(headers)) refreshHeaders.set(name, value);
        },
      },
    });
    // Page/API authorization still verifies the user independently. A temporary
    // auth outage must not break the public marketing site or grant access.
    try { await supabase.auth.getClaims(); } catch { /* Protected routes fail closed. */ }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // request.cookies.set updates Cookie; forward those refreshed values through
  // the rewrite instead of returning a new response that loses auth cookies.
  const response = NextResponse.rewrite(url, { request: { headers: new Headers(request.headers) } });
  for (const { name, value, options } of pendingCookies.values()) response.cookies.set(name, value, options);
  for (const [name, value] of refreshHeaders) response.headers.set(name, value);
  if (callbackLocale && isLocale(callbackLocale)) rememberLocale(response, callbackLocale, request);
  response.headers.set("Content-Language", locale);
  return privateResponse(response);
}

export const config = {
  // APIs authorize at their own boundary; assets, metadata files, OG and Next
  // internals must never be localized or rewritten.
  matcher: ["/((?!api(?:/|$)|og(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|.*\\..*).*)"],
};
