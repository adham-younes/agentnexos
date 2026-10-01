"use client";

import Link from "next/link";
import { ArrowUpRight, ScanLine, Workflow, ShieldCheck, Check, ArrowRight, FileText, BookOpen, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/use-t";
import { homeCopy } from "@/lib/content/home";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { WorkflowPreview } from "./workflow-preview";

const featureIcons = [ScanLine, Workflow, ShieldCheck];
export function PlatformHome() {
  const locale = useLocale();
  const c = homeCopy[locale];
  return <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <main id="main-content" tabIndex={-1}>
      <section id="top" className="design-grid relative border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_20%,var(--design-glow),transparent_65%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-14 pt-36 sm:px-8 sm:pb-20 sm:pt-44 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <p className="mb-6 flex items-center gap-2 text-xs font-medium tracking-wide text-primary"><span className="size-2 rounded-full bg-primary" />{c.eyebrow}</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.3] tracking-tight sm:text-5xl lg:text-6xl">{c.title}<span className="mt-2 block text-primary">{c.titleAccent}</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">{c.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="h-auto min-h-12 rounded-lg px-5 py-3"><Link href={`/${locale}/agentnexos`}>{c.primary}<ArrowUpRight data-icon="inline-end" className="rtl:-scale-x-100" /></Link></Button><Button asChild size="lg" variant="outline" className="h-auto min-h-12 rounded-lg px-5 py-3"><Link href={`/${locale}/start`}>{c.secondary}</Link></Button></div>
            <p className="mt-5 text-xs leading-6 text-muted-foreground">{c.available}</p>
          </div>
          <WorkflowPreview locale={locale} />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t border-border px-5 py-5 sm:px-8"><p className="text-xs leading-6 text-muted-foreground">{c.region}</p><ul className="flex flex-wrap gap-x-5 gap-y-3">{c.chips.map(chip => <li key={chip} className="flex items-center gap-2 text-xs"><Check className="size-3.5 text-primary" aria-hidden="true" />{chip}</li>)}</ul></div>
      </section>
      <section id="features" className="site-section">
        <SectionTitle label={c.featuresLabel} title={c.featuresTitle} intro={c.featuresIntro} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">{c.features.map(([title, detail], i) => {const Icon=featureIcons[i];return <article key={title} className="design-card"><Icon className="size-6 text-primary" aria-hidden="true" /><h3 className="mt-6 text-xl font-semibold leading-8">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{detail}</p></article>;})}</div>
      </section>
      <section id="how-it-works" className="border-y border-border bg-card/50"><div className="site-section"><SectionTitle label={c.processLabel} title={c.processTitle} intro={c.processIntro} /><ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{c.steps.map(([title, detail], i) => <li key={title} className="border-t border-border pt-5"><span className="font-mono text-sm text-primary">0{i+1}</span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{detail}</p></li>)}</ol></div></section>
      <section id="solutions" className="site-section"><SectionTitle label={c.solutionsLabel} title={c.solutionsTitle} intro={c.solutionsIntro} /><div className="mt-10 grid gap-4 md:grid-cols-3">{c.useCases.map(([title, detail, flow], i) => <Link href={`/${locale}/solutions`} key={title} className="design-card group flex flex-col transition-colors hover:border-primary/50"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">0{i+1}</span><ArrowUpRight className="size-5 text-primary rtl:-scale-x-100" aria-hidden="true" /></div><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{detail}</p><p className="mt-6 border-t border-border pt-4 text-xs leading-6 text-primary">{flow}</p></Link>)}</div><TextLink href={`/${locale}/solutions`}>{c.explore}</TextLink></section>
      <section id="security" className="border-y border-border bg-card/50"><div className="site-section"><SectionTitle label={c.controlsLabel} title={c.controlsTitle} intro={c.controlsIntro} /><div className="mt-10 grid gap-4 md:grid-cols-2">{[[c.now,c.current],[c.later,c.roadmap]].map(([title,items],i)=><article key={String(title)} className="design-card"><div className="flex items-center gap-3">{i===0?<ShieldCheck className="size-5 text-primary"/>:<LockKeyhole className="size-5 text-muted-foreground"/>}<h3 className="text-lg font-semibold">{title}</h3></div><ul className="mt-6 flex flex-col gap-4">{(items as readonly string[]).map(item=><li key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground"><span className={`mt-3 size-1.5 shrink-0 rounded-full ${i===0?"bg-primary":"bg-muted-foreground"}`} />{item}</li>)}</ul></article>)}</div><TextLink href={`/${locale}/security`}>{c.controlsLink}</TextLink></div></section>
      <section id="integrations" className="site-section"><div className="grid gap-10 lg:grid-cols-2"><SectionTitle label={c.resourcesLabel} title={c.resourcesTitle} intro={c.resourcesIntro} /><div className="grid gap-4 sm:grid-cols-2"><Link href={`/${locale}/start`} className="design-card flex flex-col justify-between gap-8 hover:border-primary/50"><FileText className="size-6 text-primary"/><span className="text-lg font-medium">{c.secondary}<ArrowUpRight className="mt-4 size-5 text-primary rtl:-scale-x-100" /></span></Link><Link href={`/${locale}/resources`} className="design-card flex flex-col justify-between gap-8 hover:border-primary/50"><BookOpen className="size-6 text-primary"/><span className="text-lg font-medium">{c.resourcesLink}<ArrowUpRight className="mt-4 size-5 text-primary rtl:-scale-x-100" /></span></Link></div></div></section>
      <section id="pricing" className="design-grid border-t border-border"><div className="site-section text-center"><p className="text-xs text-primary">Agentnexos</p><h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-[1.4] sm:text-4xl">{c.cta}</h2><p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted-foreground">{c.ctaIntro}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild size="lg" className="h-auto min-h-12 rounded-lg px-6 py-3"><Link href={`/${locale}/agentnexos`}>{c.primary}</Link></Button><Button asChild variant="outline" size="lg" className="h-auto min-h-12 rounded-lg px-6 py-3"><Link href={`/${locale}/start`}>{c.secondary}</Link></Button></div><p className="mt-5 text-xs leading-6 text-muted-foreground">{c.exampleNotice}</p></div></section>
    </main>
    <div id="site-footer"><FooterSection /></div>
  </div>;
}
function SectionTitle({label,title,intro}:{label:string;title:string;intro:string}) {return <div className="max-w-2xl"><p className="text-xs font-medium text-primary">{label}</p><h2 className="mt-4 text-3xl font-semibold leading-[1.4] tracking-tight sm:text-4xl">{title}</h2><p className="mt-5 text-base leading-8 text-muted-foreground">{intro}</p></div>}
function TextLink({href,children}:{href:string;children:React.ReactNode}) {return <Link href={href} className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-primary hover:underline hover:underline-offset-4">{children}<ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true"/></Link>}
