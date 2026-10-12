> Source snapshot: baseline b8e5a24, captured before the owner-selected Cyber Serif implementation. Refresh affected context when resuming design.

# Routes

- `/[locale]/[page]` → `app/[locale]/[page]/page.tsx`; layout `app/[locale]/layout.tsx`.
- `/[locale]/agentnexos` → `app/[locale]/agentnexos/page.tsx`; layout `app/[locale]/layout.tsx`.
- `/[locale]` → `app/[locale]/page.tsx`; layout `app/[locale]/layout.tsx`.
- `/[locale]/privacy` → `app/[locale]/privacy/page.tsx`; layout `app/[locale]/layout.tsx`.
- `/[locale]/security` → `app/[locale]/security/page.tsx`; layout `app/[locale]/layout.tsx`.
- `/[locale]/solutions` → `app/[locale]/solutions/page.tsx`; layout `app/[locale]/layout.tsx`.
- `/[locale]/start` → `app/[locale]/start/page.tsx`; layout `app/[locale]/layout.tsx`.
- `/[locale]/terms` → `app/[locale]/terms/page.tsx`; layout `app/[locale]/layout.tsx`.

Dynamic [page] validates keys of lib/content/product-pages.ts: platform, industries, resources, about. Static public routes: solutions, security, privacy, terms. Home: 11 editorial/product sections plus hero and global navigation/footer. Start: local-only project brief validation/download. Agentnexos: readiness-gated read-only workflow-design conversation.

API routes: /api/agentnexos bounded preview; /api/chat, /api/approvals, /api/telemetry remain closed enterprise endpoints. Sitemap/robots are metadata routes. No client router config; file based routing plus proxy locale handling.

## `next.config.mjs`

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
}

export default nextConfig

```
## `proxy.ts`

```ts
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

```
