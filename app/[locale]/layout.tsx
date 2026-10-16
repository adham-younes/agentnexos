import type { Metadata } from "next";
import { siteOrigin, isPreview, contactEmail } from "@/lib/site";
import { notFound } from "next/navigation";
import { Inter, Newsreader, Anybody, Space_Grotesk, IBM_Plex_Sans_Arabic, } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import "../marketing-reference.css";
import "../upgrade-20261016.css";
import { LocaleProvider } from "@/lib/i18n/use-t";
import { isLocale, localeBcp47, localeDir, locales, type Locale, } from "@/lib/i18n/config";
const instrumentSans = Inter({
    subsets: ["latin"],
    variable: "--font-instrument",
});
const instrumentSerif = Newsreader({
    subsets: ["latin"],
    style: ["normal", "italic"],
    variable: "--font-instrument-serif",
});
const jetbrainsMono = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-jetbrains",
});
// Original Arabic UI family; real light/heavy faces also support marketing.
const plexArabic = IBM_Plex_Sans_Arabic({
    subsets: ["arabic", "latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-arabic",
});
// Expanded geometric display face, not an identification of the reference font.
const marketingDisplay = Anybody({
    subsets: ["latin"],
    axes: ["wdth"],
    variable: "--font-marketing-display",
});
export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({ params, }: {
    params: Promise<{
        locale: string;
    }>;
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
            locale: isAr ? "ar_EG" : "en_US",
            type: "website",
            images: [{ url: `${baseUrl}/og`, width: 1200, height: 630, alt: isAr ? "AGYNEXA — أنظمة الوكلاء وأتمتة العمليات" : "AGYNEXA — AI agent systems and workflow automation" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        robots: {
            index: !isPreview,
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
export default async function LocaleLayout({ children, params, }: Readonly<{
    children: React.ReactNode;
    params: Promise<{
        locale: string;
    }>;
}>) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const typed: Locale = locale;
    return (<html lang={localeBcp47[typed]} dir={localeDir[typed]}>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${plexArabic.variable} ${marketingDisplay.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-link">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "AGYNEXA", url: siteOrigin, logo: `${siteOrigin}/icon.svg`, email: contactEmail }).replace(/</g, "\u003c") }}/><LocaleProvider locale={typed}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>);
}
