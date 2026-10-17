import { boundedJson, conversationFailure, ConversationError, conversationIdentity, privateHeaders, saveConversationSchema, saveOwnedConversation } from '@/lib/supabase/conversations';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { client, user, accountKey } = await conversationIdentity(request);
    const { data, error } = await client.from('agentnexos_conversations')
      .select('id,title,locale,created_at,updated_at,revision').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(100);
    if (error) throw new ConversationError('HISTORY_UNAVAILABLE');
    return Response.json({ conversations: data, accountKey }, { headers: privateHeaders });
  } catch (error) { return conversationFailure(error); }
}

export async function POST(request: Request) {
  try {
    const { user } = await conversationIdentity(request, true);
    const parsed = saveConversationSchema.safeParse(await boundedJson(request));
    if (!parsed.success) throw new ConversationError('INVALID_REQUEST', 400);
    const conversation = await saveOwnedConversation(user.id, parsed.data);
    return Response.json({ conversation }, { headers: privateHeaders });
  } catch (error) { return conversationFailure(error); }
}
