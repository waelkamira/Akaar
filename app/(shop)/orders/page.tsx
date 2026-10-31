import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'طلباتي | Akaar',
  description: 'سجل الطلبات وحالة الشحنات والإيصالات.',
};

const statusNames: Record<string, string> = {
  PENDING: 'بانتظار التأكيد',
  PAID: 'مدفوع',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التسليم',
  CANCELLED: 'ملغي',
  REFUNDED: 'مسترد',
  PROCESSING: 'قيد التجهيز',
};
const orderStatusColors: Record<string, string> = {
  PENDING: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
  PAID: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  SHIPPED: 'border-sky-400/25 bg-sky-400/10 text-sky-200',
  DELIVERED: 'border-violet-400/25 bg-violet-400/10 text-violet-200',
  CANCELLED: 'border-rose-400/25 bg-rose-400/10 text-rose-200',
  REFUNDED: 'border-orange-400/25 bg-orange-400/10 text-orange-200',
  PROCESSING: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200',
};

function formatPrice(value: number) {
  return `${new Intl.NumberFormat('ar-SY').format(value)} ل.س`;
}

export default async function OrdersPage({ searchParams }: {
  searchParams: Promise<{ page?: string; checkout?: string }>;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Forders');

  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 100_000) : 1;
  const limit = 20;
  const [totalCount, orders] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            product: { select: { id: true, title: true, images: true } },
            vendorOrder: {
              select: {
                status: true,
                trackingNumber: true,
                seller: { select: { storeName: true, slug: true } },
              },
            },
          },
        },
        payments: {
          select: { amount: true, currency: true, method: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
  ]);
  const hasMore = page * limit < totalCount;

  return (
    <main dir="rtl" className="min-h-screen bg-transparent py-7 text-white sm:py-12">
      <div className="ak-page-shell max-w-5xl">
        <div className="ak-page-heading mb-8">
          <div><p className="ak-eyebrow mb-2">حسابك</p><h1 className="text-3xl font-black sm:text-4xl">طلباتي</h1><p className="mt-3 text-sm text-stone-400">تابع حالة الطلبات والشحنات والإيصالات.</p></div>
          <Link href="/search" className="ak-button-secondary">متابعة التسوق</Link>
        </div>
        {params.checkout === 'success' && (
          <p role="status" className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            عادت صفحة الدفع بنجاح. يظهر الطلب أدناه؛ لا يُعد مدفوعًا حتى يؤكد الخادم إشعار Stripe الموثّق.
          </p>
        )}

        {orders.length === 0 ? (
          <section className="ak-panel px-6 py-14 text-center">
            <h2 className="text-xl font-bold">لا توجد طلبات مسجلة</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-400">تظهر الطلبات التي أُنشئت من خلال عملية إتمام الشراء بعد تسجيل الدخول.</p>
            <Link href="/search" className="ak-button-primary mt-6">اكتشف المنتجات</Link>
          </section>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="ak-panel p-4 sm:p-6">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ak-line-strong/[.07] pb-4">
                  <div><p className="text-[10px] text-stone-500">رقم الطلب</p><p className="mt-1 break-all text-xs font-semibold">{order.id}</p><p className="mt-1 text-xs text-stone-500">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(order.createdAt)}</p></div>
                  <div className="flex flex-wrap items-center gap-3"><span className={`rounded-full border px-3 py-1 text-xs ${orderStatusColors[order.status] || 'border-ak-line bg-ak-surface text-stone-300'}`}>{statusNames[order.status] || order.status}</span><Link href={`/orders/${encodeURIComponent(order.id)}/invoice`} className="rounded-lg border border-ak-line px-3 py-2 text-xs hover:border-ak-amber/40">الإيصال</Link></div>
                </header>
                <div className="space-y-2 py-4">
                  {order.items.map((item) => {
                    const fulfillment = item.vendorOrder;
                    return (
                      <div key={item.id} className="ak-activity-row flex-wrap">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{item.product.title}</p>
                          <p className="mt-1 text-xs text-stone-500">{fulfillment?.seller.storeName || 'البائع'} · الكمية {item.quantity} · {formatPrice(item.unitPrice)} للوحدة</p>
                          {fulfillment && <p className={`mt-1 text-xs ${orderStatusColors[fulfillment.status]?.split(' ').at(-1) || 'text-stone-400'}`}>{statusNames[fulfillment.status] || fulfillment.status}{fulfillment.trackingNumber ? ` · رقم التتبع: ${fulfillment.trackingNumber}` : ''}</p>}
                        </div>
                        <p className="text-sm font-bold text-ak-honey">{formatPrice(item.totalPrice)}</p>
                      </div>
                    );
                  })}
                </div>
                <footer className="space-y-2 border-t border-ak-line-strong/[.07] pt-4 text-sm font-bold">
                  <div className="flex items-center justify-between"><span>إجمالي السعر الأساسي</span><span className="text-ak-honey">{formatPrice(order.totalPrice)}</span></div>
                  {order.payments.map((payment, index) => (
                    <div key={`${payment.method}-${index}`} className="flex items-center justify-between text-xs font-medium">
                      <span className={payment.status === 'COMPLETED' ? 'text-emerald-200' : payment.status === 'FAILED' || payment.status === 'REFUNDED' ? 'text-rose-200' : 'text-amber-200'}>{payment.method === 'STRIPE' ? 'Stripe card' : 'الدفع عند الاستلام'} · {payment.status === 'COMPLETED' ? 'مدفوع' : payment.status === 'FAILED' ? 'فشل الدفع' : payment.status === 'REFUNDED' ? 'مسترد' : 'بانتظار الدفع'}</span>
                      <span>{payment.currency === 'USD' ? (payment.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : formatPrice(payment.amount)}</span>
                    </div>
                  ))}
                </footer>
              </article>
            ))}
          </div>
        )}

        {(page > 1 || hasMore) && <nav aria-label="صفحات الطلبات" className="mt-8 flex justify-center gap-3">
          {page > 1 && <Link href={`/orders?page=${page - 1}`} className="rounded-xl border border-ak-line px-4 py-3 text-sm">السابقة</Link>}
          <span className="rounded-xl bg-ak-amber/10 px-4 py-3 text-sm text-ak-honey">صفحة {page}</span>
          {hasMore && <Link href={`/orders?page=${page + 1}`} className="rounded-xl border border-ak-line px-4 py-3 text-sm">التالية</Link>}
        </nav>}
      </div>
    </main>
  );
}
