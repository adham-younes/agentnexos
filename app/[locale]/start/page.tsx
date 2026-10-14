import { revision, revisionMetadata } from "@/lib/content/revision";
import { ContentBody, ContentSections } from "@/components/site/content-body";
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
  return revisionMetadata("start", locale);
}
export default async function Page({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const ar = locale === "ar"; const reviewed = revision[locale].start;
  return <CyberEffects className="nexus-start"><PageHeader /><main id="main-content" tabIndex={-1} className="nexus-wrap nexus-brief-main"><p className="cyber-eyebrow">{ar ? "ابدأ من العملية" : "Start with the process"}</p><h1 className="nexus-brief-title">{reviewed.title}</h1><div className="nexus-page-intro"><ContentBody text={reviewed.intro}/></div><ContentSections sections={reviewed.sections}/><details className="nexus-brief-privacy"><summary>{ar ? "إجاباتك محلية — كيف يعمل النموذج؟" : "Your answers stay local — how does the form work?"}</summary><p>{ar ? "إجاباتك تبقى في هذه الصفحة حتى تمسحها أو تغلقها. المراجعة والتنزيل داخل المتصفح؛ لا يُرسل طلب تواصل أو تُستدعى نماذج ذكاء اصطناعي. استخدم بيانات افتراضية." : "Your answers stay on this page until cleared or closed. Review and optional download happen in your browser; no contact request or AI call is made. Use fictional details."} <Link href={`/${locale}/privacy`} className="underline underline-offset-4">{ar ? "تفاصيل التحليلات والخصوصية" : "Analytics and privacy details"}</Link></p></details><ProjectBriefForm locale={locale} /></main><CyberFooter locale={locale} /></CyberEffects>;
}
