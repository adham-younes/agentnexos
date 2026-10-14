import content from './revision-20261014.json';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';

export type RevisionPage = keyof typeof content.ar;
export const revision = content;
export const revisionRoutes = Object.keys(content.en).map(key => key === 'home' ? '' : key);
export function revisionMetadata(page: RevisionPage, locale: Locale): Metadata {
  const c = content[locale][page];
  const path = page === 'home' ? '' : `/${page}`;
  return { title: c.seoTitle, description: c.seoDescription, alternates: { canonical: `/${locale}${path}`, languages: { ar: `/ar${path}`, en: `/en${path}` } }, openGraph: { title: c.title, description: c.seoDescription, url: `/${locale}${path}` }, twitter: { title: c.title, description: c.seoDescription } };
}
