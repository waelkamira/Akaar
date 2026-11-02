import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import ReturnRequests from '@/components/Returns/ReturnRequests';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'الإرجاع والاسترداد | Akaar', description: 'إنشاء طلبات إرجاع ومتابعة حالتها.' };

export default async function ReturnsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Freturns');

  const [orders, returns] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id, status: 'DELIVERED', updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { id: true, totalPrice: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    }),
    prisma.return.findMany({
      where: { order: { userId: user.id } },
      select: { id: true, orderId: true, reason: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ]);

  const eligibleOrders = orders.map((order) => ({
    id: order.id,
    totalPrice: order.totalPrice,
    deliveredAt: order.updatedAt.toISOString(),
  }));
  const initialReturns = returns.map((item) => ({
    id: item.id,
    orderId: item.orderId,
    reason: item.reason,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
  }));

  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-4xl">
    <EntitySectionHeading eyebrow="حسابي" title="الإرجاع والاسترداد" description="قدّم طلب إرجاع للطلبات المسلّمة وتابع حالة الطلبات السابقة." href="/orders" linkLabel="العودة إلى طلباتي" />
    <ReturnRequests eligibleOrders={eligibleOrders} initialReturns={initialReturns} />
  </div></main>;
}
