import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isLocale } from '@/lib/i18n/config';
import { siteOrigin } from '@/lib/site';
export async function GET(request: NextRequest, { params }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        return new NextResponse('Not found', { status: 404 });
    const code = request.nextUrl.searchParams.get('code'), recovery = request.nextUrl.searchParams.get('recovery') === '1';
    if (code) {
        const client = await createClient();
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (!error)
            return NextResponse.redirect(new URL(`/${locale}/${recovery ? 'login?recovery=1' : 'agentnexos'}`, siteOrigin));
    }
    return NextResponse.redirect(new URL(`/${locale}/login?error=confirmation`, siteOrigin));
}
