'use client';

import { useState } from 'react';

type ReturnItem = {
  id: string;
  orderId: string;
  reason: string;
  status: string;
  refundAmount: number | null;
  createdAt: string;
  order: { totalPrice: number; status: string; customerName: string | null; user: { id: string; email: string; userName: string | null } };
};

const actions = [
  { value: 'UNDER_REVIEW', label: 'بدء المراجعة' },
  { value: 'APPROVED', label: 'الموافقة' },
  { value: 'REJECTED', label: 'الرفض' },
] as const;

export default function AdminReturns({ initialReturns }: { initialReturns: ReturnItem[] }) {
  const [items, setItems] = useState(initialReturns);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function update(id: string, status: (typeof actions)[number]['value']) {
    setPending(id);
    setError('');
    try {
      const response = await fetch('/api/admin/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر تحديث طلب الإرجاع.');
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر تحديث طلب الإرجاع.');
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p role="alert" className="rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-200">{error}</p> : null}
      {items.length ? items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="break-all font-mono text-xs text-slate-400">{item.orderId}</p>
              <p className="mt-2 font-semibold text-white">{item.order.customerName || item.order.user.userName || item.order.user.email}</p>
              <p className="mt-1 text-xs text-slate-400">{item.order.user.email}</p>
            </div>
            <span className="rounded-full border border-amber-200/20 px-3 py-1 text-xs text-amber-100">{item.status}</span>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">{item.reason}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <span className="text-sm text-slate-400">قيمة الطلب: {new Intl.NumberFormat('ar').format(item.order.totalPrice)} ل.س · {new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(new Date(item.createdAt))}</span>
            {['REQUESTED', 'UNDER_REVIEW'].includes(item.status) ? <div className="flex flex-wrap gap-2">{actions.filter((action) => action.value !== item.status).map((action) => <button key={action.value} type="button" disabled={pending !== null} onClick={() => update(item.id, action.value)} className={`rounded-xl border px-3 py-2 text-xs disabled:opacity-40 ${action.value === 'REJECTED' ? 'border-red-300/20 text-red-200' : 'border-emerald-300/20 text-emerald-200'}`}>{pending === item.id ? 'جارٍ الحفظ…' : action.label}</button>)}</div> : null}
          </div>
        </article>
      )) : <div className="rounded-2xl border border-white/10 bg-[#11182a] p-8 text-center text-sm text-slate-400">لا توجد طلبات إرجاع حتى الآن.</div>}
    </div>
  );
}
