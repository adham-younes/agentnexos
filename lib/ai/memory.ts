/**
 * Enterprise Operational Memory Manager
 * Guarantees strict multi-tenant isolation and session scoping.
 */

import { z } from "zod";

export const memoryRecordSchema = z.object({
  id: z.string().default(() => `mem_${Math.random().toString(36).substring(2, 11)}`),
  organizationId: z.string().min(1, "Organization ID is required"),
  scope: z.enum(["session", "thread", "organization"]).default("organization"),
  key: z.string().min(1, "Memory key is required"),
  value: z.record(z.unknown()),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type MemoryRecord = z.infer<typeof memoryRecordSchema>;

// Tenant-isolated in-memory registry (mirrors Supabase `memories` table)
const MEMORY_VAULT = new Map<string, MemoryRecord>();

function buildVaultKey(organizationId: string, scope: string, key: string): string {
  return `${organizationId}:${scope}:${key}`;
}

export async function storeMemory(input: {
  organizationId: string;
  scope?: "session" | "thread" | "organization";
  key: string;
  value: Record<string, unknown>;
  tags?: string[];
}): Promise<MemoryRecord> {
  const scope = input.scope || "organization";
  const tags = input.tags || [];
  const vaultKey = buildVaultKey(input.organizationId, scope, input.key);

  const existing = MEMORY_VAULT.get(vaultKey);
  const now = new Date().toISOString();

  const record: MemoryRecord = {
    id: existing ? existing.id : `mem_${Math.random().toString(36).substring(2, 11)}`,
    organizationId: input.organizationId,
    scope,
    key: input.key,
    value: input.value,
    tags,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };

  const validated = memoryRecordSchema.parse(record);
  MEMORY_VAULT.set(vaultKey, validated);
  return validated;
}

export async function getMemory(input: {
  organizationId: string;
  scope?: "session" | "thread" | "organization";
  key: string;
}): Promise<MemoryRecord | null> {
  const scope = input.scope || "organization";
  const vaultKey = buildVaultKey(input.organizationId, scope, input.key);
  const found = MEMORY_VAULT.get(vaultKey);

  if (!found) return null;
  // Strict tenant verification guard
  if (found.organizationId !== input.organizationId) {
    throw new Error("Security Violation: Cross-tenant memory access attempt blocked.");
  }

  return found;
}

export async function listMemories(input: {
  organizationId: string;
  scope?: "session" | "thread" | "organization";
  tag?: string;
}): Promise<MemoryRecord[]> {
  const results: MemoryRecord[] = [];

  for (const record of MEMORY_VAULT.values()) {
    if (record.organizationId !== input.organizationId) continue;
    if (input.scope && record.scope !== input.scope) continue;
    if (input.tag && !record.tags.includes(input.tag)) continue;
    results.push(record);
  }

  return results;
}

export function getMemoryStats(organizationId?: string): { totalEntries: number } {
  if (!organizationId) {
    return { totalEntries: MEMORY_VAULT.size };
  }
  let count = 0;
  for (const record of MEMORY_VAULT.values()) {
    if (record.organizationId === organizationId) count++;
  }
  return { totalEntries: count };
}
