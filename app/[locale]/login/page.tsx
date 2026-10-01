import type { Metadata } from "next";
import { redirect,notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { authConfig,authenticatedUser } from "@/lib/auth/server";
import { safeWorkspacePath } from "@/lib/auth/validation";
import { PageHeader } from "@/components/site/page-header";
import { AuthForm } from "@/components/site/auth-form";
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;return {robots:{index:false,follow:false},title:(locale==="ar"?"تسجيل الدخول":"Sign in")+" | AgentNexos",alternates:{canonical:`/${locale}/login`,languages:{ar:"/ar/login",en:"/en/login"}}};}
export default async function Login({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{confirmation?:string;next?:string}>}) {
 const {locale}=await params;if(!isLocale(locale))notFound();
 const query=await searchParams;const nextPath=safeWorkspacePath(query.next||null,locale);
 if(await authenticatedUser())redirect(nextPath);
 const failed=query.confirmation==="failed";
 return <div className="min-h-dvh bg-background"><PageHeader/><main id="main-content" tabIndex={-1} className="design-grid flex min-h-[calc(100dvh-112px)] items-center justify-center px-5 py-10"><div className="w-full max-w-md">{failed&&<p role="alert" className="mb-5 rounded-xl border border-border p-4 text-sm leading-7">{locale==="ar"?"رابط التأكيد غير صالح أو انتهت صلاحيته. جرّب تسجيل الدخول بعد التأكيد، أو أعد طلب التسجيل.":"The confirmation link is invalid or expired. Sign in after confirming your email, or request registration again."}</p>}<AuthForm nextPath={nextPath} locale={locale} configured={Boolean(authConfig())}/></div></main></div>;
}
