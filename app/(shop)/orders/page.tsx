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

function formatPrice(value: number) {
  return `${new Intl.NumberFormat('ar-SY').format(value)} ل.س`;
}

export default async function OrdersPage({ searchParams }: {
  searchParams: Promise<{ page?: string }>;
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
      },
    }),
  ]);
  const hasMore = page * limit < totalCount;

  return (
    <main dir="rtl" className="min-h-screen bg-ak-ink px-4 py-10 text-white sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.24em] text-ak-amber">حسابك</p><h1 className="text-3xl font-black sm:text-4xl">طلباتي</h1><p className="mt-3 text-sm text-stone-400">تابع حالة الطلبات والشحنات والإيصالات.</p></div>
          <Link href="/search" className="rounded-xl border border-ak-line px-4 py-3 text-sm hover:border-ak-amber/40">متابعة التسوق</Link>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-3xl border border-ak-line bg-ak-surface px-6 py-14 text-center">
            <h2 className="text-xl font-bold">لا توجد طلبات مسجلة</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-400">تظهر الطلبات التي أُنشئت من خلال عملية إتمام الشراء بعد تسجيل الدخول.</p>
            <Link href="/search" className="mt-6 inline-flex rounded-xl bg-ak-amber px-6 py-3 text-sm font-bold text-ak-ink">اكتشف المنتجات</Link>
          </section>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-ak-line-strong/[.08] bg-ak-surface p-4 sm:p-6">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ak-line-strong/[.07] pb-4">
                  <div><p className="text-[10px] text-stone-500">رقم الطلب</p><p className="mt-1 break-all text-xs font-semibold">{order.id}</p><p className="mt-1 text-xs text-stone-500">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(order.createdAt)}</p></div>
                  <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-ak-amber/20 bg-ak-amber/10 px-3 py-1 text-xs text-ak-honey">{statusNames[order.status] || order.status}</span><Link href={`/orders/${encodeURIComponent(order.id)}/invoice`} className="rounded-lg border border-ak-line px-3 py-2 text-xs hover:border-ak-amber/40">الإيصال</Link></div>
                </header>
                <div className="divide-y divide-white/[.06]">
                  {order.items.map((item) => {
                    const fulfillment = item.vendorOrder;
                    return (
                      <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{item.product.title}</p>
                          <p className="mt-1 text-xs text-stone-500">{fulfillment?.seller.storeName || 'البائع'} · الكمية {item.quantity} · {formatPrice(item.unitPrice)} للوحدة</p>
                          {fulfillment && <p className="mt-1 text-xs text-ak-honey">{statusNames[fulfillment.status] || fulfillment.status}{fulfillment.trackingNumber ? ` · رقم التتبع: ${fulfillment.trackingNumber}` : ''}</p>}
                        </div>
                        <p className="text-sm font-bold text-ak-honey">{formatPrice(item.totalPrice)}</p>
                      </div>
                    );
                  })}
                </div>
                <footer className="border-t border-ak-line-strong/[.07] pt-4 text-left text-sm font-bold">الإجمالي: <span className="text-ak-honey">{formatPrice(order.totalPrice)}</span></footer>
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
