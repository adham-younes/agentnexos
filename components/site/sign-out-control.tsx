"use client";
import { useActionState } from 'react';
import { signOut,type LogoutState } from '@/app/[locale]/login/actions';
import type { Locale } from '@/lib/i18n/config';
export function SignOutControl({locale}:{locale:Locale}){const ar=locale==='ar';const [state,action,pending]=useActionState<LogoutState,FormData>(signOut,{failed:false});return <form action={action}><input type="hidden" name="locale" value={locale}/><button disabled={pending} type="submit" className="min-h-11 rounded-lg border border-border px-3 text-xs hover:bg-secondary disabled:opacity-50">{ar?(pending?'جارٍ الخروج…':'خروج'):(pending?'Signing out…':'Sign out')}</button>{state.failed&&<p role="alert" className="max-w-48 text-xs leading-6 text-muted-foreground">{ar?'تعذر إنهاء الجلسة. أعد المحاولة.':'The session could not be ended. Try again.'}</p>}</form>;}
