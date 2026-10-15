import type { Metadata } from "next";
import { siteOrigin } from "@/lib/site";
import { notFound } from "next/navigation";
import {
  Inter,
  Michroma,
  Space_Grotesk,
  Tajawal,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "../globals.css";
import "../green-reference.css";
import { LocaleProvider } from "@/lib/i18n/use-t";
import {
  isLocale,
  localeBcp47,
  localeDir,
  locales,
  type Locale,
} from "@/lib/i18n/config";

const instrumentSans = Inter({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const instrumentSerif = Michroma({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

// Genuine Arabic shaping with a light/heavy hierarchy beside geometric Latin type.
const plexArabic = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
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
  const title = isAr
    ? "AGYNEXA — هندسة أنظمة الذكاء الاصطناعي وأتمتة الأعمال"
    : "AGYNEXA — Enterprise AI Systems & Automation Engineering";
  const description = isAr
    ? "هندسة أنظمة ذكاء اصطناعي مخصصة للمؤسسات حول العالم، تربط المعرفة والتطبيقات والأدوات بسير عمل محدد الصلاحيات وخاضع للإشراف البشري."
    : "Custom enterprise AI systems and automation engineering for organizations worldwide. Connect knowledge, applications and tools with governed workflows and human oversight.";

  const baseUrl = siteOrigin;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "AGYNEXA",
      locale: isAr ? "ar_AR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-dark-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
        { url: "/icon-light-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      ],
      apple: "/apple-icon.png",
    },
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
        <a href="#main-content" className="skip-link">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
        <LocaleProvider locale={typed}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
