import type { Locale } from "../i18n/config";

interface ExampleCase {
  id: "procurement" | "receivables";
  name: string;
  team: string;
  request: string;
  context: string;
  sources: string[];
  checks: string[];
  decision: string;
  draft: string;
}
interface WorkspaceCopy {
  eyebrow: string;
  title: string;
  intro: string;
  notice: string;
  choose: string;
  example: string;
  request: string;
  team: string;
  sources: string;
  plan: string;
  review: string;
  draft: string;
  start: string;
  approve: string;
  reject: string;
  reset: string;
  idle: string;
  reviewing: string;
  approved: string;
  rejected: string;
  idleHint: string;
  reviewHint: string;
  resultHint: string;
  rejectedHint: string;
  footer: string;
  cases: [ExampleCase, ExampleCase];
}

/** Authored illustrative cases. No client data, live connectors or model output. */
export const workspaceCopy: Record<Locale, WorkspaceCopy> = {
  ar: {
    eyebrow: "مساحة التجربة",
    title: "من طلب العمل إلى قرار واضح.",
    intro: "استكشف كيف يمكن تنظيم الطلب، ومراجعة معلوماته، وتحديد ما يحتاج إلى موافقتك قبل الانتقال للخطوة التالية.",
    notice: "مثال تفاعلي ببيانات افتراضية. يعمل داخل هذه الصفحة فقط؛ لا يتصل بأنظمة شركتك، ولا يستدعي نموذج ذكاء اصطناعي، ولا يرسل طلبات أو يعدّل سجلات.",
    choose: "اختر عملية لاستكشافها",
    example: "بيانات توضيحية",
    request: "الطلب",
    team: "الفريق المسؤول",
    sources: "المعلومات المتاحة في المثال",
    plan: "ما الذي سنراجعه؟",
    review: "القرار المطلوب منك",
    draft: "المسودة المقترحة",
    start: "استكشف مسار المراجعة",
    approve: "اعتماد المسودة في المثال",
    reject: "إعادة للمراجعة",
    reset: "ابدأ المثال من جديد",
    idle: "جاهز للاستكشاف",
    reviewing: "بانتظار قرارك في المثال",
    approved: "اعتمدت المسودة في المثال",
    rejected: "أعدت الطلب للمراجعة",
    idleHint: "ابدأ لمعرفة المعلومات التي تُراجع والقرار الذي يبقى بيد المسؤول.",
    reviewHint: "راجع المسودة والمعلومات أعلاه. اختيار الاعتماد يغيّر حالة هذا المثال فقط.",
    resultHint: "لم يُرسل شيء إلى المورد أو العميل، ولم يتغير أي سجل خارجي. في التشغيل الفعلي، يلزم ربط النظام والتحقق من الصلاحية والنتيجة قبل إعلان الإنجاز.",
    rejectedHint: "لم تُعتمد المسودة. يمكن العودة إلى المعلومات وتعديل النطاق قبل استئناف العمل. يمكنك إعادة المثال الآن.",
    footer: "يُحدد نطاق التنفيذ ومصادر البيانات والموافقات مع فريق المؤسسة قبل ربط أي عملية فعلية.",
    cases: [
      {
        id: "procurement",
        name: "مراجعة طلب شراء",
        team: "المشتريات ومدير الإدارة",
        request: "تجهيز مسودة طلب شراء 20 جهازًا لفريق جديد، دون إرسال طلب للمورد.",
        context: "يتضمن المثال عرضين متوافقين مع المواصفات. العرض الأول يصل خلال أسبوع، والثاني خلال ثلاثة أسابيع. أولوية الإدارة هي الموعد، والسعر يحتاج مراجعتها.",
        sources: ["طلب الإدارة: 20 جهازًا بمواصفات موحدة", "عرضان توضيحيان: تسليم خلال أسبوع أو ثلاثة أسابيع", "قاعدة المثال: إرسال الطلب يحتاج اعتماد مدير الإدارة"],
        checks: ["مراجعة الكمية والمواصفات المطلوبة", "مقارنة موعد التسليم وبيان الفرق بين العرضين", "عرض مسودة اختيار المورد على صاحب الصلاحية"],
        decision: "هل تعتمد مسودة اختيار العرض الأقرب لموعد بدء الفريق، أم تعيد الطلب لمراجعة التكلفة؟",
        draft: "مسودة للمراجعة: اختيار العرض الذي يصل خلال أسبوع لشراء 20 جهازًا. السعر وشروط السداد يحتاجان اعتماد الإدارة قبل إصدار أمر شراء.",
      },
      {
        id: "receivables",
        name: "متابعة المستحقات",
        team: "المالية ومسؤول الحساب",
        request: "تجهيز قائمة متابعة للمستحقات المتأخرة ومسودة تذكير، دون مراسلة العملاء.",
        context: "يتضمن المثال ثلاث فواتير: واحدة متأخرة، وواحدة داخل مهلة السداد، وثالثة محل اعتراض. الاعتراض يحتاج مراجعة مسؤول الحساب قبل أي تذكير.",
        sources: ["كشف توضيحي بثلاث فواتير وحالات سداد مختلفة", "ملاحظة مسؤول الحساب: اعتراض مفتوح على فاتورة", "قاعدة المثال: مراجعة المالية قبل إرسال أي رسالة"],
        checks: ["فصل الفاتورة المتأخرة عن التي لم يحن موعدها", "إحالة الفاتورة محل الاعتراض لمسؤول الحساب", "تجهيز تذكير للفاتورة المتأخرة فقط لمراجعة المالية"],
        decision: "هل تعتمد مسودة التذكير للفاتورة المتأخرة، مع إبقاء الفاتورة محل الاعتراض خارج المراسلة؟",
        draft: "مسودة للمراجعة: نرجو مراجعة الفاتورة المتأخرة وإفادتنا بموعد السداد المتوقع. تُستبعد الفاتورة محل الاعتراض لحين مراجعة مسؤول الحساب.",
      },
    ],
  },
  en: {
    eyebrow: "Workflow preview",
    title: "From a work request to a clear decision.",
    intro: "Explore how a request can be organized, its information reviewed, and your approval requested before the next step.",
    notice: "An interactive example with fictional data. It runs only on this page: no company connections, AI model calls, messages or record changes.",
    choose: "Choose a process to explore",
    example: "Illustrative data",
    request: "Request",
    team: "Responsible team",
    sources: "Information available in this example",
    plan: "What will be reviewed?",
    review: "Your decision",
    draft: "Proposed draft",
    start: "Explore the review process",
    approve: "Approve the example draft",
    reject: "Return for review",
    reset: "Restart the example",
    idle: "Ready to explore",
    reviewing: "Waiting for your example decision",
    approved: "You approved the example draft",
    rejected: "You returned the request for review",
    idleHint: "Start to see which information is reviewed and which decision stays with the responsible person.",
    reviewHint: "Review the draft and information above. Approval changes only the state of this example.",
    resultHint: "Nothing was sent to a supplier or customer, and no external record changed. Live operation needs system connections, authorization and outcome verification before completion can be claimed.",
    rejectedHint: "The draft was not approved. The information and scope can be reviewed before work resumes. You can restart this example now.",
    footer: "Execution scope, data sources and approvals are agreed with the enterprise team before a live process is connected.",
    cases: [
      {
        id: "procurement",
        name: "Purchase request review",
        team: "Procurement and department manager",
        request: "Prepare a draft purchase request for 20 devices for a new team, without sending an order to a supplier.",
        context: "The example contains two offers matching the specification. The first arrives in one week, the second in three weeks. The department prioritizes delivery; pricing needs its review.",
        sources: ["Department request: 20 devices with a shared specification", "Two illustrative offers: delivery in one or three weeks", "Example rule: sending an order needs the department manager's approval"],
        checks: ["Review the requested quantity and specification", "Compare delivery dates and explain the difference between offers", "Present a draft supplier choice to the authorized decision maker"],
        decision: "Approve the draft choice that meets the team's start date, or return it for a cost review?",
        draft: "Draft for review: choose the one-week offer for 20 devices. Pricing and payment terms need department approval before a purchase order is issued.",
      },
      {
        id: "receivables",
        name: "Receivables follow-up",
        team: "Finance and account owner",
        request: "Prepare an overdue receivables follow-up list and a reminder draft, without contacting customers.",
        context: "The example contains three invoices: one overdue, one not yet due, and one disputed. The dispute needs the account owner's review before any reminder.",
        sources: ["Illustrative ledger: three invoices with different payment states", "Account owner's note: an open invoice dispute", "Example rule: finance reviews every message before sending"],
        checks: ["Separate the overdue invoice from the one not yet due", "Refer the disputed invoice to the account owner", "Prepare a reminder only for the overdue invoice for finance review"],
        decision: "Approve the overdue invoice reminder draft while keeping the disputed invoice out of the message?",
        draft: "Draft for review: please review the overdue invoice and let us know your expected payment date. The disputed invoice is excluded until the account owner reviews it.",
      },
    ],
  },
};
