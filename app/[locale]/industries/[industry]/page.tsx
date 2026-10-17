import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IndustryDetail } from '@/components/site/industry-pages';
import { getIndustry, industrySlugs, isIndustrySlug } from '@/lib/content/industries';
import { isLocale } from '@/lib/i18n/config';
import { publicPath } from '@/lib/i18n/routing';
import { isPreview, siteOrigin } from '@/lib/site';

type Props = { params: Promise<{ locale: string; industry: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
    return industrySlugs.map(industry => ({ industry }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, industry } = await params;
    if (!isLocale(locale) || !isIndustrySlug(industry)) notFound();
    const copy = getIndustry(locale, industry);
    const url = `${siteOrigin}${publicPath(`/industries/${industry}`)}`;
    const title = copy.seoTitle;
    return {
        title,
        description: copy.summary,
        alternates: { canonical: url, languages: { en: url, 'x-default': url } },
        robots: { index: !isPreview, follow: true },
        openGraph: {
            title, description: copy.summary, url, siteName: 'AGYNEXA', type: 'website',
            locale: locale === 'ar' ? 'ar_EG' : 'en_US',
            images: [{ url: `${siteOrigin}/og`, width: 1200, height: 630, alt: title }],
        },
        twitter: { card: 'summary_large_image', title, description: copy.summary, images: [`${siteOrigin}/og`] },
    };
}

export default async function Page({ params }: Props) {
    const { locale, industry } = await params;
    if (!isLocale(locale) || !isIndustrySlug(industry)) notFound();
    return <IndustryDetail locale={locale} industry={industry}/>;
}
