"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale, useT } from "@/lib/i18n/use-t";
import { LocaleSwitcher } from "./locale-switcher";

/** Compact navigation for secondary pages; the landing template keeps its header. */
export function PageHeader() {
  const locale = useLocale();
  const t = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
        <Link href={`/${locale}`} dir="ltr" className="text-xl font-semibold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">
          Agentnexos
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <LocaleSwitcher />
          <Link href={`/${locale}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground/80 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            <span className="hidden sm:inline">{t("agent.backToHome", "Back to Home")}</span>
            <span className="sm:hidden">{t("nav.home", "Home")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
