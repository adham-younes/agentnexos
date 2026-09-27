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
  "nav.signIn": "تسجيل الدخول",
  "nav.deployAgent": "شغّل وكيلًا",
  "nav.toggleMenu": "فتح القائمة",

  // ---------- hero ----------
  "hero.eyebrow": "وكلاء يعالجون مستنداتك بخطوات واضحة وموافقتك",
  "hero.headlineLine1": "معالجة مستندات،",
  "hero.headlineLine2": "وكلاء",
  "hero.words.0": "يستخرجون",
  "hero.words.1": "يتحقّقون",
  "hero.words.2": "يراجعون",
  "hero.words.3": "ينظّمون",
  "hero.stat1": "وكلاء متخصّصون",
  "hero.stat2": "تتبّع لكل خطوة",
  "hero.stat3": "تصدير بموافقتك",

  // ---------- features ----------
  "features.eyebrow": "القدرات",
  "features.intro":
    "شغّل وكلاء يعالجون المستندات على بنية موزّعة. كل خطوة مُتتبَّعة، وكل مخرَج يحتاج موافقتك قبل التصدير.",
  "features.1.title": "تنفيذ ذاتي",
  "features.1.desc":
    "وكلاء يحلّلون ويقرّرون وينفّذون مهامًا متعدّدة الخطوات، مع توقّف عند نقاط الموافقة قبل أي تصدير.",
  "features.1.meta": "متاح الآن",
  "features.2.title": "حوسبة موزّعة",
  "features.2.desc":
    "وزّع المهام الثقيلة على بنية موزّعة. الوكلاء يعملون على عمّال مستقلّين يمكن تشغيلهم بالتوازي.",
  "features.2.meta": "خارطة الطريق",
  "features.3.title": "تنسيق وكلاء متعدّد",
  "features.3.desc":
    "نسّق فريقًا من الوكلاء المتخصّصين. يتواصلون ويفوّضون العمل لمعالجة مستنداتك معًا.",
  "features.3.meta": "خارطة الطريق",
  "features.4.title": "تشغيل معزول",
  "features.4.desc":
    "كل وكيل يعمل في بيئة معزولة بحدود واضحة. لا وصول إلا لما تسمح به، ومع سجلّ تدقيق لكل خطوة.",
  "features.4.meta": "خارطة الطريق",

  // ---------- how it works ----------
  "how.eyebrow": "كيف يعمل",
  "how.title1": "عرّف.",
  "how.title2": "شغّل.",
  "how.title3": "راجع.",
  "how.step1.title": "عرّف",
  "how.step1.desc":
    "ارفع مستندك وحدّد الحقول المطلوبة. يمكنك ضبط القواعد والقيود بلغة طبيعية.",
  "how.step1.sub": "وكيلك",
  "how.step2.title": "أسند",
  "how.step2.desc":
    "أعطِ وكيلك مهمّة. يفكّكها إلى خطوات وينفّذها، ويتوقّف عند نقطة الموافقة قبل التصدير.",
  "how.step2.sub": "المهمة",
  "how.step3.title": "راقب",
  "how.step3.desc":
    "تابع التقدّم لحظة بلحظة، ثم صدّر النتائج بصيغة CSV أو JSON بعد موافقتك.",
  "how.step3.sub": "ووسّع",

  // ---------- infrastructure ----------
  "infra.eyebrow": "البنية",
  "infra.title": "البنية حسب الحاجة.",
  "infra.title1": "بنية",
  "infra.title2": "عالمية.",
  "infra.regionsWord": "منطقة",
  "infra.lead":
    "بنية قابلة للتوسّع لمعالجة المستندات، مع مناطق تشغيل متعدّدة وحدود واضحة بين المهام.",
  "infra.subtitle": "زمن استجابة منخفض للعملاء في المنطقة.",
  "infra.card": "المعالجة تُنفَّذ في بيئة معزولة لكل مهمّة، بلا تسرّب بيانات بين المهام.",
  "infra.illustrative": "أرقام توضيحية للعرض فقط — خارطة الطريق.",
  "infra.uptime": "جهوزية مستهدفة",
  "infra.latency": "زمن استجابة",
  "infra.nodes": "نقاط",
  "infra.status.operational": "قيد التشغيل التجريبي",
  "infra.region.na": "أمريكا الشمالية",
  "infra.region.eu": "أوروبا",
  "infra.region.apac": "آسيا والمحيط الهادئ",
  "infra.region.sa": "أمريكا الجنوبية",
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
  "metrics.title": "مقاييس تشغيل حقيقية.",
  "metrics.live": "حيّ",
  "metrics.realtime": "لحظي",
  "metrics.subtitle": "من تشغيلات حقيقية على المنصة.",
  "metrics.m1": "مهام مُعالَجة اليوم",
  "metrics.m2": "التوافرية",
  "metrics.m3": "متوسط التنفيذ",
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
    "بنية مفتوحة عبر واجهات REST وWebhooks لدعم سير عملك الحالي.",
  "integrations.leadRoadmap": "تكاملات جاهزة مع مزوّدي السحابة والأدوات — خارطة الطريق.",
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
  "security.complianceNote": "الشهادات قيد التحضير — خارطة الطريق",
  "security.integrityTitle": "سلامة التنفيذ",
  "security.integrityNote": "لا أعطال مؤثّرة خلال آخر 30 يومًا من التشغيل التجريبي.",

  // ---------- developers ----------
  "dev.eyebrow": "المطوّرون",
  "dev.lead": "واجهات برمجية لبناء الوكلاء وتشغيلهم وتنسيقهم، مع تعريف السلوك بالكود أو بلغة طبيعية.",
  "dev.title1": "مصمَّم للتوسّع.",
  "dev.title2": "أو اترك الوكلاء يفعلون.",
  "dev.1.title": "واجهات REST",
  "dev.1.desc": "نقاط نهاية واضحة للتشغيل والموافقة والتصدير.",
  "dev.2.title": "نتائج متدفّقة",
  "dev.2.desc": "تابع خطوات الوكيل لحظة بلحظة عبر تدفّق أحداث.",
  "dev.3.title": "دعم متعدّد النماذج",
  "dev.3.desc": "طبقة نماذج اختيارية، مع مسار حتمي يعمل بلا أي مفتاح.",
  "dev.4.title": "تنزيل المخرجات",
  "dev.4.desc": "صدّر النتائج بصيغة CSV أو JSON بعد الموافقة.",

  // ---------- testimonials (placeholders hidden by default) ----------
  "testimonials.eyebrow": "آراء",
  "testimonials.title": "ماذا يقول الفريق.",
  "testimonials.quote1":
    "نموذج للعرض فقط — لم تُنشَر آراء عملاء حقيقية بعد.",
  "testimonials.quote2":
    "هذا القسم معطّل افتراضيًا لحين توفّر شهادات موثّقة.",
  "testimonials.author": "فريق Agentnexos",
  "testimonials.role": "المنصة",
  "testimonials.note": "قسم مؤقّت — سيُستبدل بشهادات حقيقية بعد الإطلاق.",
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
  "pricing.eyebrow": "الأسعار",
  "pricing.title1": "ادفع مقابل",
  "pricing.title2": "النتائج.",
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
  "pricing.roadmapNote": "الأسماء والأسعار مؤقّتة — خارطة الطريق.",

  // ---------- cta ----------
  "cta.eyebrow": "ابدأ",
  "cta.title1": "جاهز لتشغيل",
  "cta.title2": "وكلاءك؟",
  "cta.primary": "جرّب الكونسول",
  "cta.secondary": "احجز عرضًا",
  "cta.lead": "انطلق بمعالجة مستنداتك خطوة بخطوة، مع موافقتك قبل أي تصدير.",
  "cta.free": "١٠٠ مهمة مجانية للتجربة",
  "cta.roadmapNote": "الأزرار مؤقّتة — خارطة الطريق.",

  // ---------- footer ----------
  "footer.brand": "Agentnexos",
  "footer.tagline": "منصة عربية-أولًا لمعالجة المستندات، بخطوات واضحة وموافقتك قبل التصدير.",
  "footer.hiring": "توظيف",
  "footer.copyright": "© ٢٠٢٥ Agentnexos. جميع الحقوق محفوظة.",
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
  "footer.operational": "كل الوكلاء يعملون",
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
