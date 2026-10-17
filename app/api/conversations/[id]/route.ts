import { boundedJson, conversationFailure, ConversationError, conversationId, conversationIdentity, deleteConversationSchema, privateHeaders, renameConversationSchema, saveOwnedConversation } from '@/lib/supabase/conversations';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const { client, user } = await conversationIdentity(request);
    const id = conversationId.safeParse((await context.params).id);
    if (!id.success) throw new ConversationError('CONVERSATION_UNAVAILABLE', 404);
    const { data: conversation, error } = await client.from('agentnexos_conversations')
      .select('id,title,locale,created_at,updated_at,revision').eq('id', id.data).eq('user_id', user.id).maybeSingle();
    if (error) throw new ConversationError('HISTORY_UNAVAILABLE');
    if (!conversation) throw new ConversationError('CONVERSATION_UNAVAILABLE', 404);
    const { data: messages, error: messageError } = await client.from('agentnexos_messages')
      .select('id,role,content,sequence').eq('conversation_id', id.data).eq('user_id', user.id).order('sequence', { ascending: true }).limit(81);
    if (messageError) throw new ConversationError('HISTORY_UNAVAILABLE');
    if ((messages?.length ?? 0) > 80) throw new ConversationError('CONVERSATION_TOO_LARGE', 413);
    const { data: latest, error: revisionError } = await client.from('agentnexos_conversations').select('revision').eq('id', id.data).eq('user_id', user.id).maybeSingle();
    if (revisionError) throw new ConversationError('HISTORY_UNAVAILABLE');
    if (!latest || latest.revision !== conversation.revision) throw new ConversationError('SAVE_CONFLICT', 409);
    return Response.json({ conversation, messages }, { headers: privateHeaders });
  } catch (error) { return conversationFailure(error); }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { client, user } = await conversationIdentity(request, true);
    const id = conversationId.safeParse((await context.params).id);
    const parsed = renameConversationSchema.safeParse(await boundedJson(request));
    if (!id.success || !parsed.success) throw new ConversationError('INVALID_REQUEST', 400);
    const { data, error } = await client.from('agentnexos_conversations').select('locale').eq('id', id.data).eq('user_id', user.id).maybeSingle();
    if (error) throw new ConversationError('HISTORY_UNAVAILABLE');
    if (!data) throw new ConversationError('CONVERSATION_UNAVAILABLE', 404);
    const conversation = await saveOwnedConversation(user.id, { ...parsed.data, id: id.data, locale: data.locale, messages: null });
    return Response.json({ conversation }, { headers: privateHeaders });
  } catch (error) { return conversationFailure(error); }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { client, user } = await conversationIdentity(request, true);
    const id = conversationId.safeParse((await context.params).id);
    const parsed = deleteConversationSchema.safeParse(await boundedJson(request));
    if (!id.success || !parsed.success) throw new ConversationError('INVALID_REQUEST', 400);
    const { data, error } = await client.from('agentnexos_conversations').delete()
      .eq('id', id.data).eq('user_id', user.id).eq('revision', parsed.data.revision).select('id');
    if (error) throw new ConversationError('HISTORY_UNAVAILABLE');
    if (!data?.length) throw new ConversationError('SAVE_CONFLICT', 409);
    return Response.json({ deleted: true }, { headers: privateHeaders });
  } catch (error) { return conversationFailure(error); }
}
