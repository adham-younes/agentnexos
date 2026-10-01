import { z } from "zod/v4";

export const reservationSchema = z.union([
  z.object({ code: z.literal("RESERVED"), runId: z.uuid() }).strict(),
  z.object({ code: z.enum(["DEMO_BUSY", "DEMO_DAILY_LIMIT", "DEMO_GLOBAL_LIMIT"]), retryAfterSeconds: z.number().int().min(1).max(86400) }).strict(),
]);
export type DemoLimitCode = "DEMO_BUSY" | "DEMO_DAILY_LIMIT" | "DEMO_GLOBAL_LIMIT";
export function demoLimitCode(value: unknown): DemoLimitCode | null {
  if (!value || typeof value !== "object" || !("code" in value)) return null;
  const code = value.code;
  return code === "DEMO_BUSY" || code === "DEMO_DAILY_LIMIT" || code === "DEMO_GLOBAL_LIMIT" ? code : null;
}
