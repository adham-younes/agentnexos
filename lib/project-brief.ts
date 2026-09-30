import { z } from "zod";

export const briefFields = ["goal", "owner", "trigger", "source", "outcome", "acceptance", "failure"] as const;
export type BriefField = typeof briefFields[number];
const text = z.string().trim().min(3).max(1200);
export const briefSchema = z.object({
  goal: text, owner: text, trigger: text, source: text, outcome: text, acceptance: text, failure: text,
  effect: z.enum(["read", "draft", "external_write", "financial", "delete"]),
  volume: z.string().max(20), minutes: z.string().max(20),
}).strict();
export type ProjectBrief = z.infer<typeof briefSchema>;
export function reviewBrief(input: unknown) {
  const parsed = briefSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, fields: [...new Set(parsed.error.issues.map(issue => String(issue.path[0])))] };
  const brief = parsed.data;
  const optionalPositive = (value: string) => value === "" || (/^\d+(\.\d+)?$/.test(value) && Number(value) > 0 && Number(value) <= 1000000);
  const fields = (["volume", "minutes"] as const).filter(key => !optionalPositive(brief[key]));
  if (fields.length) return { ok: false as const, fields };
  return { ok: true as const, brief, approvalRequired: !["read", "draft"].includes(brief.effect),
    risk: ["financial", "delete"].includes(brief.effect) ? "high" : brief.effect === "external_write" ? "elevated" : "limited",
    baselineMinutes: brief.volume && brief.minutes ? Number(brief.volume) * Number(brief.minutes) : null,
    executable: false as const };
}

// Avoid user content becoming a heading or an executable Markdown HTML block.
export function quoteBriefValue(value: string) {
  return value.split(/\r?\n/).map(line => `> ${line.replace(/[<>&]/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[char]!)}`).join("\n");
}
