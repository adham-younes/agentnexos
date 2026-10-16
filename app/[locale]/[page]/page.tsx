import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/site/public-page";
import { revisionMetadata } from "@/lib/content/revision";
const productPages = { engagements: true, about: true, platform: true, industries: true, resources: true, services: true, methodology: true };
import { isLocale } from "@/lib/i18n/config";
type Props = {
    params: Promise<{
        locale: string;
        page: string;
    }>;
};
function isProductPage(page: string): page is keyof typeof productPages { return Object.hasOwn(productPages, page); }
export function generateStaticParams() { return Object.keys(productPages).map(page => ({ page })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, page } = await params;
    if (!isLocale(locale) || !isProductPage(page))
        notFound();
    return revisionMetadata(page, locale);
}
export default async function Page({ params }: Props) {
    const { locale, page } = await params;
    if (!isLocale(locale) || !isProductPage(page))
        notFound();
    return <PublicPage page={page} locale={locale}/>;
}
