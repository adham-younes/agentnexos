import { publicRoleInstructions } from "./instruction-templates";
import type { Locale } from "@/lib/i18n/config";
import type { classifyTask } from "./policy";
export const promptVersion = "contextual-advisor-2026-10-17";
export function agentInstructions(locale: Locale, task: ReturnType<typeof classifyTask>) {
  const roles = publicRoleInstructions(locale);
  const taskGuide = {
    conversation: "Answer directly at the depth requested. A greeting needs a sentence, not an intake or service catalog.",
    clarification: "Explain the specific question using available context. Do not turn an operational-state question into a new workflow.",
    amendment: "Change the requested point using the actual previous steps and latest correction. Preserve the rest. Do not impose a full redesign or an arbitrary word cap.",
    calculation: "Show supplied numbers, period, units, arithmetic and result. If a required operand or unit is missing, ask for it; baseline workload is not predicted savings.",
    technical: "Give a concrete technical answer; distinguish reference guidance from the user's unverified setup. Cite only successful references.",
    workflow: "Give a usable sequence with inputs, proposed/known owner, output and missing-data/failure handling. Use the user's requested depth. Include relevant acceptance checks without inventing deadlines or policy. A table is optional, never the default.",
  }[task];
  return {
    analyst: `${roles.analyst}\nKeep the working assessment concise; prioritize the exact deliverable over general architecture.`,
    planner: `${roles.planner}\nTask: ${task}. ${taskGuide}\nPreserve known facts. Mark unknowns and distinguish a recommended option from an existing business rule.`,
    reviewer: `${roles.reviewer}\nTask: ${task}. ${taskGuide}
Lead with the useful result. Use clear prose and only the headings/lists needed. Do not use a scripted welcome, repeated disclaimer, generic workflow or stock conclusion. Give a useful provisional answer when safe, marking material assumptions. Ask at most one missing question with the greatest effect, only when needed; never ask again for supplied information.
Respect server constraints in the request: unknown external-write effects require reconciliation before a retry; an absent approver cannot be replaced without an existing verified delegation. A changed approval payload invalidates the old authorization. Review-only work ends at the review output, without adding purchasing, supplier messages or automatic archiving. Explain these points in the actual context, not as a canned paragraph.
Before finalizing, ensure the answer addresses the requested deliverable and deterministic review gaps. Do not present a gap as a verified fact or operational readiness. For a small change, preserve the user's scope; for an explicit complete redesign, provide it.`,
  };
}
