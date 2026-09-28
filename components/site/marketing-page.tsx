import Link from "next/link";
import { ArrowDownLeft, ArrowDownRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getSiteContent } from "@/lib/site-content";
import { AgentConsole } from "./agent-console";

export function MarketingPage({ locale }: { locale: Locale }) {
  const c = getSiteContent(locale); const rtl = locale === "ar"; const Arrow = rtl ? ArrowDownLeft : ArrowDownRight;
  return <main className="site-shell">
    <header className="site-nav">
      <Link href={`/${locale}`} className="wordmark" aria-label="Agentnexos home"><span>Agent</span><strong>nexos</strong></Link>
      <nav aria-label={rtl ? "التنقل الرئيسي" : "Main navigation"}>{c.nav.map((label,index)=><a href={`#${c.navIds[index]}`} key={label}>{label}</a>)}</nav>
      <div className="nav-actions"><Link href={`/${rtl?"en":"ar"}`} className="lang-link">{rtl?"EN":"ع"}</Link><a href="#agent" className="nav-cta">{c.primary}<ArrowUpRight size={16}/></a></div>
    </header>
    <section className="hero-grid">
      <div className="hero-copy"><div className="eyebrow"><span className="signal-dot"/>{c.badge}</div><h1>{c.title}</h1><p>{c.intro}</p><div className="hero-actions"><a href="#agent" className="button-primary">{c.primary}<Arrow size={18}/></a><a href="#platform" className="button-ghost">{c.secondary}</a></div></div>
      <div className="system-map" aria-label={rtl?"مخطط نظام وكيل":"Agent system diagram"}><div className="map-status"><span className="signal-dot"/>{c.status}</div><div className="map-node node-input"><small>01 / INPUT</small><b>{rtl?"طلب تشغيلي":"Operational request"}</b></div><div className="map-line line-a"/><div className="map-core"><span>AN</span><small>AGENTNEXOS</small></div><div className="map-line line-b"/><div className="map-node node-policy"><small>02 / POLICY</small><b>{rtl?"قرار وموافقة":"Decision + approval"}</b></div><div className="map-line line-c"/><div className="map-node node-output"><small>03 / ACTION</small><b>{rtl?"أداة ونتيجة":"Tool + outcome"}</b></div></div>
      <div className="proof-row">{c.proof.map(item=><span key={item}><Check size={15}/>{item}</span>)}</div>
    </section>
    <section id="platform" className="section section-light"><div className="section-head"><span className="section-index">01</span><div><p className="kicker">{c.platformKicker}</p><h2>{c.platformTitle}</h2></div><p className="section-lead">{c.platformBody}</p></div><div className="layer-grid">{c.layers.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
    <section id="solutions" className="section section-dark"><div className="section-head"><span className="section-index">02</span><div><p className="kicker">{c.solutionsKicker}</p><h2>{c.solutionsTitle}</h2></div></div><div className="solution-list">{c.solutions.map(([t,d],i)=><article key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p><ArrowUpRight size={24}/></article>)}</div></section>
    <section id="industries" className="section section-paper"><div className="section-head"><span className="section-index">03</span><div><p className="kicker">{c.industriesKicker}</p><h2>{c.industriesTitle}</h2></div></div><div className="industry-grid">{c.industries.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span>{x}</div>)}</div></section>
    <section id="security" className="section security-section"><div className="security-mark"><ShieldCheck strokeWidth={1}/><span>CONTROL / EVIDENCE / RECOVERY</span></div><div><p className="kicker">{c.securityKicker}</p><h2>{c.securityTitle}</h2><p className="security-copy">{c.securityBody}</p></div><ul>{c.securityItems.map(x=><li key={x}><Check size={16}/>{x}</li>)}</ul></section>
    <section id="agent" className="section agent-section"><div className="agent-intro"><p className="kicker">{c.agentKicker}</p><h2>{c.agentTitle}</h2><p>{c.agentBody}</p></div><AgentConsole locale={locale}/></section>
    <footer><div className="wordmark"><span>Agent</span><strong>nexos</strong></div><p>{c.footer}</p><span>© 2026</span></footer>
  </main>;
}
