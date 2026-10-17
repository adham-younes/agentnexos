import { publicRoleInstructions } from "./instruction-templates";
import type { Locale } from "@/lib/i18n/config";
import type { classifyTask } from "./policy";
import type { ConstrainedResponseMode } from "./contract";
export const promptVersion = "contextual-advisor-2026-10-17";
export function constrainedFinalInstructions(mode: ConstrainedResponseMode) {
  const format = "Return only the object required by the response schema. The server renders its text as ordinary conversation after validation; never include JSON fences, extra fields or private reasoning. Use empty strings for unused question/text fields. Text must answer this user's supplied facts, not a generic template. The earlier model drafts are deliberately excluded; only actual tool checks and user statements support the answer.";
  const scope = {
    review_only: "Use only intake, checks of the user's named fields, a missing-information path and a final review recommendation. The final step action MUST be recommendation. Do not add archiving, storage repositories, catalog matching, future-date rules, escalation, ordering or messages. Owner/source must be exact excerpts of user-supplied wording, or empty if genuinely unknown. Each step basisQuote must be an exact short quote from a USER message that supports that step; a quote does not permit adding an unrelated condition. Give one concise acceptance check using the named fields, not a new business rule. Do not ask again for supplied owner/source.",
    amendment_only: "Return ONLY the replacement for the requested step, not the whole workflow or an acceptance section. title names that step without a step number. replacement describes the actual requested change; whenIncomplete and whenComplete describe the pending/recheck behavior only. Leave unrelated details out: they remain unchanged. Do not carry forward unsupported details from the previous assistant answer. Do not add deadlines, escalation, delegates, archive or sending.",
    unknown_write: "The current outcome is unknown and no retry is authorized. nextStep describes how to reconcile the actual final record with authoritative evidence and an operation identifier if available. ifUnverifiable keeps the outcome unknown/pending. Missing logs, no search result, a timeout or an unchanged screen NEVER prove non-application. Do not claim every ERP has an audit log or supports safe retries. An invented reference/idempotency key is not proof of safe retry. Do not prescribe resubmission or downstream posting. Answer the immediate next-step question in a short practical response, not an incident workflow.",
    absent_approver: "Approval remains pending and no substitute is authorized. availableReviewWork may prepare/check the existing request using supplied facts. pendingDecision keeps the binding decision for the authorized approver or an ALREADY existing, verified delegation. Do not create/request a new delegation, appoint a deputy, invent a committee/office/management escalation, send notifications or prescribe an organizational workflow. Ask about an existing policy only if that one question is useful.",
  }[mode];
  return `${format}\nREQUIRED MODE: ${mode}. ${scope}`;
}
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
