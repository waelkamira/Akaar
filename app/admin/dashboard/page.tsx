import type { Metadata } from 'next';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import AdminDashboard from './dashboard-client';

export const metadata: Metadata = {
  title: 'لوحة الإدارة | Akaar',
  description: 'مؤشرات المبيعات والمستخدمين والبائعين ومراجعة المنتجات.',
};

export default async function AdminDashboardPage() {
  const controlPanelAdmin = await getControlPanelAdmin();
  return <AdminDashboard canManageUsers={Boolean(controlPanelAdmin)} />;
}
