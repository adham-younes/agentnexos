"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Command, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/use-t";
import { LocaleSwitcher } from "./locale-switcher";
import "@/components/auth/login-gateway.css";

export function LoginGateway() {
  const locale = useLocale(), ar = locale === "ar";
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!configured) { setNotice(ar ? "تسجيل الدخول غير مفعّل في هذه البيئة. يمكنك استخدام مساعد التصميم العام دون حساب." : "Sign-in is not enabled in this environment. You can use the public design assistant without an account."); return; }
    const form = new FormData(event.currentTarget);
    setBusy(true); setNotice("");
    try {
      const { error } = await createClient().auth.signInWithPassword({ email: String(form.get("email")).trim(), password: String(form.get("password")) });
      if (error) { setNotice(ar ? "تعذّر تسجيل الدخول. راجع بيانات حسابك أو تواصل مع فريقك." : "Sign-in failed. Check your account details or contact your team."); return; }
      router.push(`/${locale}/agentnexos`);
    } catch {
      setNotice(ar ? "تعذّر الاتصال بخدمة الحسابات. حاول مرة أخرى لاحقًا." : "The account service could not be reached. Please try again later.");
    } finally { setBusy(false); }
  }
  return <div className="login-gateway">
    <aside className="login-scene">
      <Link href={`/${locale}`} className="login-brand" dir="ltr"><Command aria-hidden="true" size={27}/>AGYNEXA</Link>
      <div className="login-welcome"><h2>{ar ? <>مرحبًا<br/>{" "}بعودتك.</> : <>Welcome<br/>{" "}back.</>}</h2><p>{ar ? "مساحة واضحة لتصميم خطوتك التالية." : "A clear space to design your next step."}</p></div>
      <span className="login-copyright" dir="ltr">© 2026 AGYNEXA</span>
    </aside>
    <main id="main-content" tabIndex={-1} className="login-main">
      <div className="login-top"><Link href={`/${locale}`}>{ar ? "العودة للمنصة" : "Back to the platform"}</Link><LocaleSwitcher/></div>
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-emblem"><Command size={32} aria-hidden="true"/></div>
        <h1 id="login-title">{ar ? "تسجيل الدخول" : "Login"}</h1>
        <p className="login-subtitle">{ar ? "ادخل إلى حسابك للمتابعة" : "Sign in to your account to continue"}</p>
        <form onSubmit={signIn}>
          <label htmlFor="login-email">{ar ? "البريد الإلكتروني" : "Email address"}</label>
          <div className="login-field"><Mail size={19} aria-hidden="true"/><input id="login-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" dir="ltr" required maxLength={254} disabled={busy}/></div>
          <label htmlFor="login-password">{ar ? "كلمة المرور" : "Password"}</label>
          <div className="login-field"><LockKeyhole size={19} aria-hidden="true"/><input id="login-password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" required maxLength={256} placeholder="••••••••" disabled={busy}/><button type="button" onClick={() => setVisible(value => !value)} aria-label={visible ? (ar ? "إخفاء كلمة المرور" : "Hide password") : (ar ? "إظهار كلمة المرور" : "Show password")} aria-pressed={visible}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
          <p className="login-help">{ar ? "تحتاج مساعدة؟ " : "Need help? "}<Link href={`/${locale}/start`}>{ar ? "تواصل مع الفريق" : "Contact the team"}</Link></p>
          <button className="login-submit" type="submit" disabled={busy} aria-busy={busy} aria-label={ar ? "تسجيل الدخول" : "Login"}>{busy ? <LoaderCircle size={18} className="animate-spin"/> : <>{ar ? "تسجيل الدخول" : "Login"}<ArrowRight size={19} className="rtl:rotate-180" aria-hidden="true"/></>}</button>
          {notice && <p role="alert" className="login-notice">{notice}</p>}
        </form>
        <div className="login-divider"><span>{ar ? "أو ابدأ دون حساب" : "or start without an account"}</span></div>
        <Link className="login-public" href={`/${locale}/agentnexos`}>{ar ? "افتح مساعد تصميم الأنظمة" : "Open the system design assistant"}<ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true"/></Link>
        <p className="login-access">{ar ? "تبدأ مشروعًا جديدًا؟ " : "Starting a new project? "}<Link href={`/${locale}/start`}>{ar ? "جهّز موجز مشروعك" : "Prepare your brief"}</Link></p>
      </section>
      <p className="login-footnote"><ShieldCheck size={17} aria-hidden="true"/>{ar ? "حافظ على سرية بيانات حسابك." : "Keep your account details private."}<Link href={`/${locale}/privacy`}>{ar ? "الخصوصية" : "Privacy"}</Link></p>
    </main>
  </div>;
}
