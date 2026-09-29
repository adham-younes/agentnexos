"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/use-t";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { useParams } from "next/navigation";

export default function PrivacyPage() {
  const t = useT();
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

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
          <LocaleSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("privacyPage.title", "Privacy Policy & Data Governance")}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              "privacyPage.subtitle",
              "Strict commitment to data sovereignty with zero training on customer enterprise data."
            )}
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed border-t border-border/40 pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              {t("privacyPage.section1.title", "1. Data Sovereignty & Hosting")}
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t(
                "privacyPage.section1.desc",
                "Agentnexos is committed to retaining enterprise data and audit logs within certified cloud facilities adhering to regional MENA compliance standards."
              )}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              {t("privacyPage.section2.title", "2. Zero Customer Data Training")}
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t(
                "privacyPage.section2.desc",
                "Your prompts, business data, and enterprise documents are never used to train foundational or third-party AI models."
              )}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              {t("privacyPage.section3.title", "3. Automated PII & Secret Redaction")}
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t(
                "privacyPage.section3.desc",
                "All inputs undergo automated redaction of national IDs, payment cards, and secret keys prior to inference."
              )}
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>© 2026 Agentnexos. All rights reserved.</p>
      </footer>
    </div>
  );
}
