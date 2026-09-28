import type { Locale } from "./config";

/**
 * Arabic dictionary (flat, dot-namespaced).
 *
 * `en` has no dictionary on purpose: every section keeps its original
 * English copy as the literal fallback, so /en stays byte-for-byte the
 * template design (see docs/GUARDRAILS.md).
 *
 * Content rules (docs/GUARDRAILS.md §6):
 * - No invented clients, logos, metrics, integrations, or certifications.
 * - Anything not implemented is labelled «خارطة الطريق» (roadmap).
 */
export const ar = {
  // ---------- shared ----------
  "common.availableNow": "متاح الآن",
  "common.roadmap": "خارطة الطريق",
  "common.tryConsole": "جرّب الكونسول",
  "common.bookDemo": "احجز عرضًا",

  // ---------- navigation ----------
  "nav.capabilities": "القدرات",
  "nav.process": "كيف يعمل",
  "nav.infra": "البنية",
  "nav.integrations": "التكاملات",
  "nav.security": "الأمان",
  "nav.signIn": "منهج العمل",
  "nav.deployAgent": "ابدأ مشروعًا",
  "nav.toggleMenu": "فتح القائمة",

  // ---------- hero ----------
  "hero.eyebrow": "أنظمة وكيلة للمؤسسات في الشرق الأوسط",
  "hero.headlineLine1": "أنظمة وكيلة،",
  "hero.headlineLine2": "مصمّمة كي",
  "hero.words.0": "تخطّط",
  "hero.words.1": "تنفّذ",
  "hero.words.2": "تتكامل",
  "hero.words.3": "تتطوّر",
  "hero.stat1": "نفهم سير العمل",
  "hero.stat2": "نبني النظام الوكيل",
  "hero.stat3": "نشغّله بضوابط",
  "hero.stat4": "خارطة الطريق",

  // ---------- metrics (live counters are honest zeros; the rest is roadmap) ----------
  "metrics.m1.sub": "في مساحة التجربة",
  "metrics.roadmap": "خارطة الطريق",
  "metrics.m2.sub": "خارطة الطريق",
  "metrics.m3.sub": "خارطة الطريق",

  // ---------- features ----------
  "features.eyebrow": "القدرات",
  "features.title1": "ذكاء يعمل",
  "features.title2": "داخل مؤسستك.",
  "features.intro":
    "نحوّل العمليات المعقّدة إلى أنظمة وكلاء مخصّصة تفهم السياق، تستخدم الأدوات، وتنجز العمل تحت ضوابط واضحة.",
  "features.1.title": "فهم سير العمل",
  "features.1.desc":
    "نحوّل إجراءات التشغيل والقرارات والاستثناءات إلى خطوات وأدوات ونقاط موافقة قابلة للتنفيذ.",
  "features.1.meta": "اكتشاف",
  "features.2.title": "أنظمة وكيلة مخصّصة",
  "features.2.desc":
    "نبني الوكلاء حول فرقك وحدود بياناتك ولغتك وقواعد عملك، لا حول عرض تجريبي عام.",
  "features.2.meta": "بناء",
  "features.3.title": "أدوات وتكاملات",
  "features.3.desc":
    "نربط الوكلاء بالأنظمة المصرّح بها ليسترجعوا السياق وينفّذوا عملًا حقيقيًا.",
  "features.3.meta": "ربط",
  "features.4.title": "تشغيل منضبط",
  "features.4.desc":
    "نضيف الصلاحيات والتقييمات وسجلّ الأحداث والمراجعة البشرية بحسب مخاطر العملية.",
  "features.4.meta": "تشغيل",

  // ---------- how it works ----------
  "how.eyebrow": "منهج التنفيذ",
  "how.title1": "اكتشف.",
  "how.title2": "ابنِ.",
  "how.title3": "شغّل.",
  "how.step1.title": "اكتشف",
  "how.step1.desc":
    "نرسم العملية والأنظمة ونقاط القرار والمخاطر والنتيجة المطلوبة للأعمال.",
  "how.step1.sub": "سير العمل",
  "how.step2.title": "ابنِ",
  "how.step2.desc":
    "نصمّم الوكلاء والأدوات والذاكرة والسياسات والتكاملات ونقاط الموافقة حول العملية.",
  "how.step2.sub": "النظام",
  "how.step3.title": "شغّل",
  "how.step3.desc":
    "ننشر على مراحل محسوبة، ونراقب كل تشغيل، ونقيّم النتائج، ثم نطوّر النظام من بيانات حقيقية.",
  "how.step3.sub": "بضوابط",

  // ---------- infrastructure ----------
  "infra.eyebrow": "معمارية التشغيل",
  "infra.title": "بنية تناسب المؤسسة.",
  "infra.title1": "مرنة حسب",
  "infra.title2": "بيئتك.",
  "infra.regionsWord": "طبقات",
  "infra.lead":
    "نصمّم طبقات النماذج والأدوات والذاكرة والسياسات والرصد وفق متطلبات العملية وحدود المؤسسة.",
  "infra.subtitle": "زمن استجابة منخفض للعملاء في المنطقة.",
  "infra.card": "معمارية تركيبية للنماذج والأدوات والذاكرة والسياسات والرصد، تُختار لكل نشر.",
  "infra.illustrative": "نموذج معماري، وليس ادعاءً عن بنية تشغيل حية.",
  "infra.uptime": "موافقة بشرية عندما تتطلب المخاطر",
  "infra.latency": "أحداث قابلة للتتبّع وتقييمات",
  "infra.humanValue": "بشري",
  "infra.traceValue": "تتبّع",
  "infra.nodes": "نقاط",
  "infra.status.operational": "تُصمّم حسب المشروع",
  "infra.region.na": "طبقة النماذج",
  "infra.region.eu": "طبقة الأدوات",
  "infra.region.apac": "طبقة الذاكرة",
  "infra.region.sa": "الرصد والتقييم",
  "infra.detail.models": "مرنة بين المزوّدين",
  "infra.detail.tools": "محدودة الصلاحيات",
  "infra.detail.memory": "مرتبطة بالسياسات",
  "infra.detail.observability": "جاهزة للتقييم",
  "infra.region.mena": "الشرق الأوسط وشمال أفريقيا",
  "infra.region.status": "خارطة الطريق",
  "infra.stat1.label": "زمن الاستجابة",
  "infra.stat1.value": "منخفض",
  "infra.stat2.label": "التوافرية",
  "infra.stat2.value": "حسب الخطة",
  "infra.stat3.label": "المناطق",
  "infra.stat3.value": "خارطة الطريق",

  // ---------- metrics ----------
  "metrics.eyebrow": "المقاييس",
  "metrics.title": "مقاييس نجاح العملية.",
  "metrics.live": "حيّ",
  "metrics.realtime": "لحظي",
  "metrics.subtitle": "تُضبط لكل تجربة قبل الانتقال إلى الإنتاج.",
  "metrics.m1": "تشغيلات موثّقة حاليًا",
  "metrics.m2": "جودة النتيجة",
  "metrics.m3": "زمن دورة العملية",
  "metrics.note":
    "العدّادات تعرض تشغيلات حقيقية على المنصة فقط. لا أرقام تقديرية ولا بيانات مزوّدين.",
  "metrics.metricsTitle": "مؤشّرات الأداء",
  "metrics.activeBy": "من تشغيلات حقيقية",
  "metrics.p99": "زمن الاستجابة",
  "metrics.routing": "توجيه متعدّد النماذج",
  "metrics.routingNote": "خارطة الطريق",

  // ---------- integrations ----------
  "integrations.eyebrow": "التكاملات",
  "integrations.title1": "وصّل",
  "integrations.title2": "كل شيء.",
  "integrations.lead":
    "نبدأ بالأنظمة التي يعتمد عليها سير عملك، ثم نضيف كل تكامل بحدود صلاحيات واختبارات واضحة.",
  "integrations.leadRoadmap": "الشعارات توضّح نطاقات التكامل الممكنة ولا تعني تكاملات جاهزة.",
  "integrations.cat.data": "بيانات",
  "integrations.cat.comms": "تواصل",
  "integrations.cat.storage": "تخزين",
  "integrations.cat.code": "برمجة",
  "integrations.cat.crm": "علاقات العملاء",
  "integrations.cat.marketing": "تسويق",
  "integrations.cat.auto": "أتمتة",
  "integrations.cat.pm": "إدارة مشاريع",
  "integrations.cat.payments": "مدفوعات",
  "integrations.cat.llm": "نماذج",
  "integrations.cat.docs": "مستندات",
  "integrations.cat.auth": "مصادقة مدمجة",
  "integrations.cat.realtime": "مزامنة لحظية",
  "integrations.stat0": "تكاملات جاهزة",
  "integrations.stat1": "واجهات REST",
  "integrations.stat2": "مزامنة أحداث",
  "integrations.stat3": "مصادقة",
  "integrations.viewAll": "التكاملات القادمة",

  // ---------- security ----------
  "security.eyebrow": "الأمان",
  "security.title1": "قوية،",
  "security.title2": "لكن مضبوطة.",
  "security.lead":
    "الوكلاء أقوياء لكن مقيّدون. تحكّم واضح يضمن أنهم لا يفعلون إلا ما تسمح به.",
  "security.active": "الحماية مفعّلة",
  "security.1.title": "تنفيذ معزول",
  "security.1.desc": "كل وكيل يعمل في بيئة معزولة خاصة به.",
  "security.2.title": "ذاكرة مشفّرة",
  "security.2.desc": "البيانات مشفّرة أثناء التخزين وأثناء النقل.",
  "security.3.title": "سجلّ تدقيق كامل",
  "security.3.desc": "كل إجراء مسجَّل ويمكن تفتيشه.",
  "security.4.title": "حدود الصلاحيات",
  "security.4.desc": "مبدأ أقل صلاحية ممكن حسب التصميم.",
  "security.compliance": "الامتثال",
  "security.complianceNote": "مبدأ تصميم",
  "security.control.leastPrivilege": "أقل صلاحية",
  "security.control.humanApproval": "موافقة بشرية",
  "security.control.auditEvents": "أحداث تدقيق",
  "security.control.isolation": "عزل التنفيذ",
  "security.integrityTitle": "مبادئ تحكم أساسية",
  "security.integrityNote": "نبني الضوابط المطلوبة لكل مشروع ونوثّقها قبل التشغيل الإنتاجي.",

  // ---------- developers ----------
  "dev.eyebrow": "هندسة الوكلاء",
  "dev.lead": "نبني كل نظام من عقود أدوات واضحة، وحالة قابلة للتتبّع، وسياسات تنفيذ، وتقييمات تمنع الانتقال للإنتاج بلا دليل.",
  "dev.title1": "منطق واضح.",
  "dev.title2": "تشغيل قابل للرصد.",
  "dev.1.title": "عقود أدوات محدّدة",
  "dev.1.desc": "مدخلات ومخرجات وصلاحيات قابلة للاختبار لكل أداة.",
  "dev.2.title": "حالة قابلة للتتبّع",
  "dev.2.desc": "كل خطوة وقرار ونتيجة لها أثر يمكن مراجعته.",
  "dev.3.title": "مرونة اختيار النماذج",
  "dev.3.desc": "اختيار النموذج وفق الجودة والتكلفة والسياسة، دون ربط المنطق بمزوّد واحد.",
  "dev.4.title": "تقييم قبل الإنتاج",
  "dev.4.desc": "سيناريوهات واختبارات قبول تقيس سلوك النظام قبل التوسّع.",

  // ---------- testimonials (placeholders hidden by default) ----------
  "testimonials.eyebrow": "معايير النجاح",
  "testimonials.title": "قيمة أعمال قابلة للقياس.",
  "testimonials.quote1":
    "نموذج للعرض فقط — لم تُنشَر آراء عملاء حقيقية بعد.",
  "testimonials.quote2":
    "هذا القسم معطّل افتراضيًا لحين توفّر شهادات موثّقة.",
  "testimonials.author": "فريق Agentnexos",
  "testimonials.role": "المنصة",
  "testimonials.note": "نحدّد قبل البناء خط أساس للعملية، ومؤشرات الجودة والزمن والتكلفة والتدخل البشري، ثم نقيس الأثر بعد التشغيل. لا ننشر نتائج عملاء أو أرقامًا غير موثّقة.",
  "testimonials.prev": "الشهادة السابقة",
  "testimonials.next": "الشهادة التالية",
  "testimonials.goTo": "انتقل إلى الشهادة",
  "testimonials.featured": "شركات للتجربة",
  "testimonials.disclaimer": "شهادات توضيحية للعرض فقط — خارطة الطريق.",
  "testimonials.t1.quote": "شخصية توضيحية — لم تُنشَر شهادة حقيقية بعد.",
  "testimonials.t1.role": "دور توضيحي",
  "testimonials.t1.metric": "مقياس توضيحي",
  "testimonials.t2.quote": "شخصية توضيحية — لم تُنشَر شهادة حقيقية بعد.",
  "testimonials.t2.role": "دور توضيحي",
  "testimonials.t2.metric": "مقياس توضيحي",
  "testimonials.t3.quote": "شخصية توضيحية — لم تُنشَر شهادة حقيقية بعد.",
  "testimonials.t3.role": "دور توضيحي",
  "testimonials.t3.metric": "مقياس توضيحي",
  "testimonials.t4.quote": "شخصية توضيحية — لم تُنشَر شهادة حقيقية بعد.",
  "testimonials.t4.role": "دور توضيحي",
  "testimonials.t4.metric": "مقياس توضيحي",

  // ---------- pricing (placeholders hidden by default) ----------
  "pricing.eyebrow": "نموذج التعاون",
  "pricing.title1": "ابدأ بعملية،",
  "pricing.title2": "وابنِ بثقة.",
  "pricing.toggle.monthly": "شهري",
  "pricing.toggle.annual": "سنوي",
  "pricing.save": "وفّر 20%",
  "pricing.plan1.name": "تجريبي",
  "pricing.plan1.tagline": "للتجربة والمهام الصغيرة",
  "pricing.plan1.price": "مجانًا",
  "pricing.plan1.c1": "٥٠ مهمة شهريًا",
  "pricing.plan1.c2": "تشغيل وكيل واحد بالتوازي",
  "pricing.plan1.c3": "سجلّات أساسية",
  "pricing.plan1.c4": "تصدير CSV و JSON",
  "pricing.plan2.name": "أساسي",
  "pricing.plan2.tagline": "للفرق التي تعمل بالوكلاء",
  "pricing.plan2.price": "قريبًا",
  "pricing.plan2.c1": "١٠٠٠ مهمة شهريًا",
  "pricing.plan2.c2": "٢٥ وكيلًا بالتوازي",
  "pricing.plan2.c3": "سجلّ تدقيق كامل",
  "pricing.plan2.c4": "دعم ذو أولوية",
  "pricing.plan3.name": "مؤسّسي",
  "pricing.plan3.tagline": "للمؤسّسات التي تعمل بالوكلاء",
  "pricing.plan3.price": "تواصل معنا",
  "pricing.plan3.c1": "مهام غير محدودة",
  "pricing.plan3.c2": "توجيه متعدّد النماذج",
  "pricing.plan3.c3": "نشر داخلي",
  "pricing.plan3.c4": "دعم مخصّص ٢٤/٧",
  "pricing.popular": "الأكثر اختيارًا",
  "pricing.cta1": "ابدأ مجانًا",
  "pricing.cta2": "ابدأ التجربة",
  "pricing.cta3": "تواصل مع المبيعات",
  "pricing.compare": "قارن كل الميزات",
  "pricing.perMonth": "/شهريًا",
  "pricing.billedMonthly": "فواتير شهرية",
  "pricing.billedAnnually": "فواتير سنوية",
  "pricing.roadmapNote": "نبدأ بجلسة اكتشاف لتحديد العملية ذات الأولوية، ثم تجربة محدودة بمعايير نجاح واضحة، ثم نشر إنتاجي تدريجي. النطاق والتكلفة يُحدّدان بعد فهم الأنظمة والمخاطر والتكاملات المطلوبة.",

  // ---------- cta ----------
  "cta.eyebrow": "ابدأ",
  "cta.title1": "اختر أول عملية،",
  "cta.title2": "ونبني نظامها الوكيل.",
  "cta.primary": "استكشف القدرات",
  "cta.secondary": "شاهد منهج العمل",
  "cta.lead": "ابدأ من مشكلة تشغيل حقيقية: نحدّد النتيجة، ونرسم القيود، ثم نبني تجربة قابلة للقياس داخل بيئتك.",
  "cta.free": "المرحلة الأولى: اكتشاف العملية وتحديد معيار النجاح",
  "cta.roadmapNote": "الأزرار مؤقّتة — خارطة الطريق.",

  // ---------- footer ----------
  "footer.brand": "Agentnexos",
  "footer.tagline": "أنظمة وكلاء ذكاء اصطناعي مخصّصة لأتمتة عمليات المؤسسات في الشرق الأوسط وتشغيلها بضوابط واضحة.",
  "footer.hiring": "توظيف",
  "footer.copyright": "© ٢٠٢٦ Agentnexos. جميع الحقوق محفوظة.",
  "footer.products": "المنتج",
  "footer.company": "الشركة",
  "footer.legal": "قانوني",
  "footer.docs": "الوثائق",
  "footer.capabilities": "القدرات",
  "footer.howItWorks": "كيف يعمل",
  "footer.integrations": "التكاملات",
  "footer.pricing": "الأسعار",
  "footer.security": "الأمان",
  "footer.about": "من نحن",
  "footer.blog": "المدوّنة",
  "footer.status": "الحالة",
  "footer.contact": "تواصل",
  "footer.careers": "وظائف",
  "footer.privacy": "الخصوصية",
  "footer.terms": "الشروط",
  "footer.api": "مرجع API",
  "footer.sdk": "للمطوّرين",
  "footer.operational": "المنصة قيد التطوير المرحلي",
  "footer.rights": "جميع الحقوق محفوظة.",
} as const;

export type ArKey = keyof typeof ar;

const dictionaries: Record<Locale, Record<string, string>> = {
  ar,
  en: {},
};

export function getDictionary(locale: Locale): Record<string, string> {
  return dictionaries[locale];
}
