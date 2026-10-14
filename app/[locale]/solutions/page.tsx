import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/site/public-page";
import { revisionMetadata } from "@/lib/content/revision";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return revisionMetadata("solutions", locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PublicPage page="solutions" locale={locale} />;
}
