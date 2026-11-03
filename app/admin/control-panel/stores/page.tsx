import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import StoresClient from './stores-client';

export default async function ControlPanelStoresPage() {
  const admin = await getControlPanelAdmin('control_panel.stores.manage');
  if (!admin) redirect('/admin/dashboard');
  return <StoresClient />;
}
