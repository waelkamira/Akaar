import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/');

  return (
    <div dir="rtl" className="min-h-screen bg-ak-canvas text-white">
      <header className="border-b border-ak-line bg-ak-surface/90 shadow-ak-card backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="ak-eyebrow">AKaar ADMIN</p>
            <h1 className="mt-1 text-lg font-bold">إدارة المنصة</h1>
          </div>
          <nav aria-label="تنقل الإدارة" className="flex flex-wrap gap-2 text-sm">
            <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 hover:bg-ak-brand-soft">لوحة المؤشرات</Link>
            <Link href="/users" className="rounded-lg px-3 py-2 hover:bg-ak-brand-soft">إدارة المستخدمين</Link>
            <Link href="/" className="rounded-lg px-3 py-2 hover:bg-ak-brand-soft">العودة للمتجر</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
