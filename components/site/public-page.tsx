import Link from "next/link";
import { PageHeader } from "./page-header";
import { publicPages, type PublicPageKey } from "@/lib/content/public-pages";
import type { Locale } from "@/lib/i18n/config";

export function PublicPage({ page, locale }: { page: PublicPageKey; locale: Locale }) {
  const content = publicPages[page][locale];
  return (
    <div className="min-h-screen bg-background text-foreground" style={locale === "ar" ? { fontFamily: "var(--font-arabic), var(--font-instrument), sans-serif" } : undefined}>
      <PageHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <p className="text-sm font-medium text-primary">{content.eyebrow}</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{content.title}</h1>
          <p className="text-base leading-8 text-foreground/75 sm:text-lg">{content.intro}</p>
        </div>
        <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card/50 p-5 text-sm leading-7 text-foreground/75">{content.notice}</p>
        <div className={`mt-12 grid gap-6 ${page === "solutions" ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {content.cards.map(([title, description, ...details]) => (
            <section key={title} className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
              <h2 className="text-xl font-semibold leading-8">{title}</h2>
              <p className="mt-4 text-base leading-8 text-foreground/75">{description}</p>
              {details.length > 0 && <ul className="mt-6 space-y-3 border-t border-border/50 pt-5 text-sm leading-7 text-foreground/75">{details.map(detail => <li key={detail}>{detail}</li>)}</ul>}
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4" href={`/${locale}/agentnexos`}>{locale === "ar" ? "استكشف مثال العمل" : "Explore the workflow example"}</Link>
          <Link className="rounded-xl border border-border px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4" href={`/${locale}/${page === "security" ? "privacy" : "security"}`}>{locale === "ar" ? (page === "security" ? "راجع معالجة البيانات" : "راجع ضوابط التشغيل") : (page === "security" ? "Review data handling" : "Review operating controls")}</Link>
        </div>
      </main>
      <footer className="border-t border-border/50 px-5 py-8 text-center text-sm text-muted-foreground"><p>{locale === "ar" ? "© 2026 Agentnexos. جميع الحقوق محفوظة." : "© 2026 Agentnexos. All rights reserved."}</p></footer>
    </div>
  );
}
