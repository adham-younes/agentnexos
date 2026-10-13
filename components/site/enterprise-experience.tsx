"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, Check, Database, FileCheck2, GitBranch, LockKeyhole, Mail, ShieldCheck, UserRoundCheck, Workflow } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { enterpriseStory } from "@/lib/content/enterprise-story";

export function SectorExplorer({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
 const c = enterpriseStory[locale];
 const [active, setActive] = useState(0);
 const selected = c.cases[active];
 function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
  const key = event.key;
  // This tab list is vertical in both RTL and LTR, so follow its visual axis.
  const next = key === "Home" ? 0 : key === "End" ? c.cases.length - 1 :
   key === "ArrowDown" ? (index + 1) % c.cases.length :
   key === "ArrowUp" ? (index - 1 + c.cases.length) % c.cases.length : null;
  if(next === null) return;event.preventDefault();setActive(next);
  document.getElementById(`sector-tab-${compact ? "home" : "page"}-${next}`)?.focus();
 }
 return <section className={`enterprise-explorer ${compact ? "is-compact" : ""}`} aria-labelledby={compact ? "enterprise-home-title" : "enterprise-page-title"}>
  <div className="enterprise-intro">
   <p className="enterprise-kicker">{c.chapter}</p>
   <h2 id={compact ? "enterprise-home-title" : "enterprise-page-title"}>{c.title}</h2>
   <p>{c.intro}</p>
  </div>
  <div className="enterprise-explorer-shell">
   <div className="enterprise-sector-nav" role="tablist" aria-label={c.choose} aria-orientation="vertical">
    {c.cases.map((item,index) => <button
      key={item.id} id={`sector-tab-${compact ? "home" : "page"}-${index}`} role="tab" type="button"
      aria-selected={active===index} tabIndex={active===index?0:-1}
      aria-controls={`sector-panel-${compact ? "home" : "page"}`}
      onClick={()=>setActive(index)} onKeyDown={e=>navigate(e,index)}>
      <span className="enterprise-tab-index" dir="ltr">0{index+1}</span>
      <span><small>{item.audience}</small><strong>{item.name}</strong></span>
      <ArrowUpRight size={16} aria-hidden="true"/>
    </button>)}
   </div>
   <div role="tabpanel" id={`sector-panel-${compact ? "home" : "page"}`} aria-labelledby={`sector-tab-${compact ? "home" : "page"}-${active}`} tabIndex={0} className="enterprise-detail">
    <div className="enterprise-detail-top"><span className="enterprise-kicker">{selected.audience}</span><span className="enterprise-design-only">{locale==="ar"?"تصميم مقترح":"Proposed design"}</span></div>
    <h3>{selected.name}</h3>
    <div className="enterprise-problem"><span>{c.friction}</span><p>{selected.friction}</p></div>
    <div className="enterprise-evidence"><Database size={18} aria-hidden="true"/><div><strong>{c.evidence}</strong><p>{selected.inputs}</p></div></div>
    <h4 className="enterprise-flow-heading">{c.process}</h4>
    <ol className="enterprise-flow">
     {selected.path.map((step,i)=><li key={step}><span dir="ltr">0{i+1}</span><p>{step}</p></li>)}
    </ol>
    <div className="enterprise-result-grid">
     <div><UserRoundCheck aria-hidden="true"/><h4>{c.human}</h4><p>{selected.human}</p></div>
     <div><FileCheck2 aria-hidden="true"/><h4>{c.outcome}</h4><p>{selected.output}</p></div>
    </div>
    <p className="enterprise-measure"><span>{c.pilot} </span>{selected.measure}</p>
    <Link href={`/${locale}/agentnexos?case=${selected.id}`} className="enterprise-case-action">{c.start}<ArrowUpRight size={18} aria-hidden="true"/></Link>
   </div>
  </div>
  <p className="enterprise-disclaimer"><ShieldCheck size={16} aria-hidden="true"/>{c.note}</p>
 </section>;
}

export function SystemBlueprint({ locale }: {locale:Locale}) {
 const ar=locale==="ar";
 const stages=ar?[
  ["01","المدخلات","طلب + سياسة + مصدر موثوق"],["02","فحص السياق","صلاحية القراءة واكتمال المعلومات"],["03","تنسيق الوكلاء","تحليل، تخطيط، والتحقق حسب الحاجة"],["04","نقطة الموافقة","المسؤول يرى الأثر قبل الفعل"],["05","النتيجة والتعافي","دليل نجاح، حالة فشل، ومسار استعادة"]
 ]:[
  ["01","Intake","Request + policy + approved source"],["02","Context check","Read permission and input completeness"],["03","Agent orchestration","Analyze, plan, verify as needed"],["04","Approval boundary","Owner sees the impact before action"],["05","Outcome & recovery","Result evidence, failures and recovery path"]
 ];
 return <section className="blueprint-section" aria-labelledby="blueprint-title">
  <div className="blueprint-heading"><p className="enterprise-kicker">{ar?"هندسة النظام":"SYSTEM ENGINEERING"}</p><h2 id="blueprint-title">{ar?"كل خطوة يجب أن تكون قابلة للمساءلة.":"Every step needs an accountable boundary."}</h2><p>{ar?"نرسم مسار العمل كعقد تصميم. الوصول للبيانات والتنفيذ والاحتفاظ بالسجل تُثبت في مشروع المؤسسة، ولا تظهر هنا كخدمات مفعلة.":"This is a design contract. Enterprise data access, execution and durable records require implementation and verification in each deployment."}</p></div>
  <ol className="blueprint-stack">{stages.map(([n,title,description],i)=><li key={n}><span className="blueprint-number" dir="ltr">{n}</span><div><h3>{title}</h3><p>{description}</p></div><span className="blueprint-icon" aria-hidden="true">{i===0?<Database/>:i===1?<LockKeyhole/>:i===2?<Workflow/>:i===3?<UserRoundCheck/>:<GitBranch/>}</span>{i<4&&<ArrowDown className="blueprint-arrow" size={14} aria-hidden="true"/>}</li>)}</ol>
  <p className="blueprint-boundary"><ShieldCheck size={20}/>{ar?"هذه صورة لنظام مخصص يمكن هندسته. المعاينة الحالية تقدم مساعد تخطيط محدودًا، من دون تنفيذ مؤسسي.":"A blueprint for a custom implementation. The current public preview is a bounded planning assistant, with no enterprise execution."}</p>
 </section>;
}

export function FounderIntroduction({locale}:{locale:Locale}) {
 const c=enterpriseStory[locale];
 return <section className="enterprise-founder-intro" aria-labelledby="founder-intro-title">
  <div className="enterprise-founder-monogram" aria-hidden="true"><span>AY</span><span className="enterprise-founder-grid"/></div>
  <div><p className="enterprise-kicker">{c.founderEyebrow}</p><h2 id="founder-intro-title">{c.founderTitle}</h2><p>{c.founderIntro}</p><Link href={`/${locale}/founder`} className="enterprise-case-action">{c.founderLink}<ArrowUpRight size={17}/></Link></div>
 </section>;
}

export function FounderIdentity({locale}:{locale:Locale}) {
 const ar=locale==="ar";
 return <section className="founder-identity" aria-labelledby="founder-name">
  <div className="founder-signature" aria-hidden="true"><span>AY.</span><p>AGENT SYSTEMS / ENGINEERING</p></div>
  <div><span className="enterprise-kicker">{ar?"المؤسس ومهندس أنظمة الوكلاء":"FOUNDER & AGENT SYSTEMS ENGINEER"}</span><h2 id="founder-name" dir="ltr">ADHAM YOUNES MOHAMED AHMED</h2>
  <p>{ar?"أعمل على هندسة حلول وكلاء الذكاء الاصطناعي للمؤسسات، من تحليل العملية ومصادر البيانات إلى تصميم الأدوات والصلاحيات وتنسيق خطوات التنفيذ والمراجعة البشرية. أركز على تطبيقات الأعمال في مصر والخليج، وعلى تسليم نطاق يمكن اختباره قبل توسيعه.":"I work on enterprise AI agent systems, from process discovery and data-source mapping to tool design, permissions, orchestration and human review. My focus is practical business workflows for organizations in Egypt and the Gulf, with testable delivery scope before expansion."}</p>
  <p>{ar?"طورت مشروعات مستقلة تشمل Agentnexos وتصميم مسارات عمل وكلاء المؤسسات، وAdham AgriTech الذي يربط خبرة التشغيل الزراعي بتطوير أدوات رقمية للمتابعة والتخطيط. خبرتي تجمع تطوير الويب، Python، تكامل واجهات البرمجة، واستكشاف الحلول المبنية على RAG.":"Independent work includes Agentnexos, focused on enterprise agent workflow design, and Adham AgriTech, bringing practical agricultural operations into digital planning and support workflows. My engineering work covers web development, Python, API integration and retrieval-based agent systems."}</p>
  <div className="founder-actions">
   <a href="mailto:adham@adham-agritech.com"><Mail size={18}/><span>adham@adham-agritech.com</span><ArrowUpRight size={15}/></a>
   <a href="tel:+201110093730" dir="ltr">+20 111 009 3730 <ArrowUpRight size={15}/></a>
  </div>
  <p className="founder-disclosure">{ar?"لا توجد هنا شهادات امتثال أو نتائج عملاء أو تكاملات تشغيلية يُدّعى إنجازها. تبدأ أي شراكة بتحديد النطاق وفحص مصادر البيانات والتفويض المطلوب.":"No client outcome, certification or live enterprise integration is claimed on this page. An engagement starts with scope, data ownership and authorization checks."}</p>
  </div>
 </section>;
}
