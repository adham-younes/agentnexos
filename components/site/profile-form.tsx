"use client";
import { useActionState } from 'react';
import { updateProfile,type ProfileState } from '@/app/[locale]/account/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/lib/i18n/config';
export function ProfileForm({locale,name}:{locale:Locale;name:string}){const ar=locale==='ar';const [state,action,pending]=useActionState<ProfileState,FormData>(updateProfile,{code:'idle'});return <form action={action} className="mt-8 space-y-5"><input type="hidden" name="locale" value={locale}/><Label htmlFor="profile-name">{ar?'الاسم المعروض (اختياري)':'Display name (optional)'}</Label><Input id="profile-name" name="name" defaultValue={name} maxLength={100} autoComplete="name" className="min-h-12"/><Button type="submit" disabled={pending}>{ar?(pending?'جارٍ الحفظ…':'حفظ الاسم'):(pending?'Saving…':'Save name')}</Button>{state.code!=='idle'&&<p role={state.code==='saved'?'status':'alert'} className="text-sm leading-7 text-muted-foreground">{state.code==='saved'?(ar?'تم حفظ الاسم.':'Name saved.'):state.code==='invalid'?(ar?'الاسم لا يزيد عن 100 حرف.':'Use at most 100 characters.'):(ar?'تعذر حفظ التغيير. تحقق من جلسة الدخول وأعد المحاولة.':'The change could not be saved. Check your session and try again.')}</p>}</form>;}
