import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import ControlPanelClient from './control-panel-client';

export const metadata: Metadata = {
  title: 'Control Panel | Akaar',
  description: 'إدارة كاملة لمنصة أكار.',
};

export default async function ControlPanelPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');

  return <ControlPanelClient />;
}
