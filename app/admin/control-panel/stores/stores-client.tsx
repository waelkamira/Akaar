'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';

type StoreStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
type Store = {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  description: string | null;
  logo: string | null;
  contactName: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  residence: string | null;
  latitude: number | null;
  longitude: number | null;
  businessType: string | null;
  sellingCategories: string | null;
  intendedProducts: string | null;
  hasIdentityDocument: boolean;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
  status: StoreStatus;
  isVerified: boolean;
  createdAt: string;
  averageRating: number | null;
  reviewCount: number;
  user: { email: string; userName: string | null };
  _count: { products: number; vendorOrders: number | null };
};
type UserOption = { id: string; email: string; userName: string | null };
type StorePage = { items: Store[]; users: UserOption[]; page: number; hasMore: boolean; vendorOrdersAvailable: boolean };
type StoreUpdateResponse = {
  notification?: { id: string };
  emailSent?: boolean | null;
  emailError?: string | null;
};
type StoreForm = {
  userId: string;
  storeName: string;
  slug: string;
  description: string;
  logo: string;
  contactName: string;
  contactEmail: string;
  phoneNumber: string;
  residence: string;
  status: StoreStatus;
  isVerified: boolean;
};

const emptyForm: StoreForm = {
  userId: '', storeName: '', slug: '', description: '', logo: '', contactName: '',
  contactEmail: '', phoneNumber: '', residence: '', status: 'PENDING', isVerified: false,
};

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

function formFromStore(store: Store): StoreForm {
  return {
    userId: store.userId,
    storeName: store.storeName,
    slug: store.slug,
    description: store.description || '',
    logo: store.logo || '',
    contactName: store.contactName || '',
    contactEmail: store.contactEmail || '',
    phoneNumber: store.phoneNumber || '',
    residence: store.residence || '',
    status: store.status,
    isVerified: store.isVerified,
  };
}

export default function StoresClient() {
  const [data, setData] = useState<StorePage>({ items: [], users: [], page: 1, hasMore: false, vendorOrdersAvailable: false });
  const [form, setForm] = useState<StoreForm>(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [warning, setWarning] = useState('');
  const [previewStore, setPreviewStore] = useState<Store | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async (page = 1, append = false, query = '') => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (query) params.set('q', query);
    const result = await readJson<StorePage>(await fetch(`/api/admin/control-panel/stores?${params}`, { cache: 'no-store' }));
    setData((current) => ({ ...result, items: append ? [...current.items, ...result.items] : result.items }));
    setForm((current) => ({ ...current, userId: current.userId || result.users[0]?.id || '' }));
  }, []);

  useEffect(() => {
    let active = true;
    load().catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المتاجر.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [load]);

  function resetForm() {
    setForm({ ...emptyForm, userId: data.users[0]?.id || '' });
    setEditingId('');
  }

  async function saveStore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    setWarning('');
    const { userId, ...updates } = form;
    try {
      await readJson(await fetch(editingId
        ? `/api/admin/control-panel/stores/${encodeURIComponent(editingId)}`
        : '/api/admin/control-panel/stores', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? updates : { userId, ...updates }),
      }));
      resetForm();
      await load(1, false, searchQuery);
      setNotice(editingId ? 'تم حفظ تعديلات المتجر.' : 'تم إنشاء المتجر وربطه بالمستخدم.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ المتجر.');
    } finally {
      setPending(false);
    }
  }

  async function deleteStore(store: Store) {
    if (!window.confirm(`حذف متجر "${store.storeName}"؟ ستبقى المنتجات محفوظة، ولا يمكن حذف متجر له طلبات سابقة.`)) return;
    setPending(true);
    setError('');
    setNotice('');
    setWarning('');
    try {
      await readJson(await fetch(`/api/admin/control-panel/stores/${encodeURIComponent(store.id)}`, { method: 'DELETE' }));
      if (editingId === store.id) resetForm();
      await load(1, false, searchQuery);
      setNotice('تم حذف المتجر.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف المتجر.');
    } finally {
      setPending(false);
    }
  }

  async function updateStore(store: Store, updates: Partial<Pick<Store, 'isVerified' | 'status'>>, successMessage: string) {
    setPending(true);
    setError('');
    setNotice('');
    setWarning('');
    try {
      const result = await readJson<StoreUpdateResponse>(await fetch(`/api/admin/control-panel/stores/${encodeURIComponent(store.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }));
      await load(1, false, searchQuery);
      setNotice(successMessage);
      if (result.emailSent === false) setWarning(result.emailError || 'تعذر إرسال البريد الإلكتروني.');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'تعذر تحديث المتجر.');
    } finally {
      setPending(false);
    }
  }

  function verifyStore(store: Store) {
    if (store.isVerified) {
      void updateStore(store, { isVerified: false }, 'تم إلغاء توثيق المتجر.');
      return;
    }
    if (!store.hasIdentityDocument && !window.confirm('لا توجد وثيقة مرفوعة. هل راجعت مستندات المتجر خارج المنصة وتؤكد توثيقه؟')) return;
    void updateStore(store, { isVerified: true }, 'تم توثيق المتجر.');
  }

  function approveStore(store: Store) {
    if (!store.isVerified) return;
    void updateStore(store, { status: 'ACTIVE' }, 'تم اعتماد المتجر وتفعيل حساب البائع.');
  }

  function rejectStore(store: Store) {
    if (!window.confirm(`رفض طلب متجر "${store.storeName}" وإبلاغ صاحبه؟`)) return;
    void updateStore(store, { status: 'REJECTED' }, 'تم رفض الطلب وإبلاغ صاحب المتجر.');
  }

  function toggleStoreFreeze(store: Store) {
    if (store.status === 'ACTIVE') {
      if (!window.confirm(`تجميد متجر "${store.storeName}"؟ سيتوقف عن استقبال الزوار ونشر المنتجات.`)) return;
      void updateStore(store, { status: 'SUSPENDED' }, 'تم تجميد المتجر.');
      return;
    }
    if (store.status === 'SUSPENDED') {
      if (!store.isVerified) {
        setError('لا يمكن إعادة تفعيل متجر غير موثّق.');
        return;
      }
      void updateStore(store, { status: 'ACTIVE' }, 'تمت إعادة تفعيل المتجر.');
    }
  }

  async function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchInput.trim().slice(0, 100);
    setSearchQuery(query);
    setError('');
    setNotice('');
    setWarning('');
    setPending(true);
    try {
      await load(1, false, query);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر البحث عن المتاجر.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:py-12">
      <header>
        <Link href="/admin/control-panel" className="text-sm text-ak-honey underline">العودة إلى لوحة التحكم</Link>
        <p className="ak-eyebrow mt-4">STOREFRONT CONTROL</p>
        <h1 className="mt-2 text-3xl font-black">إدارة المتاجر</h1>
        <p className="mt-2 text-sm text-stone-400">إدارة واجهات البائعين، بيانات المتجر، الاعتماد والحالة.</p>
      </header>
      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}
      {warning && <p role="status" className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">{warning}</p>}
      <form onSubmit={submitSearch} role="search" className="ak-panel flex flex-wrap gap-3 p-4">
        <label className="sr-only" htmlFor="store-search">البحث باسم المتجر أو بريد المالك</label>
        <input id="store-search" type="search" maxLength={100} value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="ابحث باسم المتجر أو بريد المالك" className="min-w-[220px] flex-1 rounded-xl border border-ak-line bg-ak-ink px-4 py-3 text-sm text-white outline-none focus:border-ak-amber" />
        <button type="submit" disabled={pending} className="rounded-xl bg-ak-amber px-5 py-3 text-sm font-bold text-ak-ink disabled:opacity-50">بحث</button>
        {searchQuery && <button type="button" disabled={pending} onClick={() => {
          setSearchInput('');
          setSearchQuery('');
          setError('');
          void load(1, false, '').catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المتاجر.'));
        }} className="rounded-xl border border-ak-line px-5 py-3 text-sm text-stone-200 disabled:opacity-50">مسح البحث</button>}
      </form>
      {previewStore && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/75 p-4" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPreviewStore(null);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="store-request-preview-title" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-ak-line bg-ak-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="ak-eyebrow">STORE APPLICATION</p><h2 id="store-request-preview-title" className="mt-2 text-2xl font-black">معاينة طلب المتجر</h2><p className="mt-1 text-sm text-stone-400">{previewStore.storeName}</p></div>
              <button type="button" onClick={() => setPreviewStore(null)} className="rounded-lg border border-ak-line px-3 py-2 text-sm text-stone-300 hover:text-white">إغلاق</button>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['صاحب الحساب', previewStore.user.userName || '—'],
                ['البريد الإلكتروني', previewStore.user.email],
                ['جهة التواصل', previewStore.contactName || '—'],
                ['بريد التواصل', previewStore.contactEmail || '—'],
                ['رقم الهاتف', previewStore.phoneNumber || '—'],
                ['مقر النشاط', previewStore.residence || '—'],
                ['نوع النشاط', previewStore.businessType || '—'],
                ['الفئات', previewStore.sellingCategories || '—'],
                ['وثيقة الهوية', previewStore.hasIdentityDocument ? 'مرفقة' : 'غير مرفقة'],
                ['حالة التوثيق', previewStore.isVerified ? 'موثّق' : 'غير موثّق'],
              ].map(([label, value]) => <div key={label} className="rounded-xl border border-ak-line-strong/[.08] bg-ak-ink/40 p-3"><dt className="text-xs text-stone-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-white">{value}</dd></div>)}
              <div className="rounded-xl border border-ak-line-strong/[.08] bg-ak-ink/40 p-3 sm:col-span-2"><dt className="text-xs text-stone-500">المنتجات المزمع بيعها</dt><dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-white">{previewStore.intendedProducts || '—'}</dd></div>
              <div className="rounded-xl border border-ak-line-strong/[.08] bg-ak-ink/40 p-3 sm:col-span-2"><dt className="text-xs text-stone-500">وصف المتجر</dt><dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-white">{previewStore.description || '—'}</dd></div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              {previewStore.hasIdentityDocument
                ? <a href={`/api/admin/sellers/${encodeURIComponent(previewStore.id)}/identity-document`} target="_blank" rel="noreferrer" className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-4 py-2.5 text-sm font-semibold text-sky-200">عرض وثيقة الهوية</a>
                : <p className="rounded-lg border border-amber-400/25 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-100">لا توجد وثيقة مرفوعة؛ يمكن اعتماد التوثيق بعد مراجعة المستندات خارج المنصة.</p>}
              {previewStore.status === 'ACTIVE' && previewStore.isVerified
                ? <a href={`/shop/${encodeURIComponent(previewStore.slug)}`} target="_blank" rel="noreferrer" className="rounded-lg border border-ak-line px-4 py-2.5 text-sm text-stone-200 hover:text-white">معاينة واجهة المتجر</a>
                : <p className="self-center text-xs text-stone-500">واجهة المتجر العامة ستتاح بعد التوثيق والاعتماد.</p>}
            </div>
          </section>
        </div>
      )}


      <section className="ak-panel overflow-hidden p-5">
        <h2 className="mb-4 text-xl font-bold">المتاجر</h2>
        {!data.vendorOrdersAvailable && <p role="status" className="mb-4 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">عدد الطلبات غير متاح لأن جدول VendorOrder غير موجود في قاعدة البيانات الحالية.</p>}
        {loading ? <p aria-busy="true" className="text-sm text-stone-400">جارٍ التحميل...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px] text-right text-sm">
              <thead className="text-xs text-stone-400"><tr><th className="pb-3">المتجر</th><th className="pb-3">المالك</th><th className="pb-3">الحالة</th><th className="pb-3">المنتجات / الطلبات</th><th className="pb-3">التقييم</th><th className="pb-3">الإجراءات</th></tr></thead>
              <tbody>{data.items.map((store) => (
                <tr key={store.id} className="border-t border-ak-line-strong/[.08]">
                  <td className="py-3"><p className="font-semibold">{store.storeName}</p><p className="text-xs text-stone-500">/{store.slug} · {store.isVerified ? 'موثّق' : 'غير موثّق'}</p></td>
                  <td className="py-3">{store.user.email}</td>
                  <td className="py-3">{store.status === 'ACTIVE' ? 'نشط' : store.status === 'PENDING' ? 'قيد المراجعة' : store.status === 'SUSPENDED' ? 'موقوف' : 'مرفوض'}</td>
                  <td className="py-3">{store._count.products} / {store._count.vendorOrders ?? 'غير متاح'}</td>
                  <td className="py-3"><span className="text-amber-200">{store.averageRating === null ? '—' : `★ ${store.averageRating.toFixed(1)}`}</span><p className="text-xs text-stone-500">{store.reviewCount} تقييم</p></td>
                  <td className="py-3"><div className="flex flex-wrap gap-2">
                    <button type="button" disabled={pending} onClick={() => setPreviewStore(store)} className="rounded-lg border border-sky-400/30 px-3 py-2 text-xs text-sky-200 disabled:opacity-50">معاينة الطلب</button>
                    <button type="button" disabled={pending} onClick={() => verifyStore(store)} className={`rounded-lg border px-3 py-2 text-xs disabled:opacity-50 ${store.isVerified ? 'border-emerald-400/30 text-emerald-200' : 'border-amber-400/30 text-amber-200'}`}>{store.isVerified ? 'موثّق' : 'توثيق'}</button>
                    <button type="button" disabled={pending || !store.isVerified || store.status === 'ACTIVE'} title={!store.isVerified ? 'وثّق المتجر قبل اعتماده' : undefined} onClick={() => approveStore(store)} className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40">{store.status === 'ACTIVE' ? 'معتمد' : 'اعتماد'}</button>
                    {store.status !== 'REJECTED' && <button type="button" disabled={pending || store.status === 'ACTIVE'} onClick={() => rejectStore(store)} className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-200 disabled:opacity-40">رفض</button>}
                    {(store.status === 'ACTIVE' || store.status === 'SUSPENDED') && <button type="button" disabled={pending || (store.status === 'SUSPENDED' && !store.isVerified)} onClick={() => toggleStoreFreeze(store)} className={`rounded-lg border px-3 py-2 text-xs disabled:opacity-40 ${store.status === 'ACTIVE' ? 'border-orange-400/30 text-orange-200' : 'border-emerald-400/30 text-emerald-200'}`}>{store.status === 'ACTIVE' ? 'تجميد' : 'إعادة تفعيل'}</button>}
                    <button type="button" disabled={pending} onClick={() => { setEditingId(store.id); setForm(formFromStore(store)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs text-ak-honey disabled:opacity-50">تعديل</button>
                    <button type="button" disabled={pending} onClick={() => void deleteStore(store)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">حذف</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
            {!data.items.length && <p className="py-6 text-center text-sm text-stone-500">{searchQuery ? 'لا توجد متاجر مطابقة للبحث.' : 'لا توجد متاجر.'}</p>}
          </div>
        )}
        {data.hasMore && <button type="button" disabled={pending} onClick={() => void load(data.page + 1, true, searchQuery)} className="mt-4 text-sm text-ak-honey underline disabled:opacity-50">تحميل متاجر إضافية</button>}
      </section>
        <form onSubmit={(event) => void saveStore(event)} className="ak-panel grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <h2 className="text-xl font-bold sm:col-span-2 lg:col-span-3">{editingId ? 'تحرير المتجر' : 'إنشاء متجر'}</h2>
        {!editingId && <label className="text-sm">حساب المالك<select required value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })} className="admin-input"><option value="">اختر مستخدمًا</option>{data.users.map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}</select></label>}
        <label className="text-sm">اسم المتجر<input required maxLength={160} value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">رابط المتجر<input required maxLength={100} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value.toLowerCase() })} className="admin-input" /><span className="text-xs text-stone-500">أحرف إنجليزية صغيرة وأرقام وشرطات فقط</span></label>
        <label className="text-sm">رابط الشعار<input type="url" maxLength={2048} value={form.logo} onChange={(event) => setForm({ ...form, logo: event.target.value })} className="admin-input" /></label>
        <label className="text-sm sm:col-span-2">الوصف<textarea rows={3} maxLength={10000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">اسم جهة التواصل<input maxLength={160} value={form.contactName} onChange={(event) => setForm({ ...form, contactName: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">بريد التواصل<input type="email" maxLength={254} value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">الهاتف<input maxLength={40} value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">الموقع<input maxLength={240} value={form.residence} onChange={(event) => setForm({ ...form, residence: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">الحالة<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as StoreStatus, isVerified: event.target.value === 'ACTIVE' ? true : form.isVerified })} className="admin-input"><option value="PENDING">قيد المراجعة</option><option value="ACTIVE">نشط</option><option value="SUSPENDED">موقوف</option><option value="REJECTED">مرفوض</option></select></label>
        {editingId && <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" checked={form.isVerified} onChange={(event) => setForm({ ...form, isVerified: event.target.checked })} /> متجر موثّق</label>}
        <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
          <button type="submit" disabled={pending || (!editingId && !data.users.length)} className="rounded-lg bg-ak-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديلات' : 'إنشاء متجر'}</button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-ak-line px-5 py-3 text-sm">إلغاء التحرير</button>}
        </div>
      </form>
      <style jsx>{`.admin-input{display:block;width:100%;margin-top:.5rem;border:1px solid rgba(255,255,255,.12);border-radius:.6rem;background:#171714;padding:.65rem .75rem;color:white}`}</style>
    </main>
  );
}
