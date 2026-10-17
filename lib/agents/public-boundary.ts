/** Server-owned response constraints, never a canned business answer or authority. */
export type PublicResponseConstraints = {
  externalExecution: false; approvalGranted: false; unknownWriteEffect: boolean;
  approverUnavailable: boolean; reviewOnly: boolean; amendmentOnly: boolean;
};
export function publicResponseConstraints(request: string, previousRequest?: string): PublicResponseConstraints {
  const text = request.normalize("NFKC").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[إأآ]/g, "ا");
  const explicitDesign = /\b(design|build|create|map|plan)\b|صمم|تصميم|ارسم|خطط/i.test(text);
  return {
    externalExecution: false, approvalGranted: false,
    unknownWriteEffect: !explicitDesign
      && /timeout|timed out|time.?out|(?:الاتصال|اتصال).{0,20}(?:فصل|انقطع)|انقطاع الاتصال/i.test(text)
      && /update|submit|write|تحديث|تعديل|ارسال/i.test(text) && /\bafter\b|بعد/i.test(text),
    approverUnavailable: !explicitDesign && /approv|purchasing manager|اعتماد|المعتمد|مسؤول الموافقة/i.test(text)
      && /unavailable|absent|away|غايب|غائب|غير متاح/i.test(text),
    reviewOnly: /review[ -]only|review.{0,50}only|مراجعة.{0,40}فقط|مراجعه.{0,40}فقط/i.test(text),
    amendmentOnly: Boolean(previousRequest) && /\bonly\b|\bjust\b|فقط|وحدها/i.test(text)
      && /revise|change|update|modify|عد.?ل|تعديل/i.test(text),
  };
}
