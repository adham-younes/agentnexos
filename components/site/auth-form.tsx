"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticate, type AuthState } from "@/app/[locale]/login/actions";
import type { Locale } from "@/lib/i18n/config";

export function AuthForm({locale,configured}:{locale:Locale;configured:boolean}) {
  const ar=locale==="ar",[mode,setMode]=useState<"login"|"signup">("login");
  const [state,action,pending]=useActionState<AuthState,FormData>(authenticate,{code:"idle"});
  const messages={invalid:ar?"أدخل بريدًا صحيحًا وكلمة مرور من 8 إلى 128 حرفًا.":"Enter a valid email and a password of 8–128 characters.",unavailable:ar?"تعذر الاتصال بخدمة الحسابات. حاول لاحقًا.":"The account service could not be reached. Try again later.",failed:ar?"لم يكتمل الطلب. تحقق من البيانات وتأكيد البريد، ثم حاول مجددًا.":"The request could not complete. Check your details and email confirmation, then try again.",confirmation:ar?"تمت معالجة طلب التسجيل. إذا كان البريد مؤهلًا، ستصلك رسالة لتأكيد الحساب. لا يمكنك دخول الوكيل قبل التأكيد. تحقق من البريد غير المرغوب فيه أيضًا.":"Your registration request was processed. If the email is eligible, you will receive an account confirmation message. Confirm it before opening the workspace, and check your spam folder.",rate_limited:ar?"طلبات كثيرة لخدمة الحسابات. انتظر قليلًا قبل المحاولة.":"Too many account requests. Wait before trying again."};
  return <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8">
    <h1 className="text-2xl font-semibold">{ar?(mode==="login"?"أهلًا بعودتك":"أنشئ حساب مساحة الوكيل"):(mode==="login"?"Welcome back":"Create your workspace account")}</h1>
    <p className="mt-3 text-sm leading-7 text-muted-foreground">{ar?"الحساب مطلوب لمساحة الوكيل فقط. تقدر تستكشف الموقع والخدمات بدون تسجيل.":"An account is required only for the agent workspace. Explore the website and services without signing in."}</p>
    <form action={action} className="mt-7 flex flex-col gap-5"><input type="hidden" name="locale" value={locale}/><input type="hidden" name="mode" value={mode}/>
      <div className="flex flex-col gap-2"><Label htmlFor="auth-email">{ar?"البريد الإلكتروني":"Email address"}</Label><Input id="auth-email" name="email" type="email" dir="ltr" autoComplete="email" maxLength={254} required className="min-h-12"/></div>
      <div className="flex flex-col gap-2"><Label htmlFor="auth-password">{ar?"كلمة المرور":"Password"}</Label><Input id="auth-password" name="password" type="password" dir="ltr" autoComplete={mode==="login"?"current-password":"new-password"} minLength={8} maxLength={128} required className="min-h-12"/>{mode==="signup"&&<p className="text-xs leading-6 text-muted-foreground">{ar?"استخدم كلمة مرور قوية وفريدة. تأكيد البريد مطلوب.":"Use a strong, unique password. Email confirmation is required."}</p>}</div>
      {!configured&&<p role="alert" className="text-sm leading-7 text-muted-foreground">{messages.unavailable}</p>}
      {state.code!=="idle"&&<p role={state.code==="confirmation"?"status":"alert"} className="rounded-lg border border-border bg-secondary p-4 text-sm leading-7">{messages[state.code]}</p>}
      <Button disabled={pending||!configured} type="submit" size="lg" className="min-h-12">{pending?<LoaderCircle className="animate-spin"/>:<ArrowRight className="rtl:rotate-180"/>}{ar?(mode==="login"?"تسجيل الدخول":"إنشاء الحساب"):(mode==="login"?"Sign in":"Create account")}</Button>
    </form>
    <button type="button" disabled={pending} onClick={()=>setMode(mode==="login"?"signup":"login")} className="mt-5 min-h-11 text-sm text-primary hover:underline">{ar?(mode==="login"?"أول مرة هنا؟ أنشئ حسابًا":"عندك حساب؟ سجل الدخول"):(mode==="login"?"New here? Create an account":"Already have an account? Sign in")}</button>
    <p className="mt-5 border-t border-border pt-5 text-xs leading-6 text-muted-foreground">{ar?"باستخدام المساحة، راجع ":"Before using the workspace, review the "}<Link href={`/${locale}/privacy`} className="underline">{ar?"الخصوصية":"privacy policy"}</Link>{ar?" و":" and "}<Link href={`/${locale}/demo-policy`} className="underline">{ar?"سياسة التجربة":"preview policy"}</Link>.</p>
  </div>;
}
