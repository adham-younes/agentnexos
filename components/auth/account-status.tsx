'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {createClient} from '@/lib/supabase/client';
import type {Locale} from '@/lib/i18n/config';
export function AccountStatus({locale}:{locale:Locale}){
 const [email,setEmail]=useState<string|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(false);const ar=locale==='ar';
 useEffect(()=>{if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return;const client=createClient();let active=true;client.auth.getUser().then(({data})=>{if(active)setEmail(data.user?.email??null)});const {data}=client.auth.onAuthStateChange((_event,session)=>{if(active)setEmail(session?.user?.email??null)});return()=>{active=false;data.subscription.unsubscribe()};},[]);
 if(!email)return <Link href={`/${locale}/login`}>{ar?'تسجيل الدخول / إنشاء حساب':'Sign in / Create account'}</Link>;
 return <div className="workspace-account"><span dir="ltr">{email}</span><button type="button" disabled={busy} onClick={async()=>{setBusy(true);setError(false);try{const {error}=await createClient().auth.signOut();if(error)setError(true);else setEmail(null);}catch{setError(true)}finally{setBusy(false)}}>{ar?'تسجيل الخروج':'Sign out'}</button>{error&&<p role="alert">{ar?'تعذر تسجيل الخروج. حاول لاحقًا.':'Sign out failed. Try later.'}</p>}</div>;
}
