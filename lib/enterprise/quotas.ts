/**
 * Agentnexos — Operational Quota & Usage Metering Engine
 * Enforces multi-tenant consumption boundaries across agent runs, tokens, and active concurrency.
 */

export interface OrganizationQuotaStatus {
  organizationId: string;
  monthlyRunsLimit: number;
  monthlyRunsConsumed: number;
  monthlyRunsRemaining: number;
  hourlyTokensLimit: number;
  hourlyTokensConsumed: number;
  hourlyTokensRemaining: number;
  activeConcurrentRuns: number;
  maxConcurrentRuns: number;
  resetAt: string;
  isThrottled: boolean;
}

interface QuotaBucket {
  runsConsumed: number;
  tokensConsumed: number;
  activeRuns: number;
  windowStart: number;
}

const quotaStore = new Map<string, QuotaBucket>();

const DEFAULT_MONTHLY_RUNS = 500;
const DEFAULT_HOURLY_TOKENS = 200000;
const DEFAULT_MAX_CONCURRENCY = 5;

function getOrCreateBucket(orgId: string): QuotaBucket {
  let bucket = quotaStore.get(orgId);
  const now = Date.now();
  const ONE_HOUR = 3600 * 1000;

  if (!bucket) {
    bucket = {
      runsConsumed: 0,
      tokensConsumed: 0,
      activeRuns: 0,
      windowStart: now,
    };
    quotaStore.set(orgId, bucket);
  } else if (now - bucket.windowStart > ONE_HOUR) {
    // Reset hourly token window
    bucket.tokensConsumed = 0;
    bucket.windowStart = now;
  }

  return bucket;
}

export function getOrgQuotaStatus(
  orgId: string,
  limits?: { monthlyRuns?: number; hourlyTokens?: number; maxConcurrency?: number }
): OrganizationQuotaStatus {
  const bucket = getOrCreateBucket(orgId);
  const monthlyRunsLimit = limits?.monthlyRuns || DEFAULT_MONTHLY_RUNS;
  const hourlyTokensLimit = limits?.hourlyTokens || DEFAULT_HOURLY_TOKENS;
  const maxConcurrency = limits?.maxConcurrency || DEFAULT_MAX_CONCURRENCY;

  const runsRemaining = Math.max(0, monthlyRunsLimit - bucket.runsConsumed);
  const tokensRemaining = Math.max(0, hourlyTokensLimit - bucket.tokensConsumed);
  const isThrottled = runsRemaining <= 0 || tokensRemaining <= 0 || bucket.activeRuns >= maxConcurrency;

  const nextReset = new Date(bucket.windowStart + 3600 * 1000).toISOString();

  return {
    organizationId: orgId,
    monthlyRunsLimit,
    monthlyRunsConsumed: bucket.runsConsumed,
    monthlyRunsRemaining: runsRemaining,
    hourlyTokensLimit,
    hourlyTokensConsumed: bucket.tokensConsumed,
    hourlyTokensRemaining: tokensRemaining,
    activeConcurrentRuns: bucket.activeRuns,
    maxConcurrentRuns: maxConcurrency,
    resetAt: nextReset,
    isThrottled,
  };
}

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  quota: OrganizationQuotaStatus;
}

export function checkAndConsumeRunQuota(
  orgId: string,
  limits?: { monthlyRuns?: number; hourlyTokens?: number; maxConcurrency?: number }
): QuotaCheckResult {
  const quota = getOrgQuotaStatus(orgId, limits);

  if (quota.monthlyRunsRemaining <= 0) {
    return {
      allowed: false,
      reason: `Monthly run quota exhausted (${quota.monthlyRunsConsumed}/${quota.monthlyRunsLimit}).`,
      quota,
    };
  }

  if (quota.activeConcurrentRuns >= quota.maxConcurrentRuns) {
    return {
      allowed: false,
      reason: `Maximum concurrent runs reached (${quota.activeConcurrentRuns}/${quota.maxConcurrentRuns}).`,
      quota,
    };
  }

  const bucket = getOrCreateBucket(orgId);
  bucket.runsConsumed += 1;
  bucket.activeRuns += 1;

  return {
    allowed: true,
    quota: getOrgQuotaStatus(orgId, limits),
  };
}

export function releaseConcurrentRun(orgId: string): void {
  const bucket = quotaStore.get(orgId);
  if (bucket && bucket.activeRuns > 0) {
    bucket.activeRuns -= 1;
  }
}

export function recordTokenUsage(orgId: string, tokens: number): void {
  const bucket = getOrCreateBucket(orgId);
  bucket.tokensConsumed += Math.max(0, tokens);
}
