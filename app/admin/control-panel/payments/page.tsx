import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import PaymentsClient from './payments-client';

export default async function ControlPanelPaymentsPage() {
  const admin = await getControlPanelAdmin('control_panel.finance.manage');
  if (!admin) redirect('/admin/dashboard');
  return <PaymentsClient />;
}
