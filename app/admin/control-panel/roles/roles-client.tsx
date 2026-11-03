'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';

type Permission = { name: string; label: string; description: string };
type Role = {
  id: string;
  name: string;
  permissions: string[];
  assignmentCount: number;
  editable: boolean;
};
type Assignment = {
  assignmentId: string;
  id: string;
  email: string;
  userName: string | null;
  status: string;
};
type RolesResponse = { roles: Role[]; permissions: Permission[] };
type AssignmentsResponse = { assignments: Assignment[] };

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentEmail, setAssignmentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadRoles() {
    const result = await readJson<RolesResponse>(await fetch('/api/admin/control-panel/roles', { cache: 'no-store' }));
    setRoles(result.roles);
    setPermissions(result.permissions);
  }

  useEffect(() => {
    let active = true;
    fetch('/api/admin/control-panel/roles', { cache: 'no-store' })
      .then(readJson<RolesResponse>)
      .then((result) => {
        if (!active) return;
        setRoles(result.roles);
        setPermissions(result.permissions);
        setError('');
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الأدوار.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  function resetEditor() {
    setEditingRole(null);
    setRoleName('');
    setSelectedPermissions([]);
    setAssignments([]);
    setAssignmentEmail('');
  }

  async function editRole(role: Role) {
    if (!role.editable) return;
    setEditingRole(role);
    setRoleName(role.name);
    setSelectedPermissions(role.permissions.filter((name) => permissions.some((permission) => permission.name === name)));
    setAssignments([]);
    setAssignmentEmail('');
    setError('');
    try {
      const result = await readJson<AssignmentsResponse>(await fetch(
        `/api/admin/control-panel/roles/${encodeURIComponent(role.id)}/assignments`,
        { cache: 'no-store' },
      ));
      setAssignments(result.assignments);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل إسنادات الدور.');
    }
  }

  function togglePermission(name: string) {
    setSelectedPermissions((current) => current.includes(name)
      ? current.filter((value) => value !== name)
      : [...current, name]);
  }

  async function saveRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingRole
        ? `/api/admin/control-panel/roles/${encodeURIComponent(editingRole.id)}`
        : '/api/admin/control-panel/roles', {
        method: editingRole ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roleName, permissions: selectedPermissions }),
      });
      const result = await readJson<{ role: Role }>(response);
      await loadRoles();
      setEditingRole(result.role);
      setRoleName(result.role.name);
      setSelectedPermissions(result.role.permissions);
      if (!editingRole) {
        setAssignments([]);
        setNotice('تم إنشاء الدور. يمكنك الآن إسناده إلى مستخدمين نشطين.');
      } else {
        setNotice('تم حفظ الدور وصلاحياته.');
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ الدور.');
    } finally {
      setPending(false);
    }
  }

  async function deleteRole(role: Role) {
    if (!window.confirm(`حذف الدور "${role.name}"؟`)) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      await readJson(await fetch(`/api/admin/control-panel/roles/${encodeURIComponent(role.id)}`, { method: 'DELETE' }));
      setRoles((current) => current.filter((item) => item.id !== role.id));
      if (editingRole?.id === role.id) resetEditor();
      setNotice('تم حذف الدور.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الدور.');
    } finally {
      setPending(false);
    }
  }

  async function assignRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingRole) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      const result = await readJson<{ assignment: Assignment }>(await fetch(
        `/api/admin/control-panel/roles/${encodeURIComponent(editingRole.id)}/assignments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: assignmentEmail }),
        },
      ));
      setAssignments((current) => current.some((item) => item.id === result.assignment.id)
        ? current
        : [...current, result.assignment]);
      setAssignmentEmail('');
      setNotice('تم إسناد الدور للمستخدم.');
      await loadRoles();
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : 'تعذر إسناد الدور.');
    } finally {
      setPending(false);
    }
  }

  async function removeAssignment(assignment: Assignment) {
    if (!editingRole) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      await readJson(await fetch(
        `/api/admin/control-panel/roles/${encodeURIComponent(editingRole.id)}/assignments/${encodeURIComponent(assignment.id)}`,
        { method: 'DELETE' },
      ));
      setAssignments((current) => current.filter((item) => item.id !== assignment.id));
      setNotice('تمت إزالة الدور من المستخدم.');
      await loadRoles();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'تعذرت إزالة الدور.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/control-panel" className="text-sm text-ak-honey underline">العودة إلى إدارة المستخدمين</Link>
          <p className="ak-eyebrow mt-4">ACCESS CONTROL</p>
          <h1 className="mt-2 text-3xl font-black">الأدوار والصلاحيات</h1>
          <p className="mt-2 text-sm text-stone-400">أنشئ أدوارًا مخصصة، واربطها بصلاحيات لوحة التحكم، ثم أسندها إلى المستخدمين.</p>
        </div>
        <span className="ak-panel px-4 py-3 text-sm text-stone-300">{roles.length} دورًا</span>
      </header>

      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}

      <section className="ak-panel space-y-4 p-5">
        <h2 className="text-xl font-bold">الأدوار المسجلة</h2>
        {loading ? <p aria-busy="true" className="text-sm text-stone-400">جارٍ تحميل الأدوار...</p> : (
          <div className="grid gap-3 md:grid-cols-2">
            {roles.map((role) => (
              <article key={role.id} className="rounded-xl border border-ak-line-strong/[.08] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{role.name}</h3>
                    <p className="mt-1 text-xs text-stone-500">{role.assignmentCount} إسناد · {role.permissions.length} صلاحية</p>
                  </div>
                  {role.editable
                    ? <button type="button" onClick={() => void editRole(role)} className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs text-ak-honey">تحرير</button>
                    : <span className="text-xs text-stone-500">دور أساسي أو مرتبط بموظفي المتاجر</span>}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role.permissions.map((name) => (
                    <span key={name} className="rounded-full border border-sky-300/15 bg-sky-300/[.06] px-2 py-1 text-[10px] text-sky-100">{permissions.find((permission) => permission.name === name)?.label || name}</span>
                  ))}
                  {!role.permissions.length && <span className="text-xs text-stone-600">لا توجد صلاحيات لوحة تحكم.</span>}
                </div>
                {role.editable && !role.assignmentCount && (
                  <button type="button" disabled={pending} onClick={() => void deleteRole(role)} className="mt-3 rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs text-rose-200 disabled:opacity-50">حذف الدور</button>
                )}
              </article>
            ))}
            {!roles.length && <p className="text-sm text-stone-500">لا توجد أدوار مسجلة بعد.</p>}
          </div>
        )}
      </section>

      <section className="ak-panel space-y-5 p-5">
        <div>
          <p className="ak-eyebrow">{editingRole ? 'EDIT ROLE' : 'NEW ROLE'}</p>
          <h2 className="mt-2 text-xl font-bold">{editingRole ? `تحرير ${editingRole.name}` : 'إنشاء دور مخصص'}</h2>
        </div>
        <form onSubmit={(event) => void saveRole(event)} className="space-y-5">
          <label className="block max-w-xl text-sm">اسم الدور<input required minLength={3} maxLength={50} pattern="[A-Za-z][A-Za-z0-9_]*" value={roleName} onChange={(event) => setRoleName(event.target.value)} className="admin-input" /><span className="mt-1 block text-xs text-stone-500">استخدم أحرفًا لاتينية وأرقامًا وشرطة سفلية؛ يُحفظ الاسم بالأحرف الكبيرة.</span></label>
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-3 text-sm font-bold">صلاحيات لوحة التحكم</legend>
            {permissions.map((permission) => (
              <label key={permission.name} className="flex items-start gap-3 rounded-xl border border-ak-line-strong/[.08] p-3">
                <input type="checkbox" checked={selectedPermissions.includes(permission.name)} onChange={() => togglePermission(permission.name)} className="mt-1" />
                <span><span className="block text-sm font-semibold">{permission.label}</span><span className="mt-1 block text-xs text-stone-500">{permission.description}</span></span>
              </label>
            ))}
          </fieldset>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={pending || !permissions.length} className="rounded-lg bg-ak-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? 'جارٍ الحفظ...' : editingRole ? 'حفظ الدور' : 'إنشاء الدور'}</button>
            {editingRole && <button type="button" onClick={resetEditor} className="rounded-lg border border-ak-line px-5 py-3 text-sm">إلغاء التحرير</button>}
          </div>
        </form>

        {editingRole && <div className="space-y-4 border-t border-ak-line-strong/[.08] pt-5">
          <div>
            <h3 className="font-bold">إسناد الدور للمستخدمين</h3>
            <p className="mt-1 text-xs text-stone-500">يُسند الدور على مستوى المنصة للحسابات النشطة فقط.</p>
          </div>
          <form onSubmit={(event) => void assignRole(event)} className="flex flex-wrap gap-3">
            <input required type="email" maxLength={254} value={assignmentEmail} onChange={(event) => setAssignmentEmail(event.target.value)} placeholder="البريد الإلكتروني للمستخدم" className="admin-input min-w-64 flex-1" />
            <button type="submit" disabled={pending} className="rounded-lg border border-emerald-400/30 px-4 py-2 text-sm text-emerald-200 disabled:opacity-50">إسناد الدور</button>
          </form>
          <ul className="divide-y divide-white/[.06]">
            {assignments.map((assignment) => (
              <li key={assignment.assignmentId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="text-sm">{assignment.userName || assignment.email}<span className="mr-2 text-xs text-stone-500">{assignment.email} · {assignment.status}</span></span>
                {!isControlPanelAdminEmail(assignment.email) && <button type="button" disabled={pending} onClick={() => void removeAssignment(assignment)} className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs text-rose-200 disabled:opacity-50">إزالة</button>}
              </li>
            ))}
            {!assignments.length && <li className="py-3 text-sm text-stone-500">لا يوجد مستخدمون مسند إليهم هذا الدور.</li>}
          </ul>
        </div>}
      </section>
      <style jsx>{`.admin-input{display:block;width:100%;margin-top:.5rem;border:1px solid rgba(255,255,255,.12);border-radius:.6rem;background:#171714;padding:.65rem .75rem;color:white}`}</style>
    </main>
  );
}
