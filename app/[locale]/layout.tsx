import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "../globals.css";
import { LocaleProvider } from "@/lib/i18n/use-t";
import {
  isLocale,
  localeBcp47,
  localeDir,
  locales,
  type Locale,
} from "@/lib/i18n/config";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

// Arabic companion face — added alongside the template fonts, never replacing
// them, so the English (LTR) rendering stays identical.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "Agentnexos — حيث يتواصل الوكلاء"
      : "Agentnexos — Where agents connect",
    description: isAr
      ? "منصة عربية-أولًا لمعالجة المستندات: استخراج، وتحقّق، ومراجعة، ثم تصدير بموافقتك."
      : "An Arabic-first platform for extracting, checking, and reviewing document data, with your approval before export.",
    generator: "v0.app",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typed: Locale = locale;

  return (
    <html lang={localeBcp47[typed]} dir={localeDir[typed]}>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${plexArabic.variable} font-sans antialiased`}
      >
        <LocaleProvider locale={typed}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
