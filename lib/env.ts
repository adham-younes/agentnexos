/**
 * Typed environment access — server-only.
 *
 * Rules:
 * - Never log or return secret VALUES. This module only reports presence/shape.
 * - Secrets are read from the runtime environment (Vercel in production).
 *   They are never committed and never exposed to the browser.
 * - Public values must be prefixed NEXT_PUBLIC_ to reach the client.
 */

function readOptional(key: string): string | undefined {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

export type SupabaseConfig = {
  url: string;
  publishableKey: string;
  secretKey?: string;
};

/**
 * Resolves Supabase config from either the current key naming
 * (PUBLISHABLE_KEY / SECRET_KEY) or the legacy aliases (ANON_KEY / SERVICE_ROLE_KEY).
 */
export function getSupabaseConfig(): SupabaseConfig | null {
  const url =
    readOptional("NEXT_PUBLIC_SUPABASE_URL") ?? readOptional("SUPABASE_URL");
  const publishableKey =
    readOptional("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    readOptional("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readOptional("SUPABASE_PUBLISHABLE_KEY") ??
    readOptional("SUPABASE_ANON_KEY");
  const secretKey =
    readOptional("SUPABASE_SECRET_KEY") ??
    readOptional("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !publishableKey) return null;
  return { url, publishableKey, secretKey };
}

export function hasSupabase(): boolean {
  return getSupabaseConfig() !== null;
}

/** The deterministic agent path must work with no model credentials. */
export function getGroqKey(): string | undefined {
  return (
    readOptional("GROQ_API_KEY") ??
    readOptional("GROQ_API_KEY1") ??
    readOptional("GROQ_API_KEY2")
  );
}

export function hasModelLayer(): boolean {
  return getGroqKey() !== undefined;
}

export function getSiteUrl(): string {
  return readOptional("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";
}

/** Placeholder template sections (unverified claims) are hidden by default. */
export function showPlaceholderSections(): boolean {
  return readOptional("NEXT_PUBLIC_SHOW_PLACEHOLDER_SECTIONS") === "true";
}

/**
 * Non-secret diagnostics for logs and the README. Never includes values.
 */
export function describeEnv(): Record<string, string> {
  return {
    supabase: hasSupabase() ? "configured" : "absent",
    supabaseSecret: getSupabaseConfig()?.secretKey ? "present" : "absent",
    modelLayer: hasModelLayer() ? "configured" : "absent (deterministic path)",
    siteUrl: getSiteUrl(),
    placeholderSections: showPlaceholderSections() ? "shown" : "hidden",
  };
}
