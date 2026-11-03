import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminUser, getControlPanelAdmin } from '@/lib/auth/require-auth';
import AdminDashboard from './dashboard-client';

export const metadata: Metadata = {
  title: 'لوحة الإدارة | Akaar',
  description: 'مؤشرات المبيعات والمستخدمين والبائعين ومراجعة المنتجات.',
};

export default async function AdminDashboardPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/');
  const controlPanelAdmin = await getControlPanelAdmin('control_panel.users.manage');
  return <AdminDashboard canManageUsers={Boolean(controlPanelAdmin)} />;
}
