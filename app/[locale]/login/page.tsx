import { revisionMetadata } from '@/lib/content/revision';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';
import { LoginGateway } from '@/components/site/login-gateway';
import { siteOrigin } from '@/lib/site';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const base = revisionMetadata('login', locale);
  const title = locale === 'ar' ? 'تسجيل الدخول وإنشاء حساب — AGYNEXA' : 'Sign in and create an account — AGYNEXA';
  const description = locale === 'ar'
    ? 'ابدأ كزائر أو أنشئ حسابًا لحفظ محادثاتك الخاصة وفتحها أو حذفها لاحقًا. الحساب لا يمنح وصولًا إلى أنظمة المؤسسات.'
    : 'Start as a guest or create an account to save, reopen and delete your private conversations. Accounts do not grant enterprise-system access.';
  const url = `${siteOrigin}/login`;
  return { ...base, title, description, alternates: { canonical: url }, robots: { index: false, follow: true },
    openGraph: { ...base.openGraph, title, description, url }, twitter: { ...base.twitter, title, description } };
}
export default function LoginPage() { return <LoginGateway/>; }
