'use client';

import { useMemo, useState } from 'react';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

type NotificationItem = {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

async function sendAction(method: 'PATCH' | 'DELETE', payload: Record<string, unknown>) {
  const response = await fetch('/api/notifications', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'تعذر تنفيذ العملية.');
  return result as { updated?: number; deleted?: number };
}

export default function NotificationsInbox({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[];
}) {
  const [items, setItems] = useState(initialNotifications);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState('');
  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

  async function markRead(id: string) {
    setPending(id);
    setError('');
    try {
      await sendAction('PATCH', { id });
      setItems((current) => current.map((item) => item.id === id ? { ...item, isRead: true } : item));
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر تحديث الإشعار.');
    } finally {
      setPending(null);
    }
  }

  async function markAllRead() {
    setPending('all-read');
    setError('');
    try {
      await sendAction('PATCH', { markAll: true });
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر تحديث الإشعارات.');
    } finally {
      setPending(null);
    }
  }

  async function deleteNotification(id: string) {
    setPending(id);
    setError('');
    try {
      await sendAction('DELETE', { id });
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر حذف الإشعار.');
    } finally {
      setPending(null);
    }
  }

  async function deleteAll() {
    if (!window.confirm('هل تريد حذف جميع إشعاراتك؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setPending('all-delete');
    setError('');
    try {
      await sendAction('DELETE', { deleteAll: true });
      setItems([]);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر حذف الإشعارات.');
    } finally {
      setPending(null);
    }
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4">
        <p className="text-sm text-white/65">غير المقروء: <strong className="text-orange-200">{unreadCount}</strong></p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={markAllRead} disabled={!unreadCount || pending !== null} className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/80 transition hover:border-orange-200/50 disabled:cursor-not-allowed disabled:opacity-40">تعليم الكل كمقروء</button>
          <button type="button" onClick={deleteAll} disabled={!items.length || pending !== null} className="rounded-xl border border-red-300/20 px-3 py-2 text-xs text-red-200 transition hover:bg-red-300/10 disabled:cursor-not-allowed disabled:opacity-40">حذف الكل</button>
        </div>
      </div>
      {error ? <p role="alert" className="mb-4 rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-200">{error}</p> : null}
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className={`rounded-2xl border p-5 ${item.isRead ? 'border-white/10 bg-[#202725]' : 'border-orange-300/25 bg-orange-300/[.05]'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="leading-7">{item.message}</p>
                  <p className="mt-2 text-xs text-white/40">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}</p>
                </div>
                <EntityStatusBadge status={item.isRead ? 'COMPLETED' : 'PENDING'} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3">
                <p className="text-xs text-white/40">النوع: {item.type}</p>
                <div className="flex gap-3 text-xs">
                  {!item.isRead ? <button type="button" onClick={() => markRead(item.id)} disabled={pending !== null} className="text-orange-200 hover:text-orange-100 disabled:opacity-40">{pending === item.id ? 'جارٍ التحديث…' : 'تعليم كمقروء'}</button> : null}
                  <button type="button" onClick={() => deleteNotification(item.id)} disabled={pending !== null} className="text-red-200/80 hover:text-red-100 disabled:opacity-40">حذف</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EntityEmptyState title="لا توجد إشعارات" description="ستظهر هنا الإشعارات المرتبطة بحسابك عندما تُنشأ من النظام." actionLabel="متابعة التسوق" actionHref="/" />
      )}
    </section>
  );
}
