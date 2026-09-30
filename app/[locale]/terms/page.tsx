import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/site/public-page";
import { publicPages } from "@/lib/content/public-pages";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = publicPages.terms[locale];
  return { title: `${content.title} | Agentnexos`, description: content.intro, alternates: { canonical: `/${locale}/terms`, languages: { ar: "/ar/terms", en: "/en/terms" } }, openGraph: { title: content.title, description: content.intro, url: `/${locale}/terms` } };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PublicPage page="terms" locale={locale} />;
}
