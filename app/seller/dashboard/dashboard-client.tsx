'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';

type Product = {
  id: string;
  title: string;
  images: string[];
  basePrice: number | null;
  stockQuantity: number | null;
  isActive: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
};

type VendorOrder = {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  trackingNumber: string | null;
  order: {
    id: string;
    createdAt: string;
    customerName: string | null;
    phoneNumber: string | null;
    shippingCity: string | null;
    shippingAddress: string | null;
  };
  items: Array<{ id: string; quantity: number; totalPrice: number; product: { title: string } }>;
};

type PropertyListing = {
  id: string;
  title: string;
  price: string;
  currency: string;
  location: string;
  city: string | null;
  status: 'AVAILABLE' | 'SOLD' | 'RENTED';
  isPublished: boolean;
  createdAt: string;
};

type DashboardPayload = {
  seller: null | {
    id: string;
    storeName: string;
    slug: string;
    description: string | null;
    logo: string | null;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
    isVerified?: boolean;
  };
  metrics?: { productCount: number; stockCount: number; revenue: number; pendingFulfillment: number; propertyCount: number; activePropertyCount: number };
  products?: Product[];
  vendorOrders?: VendorOrder[];
  properties?: PropertyListing[];
};

const money = (value: number | null | undefined) => new Intl.NumberFormat('ar-SY').format(value || 0);
const statusNames: Record<string, string> = {
  PENDING: 'بانتظار التجهيز',
  PROCESSING: 'قيد التجهيز',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التسليم',
  CANCELLED: 'ملغي',
  APPROVED: 'معتمد',
  REJECTED: 'مرفوض',
};

async function requestJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال العملية.');
  return payload;
}

export default function SellerDashboard() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [application, setApplication] = useState({ storeName: '', description: '' });
  const [storeForm, setStoreForm] = useState({ storeName: '', slug: '', description: '', logo: '' });
  const [tracking, setTracking] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await requestJson<DashboardPayload>(await fetch('/api/seller/dashboard', { cache: 'no-store' }));
      setData(payload);
      if (payload.seller) {
        setStoreForm({
          storeName: payload.seller.storeName,
          slug: payload.seller.slug,
          description: payload.seller.description || '',
          logo: payload.seller.logo || '',
        });
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل لوحة البائع.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy('application');
    setError('');
    try {
      await requestJson(await fetch('/api/seller/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      }));
      await load();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر إرسال الطلب.');
    } finally {
      setBusy('');
    }
  }

  async function saveStore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy('store');
    setError('');
    try {
      await requestJson(await fetch('/api/seller/store', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeForm),
      }));
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ إعدادات المتجر.');
    } finally {
      setBusy('');
    }
  }

  async function updateStock(product: Product, value: string) {
    const stockQuantity = Number(value);
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0 || stockQuantity > 1_000_000) {
      setError('أدخل كمية مخزون صحيحة من صفر إلى مليون.');
      return;
    }
    setBusy(product.id);
    setError('');
    try {
      await requestJson(await fetch(`/api/seller/products/${encodeURIComponent(product.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity }),
      }));
      await load();
    } catch (stockError) {
      setError(stockError instanceof Error ? stockError.message : 'تعذر تحديث المخزون.');
    } finally {
      setBusy('');
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`هل تريد حذف المنتج «${product.title}»؟`)) return;
    setBusy(product.id);
    setError('');
    try {
      await requestJson(await fetch('/api/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id }),
      }));
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف المنتج.');
    } finally {
      setBusy('');
    }
  }

  async function updateProperty(propertyId: string, patch: Partial<Pick<PropertyListing, 'title' | 'price' | 'location' | 'status' | 'isPublished'>>) {
    setBusy(`property:${propertyId}`);
    setError('');
    try {
      await requestJson(await fetch(`/api/properties/${encodeURIComponent(propertyId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }));
      await load();
      return true;
    } catch (propertyError) {
      setError(propertyError instanceof Error ? propertyError.message : 'تعذر تحديث الإعلان العقاري.');
      return false;
    } finally {
      setBusy('');
    }
  }

  async function deleteProperty(property: PropertyListing) {
    if (!window.confirm(`هل تريد حذف الإعلان «${property.title}» نهائيًا؟`)) return;
    setBusy(`property:${property.id}`);
    setError('');
    try {
      const response = await fetch(`/api/properties/${encodeURIComponent(property.id)}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.error || 'تعذر حذف الإعلان العقاري.');
      }
      await load();
    } catch (propertyError) {
      setError(propertyError instanceof Error ? propertyError.message : 'تعذر حذف الإعلان العقاري.');
    } finally {
      setBusy('');
    }
  }

  async function advanceOrder(order: VendorOrder) {
    const nextStatus = order.status === 'PENDING'
      ? 'PROCESSING'
      : order.status === 'PROCESSING'
        ? 'SHIPPED'
        : order.status === 'SHIPPED'
          ? 'DELIVERED'
          : null;
    if (!nextStatus) return;
    setBusy(order.id);
    setError('');
    try {
      await requestJson(await fetch('/api/seller/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorOrderId: order.id,
          status: nextStatus,
          trackingNumber: tracking[order.id] || order.trackingNumber || '',
        }),
      }));
      await load();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'تعذر تحديث حالة الطلب.');
    } finally {
      setBusy('');
    }
  }

  if (loading && !data) return <main className="mx-auto max-w-7xl px-4 py-12" aria-busy="true">جارٍ تحميل لوحة البائع...</main>;
  if (!data) return <main className="mx-auto max-w-3xl px-4 py-12 text-rose-300">{error || 'تعذر تحميل بيانات المتجر.'}<button onClick={() => void load()} className="mr-3 underline">إعادة المحاولة</button></main>;

  if (!data.seller) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-12 text-ak-cream">
        <section className="ak-panel-raised p-6 sm:p-9">
          <p className="ak-eyebrow">SELLER PROGRAM</p>
          <h1 className="mt-2 text-3xl font-black">افتح متجرك على Akaar</h1>
          <p className="mt-3 text-sm leading-7 text-stone-400">أرسل بيانات المتجر للمراجعة. ستصبح أدوات النشر والطلبات متاحة بعد اعتماد الطلب.</p>
          {error && <p role="alert" className="mt-4 rounded-xl bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
          <form onSubmit={submitApplication} className="mt-6 space-y-4">
            <label className="block text-sm">اسم المتجر
              <input required maxLength={100} value={application.storeName} onChange={(event) => setApplication((current) => ({ ...current, storeName: event.target.value }))} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3" />
            </label>
            <label className="block text-sm">وصف مختصر
              <textarea maxLength={2000} rows={4} value={application.description} onChange={(event) => setApplication((current) => ({ ...current, description: event.target.value }))} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3" />
            </label>
            <button disabled={busy === 'application'} className="ak-button-primary">{busy === 'application' ? 'جارٍ الإرسال...' : 'إرسال طلب البائع'}</button>
          </form>
        </section>
      </main>
    );
  }

  if (data.seller.status !== 'ACTIVE' || !data.seller.isVerified) {
    const message = data.seller.status === 'PENDING'
      ? 'طلب متجرك قيد المراجعة. ستظهر أدوات البيع بعد اعتماد الطلب.'
      : data.seller.status === 'REJECTED'
        ? 'لم تتم الموافقة على طلب المتجر. تواصل مع الإدارة لمعرفة التفاصيل.'
        : data.seller.status === 'ACTIVE'
          ? 'لم يكتمل اعتماد المتجر بعد. تواصل مع الإدارة.'
          : 'تم تعليق المتجر مؤقتًا. تواصل مع الإدارة.';
    return <main dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-ak-cream"><section className="ak-panel-raised p-8 text-center"><h1 className="text-2xl font-bold">{data.seller.storeName}</h1><p className="mt-3 leading-7 text-ak-muted">{message}</p></section></main>;
  }

  const metrics = data.metrics || {
    productCount: 0,
    stockCount: 0,
    revenue: 0,
    pendingFulfillment: 0,
    propertyCount: 0,
    activePropertyCount: 0,
  };
  const products = data.products || [];
  const orders = data.vendorOrders || [];

  return (
    <main dir="rtl" className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-ak-cream sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="ak-eyebrow">VENDOR CENTER</p><h1 className="mt-2 text-3xl font-black">متجري / وكالتي</h1><p className="mt-2 text-sm text-ak-muted">إدارة {data.seller.storeName} ومتابعة منتجاتك وإعلاناتك العقارية.</p></div>
        <Link href={`/shop/${encodeURIComponent(data.seller.slug)}`} className="rounded-xl border border-ak-line px-4 py-3 text-sm transition hover:border-ak-amber/50 hover:bg-ak-brand-soft">عرض متجري العام</Link>
      </div>
      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ['الإيرادات المسجلة', `${money(metrics.revenue)} ل.س`],
          ['المنتجات', money(metrics.productCount)],
          ['المخزون المتاح', money(metrics.stockCount)],
          ['طلبات تحتاج متابعة', money(metrics.pendingFulfillment)],
          ['إعلانات العقارات', money(metrics.propertyCount)],
          ['إعلانات عقارية نشطة', money(metrics.activePropertyCount)],
        ].map(([label, value]) => <article key={label} className="ak-panel p-5"><p className="text-sm text-ak-muted">{label}</p><p className="mt-3 text-2xl font-black text-ak-honey">{value}</p></article>)}
      </section>

      <section className="ak-panel p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">إعدادات المتجر</h2><p className="mt-1 text-xs text-ak-quiet">الاسم والرابط والوصف والشعار الظاهر للزوار.</p></div><div className="flex flex-wrap gap-2"><Link href="/properties/new" className="rounded-xl bg-ak-brand px-4 py-2.5 text-sm font-bold text-ak-ink shadow-ak-glow transition hover:brightness-105">إضافة إعلان عقاري</Link><Link href="/newPost" className="rounded-xl border border-ak-line px-4 py-2.5 text-sm transition hover:bg-ak-brand-soft">إضافة منتج</Link></div></div>
        <form onSubmit={saveStore} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">اسم المتجر<input required maxLength={100} value={storeForm.storeName} onChange={(event) => setStoreForm((current) => ({ ...current, storeName: event.target.value }))} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3" /></label>
          <label className="text-sm">رابط المتجر<input required maxLength={80} value={storeForm.slug} onChange={(event) => setStoreForm((current) => ({ ...current, slug: event.target.value }))} dir="ltr" className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3" /></label>
          <label className="text-sm md:col-span-2">الوصف<textarea rows={3} maxLength={2000} value={storeForm.description} onChange={(event) => setStoreForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3" /></label>
          <label className="text-sm md:col-span-2">رابط الشعار<input type="url" value={storeForm.logo} onChange={(event) => setStoreForm((current) => ({ ...current, logo: event.target.value }))} dir="ltr" className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3" /></label>
          <button disabled={busy === 'store'} className="w-fit rounded-xl border border-ak-amber/40 px-4 py-2.5 text-sm text-ak-honey transition hover:bg-ak-brand-soft disabled:opacity-50">{busy === 'store' ? 'جارٍ الحفظ...' : 'حفظ إعدادات المتجر'}</button>
        </form>
      </section>

      <section className="ak-panel p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-bold">إعلانات وكالتي العقارية</h2><p className="mt-1 text-xs text-stone-500">تحرير تفاصيل الإعلان أو إيقاف نشره أو حذفه.</p></div>
          <span className="rounded-full border border-ak-amber/20 bg-ak-brand-soft px-3 py-1 text-xs text-ak-honey">{money(metrics.activePropertyCount)} نشط</span>
        </div>
        {!data.properties?.length ? <p className="text-sm text-stone-500">لا توجد إعلانات عقارية مرتبطة بهذه الوكالة.</p> : (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.properties.map((property) => (
              <AgencyPropertyCard
                key={property.id}
                property={property}
                busy={busy === `property:${property.id}`}
                onSave={updateProperty}
                onDelete={deleteProperty}
              />
            ))}
          </div>
        )}
      </section>

      <section className="ak-panel p-5">
        <h2 className="mb-4 text-lg font-bold">المنتجات والمخزون</h2>
        {!products.length ? <p className="text-sm text-stone-500">لا توجد منتجات في متجرك حتى الآن.</p> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-right text-sm"><thead className="text-xs text-stone-500"><tr><th className="pb-3">المنتج</th><th className="pb-3">السعر</th><th className="pb-3">الحالة</th><th className="pb-3">المخزون</th><th className="pb-3"></th></tr></thead><tbody>
            {products.map((product) => <StockRow key={product.id} product={product} busy={busy === product.id} onSave={updateStock} onDelete={deleteProduct} />)}
          </tbody></table></div>
        )}
      </section>

      <section className="ak-panel p-5">
        <h2 className="mb-4 text-lg font-bold">طلبات العملاء والشحنات</h2>
        {!orders.length ? <p className="text-sm text-stone-500">لا توجد طلبات مرتبطة بمتجرك.</p> : (
          <div className="space-y-3">
            {orders.map((order) => {
              const nextLabel = order.status === 'PENDING' ? 'بدء التجهيز' : order.status === 'PROCESSING' ? 'تأكيد الشحن' : order.status === 'SHIPPED' ? 'تأكيد التسليم' : null;
              return <article key={order.id} className="rounded-xl border border-ak-line-strong/[.08] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-stone-500">طلب {order.order.id.slice(0, 12)} · {new Date(order.order.createdAt).toLocaleDateString('ar')}</p><p className="mt-1 font-semibold">{order.items.map((item) => `${item.product.title} × ${item.quantity}`).join('، ')}</p><p className="mt-2 text-xs text-stone-400">التوصيل إلى: {order.order.customerName || '—'} · {order.order.phoneNumber || '—'} · {order.order.shippingCity || '—'} {order.order.shippingAddress || ''}</p></div><span className="rounded-full bg-ak-amber/10 px-3 py-1 text-xs text-ak-honey">{statusNames[order.status] || order.status}</span></div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-ak-line-strong/[.06] pt-3"><span className="text-sm text-stone-400">الإجمالي: {money(order.items.reduce((sum, item) => sum + item.totalPrice, 0))} ل.س{order.trackingNumber ? ` · التتبع: ${order.trackingNumber}` : ''}</span>
                  {nextLabel && <div className="flex flex-wrap gap-2"><input aria-label="رقم التتبع" placeholder="رقم التتبع (اختياري)" value={tracking[order.id] ?? order.trackingNumber ?? ''} onChange={(event) => setTracking((current) => ({ ...current, [order.id]: event.target.value }))} className="w-44 rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-xs" /><button disabled={busy === order.id} onClick={() => void advanceOrder(order)} className="rounded-lg bg-ak-amber px-3 py-2 text-xs font-bold text-ak-canvas disabled:opacity-50">{busy === order.id ? 'جارٍ التحديث...' : nextLabel}</button></div>}
                </div>
              </article>;
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function AgencyPropertyCard({
  property,
  busy,
  onSave,
  onDelete,
}: {
  property: PropertyListing;
  busy: boolean;
  onSave: (id: string, patch: Partial<Pick<PropertyListing, 'title' | 'price' | 'location' | 'status' | 'isPublished'>>) => Promise<boolean>;
  onDelete: (property: PropertyListing) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(property.title);
  const [price, setPrice] = useState(property.price);
  const [location, setLocation] = useState(property.location);
  const [status, setStatus] = useState<PropertyListing['status']>(property.status);
  const [isPublished, setIsPublished] = useState(property.isPublished);

  function beginEditing() {
    setTitle(property.title);
    setPrice(property.price);
    setLocation(property.location);
    setStatus(property.status);
    setIsPublished(property.isPublished);
    setEditing(true);
  }

  return (
    <article className="rounded-xl border border-ak-line-strong/[.08] p-4">
      {editing ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (await onSave(property.id, { title: title.trim(), price, location: location.trim(), status, isPublished })) {
              setEditing(false);
            }
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <label className="text-xs text-stone-400">عنوان الإعلان<input required maxLength={180} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-sm text-ak-cream" /></label>
          <label className="text-xs text-stone-400">السعر<input required inputMode="decimal" pattern="\\d+(\\.\\d{1,2})?" value={price} onChange={(event) => setPrice(event.target.value)} className="mt-1 w-full rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-sm text-ak-cream" /></label>
          <label className="text-xs text-stone-400 sm:col-span-2">الموقع<input required maxLength={240} value={location} onChange={(event) => setLocation(event.target.value)} className="mt-1 w-full rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-sm text-ak-cream" /></label>
          <label className="text-xs text-stone-400">حالة العقار<select value={status} onChange={(event) => setStatus(event.target.value as PropertyListing['status'])} className="mt-1 w-full rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-sm text-ak-cream"><option value="AVAILABLE">متاح</option><option value="SOLD">مباع</option><option value="RENTED">مؤجر</option></select></label>
          <label className="flex items-center gap-2 self-end pb-2 text-xs text-stone-300"><input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} className="accent-ak-amber" />منشور للعامة</label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={busy} className="rounded-lg bg-ak-amber px-3 py-2 text-xs font-bold text-ak-canvas disabled:opacity-50">{busy ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-ak-line px-3 py-2 text-xs">إلغاء</button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-bold">{property.title}</h3>
              <p className="mt-1 text-xs text-stone-400">{property.city ? `${property.city} · ` : ''}{property.location}</p>
              <p className="mt-2 text-sm text-ak-honey">{new Intl.NumberFormat('ar').format(Number(property.price))} {property.currency}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs ${property.status === 'AVAILABLE' && property.isPublished ? 'bg-emerald-500/10 text-emerald-200' : 'bg-stone-500/10 text-stone-300'}`}>{property.isPublished ? property.status : 'غير منشور'}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-ak-line-strong/[.06] pt-3">
            <button type="button" disabled={busy} onClick={beginEditing} className="rounded-lg border border-ak-line px-3 py-2 text-xs hover:border-ak-amber/40 disabled:opacity-50">تعديل الإعلان</button>
            <button type="button" disabled={busy} onClick={() => void onDelete(property)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 hover:bg-rose-500/10 disabled:opacity-50">{busy ? 'جارٍ التنفيذ...' : 'حذف الإعلان'}</button>
          </div>
        </>
      )}
    </article>
  );
}

function StockRow({ product, busy, onSave, onDelete }: {
  product: Product;
  busy: boolean;
  onSave: (product: Product, value: string) => Promise<void>;
  onDelete: (product: Product) => Promise<void>;
}) {
  const [draft, setDraft] = useState<{ productId: string; value: string } | null>(null);
  const value = draft?.productId === product.id ? draft.value : String(product.stockQuantity ?? 0);

  return (
    <tr className="border-t border-ak-line-strong/[.06]">
      <td className="py-3 font-semibold">{product.title}</td>
      <td className="py-3">{money(product.basePrice)} ل.س</td>
      <td className="py-3">{statusNames[product.approvalStatus] || (product.isActive ? 'ظاهر' : 'غير منشور')}</td>
      <td className="py-3"><input type="number" min="0" max="1000000" value={value} onChange={(event) => setDraft({ productId: product.id, value: event.target.value })} className="w-24 rounded-lg border border-ak-line bg-ak-canvas px-3 py-2" /></td>
      <td className="py-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy || value === String(product.stockQuantity ?? 0)} onClick={() => { void onSave(product, value).then(() => setDraft(null)); }} className="rounded-lg border border-ak-line px-3 py-2 text-xs disabled:opacity-40">حفظ المخزون</button>
          <Link href={`/editPost/${encodeURIComponent(product.id)}`} className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs text-ak-honey">تعديل</Link>
          <button type="button" disabled={busy} onClick={() => void onDelete(product)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">حذف</button>
        </div>
      </td>
    </tr>
  );
}
