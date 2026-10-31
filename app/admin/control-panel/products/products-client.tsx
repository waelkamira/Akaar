'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';

type Category = { id: number; name: string };
type UserOption = { id: string; email: string };
type StoreOption = { id: string; storeName: string; userId: string };
type Product = {
  id: string;
  title: string;
  description: string | null;
  categoryId: number;
  categoryName: string;
  images: string[];
  basePrice: number | null;
  usdPriceCents: number | null;
  stockQuantity: number | null;
  city: string | null;
  town: string | null;
  phoneNumber: string | null;
  link: string | null;
  isActive: boolean;
  isDeleted: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: { id: string; email: string };
  seller: { id: string; storeName: string } | null;
};
type ProductForm = {
  title: string;
  description: string;
  userId: string;
  sellerId: string;
  categoryId: string;
  basePrice: string;
  usdPrice: string;
  stockQuantity: string;
  images: string;
  city: string;
  town: string;
  phoneNumber: string;
  link: string;
  isActive: boolean;
  approvalStatus: Product['approvalStatus'];
};
type ProductResponse = {
  items: Product[];
  categories: Category[];
  users: UserOption[];
  stores: StoreOption[];
  page: number;
  hasMore: boolean;
  totalCount: number;
};

const emptyForm: ProductForm = {
  title: '', description: '', userId: '', sellerId: '', categoryId: '', basePrice: '', usdPrice: '', stockQuantity: '0',
  images: '', city: '', town: '', phoneNumber: '', link: '', isActive: true, approvalStatus: 'APPROVED',
};

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

function formFromProduct(product: Product): ProductForm {
  return {
    title: product.title,
    description: product.description || '',
    userId: product.user.id,
    sellerId: product.seller?.id || '',
    categoryId: String(product.categoryId),
    basePrice: String(product.basePrice ?? 0),
    usdPrice: product.usdPriceCents === null ? '' : (product.usdPriceCents / 100).toFixed(2),
    stockQuantity: String(product.stockQuantity ?? 0),
    images: product.images.join('\n'),
    city: product.city || '',
    town: product.town || '',
    phoneNumber: product.phoneNumber || '',
    link: product.link || '',
    isActive: product.isActive,
    approvalStatus: product.approvalStatus,
  };
}

function requestBody(form: ProductForm) {
  return {
    ...form,
    categoryId: Number(form.categoryId),
    basePrice: Number(form.basePrice),
    usdPriceCents: form.usdPrice === '' ? null : Math.round(Number(form.usdPrice) * 100),
    stockQuantity: Number(form.stockQuantity),
    images: form.images.split(/\r?\n/).map((image) => image.trim()).filter(Boolean),
    sellerId: form.sellerId || null,
  };
}

export default function ProductsClient() {
  const [data, setData] = useState<ProductResponse>({ items: [], categories: [], users: [], stores: [], page: 1, hasMore: false, totalCount: 0 });
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async (page = 1, append = false) => {
    const result = await readJson<ProductResponse>(await fetch(`/api/admin/control-panel/products?page=${page}&limit=20`, { cache: 'no-store' }));
    setData((current) => ({ ...result, items: append ? [...current.items, ...result.items] : result.items }));
    setForm((current) => ({ ...current, userId: current.userId || result.users[0]?.id || '', categoryId: current.categoryId || String(result.categories[0]?.id || '') }));
  }, []);

  useEffect(() => {
    let active = true;
    load().catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المنتجات.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [load]);

  function resetForm() {
    setForm({ ...emptyForm, userId: data.users[0]?.id || '', categoryId: String(data.categories[0]?.id || '') });
    setEditingId('');
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingId
        ? `/api/admin/control-panel/products/${encodeURIComponent(editingId)}`
        : '/api/admin/control-panel/products', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody(form)),
      });
      await readJson(response);
      resetForm();
      await load();
      setNotice(editingId ? 'تم تحديث المنتج.' : 'تم إنشاء المنتج ونشره.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ المنتج.');
    } finally {
      setPending(false);
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`إخفاء المنتج "${product.title}"؟ سيظل محفوظًا لسجل الطلبات.`)) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      await readJson(await fetch(`/api/admin/control-panel/products/${encodeURIComponent(product.id)}`, { method: 'DELETE' }));
      if (editingId === product.id) resetForm();
      await load();
      setNotice('تم إخفاء المنتج مع الاحتفاظ بسجلاته.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر إخفاء المنتج.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/control-panel" className="text-sm text-ak-honey underline">العودة إلى لوحة التحكم</Link>
          <p className="ak-eyebrow mt-4">CATALOG CONTROL</p>
          <h1 className="mt-2 text-3xl font-black">إدارة المنتجات</h1>
          <p className="mt-2 text-sm text-stone-400">إضافة وتحرير المنتجات وإدارتها. الحذف يخفي المنتج ويحفظ ارتباطاته بسجل الطلبات.</p>
        </div>
        <span className="ak-panel px-4 py-3 text-sm text-stone-300">المعروض {data.items.length} من {data.totalCount}</span>
      </header>

      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}

      <form onSubmit={(event) => void saveProduct(event)} className="ak-panel grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <h2 className="text-xl font-bold sm:col-span-2 lg:col-span-3">{editingId ? 'تعديل منتج' : 'إضافة منتج'}</h2>
        <label className="text-sm">اسم المنتج<input required maxLength={200} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">المالك<select required value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value, sellerId: '' })} className="admin-input">{data.users.map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}</select></label>
        <label className="text-sm">المتجر<select value={form.sellerId} onChange={(event) => setForm({ ...form, sellerId: event.target.value })} className="admin-input"><option value="">بدون متجر</option>{data.stores.filter((store) => store.userId === form.userId).map((store) => <option key={store.id} value={store.id}>{store.storeName}</option>)}</select></label>
        <label className="text-sm">الفئة<select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="admin-input">{data.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="text-sm">السعر<input required type="number" min="0" step="1" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">السعر الإلكتروني بالدولار<input type="number" min="0.50" max="999999.99" step="0.01" value={form.usdPrice} onChange={(event) => setForm({ ...form, usdPrice: event.target.value })} className="admin-input" /><span className="mt-1 block text-xs text-stone-500">اختياري؛ يُخزن بالسنتات ويُستخدم فقط عند تفعيل Stripe sandbox.</span></label>
        <label className="text-sm">المخزون<input required type="number" min="0" step="1" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} className="admin-input" /></label>
        <label className="text-sm sm:col-span-2 lg:col-span-3">الوصف<textarea rows={3} maxLength={10000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="admin-input" /></label>
        <label className="text-sm sm:col-span-2">روابط الصور (رابط واحد في كل سطر)<textarea rows={3} value={form.images} onChange={(event) => setForm({ ...form, images: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">رابط خارجي<input type="url" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">المدينة<input maxLength={120} value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">المنطقة<input maxLength={120} value={form.town} onChange={(event) => setForm({ ...form, town: event.target.value })} className="admin-input" /></label>
        <label className="text-sm">رقم التواصل<input maxLength={40} value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} className="admin-input" /></label>
        {editingId && <>
          <label className="text-sm">حالة المراجعة<select value={form.approvalStatus} onChange={(event) => setForm({ ...form, approvalStatus: event.target.value as Product['approvalStatus'] })} className="admin-input"><option value="PENDING">قيد المراجعة</option><option value="APPROVED">مقبول</option><option value="REJECTED">مرفوض</option></select></label>
          <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> المنتج ظاهر في المتجر</label>
        </>}
        <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
          <button type="submit" disabled={pending || !data.users.length || !data.categories.length} className="rounded-lg bg-ak-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة ونشر المنتج'}</button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-ak-line px-5 py-3 text-sm">إلغاء التحرير</button>}
        </div>
      </form>

      <section className="ak-panel overflow-hidden p-5">
        <h2 className="mb-4 text-xl font-bold">جميع المنتجات</h2>
        {loading ? <p aria-busy="true" className="text-sm text-stone-400">جارٍ التحميل...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right text-sm">
              <thead className="text-xs text-stone-400"><tr><th className="pb-3">المنتج</th><th className="pb-3">المالك / المتجر</th><th className="pb-3">الفئة</th><th className="pb-3">السعر</th><th className="pb-3">الحالة</th><th className="pb-3">إجراءات</th></tr></thead>
              <tbody>{data.items.map((product) => (
                <tr key={product.id} className="border-t border-ak-line-strong/[.08]">
                  <td className="py-3"><p className="font-semibold">{product.title}</p><p className="text-xs text-stone-500">{product.id}</p></td>
                  <td className="py-3"><p>{product.user.email}</p><p className="text-xs text-stone-500">{product.seller?.storeName || 'بدون متجر'}</p></td>
                  <td className="py-3">{product.categoryName}</td>
                  <td className="py-3">{product.basePrice ?? '—'} ل.س{product.usdPriceCents !== null && <p className="text-xs text-stone-500">${(product.usdPriceCents / 100).toFixed(2)}</p>}</td>
                  <td className="py-3">{product.isDeleted ? 'محذوف' : !product.isActive ? 'مخفي' : product.approvalStatus === 'APPROVED' ? 'منشور' : product.approvalStatus === 'PENDING' ? 'قيد المراجعة' : 'مرفوض'}</td>
                  <td className="py-3"><div className="flex gap-2"><button type="button" disabled={pending || product.isDeleted} onClick={() => { setEditingId(product.id); setForm(formFromProduct(product)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs text-ak-honey disabled:opacity-50">تعديل</button>{!product.isDeleted && <button type="button" disabled={pending} onClick={() => void deleteProduct(product)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">إخفاء</button>}</div></td>
                </tr>
              ))}</tbody>
            </table>
            {!data.items.length && <p className="py-6 text-center text-sm text-stone-500">لا توجد منتجات.</p>}
          </div>
        )}
        {data.hasMore && <button type="button" disabled={pending} onClick={() => void load(data.page + 1, true)} className="mt-4 text-sm text-ak-honey underline disabled:opacity-50">تحميل منتجات إضافية</button>}
      </section>
      <style jsx>{`.admin-input{display:block;width:100%;margin-top:.5rem;border:1px solid rgba(255,255,255,.12);border-radius:.6rem;background:#171714;padding:.65rem .75rem;color:white}`}</style>
    </main>
  );
}
