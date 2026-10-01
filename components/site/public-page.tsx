import Link from "next/link";
import { WorkflowPreview } from "./workflow-preview";
import { FooterSection } from "@/components/landing/footer-section";
import { PageHeader } from "./page-header";
import { publicPages, type PublicPageKey } from "@/lib/content/public-pages";
import type { Locale } from "@/lib/i18n/config";

export function PublicPage({ page, locale }: { page: PublicPageKey; locale: Locale }) {
  const content = publicPages[page][locale];
  const legal = page === "privacy" || page === "terms";

  return (
    <div className="min-h-screen bg-background text-foreground" style={locale === "ar" ? { fontFamily: "var(--font-arabic), var(--font-instrument), sans-serif" } : undefined}>
      <PageHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <nav className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-border/60 pb-5 text-sm" aria-label={locale === "ar" ? "استكشف المنصة" : "Explore the platform"}>
          {([["platform", "المنصة", "Platform"], ["solutions", "الحلول", "Solutions"], ["industries", "القطاعات", "Industries"], ["resources", "الأدلة", "Guides"]] as const).map(([path, ar, en]) => <Link key={path} aria-current={path === page ? "page" : undefined} href={`/${locale}/${path}`} className={path === page ? "text-foreground underline underline-offset-8" : "text-muted-foreground hover:text-foreground"}>{locale === "ar" ? ar : en}</Link>)}
        </nav>
        <div className={legal ? "mx-auto max-w-3xl text-center" : "grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16"}>
          <div className="space-y-5">
            <p className="text-sm font-medium text-primary">{content.eyebrow}</p>
            <h1 className="text-3xl font-semibold leading-[1.4] tracking-tight sm:text-5xl">{content.title}</h1>
            <p className="text-base leading-8 text-foreground/75 sm:text-lg">{content.intro}</p>
          </div>
          {!legal && <WorkflowPreview locale={locale} />}
        </div>
        <p className="mt-10 rounded-xl border-s-2 border-primary/50 bg-foreground/[0.025] p-5 text-sm leading-7 text-foreground/65">{content.notice}</p>
        <div className={`mt-12 grid gap-6 ${page === "solutions" || page === "resources" ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {content.cards.map(([title, description, ...details], index) => (
            <section id={page === "resources" && index === 2 ? "acceptance" : undefined} key={title} className="flex min-w-0 flex-col rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
              <span className="mb-6 text-xs font-mono text-primary">{String(index+1).padStart(2,"0")}</span>
              <h2 className="text-xl font-semibold leading-8">{title}</h2>
              <p className="mt-4 text-base leading-8 text-foreground/75">{description}</p>
              {details.length > 0 && <ul className="mt-6 space-y-3 border-t border-border/50 pt-5 text-sm leading-7 text-foreground/75">{details.map(detail => <li key={detail}>{detail}</li>)}</ul>}
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {!legal && <Link className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4" href={`/${locale}/start`}>{locale === "ar" ? "جهّز موجز المشروع" : "Prepare a project brief"}</Link>}
          <Link className="rounded-xl border border-border px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4" href={`/${locale}/agentnexos`}>{locale === "ar" ? "افتح مساحة الوكيل" : "Open the agent workspace"}</Link>
          <Link className="rounded-xl border border-border px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4" href={`/${locale}/${page === "security" ? "privacy" : "security"}`}>{locale === "ar" ? (page === "security" ? "راجع معالجة البيانات" : "راجع ضوابط التشغيل") : (page === "security" ? "Review data handling" : "Review operating controls")}</Link>
        </div>
      </main>
      <div id="site-footer"><FooterSection /></div>
    </div>
  );
}
