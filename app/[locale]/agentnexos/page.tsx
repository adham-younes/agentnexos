import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { authenticatedUser } from "@/lib/auth/server";
import { AgentWorkspace } from "@/components/agent/workspace";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const title = locale === "ar" ? "مساحة تصميم العمليات | Agentnexos" : "Workflow design workspace | Agentnexos";
  const description = locale === "ar" ? "استكشف تصميم عملية بصلاحيات قراءة محدودة ومراجعة بشرية. استخدم بيانات افتراضية فقط؛ لا ينفذ المثال أفعالًا خارجية." : "Explore workflow design with bounded read tools and human review. Use fictional data only; the preview performs no external actions.";
  return { title, description, robots: { index: false, follow: false }, alternates: { canonical: `/${locale}/agentnexos`, languages: { ar: "/ar/agentnexos", en: "/en/agentnexos" } }, openGraph: { title, description, url: `/${locale}/agentnexos` }, twitter: { title, description } };
}
export const dynamic = "force-dynamic";
export default async function AgentSpacePage({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;if(!isLocale(locale))notFound();
  const auth=await authenticatedUser();if(!auth)redirect(`/${locale}/login`);
  const {error}=await auth.client.from("agentnexos_profiles").upsert({id:auth.user.id},{onConflict:"id",ignoreDuplicates:true});
  return <AgentWorkspace accountReady={!error} />;
}
