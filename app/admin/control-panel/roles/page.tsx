import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import RolesClient from './roles-client';

export default async function ControlPanelRolesPage() {
  const admin = await getControlPanelAdmin('control_panel.roles.manage');
  if (!admin) redirect('/admin/dashboard');
  return <RolesClient />;
}
