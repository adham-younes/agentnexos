import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { LoginGateway } from "@/components/site/login-gateway";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "ar" ? "تسجيل الدخول — AGYNEXA" : "Login — AGYNEXA", robots: { index: false, follow: true }, alternates: { canonical: `/${locale}/login`, languages: { ar: "/ar/login", en: "/en/login" } } };
}
export default function LoginPage() { return <LoginGateway/>; }
