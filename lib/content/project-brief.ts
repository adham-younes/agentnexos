import type { Locale } from "@/lib/i18n/config";
import type { BriefField } from "@/lib/project-brief";

export const briefGuidance: Record<Locale, Record<BriefField, string>> = {
 ar: {
  goal: "صف التعطل وأثره على الفريق، مثل رجوع طلب الشراء أكثر من مرة بسبب نقص التفاصيل.",
  owner: "اكتب الدور المسؤول، ومن يعتمد الاستثناءات. لا تحتاج إلى أسماء أشخاص.",
  trigger: "حدد بداية يمكن ملاحظتها: وصول طلب، أو حلول موعد متابعة، أو سؤال موظف.",
  source: "اذكر نوع السجل أو السياسة ومن يعتمدها. استخدم وصفًا افتراضيًا بدل إرفاق بيانات حقيقية.",
  outcome: "ما الذي يستلمه المسؤول؟ مثال: ملف طلب مكتمل مع قائمة بالنواقص.",
  acceptance: "اكتب فحصًا واضحًا، مثل مطابقة كل مبلغ مع مستنده وإظهار كل معلومة ناقصة.",
  failure: "حدد متى يتوقف المسار، ولمن تعود الحالة، وما يلزم قبل إعادة المحاولة.",
 },
 en: {
  goal: "Describe the bottleneck and its effect, such as purchase requests repeatedly returned for missing details.",
  owner: "Name the accountable role and who reviews exceptions. Personal names are unnecessary.",
  trigger: "Choose an observable start: a new request, a follow-up date or an employee question.",
  source: "Name the record or policy and its owner. Use a fictional description instead of real records.",
  outcome: "What does the reviewer receive? For example, a complete request with a list of missing details.",
  acceptance: "Define a check, such as matching each amount to its document and showing every missing input.",
  failure: "Say when work stops, who receives the case and what must happen before a retry.",
 },
};
export const briefExamples = {
 ar: { goal: "تقليل رجوع طلبات الشراء الداخلية بسبب نقص المواصفات أو عرض المورد.", owner: "مسؤول المشتريات يراجع الطلب، وصاحب الصلاحية المالية يعتمد أي شراء وفق سياسة الشركة.", trigger: "وصول طلب شراء داخلي جديد من نموذج الطلبات.", source: "نموذج طلب افتراضي، وقائمة المواصفات المطلوبة، وسياسة اعتماد يحددها الفريق.", outcome: "ملف مراجعة يجمع تفاصيل الطلب والمرفقات والنواقص، مع مسودة توصية للمسؤول.", acceptance: "كل بند مرتبط بمصدره، والنواقص ظاهرة، ولا ينتقل الطلب للشراء قبل اعتماد المسؤول.", failure: "يتوقف الطلب عند نقص مستند أو تعارض البيانات، ويعود إلى صاحبه لاستكماله قبل المراجعة.", volume: "100", minutes: "20", effect: "financial" },
 en: { goal: "Reduce internal purchase requests returned because specifications or supplier quotes are missing.", owner: "The procurement owner reviews requests. An authorized finance owner approves purchases under company policy.", trigger: "A new internal purchase request arrives through the request form.", source: "A fictional request form, required specifications and an approval policy defined by the team.", outcome: "A review file with request details, attachments, gaps and a draft recommendation for the owner.", acceptance: "Each item has a source, gaps remain visible and no purchase proceeds without owner approval.", failure: "Stop when a document is missing or records conflict. Return the request to its owner before review.", volume: "100", minutes: "20", effect: "financial" },
} satisfies Record<Locale, Record<BriefField | "volume" | "minutes" | "effect", string>>;
