import Link from "next/link";
import { PageHeader } from "./page-header";
import { publicPages, type PublicPageKey } from "@/lib/content/public-pages";
import type { Locale } from "@/lib/i18n/config";

export function PublicPage({ page, locale }: { page: PublicPageKey; locale: Locale }) {
  const content = publicPages[page][locale];
  const legal = page === "privacy" || page === "terms";
  const image = page === "security" ? "/images/permissions.jpg" : page === "platform" ? "/images/bridge.png" : "/images/whale.png";
  return (
    <div className="min-h-screen bg-background text-foreground" style={locale === "ar" ? { fontFamily: "var(--font-arabic), var(--font-instrument), sans-serif" } : undefined}>
      <PageHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <nav className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-border/60 pb-5 text-sm" aria-label={locale === "ar" ? "استكشف المنصة" : "Explore the platform"}>
          {([["platform", "المنصة", "Platform"], ["solutions", "الحلول", "Solutions"], ["industries", "القطاعات", "Industries"], ["resources", "الأدلة", "Guides"]] as const).map(([path, ar, en]) => <Link key={path} aria-current={path === page ? "page" : undefined} href={`/${locale}/${path}`} className={path === page ? "text-foreground underline underline-offset-8" : "text-muted-foreground hover:text-foreground"}>{locale === "ar" ? ar : en}</Link>)}
        </nav>
        <div className={legal ? "mx-auto max-w-3xl text-center" : "grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16"}>
          <div className="space-y-5">
            <p className="text-sm font-medium text-[#eca8d6]">{content.eyebrow}</p>
            <h1 className="text-3xl font-semibold leading-[1.4] tracking-tight sm:text-5xl">{content.title}</h1>
            <p className="text-base leading-8 text-foreground/75 sm:text-lg">{content.intro}</p>
          </div>
          {!legal && <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6">
            {/* Reuse template assets with dimensions independent of copy. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" aria-hidden="true" className={page === "security" ? "h-full w-full rounded-2xl object-cover" : "h-full w-full object-contain"} />
          </div>}
        </div>
        <p className="mt-10 rounded-xl border-s-2 border-[#eca8d6]/50 bg-foreground/[0.025] p-5 text-sm leading-7 text-foreground/65">{content.notice}</p>
        <div className={`mt-12 grid gap-6 ${page === "solutions" || page === "resources" ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {content.cards.map(([title, description, ...details], index) => (
            <section key={title} className="flex min-w-0 flex-col rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
              <span className="mb-6 text-xs font-mono text-[#eca8d6]">{String(index+1).padStart(2,"0")}</span>
              <h2 className="text-xl font-semibold leading-8">{title}</h2>
              <p className="mt-4 text-base leading-8 text-foreground/75">{description}</p>
              {details.length > 0 && <ul className="mt-6 space-y-3 border-t border-border/50 pt-5 text-sm leading-7 text-foreground/75">{details.map(detail => <li key={detail}>{detail}</li>)}</ul>}
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4" href={`/${locale}/agentnexos`}>{locale === "ar" ? "افتح مساحة الوكيل" : "Open the agent workspace"}</Link>
          <Link className="rounded-xl border border-border px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4" href={`/${locale}/${page === "security" ? "privacy" : "security"}`}>{locale === "ar" ? (page === "security" ? "راجع معالجة البيانات" : "راجع ضوابط التشغيل") : (page === "security" ? "Review data handling" : "Review operating controls")}</Link>
        </div>
      </main>
      <footer className="border-t border-border/50 px-5 py-8 text-center text-sm text-muted-foreground"><p>{locale === "ar" ? "© 2026 Agentnexos. جميع الحقوق محفوظة." : "© 2026 Agentnexos. All rights reserved."}</p></footer>
    </div>
  );
}
