'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';

type UserOption = { id: string; email: string; seller: { phoneNumber: string | null } | null };
type Message = {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  user: { email: string };
};
type MessagePage = {
  items: Message[];
  users: UserOption[];
  providers: { emailConfigured: boolean; smsConfigured: boolean };
  page: number;
  hasMore: boolean;
};

async function readJson<T>(response: Response): Promise<T & { error?: string; deliveredInApp?: boolean }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error || 'تعذر إكمال الطلب.');
    Object.assign(error, { deliveredInApp: payload?.deliveredInApp === true });
    throw error;
  }
  return payload;
}

export default function MessagesClient() {
  const [data, setData] = useState<MessagePage>({
    items: [], users: [], providers: { emailConfigured: false, smsConfigured: false }, page: 1, hasMore: false,
  });
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('ADMIN');
  const [sendEmail, setSendEmail] = useState(false);
  const [sendSms, setSendSms] = useState(false);
  const [editing, setEditing] = useState<Message | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async (page = 1, append = false) => {
    const result = await readJson<MessagePage>(await fetch(`/api/admin/control-panel/messages?page=${page}&limit=20`, { cache: 'no-store' }));
    setData((current) => ({ ...result, items: append ? [...current.items, ...result.items] : result.items }));
    setUserId((current) => current || result.users[0]?.id || '');
  }, []);

  useEffect(() => {
    let active = true;
    load().catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الرسائل.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [load]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      await readJson(await fetch('/api/admin/control-panel/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message, type, sendEmail, sendSms }),
      }));
      setMessage('');
      setSendEmail(false);
      setSendSms(false);
      await load();
      setNotice('تم حفظ الرسالة وإرسالها عبر القنوات المحددة.');
    } catch (sendError) {
      if (sendError instanceof Error && 'deliveredInApp' in sendError && sendError.deliveredInApp) {
        await load();
      }
      setError(sendError instanceof Error ? sendError.message : 'تعذر إرسال الرسالة.');
    } finally {
      setPending(false);
    }
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setPending(true);
    setError('');
    try {
      const updated = await readJson<Omit<Message, 'user'> & { user?: { email: string } }>(await fetch(`/api/admin/control-panel/messages/${encodeURIComponent(editing.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editMessage }),
      }));
      setData((current) => ({ ...current, items: current.items.map((item) => item.id === updated.id ? { ...item, message: updated.message } : item) }));
      setEditing(null);
      setNotice('تم تعديل الرسالة المحفوظة.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر تعديل الرسالة.');
    } finally {
      setPending(false);
    }
  }

  async function deleteMessage(item: Message) {
    if (!window.confirm(`حذف رسالة ${item.user.email}؟`)) return;
    setPending(true);
    setError('');
    try {
      await readJson(await fetch(`/api/admin/control-panel/messages/${encodeURIComponent(item.id)}`, { method: 'DELETE' }));
      setData((current) => ({ ...current, items: current.items.filter((messageItem) => messageItem.id !== item.id) }));
      setNotice('تم حذف الرسالة.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الرسالة.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:py-12">
      <header>
        <Link href="/admin/control-panel" className="text-sm text-ak-honey underline">العودة إلى لوحة التحكم</Link>
        <p className="ak-eyebrow mt-4">USER COMMUNICATION</p>
        <h1 className="mt-2 text-3xl font-black">رسائل المستخدمين</h1>
        <p className="mt-2 text-sm text-stone-400">أرسل إشعارًا داخل التطبيق، مع خيار البريد أو SMS إذا كانت بيانات المزود مهيأة بالخادم.</p>
      </header>
      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}

      <form onSubmit={(event) => void send(event)} className="ak-panel space-y-4 p-5">
        <h2 className="text-xl font-bold">رسالة جديدة</h2>
        <label className="block text-sm">المستلم
          <select required value={userId} onChange={(event) => setUserId(event.target.value)} className="admin-input">
            {data.users.map((user) => <option key={user.id} value={user.id}>{user.email}{user.seller?.phoneNumber ? ` · ${user.seller.phoneNumber}` : ''}</option>)}
          </select>
        </label>
        <label className="block text-sm">نوع الرسالة
          <input required maxLength={60} value={type} onChange={(event) => setType(event.target.value)} className="admin-input" />
        </label>
        <label className="block text-sm">نص الرسالة
          <textarea required rows={5} maxLength={4000} value={message} onChange={(event) => setMessage(event.target.value)} className="admin-input" />
        </label>
        <div className="flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={sendEmail} disabled={!data.providers.emailConfigured} onChange={(event) => setSendEmail(event.target.checked)} />إرسال عبر البريد {!data.providers.emailConfigured && '(غير مهيأ)'}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={sendSms} disabled={!data.providers.smsConfigured || !data.users.find((user) => user.id === userId)?.seller?.phoneNumber} onChange={(event) => setSendSms(event.target.checked)} />إرسال SMS {!data.providers.smsConfigured && '(غير مهيأ)'}</label>
        </div>
        <p className="text-xs text-stone-500">تُحفظ الرسالة داخل التطبيق أولًا. SMS متاح فقط عند وجود رقم متجر للمستخدم.</p>
        <button type="submit" disabled={pending || !data.users.length} className="rounded-lg bg-ak-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}</button>
      </form>

      <section className="ak-panel overflow-hidden p-5">
        <h2 className="mb-4 text-xl font-bold">سجل الرسائل</h2>
        {loading ? <p aria-busy="true" className="text-sm text-stone-400">جارٍ التحميل...</p> : (
          <div className="space-y-3">
            {data.items.map((item) => (
              <article key={item.id} className="rounded-xl border border-ak-line-strong/[.08] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="font-semibold">{item.user.email} · {item.type}</p><p className="mt-1 whitespace-pre-wrap text-sm text-stone-300">{item.message}</p><p className="mt-2 text-xs text-stone-500">{new Date(item.createdAt).toLocaleString('ar')} · {item.isRead ? 'مقروءة' : 'غير مقروءة'}</p></div>
                  <div className="flex gap-2"><button type="button" disabled={pending} onClick={() => { setEditing(item); setEditMessage(item.message); }} className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs text-ak-honey">تعديل</button><button type="button" disabled={pending} onClick={() => void deleteMessage(item)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200">حذف</button></div>
                </div>
                {editing?.id === item.id && <form onSubmit={(event) => void saveEdit(event)} className="mt-4 space-y-3"><textarea required maxLength={4000} value={editMessage} onChange={(event) => setEditMessage(event.target.value)} className="admin-input" /><div className="flex gap-2"><button type="submit" disabled={pending} className="rounded-lg bg-ak-brand px-4 py-2 text-xs font-bold">حفظ</button><button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-ak-line px-4 py-2 text-xs">إلغاء</button></div></form>}
              </article>
            ))}
            {!data.items.length && <p className="py-6 text-center text-sm text-stone-500">لا توجد رسائل.</p>}
          </div>
        )}
        {data.hasMore && <button type="button" disabled={pending} onClick={() => void load(data.page + 1, true)} className="mt-4 text-sm text-ak-honey underline">تحميل رسائل إضافية</button>}
      </section>
      <style jsx>{`.admin-input{display:block;width:100%;margin-top:.5rem;border:1px solid rgba(255,255,255,.12);border-radius:.6rem;background:#171714;padding:.65rem .75rem;color:white}`}</style>
    </main>
  );
}
