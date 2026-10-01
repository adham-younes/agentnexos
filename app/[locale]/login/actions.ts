"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth/server";
import { validCredentials,validEmail,safeWorkspacePath } from "@/lib/auth/validation";
import { isLocale } from "@/lib/i18n/config";

export type AuthState = { code: "idle" | "invalid" | "unavailable" | "failed" | "confirmation" | "email_sent" | "rate_limited" };
export async function authenticate(_state: AuthState, data: FormData): Promise<AuthState> {
  const locale=String(data.get("locale"));if (!isLocale(locale)) return {code:"invalid"};
  const email=String(data.get("email")||"").trim(),password=String(data.get("password")||"");
  const mode=data.get("mode");
  if (!(mode==="reset"?validEmail(email):validCredentials(email,password)) || !["login","signup","reset"].includes(String(mode))) return {code:"invalid"};
  const client=await authClient();if (!client) return {code:"unavailable"};
  try {
    if(mode==="reset") {
      const origin=(await headers()).get("origin");
      const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:origin?`${origin}/auth/callback?locale=${locale}&recovery=1`:undefined});
      if(error)return {code:error.status===429?"rate_limited":"failed"};return {code:"email_sent"};
    }
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
  redirect(safeWorkspacePath(String(data.get("next")||""),locale));
}
export type LogoutState={failed:boolean};
export async function signOut(_state:LogoutState,data:FormData):Promise<LogoutState> {
  const locale=data.get("locale")==="en"?"en":"ar";
  try {const client=await authClient();if(!client)return {failed:true};const {error}=await client.auth.signOut({scope:"local"});if(error)return {failed:true};}catch{return {failed:true};}
  redirect(`/${locale}/login`);
}
