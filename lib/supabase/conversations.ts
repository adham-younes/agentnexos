import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const privateHeaders = { 'Cache-Control': 'private, no-store', Pragma: 'no-cache', Vary: 'Cookie' };
export class ConversationError extends Error {
  constructor(public code: string, public status = 503) { super(code); }
}
export const conversationId = z.string().uuid();
const revision = z.number().int().min(0).max(2147483646);
const textMessage = z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(16000) }).strict();
export const saveConversationSchema = z.object({
  id: conversationId, revision, requestId: z.string().uuid(), title: z.string().trim().min(1).max(120),
  locale: z.enum(['en', 'ar']), messages: z.array(textMessage).min(1).max(80),
}).strict().refine(value => value.messages.reduce((total, message) => total + message.content.length, 0) <= 120000);
export const renameConversationSchema = z.object({ revision, requestId: z.string().uuid(), title: z.string().trim().min(1).max(120) }).strict();
export const deleteConversationSchema = z.object({ revision }).strict();

function serviceKey() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new ConversationError('HISTORY_UNAVAILABLE');
  return key;
}

export async function conversationIdentity(request: Request, mutation = false) {
  if (mutation) {
    if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') {
      throw new ConversationError('ORIGIN_DENIED', 403);
    }
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    throw new ConversationError('HISTORY_UNAVAILABLE');
  }
  const client = await createClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    if (error && (!error.status || error.status >= 500)) throw new ConversationError('AUTH_UNAVAILABLE');
    throw new ConversationError('SIGN_IN_REQUIRED', 401);
  }
  // A request begun in another account/session cannot silently save in the new
  // account. This is a binding check, never a browser-selected resource owner.
  const accountKey = createHmac('sha256', serviceKey()).update(`${data.user.id}:${data.user.last_sign_in_at ?? ''}`).digest('hex');
  if (mutation) {
    const supplied = request.headers.get('x-account-key') ?? '';
    if (!/^[a-f0-9]{64}$/.test(supplied) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(accountKey))) {
      throw new ConversationError('ACCOUNT_CHANGED', 409);
    }
  }
  return { client, user: data.user, accountKey };
}

export async function boundedJson(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new ConversationError('JSON_REQUIRED', 415);
  const reader = request.body?.getReader();
  if (!reader) throw new ConversationError('INVALID_REQUEST', 400);
  let bytes = 0, value = '';
  const decoder = new TextDecoder();
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > 512000) { await reader.cancel(); throw new ConversationError('CONVERSATION_TOO_LARGE', 413); }
      value += decoder.decode(part.value, { stream: true });
    }
    value += decoder.decode();
    return JSON.parse(value) as unknown;
  } catch (error) {
    if (error instanceof ConversationError) throw error;
    throw new ConversationError('INVALID_REQUEST', 400);
  }
}

export async function saveOwnedConversation(userId: string, value: {
  id: string; revision: number; requestId: string; title: string; locale: 'ar' | 'en';
  messages: { role: 'user' | 'assistant'; content: string }[] | null;
}) {
  const payloadHash = createHash('sha256').update(JSON.stringify({ title: value.title, locale: value.locale, messages: value.messages })).digest('hex');
  const { data, error } = await createAdminClient().rpc('agentnexos_save_conversation', {
    p_user_id: userId, p_conversation_id: value.id, p_expected_revision: value.revision,
    p_request_id: value.requestId, p_title: value.title, p_locale: value.locale,
    p_messages: value.messages, p_payload_hash: payloadHash,
  });
  if (error) {
    const known: Record<string, [string, number]> = {
      SAVE_CONFLICT: ['SAVE_CONFLICT', 409], IDEMPOTENCY_CONFLICT: ['SAVE_CONFLICT', 409],
      CONVERSATION_UNAVAILABLE: ['CONVERSATION_UNAVAILABLE', 404],
      CONVERSATION_LIMIT: ['CONVERSATION_LIMIT', 429], STORAGE_LIMIT: ['STORAGE_LIMIT', 429],
      SAVE_RATE_LIMIT: ['SAVE_RATE_LIMIT', 429], INVALID_SNAPSHOT: ['INVALID_REQUEST', 400],
    };
    const safe = known[error.message];
    throw new ConversationError(safe?.[0] ?? 'HISTORY_UNAVAILABLE', safe?.[1] ?? 503);
  }
  if (!data || !Array.isArray(data) || !data[0]) throw new ConversationError('HISTORY_UNAVAILABLE');
  return data[0];
}

export function conversationFailure(error: unknown) {
  const safe = error instanceof ConversationError ? error : new ConversationError('HISTORY_UNAVAILABLE');
  return Response.json({ code: safe.code }, { status: safe.status, headers: privateHeaders });
}
