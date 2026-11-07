import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import SellerNavigation from './seller-navigation';

export const metadata: Metadata = {
  title: { default: 'مركز البائع | Akaar', template: '%s | مركز البائع' },
};

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Fseller%2Fdashboard');
  if (user.role === 'ADMIN') redirect('/admin/control-panel');
  if (user.role !== 'SELLER' && user.role !== 'CUSTOMER') redirect('/');

  return (
    <div dir="rtl" className="min-h-screen bg-[#171c1a] text-[#f5f3ed]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#171c1a]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center gap-5 px-4 py-3 sm:px-7">
          <Link href="/seller/dashboard" className="shrink-0 text-lg font-black tracking-tight text-orange-200">Akaar <span className="text-xs font-semibold text-white/50">للبائعين</span></Link>
          <SellerNavigation />
        </div>
      </header>
      {children}
    </div>
  );
}
