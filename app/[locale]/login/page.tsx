import { revisionMetadata } from "@/lib/content/revision";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { LoginGateway } from "@/components/site/login-gateway";
export async function generateMetadata({ params }: {
    params: Promise<{
        locale: string;
    }>;
}): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    return { ...revisionMetadata('login', locale), title: locale === 'ar' ? 'تسجيل الدخول وإنشاء حساب — AGYNEXA' : 'Sign in and create an account — AGYNEXA', description: locale === 'ar' ? 'أنشئ حسابك أو سجّل الدخول لاستخدام مساعد تصميم العمليات. لا يمنح الحساب وصولًا إلى أنظمة المؤسسة.' : 'Create an account or sign in to the workflow design assistant. An account does not grant enterprise-system access.', robots: { index: false, follow: true } };
}
export default function LoginPage() { return <LoginGateway />; }
