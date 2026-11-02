import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import ProfileSettingsForm from '@/components/Profile/ProfileSettingsForm';
import PasswordSettingsForm from '@/components/Profile/PasswordSettingsForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'إعدادات الحساب | Akaar',
  description: 'تعديل الاسم وصورة الملف الشخصي.',
};

export default async function ProfileSettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Fprofile%2Fsettings');

  return (
    <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-10 text-[#f5f3ed] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <a href="/profile" className="text-sm text-orange-200 hover:text-orange-100">← العودة إلى حسابي</a>
        <header className="mb-8 mt-5">
          <p className="text-xs font-semibold tracking-[.2em] text-orange-200">ACCOUNT SETTINGS</p>
          <h1 className="mt-2 text-3xl font-bold">إعدادات الحساب</h1>
          <p className="mt-3 text-sm leading-7 text-white/55">حدّث اسم العرض وصورة ملفك الشخصي. يتم حفظ التغييرات في حسابك مباشرة.</p>
        </header>
        <ProfileSettingsForm />
        <PasswordSettingsForm />
      </div>
    </main>
  );
}
