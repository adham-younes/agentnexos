"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/use-t";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  Database,
  FileKey2,
  Terminal,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function SecurityPage() {
  const t = useT();
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const pillars = [
    {
      icon: Database,
      titleKey: "securityPage.pill1",
      fallback: "Tenant Isolation via Supabase RLS",
      descAr: "عزل كامل لبيانات كل منظمة ومستأجر على مستوى قاعدة البيانات PostgreSQL بواسطة سياسات Row-Level Security الإلزامية.",
      descEn: "Strict multi-tenant isolation enforced at the PostgreSQL database layer via mandatory Supabase Row-Level Security policies.",
    },
    {
      icon: Terminal,
      titleKey: "securityPage.pill2",
      fallback: "Prompt Injection & Jailbreak Guard",
      descAr: "درع أمان ثنائي اللغة يحلل المدخلات ويكشف محاولات تجاوز التعليمات وحقن الفواصل البرمجية والتسريب قبل وصولها للنماذج.",
      descEn: "Bilingual prompt guard detecting system prompt overrides, delimiter hijacking, and environment exfiltration prior to model inference.",
    },
    {
      icon: Lock,
      titleKey: "securityPage.pill3",
      fallback: "Human-in-the-Loop Gateway",
      descAr: "حظر تلقائي لكافة إجراءات الكتابة والتصدير الحساسة حتى يتم اعتمادها صراحة من المشرف البشري عبر واجهة موثقة.",
      descEn: "Automatic pause on all sensitive write/export actions until explicitly authorized by a human supervisor via verified interface.",
    },
    {
      icon: FileKey2,
      titleKey: "securityPage.pill4",
      fallback: "Append-Only SHA-256 Audit Trail",
      descAr: "سجل أحداث غير قابل للتعديل يوثق كل تشغيل واستدعاء أداة وقرار بشري ببصمة تشفيرية فريدة تكشف أي محاولة تلاعب.",
      descEn: "Immutable append-only ledger signing every agent run, tool call, and human decision with SHA-256 integrity proofs.",
    },
    {
      icon: ShieldCheck,
      titleKey: "securityPage.pill5",
      fallback: "SSRF Protection & Network Perimeter",
      descAr: "جدار حماية يمنع استدعاء العناوين المحلية (Loopback)، الشبكات الخاصة (RFC1918)، وبيانات تعريف السحابة (Cloud Metadata).",
      descEn: "Network perimeter blocking loopback IPs, private RFC1918 subnets, and cloud metadata endpoints from tool access.",
    },
    {
      icon: Cpu,
      titleKey: "securityPage.pill6",
      fallback: "Automatic PII & Secret Redaction",
      descAr: "تجهيل فوري لمفاتيح API وأرقام الهوية الوطنية وبطاقات الدفع والبريد الإلكتروني قبل المعالجة لضمان سرية البيانات.",
      descEn: "Automated pre-inference redaction of API tokens, national IDs, payment cards, and emails to preserve enterprise confidentiality.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-40 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <BackIcon className="w-4 h-4" />
              <span>{t("agent.backToHome", "Back to Home")}</span>
            </Link>
            <span className="text-border">|</span>
            <Link href={`/${locale}`} className="font-semibold tracking-tight text-foreground text-sm">
              Agentnexos
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Button asChild size="sm" className="rounded-full text-xs">
              <Link href={`/${locale}/agentnexos`}>
                <span>{t("solutions.cta", "Open Agent Space")}</span>
                <ExternalLink className="w-3.5 h-3.5 ms-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("securityPage.title", "Enterprise Security & Sovereignty")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t(
              "securityPage.subtitle",
              "Multi-layered protection from prompt to cryptographic proof, designed for MENA regulatory compliance."
            )}
          </p>
        </div>

        {/* 6 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">
                    {t(p.titleKey, p.fallback)}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAr ? p.descAr : p.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Audit Verification Note */}
        <div className="p-6 rounded-2xl border border-border/50 bg-background/60 space-y-2 text-xs text-muted-foreground">
          <span className="font-mono text-primary uppercase text-[10px] tracking-wider block">
            Cryptographic Guarantee
          </span>
          <p className="leading-relaxed">
            {isAr
              ? "كافة أحداث التشغيل وقرارات المشرف البشري يتم تشفيرها وتخزينها بصيغة Append-only في جداول مخصصة مع بصمات SHA-256 رقمية، وتظل متاحة للتدقيق والمطابقة القانونية في أي وقت."
              : "All agent runs and human decisions are recorded in an append-only ledger with SHA-256 checksums, available for regulatory audit and mathematical verification."}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>© 2026 Agentnexos. All rights reserved.</p>
      </footer>
    </div>
  );
}
