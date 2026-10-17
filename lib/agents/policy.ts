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
  task?: TaskIntent; reason?: string;
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
export type TaskIntent = "conversation" | "clarification" | "amendment" | "calculation" | "technical" | "workflow";
/** Route the requested action, not a business noun such as invoice or approval. */
export function classifyTask(request: string, previousRequest?: string): TaskIntent {
  const text = normalizeRequest(request).trim();
  if (/^(?:(?:طيب|okay|ok)[ ،]*)?(?:شكرا|تمام|حاضر|thanks|thank you|hello|hi|مرحبا|اهلا|كيف حالك|how are you)[.!؟?\s،]*$/i.test(text)) return "conversation";
  const design = /\b(design|build|create|map|redesign)\b|صمم|تصميم|ابن|ارسم|خطط/i.test(text)
    && !/\b(?:do not|don't|not asking (?:you )?to) (?:design|build|create)\b|لا (?:تصمم|تبن|تخطط)/i.test(text);
  const fullRevision = /\b(?:full|complete|entire) (?:redesign|workflow|plan)\b|(?:كامل|بالكامل|من البداية|من جديد)/i.test(text);
  if (previousRequest && !fullRevision && /\b(revise|amend|modify|replace|change|adjust|expand|continue)\b|عد.?ل|تعديل|استبدل|غير الخطوة|اكمل|كمل|وضح (?:الخطوة|النقطة)/i.test(text)) return "amendment";
  const calculation = /\b(calculate|compute|workload|how many hours|total time)\b|احسب|حساب|عبء العمل|كام ساعة|كم ساعة/i.test(text);
  if (calculation && !design && !/\bthen (?:design|plan|build)\b|ثم (?:صمم|خطط)|بعدين (?:صمم|خطط)/i.test(text)) return "calculation";
  const process = /workflow|process|integration|procurement|invoice|approval|purchase|support|assistant|عملية|مشتريات|فاتور|تكامل|سير عمل|اجراءات|اعتماد|مساعد|طلبات العملاء/i.test(text);
  if (design || (process && /\b(?:we need|we want|plan a|plan for|how can we (?:turn|automate|improve))\b|نريد|نحتاج|عايز|عاوز|كيف نحول/i.test(text))) return "workflow";
  if (/documentation|technical|AI SDK|Mastra|Supabase|تقني|توثيق/i.test(text)) return "technical";
  if (/\?|؟|^(?:what|why|how|who|can |could |is |does |ماذا|متى|كيف|لماذا|هل|ليه|ازاي|ايه|مين|ومين|وماذا|و?لو)/i.test(text) || previousRequest) return "clarification";
  return "conversation";
}
export function discoverTools(task: ReturnType<typeof classifyTask>, request: string): DemoTool[] {
  const arithmetic = /احسب|حساب|عبء|(?:re)?calculat|(?:re)?compute|workload|total hours/i.test(request);
  if (task === "amendment") return arithmetic ? ["estimate_workload"] : [];
  if (task === "conversation" || task === "clarification") return [];
  const tools: DemoTool[] = task === "workflow" ? ["review_workflow_design"] : [];
  if (task === "calculation" || arithmetic) tools.push("estimate_workload");
  if (task === "technical" || /documentation|technical|AI SDK|Mastra|Supabase|تقني|توثيق/i.test(request)) tools.push("read_technical_reference");
  return tools;
}
