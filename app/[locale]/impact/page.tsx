import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n/config";
import {ValueLab} from "@/components/site/value-lab";
import {PageHeader} from "@/components/site/page-header";
import {CyberEffects} from "@/components/cyber/effects";
import {CyberFooter} from "@/components/cyber/footer";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;if(!isLocale(locale))notFound();const ar=locale==="ar";
 return {title:ar?"قياس جدوى الوكلاء المؤسسية | Agentnexos":"Enterprise agent value model | Agentnexos",description:ar?"نموذج حساب تفاعلي لتقييم كلفة المعالجة والمراجعة البشرية والتشغيل قبل اتخاذ قرار استثماري. الأرقام افتراضية وقابلة للتغيير.":"Interactive model for workflow volume, handling time, human review and operating cost. Defaults are fictional.",alternates:{canonical:`/${locale}/impact`,languages:{ar:"/ar/impact",en:"/en/impact"}}};
}
export default async function ImpactPage({params}:Props){
 const {locale}=await params;if(!isLocale(locale))notFound();const ar=locale==="ar";
 return <CyberEffects className="nexus-public"><PageHeader/><main id="main-content" tabIndex={-1}><div className="nexus-wrap"><section className="atelier-impact-heading">
  <p className="atelier-label">{ar?"هندسة قرار الاستثمار":"BUSINESS CASE / MEASUREMENT FIRST"}</p>
  <h1>{ar?"هل تستحق هذه العملية وكيلًا؟":"Is this process worth an agent?"}</h1>
  <p>{ar?"لا يكفي أن يستجيب النظام أسرع. يجب أن تقل ساعات المعالجة مع حفظ الجودة، وألا تتجاوز المراجعة البشرية وتكاليف التشغيل قيمة الوقت المتاح. قارن وضعك الحالي بتصور أولي، ثم أثبت الافتراضات في تجربة محدودة.":"Faster answers are not the same as a better business process. Human review, model operations, rework and implementation all count. Compare your current state with a proposal, then validate the assumptions in a bounded pilot."}</p>
 </section><ValueLab locale={locale}/>
 <section className="atelier-impact-notes"><article><strong>{ar?"قِس خط الأساس":"Measure baseline"}</strong><p>{ar?"سجل عدد المعاملات، زمنها الوسيط وزمن الحالات البطيئة، أسباب الاستثناءات، عدد المراجعات، ونسبة إعادة العمل. لا تختصر مؤشرات مختلفة إلى رقم توفير واحد.":"Record monthly volume, median and tail latency, exception reasons, number of reviews and rework. Do not reduce the whole project to one savings percentage."}</p></article>
 <article><strong>{ar?"صمّم تجربة مقارنة":"Run a controlled pilot"}</strong><p>{ar?"استخدم مجموعة حالات حقيقية بعد إخفاء البيانات، تشمل طلبات مكتملة وناقصة ومتعارضة. قارن المخرجات التي راجعها نفس المعيار قبل وبعد المساعدة.":"Use safely anonymized cases, including complete, missing and conflicting records. Apply the same acceptance standard to manual and assisted results."}</p></article>
 <article><strong>{ar?"احسب تكلفة دورة الحياة":"Count lifecycle costs"}</strong><p>{ar?"راجع كلفة تجهيز البيانات والتكامل والتقييم والرقابة والدعم، بالإضافة إلى وقت المراجعة وإعادة العمل. هذه تكاليف تُقدر في دراسة المشروع وليست ضمن الحاسبة المبسطة بالكامل.":"Account for data preparation, integration, evaluation, governance, support and rework. These need project-specific assessment and are not all captured in the simplified calculator."}</p></article></section></div>
 </main><CyberFooter locale={locale}/></CyberEffects>;
}
