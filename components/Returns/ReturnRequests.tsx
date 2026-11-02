'use client';

import { useState, type FormEvent } from 'react';

type EligibleOrder = { id: string; totalPrice: number; deliveredAt: string };
type ReturnRecord = { id: string; orderId: string; reason: string; status: string; createdAt: string };

export default function ReturnRequests({
  eligibleOrders,
  initialReturns,
}: {
  eligibleOrders: EligibleOrder[];
  initialReturns: ReturnRecord[];
}) {
  const [returns, setReturns] = useState(initialReturns);
  const [orderId, setOrderId] = useState(eligibleOrders[0]?.id || '');
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر إرسال طلب الإرجاع.');
      setReturns((current) => [payload.returnRequest, ...current]);
      setReason('');
      setNotice('تم استلام طلب الإرجاع وسيظهر ضمن سجل الطلبات.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر إرسال طلب الإرجاع.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      {eligibleOrders.length ? (
        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-[#202725] p-5">
          <h2 className="text-lg font-semibold">إنشاء طلب إرجاع</h2>
          <p className="mt-1 text-sm text-white/50">تتاح الطلبات المسلّمة خلال 30 يومًا من تاريخ التسليم المسجل.</p>
          <label className="mt-5 block text-sm text-white/75" htmlFor="return-order">الطلب</label>
          <select id="return-order" value={orderId} onChange={(event) => setOrderId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-[#171c1a] p-3 text-sm text-white">
            {eligibleOrders.map((order) => <option key={order.id} value={order.id}>{order.id} — {new Intl.NumberFormat('ar').format(order.totalPrice)} ل.س</option>)}
          </select>
          <label className="mt-4 block text-sm text-white/75" htmlFor="return-reason">سبب الإرجاع</label>
          <textarea id="return-reason" value={reason} onChange={(event) => setReason(event.target.value)} minLength={10} maxLength={2000} required rows={4} placeholder="اشرح سبب طلب الإرجاع بالتفصيل…" className="mt-2 w-full rounded-xl border border-white/15 bg-[#171c1a] p-3 text-sm text-white placeholder:text-white/30" />
          {error ? <p role="alert" className="mt-3 text-sm text-red-200">{error}</p> : null}
          {notice ? <p role="status" className="mt-3 text-sm text-emerald-200">{notice}</p> : null}
          <button type="submit" disabled={pending || !orderId || reason.trim().length < 10} className="mt-4 rounded-xl bg-orange-200 px-5 py-3 text-sm font-semibold text-[#171c1a] disabled:cursor-not-allowed disabled:opacity-40">{pending ? 'جارٍ إرسال الطلب…' : 'إرسال طلب الإرجاع'}</button>
        </form>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#202725] p-5 text-sm leading-7 text-white/60">لا توجد طلبات مسلّمة مؤهلة للإرجاع حاليًا. لا يمكن طلب الإرجاع إلا بعد التسليم وخلال المهلة المحددة.</div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">سجل طلبات الإرجاع</h2>
        {returns.length ? <div className="space-y-3">{returns.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5">
          <div className="flex flex-wrap justify-between gap-2"><span className="font-mono text-xs text-white/55">{item.orderId}</span><span className="rounded-full border border-orange-200/20 px-3 py-1 text-xs text-orange-100">{item.status}</span></div>
          <p className="mt-3 text-sm leading-7">{item.reason}</p>
          <p className="mt-2 text-xs text-white/40">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}</p>
        </article>)}</div> : <p className="rounded-2xl border border-white/10 bg-[#202725] p-5 text-sm text-white/50">لم تنشئ طلبات إرجاع بعد.</p>}
      </section>
    </div>
  );
}
