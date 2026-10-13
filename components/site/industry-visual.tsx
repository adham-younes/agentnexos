"use client";
import Image from "next/image";
import {CircleDot,ArrowRight} from "lucide-react";
import type {Locale} from "@/lib/i18n/config";
const media:Record<string,string>={energy:"/editorial/energy-operations.jpg",construction:"/editorial/construction-review.jpg",distribution:"/editorial/distribution-ops.jpg"};
const labels:Record<string,{ar:[string,string,string];en:[string,string,string]}> = {
 energy:{ar:["مراقبة الأصل","فحص القراءة","قرار الصيانة"],en:["Asset signal","Validate reading","Maintenance decision"]},
 construction:{ar:["بنود العقد","استفسارات الموقع","اعتماد المسؤول"],en:["Contract terms","Site RFIs","Owner approval"]},
 distribution:{ar:["أمر البيع","إثبات التسليم","معالجة الاستثناء"],en:["Sales order","Delivery proof","Exception review"]},
 finance:{ar:["فاتورة المورد","مطابقة ثلاثية","محاسب معتمد"],en:["Supplier invoice","Three-way match","Accountant review"]},
 "health-admin":{ar:["بيانات الإحالة","اكتمال المستند","موظف التنسيق"],en:["Referral input","Document readiness","Scheduling reviewer"]},
 banking:{ar:["سجل المستندات","فحص الصلاحية","مراجع الامتثال"],en:["Document register","Authority check","Compliance analyst"]},
 "customer-ops":{ar:["سياق التذكرة","مصادر المعرفة","المسؤول التالي"],en:["Ticket history","Knowledge source","Next case owner"]},
 agriculture:{ar:["سجل الحقل","صلاحية القراءة","خبير الموقع"],en:["Field record","Reading freshness","Field specialist"]}
};
export function IndustryVisual({locale,slug}:{locale:Locale,slug:string}){
 const ar=locale==="ar";const words=(labels[slug]||labels.finance)[locale];
 const img=media[slug];
 return <figure className={"industry-visual "+(img?"has-photo":"has-graph")} aria-label={ar?"مسار مصور لتوضيح معالجة الحالة الافتراضية":"Illustration of a fictional case-processing workflow"}>
  {img?<Image src={img} alt={ar?`مشهد تشغيلي تصويري لقطاع ${slug}، لا يمثل مشروعًا منفذًا من Agentnexos`:`Conceptual editorial scene of ${slug} work, not a deployed Agentnexos client project`} fill sizes="(max-width: 800px) 100vw, 810px" quality={83} className="industry-photo"/>:
  <svg className="industry-graph" aria-hidden="true" viewBox="0 0 900 290" fill="none"><defs><pattern id={"g-"+slug} width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" stroke="#224c34" strokeWidth=".75"/></pattern><radialGradient id={"rg-"+slug}><stop stopColor="#2b9960" stopOpacity=".38"/><stop offset="1" stopColor="#0a1710" stopOpacity="0"/></radialGradient></defs><rect width="900" height="290" fill="#0a1710"/><rect width="900" height="290" fill={"url(#g-"+slug+")"}/><circle cx="450" cy="138" r="228" fill={"url(#rg-"+slug+")"}/><g stroke="#4b9167" strokeWidth="1.5"><path d="M120 146H775" strokeDasharray="6 12"/><path d="M370 146L385 132M370 146L385 160 M630 146L645 132M630 146L645 160"/></g><g fill="#0c2517" stroke="#28c17a"><rect x="76" y="84" width="198" height="124" rx="17"/><rect x="352" y="63" width="198" height="166" rx="17"/><rect x="628" y="84" width="198" height="124" rx="17"/></g><g stroke="#7ae5a8" strokeWidth="2" strokeLinecap="round"><rect x="161" y="111" width="28" height="30" rx="3"/><path d="M165 149H185M165 157H180"/><path d="M439 107L452 122L464 104M438 132H465"/><circle cx="727" cy="125" r="13"/><path d="M727 115V126L734 131"/></g><circle cx="451" cy="147" r="90" stroke="#3c9760" strokeOpacity=".38"/></svg>}
 <div className="industry-visual-shade"/>
 <div className="industry-visual-legend"><div className="industry-visual-eyebrow"><CircleDot size={13}/>{ar?"تصور هندسي للعملية":"OPERATIONAL DESIGN STUDY"}</div><div className="industry-visual-route">{words.map((name,i)=><span key={name}><small dir="ltr">0{i+1}</small><strong>{name}</strong>{i!==2&&<ArrowRight size={14}/>}</span>)}</div></div>
 </figure>;
}
