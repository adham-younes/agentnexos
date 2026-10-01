export function safeWorkspacePath(value: string | null, locale: "ar" | "en") {
  const fallback = `/${locale}/agentnexos`;
  if (!value || !value.startsWith(`/${locale}/agentnexos`) || value.includes("\\") || /[\r\n]/.test(value)) return fallback;
  try { const url = new URL(value, "https://agentnexos.invalid");return url.origin === "https://agentnexos.invalid" && url.pathname === fallback ? url.pathname + url.search : fallback; } catch { return fallback; }
}
export function validEmail(email:string){return email.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}
export function validCredentials(email: string, password: string) {return validEmail(email)&&password.length>=8&&password.length<=128;}
