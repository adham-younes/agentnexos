/**
 * Multi-Tenant Sliding Window Rate Limiter & Token Quota Manager
 * Enforces per-tenant throughput caps and token budgets to prevent exhaustion
 * and ensure operational predictability.
 */

interface RateBucket {
  timestamps: number[];
  tokenUsage: number;
  windowStart: number;
}

const RATE_REGISTRY = new Map<string, RateBucket>();

// Default enterprise limits
const DEFAULT_MAX_REQUESTS_PER_MINUTE = 60;
const DEFAULT_WINDOW_MS = 60 * 1000;
const DEFAULT_HOURLY_TOKEN_BUDGET = 200_000;

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
  tokensConsumed?: number;
  tokenBudget?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
  retryAfterSeconds: number;
  tokensUsed: number;
  tokenBudgetRemaining: number;
  error?: string;
}

/**
 * Checks whether a given tenant or IP has quota remaining within the sliding window.
 */
export function checkRateLimit(
  identifier: string,
  options?: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS_PER_MINUTE;
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const tokensConsumed = options?.tokensConsumed ?? 0;
  const tokenBudget = options?.tokenBudget ?? DEFAULT_HOURLY_TOKEN_BUDGET;

  const tenantKey = identifier.trim() || "anonymous";

  let bucket = RATE_REGISTRY.get(tenantKey);
  if (!bucket) {
    bucket = { timestamps: [], tokenUsage: 0, windowStart: now };
    RATE_REGISTRY.set(tenantKey, bucket);
  }

  // Prune timestamps older than windowMs
  const cutoff = now - windowMs;
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > cutoff);

  // Reset hourly token usage if window expired
  if (now - bucket.windowStart > 3600 * 1000) {
    bucket.tokenUsage = 0;
    bucket.windowStart = now;
  }

  const currentCount = bucket.timestamps.length;
  const remaining = Math.max(0, maxRequests - currentCount);
  const oldestTimestamp = bucket.timestamps[0] || now;
  const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

  // Check request count limit
  if (currentCount >= maxRequests) {
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetInSeconds,
      retryAfterSeconds: resetInSeconds,
      tokensUsed: bucket.tokenUsage,
      tokenBudgetRemaining: Math.max(0, tokenBudget - bucket.tokenUsage),
      error: `Rate limit exceeded. Maximum ${maxRequests} requests per ${Math.round(windowMs / 1000)}s reached.`,
    };
  }

  // Check token budget limit
  if (bucket.tokenUsage + tokensConsumed > tokenBudget) {
    return {
      allowed: false,
      limit: maxRequests,
      remaining,
      resetInSeconds: 3600,
      retryAfterSeconds: 3600,
      tokensUsed: bucket.tokenUsage,
      tokenBudgetRemaining: 0,
      error: `Token quota exhausted. Allocated budget of ${tokenBudget.toLocaleString()} tokens exceeded.`,
    };
  }

  // Register this request
  bucket.timestamps.push(now);
  bucket.tokenUsage += tokensConsumed;

  return {
    allowed: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - bucket.timestamps.length),
    resetInSeconds,
    retryAfterSeconds: 0,
    tokensUsed: bucket.tokenUsage,
    tokenBudgetRemaining: Math.max(0, tokenBudget - bucket.tokenUsage),
  };
}

/**
 * Resets the in-memory rate limiting table (primarily for test environments).
 */
export function resetRateLimits(): void {
  RATE_REGISTRY.clear();
}
