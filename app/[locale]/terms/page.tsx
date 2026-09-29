"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/use-t";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import { useParams } from "next/navigation";

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>Operating Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("termsPage.title", "Operational Terms of Service")}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              "termsPage.subtitle",
              "Operating boundaries, execution contracts, and mandatory human supervision."
            )}
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed border-t border-border/40 pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              {t("termsPage.section1.title", "1. Platform Nature & Execution Contracts")}
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t(
                "termsPage.section1.desc",
                "Agentnexos operates on explicit, permission-bounded execution contracts rather than open-ended chat."
              )}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              {t("termsPage.section2.title", "2. Mandatory Human Supervision")}
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t(
                "termsPage.section2.desc",
                "All actions that modify external data, export reports, or disburse funds strictly mandate human supervisor approval."
              )}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              {t("termsPage.section3.title", "3. Idempotency Guarantees")}
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t(
                "termsPage.section3.desc",
                "The platform enforces unique idempotency keys to guarantee sensitive actions are never executed more than once."
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
