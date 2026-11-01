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
    <div dir="rtl" className="min-h-screen bg-[#0b1020] text-slate-100">
      <header className="border-b border-white/[.07] bg-[#0d1424]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-slate-950 shadow-lg shadow-orange-500/15">
              <span className="text-xl font-black">A</span>
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-[.22em] text-amber-200/80">AKAAR · ADMIN</p>
              <h1 className="mt-0.5 text-sm font-bold text-white sm:text-base">مركز إدارة المنصة</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[.06] px-3 py-2 text-xs text-emerald-200 sm:flex">
            <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" />
            مساحة الإدارة آمنة
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-3 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:gap-6">
        <AdminWorkspaceNav canManageControlPanel={isControlPanelAdmin(user)} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
