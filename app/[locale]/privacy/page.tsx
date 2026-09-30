import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/site/public-page";
import { publicPages } from "@/lib/content/public-pages";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = publicPages.privacy[locale];
  return { title: `${content.title} | Agentnexos`, description: content.intro, alternates: { canonical: `/${locale}/privacy`, languages: { ar: "/ar/privacy", en: "/en/privacy" } }, openGraph: { title: content.title, description: content.intro, url: `/${locale}/privacy` }, twitter: { title: content.title, description: content.intro } };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PublicPage page="privacy" locale={locale} />;
}
