import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import SitePagesClient from './site-pages-client';

export default async function ControlPanelSitePagesPage() {
  const admin = await getControlPanelAdmin('control_panel.content.manage');
  if (!admin) redirect('/admin/dashboard');
  return <SitePagesClient />;
}
