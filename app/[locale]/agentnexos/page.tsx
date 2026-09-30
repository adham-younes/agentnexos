import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { AgentWorkspace } from "@/components/agent/workspace";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const title = locale === "ar" ? "مساحة تصميم العمليات | Agentnexos" : "Workflow design workspace | Agentnexos";
  const description = locale === "ar" ? "استكشف تصميم عملية بصلاحيات قراءة محدودة ومراجعة بشرية. استخدم بيانات افتراضية فقط؛ لا ينفذ المثال أفعالًا خارجية." : "Explore workflow design with bounded read tools and human review. Use fictional data only; the preview performs no external actions.";
  return { title, description, alternates: { canonical: `/${locale}/agentnexos`, languages: { ar: "/ar/agentnexos", en: "/en/agentnexos" } }, openGraph: { title, description, url: `/${locale}/agentnexos` }, twitter: { title, description } };
}
export default function AgentSpacePage() { return <AgentWorkspace />; }
