import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { authConfig } from "./config";
export { authConfig } from "./config";
export async function authClient() {
  const config = authConfig();
  if (!config) return null;
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) },
    cookies: { getAll: () => store.getAll(), setAll(items) {
      try { items.forEach(({ name, value, options }) => store.set(name, value, options)); }
      catch { /* Server Components rely on proxy to refresh cookies. */ }
    } },
  });
}
export async function authenticatedUser() {
  try {
    const client = await authClient();
    if (!client) return null;
    const { data, error } = await client.auth.getUser();
    if (error || !data.user || data.user.is_anonymous || !data.user.email_confirmed_at) return null;
    return { client, user: data.user };
  } catch { return null; }
}
