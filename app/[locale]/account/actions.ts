"use server";
import { authenticatedUser } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { isLocale } from '@/lib/i18n/config';
export type ProfileState={code:'idle'|'saved'|'invalid'|'failed'};
export async function updateProfile(_state:ProfileState,data:FormData):Promise<ProfileState>{
 const locale=String(data.get('locale')),name=String(data.get('name')||'').trim();
 if(!isLocale(locale)||name.length>100)return {code:'invalid'};
 const auth=await authenticatedUser();if(!auth)return {code:'failed'};
 try{const {data:updated,error}=await auth.client.from('agentnexos_profiles').update({display_name:name}).eq('id',auth.user.id).select('id').single();if(error||!updated)return {code:'failed'};revalidatePath(`/${locale}/account`);return {code:'saved'};}catch{return {code:'failed'};}
}
