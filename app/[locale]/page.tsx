import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/site/marketing-page";
import { isLocale } from "@/lib/i18n/config";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <MarketingPage locale={locale} />;
}
