import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/require-auth';
import SettingsClient from './settings-client';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/admin/dashboard');

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:py-12">
      <header><p className="ak-eyebrow">PLATFORM CONFIGURATION</p><h1 className="mt-2 text-3xl font-black">إعدادات المنصة</h1><p className="mt-2 text-sm text-stone-400">إدارة مفاتيح تشغيل السوق ومتابعة مؤشرات الزيارات في مساحة مستقلة.</p></header>
      <SettingsClient />
    </main>
  );
}
