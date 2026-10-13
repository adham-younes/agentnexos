"use client";
import {useState,type KeyboardEvent} from "react";
import Link from "next/link";
import {ArrowUpRight,ArrowDownRight,BookOpenCheck,CheckCircle2,FileWarning,GitBranch,ShieldCheck} from "lucide-react";
import type {Locale} from "@/lib/i18n/config";
import {industryDossiers} from "@/lib/content/industry-dossiers";
export function IndustryTheatre({locale}:{locale:Locale}){
 const ar=locale==="ar";const list=industryDossiers[locale];const [selected,setSelected]=useState(0);const item=list[selected];
 function keys(e:KeyboardEvent<HTMLButtonElement>,i:number){const next=e.key==="Home"?0:e.key==="End"?list.length-1:e.key==="ArrowLeft"?(i+(ar?1:list.length-1))%list.length:e.key==="ArrowRight"?(i+(ar?list.length-1:1))%list.length:-1;if(next<0)return;e.preventDefault();setSelected(next);document.getElementById("atlas-tab-"+next)?.focus();}
 return <section className="atelier-atlas" aria-labelledby="atelier-atlas-title">
  <div className="atelier-section-intro"><p className="atelier-label"><BookOpenCheck size={16}/>{ar?"دليل الحالات في العالم الحقيقي":"FIELD OPERATIONS / APPLICATION ATLAS"}</p>
  <h2 id="atelier-atlas-title">{ar?"لكل صناعة استثناءاتها. وهنا تبدأ هندسة النظام.":"Every industry has its exceptions. Start there."}</h2>
  <p>{ar?"هنا ثماني مشكلات من واقع طبيعة العمليات في قطاعات مختلفة. ليست دراسات حالة لعملاء Agentnexos. اختر قطاعًا لترى كيف تنتقل من مشكلة يومية إلى تصميم للمعلومات والموافقة ومخرجات يمكن التحقق منها.":"Eight operational patterns from different industries. These are design studies, not Agentnexos customer cases. Select an industry to examine the sources, ownership, failure modes and measurable review output."}</p></div>
  <div className="atelier-atlas-frame">
   <nav className="atelier-atlas-index" aria-label={ar?"اختيار الصناعة":"Industry selection"} role="tablist" aria-orientation="vertical">
    {list.map((entry,i)=><button type="button" id={"atlas-tab-"+i} role="tab" aria-controls="atlas-panel" aria-selected={i===selected} tabIndex={i===selected?0:-1} onClick={()=>setSelected(i)} onKeyDown={e=>keys(e,i)} key={entry.slug}><span dir="ltr">{String(i+1).padStart(2,"0")}</span><strong>{entry.sector}</strong><ArrowUpRight size={17}/></button>)}
   </nav>
   <article className="atelier-atlas-detail" role="tabpanel" id="atlas-panel" aria-labelledby={"atlas-tab-"+selected} tabIndex={0}>
    <div className="atelier-atlas-top"><span className="atelier-label">{item.sector}</span><span className="atelier-atlas-disclosure">{ar?"تصور قابل للدراسة · غير منفذ":"Design study · not deployed"}</span></div>
    <h3>{item.headline}</h3>
    <p className="atelier-atlas-situation">{item.situation}</p>
    <aside className="atelier-atlas-risk"><FileWarning size={20}/><div><strong>{ar?"ماذا قد يفشل؟":"What might fail?"}</strong><p>{item.failure}</p></div></aside>
    <div className="atelier-atlas-two">
     <div><h4>{ar?"الأدلة التي يحتاجها النظام":"Evidence the system needs"}</h4><ul className="atelier-evidence-list">{item.signals.map(s=><li key={s}><CheckCircle2 size={16}/>{s}</li>)}</ul></div>
     <div><h4>{ar?"مسار المعالجة المقترح":"Proposed processing sequence"}</h4><ol className="atelier-mini-flow">{item.architecture.map((s,i)=><li key={s}><span dir="ltr">0{i+1}</span>{s}</li>)}</ol></div>
    </div>
    <div className="atelier-atlas-human"><ShieldCheck size={21}/><div><strong>{ar?"حدود القرار البشري":"Human decision boundary"}</strong><p>{item.decision}</p></div></div>
    <div className="atelier-atlas-outcome"><div><strong>{ar?"مخرجات قابلة للمراجعة":"Reviewable deliverables"}</strong><ul>{item.deliverables.map(s=><li key={s}>{s}</li>)}</ul></div><div><strong>{ar?"مقياس القيمة":"What to measure"}</strong><p>{item.metric}</p></div></div>
    <p className="atelier-atlas-guardrail">{item.trap}</p>
    <Link className="atelier-underline-action" href={`/${locale}/agentnexos?industry=${item.slug}`}>{ar?"ابدأ مسودة لهذه الحالة في مساعد التصميم":"Start a design brief for this case"}<ArrowUpRight size={18}/></Link>
   </article>
  </div>
 </section>;
}
