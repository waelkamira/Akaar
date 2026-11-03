import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import ShippingClient from './shipping-client';

export default async function ControlPanelShippingPage() {
  const admin = await getControlPanelAdmin('control_panel.shipping.manage');
  if (!admin) redirect('/admin/dashboard');
  return <ShippingClient />;
}
