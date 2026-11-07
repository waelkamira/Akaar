'use client';

import { useCallback, useEffect, useState } from 'react';

type SellerOrder = {
  id: string;
  status: string;
  totalPrice: number;
  currency: string;
  trackingNumber: string | null;
  carrierName: string | null;
  order: {
    id: string;
    orderNumber: string;
    createdAt: string;
    customerName: string | null;
    phoneNumber: string | null;
    shippingCity: string | null;
    shippingAddress: string | null;
  };
  items: Array<{ id: string; quantity: number; totalPrice: number; product: { title: string } }>;
};

const nextStatus: Record<string, string> = {
  PENDING: 'PROCESSING',
  ACCEPTED: 'PROCESSING',
  PROCESSING: 'SHIPPED',
  READY_TO_SHIP: 'SHIPPED',
  SHIPPED: 'DELIVERED',
};

async function requestJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال العملية.');
  return payload as T;
}

export default function SellerOrdersClient() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await requestJson<{ orders: SellerOrder[] }>(await fetch('/api/seller/orders', { cache: 'no-store' }));
      setOrders(payload.orders);
      setTracking(Object.fromEntries(payload.orders.map((order) => [order.id, order.trackingNumber || ''])));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الطلبات.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function advance(order: SellerOrder) {
    const status = nextStatus[order.status];
    if (!status) return;
    setBusy(order.id);
    setError('');
    try {
      await requestJson(await fetch('/api/seller/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorOrderId: order.id, status, trackingNumber: tracking[order.id] || '' }),
      }));
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'تعذر تحديث حالة الطلب.');
    } finally {
      setBusy('');
    }
  }

  async function cancel(order: SellerOrder) {
    if (!window.confirm('هل تريد إلغاء هذا الطلب؟ ستُعاد الكميات المحجوزة إلى مخزون متجرك.')) return;
    setBusy(order.id);
    setError('');
    try {
      await requestJson(await fetch('/api/seller/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorOrderId: order.id, status: 'CANCELLED' }),
      }));
      await load();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'تعذر إلغاء الطلب.');
    } finally {
      setBusy('');
    }
  }

  return (
    <main dir="rtl" className="mx-auto min-h-screen max-w-[1500px] px-4 py-7 text-[#f5f3ed] sm:px-7">
      <header className="mb-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-200">تنفيذ الطلبات</p><h1 className="mt-2 text-3xl font-black">طلبات متجري</h1><p className="mt-2 text-sm text-white/55">تحديث مراحل الطلبات المسندة إلى متجرك، وإدخال رقم التتبع عند الشحن.</p></header>
      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200">{error}</p>}
      {loading ? <section className="rounded-2xl border border-white/10 bg-[#202725] p-5" aria-busy="true">جارٍ تحميل الطلبات...</section> : !orders.length ? <section className="rounded-2xl border border-dashed border-white/10 bg-[#202725] p-10 text-center text-sm text-white/50">لا توجد طلبات مرتبطة بمتجرك بعد.</section> : (
        <div className="space-y-4">
          {orders.map((order) => <article key={order.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5">
            <div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs text-white/45">طلب {order.order.orderNumber}</p><p className="mt-1 text-sm">{order.order.customerName || 'عميل'} · {order.order.shippingCity || 'مدينة غير محددة'}</p><p className="mt-1 text-xs text-white/45">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(new Date(order.order.createdAt))}</p></div><span className="rounded-full border border-orange-200/20 px-3 py-1 text-xs text-orange-100">{order.status}</span></div>
            <div className="my-4 space-y-2 border-y border-white/10 py-4">{order.items.map((item) => <div key={item.id} className="flex flex-wrap justify-between gap-2 text-sm"><span>{item.product.title}</span><span className="text-white/55">{item.quantity} قطعة</span></div>)}</div>
            <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="font-bold text-orange-100">{new Intl.NumberFormat('ar', { maximumFractionDigits: 2 }).format(order.totalPrice)} {order.currency}</p><p className="mt-1 text-xs text-white/50">{order.carrierName || 'شركة الشحن غير محددة'} · {tracking[order.id] || 'لا يوجد رقم تتبع'}</p></div>
              {nextStatus[order.status] && <form className="flex flex-wrap gap-2" onSubmit={(event) => {
                event.preventDefault();
                void advance(order);
              }}>
                {nextStatus[order.status] === 'SHIPPED' && <input value={tracking[order.id] || ''} onChange={(event) => setTracking((current) => ({ ...current, [order.id]: event.target.value }))} maxLength={128} placeholder="رقم التتبع" className="rounded-xl border border-white/10 bg-[#171c1a] px-3 py-2 text-sm" dir="ltr" />}
                <button disabled={busy === order.id} className="rounded-xl border border-orange-300/30 bg-orange-300/10 px-4 py-2 text-sm font-bold text-orange-100 disabled:opacity-50">{busy === order.id ? 'جارٍ التحديث...' : `نقل إلى ${nextStatus[order.status]}`}</button>
              </form>}
              {['PENDING', 'ACCEPTED', 'PROCESSING', 'READY_TO_SHIP'].includes(order.status) && <button type="button" disabled={busy === order.id} onClick={() => void cancel(order)} className="rounded-xl border border-rose-300/20 px-4 py-2 text-sm text-rose-200 disabled:opacity-50">إلغاء الطلب</button>}
            </div>
          </article>)}
        </div>
      )}
    </main>
  );
}
