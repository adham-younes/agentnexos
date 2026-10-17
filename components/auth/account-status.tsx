'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n/config';
import { publicPath } from '@/lib/i18n/routing';
import { useAccount } from '@/lib/auth/account-state';
export function AccountStatus({ locale }: {
    locale: Locale;
}) {
    const { ready, user } = useAccount();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(false);
    const ar = locale === 'ar';
    async function signOut() {
        setBusy(true);
        setError(false);
        try {
            window.dispatchEvent(new Event('agynexa:account-changing'));
            const { error: signOutError } = await createClient().auth.signOut({ scope: 'local' });
            if (signOutError)
                setError(true);
        }
        catch {
            setError(true);
        }
        finally {
            setBusy(false);
        }
    }
    if (!ready) return <span role="status">{ar ? 'جارٍ التحقق من الحساب…' : 'Checking account…'}</span>;
    if (!user) {
        return <Link href={publicPath('/login')} prefetch={false}>{ar ? 'تسجيل الدخول / إنشاء حساب' : 'Sign in / Create account'}</Link>;
    }
    return <div className="workspace-account">
    <span dir="ltr">{user.email}</span>
    <button type="button" disabled={busy} onClick={() => void signOut()}>{busy ? (ar ? 'جارٍ الخروج…' : 'Signing out…') : (ar ? 'الخروج من هذا الجهاز' : 'Sign out on this device')}</button>
    {error && <p role="alert">{ar ? 'تعذر تسجيل الخروج. حاول لاحقًا.' : 'Sign out failed. Try later.'}</p>}
  </div>;
}
