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
