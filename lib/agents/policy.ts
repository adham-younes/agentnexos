/** Deterministic permissions. Model output never grants authority. */
export const demoPolicy = Object.freeze({
  id: "public-readonly-v1", maxToolCalls: 4, maxReferenceReads: 2,
  referenceBytes: 180000, referenceTimeoutMs: 8000,
  deadlineMs: 150000, allowedTools: ["estimate_workload", "read_technical_reference", "review_workflow_design"] as const,
});
export type DemoTool = typeof demoPolicy.allowedTools[number];
export type RuntimeEvent = {
  sequence: number; elapsedMs: number;
  kind: "routing" | "model_started" | "model_completed" | "tool_allowed" | "tool_denied" | "tool_completed" | "tool_failed";
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
export function classifyTask(request: string) {
  if (/workflow|process|integration|procurement|invoice|approval|purchase|عملية|عمليه|مشتريات|فاتور|تكامل|سير عمل|إجراءات|اعتماد/i.test(request)) return "workflow" as const;
  if (/احسب|حساب|عبء|calculate|workload|minutes|دقيقة|دقائق/i.test(request)) return "calculation" as const;
  if (/documentation|technical|AI SDK|Mastra|Supabase|تقني|توثيق/i.test(request)) return "technical" as const;
  return "conversation" as const;
}
export function discoverTools(task: ReturnType<typeof classifyTask>, request: string): DemoTool[] {
  if (task === "conversation") return [];
  const tools: DemoTool[] = task === "workflow" ? ["review_workflow_design"] : [];
  if (task === "calculation" || /[0-9٠-٩۰-۹]|احسب|حساب|عبء|calculate|workload/i.test(request)) tools.push("estimate_workload");
  if (task === "technical" || /documentation|technical|AI SDK|Mastra|Supabase|تقني|توثيق/i.test(request)) tools.push("read_technical_reference");
  return tools;
}
