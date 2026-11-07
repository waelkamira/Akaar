'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';

type Category = { id: string; name: string; slug: string };
type Warehouse = { id: string; name: string };
type Currency = { code: string; name: string };
type Variant = {
  id: string;
  sku: string;
  title: string | null;
  status: string;
  prices: Array<{ amount: number; currency: string }>;
  inventory: Array<{ id: string; onHand: number; reserved: number; warehouse: Warehouse }>;
};
type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  isActive: boolean;
  updatedAt: string;
  categories: Array<{ category: Category }>;
  media: Array<{ id: string; storageKey: string; sortOrder: number; isPrimary: boolean }>;
  variants: Variant[];
};
type Payload = { products: Product[]; categories: Category[]; warehouses: Warehouse[]; currencies: Currency[] };

const fieldClass = 'mt-2 w-full rounded-xl border border-white/10 bg-[#171c1a] px-3 py-2.5 text-sm text-white outline-none focus:border-orange-300/50';
const buttonClass = 'rounded-xl border border-orange-300/30 bg-orange-300/10 px-4 py-2.5 text-sm font-bold text-orange-100 hover:bg-orange-300/20 disabled:opacity-50';
const statusNames: Record<string, string> = {
  DRAFT: 'مسودة',
  PENDING: 'بانتظار الاعتماد',
  APPROVED: 'معتمد',
  REJECTED: 'مرفوض',
  ARCHIVED: 'مؤرشف',
  ACTIVE: 'نشط',
  INACTIVE: 'متوقف',
  DISCONTINUED: 'منتهي',
};

async function requestJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال العملية.');
  return payload as T;
}

function parseImages(value: FormDataEntryValue | null) {
  return typeof value === 'string'
    ? value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
    : [];
}

export default function SellerProductsClient() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await requestJson<Payload>(await fetch('/api/seller/products', { cache: 'no-store' })));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المنتجات.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function submit(method: 'POST' | 'PATCH' | 'DELETE', url: string, body?: Record<string, unknown>) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await requestJson(await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      }));
      setNotice('تم حفظ التغييرات.');
      await load();
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'تعذر حفظ التغييرات.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void submit('POST', '/api/seller/products', {
      title: form.get('title'),
      description: form.get('description'),
      sku: form.get('sku'),
      categoryId: form.get('categoryId'),
      price: form.get('price'),
      currency: form.get('currency'),
      warehouseId: form.get('warehouseId'),
      stock: Number(form.get('stock') || 0),
      images: parseImages(form.get('images')),
    }).then((success) => {
      if (success) event.currentTarget.reset();
    });
  }

  if (loading && !data) return <main className="mx-auto max-w-7xl px-4 py-12" aria-busy="true">جارٍ تحميل المنتجات...</main>;
  if (!data) return <main className="mx-auto max-w-3xl px-4 py-12 text-rose-200">{error || 'تعذر تحميل المنتجات.'}<button onClick={() => void load()} className="mr-3 underline">إعادة المحاولة</button></main>;

  const productCount = data.products.length;
  const pendingCount = data.products.filter((item) => item.status === 'PENDING').length;
  const lowStockCount = data.products.filter((item) => item.variants.some((variant) => variant.inventory.some((stock) => stock.onHand - stock.reserved <= 3))).length;

  return (
    <main dir="rtl" className="mx-auto min-h-screen max-w-[1500px] px-4 py-7 text-[#f5f3ed] sm:px-7">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-200">كتالوج المتجر</p><h1 className="mt-2 text-3xl font-black">المنتجات والمتغيرات</h1><p className="mt-2 text-sm text-white/55">أضف المنتجات وأسعارها وصورها وتصنيفاتها، وتابع اعتمادها ومخزون كل متغير.</p></div>
        <Link href="/seller/inventory" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5">إدارة المستودعات</Link>
      </header>
      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-200">{notice}</p>}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric label="إجمالي المنتجات" value={productCount} />
        <Metric label="بانتظار الاعتماد" value={pendingCount} />
        <Metric label="منتجات بمخزون منخفض" value={lowStockCount} />
      </div>

      <form onSubmit={createProduct} className="mb-6 rounded-2xl border border-white/10 bg-[#202725] p-5">
        <h2 className="text-lg font-bold">إضافة منتج</h2>
        <p className="mt-1 text-xs text-white/50">المنتج الجديد يُرسل للمراجعة، ولا يمكن للبائع تجاوز قرار الاعتماد.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs text-white/60">اسم المنتج<input name="title" required maxLength={300} className={fieldClass} /></label>
          <label className="text-xs text-white/60">رمز SKU<input name="sku" maxLength={100} className={fieldClass} dir="ltr" /></label>
          <label className="text-xs text-white/60">التصنيف<select name="categoryId" defaultValue="" className={fieldClass}><option value="">دون تصنيف</option>{data.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="text-xs text-white/60">السعر<input name="price" type="number" min="0.0001" step="0.0001" required className={fieldClass} /></label>
          <label className="text-xs text-white/60">العملة<select name="currency" required className={fieldClass}>{data.currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} · {currency.name}</option>)}</select></label>
          <label className="text-xs text-white/60">المستودع<select name="warehouseId" defaultValue="" className={fieldClass}><option value="">اختر مستودعًا لاحقًا</option>{data.warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</select></label>
          <label className="text-xs text-white/60">المخزون الأولي<input name="stock" type="number" min="0" max="1000000" defaultValue="0" className={fieldClass} /></label>
          <label className="text-xs text-white/60 sm:col-span-2 lg:col-span-4">روابط الصور، رابط واحد في كل سطر<textarea name="images" rows={2} placeholder="https://..." className={fieldClass} dir="ltr" /></label>
          <label className="text-xs text-white/60 sm:col-span-2 lg:col-span-4">وصف المنتج<textarea name="description" rows={3} maxLength={20000} className={fieldClass} /></label>
        </div>
        <button disabled={busy || !data.currencies.length} className={`${buttonClass} mt-4`}>إرسال المنتج للمراجعة</button>
      </form>

      {!data.products.length ? <section className="rounded-2xl border border-dashed border-white/10 bg-[#202725] p-10 text-center text-sm text-white/50">لم تضف منتجات بعد. ابدأ من النموذج أعلاه.</section> : (
        <div className="space-y-5">
          {data.products.map((product) => <ProductCard key={product.id} product={product} data={data} busy={busy} submit={submit} />)}
        </div>
      )}
    </main>
  );
}

function ProductCard({ product, data, busy, submit }: {
  product: Product;
  data: Payload;
  busy: boolean;
  submit: (method: 'POST' | 'PATCH' | 'DELETE', url: string, body?: Record<string, unknown>) => Promise<boolean>;
}) {
  const images = product.media.map((item) => item.storageKey).join('\n');
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#202725]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          {product.media[0]?.storageKey ? <div className="relative size-14 overflow-hidden rounded-xl bg-black/20"><Image src={product.media[0].storageKey} alt="" fill sizes="56px" unoptimized className="object-cover" /></div> : <div className="size-14 rounded-xl bg-white/5" />}
          <div><h2 className="font-bold">{product.title}</h2><p className="mt-1 text-xs text-white/50">{product.categories[0]?.category.name || 'دون تصنيف'} · {statusNames[product.status] || product.status}</p></div>
        </div>
        <button disabled={busy} className="rounded-lg border border-rose-300/20 px-3 py-2 text-xs text-rose-200" onClick={async () => {
          if (window.confirm(`هل تريد أرشفة «${product.title}»؟`)) await submit('DELETE', `/api/seller/products/${encodeURIComponent(product.id)}`);
        }}>أرشفة المنتج</button>
      </div>

      <form className="grid gap-3 border-b border-white/10 p-4 sm:grid-cols-2" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void submit('PATCH', `/api/seller/products/${encodeURIComponent(product.id)}`, {
          title: form.get('title'),
          description: form.get('description'),
          categoryId: form.get('categoryId'),
          images: parseImages(form.get('images')),
        });
      }}>
        <label className="text-xs text-white/60">اسم المنتج<input name="title" required maxLength={300} defaultValue={product.title} className={fieldClass} /></label>
        <label className="text-xs text-white/60">التصنيف<select name="categoryId" defaultValue={product.categories[0]?.category.id || ''} className={fieldClass}><option value="">دون تصنيف</option>{data.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="text-xs text-white/60 sm:col-span-2">الوصف<textarea name="description" rows={2} maxLength={20000} defaultValue={product.description || ''} className={fieldClass} /></label>
        <label className="text-xs text-white/60 sm:col-span-2">روابط الصور<textarea name="images" rows={2} defaultValue={images} className={fieldClass} dir="ltr" /></label>
        <button disabled={busy} className={`${buttonClass} w-fit`}>حفظ بيانات المنتج</button>
      </form>

      <section className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">المتغيرات والأسعار</h3><span className="text-xs text-white/45">{product.variants.length} متغير</span></div>
        {!product.variants.length ? <p className="mt-3 text-sm text-white/45">لا توجد متغيرات.</p> : <div className="mt-3 space-y-3">
          {product.variants.map((variant) => <VariantForm key={variant.id} productId={product.id} variant={variant} warehouses={data.warehouses} currencies={data.currencies} busy={busy} submit={submit} />)}
        </div>}
        <VariantForm productId={product.id} warehouses={data.warehouses} currencies={data.currencies} busy={busy} submit={submit} />
      </section>
    </article>
  );
}

function VariantForm({ productId, variant, warehouses, currencies, busy, submit }: {
  productId: string;
  variant?: Variant;
  warehouses: Warehouse[];
  currencies: Currency[];
  busy: boolean;
  submit: (method: 'POST' | 'PATCH' | 'DELETE', url: string, body?: Record<string, unknown>) => Promise<boolean>;
}) {
  const inventory = variant?.inventory[0];
  const price = variant?.prices[0];
  const [showForm, setShowForm] = useState(Boolean(variant));
  if (!showForm) return <button type="button" className="mt-3 rounded-xl border border-white/10 px-4 py-2 text-sm" onClick={() => setShowForm(true)}>إضافة متغير</button>;

  return (
    <form className="grid gap-3 rounded-xl border border-white/10 p-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      void submit('PATCH', `/api/seller/products/${encodeURIComponent(productId)}`, {
        action: 'variant',
        variantId: variant?.id,
        sku: form.get('sku'),
        variantTitle: form.get('variantTitle'),
        price: form.get('price'),
        currency: form.get('currency'),
        warehouseId: form.get('warehouseId'),
        stock: Number(form.get('stock') || 0),
      });
    }}>
      <label className="text-xs text-white/60">اسم المتغير<input name="variantTitle" maxLength={160} defaultValue={variant?.title || ''} placeholder="اللون أو المقاس" className={fieldClass} /></label>
      <label className="text-xs text-white/60">SKU<input name="sku" required maxLength={100} defaultValue={variant?.sku || ''} className={fieldClass} dir="ltr" /></label>
      <label className="text-xs text-white/60">السعر<input name="price" type="number" min="0.0001" step="0.0001" required defaultValue={price?.amount ?? ''} className={fieldClass} /></label>
      <label className="text-xs text-white/60">العملة<select name="currency" required defaultValue={price?.currency || currencies[0]?.code} className={fieldClass}>{currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.code}</option>)}</select></label>
      <label className="text-xs text-white/60">المستودع<select name="warehouseId" defaultValue={inventory?.warehouse.id || ''} className={fieldClass}><option value="">دون تغيير</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</select></label>
      <label className="text-xs text-white/60">الكمية<input name="stock" type="number" min="0" max="1000000" defaultValue={inventory?.onHand ?? 0} className={fieldClass} /></label>
      <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
        <button disabled={busy || !currencies.length} className={buttonClass}>{variant ? 'حفظ المتغير والسعر' : 'إضافة المتغير'}</button>
        {!variant && <button type="button" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm" onClick={() => setShowForm(false)}>إلغاء</button>}
        {variant?.status === 'ACTIVE' && <button type="button" disabled={busy} className="rounded-xl border border-rose-300/20 px-4 py-2.5 text-xs text-rose-200" onClick={() => void submit('PATCH', `/api/seller/products/${encodeURIComponent(productId)}`, { action: 'discontinueVariant', variantId: variant.id })}>إيقاف المتغير</button>}
        {variant && <span className="text-xs text-white/45">{statusNames[variant.status] || variant.status}</span>}
      </div>
    </form>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="rounded-2xl border border-white/10 bg-[#202725] p-4"><p className="text-xs text-white/50">{label}</p><p className="mt-2 text-2xl font-black text-orange-100">{value}</p></article>;
}
