import { z } from "zod/v4";

/** Proposed design data, never a source of executable permissions. */
export const designContractSchema = z.object({
  goal: z.string().trim().min(1).max(600),
  owner: z.string().trim().max(200),
  sourceOfTruth: z.string().trim().max(600),
  acceptanceCriteria: z.array(z.string().trim().min(1).max(400)).max(8),
  steps: z.array(z.object({
    title: z.string().trim().min(1).max(200),
    effect: z.enum(["read", "draft", "external_write", "financial", "delete"]),
    decisionOwner: z.string().trim().max(200),
    evidence: z.string().trim().max(400),
    onFailure: z.string().trim().max(400),
  }).strict()).min(1).max(12),
}).strict();
const unspecified = (value: string) => !value || /^(?:unknown|tbd|n\/a|not (?:known|specified)|غير محدد|غير معروف|لم يحدد|لاحقًا|لاحقا|\?+|…|\.{2,})$/i.test(value.trim());
export function reviewDesignContract(input: unknown) {
  const design = designContractSchema.parse(input);
  const gaps: { field: string; code: string }[] = [];
  if (unspecified(design.owner)) gaps.push({field:"owner",code:"OWNER_REQUIRED"});
  if (unspecified(design.sourceOfTruth)) gaps.push({field:"sourceOfTruth",code:"SOURCE_REQUIRED"});
  if (!design.acceptanceCriteria.length || design.acceptanceCriteria.some(unspecified)) gaps.push({field:"acceptanceCriteria",code:"ACCEPTANCE_REQUIRED"});
  const steps = design.steps.map((step,index) => {
    const sensitive = ["external_write", "financial", "delete"].includes(step.effect);
    if(sensitive && unspecified(step.decisionOwner)) gaps.push({field:`steps.${index}.decisionOwner`,code:"DECISION_OWNER_REQUIRED"});
    if(unspecified(step.evidence)) gaps.push({field:`steps.${index}.evidence`,code:"EVIDENCE_REQUIRED"});
    if(unspecified(step.onFailure)) gaps.push({field:`steps.${index}.onFailure`,code:"FAILURE_PATH_REQUIRED"});
    return { index, risk: step.effect === "financial" || step.effect === "delete" ? "high" : sensitive ? "elevated" : "low", humanApprovalRequired: sensitive, executableInPreview: false };
  });
  return { scope:"design_review_only", status:gaps.length?"needs_details":"ready_for_human_review", executable:false, gaps, steps,
    basis:"Model-proposed design, not verified organizational policy. No authorization, approval or external execution is granted." };
}

const shortText = z.string().trim().max(700);
const question = z.string().trim().max(240);
const reviewResponse = z.object({
  mode: z.literal("review_only"), owner: z.string().trim().max(160), source: z.string().trim().max(240),
  steps: z.array(z.object({
    action: z.enum(["intake", "check", "missing_information", "recommendation"]),
    text: z.string().trim().min(1).max(500), basisQuote: z.string().trim().min(1).max(300),
  }).strict()).min(2).max(6),
  acceptanceCheck: z.string().trim().max(400), question,
}).strict();
const amendmentResponse = z.object({
  mode: z.literal("amendment_only"), title: z.string().trim().min(1).max(100),
  replacement: z.string().trim().min(1).max(500),
  whenIncomplete: shortText, whenComplete: shortText,
}).strict();
const unknownResponse = z.object({
  mode: z.literal("unknown_write"), outcome: z.literal("unknown"), retryAuthorized: z.literal(false),
  nextStep: z.string().trim().min(1).max(700), ifUnverifiable: z.string().trim().min(1).max(350), question,
}).strict();
const approverResponse = z.object({
  mode: z.literal("absent_approver"), approvalStatus: z.literal("pending"), substituteAuthorized: z.literal(false),
  availableReviewWork: z.string().trim().min(1).max(650),
  pendingDecision: z.string().trim().min(1).max(350), question,
}).strict();
export type ConstrainedResponseMode = "review_only" | "amendment_only" | "unknown_write" | "absent_approver";
export type ConstrainedResponse = z.infer<typeof reviewResponse> | z.infer<typeof amendmentResponse> | z.infer<typeof unknownResponse> | z.infer<typeof approverResponse>;
/** Each provider request receives an object schema, not a root union. */
export function constrainedResponseSchema(mode: ConstrainedResponseMode): z.ZodType<ConstrainedResponse> {
  if (mode === "review_only") return reviewResponse;
  if (mode === "amendment_only") return amendmentResponse;
  if (mode === "unknown_write") return unknownResponse;
  return approverResponse;
}
const normalized = (text: string) => text.normalize("NFKC").toLowerCase().replace(/[’‘]/g, "'").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[إأآ]/g, "ا").replace(/\s+/g, " ").trim();
const negativeAction = /\b(?:do not|don't|does not|doesn't|must not|mustn't|should not|cannot|can't|never|avoid|without|no need to|not to)\s+(?:(?:archive|archiving|send|sending|notify|notifying|contact|appoint|create|request|retry|change|alter|modify|require|introduce|add|assume|infer|existing|other|acceptance|checks?|steps?|review|workflow|messages?|emails?|notifications?|anyone|any|a|an|the|new|external|automatic|substitute|or|and|to)\s+)*$|\bno\s+(?:(?:new|automatic|external|additional)\s+)*$|(?:^|\s)(?:لا|دون|بدون|عدم)\s+(?:[\p{L}]+\s+){0,4}$/iu;
/** Reject positive unsupported scope, while permitting "do not archive/send" warnings. */
function positiveMention(text: string, pattern: RegExp) {
  return text.split(/(?<=[.!?؟;؛,،\n])|\b(?:but|however|then|instead)\b|لكن|ثم/).some(sentence => {
    const clause = normalized(sentence);
    const matches = clause.matchAll(new RegExp(pattern.source, pattern.flags.replace(/g/g, "") + "g"));
    return [...matches].some(match => {
      const index = match.index ?? 0;
      const before = clause.slice(Math.max(0, index - 90), index);
      const after = clause.slice(index + match[0].length, index + match[0].length + 55);
      return !negativeAction.test(before) && !/^\s*(?:(?:is|are) not|not (?:needed|required|authorized)|غير مطلوب|ليس مطلوب)/.test(after);
    });
  });
}
function unsupportedMention(text: string, userText: string, pattern: RegExp) {
  return !pattern.test(userText) && positiveMention(text, pattern);
}
function rejectResponse(): never { throw new Error("PUBLIC_RESPONSE_SCOPE_REJECTED"); }

/** Validate before any answer text becomes visible; render only the permitted shape. */
export function validateAndRenderResponse(input: unknown, mode: ConstrainedResponseMode, userStatements: string[], locale: "ar" | "en") {
  const response = constrainedResponseSchema(mode).parse(input);
  if (response.mode !== mode) rejectResponse();
  const userText = normalized(userStatements.join("\n"));
  let paragraphs: string[];
  if (response.mode === "review_only") {
    if (response.steps.at(-1)?.action !== "recommendation" || response.steps.slice(0, -1).some(step => step.action === "recommendation")) rejectResponse();
    if (response.owner && !userText.includes(normalized(response.owner))) rejectResponse();
    if (response.source && !userText.includes(normalized(response.source))) rejectResponse();
    if ((!response.owner && /(?:owner is|owner:|المسؤول هو|المسؤول:)/i.test(userText)) || (!response.source && /(?:source of truth is|source:|مصدر البيانات هو|المصدر:)/i.test(userText))) rejectResponse();
    if (response.steps.some(step => !userText.includes(normalized(step.basisQuote)))) rejectResponse();
    paragraphs = [
      response.owner ? `${locale === "ar" ? "المسؤول" : "Owner"}: ${response.owner}` : "",
      response.source ? `${locale === "ar" ? "المصدر" : "Source"}: ${response.source}` : "",
      response.steps.map((step, index) => `${index + 1}. ${step.text}`).join("\n"),
      response.acceptanceCheck, response.question,
    ];
    // Owner/source labels can legitimately contain nouns such as "email inbox".
    const body = [...response.steps.map(step => step.text), response.acceptanceCheck, response.question].join("\n");
    if (positiveMention(body, /\b(?:archiv\w*|notify|send|escalat\w*|email(?:ing)? (?:the|a|an|to)|place an? order|issue an? order)\b|ارشف|ارشفة|ارسال|ابلاغ|تصعيد/)) rejectResponse();
    for (const concept of [/\b(?:catalog\w*|sku|item code)\b|كتالوج|رمز الصنف/, /\b(?:future date|date.{0,20}(?:after today|later than today|future))\b|تاريخ.{0,20}(?:مستقبل|بعد اليوم)/, /\b(?:central|shared|company) repositor\w*\b|مستودع مركزي/]) {
      if (unsupportedMention(body, userText, concept)) rejectResponse();
    }
  } else if (response.mode === "amendment_only") {
    paragraphs = [response.title, response.replacement, response.whenIncomplete, response.whenComplete];
    const body = paragraphs.join("\n");
    // A replacement step cannot contain a second complete workflow or acceptance section.
    if (/\n\s*\d+[.)]\s/.test(body) || positiveMention(body, /\bacceptance (?:check|test)\b|حالات قبول|اختبار قبول/)) rejectResponse();
    if (positiveMention(body, /\b(?:archiv\w*|notify|send|email(?:ing)? (?:the|a|an|to)|escalat\w*|appoint|delegate|set a deadline)\b|ارشفة|ارسال|ابلاغ|تصعيد|تعيين|حدد مهلة/)) rejectResponse();
  } else if (response.mode === "unknown_write") {
    paragraphs = [response.nextStep, response.ifUnverifiable, response.question];
    const body = normalized(paragraphs.join("\n"));
    for (const sentence of body.split(/[.!?؟;؛\n]/)) {
      const missingEvidence = /(?:no|missing|absent|lack of).{0,30}(?:log|entry|record).{0,100}(?:confirm|prove|means|not applied|failed|never reached)|(?:log|entry|record).{0,20}(?:absent|missing|unavailable|not found).{0,100}(?:confirm|prove|means|not applied|failed)|(?:عدم وجود|غياب|لا يوجد|لا توجد).{0,35}(?:سجل|قيد|اثر|تسجيل).{0,100}(?:يعني|يثبت|يؤكد|لم ينفذ|لم يطبق|لم يتم|فشل)|(?:السجل|القيد).{0,20}(?:غائب|مفقود|غير موجود).{0,100}(?:يعني|يثبت|يؤكد|لم ينفذ|لم يطبق|فشل)/i.test(sentence);
      const rejectsInference = /do not (?:assume|treat|infer)|never (?:infer|treat)|does not|doesn't|cannot|can't|not proof|not evidence|insufficient|لا (?:يعني|يثبت|تفترض|تستنتج|تعتبر)|ليس دليلا|لا يكفي/i.test(sentence);
      if (missingEvidence && !rejectsInference) rejectResponse();
      const proposedRetry = positiveMention(sentence, /\b(?:retry|resubmit|re-submit)\b|اعد (?:الطلب|الارسال)/);
      // This response is about an unresolved effect, not permission for a future retry.
      if (proposedRetry) rejectResponse();
      if (/(?:unique|external).{0,25}reference.{0,100}(?:prevent|ignore|safe|duplicate)|(?:معرف|مرجع).{0,25}(?:فريد|خارجي).{0,100}(?:يمنع|منع|تكرار|امن|بامان)/i.test(sentence) && !rejectsInference) rejectResponse();
    }
  } else {
    paragraphs = [response.availableReviewWork, response.pendingDecision, response.question];
    if (positiveMention(paragraphs.join("\n"), /\b(?:escalat\w*|notify|send|appoint|create.{0,20}committee|issue.{0,20}delegation|(?:committee|compliance office|governance).{0,35}(?:approve|authorize|delegate))\b|تصعيد|ابلاغ|اشعار|ارسال|تعيين|اصدار.{0,20}تفويض|لجنة.{0,25}(?:تعتمد|تفوض)/)) rejectResponse();
  }
  return paragraphs.filter(Boolean).join("\n\n");
}
