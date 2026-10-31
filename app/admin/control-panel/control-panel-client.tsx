'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';

type AdminRole = 'GUEST' | 'CUSTOMER' | 'SELLER' | 'ADMIN';
type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
type User = { id: string; email: string; userName: string | null; role: AdminRole; status: UserStatus; createdAt: string };
type UserPage = { items: User[]; page: number; hasMore: boolean };

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

export default function ControlPanelClient() {
  const [users, setUsers] = useState<UserPage>({ items: [], page: 1, hasMore: false });
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('CUSTOMER');
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

  async function addUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingAction('add-user');
    setError('');
    setNotice('');
    try {
      await readJson(await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userName, role: newUserRole }),
      }));
      setEmail('');
      setUserName('');
      setNewUserRole('CUSTOMER');
      setNotice('تم إنشاء الحساب. يمكن للمستخدم تسجيل الدخول باستخدام Google بالبريد نفسه.');
      await loadUsers();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر إنشاء الحساب.');
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
      const updated = await readJson<{ id: string; role: AdminRole; status: UserStatus }>(await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      }));
      setUsers((current) => ({
        ...current,
        items: current.items.map((item) => item.id === updated.id ? { ...item, role: updated.role, status: updated.status } : item),
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

  async function updateStatus(user: User, status: 'ACTIVE' | 'SUSPENDED') {
    setPendingAction(`status:${user.id}`);
    setError('');
    setNotice('');
    try {
      const updated = await readJson<{ id: string; role: AdminRole; status: UserStatus }>(await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }));
      setUsers((current) => ({
        ...current,
        items: current.items.map((item) => item.id === updated.id ? { ...item, status: updated.status } : item),
      }));
      setNotice(status === 'SUSPENDED' ? 'تم إيقاف الحساب مؤقتًا.' : 'تمت إعادة تفعيل الحساب.');
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذر تحديث حالة الحساب.');
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
        <p className="mt-2 text-sm text-stone-400">إدارة الحسابات والأدوار وحالة المستخدمين وإعدادات المنصة.</p>
      </header>

      <nav aria-label="أقسام الإدارة" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['/admin/control-panel/products', 'إدارة المنتجات'],
          ['/admin/control-panel/stores', 'إدارة المتاجر'],
          ['/admin/control-panel/messages', 'الرسائل للمستخدمين'],
          ['/admin/control-panel/site-pages', 'صفحات الموقع والمحتوى'],
          ['/admin/control-panel/subscribers', 'مشتركو النشرة البريدية'],
          ['/admin/control-panel/payments', 'وسائل الدفع'],
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
          <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
          <p className="mt-1 text-sm text-stone-400">أنشئ حسابًا دون التسجيل المعتاد، وغيّر دوره أو أوقفه مؤقتًا. الحسابات المالية المحفوظة تحمي المستخدم من الحذف.</p>
        </div>

        <form onSubmit={(event) => void addUser(event)} className="flex flex-wrap items-end gap-3 rounded-xl border border-ak-line-strong/[.08] p-4">
          <label htmlFor="admin-email" className="min-w-60 flex-1 text-sm font-semibold">
            البريد الإلكتروني
            <input id="admin-email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
          </label>
          <label htmlFor="new-user-name" className="min-w-48 flex-1 text-sm font-semibold">
            الاسم (اختياري)
            <input id="new-user-name" type="text" maxLength={100} value={userName} onChange={(event) => setUserName(event.target.value)} className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
          </label>
          <label htmlFor="new-user-role" className="text-sm font-semibold">
            الدور
            <select id="new-user-role" value={newUserRole} onChange={(event) => setNewUserRole(event.target.value as AdminRole)} className="mt-2 block rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white">
              <option value="GUEST">GUEST</option><option value="CUSTOMER">CUSTOMER</option><option value="SELLER">SELLER</option><option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button type="submit" disabled={pendingAction === 'add-user'} className="rounded-lg bg-ak-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            {pendingAction === 'add-user' ? 'جارٍ الإنشاء...' : 'إنشاء حساب'}
          </button>
          <p className="w-full text-xs text-stone-500">يُنشأ الحساب نشطًا دون كلمة مرور؛ يمكن للمستخدم تسجيل الدخول عبر Google بالبريد نفسه.</p>
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
                      <td className="py-3">
                        <span className={user.status === 'ACTIVE' ? 'text-emerald-300' : 'text-amber-300'}>
                          {user.status === 'ACTIVE' ? 'نشط' : user.status === 'SUSPENDED' ? 'موقوف' : 'محذوف'}
                        </span>
                      </td>
                      <td className="py-3">{new Date(user.createdAt).toLocaleDateString('ar')}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          {!protectedAdmin && roleDrafts[user.id] && roleDrafts[user.id] !== user.role && (
                            <button type="button" disabled={pendingAction === `role:${user.id}`} onClick={() => void updateRole(user)} className="rounded-lg border border-emerald-400/30 px-3 py-2 text-xs text-emerald-200 disabled:opacity-50">حفظ الدور</button>
                          )}
                          {!protectedAdmin && (
                            <button type="button" disabled={Boolean(pendingAction)} onClick={() => void updateStatus(user, user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')} className={`rounded-lg border px-3 py-2 text-xs disabled:opacity-50 ${user.status === 'ACTIVE' ? 'border-amber-400/30 text-amber-200' : 'border-emerald-400/30 text-emerald-200'}`}>
                              {pendingAction === `status:${user.id}` ? 'جارٍ التحديث...' : user.status === 'ACTIVE' ? 'إيقاف مؤقت' : 'إعادة التفعيل'}
                            </button>
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
