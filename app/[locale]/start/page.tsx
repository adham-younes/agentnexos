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
  return <CyberEffects className="nexus-start"><PageHeader /><main id="main-content" tabIndex={-1} className="nexus-wrap nexus-brief-main"><p className="cyber-eyebrow">{ar ? "ابدأ من العملية" : "Start with the process"}</p><h1 className="nexus-brief-title">{ar ? "لنبدأ من يوم عملك." : "Start with a working day."}</h1><p className="mt-6 text-lg leading-8 text-foreground/75">{ar ? "اختر مهمة تتكرر وتستهلك وقت الفريق. اجمع هدفها ومصادرها وصاحب القرار في موجز واحد، تستطيع تنزيله ومراجعته مع زملائك. استخدم أمثلة افتراضية." : "Choose a recurring task that takes up your team’s time. Bring its goal, sources, and decision owner into one brief you can download and review with colleagues. Use fictional examples."}</p><p className="mt-6 rounded-xl border-s-2 border-[#10b981]/50 bg-foreground/[0.025] p-5 text-sm leading-7 text-foreground/75">{ar ? "النموذج يعمل داخل المتصفح. لا يحفظ إجاباتك على خادم، ولا يرسل طلب تواصل، ولا يستدعي نموذج ذكاء اصطناعي. التنزيل اختياري؛ خدمات التحليلات العامة موضحة في سياسة الخصوصية." : "This form runs in your browser. It does not store answers on a server, submit a contact request, or call an AI model. Download is optional; general analytics are described in the privacy policy."}</p><ProjectBriefForm locale={locale} /></main><CyberFooter locale={locale} /></CyberEffects>;
}
