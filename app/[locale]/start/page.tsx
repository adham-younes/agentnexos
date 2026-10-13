import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CyberEffects } from "@/components/cyber/effects";
import { CyberFooter } from "@/components/cyber/footer";
import { PageHeader } from "@/components/site/page-header";
import { ProjectBriefForm } from "@/components/site/project-brief";
import { isLocale } from "@/lib/i18n/config";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const title = locale === "ar" ? "موجز مشروع | Agentnexos" : "Project brief | Agentnexos";
  const description = locale === "ar" ? "حدد هدف العملية ومالكها وبياناتها ومعايير نجاحها. راجع موجزًا محليًا قبل أي ربط أو تنفيذ." : "Define process goals, ownership, data, and acceptance. Review a local brief before integration or execution.";
  return { title, description, alternates: { canonical: `/${locale}/start`, languages: { ar: "/ar/start", en: "/en/start" } }, openGraph: { title, description, url: `/${locale}/start` }, twitter: { title, description } };
}
export default async function Page({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const ar = locale === "ar";
  return <CyberEffects className="nexus-start"><PageHeader /><main id="main-content" tabIndex={-1} className="nexus-wrap nexus-brief-main"><p className="cyber-eyebrow">{ar ? "ابدأ من العملية" : "Start with the process"}</p><h1 className="nexus-brief-title">{ar ? "جهّز موجز أول عملية." : "Brief your first workflow."}</h1><p className="mt-6 text-lg leading-8 text-foreground/75">{ar ? "حدد ما تريد تحسينه، وما يحتاجه فريقك لتجربته. ابدأ بمثال افتراضي أو اكتب وصفك، ثم نزّل موجزًا يوضح النطاق ومسؤولية القرار." : "Define what you want to improve and what your team needs to try it. Use a fictional example or describe your process, then download a brief with scope and decision ownership."}</p><details className="nexus-brief-privacy"><summary>{ar ? "إجاباتك محلية — كيف يعمل النموذج؟" : "Your answers stay local — how does the form work?"}</summary><p>{ar ? "إجاباتك تبقى في هذه الصفحة حتى تمسحها أو تغلقها. المراجعة والتنزيل داخل المتصفح؛ لا يُرسل طلب تواصل أو تُستدعى نماذج ذكاء اصطناعي. استخدم بيانات افتراضية." : "Your answers stay on this page until cleared or closed. Review and optional download happen in your browser; no contact request or AI call is made. Use fictional details."} <Link href={`/${locale}/privacy`} className="underline underline-offset-4">{ar ? "تفاصيل التحليلات والخصوصية" : "Analytics and privacy details"}</Link></p></details><ProjectBriefForm locale={locale} /></main><CyberFooter locale={locale} /></CyberEffects>;
}
