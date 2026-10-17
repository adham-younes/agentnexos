import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isLocale } from '@/lib/i18n/config';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from '@/lib/i18n/routing';
import { accountDestination } from '@/lib/auth/redirect';
import { siteOrigin } from '@/lib/site';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const routeLocale = (await params).locale;
  if (!isLocale(routeLocale)) return new NextResponse('Not found', { status: 404 });
  const query = request.nextUrl.searchParams;
  const language = query.get('lang'), locale = language && isLocale(language) ? language : routeLocale;
  const code = query.get('code'), recovery = query.get('recovery') === '1';
  let destination = '/login?error=confirmation';
  if (code && !query.has('error')) {
    try {
      const client = await createClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error) destination = recovery ? '/login?recovery=1' : accountDestination(query.get('next'));
    } catch { destination = '/login?error=service'; }
  }
  const response = NextResponse.redirect(new URL(destination, siteOrigin));
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Pragma', 'no-cache');
  response.cookies.set(LOCALE_COOKIE, locale, { path: '/', sameSite: 'lax', secure: request.nextUrl.protocol === 'https:', maxAge: LOCALE_COOKIE_MAX_AGE });
  return response;
}
