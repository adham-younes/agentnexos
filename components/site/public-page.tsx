import Link from "next/link";
import { ArrowUpRight, Check, Database, FileCheck2, GitBranch, LockKeyhole, ShieldCheck, Workflow } from "lucide-react";
import { PageHeader } from "./page-header";
import { publicPages, type PublicPageKey } from "@/lib/content/public-pages";
import type { Locale } from "@/lib/i18n/config";
import { CyberEffects, Glass } from "@/components/cyber/effects";
import { CyberFooter } from "@/components/cyber/footer";
import { FounderIdentity, SectorExplorer, SystemBlueprint } from "./enterprise-experience";

const icons = [Workflow, Database, ShieldCheck, GitBranch, FileCheck2, Check];

function EditorialDiagram({page,locale}:{page:PublicPageKey;locale:Locale}) {
 const ar=locale==="ar";
 const map = {
  platform: ar?["الطلب","السياق","الصلاحية","المخرجات"]:["Intake","Context","Permission","Result"],
  solutions: ar?["سؤال العمل","بيانات الطلب","مراجعة صاحب القرار","مخرج واضح"]:["Work question","Evidence","Owner review","Clear output"],
  industries: ar?["التوزيع","المالية","خدمة العملاء","الخدمات المهنية"]:["Distribution","Finance","Customer service","Professional services"],
  resources: ar?["نطاق محدد","مصدر معتمد","حالات اختبار","قرار البداية"]:["Bounded scope","Approved source","Test cases","Go/no-go decision"],
  security: ar?["هوية موثوقة","أقل صلاحية","موافقة محددة","تحقق من الأثر"]:["Verified identity","Least privilege","Scoped approval","Outcome check"],
  about: ar?["سؤال من الواقع","فهم الاستثناءات","تصميم قابل للاختبار","تسليم معلوم"]:["Real-world problem","Exceptions","Testable design","Accountable handoff"],
  founder: ar?["العملية","هندسة النظام","المراجعة","الاختبار"]:["Process","System design","Review","Validation"],
  privacy: ar?["المعلومات","الغرض","المورد","الاحتفاظ"]:["Data","Purpose","Provider","Retention"],
  terms: ar?["النطاق","التفويض","المراجعة","الاتفاق"]:["Scope","Authorization","Review","Agreement"]
 };
 const rows=map[page] || map.platform;
 return <div className={`editorial-visual editorial-visual-${page}`} aria-label={ar?"رسم يوضح مراحل التصميم":"Diagram of the design stages"}>
  <div className="editorial-orbit" aria-hidden="true"><span/><span/><span/></div>
  <div className="editorial-visual-caption" dir="ltr">AGENTNEXOS / SYSTEM DESIGN</div>
  <ol>{rows.map((row,i)=><li key={row} className={`editorial-step editorial-step-${i}`}><span dir="ltr">0{i+1}</span><strong>{row}</strong>{page==="security"?<LockKeyhole size={17}/>:page==="resources"?<FileCheck2 size={17}/>:<GitBranch size={17}/>}</li>)}</ol>
  <p className="editorial-visual-foot"><ShieldCheck size={15}/>{ar?"تصور هندسي، بلا ربط حي":"Engineering illustration, not a live integration"}</p>
 </div>;
}

export function PublicPage({page,locale}:{page:PublicPageKey;locale:Locale}) {
 const content=publicPages[page][locale], ar=locale==="ar",legal=page==="privacy"||page==="terms",founder=page==="founder",solutions=page==="solutions",platform=page==="platform";
 return <CyberEffects className={`nexus-public nexus-page-${page}`}>
  <PageHeader/><main id="main-content" tabIndex={-1}>
   <section className={`nexus-wrap nexus-page-hero ${legal?"is-legal":""} ${founder?"is-founder":""}`}>
    <div><p className="cyber-eyebrow"><span/>{content.eyebrow}</p>
    <h1>{content.title}</h1><p className="nexus-page-intro">{content.intro}</p>
    {!legal&&!founder&&<Link className="cyber-text-link" href={`/${locale}/start`}>{ar?"حوّل الفكرة إلى موجز يناقشه فريقك":"Prepare a brief your team can review"}<ArrowUpRight size={16}/></Link>}
    </div>{!legal&&!founder&&<EditorialDiagram page={page} locale={locale}/>}
   </section>
   {founder&&<div className="nexus-wrap"><FounderIdentity locale={locale}/></div>}
   {solutions&&<div className="nexus-wrap"><SectorExplorer locale={locale}/></div>}
   {platform&&<div className="nexus-wrap"><SystemBlueprint locale={locale}/></div>}
   {!solutions&&<section className="nexus-wrap nexus-public-content">
    <div className="nexus-section-marker" data-reveal><span dir="ltr">{legal?"DOCUMENT / 2026":founder?"ENGINEERING / PERSONAL":"FIELD GUIDE / AGENTNEXOS"}</span>
    <p>{legal?(ar?"تفاصيل استخدام الخدمة وحدودها.":"Usage and operating details."):(ar?"التفاصيل التي يحتاجها فريقك قبل اتخاذ القرار.":"Details your team needs before making a decision.")}</p></div>
    <div className={legal?"nexus-legal-sections":`nexus-editorial-grid ${page==="industries"?"is-industries":""} ${page==="security"?"is-security":""}`}>
     {content.cards.map(([title,description,...details],i)=>{const Icon=icons[i%icons.length];return <Glass key={title} className="nexus-editorial-card"><section id={page==="resources"&&i===2?"acceptance":undefined}>
      <div className="nexus-card-head"><Icon size={22}/><span className="nexus-meta" dir="ltr">{String(i+1).padStart(2,"0")}</span></div>
      <h2>{title.replace(/^\d+\s*[·—]\s*/,"")}</h2><p>{description}</p>
      {details.length>0&&<ul>{details.map(detail=><li key={detail}><span/><p>{detail}</p></li>)}</ul>}
     </section></Glass>})}
    </div><aside className="nexus-scope-note"><ShieldCheck size={18}/><p>{content.notice}</p></aside>
   </section>}
   {solutions&&<div className="nexus-wrap"><aside className="nexus-scope-note"><ShieldCheck size={18}/><p>{content.notice}</p></aside></div>}
   {!legal&&!founder&&<section className="nexus-wrap nexus-public-cta" data-reveal>
    <p className="cyber-eyebrow"><span/>{ar?"ابدأ بنطاق يمكن اختباره":"A REVIEWABLE FIRST STEP"}</p>
    <h2 className="nexus-gradient">{ar?"صف المشكلة كما تحدث فعلًا.":"Start with the work as it happens."}</h2>
    <p>{ar?"تحدث عن طلب متكرر ومصدر بياناته ومن يملك قراره. يساعدك المساعد على كتابة المسار قبل أي تكامل.":"Describe one recurring request, its source of truth and decision owner. Explore its workflow before any integration."}</p>
    <div className="cyber-actions"><Link className="cyber-button cyber-button-primary" href={`/${locale}/agentnexos`}>{ar?"استكشف مسار العمل":"Explore a workflow"}<ArrowUpRight size={16}/></Link>
    <Link className="cyber-button cyber-button-secondary" href={`/${locale}/founder`}>{ar?"تواصل مع المهندس":"Contact the engineer"}</Link></div>
   </section>}
  </main><CyberFooter locale={locale}/>
 </CyberEffects>;
}
