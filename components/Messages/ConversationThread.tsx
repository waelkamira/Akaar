'use client';

import { useEffect, useState } from 'react';

type Message = { id: string; senderId: string; body: string; createdAt: string; readAt: string | null };

export default function ConversationThread({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function loadMessages() {
    try {
      const response = await fetch(`/api/messages/${encodeURIComponent(conversationId)}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'تعذر تحميل المحادثة.');
      setMessages(data.messages || []);
      setCurrentUserId(data.currentUserId || '');
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذر تحميل المحادثة.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadMessages(); }, [conversationId]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = body.trim();
    if (!content || sending) return;
    setSending(true);
    setError('');
    try {
      const response = await fetch(`/api/messages/${encodeURIComponent(conversationId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'تعذر إرسال الرسالة.');
      setBody('');
      await loadMessages();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذر إرسال الرسالة.');
    } finally {
      setSending(false);
    }
  }

  return <section className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">
    <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
      {loading ? <p className="text-sm text-white/45">جارٍ تحميل الرسائل…</p> : messages.length ? messages.map(message =>
        <div key={message.id} className={message.senderId === currentUserId ? 'mr-auto max-w-[85%] rounded-xl bg-orange-400/15 p-3' : 'ml-auto max-w-[85%] rounded-xl bg-white/5 p-3'}>
          <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.body}</p>
          <time className="mt-2 block text-[11px] text-white/40">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(message.createdAt))}</time>
        </div>
      ) : !loading ? <p className="text-sm text-white/45">لا توجد رسائل بعد. ابدأ المحادثة الآن.</p> : null}
    </div>
    <form onSubmit={sendMessage} className="flex flex-col gap-2 sm:flex-row">
      <textarea value={body} onChange={event => setBody(event.target.value)} maxLength={4000} rows={2} required placeholder="اكتب رسالتك…" className="min-w-0 flex-1 resize-y rounded-lg border border-white/10 bg-[#171c1a] px-3 py-2 text-sm text-white outline-none focus:border-orange-300/50"/>
      <button type="submit" disabled={sending || !body.trim()} className="rounded-lg bg-orange-400 px-5 py-2 font-semibold text-[#21180f] disabled:opacity-50">{sending ? 'جارٍ الإرسال…' : 'إرسال'}</button>
    </form>
    {error ? <p role="alert" className="mt-3 text-sm text-red-300">{error}</p> : null}
  </section>;
}
