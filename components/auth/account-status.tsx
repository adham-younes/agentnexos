'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n/config';
export function AccountStatus({ locale }: {
    locale: Locale;
}) {
    const [email, setEmail] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(false);
    const ar = locale === 'ar';
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
            return;
        const client = createClient();
        let active = true;
        void client.auth.getUser().then(({ data }) => {
            if (active)
                setEmail(data.user?.email ?? null);
        }).catch(() => { });
        const { data } = client.auth.onAuthStateChange((_event, session) => {
            if (active)
                setEmail(session?.user?.email ?? null);
        });
        return () => {
            active = false;
            data.subscription.unsubscribe();
        };
    }, []);
    async function signOut() {
        setBusy(true);
        setError(false);
        try {
            const { error: signOutError } = await createClient().auth.signOut();
            if (signOutError)
                setError(true);
            else
                setEmail(null);
        }
        catch {
            setError(true);
        }
        finally {
            setBusy(false);
        }
    }
    if (!email) {
        return <Link href={`/${locale}/login`}>{ar ? 'تسجيل الدخول / إنشاء حساب' : 'Sign in / Create account'}</Link>;
    }
    return <div className="workspace-account">
    <span dir="ltr">{email}</span>
    <button type="button" disabled={busy} onClick={() => void signOut()}>{ar ? 'تسجيل الخروج' : 'Sign out'}</button>
    {error && <p role="alert">{ar ? 'تعذر تسجيل الخروج. حاول لاحقًا.' : 'Sign out failed. Try later.'}</p>}
  </div>;
}
