'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';

type AdminRole = 'GUEST' | 'CUSTOMER' | 'SELLER' | 'ADMIN';
type User = { id: string; email: string; userName: string | null; role: AdminRole; status: string; createdAt: string };
type UserPage = { items: User[]; page: number; hasMore: boolean };

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

export default function ControlPanelClient() {
  const [users, setUsers] = useState<UserPage>({ items: [], page: 1, hasMore: false });
  const [email, setEmail] = useState('');
  const [roleDrafts, setRoleDrafts] = useState<Record<string, AdminRole>>({});
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadUsers = useCallback(async (page = 1, append = false) => {
    const result = await readJson<UserPage>(await fetch(`/api/admin/control-panel/users?page=${page}&limit=20`, { cache: 'no-store' }));
    setError('');
    setUsers((current) => ({ ...result, items: append ? [...current.items, ...result.items] : result.items }));
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/control-panel/users?page=1&limit=20', { cache: 'no-store' })
      .then(readJson<UserPage>)
      .then((result) => {
        if (!active) return;
        setUsers(result);
        setError('');
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المستخدمين.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function addAdministrator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingAction('add-admin');
    setError('');
    setNotice('');
    try {
      await readJson(await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }));
      setEmail('');
      setNotice('تمت إضافة المدير. يمكنه تسجيل الدخول باستخدام Google بالبريد نفسه.');
      await loadUsers();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر إضافة المدير.');
    } finally {
      setPendingAction('');
    }
  }

  async function updateRole(user: User) {
    const role = roleDrafts[user.id];
    if (!role || role === user.role) return;
    setPendingAction(`role:${user.id}`);
    setError('');
    setNotice('');
    try {
      const updated = await readJson<{ id: string; role: AdminRole }>(await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      }));
      setUsers((current) => ({
        ...current,
        items: current.items.map((item) => item.id === updated.id ? { ...item, role: updated.role } : item),
      }));
      setRoleDrafts((current) => {
        const next = { ...current };
        delete next[user.id];
        return next;
      });
      setNotice('تم تحديث دور المستخدم.');
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر تحديث دور المستخدم.');
    } finally {
      setPendingAction('');
    }
  }

  async function deleteUser(user: User) {
    if (!window.confirm(`حذف حساب ${user.email} ومتجره ومنتجاته؟ إذا ارتبطت بياناته المالية بالحساب فلن يُسمح بالحذف.`)) return;
    setPendingAction(`delete:${user.id}`);
    setError('');
    setNotice('');
    try {
      await readJson(await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, { method: 'DELETE' }));
      setUsers((current) => ({ ...current, items: current.items.filter((item) => item.id !== user.id) }));
      setNotice('تم حذف الحساب ومحتواه المرتبط.');
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر حذف المستخدم.');
    } finally {
      setPendingAction('');
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:py-12">
      <header>
        <p className="ak-eyebrow">AKaar ADMIN</p>
        <h1 className="mt-2 text-3xl font-black">Control Panel</h1>
        <p className="mt-2 text-sm text-stone-400">إدارة المستخدمين والمديرين وإعدادات المنصة.</p>
      </header>

      <nav aria-label="أقسام الإدارة" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['/admin/dashboard#review-queue', 'مراجعة المنتجات والمتاجر'],
          ['/admin/dashboard#properties', 'إعلانات العقارات'],
          ['/admin/dashboard#platform-settings', 'إعدادات المنصة'],
          ['/admin/dashboard', 'لوحة المؤشرات'],
        ].map(([href, title]) => (
          <Link key={href} href={href} className="ak-panel p-4 text-sm font-semibold transition hover:border-ak-amber/40 hover:text-ak-honey">
            {title}
          </Link>
        ))}
      </nav>

      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}

      <section id="users" className="ak-panel scroll-mt-24 space-y-5 p-5">
        <div>
          <h2 className="text-xl font-bold">المستخدمون والمديرون</h2>
          <p className="mt-1 text-sm text-stone-400">غيّر الأدوار أو أضف مديرًا جديدًا. الحسابات المالية المحفوظة تحمي المستخدم من الحذف.</p>
        </div>

        <form onSubmit={(event) => void addAdministrator(event)} className="flex flex-wrap items-end gap-3 rounded-xl border border-ak-line-strong/[.08] p-4">
          <label htmlFor="admin-email" className="min-w-60 flex-1 text-sm font-semibold">
            البريد الإلكتروني للمدير الجديد
            <input id="admin-email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
          </label>
          <button type="submit" disabled={pendingAction === 'add-admin'} className="rounded-lg bg-ak-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            {pendingAction === 'add-admin' ? 'جارٍ الإضافة...' : 'إضافة مدير'}
          </button>
          <p className="w-full text-xs text-stone-500">يُنشأ الحساب دون كلمة مرور؛ يجب تسجيل الدخول باستخدام Google بالبريد نفسه.</p>
        </form>

        {loading ? <p aria-busy="true" className="text-sm text-stone-400">جارٍ تحميل المستخدمين...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-sm">
              <thead className="text-xs text-stone-400"><tr><th className="pb-3">المستخدم</th><th className="pb-3">الدور</th><th className="pb-3">الحالة</th><th className="pb-3">تاريخ الإنشاء</th><th className="pb-3">الإجراءات</th></tr></thead>
              <tbody>
                {users.items.map((user) => {
                  const protectedAdmin = isControlPanelAdminEmail(user.email);
                  return (
                    <tr key={user.id} className="border-t border-ak-line-strong/[.08]">
                      <td className="py-3"><p className="font-semibold">{user.userName || 'بدون اسم'}</p><p className="text-xs text-stone-500">{user.email}</p></td>
                      <td className="py-3">
                        {protectedAdmin ? user.role : (
                          <select aria-label={`دور ${user.email}`} value={roleDrafts[user.id] ?? user.role} onChange={(event) => setRoleDrafts((current) => ({ ...current, [user.id]: event.target.value as AdminRole }))} className="rounded-lg border border-ak-line bg-ak-ink px-2 py-1 text-white">
                            <option value="GUEST">GUEST</option><option value="CUSTOMER">CUSTOMER</option><option value="SELLER">SELLER</option><option value="ADMIN">ADMIN</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3">{user.status}</td>
                      <td className="py-3">{new Date(user.createdAt).toLocaleDateString('ar')}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          {!protectedAdmin && roleDrafts[user.id] && roleDrafts[user.id] !== user.role && (
                            <button type="button" disabled={pendingAction === `role:${user.id}`} onClick={() => void updateRole(user)} className="rounded-lg border border-emerald-400/30 px-3 py-2 text-xs text-emerald-200 disabled:opacity-50">حفظ الدور</button>
                          )}
                          {!protectedAdmin && (
                            <button type="button" disabled={pendingAction === `delete:${user.id}`} onClick={() => void deleteUser(user)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">
                              {pendingAction === `delete:${user.id}` ? 'جارٍ الحذف...' : 'حذف المستخدم'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!users.items.length && <tr><td colSpan={5} className="py-5 text-center text-stone-500">لا يوجد مستخدمون لعرضهم.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        {users.hasMore && <button type="button" disabled={Boolean(pendingAction)} onClick={() => void loadUsers(users.page + 1, true)} className="text-sm text-ak-honey underline disabled:opacity-50">تحميل مستخدمين إضافيين</button>}
      </section>
    </main>
  );
}
