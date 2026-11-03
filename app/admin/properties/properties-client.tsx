'use client';

import { useState } from 'react';

export type AdminListing = {
  id: string;
  title: string;
  price: string;
  currency: string;
  location: string;
  city: string | null;
  status: string;
  isPublished: boolean;
  createdAt: string;
  owner: { email: string; userName: string | null };
  store: { name: string };
};

export default function PropertiesClient({ initialItems }: { initialItems: AdminListing[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState('');

  async function deleteListing(item: AdminListing) {
    if (!window.confirm(`إخفاء الإعلان «${item.title}»؟ سيبقى محفوظًا مع سجل الحجوزات والمفضلة.`)) return;
    setPendingId(item.id);
    setError('');
    try {
      const response = await fetch(`/api/admin/properties/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر حذف الإعلان.');
      setItems((current) => current.map((entry) => entry.id === item.id
        ? { ...entry, isPublished: false, status: 'UNAVAILABLE' }
        : entry));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الإعلان.');
    } finally {
      setPendingId('');
    }
  }

  return (
    <section className="ak-panel p-5">
      {error && <p role="alert" className="mb-4 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
      <h2 className="mb-4 text-lg font-bold">أحدث الإعلانات العقارية</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-right text-sm">
          <thead className="text-xs text-stone-500"><tr><th className="pb-3">الإعلان</th><th className="pb-3">المالك / الوكالة</th><th className="pb-3">الموقع</th><th className="pb-3">السعر</th><th className="pb-3">الحالة</th><th className="pb-3">إجراء</th></tr></thead>
          <tbody>{items.map((item) => (
            <tr key={item.id} className="border-t border-ak-line-strong/[.08]">
              <td className="py-3 font-semibold">{item.title}<p className="mt-1 text-[10px] text-stone-500">{new Date(item.createdAt).toLocaleDateString('ar')}</p></td>
              <td className="py-3">{item.owner.userName || item.owner.email}<p className="text-xs text-stone-500">{item.store.name}</p></td>
              <td className="py-3">{item.city ? `${item.city} · ` : ''}{item.location}</td>
              <td className="py-3 text-ak-honey">{new Intl.NumberFormat('ar').format(Number(item.price))} {item.currency}</td>
              <td className="py-3"><span className={`rounded-full px-3 py-1 text-xs ${item.isPublished ? 'bg-emerald-400/10 text-emerald-200' : 'bg-stone-500/10 text-stone-300'}`}>{item.isPublished ? 'منشور' : 'مخفي'} · {item.status}</span></td>
              <td className="py-3"><button type="button" disabled={Boolean(pendingId) || !item.isPublished} onClick={() => void deleteListing(item)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">{pendingId === item.id ? 'جارٍ الإخفاء...' : item.isPublished ? 'إخفاء' : 'مخفي'}</button></td>
            </tr>
          ))}
          {!items.length && <tr><td colSpan={6} className="py-5 text-center text-stone-500">لا توجد إعلانات عقارية.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-stone-500">يعرض الجدول أحدث 100 إعلان. استخدم تحليلات لوحة الإدارة لمتابعة المؤشرات الإجمالية.</p>
    </section>
  );
}
