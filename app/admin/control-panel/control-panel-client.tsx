'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';

type AdminRole = 'GUEST' | 'CUSTOMER' | 'SELLER' | 'ADMIN';
type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
type User = { id: string; email: string; userName: string | null; role: AdminRole; status: UserStatus; createdAt: string };
type UserPage = { items: User[]; page: number; hasMore: boolean };
type AdminInsights = {
  metrics: {
    products: number;
    pageViewsToday: number;
    pageViewsLast7Days: number;
    pageViewsLast30Days: number;
    pageViewsLast365Days: number;
    pageViewsThisYear: number;
  };
  topSellingProducts: Array<{ id: string; title: string; categoryName: string; unitsSold: number }>;
};

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

export default function ControlPanelClient() {
  const [users, setUsers] = useState<UserPage>({ items: [], page: 1, hasMore: false });
  const [insights, setInsights] = useState<AdminInsights | null>(null);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
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

  useEffect(() => {
    let active = true;
    fetch('/api/admin/dashboard', { cache: 'no-store' })
      .then(readJson<AdminInsights>)
      .then((result) => {
        if (active) setInsights(result);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل مؤشرات لوحة التحكم.');
      });
    return () => { active = false; };
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
        body: JSON.stringify({ email, userName, password, role: newUserRole }),
      }));
      setEmail('');
      setUserName('');
      setPassword('');
      setNewUserRole('CUSTOMER');
      setNotice('تم إنشاء الحساب بكلمة مرور مشفّرة. أرسل بيانات الدخول للمستخدم عبر قناة آمنة.');
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

      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}

      <div className="space-y-6" dir="rtl">
          <section aria-label="نظرة عامة" className="ak-panel space-y-4 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="ak-eyebrow">COMMERCE OVERVIEW</p><h2 className="mt-1 text-xl font-bold">مؤشرات المتجر</h2></div>
              <Link href="/admin/dashboard" className="text-xs text-ak-honey underline">فتح لوحة التحليلات</Link>
            </div>
            {insights ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ['المنتجات النشطة', insights.metrics.products, 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'],
                    ['مشاهدات اليوم', insights.metrics.pageViewsToday, 'border-sky-400/25 bg-sky-400/10 text-sky-200'],
                    ['مشاهدات 7 أيام', insights.metrics.pageViewsLast7Days, 'border-violet-400/25 bg-violet-400/10 text-violet-200'],
                    ['مشاهدات 30 يومًا', insights.metrics.pageViewsLast30Days, 'border-amber-400/25 bg-amber-400/10 text-amber-200'],
                  ].map(([label, value, color]) => (
                    <article key={String(label)} className={`rounded-xl border p-3 ${color}`}>
                      <p className="text-xs opacity-80">{label}</p><p className="mt-2 text-xl font-black">{new Intl.NumberFormat('ar').format(Number(value))}</p>
                      {label !== 'المنتجات النشطة' && <p className="mt-1 text-[10px] opacity-70">مشاهدات صفحات مجمّعة</p>}
                    </article>
                  ))}
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  <section>
                    <h3 className="mb-3 text-sm font-bold">أفضل 5 منتجات مبيعًا</h3>
                    {insights.topSellingProducts.length ? (
                      <ol className="space-y-2">
                        {insights.topSellingProducts.map((product, index) => (
                          <li key={product.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/[.03] px-3 py-2 text-xs">
                            <span className="min-w-0 truncate"><span className="ml-2 font-black text-ak-honey">{index + 1}.</span>{product.title}<span className="mr-2 text-stone-500">{product.categoryName}</span></span>
                            <span className="shrink-0 text-emerald-200">{new Intl.NumberFormat('ar').format(product.unitsSold)} وحدة</span>
                          </li>
                        ))}
                      </ol>
                    ) : <p className="rounded-lg border border-dashed border-ak-line p-3 text-xs text-stone-500">ستظهر المنتجات بعد تسجيل مبيعات مكتملة.</p>}
                  </section>
                  <article className="flex flex-col justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[.04] p-4">
                    <p className="text-xs text-cyan-200">مشاهدات منذ بداية العام</p>
                    <p className="mt-2 text-3xl font-black text-cyan-100">{new Intl.NumberFormat('ar').format(insights.metrics.pageViewsThisYear)}</p>
                    <p className="mt-1 text-[10px] text-stone-500">مشاهدات منذ بداية السنة · دون معرفات زوار</p>
                  </article>
                </div>
              </>
            ) : <p className="text-sm text-stone-500" aria-busy="true">جارٍ تحميل المؤشرات...</p>}
          </section>

      <section id="users" className="ak-panel scroll-mt-24 space-y-5 p-5">
        <div>
          <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
          <p className="mt-1 text-sm text-stone-400">أنشئ حسابًا دون التسجيل المعتاد، وغيّر دوره أو أوقفه مؤقتًا. الحسابات المالية المحفوظة تحمي المستخدم من الحذف.</p>
        </div>

        <form onSubmit={(event) => void addUser(event)} className="grid gap-3 rounded-xl border border-ak-line-strong/[.08] p-4 sm:grid-cols-2 xl:grid-cols-4">
          <label htmlFor="admin-email" className="min-w-60 flex-1 text-sm font-semibold">
            البريد الإلكتروني
            <input id="admin-email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
          </label>
          <label htmlFor="new-user-name" className="min-w-48 flex-1 text-sm font-semibold">
            الاسم (اختياري)
            <input id="new-user-name" type="text" maxLength={100} value={userName} onChange={(event) => setUserName(event.target.value)} className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
          </label>
          <label htmlFor="new-user-password" className="min-w-48 flex-1 text-sm font-semibold">
            كلمة المرور الأولية
            <input id="new-user-password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
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
          <p className="text-xs leading-5 text-stone-500 sm:col-span-2 xl:col-span-4">تُخزّن كلمة المرور بعد تشفيرها ولا يمكن عرضها لاحقًا. أرسلها للمستخدم عبر قناة آمنة واطلب منه تغييرها بعد تسجيل الدخول.</p>
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
      </div>
    </main>
  );
}
