"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Calculator,Info,Minus,Plus,ShieldCheck,TrendingUp} from "lucide-react";
import type {Locale} from "@/lib/i18n/config";
export type ValueInput={cases:number,eligible:number,manual:number,assisted:number,review:number,cost:number,operation:number};
export const demonstration:ValueInput={cases:600,eligible:60,manual:18,assisted:9,review:3,cost:8,operation:150};
export function evaluateValue(v:ValueInput) {
 const each=Object.values(v);if(each.some(x=>!Number.isFinite(x)||x<0)||v.eligible>100||v.cases>10000000||v.manual>100000||v.assisted>100000||v.review>100000)return null;
 const eligibleCases=v.cases*v.eligible/100;
 const minutesPerCase=v.manual-v.assisted-v.review;
 const hours=(eligibleCases*minutesPerCase)/60;
 const gross=hours*v.cost;
 const net=gross-v.operation;
 const baselineHours=v.cases*v.manual/60;
 return {eligibleCases,minutesPerCase,hours,gross,net,baselineHours,netPerYear:net*12};
}
function money(v:number,currency:string,locale:Locale) {return new Intl.NumberFormat(locale==="ar"?"ar-EG":"en-US",{maximumFractionDigits:0,style:"currency",currency}).format(v)}
export function ValueLab({locale}:{locale:Locale}){
 const ar=locale==="ar";const [state,setState]=useState(demonstration);const [currency,setCurrency]=useState("USD");const [modified,setModified]=useState(false);
 const calculation=useMemo(()=>evaluateValue(state),[state]);
 const fields:{key:keyof ValueInput;ar:string;en:string;step:number;max:number}[]=[
 {key:"cases",ar:"عدد الحالات شهريًا",en:"Cases per month",step:50,max:1000000},
 {key:"eligible",ar:"نسبة الحالات المؤهلة للتجربة %",en:"Pilot-eligible share %",step:5,max:100},
 {key:"manual",ar:"دقائق المعالجة الحالية للحالة",en:"Current minutes per case",step:1,max:300},
 {key:"assisted",ar:"دقائق المعالجة المقترحة بعد المساعدة",en:"Assisted minutes per case (assumed)",step:1,max:300},
 {key:"review",ar:"دقائق المراجعة البشرية للحالة",en:"Human review minutes per case",step:1,max:300},
 {key:"cost",ar:"التكلفة المحمّلة لساعة العمل",en:"Fully loaded hourly cost",step:1,max:10000},
 {key:"operation",ar:"تكلفة التشغيل والمراجعة الإضافية شهريًا",en:"Monthly operating and additional costs",step:25,max:1000000}
 ];
 const change=(key:keyof ValueInput,v:number)=>{setModified(true);setState(x=>({...x,[key]:Number.isFinite(v)?v:0}))};
 return <section id="value-lab" className="atelier-value-lab" aria-labelledby="value-lab-title">
  <div className="atelier-section-intro"><p className="atelier-label"><Calculator size={15}/>{ar?"مختبر الجدوى / تجربة تفاعلية":"VALUE LAB / INTERACTIVE MODEL"}</p><h2 id="value-lab-title">{ar?"قبل ما تقول «هنوفّر»، احسب الشغل اللي بيتعمل فعلًا.":"Before promising savings, account for the work."}</h2>
  <p>{ar?"أدخل حجم العمل وزمنه وتكلفة التشغيل والمراجعة البشرية. سترى سيناريو جدوى أوليًا، لا وعدًا بالتوفير.":"Enter case volume, handling time, human review and running costs. Explore a modeled business case, not a savings promise."}</p></div>
  <div className="atelier-lab-grid"><div className="atelier-lab-inputs">
   <div className="atelier-lab-title"><strong>{ar?"افتراضات قابلة للتغيير":"Editable assumptions"}</strong><button type="button" onClick={()=>{setState(demonstration);setCurrency("USD");setModified(false)}}>{ar?"إعادة المثال":"Reset example"}</button></div>
   <p className="atelier-lab-disclosure"><Info size={16}/>{ar?"القيم الابتدائية افتراضية للتوضيح. غيّرها ببيانات مؤسستك؛ لا نستخدمها كتوقع أو تعهد.":"Starting values are fictional, not a forecast. Replace them with your own baseline."}</p>
   <div className="atelier-input-grid">{fields.map(f=><label key={f.key}><span>{ar?f.ar:f.en}</span><input type="number" inputMode="decimal" min="0" max={f.max} step={f.step} value={state[f.key]} onChange={e=>change(f.key,e.target.valueAsNumber)} /></label>)}</div>
   <div className="atelier-currency"><label htmlFor="atelier-currency">{ar?"عملة التكلفة":"Cost currency"}</label><select id="atelier-currency" value={currency} onChange={e=>setCurrency(e.target.value)}><option value="USD">USD</option><option value="EGP">EGP</option><option value="SAR">SAR</option><option value="AED">AED</option></select></div>
   <p className="atelier-lab-disclosure"><ShieldCheck size={16}/>{ar?"لا يتم إرسال الأرقام لأي خادم. الحساب يعمل في المتصفح، ولا يتضمن تكاليف أخطاء الجودة أو مخاطر البيانات ما لم تُقدّرها مؤسستك منفصلًا.":"No numbers are submitted to a server. This runs in your browser. Quality defects, compliance risk and other omitted costs need a separate assessment."}</p>
  </div><div className="atelier-lab-outputs" aria-live="polite">
   <div className="atelier-metric-primary"><span>{ar?"صافي قيمة الوقت الشهرية المحتملة":"Illustrative monthly net time value"}</span><strong dir="ltr">{calculation?money(calculation.net,currency,locale):"—"}</strong><p>{ar?"بعد خصم تكلفة التشغيل المحددة، واحتساب مراجعة بشرية ضمن زمن الحالة.":"After the entered operating cost and per-case human review time."}</p></div>
   <div className="atelier-metric-pair"><div><span>{ar?"ساعات العمل المتغيرة شهريًا":"Monthly hours affected"}</span><strong dir="ltr">{calculation?calculation.hours.toLocaleString("en-US",{maximumFractionDigits:1}):"—"}</strong></div><div><span>{ar?"الحالات الداخلة في نطاق التجربة":"In-scope cases"}</span><strong dir="ltr">{calculation?calculation.eligibleCases.toLocaleString("en-US",{maximumFractionDigits:0}):"—"}</strong></div></div>
   <div className="atelier-roi-waterfall" role="img" aria-label={ar?"مقارنة مكونات الحساب":"Breakdown of the model"}>
    <div><span>{ar?"قيمة الوقت":"Time value"}</span><b>{calculation?money(calculation.gross,currency,locale):"—"}</b></div><div className="atelier-waterfall-bar"><span style={{width:calculation&&calculation.gross>0?"100%":"0%"}}/></div>
    <div><span>{ar?"تكلفة التشغيل":"Operating cost"}</span><b>{money(state.operation,currency,locale)}</b></div><div className="atelier-waterfall-bar is-cost"><span style={{width:calculation&&calculation.gross>0?Math.min(100,state.operation/calculation.gross*100)+"%":"100%"}}/></div>
    <div><span>{ar?"صافي حسابي، ليس عائدًا مضمونًا":"Modeled net, not guaranteed ROI"}</span><b>{calculation?money(calculation.net,currency,locale):"—"}</b></div>
   </div>
   <p className="atelier-model-verdict">{calculation?(calculation.net>0?(ar?"الأرقام المفترضة تعطي فائضًا قبل تكلفة التنفيذ الأولية. تحتاج تجربة فعلية لإثبات الزمن والجودة.":"The assumptions produce a surplus before implementation cost. A real pilot must verify time and quality."):(ar?"وفق الأرقام المفترضة، لا توجد جدوى مالية شهرية مثبتة. عدّل النطاق أو اختبر أثر جودة العمل قبل الاستثمار.":"Under these assumptions, there is no positive modeled monthly net. Revisit scope and test quality impact before investing.")):(ar?"راجع القيم المدخلة؛ لا يمكن استخدام أرقام سالبة أو نسبة أكبر من 100%.":"Check the inputs: values must be nonnegative and the share no more than 100%.")}</p>
   <Link href={`/${locale}/start`} className="atelier-underline-action">{ar?"وثّق افتراضات التجربة في موجز مشروع":"Document pilot assumptions in a project brief"}<ArrowUpRight size={18}/></Link>
  </div></div>
 </section>;
}
