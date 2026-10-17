'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Command, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from '@/lib/i18n/use-t';
import { publicPath } from '@/lib/i18n/routing';
import { accountDestination } from '@/lib/auth/redirect';
import { LocaleSwitcher } from './locale-switcher';
import { contactEmail, siteOrigin } from '@/lib/site';
import '@/components/auth/login-gateway.css';

type Mode = 'signin' | 'signup' | 'reset' | 'password' | 'confirm';
export function LoginGateway() {
  const locale = useLocale(), ar = locale === 'ar', router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [visible, setVisible] = useState(false), [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(''), [success, setSuccess] = useState(false);
  const [email, setEmail] = useState(''), [cooldown, setCooldown] = useState(0);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    let active = true;
    if (query.get('mode') === 'signup') setMode('signup');
    if (query.get('recovery') === '1') {
      setMode('password');
      if (configured) void createClient().auth.getUser().then(({ data, error }) => {
        if (!active) return;
        setRecoveryReady(!error && Boolean(data.user));
        if (error || !data.user) setNotice(ar ? 'انتهت جلسة الاستعادة أو تعذر التحقق منها. اطلب رابط استعادة جديدًا.' : 'The recovery session expired or could not be verified. Request a new reset link.');
      }).catch(() => { if (active) setNotice(ar ? 'تعذر التحقق من رابط الاستعادة. تحقق من اتصالك ثم اطلب رابطًا جديدًا.' : 'The recovery link could not be verified. Check your connection and request a new link.'); });
    }
    if (query.has('error')) setNotice(ar ? 'رابط التأكيد غير صالح أو منتهي، أو تعذر الاتصال بخدمة الحسابات. افتح الرابط في المتصفح الذي طلبته منه، أو اطلب رابطًا جديدًا.' : 'The confirmation link is invalid or expired, or the account service could not be reached. Open it in the browser where you requested it, or request a new link.');
    return () => { active = false; };
  }, [ar, configured]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  function changeMode(next: Mode) { setMode(next); setVisible(false); setNotice(''); setSuccess(false); }
  const labels: Record<Mode, string> = {
    signin: ar ? 'تسجيل الدخول' : 'Sign in', signup: ar ? 'إنشاء حساب' : 'Create account',
    reset: ar ? 'استعادة كلمة المرور' : 'Reset password', password: ar ? 'حفظ كلمة المرور الجديدة' : 'Save new password',
    confirm: ar ? 'تأكيد البريد الإلكتروني' : 'Confirm your email',
  };
  function destination() { return accountDestination(new URLSearchParams(window.location.search).get('next')); }
  function callback(recovery = false) {
    const url = new URL('/auth/callback', siteOrigin);
    url.searchParams.set('lang', locale);
    url.searchParams.set('next', destination());
    if (recovery) url.searchParams.set('recovery', '1');
    return url.toString();
  }
  function finish() { router.replace(destination()); router.refresh(); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || (mode === 'confirm' && cooldown > 0)) return;
    setSuccess(false); setNotice('');
    if (!configured) { setNotice(ar ? 'خدمة الحسابات غير متاحة حاليًا. يمكنك متابعة المحادثة كزائر.' : 'Accounts are currently unavailable. You can continue as a guest.'); return; }
    const form = new FormData(event.currentTarget), password = String(form.get('password') ?? '');
    if ((mode === 'signup' || mode === 'password') && password !== String(form.get('confirmPassword'))) {
      setNotice(ar ? 'كلمتا المرور غير متطابقتين.' : 'The passwords do not match.'); return;
    }
    if (mode === 'password' && !recoveryReady) { setNotice(ar ? 'اطلب رابط استعادة جديدًا قبل تغيير كلمة المرور.' : 'Request a new recovery link before changing your password.'); return; }
    setBusy(true);
    try {
      const auth = createClient().auth;
      if (mode === 'reset') {
        const { error } = await auth.resetPasswordForEmail(email.trim(), { redirectTo: callback(true) });
        if (error) throw error;
        setSuccess(true); setCooldown(60);
        setNotice(ar ? 'إذا كان العنوان مؤهلًا، ستصلك تعليمات الاستعادة. افتح الرابط في هذا المتصفح.' : 'If the address is eligible, you will receive reset instructions. Open the link in this browser.');
      } else if (mode === 'confirm') {
        const { error } = await auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: callback() } });
        if (error) throw error;
        setSuccess(true); setCooldown(60);
        setNotice(ar ? 'إذا كان العنوان مؤهلًا، ستصلك رسالة تأكيد. افتح الرابط في هذا المتصفح، ثم تابع إلى المساعد.' : 'If the address is eligible, you will receive a confirmation email. Open the link in this browser, then continue to the assistant.');
      } else if (mode === 'password') {
        const { error } = await auth.updateUser({ password });
        if (error) throw error;
        finish();
      } else if (mode === 'signup') {
        const { data, error } = await auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: callback() } });
        if (error) throw error;
        if (data.session) finish();
        else {
          setMode('confirm'); setSuccess(true); setCooldown(60);
          setNotice(ar ? 'إذا كان العنوان مؤهلًا، راجع بريدك لتأكيد الحساب. افتح رابط التأكيد في هذا المتصفح. لم تُحفظ أي محادثة تلقائيًا.' : 'If the address is eligible, check your email to confirm your account. Open the confirmation link in this browser. No conversation has been saved automatically.');
        }
      } else {
        const { error } = await auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        finish();
      }
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
      const messages: Record<string, [string, string]> = {
        invalid_credentials: ['البريد أو كلمة المرور غير صحيحين.', 'Incorrect email or password.'],
        email_not_confirmed: ['أكد بريدك أولًا. يمكنك طلب رسالة تأكيد جديدة أدناه.', 'Confirm your email first. You can request a new confirmation below.'],
        signup_disabled: ['إنشاء الحسابات غير متاح حاليًا. يمكنك المتابعة كزائر أو التواصل معنا.', 'Registration is currently unavailable. Continue as a guest or contact us.'],
        over_email_send_rate_limit: ['وصلت خدمة البريد إلى حد الإرسال. حاول لاحقًا.', 'The email service reached its sending limit. Try later.'],
        over_request_rate_limit: ['طلبات كثيرة في وقت قصير. انتظر ثم حاول مجددًا.', 'Too many requests. Wait before trying again.'],
        weak_password: ['اختر كلمة مرور أقوى تتكون من 8 أحرف على الأقل.', 'Choose a stronger password with at least 8 characters.'],
        same_password: ['اختر كلمة مرور مختلفة عن كلمة المرور الحالية.', 'Choose a password different from the current one.'],
        user_already_exists: ['إذا كان لديك حساب، سجّل الدخول أو استعد كلمة المرور.', 'If you already have an account, sign in or reset your password.'],
        session_not_found: ['انتهت الجلسة. سجّل الدخول أو اطلب رابط استعادة جديدًا.', 'Your session expired. Sign in or request a new recovery link.'],
      };
      setNotice(messages[code]?.[ar ? 0 : 1] ?? (ar ? 'تعذر إكمال الطلب. تحقق من بياناتك واتصالك وحاول لاحقًا.' : 'We could not complete the request. Check your details and connection, then try later.'));
    } finally { setBusy(false); }
  }
  const waiting = (mode === 'confirm' || mode === 'reset') && cooldown > 0;
  return <div className="login-gateway upgrade-login">
    <aside className="login-scene">
      <Link href={publicPath('/')} className="login-brand" dir="ltr"><Command size={27} aria-hidden="true"/>AGYNEXA</Link>
      <div className="login-welcome"><h2>{ar ? 'ابدأ محادثة. وابنِ عليها.' : 'Start a conversation. Build on it.'}</h2><p>{ar ? 'ابدأ كزائر، أو أنشئ حسابًا لحفظ محادثاتك الخاصة والعودة إليها.' : 'Start as a guest, or create an account to save and revisit your private conversations.'}</p></div>
    </aside>
    <main id="main-content" tabIndex={-1} className="login-main">
      <div className="login-top"><Link href={publicPath('/')}>{ar ? 'العودة للمنصة' : 'Back to the platform'}</Link><LocaleSwitcher/></div>
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-emblem"><Command size={30} aria-hidden="true"/></div><h1 id="login-title">{labels[mode]}</h1>
        <p className="login-subtitle">{ar ? 'الحساب اختياري. احفظ ما تختاره من محادثاتك، وافتحه أو احذفه لاحقًا. لا يمنح الحساب وصولًا إلى أنظمة المؤسسات.' : 'An account is optional. Save conversations you choose, reopen them, or delete them later. Accounts do not grant enterprise-system access.'}</p>
        <div className="login-mode" role="group" aria-label={ar ? 'نوع الطلب' : 'Account action'}>
          <button type="button" disabled={busy} aria-pressed={mode === 'signin'} onClick={() => changeMode('signin')}>{labels.signin}</button>
          <button type="button" disabled={busy} aria-pressed={mode === 'signup'} onClick={() => changeMode('signup')}>{labels.signup}</button>
        </div>
        <form onSubmit={submit} key={mode}>
          {mode !== 'password' && <><label htmlFor="login-email">{ar ? 'البريد الإلكتروني' : 'Email'}</label><div className="login-field"><Mail size={18} aria-hidden="true"/><input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" dir="ltr" value={email} onChange={event => setEmail(event.target.value)} required maxLength={254} disabled={busy}/></div></>}
          {!['reset', 'confirm'].includes(mode) && <><label htmlFor="login-password">{ar ? 'كلمة المرور' : 'Password'}</label><div className="login-field"><LockKeyhole size={18} aria-hidden="true"/><input id="login-password" name="password" type={visible ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required minLength={mode === 'signin' ? undefined : 8} maxLength={256} disabled={busy}/><button type="button" onClick={() => setVisible(value => !value)} disabled={busy} aria-label={visible ? (ar ? 'إخفاء كلمة المرور' : 'Hide password') : (ar ? 'إظهار كلمة المرور' : 'Show password')} aria-pressed={visible}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></>}
          {(mode === 'signup' || mode === 'password') && <><label htmlFor="confirm-password">{ar ? 'تأكيد كلمة المرور' : 'Confirm password'}</label><div className="login-field"><LockKeyhole size={18} aria-hidden="true"/><input id="confirm-password" name="confirmPassword" type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={256} disabled={busy}/></div><p className="login-password-note">{ar ? '8 أحرف على الأقل. استخدم كلمة مرور خاصة بهذا الحساب.' : 'At least 8 characters. Use a password unique to this account.'}</p></>}
          {mode === 'signin' && <p className="login-help"><button type="button" disabled={busy} onClick={() => changeMode('reset')}>{ar ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}</button></p>}
          <button className="login-submit" type="submit" disabled={busy || waiting || (mode === 'password' && !recoveryReady)} aria-busy={busy}>{busy ? <><LoaderCircle size={18} className="animate-spin" aria-hidden="true"/><span>{labels[mode]}…</span></> : <>{waiting ? `${ar ? 'انتظر' : 'Wait'} ${cooldown}${ar ? ' ثانية' : 's'}` : mode === 'confirm' ? (ar ? 'إعادة إرسال التأكيد' : 'Resend confirmation') : labels[mode]}<ArrowRight size={19} className="rtl:rotate-180" aria-hidden="true"/></>}</button>
          {notice && <p role={success ? 'status' : 'alert'} className="login-notice">{notice}</p>}
          <div className="login-recovery-actions">
            {mode !== 'confirm' && mode !== 'signup' && <button type="button" disabled={busy} onClick={() => changeMode('confirm')}>{ar ? 'طلب رسالة تأكيد' : 'Request confirmation email'}</button>}
            {(mode === 'password' || mode === 'confirm') && <button type="button" disabled={busy} onClick={() => changeMode('reset')}>{ar ? 'طلب رابط استعادة' : 'Request password reset'}</button>}
          </div>
        </form>
        <div className="login-divider"><span>{ar ? 'أو تابع دون حساب' : 'or continue without an account'}</span></div>
        <Link className="login-public" href={publicPath('/agentnexos')} prefetch={false}>{ar ? 'ابدأ محادثة كزائر' : 'Start a guest conversation'}<ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true"/></Link>
        <p className="login-access">{ar ? 'للمساعدة، راسل ' : 'For help, email '}<a href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a>.</p>
      </section>
      <p className="login-footnote"><ShieldCheck size={17} aria-hidden="true"/><Link href={publicPath('/privacy')}>{ar ? 'الخصوصية واستخدام البيانات' : 'Privacy and data use'}</Link></p>
    </main>
  </div>;
}
