/**
 * Structured Telemetry, Incident Recovery & Observability Logger
 * Provides correlation-tagged logging (runId, stepId, organizationId), latency tracking,
 * error classification, and automated self-healing fallback hooks.
 */

export interface TelemetryEvent {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error" | "security";
  correlationId: string; // runId
  stepId?: string;
  organizationId: string;
  action: string;
  latencyMs?: number;
  tokensEstimated?: number;
  guardStatus?: "passed" | "blocked" | "sanitized";
  errorCategory?:
    | "PROMPT_INJECTION"
    | "RATE_LIMIT"
    | "SSRF_ATTEMPT"
    | "UPSTREAM_TIMEOUT"
    | "MODEL_DEGRADED"
    | "INTERNAL";
  metadata?: Record<string, unknown>;
}

const TELEMETRY_BUFFER: TelemetryEvent[] = [];
const MAX_BUFFER_SIZE = 1000;

/**
 * Appends a structured telemetry event to memory and outputs structured JSON for production observability.
 */
export function recordTelemetry(event: Omit<TelemetryEvent, "timestamp">): TelemetryEvent {
  const fullEvent: TelemetryEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  TELEMETRY_BUFFER.push(fullEvent);
  if (TELEMETRY_BUFFER.length > MAX_BUFFER_SIZE) {
    TELEMETRY_BUFFER.shift();
  }

  // Structured log for cloud log ingestors (e.g. Datadog, CloudWatch, Vercel Log Drains)
  if (process.env.NODE_ENV !== "test") {
    const logMethod = fullEvent.level === "error" || fullEvent.level === "security" ? console.error : console.log;
    logMethod(`[TELEMETRY] ${JSON.stringify(fullEvent)}`);
  }

  return fullEvent;
}

/**
 * Retrieves recent telemetry events, optionally filtered by correlationId or organizationId.
 */
export function getTelemetryLogs(filter?: { correlationId?: string; organizationId?: string }): TelemetryEvent[] {
  return TELEMETRY_BUFFER.filter((e) => {
    if (filter?.correlationId && e.correlationId !== filter.correlationId) return false;
    if (filter?.organizationId && e.organizationId !== filter.organizationId) return false;
    return true;
  });
}

/**
 * Clears telemetry buffer (test utility).
 */
export function clearTelemetryLogs(): void {
  TELEMETRY_BUFFER.length = 0;
}

export interface ErrorClassification {
  category: "PROMPT_INJECTION" | "RATE_LIMIT" | "SSRF_ATTEMPT" | "UPSTREAM_TIMEOUT" | "MODEL_DEGRADED" | "INTERNAL";
  recoverable: boolean;
  safeMessage: string;
}

/**
 * Categorizes runtime exceptions and determines if safe deterministic recovery is possible.
 */
export function classifyRuntimeError(error: unknown): ErrorClassification {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (message.includes("prompt injection") || message.includes("delimiter") || message.includes("jailbreak")) {
    return {
      category: "PROMPT_INJECTION",
      recoverable: false,
      safeMessage: "Security boundary rejected prompt due to unsafe policy violation.",
    };
  }

  if (message.includes("rate limit") || message.includes("429") || message.includes("too many requests")) {
    return {
      category: "RATE_LIMIT",
      recoverable: true,
      safeMessage: "Operational throughput cap reached. Requests throttled gracefully.",
    };
  }

  if (message.includes("ssrf") || message.includes("private network") || message.includes("loopback") || message.includes("metadata")) {
    return {
      category: "SSRF_ATTEMPT",
      recoverable: false,
      safeMessage: "Destination blocked by network isolation perimeter.",
    };
  }

  if (message.includes("timeout") || message.includes("etimedout") || message.includes("abort")) {
    return {
      category: "UPSTREAM_TIMEOUT",
      recoverable: true,
      safeMessage: "Upstream reasoning model timed out. Deterministic fallback engaged.",
    };
  }

  if (message.includes("groq") || message.includes("503") || message.includes("502")) {
    return {
      category: "MODEL_DEGRADED",
      recoverable: true,
      safeMessage: "Primary AI model tier unavailable. System safely downgraded to verified local rule base.",
    };
  }

  return {
    category: "INTERNAL",
    recoverable: false,
    safeMessage: "An internal operational error occurred. Details captured in audit log.",
  };
}
