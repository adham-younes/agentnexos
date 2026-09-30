import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  return <div className="min-h-screen bg-background text-foreground" style={ar ? { fontFamily: "var(--font-arabic), var(--font-instrument), sans-serif" } : undefined}><PageHeader /><main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-20"><p className="mb-4 text-sm text-[#eca8d6]">{ar ? "ابدأ من العملية" : "Start with the process"}</p><h1 className="text-3xl font-semibold leading-[1.4] sm:text-5xl">{ar ? "مشكلة واضحة. موجز قابل للمراجعة." : "A clear problem. A reviewable brief."}</h1><p className="mt-6 text-lg leading-8 text-foreground/75">{ar ? "صف عملية واحدة، ثم حدد من يملك القرار وكيف نثبت النتيجة. استخدم أمثلة افتراضية؛ لا تضف أسرارًا أو بيانات عملاء أو بيانات شخصية." : "Describe one process, who owns the decisions, and how to verify the result. Use fictional examples; do not enter secrets, customer records, or personal data."}</p><p className="mt-6 rounded-xl border-s-2 border-[#eca8d6]/50 bg-foreground/[0.025] p-5 text-sm leading-7 text-foreground/75">{ar ? "النموذج يعمل داخل المتصفح. لا يحفظ إجاباتك على خادم، ولا يرسل طلب تواصل، ولا يستدعي نموذج ذكاء اصطناعي. التنزيل اختياري؛ خدمات التحليلات العامة موضحة في سياسة الخصوصية." : "This form runs in your browser. It does not store answers on a server, submit a contact request, or call an AI model. Download is optional; general analytics are described in the privacy policy."}</p><ProjectBriefForm locale={locale} /></main></div>;
}
