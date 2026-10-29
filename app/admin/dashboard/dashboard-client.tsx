'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

type Settings = {
  marketplaceEnabled: boolean;
  sellerApplicationsEnabled: boolean;
  productApprovalEnabled: boolean;
};

type ProductQueueItem = {
  id: string;
  title: string;
  description: string | null;
  categoryName: string;
  basePrice: number | null;
  images: string[];
  userName: string | null;
  createdAt: string;
};

type SellerQueueItem = {
  id: string;
  storeName: string;
  slug: string;
  createdAt: string;
  contactName: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  residence: string | null;
  latitude: number | null;
  longitude: number | null;
  businessType: string | null;
  sellingCategories: string | null;
  intendedProducts: string | null;
  description: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
  hasIdentityDocument: boolean;
  user: { email: string };
};

type AdminUser = {
  id: string;
  email: string;
  userName: string | null;
  role: string;
  status: string;
  createdAt: string;
  seller: { storeName: string } | null;
  _count: { properties: number };
};

type AdminProperty = {
  id: string;
  title: string;
  price: string;
  currency: string;
  location: string;
  city: string | null;
  status: string;
  isPublished: boolean;
  createdAt: string;
  owner: { id: string; email: string; userName: string | null };
  store: { name: string; slug: string };
};

type DashboardData = {
  metrics: {
    users: number;
    activeVendors: number;
    pendingVendors: number;
    productQueue: number;
    products: number;
    orders: number;
  };
  monthly: Array<{ month: string; revenue: number; newUsers: number; newVendors: number }>;
  settings: Settings;
};

type QueueState<T> = { items: T[]; page: number; hasMore: boolean };

function number(value: number) {
  return new Intl.NumberFormat('ar').format(value);
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="ak-panel p-5">
      <p className="text-sm text-stone-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-ak-honey">{number(value)}</p>
      <p className="mt-2 text-xs text-stone-500">{detail}</p>
    </article>
  );
}

function TrendChart({ title, data, field, color }: {
  title: string;
  data: DashboardData['monthly'];
  field: 'revenue' | 'newUsers' | 'newVendors';
  color: string;
}) {
  const values = data.map((item) => item[field]);
  const maximum = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = values.length < 2 ? 150 : 8 + (index * 284) / (values.length - 1);
    const y = 104 - (value / maximum) * 92;
    return `${x},${y}`;
  }).join(' ');

  return (
    <section className="ak-panel p-5">
      <h2 className="font-bold">{title}</h2>
      <svg viewBox="0 0 300 120" role="img" aria-label={title} className="mt-4 h-36 w-full overflow-visible">
        {[12, 58, 104].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />)}
        <polyline fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={points} />
        {values.map((value, index) => {
          const x = values.length < 2 ? 150 : 8 + (index * 284) / (values.length - 1);
          const y = 104 - (value / maximum) * 92;
          return <circle key={`${data[index]?.month}-${index}`} cx={x} cy={y} r="3" fill={color} />;
        })}
      </svg>
      <div className="flex justify-between gap-1 text-[10px] text-stone-500">
        {data.filter((_, index) => index % 3 === 0 || index === data.length - 1).map((item) => (
          <span key={item.month}>{item.month}</span>
        ))}
      </div>
    </section>
  );
}

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [products, setProducts] = useState<QueueState<ProductQueueItem>>({ items: [], page: 1, hasMore: false });
  const [sellers, setSellers] = useState<QueueState<SellerQueueItem>>({ items: [], page: 1, hasMore: false });
  const [users, setUsers] = useState<QueueState<AdminUser>>({ items: [], page: 1, hasMore: false });
  const [properties, setProperties] = useState<QueueState<AdminProperty>>({ items: [], page: 1, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardResponse, productQueueResponse, sellerQueueResponse, usersResponse, propertiesResponse] = await Promise.all([
        fetch('/api/admin/dashboard', { cache: 'no-store' }),
        fetch('/api/admin/queue?type=products&page=1&limit=10', { cache: 'no-store' }),
        fetch('/api/admin/queue?type=sellers&page=1&limit=10', { cache: 'no-store' }),
        fetch('/api/admin/users?page=1&limit=20', { cache: 'no-store' }),
        fetch('/api/admin/properties?page=1&limit=20', { cache: 'no-store' }),
      ]);
      const [dashboard, productQueue, sellerQueue, userPage, propertyPage] = await Promise.all([
        readJson<DashboardData>(dashboardResponse),
        readJson<{ items: ProductQueueItem[]; page: number; hasMore: boolean }>(productQueueResponse),
        readJson<{ items: SellerQueueItem[]; page: number; hasMore: boolean }>(sellerQueueResponse),
        readJson<QueueState<AdminUser>>(usersResponse),
        readJson<QueueState<AdminProperty>>(propertiesResponse),
      ]);
      setData(dashboard);
      setProducts(productQueue);
      setSellers(sellerQueue);
      setUsers(userPage);
      setProperties(propertyPage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل لوحة الإدارة.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function loadMore(type: 'products' | 'sellers' | 'users' | 'properties') {
    const queue = type === 'products' ? products : type === 'sellers' ? sellers : type === 'users' ? users : properties;
    const endpoint = type === 'products' || type === 'sellers'
      ? `/api/admin/queue?type=${type}&page=${queue.page + 1}&limit=10`
      : `/api/admin/${type}?page=${queue.page + 1}&limit=20`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    const next = await readJson<{ items: Array<ProductQueueItem | SellerQueueItem | AdminUser | AdminProperty>; page: number; hasMore: boolean }>(response);
    if (type === 'products') setProducts((current) => ({ ...next, items: [...current.items, ...(next.items as ProductQueueItem[])] }));
    else if (type === 'sellers') setSellers((current) => ({ ...next, items: [...current.items, ...(next.items as SellerQueueItem[])] }));
    else if (type === 'users') setUsers((current) => ({ ...next, items: [...current.items, ...(next.items as AdminUser[])] }));
    else setProperties((current) => ({ ...next, items: [...current.items, ...(next.items as AdminProperty[])] }));
  }

  async function deleteUser(user: AdminUser) {
    if (!window.confirm(`هل تريد حذف حساب ${user.email}؟ سيتم حذف ملفه ومتجره وإعلاناته. لا يمكن حذف الحسابات التي لديها سجلات مالية.`)) return;
    setPendingAction(`user:${user.id}`);
    setError('');
    try {
      await readJson(await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, { method: 'DELETE' }));
      setUsers((current) => ({ ...current, items: current.items.filter((item) => item.id !== user.id) }));
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف المستخدم.');
    } finally {
      setPendingAction('');
    }
  }

  async function forceDeleteProperty(property: AdminProperty) {
    if (!window.confirm(`حذف نهائي للإعلان «${property.title}»؟ سيؤدي ذلك أيضًا إلى حذف إدخالات المفضلة المرتبطة به.`)) return;
    setPendingAction(`property:${property.id}`);
    setError('');
    try {
      await readJson(await fetch(`/api/admin/properties/${encodeURIComponent(property.id)}`, { method: 'DELETE' }));
      setProperties((current) => ({ ...current, items: current.items.filter((item) => item.id !== property.id) }));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الإعلان.');
    } finally {
      setPendingAction('');
    }
  }

  async function review(type: 'products' | 'sellers', id: string, status: 'APPROVED' | 'REJECTED' | 'ACTIVE') {
    const key = `${type}:${id}`;
    setPendingAction(key);
    setError('');
    try {
      const endpoint = type === 'products'
        ? `/api/admin/products/${encodeURIComponent(id)}/approval`
        : `/api/admin/sellers/${encodeURIComponent(id)}/approval`;
      await readJson(await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }));
      if (type === 'products') setProducts((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
      else setSellers((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
      await load();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذرت مراجعة الطلب.');
    } finally {
      setPendingAction('');
    }
  }

  async function updateSetting(key: keyof Settings, enabled: boolean) {
    if (!data) return;
    setData((current) => current ? { ...current, settings: { ...current.settings, [key]: enabled } } : current);
    setError('');
    try {
      await readJson(await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: enabled }),
      }));
    } catch (settingError) {
      setData((current) => current ? { ...current, settings: { ...current.settings, [key]: !enabled } } : current);
      setError(settingError instanceof Error ? settingError.message : 'تعذر حفظ الإعداد.');
    }
  }

  if (loading && !data) return <main className="mx-auto max-w-7xl px-4 py-10" aria-busy="true">جارٍ تحميل لوحة الإدارة...</main>;
  if (error && !data) return <main className="mx-auto max-w-3xl px-4 py-10 text-rose-300">{error}<button onClick={() => void load()} className="mr-3 underline">إعادة المحاولة</button></main>;
  if (!data) return null;

  const toggles: Array<{ key: keyof Settings; label: string; description: string }> = [
    { key: 'marketplaceEnabled', label: 'الشراء متاح', description: 'السماح بإنشاء طلبات شراء جديدة.' },
    { key: 'sellerApplicationsEnabled', label: 'طلبات البائعين', description: 'السماح للمستخدمين بالتقديم لفتح متجر.' },
    { key: 'productApprovalEnabled', label: 'مراجعة المنتجات', description: 'تعليق المنتجات الجديدة حتى مراجعتها.' },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ak-eyebrow">OVERVIEW</p>
          <h1 className="mt-2 text-3xl font-black">لوحة الإدارة</h1>
          <p className="mt-2 text-sm text-stone-400">مؤشرات تشغيل المنصة ومراجعة البائعين والمنتجات.</p>
        </div>
        <button type="button" onClick={() => void load()} className="rounded-xl border border-ak-line px-4 py-2 text-sm hover:bg-ak-brand-soft">تحديث البيانات</button>
      </div>

      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="المستخدمون النشطون" value={data.metrics.users} detail="حسابات نشطة" />
        <Metric label="البائعون المعتمدون" value={data.metrics.activeVendors} detail={`${number(data.metrics.pendingVendors)} طلب بائع قيد المراجعة`} />
        <Metric label="المنتجات" value={data.metrics.products} detail={`${number(data.metrics.productQueue)} منتج بانتظار الموافقة`} />
        <Metric label="الطلبات" value={data.metrics.orders} detail="طلبات محفوظة في قاعدة البيانات" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <TrendChart title="إجمالي المبيعات الشهرية (ل.س)" data={data.monthly} field="revenue" color="#E79A4B" />
        <TrendChart title="المستخدمون الجدد شهريًا" data={data.monthly} field="newUsers" color="#60A5FA" />
        <TrendChart title="البائعون الجدد شهريًا" data={data.monthly} field="newVendors" color="#34D399" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="ak-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="font-bold">مراجعة المنتجات</h2><p className="mt-1 text-xs text-stone-500">المنتجات الجديدة لا تظهر قبل الموافقة.</p></div>
            <span className="rounded-full border border-ak-amber/20 bg-ak-brand-soft px-3 py-1 text-xs text-ak-honey">{number(data.metrics.productQueue)}</span>
          </div>
          <div className="space-y-3">
            {products.items.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-ak-line-strong/[.06] pt-3">
                <div className="flex min-w-0 items-center gap-3">
                  {item.images[0] && <Image src={item.images[0]} alt="" width={56} height={56} unoptimized className="h-14 w-14 rounded-lg object-cover" />}
                  <div className="min-w-0"><p className="truncate font-semibold">{item.title}</p><p className="text-xs text-stone-500">{item.categoryName} · {item.userName || 'بائع'} · {item.basePrice === null ? 'السعر غير محدد' : `${number(item.basePrice)} ل.س`}</p><p className="mt-1 line-clamp-2 text-xs text-stone-500">{item.description || 'لا يوجد وصف.'}</p><p className="mt-1 text-[10px] text-stone-600">{new Date(item.createdAt).toLocaleDateString('ar')}</p></div>
                </div>
                <div className="flex gap-2">
                  <button disabled={pendingAction === `products:${item.id}`} onClick={() => void review('products', item.id, 'APPROVED')} className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs text-emerald-200 disabled:opacity-50">موافقة</button>
                  <button disabled={pendingAction === `products:${item.id}`} onClick={() => void review('products', item.id, 'REJECTED')} className="rounded-lg bg-rose-500/15 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">رفض</button>
                </div>
              </article>
            ))}
            {!products.items.length && <p className="py-4 text-sm text-stone-500">لا توجد منتجات بانتظار المراجعة.</p>}
          </div>
          {products.hasMore && <button type="button" onClick={() => void loadMore('products')} className="mt-4 text-sm text-ak-honey underline">تحميل المزيد</button>}
        </div>

        <div className="ak-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="font-bold">طلبات فتح المتاجر</h2><p className="mt-1 text-xs text-stone-500">اعتماد الطلب يمنح المستخدم دور البائع.</p></div>
            <span className="rounded-full border border-ak-amber/20 bg-ak-brand-soft px-3 py-1 text-xs text-ak-honey">{number(data.metrics.pendingVendors)}</span>
          </div>
          <div className="space-y-3">
            {sellers.items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-ak-line-strong/[.08] bg-ak-ink/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{item.storeName}</p>
                    <p className="mt-1 truncate text-xs text-stone-500">{item.contactName || 'اسم غير مقدم'} · {item.contactEmail || item.user.email} · /shop/{item.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    {item.hasIdentityDocument && (
                      <a
                        href={`/api/admin/sellers/${encodeURIComponent(item.id)}/identity-document`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs font-semibold text-ak-honey transition hover:bg-ak-brand-soft"
                      >
                        عرض وثيقة الهوية
                      </a>
                    )}
                    <button disabled={pendingAction === `sellers:${item.id}`} onClick={() => void review('sellers', item.id, 'ACTIVE')} className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs text-emerald-200 disabled:opacity-50">اعتماد</button>
                    <button disabled={pendingAction === `sellers:${item.id}`} onClick={() => void review('sellers', item.id, 'REJECTED')} className="rounded-lg bg-rose-500/15 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">رفض</button>
                  </div>
                </div>
                <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
                  <div><dt className="text-stone-500">البريد الإلكتروني</dt><dd className="mt-1 break-all">{item.contactEmail || item.user.email}</dd></div>
                  <div><dt className="text-stone-500">رقم الهاتف</dt><dd className="mt-1" dir="ltr">{item.phoneNumber || '—'}</dd></div>
                  <div><dt className="text-stone-500">نوع النشاط</dt><dd className="mt-1">{item.businessType || '—'}</dd></div>
                  <div><dt className="text-stone-500">مكان الإقامة</dt><dd className="mt-1">{item.residence || '—'}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-stone-500">فئات المنتجات</dt><dd className="mt-1">{item.sellingCategories || '—'}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-stone-500">المنتجات وخطة البيع</dt><dd className="mt-1 whitespace-pre-wrap leading-6">{item.intendedProducts || '—'}</dd></div>
                  {item.description && <div className="sm:col-span-2"><dt className="text-stone-500">نبذة عن المتجر</dt><dd className="mt-1 whitespace-pre-wrap leading-6">{item.description}</dd></div>}
                  {item.latitude !== null && item.longitude !== null && (
                    <div className="sm:col-span-2"><dt className="text-stone-500">الموقع المحدد على الخريطة</dt><dd className="mt-1" dir="ltr">{item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</dd></div>
                  )}
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    {item.facebookUrl && <a href={item.facebookUrl} target="_blank" rel="noreferrer" className="text-ak-honey underline">Facebook</a>}
                    {item.youtubeUrl && <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="text-ak-honey underline">YouTube</a>}
                    {item.twitterUrl && <a href={item.twitterUrl} target="_blank" rel="noreferrer" className="text-ak-honey underline">Twitter / X</a>}
                  </div>
                </dl>
              </article>
            ))}
            {!sellers.items.length && <p className="py-4 text-sm text-stone-500">لا توجد طلبات بانتظار المراجعة.</p>}
          </div>
          {sellers.hasMore && <button type="button" onClick={() => void loadMore('sellers')} className="mt-4 text-sm text-ak-honey underline">تحميل المزيد</button>}
        </div>
      </section>

      <section className="space-y-6">
        <div className="ak-panel p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-lg font-bold">إدارة المستخدمين</h2><p className="mt-1 text-xs text-stone-500">حذف الحساب يزيل المتجر والإعلانات والمفضلة. السجلات المالية محفوظة ولا تسمح بالحذف.</p></div>
            <span className="text-xs text-stone-400">{number(users.items.length)} مستخدم في الصفحة الحالية</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-right text-sm">
              <thead className="text-xs text-stone-500"><tr><th className="pb-3">المستخدم</th><th className="pb-3">الدور</th><th className="pb-3">المتجر</th><th className="pb-3">إعلانات عقارية</th><th className="pb-3">الحالة</th><th className="pb-3">إجراء</th></tr></thead>
              <tbody>
                {users.items.map((user) => (
                  <tr key={user.id} className="border-t border-ak-line-strong/[.06]">
                    <td className="py-3"><p className="font-semibold">{user.userName || 'بدون اسم'}</p><p className="text-xs text-stone-500">{user.email}</p></td>
                    <td className="py-3">{user.role}</td>
                    <td className="py-3">{user.seller?.storeName || '—'}</td>
                    <td className="py-3">{number(user._count.properties)}</td>
                    <td className="py-3">{user.status}</td>
                    <td className="py-3"><button type="button" disabled={pendingAction === `user:${user.id}`} onClick={() => void deleteUser(user)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 hover:bg-rose-500/10 disabled:opacity-50">{pendingAction === `user:${user.id}` ? 'جارٍ الحذف...' : 'حذف المستخدم'}</button></td>
                  </tr>
                ))}
                {!users.items.length && <tr><td colSpan={6} className="py-5 text-center text-stone-500">لا يوجد مستخدمون لعرضهم.</td></tr>}
              </tbody>
            </table>
          </div>
          {users.hasMore && <button type="button" disabled={Boolean(pendingAction)} onClick={() => void loadMore('users')} className="mt-4 text-sm text-ak-honey underline disabled:opacity-50">تحميل مستخدمين إضافيين</button>}
        </div>

        <div className="ak-panel p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-lg font-bold">إعلانات العقارات</h2><p className="mt-1 text-xs text-stone-500">الحذف النهائي يزيل الإعلان وجميع سجلات المفضلة التابعة له.</p></div>
            <span className="text-xs text-stone-400">{number(properties.items.length)} إعلان محمّل</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-right text-sm">
              <thead className="text-xs text-stone-500"><tr><th className="pb-3">العقار</th><th className="pb-3">المالك / الوكالة</th><th className="pb-3">الموقع</th><th className="pb-3">السعر</th><th className="pb-3">الحالة</th><th className="pb-3">إجراء</th></tr></thead>
              <tbody>
                {properties.items.map((property) => (
                  <tr key={property.id} className="border-t border-ak-line-strong/[.06]">
                    <td className="py-3 font-semibold">{property.title}</td>
                    <td className="py-3"><p>{property.owner.userName || property.owner.email}</p><p className="text-xs text-stone-500">{property.store.name}</p></td>
                    <td className="py-3">{property.city ? `${property.city} · ` : ''}{property.location}</td>
                    <td className="py-3">{new Intl.NumberFormat('ar').format(Number(property.price))} {property.currency}</td>
                    <td className="py-3">{property.status}{property.isPublished ? '' : ' · مخفي'}</td>
                    <td className="py-3"><button type="button" disabled={pendingAction === `property:${property.id}`} onClick={() => void forceDeleteProperty(property)} className="rounded-lg bg-rose-600/20 px-3 py-2 text-xs font-bold text-rose-100 hover:bg-rose-600/40 disabled:opacity-50">{pendingAction === `property:${property.id}` ? 'جارٍ الحذف...' : 'حذف إجباري نهائي'}</button></td>
                  </tr>
                ))}
                {!properties.items.length && <tr><td colSpan={6} className="py-5 text-center text-stone-500">لا توجد إعلانات عقارية.</td></tr>}
              </tbody>
            </table>
          </div>
          {properties.hasMore && <button type="button" disabled={Boolean(pendingAction)} onClick={() => void loadMore('properties')} className="mt-4 text-sm text-ak-honey underline disabled:opacity-50">تحميل إعلانات إضافية</button>}
        </div>
      </section>

      <section className="ak-panel p-5">
        <h2 className="font-bold">إعدادات المنصة</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {toggles.map((toggle) => (
            <label key={toggle.key} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-ak-line-strong/[.08] p-4">
              <span><span className="block text-sm font-semibold">{toggle.label}</span><span className="mt-1 block text-xs leading-5 text-stone-500">{toggle.description}</span></span>
              <input type="checkbox" checked={data.settings[toggle.key]} onChange={(event) => void updateSetting(toggle.key, event.target.checked)} className="mt-1 h-5 w-5 accent-ak-amber" />
            </label>
          ))}
        </div>
      </section>
    </main>
  );
}
