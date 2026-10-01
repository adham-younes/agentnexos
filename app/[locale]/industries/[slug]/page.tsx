import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';
import { catalogs } from '@/lib/content/catalog';
import { CatalogPage } from '@/components/site/catalog-page';
type Props={params:Promise<{locale:string;slug:string}>};
export function generateStaticParams(){return catalogs.industries.map(x=>({slug:x.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale,slug}=await params;if(!isLocale(locale))notFound();const c=catalogs.industries.find(x=>x.slug===slug)?.[locale];if(!c)notFound();return {title:c.title+' | AgentNexos',description:c.paragraphs[0],alternates:{canonical:`/${locale}/industries/${slug}`,languages:{ar:`/ar/industries/${slug}`,en:`/en/industries/${slug}`}}};}
export default async function Page({params}:Props){const {locale,slug}=await params;if(!isLocale(locale)||!catalogs.industries.some(x=>x.slug===slug))notFound();return <CatalogPage kind="industries" locale={locale} slug={slug}/>;}
