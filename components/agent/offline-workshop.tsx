"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Download,FileCheck2,ShieldCheck} from "lucide-react";
import type {Locale} from "@/lib/i18n/config";
type Fields={source:string,owner:string,output:string,exception:string,acceptance:string};
const empty:Fields={source:"",owner:"",output:"",exception:"",acceptance:""};
export function OfflineWorkshop({locale,seed}:{locale:Locale,seed:string}) {
 const ar=locale==="ar";const [data,setData]=useState(empty);const [request,setRequest]=useState("");const task=request || seed;const [result,setResult]=useState(false);
 const labels:Record<keyof Fields,[string,string]>={
 source:["ما السجل أو المستند المعتمد؟","Which record is authoritative?"],
 owner:["من يملك مراجعة النتيجة؟","Who reviews the result?"],
 output:["ما الوثيقة أو المخرج المطلوب؟","What reviewable output is needed?"],
 exception:["ماذا يحدث عندما ينقص المصدر أو يتعارض؟","What happens when evidence is missing or conflicting?"],
 acceptance:["كيف يتأكد الفريق أن الناتج صحيح؟","How does the team accept the output?"]
 };
 const ready=task.trim().length>12&&Object.values(data).every(x=>x.trim().length>=8);
 function markdown(){
 return [ar?"# مسودة تصميم سير عمل | Agentnexos":"# Workflow design draft | Agentnexos",ar?"تصميم يدوي داخل المتصفح، بلا نموذج AI أو اتصال ببيانات المؤسسة.":"Manual browser-only design. No AI model or enterprise-data connection.","",ar?"## وصف المهمة":"## Request",task.trim(),...Object.entries(data).flatMap(([key,value])=>["",`## ${labels[key as keyof Fields][ar?0:1]}`,value]),"",ar?"## اختبار قبل التنفيذ":"## Tests before execution",ar?"- اكتمال المدخلات ومصدرها\n- رفض الوصول غير المصرح به\n- توقف آمن عند فقدان البيانات\n- مراجعة المخرج من صاحب الصلاحية":"- Input/source completeness\n- Deny unauthorized access\n- Stop safely on missing evidence\n- Review by the authorized owner"].join("\n");
 }
 function download(){const url=URL.createObjectURL(new Blob([markdown()],{type:"text/markdown;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=`agentnexos-local-workflow-${locale}.md`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
 return <section className="atelier-offline" aria-label={ar?"ورشة تصميم محلية":"Local planning workshop"}>
  <div className="atelier-offline-head"><FileCheck2 size={25}/><div><strong>{ar?"ورشة تصميم محلية متاحة":"Local design workshop available"}</strong><p>{ar?"بيئة المعاينة لا تملك اتصالًا بالموديل. تقدر تجهز موجزًا قابلًا للمراجعة هنا دون إرسال بياناتك لأي جهة. هذه أداة منظمة ولا تولد ردود ذكاء اصطناعي.":"AI model access is not configured in this Preview. You can still prepare a structured local brief. This is a form-based design aid, not an AI-generated response."}</p></div></div>
  <label className="atelier-offline-task"><span>{ar?"وصف المهمة":"Workflow description"}</span><textarea rows={3} value={task} onChange={e=>{setRequest(e.target.value);setResult(false)}} placeholder={ar?"صف مهمة متكررة":"Describe a recurring task"}/></label><div className="atelier-offline-fields">{(Object.keys(labels) as (keyof Fields)[]).map(key=><label key={key}><span>{labels[key][ar?0:1]}</span><input value={data[key]} onChange={e=>{setData(v=>({...v,[key]:e.target.value}));setResult(false)}} minLength={8} placeholder={ar?"اكتب معلومة محددة من العملية":"Enter a concrete process detail"}/></label>)}</div>
  <button className="atelier-offline-create" type="button" disabled={!ready} onClick={()=>setResult(true)}>{ar?"جهّز مسودة المراجعة":"Prepare review draft"}<ArrowUpRight size={17}/></button>
  {!ready&&<p className="atelier-offline-hint">{ar?"اكتب وصف المهمة بالأعلى، وأكمل مصادرها ومسؤولها ومخرجها وتعاملها مع الاستثناء ومعيار قبولها.":"Describe the task above, then complete its source, owner, output, exception handling and acceptance test."}</p>}
  {result&&<div className="atelier-offline-result" role="status"><ShieldCheck size={18}/><div><strong>{ar?"الموجز جاهز للتنزيل والمراجعة":"Draft prepared for review"}</strong><p>{ar?"لم نتحقق من صحة السياسة أو المصدر، ولم تُنفّذ أي خطوة. راجع التفاصيل قبل مشاركتها.":"Policies and sources have not been independently verified. No action was executed. Review before sharing."}</p><button onClick={download} type="button"><Download size={16}/>{ar?"نزّل Markdown":"Download Markdown"}</button></div></div>}
  <Link href={`/${locale}/start`} className="atelier-offline-more">{ar?"أحتاج موجز نطاق أوسع":"Prepare a full project brief"}<ArrowUpRight size={15}/></Link>
 </section>;
}
