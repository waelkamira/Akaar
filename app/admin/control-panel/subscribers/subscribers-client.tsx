'use client';

import { useCallback, useEffect, useState } from 'react';

type Subscriber = { id: string; email: string; confirmedAt: string; createdAt: string };
type SubscriberPage = { items: Subscriber[]; page: number; totalCount: number; hasMore: boolean };

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

export default function SubscribersClient() {
  const [data, setData] = useState<SubscriberPage>({ items: [], page: 1, totalCount: 0, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState('');

  const load = useCallback(async (page = 1, append = false) => {
    const result = await readJson<SubscriberPage>(await fetch(`/api/admin/control-panel/subscribers?page=${page}&limit=20`, { cache: 'no-store' }));
    setData((current) => ({ ...result, items: append ? [...current.items, ...result.items] : result.items }));
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/control-panel/subscribers?page=1&limit=20', { cache: 'no-store' })
      .then(readJson<SubscriberPage>)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المشتركين.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [load]);

  async function deleteSubscriber(subscriber: Subscriber) {
    if (!window.confirm(`حذف اشتراك ${subscriber.email}؟`)) return;
    setPendingId(subscriber.id);
    setError('');
    try {
      await readJson(await fetch(`/api/admin/control-panel/subscribers/${encodeURIComponent(subscriber.id)}`, { method: 'DELETE' }));
      setData((current) => ({ ...current, items: current.items.filter((item) => item.id !== subscriber.id), totalCount: Math.max(0, current.totalCount - 1) }));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الاشتراك.');
    } finally {
      setPendingId('');
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:py-12">
      <header>
        <p className="ak-eyebrow">NEWSLETTER</p>
        <h1 className="mt-2 text-3xl font-black">مشتركو النشرة البريدية</h1>
        <p className="mt-2 text-sm text-stone-400">تظهر الاشتراكات المؤكدة فقط. يمكن حذف بيانات الاشتراك عند الطلب.</p>
      </header>
      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {loading ? <p aria-busy="true">جارٍ تحميل القائمة...</p> : (
        <section className="ak-panel space-y-4 p-5">
          <p className="text-sm text-stone-400">الإجمالي النشط: {data.totalCount.toLocaleString('ar')}</p>
          <div className="divide-y divide-ak-line">
            {data.items.map((subscriber) => (
              <article key={subscriber.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div><p className="font-semibold">{subscriber.email}</p><p className="mt-1 text-xs text-stone-500">تأكيد: {new Date(subscriber.confirmedAt).toLocaleDateString('ar')}</p></div>
                <button type="button" disabled={Boolean(pendingId)} onClick={() => void deleteSubscriber(subscriber)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">{pendingId === subscriber.id ? 'جارٍ الحذف...' : 'حذف الاشتراك'}</button>
              </article>
            ))}
            {!data.items.length && <p className="py-4 text-sm text-stone-500">لا توجد اشتراكات نشطة.</p>}
          </div>
          {data.hasMore && <button type="button" onClick={() => void load(data.page + 1, true)} className="text-sm text-ak-honey underline">تحميل المزيد</button>}
        </section>
      )}
    </main>
  );
}
