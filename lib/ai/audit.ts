/**
 * Append-only Immutable Audit Logger
 * Generates cryptographic SHA-256 checksums to verify tamper-proof state.
 */

import crypto from "node:crypto";
import { z } from "zod";

export const auditEventSchema = z.object({
  id: z.string().default(() => `aud_${Math.random().toString(36).substring(2, 11)}`),
  organizationId: z.string().min(1, "Organization ID is required"),
  runId: z.string().min(1, "Run ID is required"),
  eventType: z.enum([
    "run_started",
    "contract_established",
    "tool_executed",
    "approval_requested",
    "approval_granted",
    "approval_rejected",
    "action_executed",
    "run_completed",
    "security_violation",
  ]),
  actorId: z.string().default("system"),
  payload: z.record(z.unknown()),
  checksum: z.string().length(64, "Checksum must be 64-character SHA-256 string"),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type AuditEvent = z.infer<typeof auditEventSchema>;

const AUDIT_STORE: AuditEvent[] = [];

export function computeAuditChecksum(data: {
  organizationId: string;
  runId: string;
  eventType: string;
  actorId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}): string {
  const content = `${data.organizationId}|${data.runId}|${data.eventType}|${data.actorId}|${JSON.stringify(data.payload)}|${data.createdAt}`;
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function recordAuditEvent(input: {
  organizationId: string;
  runId: string;
  eventType: z.infer<typeof auditEventSchema>["eventType"];
  actorId?: string;
  payload: Record<string, unknown>;
}): Promise<AuditEvent> {
  const createdAt = new Date().toISOString();
  const actorId = input.actorId || "system";
  const checksum = computeAuditChecksum({
    organizationId: input.organizationId,
    runId: input.runId,
    eventType: input.eventType,
    actorId,
    payload: input.payload,
    createdAt,
  });

  const event: AuditEvent = {
    id: `aud_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    organizationId: input.organizationId,
    runId: input.runId,
    eventType: input.eventType,
    actorId,
    payload: input.payload,
    checksum,
    createdAt,
  };

  const validated = auditEventSchema.parse(event);
  AUDIT_STORE.push(validated);
  return validated;
}

export function verifyAuditEventIntegrity(event: AuditEvent): boolean {
  const expected = computeAuditChecksum({
    organizationId: event.organizationId,
    runId: event.runId,
    eventType: event.eventType,
    actorId: event.actorId,
    payload: event.payload as Record<string, unknown>,
    createdAt: event.createdAt,
  });

  return expected === event.checksum;
}

export async function listAuditEvents(input: {
  organizationId: string;
  runId?: string;
}): Promise<AuditEvent[]> {
  return AUDIT_STORE.filter((e) => {
    if (e.organizationId !== input.organizationId) return false;
    if (input.runId && e.runId !== input.runId) return false;
    return true;
  });
}

export function getAuditEvents(organizationId?: string): AuditEvent[] {
  if (!organizationId) return [...AUDIT_STORE];
  return AUDIT_STORE.filter((e) => e.organizationId === organizationId);
}
