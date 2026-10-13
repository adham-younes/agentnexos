"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowUpRight,ArrowRight,Database,FileCheck2,GitBranch,LockKeyhole,ShieldCheck,Workflow,BrainCircuit,AlertTriangle,ExternalLink} from "lucide-react";
import type {Locale} from "@/lib/i18n/config";
type Topic={number:string,ar:string,en:string,bodyAr:string,bodyEn:string,proofAr:string,proofEn:string};
const anatomy:Topic[]=[
 {number:"01",ar:"المحفّز",en:"Trigger",bodyAr:"كل مسار عمل يبدأ بحدث واضح: طلب، تعارض، تذكرة، أو موعد استحقاق. لو لم نعرف من أين يبدأ الطلب فلن نعرف متى انتهى.",bodyEn:"Every workflow begins with a defined event: a request, discrepancy, ticket or due date. If the trigger is vague, completion cannot be tested.",proofAr:"دليل الاختبار: طلب محدد وله معرّف ومصدر وتاريخ.",proofEn:"Acceptance evidence: a uniquely identified, sourced request."},
 {number:"02",ar:"السياق والصلاحيات",en:"Context & access",bodyAr:"النموذج لا يحتاج كل معلومات الشركة. يحتاج أقل مجموعة موثوقة ليفهم الحالة، مع صلاحيات قراءة مشتقة من هوية الموظف وإصدار المصدر.",bodyEn:"The model needs the smallest reliable context set, not an entire company archive. Access must reflect the staff member's verified identity and source version.",proofAr:"دليل الاختبار: سؤال يُجاب بمصدر، وحالة وصول ممنوعة تُرفض.",proofEn:"Acceptance evidence: a sourced answer and denied unauthorized access."},
 {number:"03",ar:"التنسيق والأدوات",en:"Orchestration & tools",bodyAr:"يقرر المنسق أي خطوة تتم الآن، وما البيانات التي تعتمد عليها، ومتى تتوقف. كل أداة عقد محدد المدخلات والحدود ومهلة التنفيذ وطريقة تسجيل النتيجة.",bodyEn:"The orchestrator sequences work, dependencies and stop conditions. Each tool needs validated inputs, authorization, timeout rules and a meaningful execution receipt.",proofAr:"دليل الاختبار: خطوة لا تتكرر بلا قصد بعد انقطاع الاتصال.",proofEn:"Acceptance evidence: an interrupted step does not accidentally repeat a side effect."},
 {number:"04",ar:"القرار البشري",en:"Human decision",bodyAr:"لا تتحول التوصية إلى إرسال أو خصم أو أمر شراء أو إلغاء إلا عند موافقة صريحة على الفعل ومعلماته. الموافقة نفسها تحتاج صلاحية وتاريخ انتهاء.",bodyEn:"A recommendation becomes an email, refund, purchase order or deletion only after explicit approval for the exact action and its parameters.",proofAr:"دليل الاختبار: لا يستطيع الوكيل تجاوز المراجع أو تغيير نوع الإجراء.",proofEn:"Acceptance evidence: a reviewer cannot be bypassed or the approved action changed."},
 {number:"05",ar:"الدليل والقياس",en:"Evidence & evaluation",bodyAr:"نقيس اكتمال المهمة وجودة المصدر والزمن والأخطاء. السجل يربط الطلب بالقرار والنتيجة، ونختبر الحالات الناقصة والمصادر المتعارضة قبل تشغيل النظام.",bodyEn:"Measure completion, source accuracy, review time and errors. A trace connects the request to the decision and outcome; evaluation includes missing and conflicting evidence.",proofAr:"دليل الاختبار: مجموعة حالات قبول قبل النشر وحدود توقف قابلة للمراجعة.",proofEn:"Acceptance evidence: pre-launch scenarios, stopping rules and accountable results."}
];
export function LearningStudio({locale,mini=false}:{locale:Locale,mini?:boolean}){
 const ar=locale==="ar";const [active,setActive]=useState(0);const current=anatomy[active];
 return <section id={mini?"understand":"learning-studio"} className={`atelier-education ${mini?"is-mini":""}`} aria-labelledby="education-title">
  <div className="atelier-section-intro"><p className="atelier-label"><BrainCircuit size={17}/>{ar?"معرفة هندسية يمكن اختبارها":"ENGINEERING EXPLAINED"}</p><h2 id="education-title">{ar?"كيف ينتقل الوكيل من إجابة إلى مسؤولية عمل؟":"How an agent moves from an answer to accountable work."}</h2><p>{ar?"الوكيل المؤسسي نظام يقرأ سياقًا مصرحًا به، وينسق خطوات، ويستخدم أدوات، ويمرر القرارات المناسبة للإنسان، ويترك نتيجة قابلة للفحص. جودة نموذج اللغة جزء واحد فقط من هذه السلسلة.":"An enterprise agent uses authorized context, coordinates steps, calls bounded tools, escalates decisions and records inspectable results. Model quality is one component, not the entire system."}</p></div>
  <div className="atelier-anatomy-layout">
   <div className="atelier-anatomy-diagram" role="tablist" aria-label={ar?"اختر مرحلة من النظام":"Select a system stage"}>
    {anatomy.map((stage,i)=><button id={"anatomy-tab-"+i} key={stage.number} role="tab" type="button" aria-selected={active===i} aria-controls="anatomy-panel" tabIndex={active===i?0:-1} onClick={()=>setActive(i)} className={active===i?"is-active":""}>
      <span className="atelier-node">{i===0?<Workflow/>:i===1?<Database/>:i===2?<GitBranch/>:i===3?<LockKeyhole/>:<FileCheck2/>}</span>
      <span><small dir="ltr">{stage.number} / 05</small><strong>{ar?stage.ar:stage.en}</strong></span>
      <ArrowRight className="atelier-stage-arrow" size={17}/>
    </button>)}
    <svg className="atelier-circuit-lines" viewBox="0 0 440 440" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><path d="M 32 50 C 210 20 300 95 382 138 S 340 320 72 390" stroke="#10b981" strokeWidth=".7" strokeDasharray="4 10"/><path className="atelier-circuit-signal" d="M 32 50 C 210 20 300 95 382 138 S 340 320 72 390" stroke="#17d998" strokeWidth="2" strokeDasharray="18 22" strokeLinecap="round"/></svg>
   </div>
   <article id="anatomy-panel" role="tabpanel" aria-labelledby={"anatomy-tab-"+active} className="atelier-anatomy-explanation" tabIndex={0}>
    <span className="atelier-anatomy-number" dir="ltr">{current.number}</span><p className="atelier-label">{ar?"طبقة من طبقات التشغيل":"OPERATING LAYER"}</p>
    <h3>{ar?current.ar:current.en}</h3><p>{ar?current.bodyAr:current.bodyEn}</p>
    <div className="atelier-proof"><ShieldCheck size={20}/><span>{ar?current.proofAr:current.proofEn}</span></div>
   </article>
  </div>
  {!mini&&<div className="atelier-learning-notes">
   <article><span className="atelier-label">{ar?"من أين تبدأ المشاريع؟":"START SMALL"}</span><h3>{ar?"لا تطلب «وكيلاً يدير كل شيء».":"Avoid the all-purpose agent brief."}</h3><p>{ar?"ابدأ بطلب متكرر، وعينات حقيقية بعد إخفاء البيانات الحساسة، ومعيار قبول متفق عليه. حدد ما يستطيع النظام قراءته وما يُمنع من فعله. بعد الاختبار يُبحث التكامل، لا قبله.":"Start with a repeatable request, safely anonymized examples and a defined acceptance test. Agree on what may be read and what remains prohibited before exploring integrations."}</p></article>
   <article><span className="atelier-label">{ar?"متى لا تناسبك الأتمتة؟":"WHEN NOT TO AUTOMATE"}</span><h3>{ar?"الفوضى الإجرائية تحتاج تنظيمًا أولًا.":"A broken process needs fixing first."}</h3><p>{ar?"إذا كانت قواعد القرار متضاربة، أو البيانات بلا مالك، أو لا يوجد من يعتمد النتيجة، فإن إضافة نموذج ذكي تسرع انتقال المشكلة. أول خدمة مفيدة هنا هي هندسة العملية نفسها.":"If policies conflict, data has no owner or decisions have no accountable reviewer, an AI agent can amplify the problem. Process design may be the first useful service."}</p></article>
  </div>}
  <div className="atelier-references"><p>{ar?"مرجعيات لتوسيع القراءة:":"Further reading:"}</p><a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-use-case-blueprints" target="_blank" rel="noopener noreferrer">Microsoft: value blueprints<ExternalLink size={13}/></a><a href="https://learn.microsoft.com/en-nz/agents/adoption-patterns/pattern-core-business-process" target="_blank" rel="noopener noreferrer">Microsoft: process architecture<ExternalLink size={13}/></a><a href="https://www.uipath.com/platform/agentic-automation/agentic-ai" target="_blank" rel="noopener noreferrer">UiPath: governed automation<ExternalLink size={13}/></a></div>
 </section>;
}
