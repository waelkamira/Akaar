import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import MessagesClient from './messages-client';

export default async function ControlPanelMessagesPage() {
  const admin = await getControlPanelAdmin('control_panel.messages.manage');
  if (!admin) redirect('/admin/dashboard');
  return <MessagesClient />;
}
