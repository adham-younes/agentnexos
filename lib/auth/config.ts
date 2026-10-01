export function authConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.AGENTNEXOS_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try { if (new URL(url).hostname !== "ruereqpvykwnakcnmxha.supabase.co") return null; } catch { return null; }
  return { url, key };
}
