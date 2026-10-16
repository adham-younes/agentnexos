import content from './revision-20261014.json';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { masterPage, masterHome, masterValue, masterRoutes } from './master';
import { siteOrigin, isPreview } from '@/lib/site';
export type RevisionPage = keyof typeof content.ar;
function workspace(locale: Locale) {
    const approved = masterPage(locale, 'agentnexos');
    return { ...content[locale].agentnexos, title: approved.title, intro: approved.intro, sections: approved.sections.filter(x => ['تنبيه ملاصق لحقل الإدخال', 'Notice beside the input', 'حدود التجربة', 'ملاحظة الحدود', 'Boundary notice'].includes(x.heading)).map((x, i) => ({ id: `scope-${i}`, heading: x.heading, body: x.body })) };
}
export const revision = { ar: { ...content.ar, agentnexos: workspace('ar') }, en: { ...content.en, agentnexos: workspace('en') } };
export const revisionRoutes = ['', ...masterRoutes.filter(x => !['privacy', 'terms'].includes(x)), 'privacy', 'terms', 'agentnexos'];
export function revisionMetadata(page: RevisionPage | 'engagements' | 'login', locale: Locale): Metadata {
    const approved = masterPage(locale, page), legacy = content[locale][page as RevisionPage];
    const heading = page === 'home' ? masterValue(masterHome(locale).groups[0].fields, 'العنوان', 'Title') : approved?.title || legacy?.title;
    const title = approved?.seoTitle || heading || 'AGYNEXA', description = approved?.seoDescription || approved?.intro || legacy?.seoDescription;
    const path = page === 'home' ? '' : `/${page}`, url = `${siteOrigin}/${locale}${path}`;
    return { title, description, alternates: { canonical: url, languages: { ar: `${siteOrigin}/ar${path}`, en: `${siteOrigin}/en${path}` } }, robots: { index: !isPreview, follow: true }, openGraph: { title: heading || title, description, url, siteName: 'AGYNEXA', type: 'website', locale: locale === 'ar' ? 'ar_EG' : 'en_US', images: [{ url: `${siteOrigin}/og`, width: 1200, height: 630, alt: title }] }, twitter: { card: 'summary_large_image', title, description, images: [`${siteOrigin}/og`] } };
}
