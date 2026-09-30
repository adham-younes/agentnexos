"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/use-t";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  Building2,
  Network,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function SolutionsPage() {
  const t = useT();
  const params = useParams();
  const locale = (params?.locale as string) || "ar";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* Top Header */}
      <PageHeader />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MENA Enterprise Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("solutions.title", "Enterprise Agent Solutions")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t(
              "solutions.subtitle",
              "Automating sensitive operations with MENA-compliant sectoral controls, human approvals, and cryptographic evidence."
            )}
          </p>
        </div>

        {/* 3 Core Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solution 1: ZATCA E-Invoicing */}
          <div className="p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {t("solutions.card1.title", "Compliance & E-Invoicing (ZATCA Phase 2)")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(
                  "solutions.card1.desc",
                  "Pre-validating invoices, generating digital stamps, and ensuring regulatory compliance before tax gateway dispatch."
                )}
              </p>
            </div>
            <ul className="space-y-2 pt-4 border-t border-border/40 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>XML Schema & Cryptographic Stamp</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pre-flight Error Prevention</span>
              </li>
            </ul>
          </div>

          {/* Solution 2: Procurement Matrix */}
          <div className="p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {t("solutions.card2.title", "Procurement & Delegation of Authority")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(
                  "solutions.card2.desc",
                  "Enforcing authority thresholds, dual-authorization for disbursements over $10,000, and commercial registration clearance."
                )}
              </p>
            </div>
            <ul className="space-y-2 pt-4 border-t border-border/40 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>$10,000 Threshold Dual Signature</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Vendor Tax Clearance Verification</span>
              </li>
            </ul>
          </div>

          {/* Solution 3: Cross-System Orchestration */}
          <div className="p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Network className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {t("solutions.card3.title", "Cross-System Operational Orchestration")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(
                  "solutions.card3.desc",
                  "Connecting ERPs and databases into traceable workflows requiring human approval before external state changes."
                )}
              </p>
            </div>
            <ul className="space-y-2 pt-4 border-t border-border/40 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Idempotent External Action Tools</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Append-Only Tamper-Proof Audit</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Live CTA Section */}
        <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            {t("solutions.cta", "Explore a workflow example")}
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            {t(
              "agent.banner.notice",
              "Explore a fictional review and approval example. It does not connect to company systems or execute external actions."
            )}
          </p>
          <Button asChild className="rounded-full px-6 text-xs">
            <Link href={`/${locale}/agentnexos`}>
              <span>{t("solutions.cta", "Explore a workflow example")}</span>
              <ExternalLink className="w-3.5 h-3.5 ms-2" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>© 2026 Agentnexos. All rights reserved.</p>
      </footer>
    </div>
  );
}
