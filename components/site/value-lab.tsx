"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Copy,Info,ShieldCheck} from "lucide-react";
import type {Locale} from "@/lib/i18n/config";
import {demonstration,evaluateValue,withScenario,type ValueInput,type Scenario} from "@/lib/value-economics";
export {demonstration,evaluateValue} from "@/lib/value-economics";
export type {ValueInput} from "@/lib/value-economics";
type Field={key:keyof ValueInput;ar:string;en:string;step:number;max:number;unit?:string};
const groups:{ar:string;en:string;fields:Field[]}[]=[
 {ar:"01 / حجم العملية الحالية",en:"01 / Current workload",fields:[
 {key:"cases",ar:"المعاملات شهريًا",en:"Cases per month",step:50,max:10000000},
 {key:"manual",ar:"دقائق المعالجة اليدوية",en:"Manual minutes per case",step:1,max:100000},
 {key:"cost",ar:"تكلفة ساعة العمل المحمّلة",en:"Loaded hourly cost",step:1,max:1000000}]},
 {ar:"02 / كفاءة المساعد والمراجعة",en:"02 / Agent and review performance",fields:[
 {key:"eligible",ar:"الحالات المؤهلة %",en:"Cases eligible %",step:1,max:100},
 {key:"success",ar:"نجاح الحالات المؤهلة %",en:"Successful cases %",step:1,max:100},
 {key:"reviewShare",ar:"حالات تتطلب مراجعة %",en:"Cases requiring review %",step:1,max:100},
 {key:"reviewMinutes",ar:"دقائق المراجعة البشرية",en:"Human review minutes",step:1,max:100000},
 {key:"failureShare",ar:"نسبة حالات التصحيح %",en:"Recovery cases %",step:1,max:100},
 {key:"recoveryMinutes",ar:"دقائق تصحيح الحالة",en:"Recovery minutes",step:1,max:100000}]},
 {ar:"03 / التشغيل والاستثمار",en:"03 / Operating and project cost",fields:[
 {key:"perCaseAi",ar:"تكلفة AI لكل حالة مؤهلة",en:"AI cost per eligible case",step:.05,max:1000000},
 {key:"operation",ar:"تكاليف التشغيل الشهرية الثابتة",en:"Monthly fixed operations",step:100,max:1000000000},
 {key:"setup",ar:"تكلفة التأسيس لمرة واحدة",en:"One-off implementation cost",step:500,max:10000000000},
 {key:"realizable",ar:"نسبة قيمة الوقت القابلة للتحقق نقديًا %",en:"Labor value financially realizable %",step:5,max:100}
 ]}
];
const sampleLabels:Record<Scenario,[string,string]>={conservative:["محافظ","Conservative"],base:["أساسي","Base"],optimistic:["متفائل","Optimistic"]};
const currencyLabels=["USD","EGP","SAR","AED"];
function monetary(n:number,currency:string,locale:Locale){return new Intl.NumberFormat(locale==="ar"?"ar-EG":"en-US",{style:"currency",currency,maximumFractionDigits:0}).format(n)}
function decimal(n:number){return new Intl.NumberFormat("en-US",{maximumFractionDigits:1}).format(n)}
export function ValueLab({locale}:{locale:Locale}){
 const ar=locale==="ar";
 const [state,setState]=useState<ValueInput>(demonstration),[scenario,setScenario]=useState<Scenario>("base"),[currency,setCurrency]=useState("USD"),[copied,setCopied]=useState(false);
 const result=useMemo(()=>evaluateValue(state),[state]);
 const selectScenario=(next:Scenario)=>{setScenario(next);setState(x=>withScenario(x,next));setCopied(false)};
 const change=(key:keyof ValueInput,value:number)=>{setState(x=>({...x,[key]:Number.isFinite(value)?value:0}));setCopied(false)};
 const reset=()=>{setState(demonstration);setScenario("base");setCurrency("USD");setCopied(false)};
 const copy=()=>{const content=[ar?"مختبر جدوى Agentnexos":"Agentnexos economics lab",ar?"سيناريو افتراضي غير موثق":"Unverified illustration",...groups.flatMap(g=>g.fields.map(f=>`${ar?f.ar:f.en}: ${state[f.key]}`)),...(result?[`Baseline: ${result.manualBaseline} ${currency}`,`After: ${result.afterCost} ${currency}`,`Monthly net: ${result.net} ${currency}`,`Year-one net: ${result.netPerYear} ${currency}`]:[])].join("\n");void navigator.clipboard.writeText(content).then(()=>setCopied(true)).catch(()=>setCopied(false))};
 return <section id="value-lab" className="atelier-value-lab economics-lab" aria-labelledby="value-lab-title">
  <div className="atelier-section-intro"><h2 id="value-lab-title">{ar?"تكلفة العملية قبل الوكيل وبعده.":"The cost of work, before and after."}</h2>
  <p>{ar?"احسب معاملات مؤسستك ومراجعتها وإعادة العمل والتكلفة التقنية. الافتراضات مثال قابل للتعديل، بما في ذلك سيناريو بخسارة مالية.":"Model your own workload, human review, rework and technical costs. Defaults are fictional, including scenarios where the numbers do not work."}</p></div>
  <div className="economics-layout">
   <div className="economics-inputs">
    <div className="economics-bar"><h3>{ar?"افتراضات السيناريو":"Scenario assumptions"}</h3><button type="button" onClick={reset}>{ar?"إعادة المثال":"Reset illustration"}</button></div>
    <div role="group" aria-label={ar?"اختيار السيناريو":"Choose scenario"} className="economics-modes">{(["conservative","base","optimistic"] as Scenario[]).map(s=><button key={s} aria-pressed={scenario===s} onClick={()=>selectScenario(s)} type="button">{sampleLabels[s][ar?0:1]}</button>)}</div>
    <p className="economics-assumption"><Info size={16}/>{ar?"تغيّر السيناريوهات ثلاث فرضيات فقط: النجاح، والمراجعة، والتصحيح. باقي المدخلات كما هي. الأرقام ليست نتائج عملاء.":"Presets only change success, review and recovery assumptions. Other inputs remain yours. No client results are claimed."}</p>
    {groups.map(group=><fieldset className="economics-fieldset" key={group.en}><legend>{ar?group.ar:group.en}</legend><div className="economics-fields">{group.fields.map(f=><label key={f.key}><span>{ar?f.ar:f.en}</span><input type="number" inputMode="decimal" min="0" max={f.max} step={f.step} value={state[f.key]} onChange={e=>change(f.key,e.target.valueAsNumber)}/></label>)}</div></fieldset>)}
    <div className="economics-last-row"><label htmlFor="economics-currency">{ar?"عملة الإدخال والحساب":"Accounting currency"}<select id="economics-currency" value={currency} onChange={e=>setCurrency(e.target.value)}>{currencyLabels.map(x=><option key={x}>{x}</option>)}</select></label><span>{ar?"لا يوجد تحويل عملات. أدخل التكاليف بنفس العملة.":"No currency conversion. Enter all costs in the same currency."}</span></div>
    <p className="economics-privacy"><ShieldCheck size={17}/>{ar?"الحساب محلي داخل المتصفح؛ لا تُرسل المدخلات للخادم. النتائج ليست توصية استثمارية أو توقعًا للعائد.":"Calculations stay in your browser; inputs are not submitted. Outputs are not an investment forecast."}</p>
   </div>
   <div className="economics-results" aria-live="polite">
    <div className="economics-results-heading"><span>{ar?"نتيجة الحسابات":"Modeled result"}</span><span>{ar?"شهريًا، باستثناء التأسيس":"Monthly, excluding setup"}</span></div>
    {result?<><div className="economics-main-value"><span>{ar?"فرق التشغيل الشهري":"Monthly operating difference"}</span><strong dir="ltr" className={result.net<0?"negative":""}>{monetary(result.net,currency,locale)}</strong><p>{result.net>0?(ar?"وفرة تشغيلية مفترضة، وليست مبلغًا نقديًا مضمونًا.":"Illustrative operating improvement, not guaranteed cash savings."):(ar?"التكلفة الحالية أقل من النموذج المقترح وفق هذه المدخلات.":"Under these inputs, the proposed model costs more than current operations.")}</p></div>
    <div className="economics-comparison" role="figure" aria-label={ar?"مقارنة التكاليف":"Modeled cost comparison"}>
     <div className="economics-two-values"><div><span>{ar?"التكلفة اليدوية الحالية":"Current manual cost"}</span><strong dir="ltr">{monetary(result.manualBaseline,currency,locale)}</strong></div><div><span>{ar?"التكلفة الشهرية بعد النظام":"Modeled monthly cost"}</span><strong dir="ltr">{monetary(result.afterCost,currency,locale)}</strong></div></div>
     <div className="economics-bars"><div className="baseline" style={{width:result.manualBaseline>0?"100%":"0%"}}/><div className="assisted" style={{width:result.manualBaseline>0?Math.min(100,result.afterCost/result.manualBaseline*100)+"%":result.afterCost>0?"100%":"0%"}}/></div>
    </div>
    <div className="economics-key-figures"><div><span>{ar?"صافي السنة الأولى بعد التأسيس":"Year-one net after setup"}</span><strong dir="ltr" className={result.netPerYear<0?"negative":""}>{monetary(result.netPerYear,currency,locale)}</strong></div><div><span>{ar?"استرداد تكلفة التأسيس نظريًا":"Modeled payback"}</span><strong dir="ltr">{result.paybackMonths===null?(ar?"لا يتحقق":"None"):`${decimal(result.paybackMonths)} ${ar?"شهر":"months"}`}</strong></div><div><span>{ar?"حالات مكتملة دون إعادة تنفيذ يدوي":"Completed without manual rework"}</span><strong dir="ltr">{decimal(result.completedCases)} / {decimal(state.cases)}</strong></div><div><span>{ar?"الحالات المؤهلة للمساعد":"Eligible cases"}</span><strong dir="ltr">{decimal(result.eligibleCases)}</strong></div></div>
    <div className="economics-breakdown"><h3>{ar?"ممّ تتكوّن التكلفة بعد التطبيق؟":"Where modeled costs go"}</h3>{[
      {name:ar?"العمل اليدوي المتبقي والقيمة غير القابلة للتحقق":"Remaining labor and unrealized value",value:result.retainedLabor},
      {name:ar?"المراجعات البشرية":"Human review",value:result.reviewCost},
      {name:ar?"تصحيح الإخفاقات":"Failure recovery",value:result.recoveryCost},
      {name:ar?"استدعاءات النموذج":"Model usage",value:result.aiCost},
      {name:ar?"البنية التحتية والتشغيل":"Infrastructure and operations",value:result.operationCost}
     ].map((item,i)=><div className="economics-cost-row" key={i}><span>{item.name}</span><div className="economics-cost-track"><i style={{width:result.afterCost>0?Math.min(100,item.value/result.afterCost*100)+"%":"0%"}}/></div><b dir="ltr">{monetary(item.value,currency,locale)}</b></div>)}</div>
    <p className="economics-disclaimer">{ar?"تراجع الحاسبة تكاليف زمن العمل والتشغيل والتأسيس فقط. تحتاج المراقبة، والتراخيص، ومخاطر الأخطاء، وجودة القرار، والانتقال التشغيلي إلى تقدير منفصل. خفض وقت الموظف لا يساوي وفرًا نقديًا إلا إذا كان قابلًا للتحقق.":"This model simplifies the cost of labor, review, recovery, technology and setup. Governance, licenses, quality failures and change management require separate estimates. Released staff time does not automatically become cash savings."}</p>
    </>:<p role="alert" className="economics-invalid">{ar?"راجع القيم: يمنع إدخال تكلفة سالبة أو نسبة أكبر من 100% أو أعداد غير صالحة.":"Check inputs: negative values, percentages over 100% and invalid numbers are not supported."}</p>}
    <div className="economics-actions"><button disabled={!result} onClick={copy} type="button"><Copy size={16}/>{copied?(ar?"نُسخت الافتراضات":"Scenario copied"):(ar?"نسخ الافتراضات والنتائج":"Copy assumptions & results")}</button><Link href={`/${locale}/start`}>{ar?"أعد موجز مشروع تجريبي":"Prepare a pilot brief"}<ArrowUpRight size={17}/></Link></div>
   </div>
  </div>
 </section>;
}
