import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import CartClient from '@/components/Cart/CartClient';

export const metadata: Metadata = { title: 'سلة التسوق | Akaar', description: 'راجع منتجاتك وأكمل طلب الشراء.' };

export default async function CartPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Fcart');
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    select: {
      items: {
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true, quantity: true,
          product: {
            select: {
              id: true, title: true, images: true, basePrice: true, stockQuantity: true,
              isActive: true, isDeleted: true, approvalStatus: true,
              seller: { select: { status: true, isVerified: true, storeName: true } },
            },
          },
        },
      },
    },
  });
  const initialItems = (cart?.items || []).filter(item =>
    item.product.isActive && !item.product.isDeleted &&
    item.product.approvalStatus === 'APPROVED' &&
    item.product.seller?.status === 'ACTIVE' && item.product.seller.isVerified
  );
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-10 text-[#f5f3ed] sm:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="mb-8"><p className="text-sm text-orange-200">متجرك على أكار</p><h1 className="mt-2 text-3xl font-bold">سلة التسوق</h1><p className="mt-2 text-sm text-white/50">الأسعار والمخزون النهائيان يُتحقق منهما عند تأكيد الطلب.</p></header>
      <CartClient initialItems={initialItems}/>
    </div>
  </main>;
}
