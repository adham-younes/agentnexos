import { CyberHome } from "@/components/landing/cyber-home";
import { revisionMetadata } from "@/lib/content/revision";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) {
 const {locale}=await params; if(!isLocale(locale)) notFound(); return revisionMetadata("home",locale);
}
export default function Home() { return <CyberHome />; }
