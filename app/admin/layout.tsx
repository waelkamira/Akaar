import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isControlPanelAdmin } from '@/lib/auth/control-panel-access.mjs';
import AdminWorkspaceNav from './admin-workspace-nav';

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/');

  return (
    <div dir="rtl" className="min-h-screen bg-ak-canvas text-white">
      <header className="border-b border-ak-line bg-ak-surface/90 shadow-ak-card backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="ak-eyebrow">AKaar ADMIN</p>
            <h1 className="mt-1 text-lg font-bold">إدارة المنصة</h1>
          </div>
        </div>
      </header>
      <AdminWorkspaceNav canManageControlPanel={isControlPanelAdmin(user)} />
      {children}
    </div>
  );
}
