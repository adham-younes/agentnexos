'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Command, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from '@/lib/i18n/use-t';
import { LocaleSwitcher } from './locale-switcher';
import { contactEmail, siteOrigin } from '@/lib/site';
import '@/components/auth/login-gateway.css';
type Mode = 'signin' | 'signup' | 'reset' | 'password';
export function LoginGateway() {
    const locale = useLocale(), ar = locale === 'ar', router = useRouter();
    const [mode, setMode] = useState<Mode>('signin'), [visible, setVisible] = useState(false), [busy, setBusy] = useState(false), [notice, setNotice] = useState(''), [success, setSuccess] = useState(false);
    const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
    useEffect(() => { const q = new URLSearchParams(window.location.search); if (q.get('recovery') === '1')
        setMode('password'); if (q.get('error') === 'confirmation')
        setNotice(ar ? 'رابط التأكيد غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا أو سجّل الدخول.' : 'This confirmation link is invalid or expired. Request a new link or sign in.'); }, [ar]);
    function changeMode(next: Mode) { setMode(next); setNotice(''); setSuccess(false); }
    const label = mode === 'signup' ? (ar ? 'إنشاء حساب' : 'Create account') : mode === 'reset' ? (ar ? 'استعادة كلمة المرور' : 'Reset password') : mode === 'password' ? (ar ? 'حفظ كلمة المرور الجديدة' : 'Save new password') : (ar ? 'تسجيل الدخول' : 'Sign in');
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy)
            return;
        setSuccess(false);
        setNotice('');
        if (!configured) {
            setNotice(ar ? 'خدمة الحسابات غير مفعلة في هذه البيئة. يمكنك استخدام المساعد دون حساب.' : 'Accounts are not configured in this environment. You can use the assistant without an account.');
            return;
        }
        const form = new FormData(event.currentTarget), email = String(form.get('email') ?? '').trim(), password = String(form.get('password') ?? '');
        if ((mode === 'signup' || mode === 'password') && password !== String(form.get('confirmPassword'))) {
            setNotice(ar ? 'كلمتا المرور غير متطابقتين.' : 'The passwords do not match.');
            return;
        }
        setBusy(true);
        try {
            const auth = createClient().auth, redirect = `${siteOrigin}/${locale}/auth/callback`;
            if (mode === 'reset') {
                const { error } = await auth.resetPasswordForEmail(email, { redirectTo: `${redirect}?recovery=1` });
                if (error)
                    throw error;
                setSuccess(true);
                setNotice(ar ? 'إذا كان الحساب متاحًا، ستصلك رسالة تتضمن خطوات استعادة كلمة المرور.' : 'If the account is eligible, you will receive password reset instructions.');
                return;
            }
            if (mode === 'password') {
                const { error } = await auth.updateUser({ password });
                if (error)
                    throw error;
                router.replace(`/${locale}/agentnexos`);
                router.refresh();
                return;
            }
            if (mode === 'signup') {
                const { data, error } = await auth.signUp({ email, password, options: { emailRedirectTo: redirect } });
                if (error)
                    throw error;
                if (!data.session) {
                    setSuccess(true);
                    setNotice(ar ? 'راجع بريدك لإكمال التأكيد إذا كان العنوان مؤهلًا للتسجيل. بعد التأكيد يمكنك تسجيل الدخول.' : 'Check your email to complete confirmation if this address is eligible to register. You can sign in after confirmation.');
                    return;
                }
            }
            else {
                const { error } = await auth.signInWithPassword({ email, password });
                if (error)
                    throw error;
            }
            router.replace(`/${locale}/agentnexos`);
            router.refresh();
        }
        catch (error) {
            const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
            const messages: Record<string, [
                string,
                string
            ]> = { invalid_credentials: ['البريد أو كلمة المرور غير صحيحين. أنشئ حسابًا أولًا إذا لم تكن مسجلًا.', 'Incorrect email or password. Create an account first if you have not registered.'], email_not_confirmed: ['أكد بريدك أولًا، ثم سجّل الدخول.', 'Confirm your email before signing in.'], signup_disabled: ['إنشاء الحسابات غير متاح حاليًا. تواصل معنا لطلب الوصول.', 'Registration is currently unavailable. Contact us to request access.'], over_email_send_rate_limit: ['وصلت خدمة البريد إلى حد الإرسال. حاول لاحقًا أو تواصل معنا.', 'The email service reached its sending limit. Try later or contact us.'], weak_password: ['اختر كلمة مرور أقوى تتكون من 8 أحرف على الأقل.', 'Choose a stronger password of at least 8 characters.'], user_already_exists: ['إذا كان لديك حساب بالفعل، انتقل إلى تسجيل الدخول أو استعادة كلمة المرور.', 'If you already have an account, sign in or reset your password.'] };
            setNotice(messages[code]?.[ar ? 0 : 1] ?? (ar ? 'تعذر إكمال الطلب. تحقق من بياناتك واتصالك وحاول لاحقًا.' : 'We could not complete the request. Check your details and connection, then try later.'));
        }
        finally {
            setBusy(false);
        }
    }
    return <div className="login-gateway upgrade-login"><aside className="login-scene"><Link href={`/${locale}`} className="login-brand" dir="ltr"><Command size={27} aria-hidden="true"/>AGYNEXA</Link><div className="login-welcome"><h2>{ar ? 'ابدأ بخطوة واضحة.' : 'Start with a clear next step.'}</h2><p>{ar ? 'حسابك للمساعد. صلاحيات المؤسسة تُحدد داخل مشروعك.' : 'Your account for the assistant. Enterprise access is scoped to your project.'}</p></div></aside><main id="main-content" tabIndex={-1} className="login-main"><div className="login-top"><Link href={`/${locale}`}>{ar ? 'العودة للمنصة' : 'Back to the platform'}</Link><LocaleSwitcher /></div><section className="login-card" aria-labelledby="login-title"><div className="login-emblem"><Command size={30}/></div><h1 id="login-title">{label}</h1><p className="login-subtitle">{ar ? 'أنشئ حسابك أو سجّل الدخول لاستخدام المساعد. لا يمنح الحساب وصولًا إلى أنظمة أي مؤسسة.' : 'Create an account or sign in to use the assistant. An account does not grant access to enterprise systems.'}</p>
 <div className="login-mode" role="group" aria-label={ar ? 'نوع الطلب' : 'Account action'}><button type="button" disabled={busy} aria-pressed={mode === 'signin'} onClick={() => changeMode('signin')}>{ar ? 'تسجيل الدخول' : 'Sign in'}</button><button type="button" disabled={busy} aria-pressed={mode === 'signup'} onClick={() => changeMode('signup')}>{ar ? 'إنشاء حساب' : 'Create account'}</button></div>
 <form onSubmit={submit} key={mode}>{mode !== 'password' && <><label htmlFor="login-email">{ar ? 'البريد الإلكتروني' : 'Email'}</label><div className="login-field"><Mail size={18}/><input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" dir="ltr" required maxLength={254} disabled={busy}/></div></>}{mode !== 'reset' && <><label htmlFor="login-password">{ar ? 'كلمة المرور' : 'Password'}</label><div className="login-field"><LockKeyhole size={18}/><input id="login-password" name="password" type={visible ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required minLength={mode === 'signin' ? undefined : 8} maxLength={256} disabled={busy}/><button type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? (ar ? 'إخفاء كلمة المرور' : 'Hide password') : (ar ? 'إظهار كلمة المرور' : 'Show password')} aria-pressed={visible}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></>}{(mode === 'signup' || mode === 'password') && <><label htmlFor="confirm-password">{ar ? 'تأكيد كلمة المرور' : 'Confirm password'}</label><div className="login-field"><LockKeyhole size={18}/><input id="confirm-password" name="confirmPassword" type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={256} disabled={busy}/></div><p className="login-password-note">{ar ? '8 أحرف على الأقل. لا تستخدم كلمة مرور مشتركة مع حساب آخر.' : 'At least 8 characters. Use a password unique to this account.'}</p></>}
 {mode === 'signin' && <p className="login-help"><button type="button" onClick={() => changeMode('reset')}>{ar ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}</button></p>}<button className="login-submit" type="submit" disabled={busy} aria-busy={busy}>{busy ? <LoaderCircle size={18} className="animate-spin"/> : <>{label}<ArrowRight size={19} className="rtl:rotate-180"/></>}</button>{notice && <p role={success ? 'status' : 'alert'} className="login-notice">{notice}</p>}</form>
 <div className="login-divider"><span>{ar ? 'أو ابدأ دون حساب' : 'or start without an account'}</span></div><Link className="login-public" href={`/${locale}/agentnexos`}>{ar ? 'افتح مساعد تصميم العمليات' : 'Open the workflow design assistant'}<ArrowRight size={16} className="rtl:rotate-180"/></Link><p className="login-access">{ar ? 'للاستفسار عن الوصول، راسل ' : 'For access questions, email '}<a href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a>.</p></section><p className="login-footnote"><ShieldCheck size={17}/><Link href={`/${locale}/privacy`}>{ar ? 'الخصوصية واستخدام البيانات' : 'Privacy and data use'}</Link></p></main></div>;
}
