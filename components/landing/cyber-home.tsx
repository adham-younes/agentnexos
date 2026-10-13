"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, CheckCheck, ChevronDown, ShieldCheck, Workflow } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-t";
import { cyberHome } from "@/lib/content/cyber-home";
import { Navigation } from "./navigation";
import { CyberEffects, Glass as Spotlight } from "@/components/cyber/effects";
import { WorkflowConsole } from "@/components/cyber/console";
import { Lightning } from "@/components/cyber/lightning";
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
        <Lightning />
        <div className="cyber-ambient" aria-hidden="true" />
        <div className="cyber-container cyber-hero-grid">
          <div className="cyber-hero-copy">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1>{c.headline}<br /><em>{c.emphasis}</em></h1>
            <p className="cyber-hero-intro">{c.intro}</p>
            <div className="cyber-actions"><Action href={`/${locale}/agentnexos`}>{c.primary}</Action><Action secondary href={`/${locale}/start`}>{c.secondary}</Action></div>
            <p className="cyber-note"><ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />{c.note}</p>
          </div>
          <WorkflowConsole locale={locale} />
        </div>
        <div className="cyber-container cyber-hero-foot"><p><span className="cyber-small-rule" aria-hidden="true" />{c.region}</p><a href="#features">{c.scroll}<ArrowDown className="size-3.5" aria-hidden="true" /></a></div>
      </section>

      <section id="features" className="cyber-section cyber-container">
        <div className="cyber-section-heading" data-reveal><div><Eyebrow>{c.capabilitiesLabel}</Eyebrow><h2>{c.capabilitiesTitle}<br /><em>{c.capabilitiesEmphasis}</em></h2></div><p>{c.capabilitiesIntro}</p></div>
        <div className="cyber-capabilities">{c.capabilities.map((item, index) => {const Icon = icons[index]; return <Spotlight key={item.title} className="cyber-capability"><div className="cyber-card-top"><span className="cyber-icon"><Icon className="size-5" aria-hidden="true" /></span><span className="cyber-meta" dir="ltr">0{index + 1}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="cyber-card-detail"><Check className="size-3.5 shrink-0" aria-hidden="true" />{item.detail}</div></Spotlight>;})}</div>
      </section>

      <section id="solutions" className="cyber-section cyber-section-tinted">
        <div className="cyber-container"><div className="cyber-section-heading" data-reveal><div><Eyebrow>{c.casesLabel}</Eyebrow><h2>{c.casesTitle}</h2></div><p>{c.casesIntro}</p></div>
          <div role="tablist" aria-label={c.casesTabs} className="cyber-tabs">{c.cases.map((item, i) => <button key={item.name} id={`case-tab-${i}`} type="button" role="tab" aria-selected={active === i} aria-controls="case-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={event => selectTab(event, i)}>{item.name}<ArrowUpRight className="size-3.5 rtl:-rotate-90" aria-hidden="true" /></button>)}</div>
          <div id="case-panel" role="tabpanel" tabIndex={0} aria-labelledby={`case-tab-${active}`} className="cyber-case-panel"><div className="cyber-case-story"><span className="cyber-meta" dir="ltr">0{active + 1} / 03</span><h3>{selected.title}</h3><p>{selected.description}</p><Link href={`/${locale}/agentnexos`} className="cyber-text-link">{c.caseAction}<ArrowUpRight className="size-4 rtl:-rotate-90" aria-hidden="true" /></Link></div><ol className="cyber-case-steps">{[[c.inputs, selected.input], [c.decision, selected.decision], [c.output, selected.output]].map(([label, text], i) => <li key={label}><span className="cyber-case-node" aria-hidden="true">{i === 2 ? <Check className="size-3" /> : <span />}</span><div><h4>{label}</h4><p>{text}</p></div></li>)}</ol></div>
          <p className="cyber-section-note">{c.caseNotice}</p>
        </div>
      </section>

      <section id="how-it-works" className="cyber-section cyber-container"><div className="cyber-section-heading" data-reveal><div><Eyebrow>{c.processLabel}</Eyebrow><h2>{c.processTitle}</h2></div><p>{c.processIntro}</p></div><div className="cyber-process">{c.steps.map((step, i) => <article key={step.title} data-reveal><span className="cyber-process-index" dir="ltr">0{i + 1}<span aria-hidden="true" /></span><h3>{step.title}</h3><p>{step.text}</p><p className="cyber-deliverable">{step.deliverable}</p><Link className="cyber-text-link" href={`/${locale}/${step.href}`}>{step.action}<ArrowUpRight className="size-4 rtl:-rotate-90" aria-hidden="true" /></Link></article>)}</div></section>

      <section id="availability" className="cyber-section cyber-container cyber-availability"><div className="cyber-section-heading" data-reveal><div><Eyebrow>{c.availabilityLabel}</Eyebrow><h2>{c.availabilityTitle}</h2></div><p>{c.availabilityIntro}</p></div><div className="cyber-table-wrap" role="region" aria-label={c.availabilityTitle} tabIndex={0}><table><caption className="sr-only">{c.availabilityTitle}</caption><thead><tr><th scope="col">{c.tableFeature}</th><th scope="col">{c.tableUse}</th><th scope="col">{c.tableStatus}</th></tr></thead><tbody>{c.availability.map(([name, description, status]) => <tr key={name}><th scope="row">{name}</th><td>{description}</td><td><span className={`cyber-availability-status ${status === "available" ? "is-available" : ""}`}>{status === "available" && <Check className="size-3.5 shrink-0" aria-hidden="true" />}{status === "available" ? c.available : status === "scoped" ? c.scoped : c.notEnabled}</span></td></tr>)}</tbody></table></div></section>

      <section id="security" className="cyber-section cyber-container"><Spotlight className="cyber-security"><div><Eyebrow>{c.securityLabel}</Eyebrow><h2>{c.securityTitle}</h2><p>{c.securityIntro}</p><Link href={`/${locale}/security`} className="cyber-text-link">{c.securityAction}<ArrowUpRight className="size-4 rtl:-rotate-90" aria-hidden="true" /></Link></div><ul>{c.securityItems.map(text => <li key={text}><ShieldCheck className="size-5 shrink-0" aria-hidden="true" />{text}</li>)}</ul></Spotlight></section>

      <section id="questions" className="cyber-section cyber-container cyber-faq"><div><Eyebrow>{c.faqLabel}</Eyebrow><h2>{c.faqTitle}</h2></div><div>{c.faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown className="size-4 shrink-0" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>

      <section id="contact" className="cyber-section cyber-container cyber-final"><Eyebrow>{c.ctaLabel}</Eyebrow><h2 className="nexus-gradient">{c.ctaTitle}<br /><em>{c.ctaEmphasis}</em></h2><p>{c.ctaText}</p><div className="cyber-actions"><Action href={`/${locale}/agentnexos`}>{c.primary}</Action><Action secondary href={`/${locale}/start`}>{c.secondary}</Action></div></section>
    </main>
    <CyberFooter locale={locale} />
  </CyberEffects>;
}
