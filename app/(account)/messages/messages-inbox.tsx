'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';

type Conversation = {
  id: string;
  sellerId: string;
  otherPartyName: string;
  isStoreOwner: boolean;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
};

type ThreadMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  senderName: string;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

function formatTime(value: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function MessagesInbox({
  userId,
  initialStoreId,
  initialConversationId,
}: {
  userId: string;
  initialStoreId: string;
  initialConversationId: string;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState(initialConversationId);
  const [draftSellerId, setDraftSellerId] = useState('');
  const [thread, setThread] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(Boolean(initialConversationId));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const initializedSelection = useRef(false);

  const loadConversations = useCallback(async () => {
    const result = await readJson<{ conversations: Conversation[] }>(
      await fetch('/api/messages', { cache: 'no-store' }),
    );
    setConversations(result.conversations);
    if (initializedSelection.current) return;
    initializedSelection.current = true;
    const requestedConversation = initialConversationId
      ? result.conversations.find(({ id }) => id === initialConversationId)
      : null;
    if (requestedConversation) {
      setActiveId(requestedConversation.id);
      setDraftSellerId('');
    } else if (initialStoreId) {
      const existing = result.conversations.find(({ sellerId }) => sellerId === initialStoreId);
      if (existing) {
        setActiveId(existing.id);
        setDraftSellerId('');
      } else {
        setActiveId('');
        setDraftSellerId(initialStoreId);
        setThread(null);
        setMessages([]);
      }
    } else if (result.conversations[0]) {
      setActiveId(result.conversations[0].id);
    }
  }, [initialConversationId, initialStoreId]);

  useEffect(() => {
    let active = true;
    fetch('/api/messages', { cache: 'no-store' })
      .then(readJson<{ conversations: Conversation[] }>)
      .then((result) => {
        if (!active) return;
        setConversations(result.conversations);
        if (initializedSelection.current) return;
        initializedSelection.current = true;
        const requestedConversation = initialConversationId
          ? result.conversations.find(({ id }) => id === initialConversationId)
          : null;
        if (requestedConversation) {
          setActiveId(requestedConversation.id);
          setDraftSellerId('');
          setThreadLoading(true);
        } else if (initialStoreId) {
          const existing = result.conversations.find(({ sellerId }) => sellerId === initialStoreId);
          if (existing) {
            setActiveId(existing.id);
            setDraftSellerId('');
            setThreadLoading(true);
          } else {
            setActiveId('');
            setDraftSellerId(initialStoreId);
            setThread(null);
            setMessages([]);
            setThreadLoading(false);
          }
        } else if (result.conversations[0]) {
          setActiveId(result.conversations[0].id);
          setThreadLoading(true);
        }
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الرسائل.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [initialConversationId, initialStoreId, loadConversations]);

  useEffect(() => {
    if (!activeId) {
      return;
    }
    let active = true;
    fetch(`/api/messages/${encodeURIComponent(activeId)}`, { cache: 'no-store' })
      .then(readJson<{ conversation: Conversation; messages: ThreadMessage[] }>)
      .then((result) => {
        if (!active) return;
        setThread(result.conversation);
        setMessages(result.messages);
        return fetch(`/api/messages/${encodeURIComponent(activeId)}`, { method: 'PATCH' })
          .then(readJson<{ read: boolean }>);
      })
      .then(() => loadConversations())
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المحادثة.');
      })
      .finally(() => {
        if (active) setThreadLoading(false);
      });
    return () => { active = false; };
  }, [activeId, loadConversations]);

  const selectedConversation = useMemo(
    () => conversations.find(({ id }) => id === activeId) || null,
    [activeId, conversations],
  );

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    setPending(true);
    try {
      if (!body.trim()) throw new Error('اكتب نص الرسالة أولًا.');
      if (activeId) {
        await readJson(await fetch(`/api/messages/${encodeURIComponent(activeId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body }),
        }));
      } else if (draftSellerId) {
        const result = await readJson<{ conversationId: string }>(await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sellerId: draftSellerId, body }),
        }));
        setDraftSellerId('');
        setThreadLoading(true);
        setActiveId(result.conversationId);
      } else {
        throw new Error('اختر متجرًا أو محادثة لإرسال رسالتك.');
      }
      setBody('');
      await loadConversations();
      setNotice('تم إرسال رسالتك.');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'تعذر إرسال الرسالة.');
    } finally {
      setPending(false);
    }
  }

  function openConversation(conversationId: string) {
    setError('');
    setNotice('');
    setDraftSellerId('');
    setThread(null);
    setMessages([]);
    setThreadLoading(true);
    setActiveId(conversationId);
  }

  const recipientName = thread?.otherPartyName
    || selectedConversation?.otherPartyName
    || (draftSellerId ? 'المتجر' : '');

  return (
    <main dir="rtl" className="min-h-screen bg-ak-canvas px-4 py-8 text-ak-cream sm:py-12">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="ak-panel-raised rounded-3xl p-6 sm:p-8">
          <p className="ak-eyebrow">STORE MESSAGES</p>
          <h1 className="mt-2 text-3xl font-black">الرسائل</h1>
          <p className="mt-2 text-sm text-ak-muted">تواصل مباشرةً مع أصحاب المتاجر أو أجب عن استفسارات عملائك من مكان واحد.</p>
        </header>

        {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}

        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="ak-panel rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-bold">محادثاتي</h2>
              <button type="button" onClick={() => void loadConversations().catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'تعذر تحديث الرسائل.'))} className="text-xs text-ak-honey underline">تحديث</button>
            </div>
            {loading ? <p className="p-5 text-sm text-ak-muted">جارٍ تحميل المحادثات...</p> : (
              <div className="max-h-[65vh] space-y-2 overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => openConversation(conversation.id)}
                    className={`w-full rounded-xl border p-3 text-right transition ${activeId === conversation.id ? 'border-ak-amber/40 bg-ak-brand-soft' : 'border-ak-line bg-ak-surface hover:border-ak-line-strong'}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold">{conversation.otherPartyName}</span>
                      {conversation.unreadCount > 0 && <span className="rounded-full bg-sky-400/20 px-2 py-0.5 text-[10px] font-bold text-sky-200">{conversation.unreadCount} جديدة</span>}
                    </span>
                    <span className="mt-1 block truncate text-xs text-ak-muted">{conversation.lastMessage || 'بدء محادثة جديدة'}</span>
                    {conversation.lastMessageAt && <time className="mt-2 block text-[10px] text-stone-500">{formatTime(conversation.lastMessageAt)}</time>}
                  </button>
                ))}
                {!conversations.length && <p className="rounded-xl border border-dashed border-ak-line p-5 text-center text-sm text-ak-muted">لا توجد محادثات بعد. ابدأ بمراسلة متجر من صفحته.</p>}
              </div>
            )}
          </aside>

          <section className="ak-panel flex min-h-[520px] flex-col overflow-hidden rounded-2xl">
            <header className="border-b border-ak-line px-5 py-4">
              <p className="text-xs text-ak-muted">{thread?.isStoreOwner ? 'استفسار من عميل' : 'التواصل مع المتجر'}</p>
              <h2 className="mt-1 font-bold">{recipientName || 'اختر محادثة'}</h2>
            </header>

            <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
              {threadLoading && <p className="text-center text-sm text-ak-muted">جارٍ تحميل المحادثة...</p>}
              {draftSellerId && !activeId && !threadLoading && (
                <p className="rounded-xl border border-sky-400/20 bg-sky-400/5 p-4 text-sm text-sky-100">اكتب رسالتك لبدء محادثة خاصة مع المتجر.</p>
              )}
              {messages.map((item) => {
                const ownMessage = item.senderId === userId;
                return (
                  <article key={item.id} className={`max-w-[90%] rounded-2xl p-3 sm:max-w-[75%] ${ownMessage ? 'mr-auto bg-ak-brand-soft text-white' : 'ml-auto border border-ak-line bg-ak-surface'}`}>
                    <p className="mb-1 text-[11px] font-semibold text-ak-honey">{ownMessage ? 'أنت' : item.senderName}</p>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">{item.body}</p>
                    <time dateTime={item.createdAt} className="mt-2 block text-left text-[10px] text-ak-muted">{formatTime(item.createdAt)}</time>
                  </article>
                );
              })}
              {!messages.length && !draftSellerId && !threadLoading && !loading && <p className="m-auto text-center text-sm text-ak-muted">اختر محادثة لعرض الرسائل وإرسال رد.</p>}
            </div>

            {(activeId || draftSellerId) && (
              <form onSubmit={(event) => void sendMessage(event)} className="border-t border-ak-line p-4 sm:p-5">
                <label htmlFor="store-message-body" className="sr-only">نص الرسالة</label>
                <textarea
                  id="store-message-body"
                  required
                  rows={3}
                  maxLength={4000}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="w-full resize-y rounded-xl border border-ak-line bg-ak-surface px-4 py-3 text-sm text-white outline-none focus:border-ak-amber/50"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-ak-muted">{body.length}/4000</span>
                  <button type="submit" disabled={pending || !body.trim()} className="rounded-xl bg-ak-amber px-5 py-2.5 text-sm font-bold text-ak-ink disabled:opacity-50">{pending ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}</button>
                </div>
              </form>
            )}
          </section>
        </div>
        <p className="text-center text-xs text-ak-muted">تُعرض المحادثات للأطراف المشاركة فقط. <Link href="/notifications" className="text-ak-honey underline">الإشعارات</Link></p>
      </div>
    </main>
  );
}
