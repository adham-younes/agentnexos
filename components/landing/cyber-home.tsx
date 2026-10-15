"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, CheckCheck, ChevronDown, ShieldCheck, Workflow } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-t";
import { ContentBody } from "@/components/site/content-body";
import { revision } from "@/lib/content/revision";
import { cyberHome } from "@/lib/content/cyber-home";
import { Navigation } from "./navigation";
import { CyberEffects, Glass as Spotlight } from "@/components/cyber/effects";
import { WorkflowConsole } from "@/components/cyber/console";
import { CyberFooter } from "@/components/cyber/footer";

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="cyber-eyebrow"><span aria-hidden="true" />{children}</p>;
}

function Action({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <Link href={href} className={secondary ? "cyber-button cyber-button-secondary" : "cyber-button cyber-button-primary"}>{children}<ArrowUpRight className="size-4 shrink-0 rtl:-rotate-90" aria-hidden="true" /></Link>;
}

export function CyberHome() {
  const locale = useLocale();
  const c = cyberHome[locale];
  const reviewed = revision[locale].home;
  const sections = reviewed.sections;
  const [active, setActive] = useState(0);
  const selected = c.cases[active];
  const icons = [Workflow, ShieldCheck, CheckCheck];
  function selectTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = c.cases.length - 1;
    else if (event.key === "ArrowRight") next = (index + (locale === "ar" ? -1 : 1) + c.cases.length) % c.cases.length;
    else if (event.key === "ArrowLeft") next = (index + (locale === "ar" ? 1 : -1) + c.cases.length) % c.cases.length;
    else return;
    event.preventDefault(); setActive(next); document.getElementById(`case-tab-${next}`)?.focus();
  }
  return <CyberEffects className="cyber-home">
    <Navigation />
    <main id="main-content" tabIndex={-1}>
      <section id="top" className="cyber-hero">
        <div className="reference-ribbon" aria-hidden="true" />
        <div className="cyber-container cyber-hero-grid">
          <div className="cyber-hero-copy">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1>{reviewed.title.split(" ").slice(0,2).join(" ")}{" "}<br/><em>{reviewed.title.split(" ").slice(2).join(" ")}</em></h1>
            <div className="cyber-hero-intro">{reviewed.intro.split(/\n\s*\n/).map((paragraph,index)=><p key={index} className={index ? "mt-3" : undefined}>{paragraph}</p>)}</div>
            <div className="cyber-actions"><Action href={`/${locale}/agentnexos`}>{c.primary}</Action><Action secondary href={`/${locale}/start`}>{c.secondary}</Action></div>
            <p className="cyber-note"><ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />{c.note}</p>
          </div>
        </div>
        <div className="cyber-container cyber-hero-foot"><p><span className="cyber-small-rule" aria-hidden="true" />{locale === "ar" ? "أنظمة مخصصة للمؤسسات حول العالم" : "Custom systems for organizations worldwide"}</p><a href="#features">{c.scroll}<ArrowDown className="size-3.5" aria-hidden="true" /></a></div>
      </section>

      <section id="features" className="cyber-section cyber-container">
        <div className="cyber-section-heading" data-reveal><div><Eyebrow>{c.capabilitiesLabel}</Eyebrow><h2>{c.capabilitiesTitle}<br /><em>{c.capabilitiesEmphasis}</em></h2></div><p>{c.capabilitiesIntro}</p></div>
        <div className="reference-about-visual"><Image src="/images/redesign/green-neural-brain.webp" alt="" width={1024} height={1024} sizes="(max-width: 600px) 100vw, 45vw" /><WorkflowConsole locale={locale} /></div>
        <div className="cyber-capabilities">{sections.slice(0,2).map((section,index) => { const Icon = icons[index]; return <Spotlight key={section.id} className="cyber-capability"><section id={section.id}><div className="cyber-card-top"><span className="cyber-icon"><Icon className="size-5" aria-hidden="true"/></span><span className="cyber-meta">0{index+1}</span></div><h3>{section.heading}</h3><ContentBody text={section.body}/></section></Spotlight>; })}<Spotlight className="cyber-capability"><div className="cyber-card-top"><span className="cyber-icon"><CheckCheck className="size-5" aria-hidden="true"/></span><span className="cyber-meta">03</span></div><h3>{c.capabilities[2].title}</h3><p>{c.capabilities[2].description}</p><div className="cyber-card-detail"><Check className="size-3.5" aria-hidden="true"/>{c.capabilities[2].detail}</div></Spotlight></div>
      </section>

      <section id="solutions" className="cyber-section cyber-section-tinted">
        <div className="cyber-container"><div className="cyber-section-heading" data-reveal><div><Eyebrow>{c.casesLabel}</Eyebrow><h2 id={sections[2].id}>{sections[2].heading}</h2></div><p>{c.casesIntro}</p></div>
          <div role="tablist" aria-label={c.casesTabs} className="cyber-tabs">{c.cases.map((item, i) => <button key={item.name} id={`case-tab-${i}`} type="button" role="tab" aria-selected={active === i} aria-controls="case-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={event => selectTab(event, i)}>{item.name}<ArrowUpRight className="size-3.5 rtl:-rotate-90" aria-hidden="true" /></button>)}</div>
          <div id="case-panel" role="tabpanel" tabIndex={0} aria-labelledby={`case-tab-${active}`} className="cyber-case-panel"><div className="cyber-case-story"><span className="cyber-meta" dir="ltr">0{active + 1} / 03</span><h3>{selected.title}</h3><p>{selected.description}</p><Link href={`/${locale}/agentnexos`} className="cyber-text-link">{c.caseAction}<ArrowUpRight className="size-4 rtl:-rotate-90" aria-hidden="true" /></Link></div><ol className="cyber-case-steps">{[[c.inputs, selected.input], [c.decision, selected.decision], [c.output, selected.output]].map(([label, text], i) => <li key={label}><span className="cyber-case-node" aria-hidden="true">{i === 2 ? <Check className="size-3" /> : <span />}</span><div><h4>{label}</h4><p>{text}</p></div></li>)}</ol></div>
          <div className="nexus-editorial-card"><ContentBody text={sections[2].body}/></div>
          <p className="cyber-section-note">{c.caseNotice}</p>
        </div>
      </section>

      <section id="how-it-works" className="cyber-section cyber-container"><div className="cyber-section-heading" data-reveal><div><Eyebrow>{c.processLabel}</Eyebrow><h2>{sections[4].heading}</h2></div><div id={sections[4].id}><ContentBody text={sections[4].body}/></div></div><div className="cyber-process">{c.steps.map((step, i) => <article key={step.title} data-reveal><span className="cyber-process-index" dir="ltr">0{i + 1}<span aria-hidden="true" /></span><h3>{step.title}</h3><p>{step.text}</p><p className="cyber-deliverable">{step.deliverable}</p><Link className="cyber-text-link" href={`/${locale}/${step.href}`}>{step.action}<ArrowUpRight className="size-4 rtl:-rotate-90" aria-hidden="true" /></Link></article>)}</div></section>

      <section id="availability" className="cyber-section cyber-container cyber-availability"><div className="cyber-section-heading" data-reveal><div><Eyebrow>{c.availabilityLabel}</Eyebrow><h2>{sections[5].heading}</h2></div><div id={sections[5].id}><ContentBody text={sections[5].body}/></div></div><div className="cyber-table-wrap" role="region" aria-label={c.availabilityTitle} tabIndex={0}><table><caption className="sr-only">{c.availabilityTitle}</caption><thead><tr><th scope="col">{c.tableFeature}</th><th scope="col">{c.tableUse}</th><th scope="col">{c.tableStatus}</th></tr></thead><tbody>{c.availability.map(([name, description, status]) => <tr key={name}><th scope="row">{name}</th><td>{description}</td><td><span className={`cyber-availability-status ${status === "available" ? "is-available" : ""}`}>{status === "available" && <Check className="size-3.5 shrink-0" aria-hidden="true" />}{status === "available" ? c.available : status === "scoped" ? c.scoped : c.notEnabled}</span></td></tr>)}</tbody></table></div></section>

      <section id="security" className="cyber-section cyber-container"><Spotlight className="cyber-security"><div><Eyebrow>{c.securityLabel}</Eyebrow><h2>{sections[3].heading}</h2><div id={sections[3].id}><ContentBody text={sections[3].body}/></div><Link href={`/${locale}/security`} className="cyber-text-link">{c.securityAction}<ArrowUpRight className="size-4 rtl:-rotate-90" aria-hidden="true" /></Link></div><ul>{c.securityItems.map(text => <li key={text}><ShieldCheck className="size-5 shrink-0" aria-hidden="true" />{text}</li>)}</ul></Spotlight></section>

      <section id="questions" className="cyber-section cyber-container cyber-faq"><div><Eyebrow>{c.faqLabel}</Eyebrow><h2 id={sections[7].id}>{sections[7].heading}</h2></div><div>{sections[7].body.split("### ").filter(Boolean).map(block => { const [question,...answer] = block.trim().split("\n"); return <details key={question}><summary>{question}<ChevronDown className="size-4 shrink-0" aria-hidden="true" /></summary><ContentBody text={answer.join("\n").trim()}/></details>;})}</div></section>

      <section id="contact" className="cyber-section cyber-container cyber-final"><Eyebrow>{c.ctaLabel}</Eyebrow><h2 className="nexus-gradient">{sections[6].heading}</h2><div id={sections[6].id}><ContentBody text={sections[6].body}/></div><div className="cyber-actions"><Action href={`/${locale}/agentnexos`}>{c.primary}</Action><Action secondary href={`/${locale}/start`}>{c.secondary}</Action></div></section>
    </main>
    <CyberFooter locale={locale} />
  </CyberEffects>;
}
