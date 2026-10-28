import type { Metadata } from 'next';
import AdminDashboard from './dashboard-client';

export const metadata: Metadata = {
  title: 'لوحة الإدارة | Akaar',
  description: 'مؤشرات المبيعات والمستخدمين والبائعين ومراجعة المنتجات.',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
