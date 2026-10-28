import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import PrintReceiptButton from './print-button';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ id: string }> };

function price(value: number) {
  return `${new Intl.NumberFormat('ar-SY').format(value)} ل.س`;
}

async function findOwnedOrder(id: string, userId: string) {
  return prisma.order.findFirst({
    where: { id, userId },
    select: {
      id: true,
      status: true,
      totalPrice: true,
      createdAt: true,
      customerName: true,
      phoneNumber: true,
      shippingCity: true,
      shippingAddress: true,
      items: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          totalPrice: true,
          product: { select: { title: true } },
          vendorOrder: {
            select: {
              status: true,
              trackingNumber: true,
              seller: { select: { storeName: true } },
            },
          },
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { status: true, method: true, paidAt: true },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  if (!user) return { title: 'إيصال الطلب | Akaar' };
  const order = await findOwnedOrder(id, user.id);
  return { title: order ? `إيصال الطلب ${order.id.slice(0, 8)} | Akaar` : 'إيصال الطلب | Akaar' };
}

export default async function OrderInvoicePage({ params }: Props) {
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent('/orders')}`);
  const { id } = await params;
  const order = await findOwnedOrder(id, user.id);
  if (!order) notFound();

  const payment = order.payments[0];
  return (
    <main dir="rtl" className="min-h-screen bg-ak-ink px-4 py-10 text-ak-cream">
      <article className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-ak-surface p-6 sm:p-10 print:max-w-none print:border-0 print:bg-white print:text-black print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6 print:border-black/20">
          <div><p className="text-sm font-bold tracking-widest text-ak-amber print:text-black">AKAAR</p><h1 className="mt-3 text-2xl font-black">إيصال طلب</h1><p className="mt-2 text-sm text-stone-400 print:text-gray-600">إثبات تسجيل الطلب — ليس فاتورة ضريبية.</p></div>
          <div className="text-left text-sm"><p className="text-stone-400 print:text-gray-600">رقم الطلب</p><p className="mt-1 break-all font-semibold">{order.id}</p><p className="mt-2 text-stone-400 print:text-gray-600">التاريخ</p><p className="mt-1">{new Intl.DateTimeFormat('ar', { dateStyle: 'long', timeStyle: 'short' }).format(order.createdAt)}</p></div>
        </header>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <p>حالة الطلب: <strong>{order.status}</strong></p>
          <p>حالة الدفع: <strong>{payment?.status || 'PENDING'}</strong></p>
          <p>طريقة الدفع: <strong>{payment?.method === 'CASH_ON_DELIVERY' ? 'الدفع عند الاستلام' : payment?.method || 'غير محدد'}</strong></p>
          {payment?.paidAt && <p>تاريخ الدفع: <strong>{new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(payment.paidAt)}</strong></p>}
        </div>
        <section className="mt-6 rounded-xl border border-white/10 p-4 text-sm print:border-black/20">
          <h2 className="font-bold">بيانات التوصيل</h2>
          <p className="mt-2 text-stone-300 print:text-gray-700">{order.customerName || '—'} · {order.phoneNumber || '—'}</p>
          <p className="mt-1 text-stone-300 print:text-gray-700">{order.shippingCity || '—'} · {order.shippingAddress || '—'}</p>
        </section>

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[480px] text-right text-sm">
            <thead><tr className="border-b border-white/10 text-xs text-stone-500 print:border-black/20 print:text-gray-600"><th className="py-3">المنتج والبائع</th><th className="py-3">الكمية</th><th className="py-3">سعر الوحدة</th><th className="py-3">الإجمالي</th></tr></thead>
            <tbody>{order.items.map((item) => <tr key={item.id} className="border-b border-white/[.06] print:border-black/10"><td className="py-4"><p className="font-semibold">{item.product.title}</p><p className="mt-1 text-xs text-stone-500 print:text-gray-600">{item.vendorOrder?.seller.storeName || 'البائع'} · {item.vendorOrder?.status || order.status}{item.vendorOrder?.trackingNumber ? ` · تتبع ${item.vendorOrder.trackingNumber}` : ''}</p></td><td>{item.quantity}</td><td>{price(item.unitPrice)}</td><td className="font-semibold">{price(item.totalPrice)}</td></tr>)}</tbody>
          </table>
        </div>

        <footer className="mt-5 flex justify-end border-t border-white/10 pt-5 text-lg font-black print:border-black/20">الإجمالي: <span className="mr-3 text-ak-honey print:text-black">{price(order.totalPrice)}</span></footer>
        <div className="mt-8 flex flex-wrap justify-between gap-3 print:hidden"><Link href="/orders" className="rounded-xl border border-white/10 px-4 py-3 text-sm">العودة إلى طلباتي</Link><PrintReceiptButton /></div>
      </article>
    </main>
  );
}
