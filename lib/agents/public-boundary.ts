import type { Locale } from "@/lib/i18n/config";

/** Small, explicit server response contracts. These are policy/draft responses,
 * not model judgments, actual approvals or evidence of an external action. */
export function publicBoundaryReply(request: string, locale: Locale, previousRequest?: string) {
  const text = request.normalize("NFKC").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[إأآ]/g, "ا");
  const ar = locale === "ar";
  const design = /\b(design|build|create|map|plan)\b|صمم|تصميم|ارسم|خطط|سير عمل/i.test(text);
  const timeout = /timeout|timed out|time.?out|(?:الاتصال|اتصال).{0,20}(?:فصل|انقطع)|انقطاع الاتصال/i.test(text);
  const write = /update|submit|write|تحديث|تعديل|ارسال/i.test(text);
  if (!design && timeout && write && /\bafter\b|بعد/i.test(text)) return {
    contract: "unknown_write_effect" as const,
    text: ar
      ? "نتيجة التحديث غير معروفة بعد انقطاع الاتصال. لا تُعِد الطلب الآن. تحقق من حالة السجل في النظام النهائي باستخدام معرّف العملية أو الطلب، وسجل ما يثبت تنفيذ التحديث أو عدم تنفيذه. إذا تعذر التحقق، تبقى الحالة معلقة للمصالحة مع مسؤول النظام. لا يكفي إضافة مفتاح منع تكرار؛ يجب أولًا إثبات أن النظام يدعمه وأن إعادة الطلب آمنة. هذا المساعد لم ينفذ تحديثًا خارجيًا."
      : "The update's external effect is unknown after the timeout. Do not retry now. Reconcile the final record using the operation or request identifier and evidence of whether the update occurred. If that cannot be verified, keep it pending for reconciliation with the system owner. Adding an idempotency key is insufficient: the system's support and safe retry behavior must first be verified. This public assistant performed no external update.",
  };
  const approver = /approv|purchasing manager|اعتماد|المعتمد|مسؤول الموافقة/i.test(text);
  const unavailable = /unavailable|absent|away|غايب|غائب|غير متاح/i.test(text);
  if (!design && approver && unavailable) return {
    contract: "approver_unavailable" as const,
    text: ar
      ? "يبقى الطلب معلقًا عند غياب مسؤول الاعتماد. لا أستطيع تحديد نائب أو منح صلاحية من المحادثة. يمكن المتابعة فقط إذا وُجد تفويض موثق وسارٍ يغطي هذا الإجراء، وبعد التحقق من صاحب الصلاحية ونطاق التفويض. هل توجد سياسة تفويض معتمدة يمكن الرجوع إليها؟"
      : "Keep the request pending while the authorized approver is unavailable. This chat cannot name a deputy or grant authority. Proceed only with an existing, valid documented delegation covering this action, after verifying the approver and delegation scope. Is there an approved delegation policy to consult?",
  };
  const missing = /missing.{0,30}(?:data|information|field|document)|(?:data|information|field|document).{0,30}missing|البيانات الناقصة|البيانات الناقصه|نقص البيانات/i.test(text);
  const narrow = /only|just|فقط|وحدها/i.test(text) && /revise|change|update|modify|عد.?ل|تعديل/i.test(text);
  if (previousRequest && missing && narrow) return {
    contract: "missing_data_step_draft" as const,
    text: ar
      ? "صياغة مقترحة لخطوة البيانات الناقصة فقط: يتحقق المراجع من البيانات المطلوبة؛ عند وجود نقص، يوضح لصاحب الطلب العناصر الناقصة ويبقي الحالة معلقة حتى استكمالها والتحقق منها، ثم يستأنف المسار القائم. باقي الخطوات كما قدمتها دون تغيير، ولا تُضاف مهلة أو جهة تصعيد أو إرسال تلقائي."
      : "Proposed replacement for the missing-data step only: the reviewer checks the required information, identifies the gaps for the requester, and keeps the request pending until the missing information is supplied and verified. Then resume the existing process. Keep the other supplied steps unchanged; add no deadline, escalation role or automatic sending.",
  };
  const reviewOnly = /review[ -]only|review.{0,50}only|مراجعة.{0,40}فقط|مراجعه.{0,40}فقط/i.test(text);
  const purchase = /purchas|procurement|شراء|مشتريات/i.test(text);
  if (!previousRequest && design && reviewOnly && purchase) return {
    contract: "purchase_review_draft" as const,
    text: ar
      ? "مسودة مقترحة لمراجعة طلب الشراء فقط:\n\n1. استلام الطلب ومتطلباته: المخرج طلب جاهز للفحص؛ المسؤول ومصدر البيانات يحتاجان تحديدًا من المؤسسة.\n2. فحص اكتمال البيانات واتساقها مع السياسة المعتمدة عند توفيرها. عند النقص أو التعارض يبقى الطلب معلقًا وتُطلب المعلومات من صاحبه؛ لا نفترض سياسة أو بديلًا للمعتمد.\n3. تجهيز نتيجة للمراجعة البشرية تتضمن التوصية وأدلتها والنواقص المتبقية. ينتهي المسار عند هذه النتيجة دون شراء أو إرسال للمورد أو أرشفة تنفيذية.\n\nحالات قبول المسودة: الطلب الناقص يبقى معلقًا؛ التعارض ظاهر؛ لا قرار ملزم دون صاحب صلاحية مثبت. من صاحب المراجعة المعتمد؟"
      : "Proposed purchase-request review draft:\n\n1. Receive the request and its requirements. Output: a request ready for review; the institution must still identify its owner and authoritative source.\n2. Check completeness and consistency with the approved policy when supplied. Missing or conflicting information keeps the request pending with the gaps identified for its requester. Do not assume a policy or substitute approver.\n3. Prepare a human-review result containing the recommendation, evidence and unresolved gaps. End at that review result: no ordering, supplier sending or operational archiving.\n\nDraft acceptance cases: incomplete requests remain pending; conflicts stay visible; no binding decision without verified authority. Who is the authorized reviewer?",
  };
  return undefined;
}
