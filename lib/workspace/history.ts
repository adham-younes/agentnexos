import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod/v4';
export const conversationIdSchema=z.uuid();
export type SavedConversation={id:string;title:string;updated_at:string};
export type SavedMessage={id:string;role:'user'|'assistant';content:string};
export async function conversationList(client:SupabaseClient,userId:string){
 const {data,error}=await client.from('agentnexos_conversations').select('id,title,updated_at').eq('user_id',userId).order('updated_at',{ascending:false}).limit(200);
 if(error)throw Error('HISTORY_UNAVAILABLE');return (data||[]) as SavedConversation[];
}
export async function conversationMessages(client:SupabaseClient,userId:string,id:string){
 if(!conversationIdSchema.safeParse(id).success)throw Error('CONVERSATION_UNAVAILABLE');
 const owned=await client.from('agentnexos_conversations').select('id').eq('id',id).eq('user_id',userId).maybeSingle();
 if(owned.error||!owned.data)throw Error('CONVERSATION_UNAVAILABLE');
 const {data,error}=await client.from('agentnexos_messages').select('id,role,content').eq('conversation_id',id).eq('user_id',userId).order('sequence',{ascending:true}).limit(200);
 if(error)throw Error('HISTORY_UNAVAILABLE');return (data||[]) as SavedMessage[];
}
