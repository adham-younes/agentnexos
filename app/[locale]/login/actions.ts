"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth/server";
import { validCredentials } from "@/lib/auth/validation";
import { isLocale } from "@/lib/i18n/config";

export type AuthState = { code: "idle" | "invalid" | "unavailable" | "failed" | "confirmation" | "rate_limited" };
export async function authenticate(_state: AuthState, data: FormData): Promise<AuthState> {
  const locale=String(data.get("locale"));if (!isLocale(locale)) return {code:"invalid"};
  const email=String(data.get("email")||"").trim(),password=String(data.get("password")||"");
  const mode=data.get("mode");
  if (!validCredentials(email,password) || !["login","signup"].includes(String(mode))) return {code:"invalid"};
  const client=await authClient();if (!client) return {code:"unavailable"};
  try {
    if (mode==="signup") {
      const origin=(await headers()).get("origin");
      const {data:result,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:origin ? `${origin}/auth/callback?locale=${locale}` : undefined}});
      if (error) return {code:error.status===429?"rate_limited":"failed"};
      if (!result.session) return {code:"confirmation"};
    } else {
      const {error}=await client.auth.signInWithPassword({email,password});
      if(error) return {code:error.status===429?"rate_limited":"failed"};
    }
  } catch {return {code:"unavailable"};}
  redirect(`/${locale}/agentnexos`);
}
export async function signOut(data: FormData) {
  const locale=data.get("locale")==="en"?"en":"ar";
  const client=await authClient();
  if(client){const {error}=await client.auth.signOut();if(error)throw new Error("SIGN_OUT_FAILED");}
  redirect(`/${locale}/login`);
}
