import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import SubscribersClient from './subscribers-client';

export default async function ControlPanelSubscribersPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');
  return <SubscribersClient />;
}
