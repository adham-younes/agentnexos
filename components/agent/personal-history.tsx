'use client';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { UIMessage } from 'ai';
import type { Locale } from '@/lib/i18n/config';
import { publicPath } from '@/lib/i18n/routing';
import { useAccount } from '@/lib/auth/account-state';

type SavedConversation = { id: string; title: string; locale: Locale; revision: number; created_at: string; updated_at: string };
type TextMessage = { role: 'user' | 'assistant'; content: string };
type PendingAction = { type: 'open' | 'delete'; conversation: SavedConversation } | null;
class HistoryFailure extends Error { constructor(public code: string) { super(code); } }
function visibleText(messages: UIMessage[]): TextMessage[] {
  return messages.flatMap(message => {
    if (message.role !== 'user' && message.role !== 'assistant') return [];
    const content = message.parts.filter(part => part.type === 'text').map(part => part.text).join('\n');
    return content.trim() ? [{ role: message.role, content }] : [];
  });
}

export function PersonalHistory({ locale, messages, busy, onRestore, onStartNew }: {
  locale: Locale; messages: UIMessage[]; busy: boolean;
  onRestore: (messages: UIMessage[]) => void; onStartNew: () => void;
}) {
  const ar = locale === 'ar', account = useAccount();
  const subject = account.user ? `${account.user.id}:${account.user.last_sign_in_at ?? ''}` : null;
  const callbacks = useRef({ onRestore, onStartNew });
  useLayoutEffect(() => { callbacks.current = { onRestore, onStartNew }; }, [onRestore, onStartNew]);
  const identity = useRef<string | null | undefined>(undefined), generation = useRef(0);
  const controller = useRef<AbortController | null>(null), accountKey = useRef<string | null>(null);
  const [items, setItems] = useState<SavedConversation[]>([]);
  const [active, setActive] = useState<SavedConversation | null>(null);
  const [savedText, setSavedText] = useState('');
  const [operation, setOperation] = useState<string | null>(null);
  const [notice, setNotice] = useState(''), [noticeError, setNoticeError] = useState(false);
  const [reauthNeeded, setReauthNeeded] = useState(false);
  const [action, setAction] = useState<PendingAction>(null);
  const [renameId, setRenameId] = useState<string | null>(null), [title, setTitle] = useState('');
  const [historyOwner, setHistoryOwner] = useState<string | null>(null);
  const pendingSave = useRef<{ fingerprint: string; id: string; revision: number; requestId: string } | null>(null);
  const previousMessageCount = useRef(messages.length);
  const text = useMemo(() => visibleText(messages), [messages]);
  const fingerprint = useMemo(() => JSON.stringify(text), [text]);
  const locked = busy || operation !== null;

  const resetPrivate = useCallback((clearConversation: boolean) => {
    generation.current++; controller.current?.abort(); accountKey.current = null; pendingSave.current = null;
    setItems([]); setActive(null); setSavedText(''); setOperation(null); setNotice(''); setAction(null); setRenameId(null); setHistoryOwner(null); setReauthNeeded(false);
    if (clearConversation) callbacks.current.onStartNew();
  }, []);
  const call = useCallback(async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
    const started = generation.current;
    controller.current?.abort();
    const abort = new AbortController(); controller.current = abort;
    const headers = new Headers(init.headers);
    if (init.method && init.method !== 'GET') {
      headers.set('Content-Type', 'application/json');
      if (accountKey.current) headers.set('x-account-key', accountKey.current);
    }
    const response = await fetch(path, { ...init, headers, signal: abort.signal, credentials: 'same-origin', cache: 'no-store' });
    const value = await response.json();
    if (started !== generation.current || abort.signal.aborted) throw new DOMException('Account changed', 'AbortError');
    if (!response.ok) throw new HistoryFailure(typeof value.code === 'string' ? value.code : 'HISTORY_UNAVAILABLE');
    return value as T;
  }, []);
  const reportError = useCallback((error: unknown) => {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    const code = error instanceof HistoryFailure ? error.code : 'HISTORY_UNAVAILABLE';
    const copy: Record<string, [string, string]> = {
      SIGN_IN_REQUIRED: ['انتهت الجلسة. سجّل الدخول لفتح محادثاتك المحفوظة.', 'Your session expired. Sign in to open saved conversations.'],
      ACCOUNT_CHANGED: ['تغير الحساب أو الجلسة. أعد تحميل القائمة قبل الحفظ.', 'Your account or session changed. Reload history before saving.'],
      SAVE_CONFLICT: ['تغيرت المحادثة في مكان آخر. أعد تحميل القائمة وافتح أحدث نسخة قبل الحفظ.', 'This conversation changed elsewhere. Reload history and open the latest version before saving.'],
      CONVERSATION_UNAVAILABLE: ['المحادثة غير متاحة لهذا الحساب، أو حُذفت.', 'This conversation is unavailable to this account, or was deleted.'],
      CONVERSATION_TOO_LARGE: ['المحادثة تتجاوز حد الحفظ. نزّل نسخة وابدأ محادثة جديدة.', 'This conversation exceeds the save limit. Download it and start a new conversation.'],
      INVALID_REQUEST: ['المحادثة تتجاوز حد الحفظ أو بيانات الطلب غير صالحة. نزّل نسخة قبل بدء محادثة جديدة.', 'The conversation exceeds the save limit or the request is invalid. Download it before starting a new conversation.'],
      CONVERSATION_LIMIT: ['وصلت إلى حد المحادثات المحفوظة. احذف ما لا تحتاجه قبل الحفظ.', 'You reached the saved conversation limit. Delete conversations you no longer need.'],
      STORAGE_LIMIT: ['وصلت إلى حد مساحة المحادثات. احذف ما لا تحتاجه أو نزّل نسخة.', 'Your saved conversation storage limit was reached. Delete unneeded conversations or download a copy.'],
      SAVE_RATE_LIMIT: ['انتظر لحظة قبل الحفظ مرة أخرى.', 'Wait a moment before saving again.'],
    };
    if (code === 'SIGN_IN_REQUIRED' || code === 'ACCOUNT_CHANGED') resetPrivate(true);
    if (code === 'SIGN_IN_REQUIRED') setReauthNeeded(true);
    setNotice(copy[code]?.[ar ? 0 : 1] ?? (ar ? 'تعذر الوصول إلى محادثاتك. لم نعلن حفظ أي تغيير. حاول مجددًا.' : 'Your conversations could not be reached. No change is reported as saved. Try again.'));
    setNoticeError(true);
  }, [ar, resetPrivate]);
  const loadHistory = useCallback(async () => {
    const started = generation.current;
    setOperation('load'); setNotice('');
    try {
      const value = await call<{ conversations: SavedConversation[]; accountKey: string }>('/api/conversations');
      accountKey.current = value.accountKey; setItems(value.conversations); setHistoryOwner(identity.current ?? null); setReauthNeeded(false);
    } catch (error) { reportError(error); }
    finally { if (started === generation.current) setOperation(null); }
  }, [call, reportError]);
  useLayoutEffect(() => {
    if (!account.ready) return;
    const changed = identity.current !== undefined && identity.current !== subject;
    if (identity.current !== subject) resetPrivate(changed);
    identity.current = subject;
  }, [account.ready, subject, resetPrivate]);
  useEffect(() => {
    if (account.ready && subject) void loadHistory();
    return () => { controller.current?.abort(); };
  }, [account.ready, subject, loadHistory]);
  useEffect(() => {
    const clear = () => resetPrivate(true);
    window.addEventListener('agynexa:account-changing', clear);
    return () => window.removeEventListener('agynexa:account-changing', clear);
  }, [resetPrivate]);
  useLayoutEffect(() => {
    if (!messages.length && previousMessageCount.current > 0) {
      // New conversation invalidates a response from an older in-flight save.
      generation.current++; controller.current?.abort(); setOperation(null);
      setActive(null); setSavedText(''); pendingSave.current = null;
    }
    previousMessageCount.current = messages.length;
  }, [messages.length]);

  async function save() {
    if (locked || !text.length || !accountKey.current || !subject) return;
    const started = generation.current;
    const titleValue = active?.title ?? (text.find(message => message.role === 'user')?.content ?? text[0].content).slice(0, 120).trim();
    const payloadFingerprint = JSON.stringify({ fingerprint, title: titleValue, locale });
    if (!pendingSave.current || pendingSave.current.fingerprint !== payloadFingerprint) {
      pendingSave.current = { fingerprint: payloadFingerprint, id: active?.id ?? crypto.randomUUID(), revision: active?.revision ?? 0, requestId: crypto.randomUUID() };
    }
    const pending = pendingSave.current;
    setOperation('save'); setNotice('');
    try {
      const value = await call<{ conversation: SavedConversation }>('/api/conversations', { method: 'POST', body: JSON.stringify({ id: pending.id, revision: pending.revision, requestId: pending.requestId, title: titleValue, locale, messages: text }) });
      if (started !== generation.current) return;
      setActive(value.conversation); setSavedText(fingerprint); pendingSave.current = null;
      setItems(previous => [value.conversation, ...previous.filter(item => item.id !== value.conversation.id)]); setHistoryOwner(subject);
      setNotice(ar ? 'حُفظت المحادثة في حسابك.' : 'Conversation saved to your account.'); setNoticeError(false);
    } catch (error) { reportError(error); } finally { if (started === generation.current) setOperation(null); }
  }
  async function open(conversation: SavedConversation) {
    const started = generation.current; setOperation('open'); setNotice(''); setAction(null);
    try {
      const value = await call<{ conversation: SavedConversation; messages: { id: string; role: 'user' | 'assistant'; content: string }[] }>(`/api/conversations/${conversation.id}`);
      if (started !== generation.current) return;
      const restored: UIMessage[] = value.messages.map(message => ({ id: message.id, role: message.role, parts: [{ type: 'text', text: message.content }] }));
      setActive(value.conversation); setSavedText(JSON.stringify(visibleText(restored))); pendingSave.current = null;
      callbacks.current.onRestore(restored);
    } catch (error) { reportError(error); } finally { if (started === generation.current) setOperation(null); }
  }
  async function rename(conversation: SavedConversation) {
    if (locked || !title.trim()) return;
    const started = generation.current; setOperation('rename'); setNotice('');
    try {
      const value = await call<{ conversation: SavedConversation }>(`/api/conversations/${conversation.id}`, { method: 'PATCH', body: JSON.stringify({ title: title.trim(), revision: conversation.revision, requestId: crypto.randomUUID() }) });
      if (started !== generation.current) return;
      setItems(previous => previous.map(item => item.id === conversation.id ? value.conversation : item));
      if (active?.id === conversation.id) setActive(value.conversation);
      setRenameId(null); setNotice(ar ? 'حُفظ العنوان.' : 'Title saved.'); setNoticeError(false);
    } catch (error) { reportError(error); } finally { if (started === generation.current) setOperation(null); }
  }
  async function remove(conversation: SavedConversation) {
    const started = generation.current; setOperation('delete'); setNotice(''); setAction(null);
    try {
      await call(`/api/conversations/${conversation.id}`, { method: 'DELETE', body: JSON.stringify({ revision: conversation.revision }) });
      if (started !== generation.current) return;
      setItems(previous => previous.filter(item => item.id !== conversation.id));
      if (active?.id === conversation.id) { callbacks.current.onStartNew(); setActive(null); setSavedText(''); pendingSave.current = null; }
      setNotice(ar ? 'حُذفت المحادثة ورسائلها المحفوظة.' : 'The conversation and its saved messages were deleted.'); setNoticeError(false);
    } catch (error) { reportError(error); } finally { if (started === generation.current) setOperation(null); }
  }
  const shown = historyOwner === subject ? items : [];
  return <section className="personal-history" aria-labelledby="personal-history-title">
    <div className="personal-history-heading"><h2 id="personal-history-title">{ar ? 'محادثاتك' : 'Your conversations'}</h2>
      {account.ready && subject && <button type="button" disabled={locked} onClick={() => void loadHistory()}>{ar ? 'تحديث القائمة' : 'Reload history'}</button>}
    </div>
    {!account.ready ? <p role="status">{ar ? 'جارٍ التحقق من الحساب…' : 'Checking account…'}</p> : !subject ? <>
      <p>{ar ? 'ابدأ كزائر. سجّل الدخول إذا أردت حفظ محادثاتك والعودة إليها.' : 'Start as a guest. Sign in when you want to save and revisit conversations.'}</p>
      <Link href={publicPath('/login')} prefetch={false}>{ar ? 'تسجيل الدخول / إنشاء حساب' : 'Sign in / Create account'}</Link>
    </> : <>
      <p className="personal-history-note">{ar ? 'الحفظ باختيارك فقط. تبقى المحادثة في حسابك حتى تحذفها.' : 'Save only when you choose. Saved conversations stay in your account until you delete them.'}</p>
      <button type="button" className="personal-history-save" disabled={locked || !text.length || !accountKey.current || (Boolean(active) && savedText === fingerprint)} onClick={() => void save()}>{operation === 'save' ? (ar ? 'جارٍ الحفظ…' : 'Saving…') : active && savedText === fingerprint ? (ar ? 'محفوظة' : 'Saved') : (ar ? 'حفظ المحادثة' : 'Save conversation')}</button>
      {operation === 'load' && <p role="status">{ar ? 'جارٍ تحميل محادثاتك…' : 'Loading your conversations…'}</p>}
      {!operation && !shown.length && <p>{ar ? 'لم تحفظ محادثات بعد.' : 'No saved conversations yet.'}</p>}
      <ul className="personal-history-list">{shown.map(conversation => <li key={conversation.id}>
        {renameId === conversation.id ? <form onSubmit={event => { event.preventDefault(); void rename(conversation); }} className="personal-history-rename">
          <label htmlFor={`conversation-title-${conversation.id}`}>{ar ? 'عنوان المحادثة' : 'Conversation title'}</label>
          <input id={`conversation-title-${conversation.id}`} value={title} onChange={event => setTitle(event.target.value)} required maxLength={120} disabled={locked} autoFocus/>
          <button type="submit" disabled={locked || !title.trim()}>{ar ? 'حفظ العنوان' : 'Save title'}</button><button type="button" disabled={locked} onClick={() => setRenameId(null)}>{ar ? 'إلغاء' : 'Cancel'}</button>
        </form> : <>
          <button className="personal-history-open" type="button" disabled={locked} aria-current={active?.id === conversation.id ? 'true' : undefined} onClick={() => { if (text.length && savedText !== fingerprint) setAction({ type: 'open', conversation }); else void open(conversation); }}>{conversation.title}</button>
          <div className="personal-history-actions"><button type="button" disabled={locked} aria-label={`${ar ? 'تغيير عنوان' : 'Rename'} ${conversation.title}`} onClick={() => { setTitle(conversation.title); setRenameId(conversation.id); }}>{ar ? 'تغيير العنوان' : 'Rename'}</button><button type="button" disabled={locked} aria-label={`${ar ? 'حذف' : 'Delete'} ${conversation.title}`} onClick={() => setAction({ type: 'delete', conversation })}>{ar ? 'حذف' : 'Delete'}</button></div>
        </>}
      </li>)}</ul>
    </>}
    {action && <div className="personal-history-confirm" role="alertdialog" aria-modal="false" aria-label={ar ? 'تأكيد الإجراء' : 'Confirm action'}>
      <p>{action.type === 'delete' ? (ar ? 'حذف هذه المحادثة ورسائلها المحفوظة؟ لا يمكن التراجع عن الحذف.' : 'Delete this conversation and its saved messages? This cannot be undone.') : (ar ? 'فتح المحادثة المحفوظة واستبدال التغييرات غير المحفوظة الحالية؟' : 'Open the saved conversation and replace your current unsaved changes?')}</p>
      <button type="button" disabled={locked} autoFocus onClick={() => { if (action.type === 'delete') void remove(action.conversation); else void open(action.conversation); }}>{ar ? 'تأكيد' : 'Confirm'}</button>
      <button type="button" disabled={locked} onClick={() => setAction(null)}>{ar ? 'إلغاء' : 'Cancel'}</button>
    </div>}
    {notice && <p className="personal-history-notice" role={noticeError ? 'alert' : 'status'}>{notice}</p>}
    {reauthNeeded && <Link href={publicPath('/login')} prefetch={false}>{ar ? 'تسجيل الدخول مجددًا' : 'Sign in again'}</Link>}
  </section>;
}
