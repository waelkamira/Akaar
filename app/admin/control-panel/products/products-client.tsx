'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';

type Category = { id: string; name: string };
type UserOption = { id: string; email: string };
type StoreOption = { id: string; storeName: string; userId: string };
type Product = {
  id: string;
  title: string;
  description: string | null;
  categoryId: string;
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
  averageRating: number | null;
  reviewCount: number;
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
type PriceVariant = { id: string; sku: string; title: string | null };
type PriceCurrency = { code: string; name: string; symbol: string | null; minorUnits: number };
type PriceHistoryCatalog = {
  product: { id: string; title: string; variants: PriceVariant[] };
  currencies: PriceCurrency[];
};
type ProductPrice = {
  id: string;
  amount: string;
  compareAt: string | null;
  currency: string;
  validFrom: string;
  validUntil: string | null;
  currencyRef: { symbol: string | null; minorUnits: number };
};
type PriceHistoryPage = {
  variant: PriceVariant;
  prices: ProductPrice[];
  nextCursor: string | null;
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

function requestBody(form: ProductForm, includeImages = true, includePrices = true) {
  const { basePrice, usdPrice, images, ...productFields } = form;
  return {
    ...productFields,
    categoryId: form.categoryId,
    ...(includePrices ? {
      basePrice: Number(basePrice),
      usdPriceCents: usdPrice === '' ? null : Math.round(Number(usdPrice) * 100),
    } : {}),
    stockQuantity: Number(form.stockQuantity),
    ...(includeImages ? { images: images.split(/\r?\n/).map((image) => image.trim()).filter(Boolean) } : {}),
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
  const [priceProduct, setPriceProduct] = useState<{ id: string; title: string } | null>(null);
  const [priceVariants, setPriceVariants] = useState<PriceVariant[]>([]);
  const [priceCurrencies, setPriceCurrencies] = useState<PriceCurrency[]>([]);
  const [selectedPriceVariantId, setSelectedPriceVariantId] = useState('');
  const [priceEntries, setPriceEntries] = useState<ProductPrice[]>([]);
  const [priceCursor, setPriceCursor] = useState('');
  const [priceLoading, setPriceLoading] = useState(false);
  const [pricePending, setPricePending] = useState(false);
  const [priceForm, setPriceForm] = useState({ currency: 'USD', amount: '', compareAt: '' });

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
        body: JSON.stringify(requestBody(form, !editingId, !editingId)),
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

  async function saveImages() {
    if (!editingId) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      const images = form.images.split(/\r?\n/).map((image) => image.trim()).filter(Boolean);
      await readJson(await fetch(`/api/admin/control-panel/products/${encodeURIComponent(editingId)}/media`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      }));
      await load();
      setNotice('تم حفظ صور المنتج.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ صور المنتج.');
    } finally {
      setPending(false);
    }
  }

  async function fetchPriceHistory(productId: string, variantId: string, cursor?: string) {
    const query = new URLSearchParams({ variantId });
    if (cursor) query.set('cursor', cursor);
    return readJson<PriceHistoryPage>(await fetch(
      `/api/admin/control-panel/products/${encodeURIComponent(productId)}/prices?${query}`,
      { cache: 'no-store' },
    ));
  }

  async function openPriceHistory(product: Product) {
    setPriceLoading(true);
    setError('');
    setNotice('');
    setPriceProduct({ id: product.id, title: product.title });
    setPriceVariants([]);
    setPriceCurrencies([]);
    setPriceEntries([]);
    setPriceCursor('');
    try {
      const catalog = await readJson<PriceHistoryCatalog>(await fetch(
        `/api/admin/control-panel/products/${encodeURIComponent(product.id)}/prices`,
        { cache: 'no-store' },
      ));
      setPriceProduct({ id: catalog.product.id, title: catalog.product.title });
      setPriceVariants(catalog.product.variants);
      setPriceCurrencies(catalog.currencies);
      setPriceForm({
        currency: catalog.currencies.find((currency) => currency.code === 'USD')?.code
          || catalog.currencies[0]?.code
          || '',
        amount: '',
        compareAt: '',
      });
      const firstVariant = catalog.product.variants[0];
      setSelectedPriceVariantId(firstVariant?.id || '');
      if (firstVariant) {
        const history = await fetchPriceHistory(catalog.product.id, firstVariant.id);
        setPriceEntries(history.prices);
        setPriceCursor(history.nextCursor || '');
      } else {
        setPriceVariants([]);
      }
    } catch (historyError) {
      setError(historyError instanceof Error ? historyError.message : 'تعذر تحميل سجل الأسعار.');
    } finally {
      setPriceLoading(false);
    }
  }

  async function selectPriceVariant(variantId: string) {
    if (!priceProduct) return;
    setSelectedPriceVariantId(variantId);
    setPriceEntries([]);
    setPriceCursor('');
    setPriceLoading(true);
    setError('');
    try {
      const history = await fetchPriceHistory(priceProduct.id, variantId);
      setPriceEntries(history.prices);
      setPriceCursor(history.nextCursor || '');
    } catch (historyError) {
      setError(historyError instanceof Error ? historyError.message : 'تعذر تحميل سجل الأسعار.');
    } finally {
      setPriceLoading(false);
    }
  }

  async function loadOlderPrices() {
    if (!priceProduct || !selectedPriceVariantId || !priceCursor) return;
    setPriceLoading(true);
    setError('');
    try {
      const history = await fetchPriceHistory(priceProduct.id, selectedPriceVariantId, priceCursor);
      setPriceEntries((current) => [...current, ...history.prices]);
      setPriceCursor(history.nextCursor || '');
    } catch (historyError) {
      setError(historyError instanceof Error ? historyError.message : 'تعذر تحميل سجل الأسعار.');
    } finally {
      setPriceLoading(false);
    }
  }

  async function savePrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!priceProduct || !selectedPriceVariantId) return;
    setPricePending(true);
    setError('');
    setNotice('');
    try {
      await readJson(await fetch(
        `/api/admin/control-panel/products/${encodeURIComponent(priceProduct.id)}/prices`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variantId: selectedPriceVariantId,
            currency: priceForm.currency,
            amount: priceForm.amount,
            compareAt: priceForm.compareAt || null,
          }),
        },
      ));
      const history = await fetchPriceHistory(priceProduct.id, selectedPriceVariantId);
      setPriceEntries(history.prices);
      setPriceCursor(history.nextCursor || '');
      setPriceForm((current) => ({ ...current, amount: '', compareAt: '' }));
      await load();
      setNotice('تم تسجيل السعر الجديد مع الاحتفاظ بالسجل السابق.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ سعر المنتج.');
    } finally {
      setPricePending(false);
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
        <label className="text-sm">السعر<input required type="number" min="0" step="1" value={form.basePrice} disabled={Boolean(editingId)} onChange={(event) => setForm({ ...form, basePrice: event.target.value })} className="admin-input disabled:opacity-50" /></label>
        <label className="text-sm">السعر الإلكتروني بالدولار<input type="number" min="0.50" max="999999.99" step="0.01" value={form.usdPrice} disabled={Boolean(editingId)} onChange={(event) => setForm({ ...form, usdPrice: event.target.value })} className="admin-input disabled:opacity-50" /><span className="mt-1 block text-xs text-stone-500">{editingId ? 'لتسجيل سعر جديد مع حفظ سجل التغييرات، استخدم إجراء سجل الأسعار.' : 'اختياري؛ يُخزن بالسنتات ويُستخدم فقط عند تفعيل Stripe sandbox.'}</span></label>
        <label className="text-sm">المخزون<input required type="number" min="0" step="1" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} className="admin-input" /></label>
        <label className="text-sm sm:col-span-2 lg:col-span-3">الوصف<textarea rows={3} maxLength={10000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="admin-input" /></label>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm">روابط الصور (رابط واحد في كل سطر)<textarea rows={3} value={form.images} onChange={(event) => setForm({ ...form, images: event.target.value })} className="admin-input" /></label>
          {editingId && <button type="button" disabled={pending} onClick={() => void saveImages()} className="rounded-lg border border-ak-line px-4 py-2 text-sm disabled:opacity-50">حفظ الصور</button>}
        </div>
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
              <thead className="text-xs text-stone-400"><tr><th className="pb-3">المنتج</th><th className="pb-3">المالك / المتجر</th><th className="pb-3">الفئة</th><th className="pb-3">السعر</th><th className="pb-3">التقييم</th><th className="pb-3">الحالة</th><th className="pb-3">إجراءات</th></tr></thead>
              <tbody>{data.items.map((product) => (
                <tr key={product.id} className="border-t border-ak-line-strong/[.08]">
                  <td className="py-3"><p className="font-semibold">{product.title}</p><p className="text-xs text-stone-500">{product.id}</p></td>
                  <td className="py-3"><p>{product.user.email}</p><p className="text-xs text-stone-500">{product.seller?.storeName || 'بدون متجر'}</p></td>
                  <td className="py-3">{product.categoryName}</td>
                  <td className="py-3">{product.basePrice ?? '—'} ل.س{product.usdPriceCents !== null && <p className="text-xs text-stone-500">${(product.usdPriceCents / 100).toFixed(2)}</p>}</td>
                  <td className="py-3"><span className="text-amber-200">{product.averageRating === null ? '—' : `★ ${product.averageRating.toFixed(1)}`}</span><p className="text-xs text-stone-500">{product.reviewCount} تقييم</p></td>
                  <td className="py-3">{product.isDeleted ? 'محذوف' : !product.isActive ? 'مخفي' : product.approvalStatus === 'APPROVED' ? 'منشور' : product.approvalStatus === 'PENDING' ? 'قيد المراجعة' : 'مرفوض'}</td>
                  <td className="py-3"><div className="flex flex-wrap gap-2"><button type="button" disabled={pending || priceLoading || product.isDeleted} onClick={() => void openPriceHistory(product)} className="rounded-lg border border-sky-400/30 px-3 py-2 text-xs text-sky-200 disabled:opacity-50">سجل الأسعار</button><button type="button" disabled={pending || product.isDeleted} onClick={() => { setEditingId(product.id); setForm(formFromProduct(product)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs text-ak-honey disabled:opacity-50">تعديل</button>{!product.isDeleted && <button type="button" disabled={pending} onClick={() => void deleteProduct(product)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">إخفاء</button>}</div></td>
                </tr>
              ))}</tbody>
            </table>
            {!data.items.length && <p className="py-6 text-center text-sm text-stone-500">لا توجد منتجات.</p>}
          </div>
        )}
        {data.hasMore && <button type="button" disabled={pending} onClick={() => void load(data.page + 1, true)} className="mt-4 text-sm text-ak-honey underline disabled:opacity-50">تحميل منتجات إضافية</button>}
      </section>
      {priceProduct && <section className="ak-panel space-y-5 p-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="ak-eyebrow">PRICE HISTORY</p>
            <h2 className="mt-2 text-xl font-bold">سجل الأسعار: {priceProduct.title}</h2>
            <p className="mt-1 text-sm text-stone-400">تسجيل سعر جديد ينهي الفترة الحالية ويحتفظ بالسجل السابق.</p>
          </div>
          <button type="button" onClick={() => { setPriceProduct(null); setPriceEntries([]); }} className="rounded-lg border border-ak-line px-3 py-2 text-sm">إغلاق</button>
        </header>
        <form onSubmit={(event) => void savePrice(event)} className="grid gap-4 rounded-xl border border-ak-line-strong/[.08] p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm">نسخة المنتج<select required value={selectedPriceVariantId} disabled={priceLoading || !priceVariants.length} onChange={(event) => void selectPriceVariant(event.target.value)} className="admin-input">{priceVariants.map((variant) => <option key={variant.id} value={variant.id}>{variant.title || variant.sku} · {variant.sku}</option>)}</select></label>
          <label className="text-sm">العملة<select required value={priceForm.currency} disabled={!priceCurrencies.length} onChange={(event) => setPriceForm({ ...priceForm, currency: event.target.value })} className="admin-input">{priceCurrencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} · {currency.name}</option>)}</select></label>
          <label className="text-sm">السعر الجديد<input required type="number" min="0" max="999999999999999.9999" step="0.0001" value={priceForm.amount} onChange={(event) => setPriceForm({ ...priceForm, amount: event.target.value })} className="admin-input" /></label>
          <label className="text-sm">سعر المقارنة (اختياري)<input type="number" min="0" max="999999999999999.9999" step="0.0001" value={priceForm.compareAt} onChange={(event) => setPriceForm({ ...priceForm, compareAt: event.target.value })} className="admin-input" /></label>
          <button type="submit" disabled={pricePending || priceLoading || !selectedPriceVariantId || !priceCurrencies.length} className="rounded-lg bg-ak-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50 sm:col-span-2 lg:col-span-4">{pricePending ? 'جارٍ تسجيل السعر...' : 'تسجيل سعر جديد'}</button>
        </form>
        {priceLoading ? <p aria-busy="true" className="text-sm text-stone-400">جارٍ تحميل سجل الأسعار...</p> : !priceVariants.length ? <p className="text-sm text-stone-400">لا توجد نسخ لهذا المنتج.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-right text-sm">
              <thead className="text-xs text-stone-400"><tr><th className="pb-3">العملة</th><th className="pb-3">السعر</th><th className="pb-3">سعر المقارنة</th><th className="pb-3">بداية الصلاحية</th><th className="pb-3">نهاية الصلاحية</th></tr></thead>
              <tbody>{priceEntries.map((price) => (
                <tr key={price.id} className="border-t border-ak-line-strong/[.08]">
                  <td className="py-3">{price.currencyRef.symbol || price.currency} · {price.currency}</td>
                  <td className="py-3">{price.amount}</td>
                  <td className="py-3">{price.compareAt || '—'}</td>
                  <td className="py-3">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(price.validFrom))}</td>
                  <td className="py-3">{price.validUntil ? new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(price.validUntil)) : 'مفتوحة'}</td>
                </tr>
              ))}</tbody>
            </table>
            {!priceEntries.length && <p className="py-5 text-center text-sm text-stone-500">لا يوجد سجل أسعار لهذه النسخة.</p>}
            {priceCursor && <button type="button" disabled={priceLoading} onClick={() => void loadOlderPrices()} className="mt-4 text-sm text-ak-honey underline disabled:opacity-50">تحميل سجلات أقدم</button>}
          </div>
        )}
      </section>}
      <style jsx>{`.admin-input{display:block;width:100%;margin-top:.5rem;border:1px solid rgba(255,255,255,.12);border-radius:.6rem;background:#171714;padding:.65rem .75rem;color:white}`}</style>
    </main>
  );
}
