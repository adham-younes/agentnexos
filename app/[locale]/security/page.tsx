import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/site/public-page";
import { publicPages } from "@/lib/content/public-pages";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = publicPages.security[locale];
  return { title: `${content.title} | Agentnexos`, description: content.intro, alternates: { canonical: `/${locale}/security`, languages: { ar: "/ar/security", en: "/en/security" } }, openGraph: { title: content.title, description: content.intro, url: `/${locale}/security` }, twitter: { title: content.title, description: content.intro } };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PublicPage page="security" locale={locale} />;
}
