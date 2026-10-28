import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import SellerDashboard from './dashboard-client';

export const metadata: Metadata = {
  title: 'متجري ووكالتي | Akaar',
  description: 'إدارة متجرك وإعلاناتك العقارية ومنتجاتك وطلباتك.',
};

export default async function SellerDashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');
  if (user.role === 'ADMIN') redirect('/admin/dashboard');
  if (user.role !== 'SELLER' && user.role !== 'CUSTOMER') redirect('/');

  return <SellerDashboard />;
}
