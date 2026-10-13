import {ExternalLink} from "lucide-react";
import type {Locale} from "@/lib/i18n/config";
const peers=[
 {name:"Inception / Catalyst",region:"UAE",url:"https://www.inception42.ai/products/catalyst",ar:"بناء وكلاء وحوكمة مركزية، مع Titan لمراقبة صلاحيات التنفيذ.",en:"Agent building and central governance, with Titan runtime controls."},
 {name:"AIQ / ENERGYai",region:"UAE",url:"https://aiq.ae/products/AgenticAI/energyai",ar:"تطبيق قطاعي في الطاقة يرتبط ببيانات وآليات عمل تشغيلية محددة.",en:"Sector-specific energy workflows backed by operational data."},
 {name:"Presight",region:"UAE",url:"https://presight.ai/",ar:"ربط البيانات والذكاء المؤسسي والبنية التحتية.",en:"Enterprise intelligence across data and infrastructure."},
 {name:"OnDemand / AIREV",region:"UAE",url:"https://www.on-demand.io/",ar:"أدوات بناء الوكلاء، والتنسيق، والذاكرة ومسارات الأدوات.",en:"Developer-oriented agent flows, memory and tool orchestration."},
 {name:"MOZN",region:"Saudi Arabia",url:"https://mozn.ai/",ar:"سياقات المعرفة المؤسسية والامتثال ومخاطر القرارات.",en:"Enterprise knowledge, risk and compliance-oriented decisions."},
 {name:"Lucidya",region:"Saudi Arabia",url:"https://lucidya.com/",ar:"عمليات خدمة العملاء العربية، والانتقال للمراجع البشري.",en:"Arabic customer operations and human escalation."},
 {name:"Unifonic / Agentic Studio",region:"Saudi Arabia",url:"https://www.unifonic.com/en/agentic/studio-controls",ar:"تنسيق متخصص، وتكامل CRM، وموافقات ومراقبة.",en:"Specialist orchestration with CRM connectivity, approvals and monitoring."},
 {name:"DXwand / ORXTRA",region:"Egypt",url:"https://dxwand.com/",ar:"عرض حالات مصرية في الخدمة والقطاع المالي، بأرقام تنسب للشركة.",en:"Vendor-published Egyptian customer operations and financial-sector cases."},
 {name:"WideBot",region:"Egypt",url:"https://widebot.ai/",ar:"اللغة العربية والتعامل مع الصوت والمستندات والبحث.",en:"Arabic-language voice, document handling and retrieval."},
 {name:"HUMAIN OS",region:"Saudi Arabia",url:"https://www.humain.com/",ar:"شرح أدوات الذكاء المؤسسية عبر مهام الموظفين والمديرين.",en:"Work-oriented AI presented around staff and manager tasks."}
];
const controls=[
 {ar:"الهوية والصلاحية",en:"Identity & permissions",detailAr:"تستخدم كل أداة صلاحية محددة بالعملية والمستخدم والبيئة. لا تعتمد سياسة التنفيذ على رسالة من نموذج اللغة.",detailEn:"Each tool gets process-, user- and environment-scoped access. A model response cannot grant execution rights."},
 {ar:"مصدر المعلومات",en:"Source provenance",detailAr:"كل توصية تشير إلى مصدر معتمد وإصداره. عدم وجود سجل موثوق يؤدي إلى طلب استكمال، لا إلى اختراع معلومة.",detailEn:"Recommendations cite an authorized document and version. Missing trusted records stop the workflow."},
 {ar:"اعتماد بشري",en:"Human authorization",detailAr:"المراجع يوافق على إجراء محدد ومعلماته، ولمدة محددة؛ إعادة الإرسال لا تنشئ عملية ثانية.",detailEn:"Approval names the exact side effect and parameters, expires, and cannot be reused to duplicate work."},
 {ar:"تتبّع وتعافٍ",en:"Trace & recovery",detailAr:"يُربط رقم المهمة بخطوات الأدوات والاستثناء والقرار النهائي، مع مهلات وإعادة محاولة لا تكرر الأثر.",detailEn:"Case IDs connect tool calls, exceptions and decisions. Retries must not repeat effects."},
 {ar:"اختبارات حقيقية",en:"Evaluations",detailAr:"الاختبارات تشمل مستندًا ناقصًا، وصلاحية ممنوعة، وطلب تعديل حساسًا، وعملية تعطل الربط بها.",detailEn:"Tests cover missing evidence, unauthorized access, sensitive changes and integration failures."}
];
export function MarketNotebook({locale}:{locale:Locale}){
 const ar=locale==="ar";
 return <section className="market-notebook" aria-labelledby="market-title">
  <div className="market-heading"><h2 id="market-title">{ar?"ماذا تعلّمنا من السوق الإقليمي؟":"What the regional market actually shows."}</h2><p>{ar?"راجعنا عشر جهات مرجعية في مصر والسعودية والإمارات. العينة ليست ترتيبًا للحصة السوقية؛ وبعضها منصات عامة وبعضها حلول قطاعية.":"Ten reference companies across Egypt, Saudi Arabia and the United Arab Emirates. This is not a market-share ranking; it combines platforms and specialized solutions."}</p></div>
  <div className="market-observation"><span>{ar?"قراءة تحليلية":"EDITORIAL OBSERVATION"}</span><blockquote>{ar?"ربط النموذج بقاعدة بيانات لم يعد وحده تميّزًا. ما يهم العميل هو كيف تتوقف العملية عند غياب الصلاحية، وماذا يُعرض للمراجع، وهل يوجد دليل واضح على تكلفة النتيجة.":"Connecting a model to data is no longer a differentiator by itself. What matters is how a workflow stops without authority, what the reviewer receives, and whether its cost can be explained."}</blockquote></div>
  <div className="market-peer-grid">{peers.map((peer,i)=><article key={peer.name}><div className="market-peer-top"><span dir="ltr">{String(i+1).padStart(2,"0")}</span><span>{peer.region}</span></div><h3>{peer.name}</h3><p>{ar?peer.ar:peer.en}</p><a href={peer.url} target="_blank" rel="noopener noreferrer" aria-label={`${peer.name} official website`}>{ar?"مصدر الشركة":"Vendor source"}<ExternalLink size={14}/></a></article>)}</div>
  <p className="market-source-disclosure">{ar?"أوصاف القدرات مستمدة من صفحات الشركات وما أعلنته عن منتجاتها، وليست اختبارات مستقلة لها. مثال: أعلنت AIQ في مارس 2025 عقد ENERGYai بقيمة 340 مليون دولار مع ADNOC. العقد المنشور لا يثبت وحده تحقق كل عائد تشغيلي معلن.":"Capability descriptions come from vendor publications, not independent product tests. For example, AIQ announced a $340 million ENERGYai contract with ADNOC in March 2025; the contract itself does not verify every projected operating benefit."}</p>
  <div className="market-heading market-heading-small"><h2>{ar?"كيف نختبر هذه الأفكار بدل تكرار دعايتها؟":"How to test the ideas rather than repeat the marketing."}</h2><p>{ar?"لأنظمة الأعمال الحقيقية، نترجم الحديث عن الحوكمة إلى اختبارات وأدلة قبل أي صلاحية كتابة أو تكامل إنتاجي.":"Translate governance claims into practical tests before production integrations or any write permissions."}</p></div>
  <div className="market-controls">{controls.map((x,i)=><article key={i}><span dir="ltr">{String(i+1).padStart(2,"0")}</span><h3>{ar?x.ar:x.en}</h3><p>{ar?x.detailAr:x.detailEn}</p></article>)}</div>
  <div className="market-reference-links"><p>{ar?"مراجع فنية عامة (إرشادات، وليست شهادات امتثال):":"Open reference frameworks (guidance, not compliance certifications):"}</p>
   <a href="https://airc.nist.gov/airmf-resources/airmf/5-sec-core/" target="_blank" rel="noopener noreferrer">NIST AI RMF <ExternalLink size={13}/></a>
   <a href="https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" target="_blank" rel="noopener noreferrer">OWASP Agentic Top 10 <ExternalLink size={13}/></a>
   <a href="https://www.fao.org/in-action/remote-sensing-for-water-productivity/wapor-data/" target="_blank" rel="noopener noreferrer">FAO WaPOR <ExternalLink size={13}/></a>
  </div>
 </section>;
}
