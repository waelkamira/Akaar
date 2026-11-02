import type { Metadata } from 'next';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import CartClient from '@/components/Cart/CartClient';

export const metadata: Metadata = { title: 'سلة التسوق | Akaar', description: 'راجع منتجاتك وأكمل طلب الشراء.' };

export default async function CartPage() {
  const user = await getAuthenticatedUser();
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-10 text-[#f5f3ed] sm:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="mb-8"><p className="text-sm text-orange-200">متجرك على أكار</p><h1 className="mt-2 text-3xl font-bold">سلة التسوق</h1><p className="mt-2 text-sm text-white/50">يمكنك حفظ المنتجات كضيف؛ تسجيل الدخول مطلوب لإتمام الطلب.</p></header>
      <CartClient initialItems={[]} />
    </div>
  </main>;
}
