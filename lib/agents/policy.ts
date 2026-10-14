/** Deterministic permissions. Model output never grants authority. */
export const demoPolicy = Object.freeze({
  id: "public-readonly-v1", maxToolCalls: 4, maxReferenceReads: 2,
  referenceBytes: 180000, referenceTimeoutMs: 8000,
  deadlineMs: 150000, allowedTools: ["estimate_workload", "read_technical_reference", "review_workflow_design"] as const,
});
export type DemoTool = typeof demoPolicy.allowedTools[number];
export type RuntimeEvent = {
  sequence: number; elapsedMs: number;
  kind: "routing" | "policy_response" | "model_started" | "model_completed" | "tool_allowed" | "tool_denied" | "tool_completed" | "tool_failed";
  role?: string; model?: string; tokens?: number; tool?: DemoTool; latencyMs?: number;
  task?: "conversation" | "calculation" | "technical" | "workflow"; reason?: string;
};
export function createToolGate(options: { tools: readonly DemoTool[]; signal?: AbortSignal; onEvent?: (event: Omit<RuntimeEvent, "sequence" | "elapsedMs">) => Promise<void> | void }) {
  let calls = 0, references = 0;
  return async (tool: DemoTool) => {
    options.signal?.throwIfAborted();
    const reason = !demoPolicy.allowedTools.includes(tool) || !options.tools.includes(tool) ? "CAPABILITY_DENIED"
      : calls >= demoPolicy.maxToolCalls || (tool === "read_technical_reference" && references >= demoPolicy.maxReferenceReads) ? "TOOL_BUDGET_EXCEEDED" : undefined;
    if (reason) { await options.onEvent?.({ kind: "tool_denied", tool, reason }); throw new Error(reason); }
    // Reserve synchronously before async audit/network work: parallel calls share a budget.
    calls += 1;
    if (tool === "read_technical_reference") references += 1;
    await options.onEvent?.({ kind: "tool_allowed", tool });
  };
}
function normalizeRequest(request: string) {
  return request.normalize("NFKC").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[إأآ]/g, "ا").replace(/ى/g, "ي");
}
function directTask(request: string) {
  if (/workflow|process|integration|procurement|invoice|approval|purchase|customer support|knowledge assistant|عملية|عمليه|مشتريات|فاتور|تكامل|سير عمل|اجراءات|اعتماد|خدمة العملاء|خدمه العملاء|مساعد معرفة|مساعد معرفه|طلبات العملاء/i.test(request)) return "workflow" as const;
  if (/احسب|حساب|عبء|calculate|workload|minutes|دقيقة|دقائق/i.test(request)) return "calculation" as const;
  if (/documentation|technical|AI SDK|Mastra|Supabase|تقني|توثيق/i.test(request)) return "technical" as const;
  return "conversation" as const;
}
/** Only referential follow-ups inherit a previous USER request; greetings never do. */
export function classifyTask(request: string, previousRequest?: string) {
  const normalized = normalizeRequest(request);
  // A reported timeout AFTER a write asks about unknown effects, not a new workflow.
  // Avoid forcing a planning tool merely because the affected record is an invoice.
  const explicitDesign = /\b(design|build|create|map|plan)\b|صمم|تصميم|ابن|ارسم|خطط|سير عمل/i.test(normalized);
  const afterWriteTimeout = /timeout|timed out|time.?out|(?:الاتصال|اتصال).{0,20}(?:فصل|انقطع)|انقطاع الاتصال/i.test(normalized)
    && /\bafter\b|بعد/i.test(normalized)
    && /update|submit|write|تحديث|تعديل|ارسال/i.test(normalized);
  if (afterWriteTimeout && !explicitDesign) return "conversation" as const;
  const direct = directTask(normalized);
  if (direct !== "conversation" || !previousRequest) return direct;
  if (/^(?:(?:طيب|okay|ok)[ ،]*)?(?:شكرا|تمام|حاضر|thanks|thank you|hello|hi|مرحبا|اهلا|كيف حالك|how are you)[.!؟?\s،]*$/i.test(normalized.trim())) return "conversation";
  const followup = /^(?:و?لو|وماذا|ماذا لو|ومين|ومن |كيف |طب |طيب |اكمل|كمل|عدّل|عدل|وضح|فصل|what if|what happens|and what|who |how |continue|expand|revise|update (?:it|that|the plan))/i.test(normalized.trim());
  return followup ? directTask(normalizeRequest(previousRequest)) : direct;
}
export function discoverTools(task: ReturnType<typeof classifyTask>, request: string): DemoTool[] {
  if (task === "conversation") return [];
  const tools: DemoTool[] = task === "workflow" ? ["review_workflow_design"] : [];
  if (task === "calculation" || /[0-9٠-٩۰-۹]|احسب|حساب|عبء|calculate|workload/i.test(request)) tools.push("estimate_workload");
  if (task === "technical" || /documentation|technical|AI SDK|Mastra|Supabase|تقني|توثيق/i.test(request)) tools.push("read_technical_reference");
  return tools;
}
