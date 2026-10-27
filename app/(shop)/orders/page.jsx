'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaBoxOpen, FaCalendarAlt, FaChevronLeft, FaClipboardList, FaShoppingBag } from 'react-icons/fa';

const STATUS_LABELS = {
  PENDING: 'بانتظار المعالجة',
  PROCESSING: 'قيد التجهيز',
  SHIPPED: 'تم الشحن',
  IN_TRANSIT: 'في الطريق',
  DELIVERED: 'تم التسليم',
  CANCELLED: 'ملغي',
  CANCELED: 'ملغي',
  RETURNED: 'مرتجع',
  COMPLETED: 'مكتمل',
  PAID: 'مدفوع',
  FAILED: 'فشل الدفع',
};

function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('ar', { maximumFractionDigits: 0 }).format(value);
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(date);
}

function StatusBadge({ value }) {
  const status = String(value || 'PENDING').toUpperCase();
  const style = ['DELIVERED', 'COMPLETED', 'PAID'].includes(status)
    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
    : ['CANCELLED', 'CANCELED', 'FAILED'].includes(status)
      ? 'border-rose-400/20 bg-rose-400/10 text-rose-300'
      : 'border-[#C99B70]/20 bg-[#C99B70]/10 text-[#E5C5A5]';
  return <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${style}`}>{STATUS_LABELS[status] || status}</span>;
}

export default function OrdersPage() {
  const session = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/orders?page=1&limit=20', {
        signal,
        headers: { Accept: 'application/json' },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر تحميل الطلبات.');
      setOrders(Array.isArray(payload.orders) ? payload.orders : []);
    } catch (loadError) {
      if (loadError?.name !== 'AbortError') {
        setError(loadError?.message || 'تعذر تحميل الطلبات.');
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session.status !== 'authenticated') {
      setLoading(session.status === 'loading');
      return undefined;
    }
    const controller = new AbortController();
    loadOrders(controller.signal);
    return () => controller.abort();
  }, [session.status, loadOrders]);

  if (session.status === 'unauthenticated') {
    return (
      <main dir="rtl" className="min-h-[60vh] bg-[#141311] px-4 py-16 text-[#F5F0E9]">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#211F1B] p-8 text-center">
          <FaClipboardList className="mx-auto text-4xl text-[#C99B70]" aria-hidden="true" />
          <h1 className="mt-5 text-2xl font-bold">سجّل الدخول لعرض طلباتك</h1>
          <p className="mt-3 text-sm leading-7 text-stone-400">تظهر هنا الطلبات المرتبطة بحسابك بعد تسجيل الدخول.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#C99B70] px-6 py-3 text-sm font-bold text-[#171512] hover:bg-[#D9B18C]">تسجيل الدخول</Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-[60vh] bg-[#141311] px-4 py-10 text-[#F5F0E9] sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.24em] text-[#C99B70]">حسابك</p>
            <h1 className="text-3xl font-black sm:text-4xl">طلباتي</h1>
            <p className="mt-3 text-sm text-stone-400">تابع حالة الطلبات المسجلة على حسابك.</p>
          </div>
          <Link href="/search" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-stone-200 transition hover:border-[#C99B70]/40 hover:text-white">
            متابعة التسوق <FaChevronLeft aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4" aria-busy="true">
            {[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl border border-white/[.06] bg-white/[.04]" />)}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[.05] p-6 text-center">
            <p>{error}</p>
            <button type="button" onClick={() => loadOrders()} className="mt-4 rounded-xl bg-[#C99B70] px-5 py-3 text-sm font-bold text-[#171512]">إعادة المحاولة</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#211F1B] px-6 py-14 text-center">
            <FaBoxOpen className="mx-auto text-4xl text-[#C99B70]" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-bold">لا توجد طلبات مسجلة</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-400">
              عندما ينشأ طلب حقيقي من خلال نظام الطلبات ستظهر تفاصيله هنا. تجربة إتمام الشراء المحلية الحالية لا تنشئ طلبًا محفوظًا في قاعدة البيانات.
            </p>
            <Link href="/search" className="mt-6 inline-flex rounded-xl bg-[#C99B70] px-6 py-3 text-sm font-bold text-[#171512] hover:bg-[#D9B18C]">اكتشف المنتجات</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderItems = Array.isArray(order.items) && order.items.length
                ? order.items
                : [{ id: `legacy-${order.id}`, product: order.product, productId: order.productId, quantity: order.quantity, totalPrice: order.totalPrice }];
              return (
                <article key={order.id} className="rounded-2xl border border-white/[.08] bg-[#211F1B] p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.07] pb-4">
                    <div>
                      <p className="text-[10px] text-stone-500">رقم الطلب</p>
                      <p className="mt-1 break-all text-xs font-semibold text-stone-200">{order.id}</p>
                    </div>
                    <StatusBadge value={order.fulfillmentStatus || order.status} />
                  </div>
                  <div className="divide-y divide-white/[.06]">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#171512]">
                          {item.product?.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : <FaShoppingBag className="text-xl text-[#C99B70]" aria-hidden="true" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          {item.product?.id ? (
                            <Link href={`/post/${encodeURIComponent(item.product.id)}`} className="line-clamp-2 text-sm font-semibold text-stone-100 hover:text-[#E5C5A5]">{item.product.title || 'منتج'}</Link>
                          ) : <p className="text-sm font-semibold">منتج</p>}
                          <p className="mt-1 text-xs text-stone-400">الكمية: {formatNumber(item.quantity)}</p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-[#E5C5A5]">{formatNumber(item.totalPrice)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.07] pt-4">
                    <span className="inline-flex items-center gap-2 text-xs text-stone-400"><FaCalendarAlt aria-hidden="true" /> {formatDate(order.createdAt)}</span>
                    <p className="text-sm font-bold">الإجمالي المسجل: <span className="text-[#E5C5A5]">{formatNumber(order.totalPrice)}</span></p>
                  </div>
                  {order.payments?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.payments.map((payment) => <span key={payment.id} className="rounded-lg border border-white/[.08] px-3 py-1 text-[10px] text-stone-400">الدفع: {STATUS_LABELS[String(payment.status).toUpperCase()] || payment.status}</span>)}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
