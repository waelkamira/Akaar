import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import ProfileDashboard from './profile-dashboard';

export const metadata: Metadata = {
  title: 'ملفي الشخصي | Akaar',
  description: 'إدارة معلوماتك وأمان حسابك والعقارات المحفوظة.',
};

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Fprofile');
  return <ProfileDashboard />;
}
