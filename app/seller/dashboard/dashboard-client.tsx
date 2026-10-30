'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Box,
  Building2,
  Facebook,
  FileImage,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
  Youtube,
} from 'lucide-react';

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
    contactName?: string | null;
    contactEmail?: string | null;
    phoneNumber?: string | null;
    residence?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    businessType?: string | null;
    sellingCategories?: string | null;
    intendedProducts?: string | null;
    facebookUrl?: string | null;
    youtubeUrl?: string | null;
    twitterUrl?: string | null;
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

type SellerApplication = {
  contactName: string;
  storeName: string;
  contactEmail: string;
  phoneNumber: string;
  residence: string;
  businessType: string;
  sellingCategories: string;
  intendedProducts: string;
  description: string;
  identityDocumentFileId: string;
  facebookUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  latitude: number | null;
  longitude: number | null;
};

const initialApplication: SellerApplication = {
  contactName: '',
  storeName: '',
  contactEmail: '',
  phoneNumber: '',
  residence: '',
  businessType: '',
  sellingCategories: '',
  intendedProducts: '',
  description: '',
  identityDocumentFileId: '',
  facebookUrl: '',
  youtubeUrl: '',
  twitterUrl: '',
  latitude: null,
  longitude: null,
};

const OnClickMap = dynamic(() => import('../../../components/map/onClickMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-ak-line bg-ak-surface text-sm text-ak-muted">
      جاري تحميل الخريطة...
    </div>
  ),
});

const fieldClassName = 'mt-2 w-full rounded-2xl border border-ak-line bg-ak-surface px-4 py-3.5 text-sm text-ak-cream outline-none transition placeholder:text-ak-muted focus:border-primary-600 focus:ring-4 focus:ring-primary-500/15';

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
  const [application, setApplication] = useState<SellerApplication>(initialApplication);
  const [identityDocumentName, setIdentityDocumentName] = useState('');
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
    if (application.latitude === null || application.longitude === null) {
      setError('حدد موقع إقامتك على الخريطة قبل إرسال الطلب.');
      return;
    }
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

  async function uploadIdentityDocument(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError('يجب ألا يتجاوز حجم صورة الهوية 4 ميغابايت.');
      input.value = '';
      return;
    }

    setBusy('identity-document');
    setError('');
    setApplication((current) => ({ ...current, identityDocumentFileId: '' }));
    setIdentityDocumentName('');
    try {
      const body = new FormData();
      body.append('file', file);
      const result = await requestJson<{ fileId: string }>(
        await fetch('/api/seller/application/identity-document', {
          method: 'POST',
          body,
        }),
      );
      setApplication((current) => ({ ...current, identityDocumentFileId: result.fileId }));
      setIdentityDocumentName(file.name);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'تعذر رفع صورة الهوية.');
    } finally {
      input.value = '';
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
      <main dir="rtl" className="relative min-h-screen overflow-hidden bg-ak-canvas px-4 py-8 text-ak-cream sm:px-6 sm:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-12 size-96 rounded-full bg-primary-300/25 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 size-[28rem] rounded-full bg-amber-200/30 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl">
          <header className="ak-panel-raised relative mb-8 overflow-hidden rounded-[2rem] p-6 shadow-ak-panel sm:p-10">
            <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-primary-300/30 to-transparent sm:block" />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary-300">
                  <Store className="size-4" /> Akaar seller program
                </p>
                <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">حوّل خبرتك إلى<br className="hidden sm:block" /> متجر يثق به الجميع.</h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-ak-muted sm:text-base">
                  أخبرنا عنك وعن المنتجات التي ستقدمها. نراجع بياناتك لحماية مجتمع أكار ومساعدة العملاء على الوصول إلى بائعين موثوقين.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-primary-400/25 bg-primary-900/35 px-4 py-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-400 text-lg font-black text-neutral-900">01</span>
                <span><span className="block text-xs text-ak-muted">الخطوة الأولى</span><span className="mt-1 block text-sm font-bold">ملف البائع والمتجر</span></span>
              </div>
            </div>
          </header>

          {error && <p role="alert" className="mb-6 rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-800">{error}</p>}

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <form onSubmit={submitApplication} className="space-y-5">
              <section className="ak-panel p-5 shadow-ak-card sm:p-7">
                <div className="mb-6 flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-300"><UserRound className="size-5" /></span>
                  <div><p className="text-xs font-bold tracking-widest text-primary-300">01 / معلومات أساسية</p><h2 className="mt-1 text-xl font-black">من أنت؟</h2><p className="mt-1 text-sm text-ak-muted">بيانات التواصل والموقع الذي تعمل منه.</p></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">الاسم الكامل <span className="text-primary-300">*</span>
                    <input required maxLength={120} autoComplete="name" value={application.contactName} onChange={(event) => setApplication((current) => ({ ...current, contactName: event.target.value }))} className={fieldClassName} placeholder="الاسم كما يظهر في وثيقة الهوية" />
                  </label>
                  <label className="text-sm font-semibold">اسم المتجر أو النشاط <span className="text-primary-300">*</span>
                    <input required maxLength={100} value={application.storeName} onChange={(event) => setApplication((current) => ({ ...current, storeName: event.target.value }))} className={fieldClassName} placeholder="مثال: متجر البيت الأنيق" />
                  </label>
                  <label className="text-sm font-semibold">البريد الإلكتروني <span className="text-primary-300">*</span>
                    <span className="relative mt-2 block"><Mail className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary-300" /><input required type="email" autoComplete="email" maxLength={254} value={application.contactEmail} onChange={(event) => setApplication((current) => ({ ...current, contactEmail: event.target.value }))} dir="ltr" className={`${fieldClassName} mt-0 pr-11 text-left`} placeholder="you@example.com" /></span>
                  </label>
                  <label className="text-sm font-semibold">رقم الهاتف <span className="text-primary-300">*</span>
                    <span className="relative mt-2 block"><Phone className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary-300" /><input required type="tel" inputMode="tel" autoComplete="tel" maxLength={25} value={application.phoneNumber} onChange={(event) => setApplication((current) => ({ ...current, phoneNumber: event.target.value }))} dir="ltr" className={`${fieldClassName} mt-0 pr-11 text-left`} placeholder="+963 9xx xxx xxx" /></span>
                  </label>
                  <label className="text-sm font-semibold">نوع النشاط <span className="text-primary-300">*</span>
                    <select required value={application.businessType} onChange={(event) => setApplication((current) => ({ ...current, businessType: event.target.value }))} className={fieldClassName}>
                      <option value="" className="bg-ak-surface text-ak-cream">اختر نوع النشاط</option>
                      <option value="INDIVIDUAL" className="bg-ak-surface text-ak-cream">بائع فردي</option>
                      <option value="STORE" className="bg-ak-surface text-ak-cream">متجر أو شركة</option>
                      <option value="ARTISAN" className="bg-ak-surface text-ak-cream">حرفي أو صانع</option>
                      <option value="AGENCY" className="bg-ak-surface text-ak-cream">وكالة أو موزع</option>
                      <option value="OTHER" className="bg-ak-surface text-ak-cream">أخرى</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold">مكان الإقامة / مقر النشاط <span className="text-primary-300">*</span>
                    <span className="relative mt-2 block"><MapPin className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary-300" /><input required maxLength={240} autoComplete="street-address" value={application.residence} onChange={(event) => setApplication((current) => ({ ...current, residence: event.target.value }))} className={`${fieldClassName} mt-0 pr-11`} placeholder="المدينة، المنطقة، الشارع" /></span>
                  </label>
                  <label className="text-sm font-semibold sm:col-span-2">نبذة عنك وعن نشاطك
                    <textarea maxLength={2000} rows={3} value={application.description} onChange={(event) => setApplication((current) => ({ ...current, description: event.target.value }))} className={fieldClassName} placeholder="خبرتك، مصادر المنتجات، وما يميز متجرك..." />
                  </label>
                </div>
              </section>

              <section className="ak-panel p-5 shadow-ak-card sm:p-7">
                <div className="mb-6 flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-300"><Box className="size-5" /></span>
                  <div><p className="text-xs font-bold tracking-widest text-primary-300">02 / كتالوجك</p><h2 className="mt-1 text-xl font-black">ماذا تنوي أن تبيع؟</h2><p className="mt-1 text-sm text-ak-muted">ساعدنا على فهم نوعية المنتجات التي ستعرضها للعملاء.</p></div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold">فئات المنتجات <span className="text-primary-300">*</span>
                    <input required maxLength={300} value={application.sellingCategories} onChange={(event) => setApplication((current) => ({ ...current, sellingCategories: event.target.value }))} className={fieldClassName} placeholder="مثال: أثاث منزلي، أجهزة كهربائية، ملابس..." />
                  </label>
                  <label className="block text-sm font-semibold">المنتجات وخطة البيع <span className="text-primary-300">*</span>
                    <textarea required minLength={20} maxLength={4000} rows={5} value={application.intendedProducts} onChange={(event) => setApplication((current) => ({ ...current, intendedProducts: event.target.value }))} className={fieldClassName} placeholder="اذكر أمثلة على المنتجات، حالتها أو مصدرها، والكميات المتوقعة. مثال: أجهزة منزلية جديدة مع كفالة، وتتوفر لديّ 10–20 قطعة شهريًا..." />
                    <span className="mt-2 block text-xs text-ak-muted">20 حرفًا على الأقل · {application.intendedProducts.length}/4000</span>
                  </label>
                </div>
              </section>

              <section className="ak-panel p-5 shadow-ak-card sm:p-7">
                <div className="mb-5 flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-300"><MapPinned className="size-5" /></span>
                  <div><p className="text-xs font-bold tracking-widest text-primary-300">03 / موقعك</p><h2 className="mt-1 text-xl font-black">أين تعمل؟</h2><p className="mt-1 text-sm text-ak-muted">انقر على الخريطة لتحديد موقعك بدقة. هذا الموقع للمراجعة والتواصل.</p></div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-ak-line">
                  <OnClickMap
                    chosenCity={null}
                    chosentown={null}
                    propertyCityLocation={null}
                    propertyTownLocation={null}
                    lat={application.latitude ?? undefined}
                    lng={application.longitude ?? undefined}
                    onCoordinatesChange={(coordinates: [number, number]) => setApplication((current) => ({
                      ...current,
                      latitude: coordinates[0],
                      longitude: coordinates[1],
                    }))}
                  />
                </div>
                {application.latitude !== null && application.longitude !== null ? (
                  <p className="mt-3 flex items-center gap-2 text-xs text-emerald-700"><BadgeCheck className="size-4" />تم تحديد الموقع: {application.latitude.toFixed(5)}, {application.longitude.toFixed(5)}</p>
                ) : (
                  <p className="mt-3 text-xs text-primary-300">تحديد الموقع على الخريطة مطلوب لإرسال الطلب.</p>
                )}
              </section>

              <section className="ak-panel p-5 shadow-ak-card sm:p-7">
                <div className="mb-6 flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-300"><ShieldCheck className="size-5" /></span>
                  <div><p className="text-xs font-bold tracking-widest text-primary-300">04 / اختياري</p><h2 className="mt-1 text-xl font-black">وثيقة الهوية والحضور الرقمي</h2><p className="mt-1 text-sm text-ak-muted">يمكنك إرفاق صورة الهوية الآن أو تقديم الطلب بدونها.</p></div>
                </div>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-primary-300 bg-primary-900/35 px-5 py-8 text-center transition hover:bg-primary-500/15">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-300"><FileImage className="size-6" /></span>
                  <span className="mt-3 text-sm font-bold">{identityDocumentName || 'ارفع صورة وثيقة الهوية (اختياري)'}</span>
                  <span className="mt-1 text-xs text-ak-muted">JPG أو PNG أو WebP · الحد الأقصى 4 ميغابايت</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadIdentityDocument} className="sr-only" />
                </label>
                <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-ak-muted"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary-300" />إذا أرفقتها، تُحفظ في تخزين خاص ولا يمكن فتحها إلا للمسؤول المخوّل بمراجعة الطلب.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <label className="text-sm font-semibold">Facebook
                    <span className="relative mt-2 block"><Facebook className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary-300" /><input type="url" maxLength={2048} value={application.facebookUrl} onChange={(event) => setApplication((current) => ({ ...current, facebookUrl: event.target.value }))} dir="ltr" className={`${fieldClassName} mt-0 pr-11 text-left`} placeholder="https://facebook.com/..." /></span>
                  </label>
                  <label className="text-sm font-semibold">YouTube
                    <span className="relative mt-2 block"><Youtube className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary-300" /><input type="url" maxLength={2048} value={application.youtubeUrl} onChange={(event) => setApplication((current) => ({ ...current, youtubeUrl: event.target.value }))} dir="ltr" className={`${fieldClassName} mt-0 pr-11 text-left`} placeholder="https://youtube.com/..." /></span>
                  </label>
                  <label className="text-sm font-semibold">Twitter / X
                    <span className="relative mt-2 block"><span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-primary-300">X</span><input type="url" maxLength={2048} value={application.twitterUrl} onChange={(event) => setApplication((current) => ({ ...current, twitterUrl: event.target.value }))} dir="ltr" className={`${fieldClassName} mt-0 pr-11 text-left`} placeholder="https://x.com/..." /></span>
                  </label>
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-ak-line bg-ak-surface p-5 sm:p-6">
                <p className="max-w-lg text-xs leading-5 text-ak-muted">بإرسال الطلب، تؤكد أن المعلومات صحيحة وتوافق على استخدامها لمراجعة أهلية البائع.</p>
                <button disabled={busy === 'application' || busy === 'identity-document'} className="inline-flex items-center gap-3 rounded-2xl bg-primary-400 px-6 py-3.5 text-sm font-black text-ak-cream shadow-ak-glow transition hover:bg-primary-900/350 disabled:cursor-wait disabled:opacity-50">
                  {busy === 'application' ? 'جارٍ إرسال الطلب...' : 'إرسال الطلب للمراجعة'} <ArrowLeft className="size-4" />
                </button>
              </div>
            </form>

            <aside className="space-y-4 lg:sticky lg:top-8">
              <section className="overflow-hidden rounded-[1.75rem] border border-ak-line bg-ak-surface shadow-xl">
                <div className="bg-gradient-to-bl from-primary-400 to-primary-700 p-5">
                  <p className="text-xs font-bold text-ak-muted">ملف البائع</p>
                  <h2 className="mt-2 text-xl font-black">{application.storeName || 'متجرك الجديد'}</h2>
                  <p className="mt-1 text-sm text-ak-muted">{application.contactName || 'أضف اسمك الكامل'}</p>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-primary-300" /><span className="min-w-0 break-all text-xs text-ak-muted">{application.contactEmail || 'البريد الإلكتروني مطلوب'}</span></div>
                  <div className="flex items-start gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-primary-300" /><span className="text-xs text-ak-muted" dir="ltr">{application.phoneNumber || 'رقم الهاتف مطلوب'}</span></div>
                  <div className="flex items-start gap-3"><Building2 className="mt-0.5 size-4 shrink-0 text-primary-300" /><span className="text-xs text-ak-muted">{application.sellingCategories || 'فئات المنتجات التي ستبيعها'}</span></div>
                  <div className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary-300" /><span className="text-xs text-ak-muted">{application.residence || 'مكان الإقامة / النشاط'}</span></div>
                </div>
              </section>
              <section className="rounded-[1.75rem] border border-ak-line bg-ak-surface p-5">
                <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary-300" /><h3 className="text-sm font-bold">خصوصيتك مهمة</h3></div>
                <p className="mt-3 text-xs leading-6 text-ak-muted">تُستخدم معلومات التواصل والموقع لمراجعة الطلب. إرفاق صورة الهوية اختياري الآن؛ وإذا أرفقتها فلن تظهر على صفحة متجرك.</p>
              </section>
              <Link href="/newPost" className="flex items-center justify-between rounded-2xl border border-ak-line bg-ak-surface p-4 text-xs text-ak-muted transition hover:border-primary-300 hover:text-ak-cream">
                هل لديك متجر بالفعل؟ ابدأ بإضافة منتجك <ArrowLeft className="size-4 text-primary-300" />
              </Link>
            </aside>
          </div>
        </div>
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
    return (
        <main dir="rtl" className="min-h-screen bg-ak-canvas px-4 py-12 text-ak-cream sm:px-6">
          <section className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-ak-line bg-ak-surface shadow-2xl">
            <div className="bg-gradient-to-l from-primary-400 to-primary-700 p-7 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-ak-muted">Akaar seller review</p>
              <h1 className="mt-3 text-3xl font-black">{data.seller.storeName}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ak-muted">{message}</p>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-9">
              <div>
                <h2 className="text-lg font-black">ملف البائع</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div><dt className="text-xs text-ak-muted">الاسم</dt><dd className="mt-1">{data.seller.contactName || '—'}</dd></div>
                  <div><dt className="text-xs text-ak-muted">البريد الإلكتروني</dt><dd className="mt-1 break-all" dir="ltr">{data.seller.contactEmail || '—'}</dd></div>
                  <div><dt className="text-xs text-ak-muted">رقم الهاتف</dt><dd className="mt-1" dir="ltr">{data.seller.phoneNumber || '—'}</dd></div>
                  <div><dt className="text-xs text-ak-muted">مكان الإقامة / النشاط</dt><dd className="mt-1">{data.seller.residence || '—'}</dd></div>
                  <div><dt className="text-xs text-ak-muted">نوع النشاط</dt><dd className="mt-1">{data.seller.businessType || '—'}</dd></div>
                  {data.seller.latitude != null && data.seller.longitude != null && (
                    <div><dt className="text-xs text-ak-muted">الموقع على الخريطة</dt><dd className="mt-1" dir="ltr">{data.seller.latitude.toFixed(5)}, {data.seller.longitude.toFixed(5)}</dd></div>
                  )}
                </dl>
              </div>
              <div>
                <h2 className="text-lg font-black">المنتجات المخطط بيعها</h2>
                <p className="mt-3 text-sm font-semibold text-primary-300">{data.seller.sellingCategories || 'لم تُحدد الفئات'}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ak-muted">{data.seller.intendedProducts || 'لا توجد تفاصيل للمنتجات.'}</p>
                {data.seller.description && <p className="mt-4 border-t border-ak-line pt-4 text-sm leading-7 text-ak-muted">{data.seller.description}</p>}
                <div className="mt-4 flex flex-wrap gap-3 text-xs">
                  {data.seller.facebookUrl && <a href={data.seller.facebookUrl} target="_blank" rel="noreferrer" className="text-primary-300 underline">Facebook</a>}
                  {data.seller.youtubeUrl && <a href={data.seller.youtubeUrl} target="_blank" rel="noreferrer" className="text-primary-300 underline">YouTube</a>}
                  {data.seller.twitterUrl && <a href={data.seller.twitterUrl} target="_blank" rel="noreferrer" className="text-primary-300 underline">Twitter / X</a>}
                </div>
              </div>
            </div>
          </section>
        </main>
    );
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
    <main dir="rtl" className="min-h-screen bg-transparent py-7 text-ak-cream sm:py-12">
      <div className="ak-page-shell space-y-7 sm:space-y-8">
      <header className="ak-panel-raised relative overflow-hidden p-6 sm:p-9">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-primary-300/30 to-transparent" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-primary-300">Akaar vendor center</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">متجري / وكالتي</h1><p className="mt-2 text-sm text-ak-muted">إدارة {data.seller.storeName} ومتابعة منتجاتك وإعلاناتك العقارية.</p></div>
          <Link href={`/shop/${encodeURIComponent(data.seller.slug)}`} className="ak-button-primary">عرض متجري العام</Link>
        </div>
      </header>
      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-800">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ['الإيرادات المسجلة', `${money(metrics.revenue)} ل.س`],
          ['المنتجات', money(metrics.productCount)],
          ['المخزون المتاح', money(metrics.stockCount)],
          ['طلبات تحتاج متابعة', money(metrics.pendingFulfillment)],
          ['إعلانات العقارات', money(metrics.propertyCount)],
          ['إعلانات عقارية نشطة', money(metrics.activePropertyCount)],
        ].map(([label, value]) => <article key={label} className="ak-metric-card"><p className="text-sm text-ak-muted">{label}</p><p className="mt-3 text-2xl font-black tracking-tight text-ak-honey">{value}</p></article>)}
      </section>

      <section className="ak-panel grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
        <div>
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300"><UserRound className="size-5" /></span><h2 className="text-lg font-black">بيانات البائع</h2></div>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-ak-muted">الاسم</dt><dd className="mt-1">{data.seller.contactName || '—'}</dd></div>
            <div><dt className="text-xs text-ak-muted">البريد</dt><dd className="mt-1 break-all" dir="ltr">{data.seller.contactEmail || '—'}</dd></div>
            <div><dt className="text-xs text-ak-muted">الهاتف</dt><dd className="mt-1" dir="ltr">{data.seller.phoneNumber || '—'}</dd></div>
            <div><dt className="text-xs text-ak-muted">مكان الإقامة</dt><dd className="mt-1">{data.seller.residence || '—'}</dd></div>
          </dl>
        </div>
        <div className="border-t border-ak-line pt-5 sm:border-r sm:border-t-0 sm:pr-6 sm:pt-0">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300"><Box className="size-5" /></span><h2 className="text-lg font-black">ما يقدمه متجرك</h2></div>
          <p className="mt-4 text-sm font-bold text-primary-300">{data.seller.sellingCategories || 'لم تُحدد فئات المنتجات'}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ak-muted">{data.seller.intendedProducts || data.seller.description || 'أضف تفاصيل المنتجات التي تعرضها.'}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {data.seller.facebookUrl && <a href={data.seller.facebookUrl} target="_blank" rel="noreferrer" className="text-primary-300 underline">Facebook</a>}
            {data.seller.youtubeUrl && <a href={data.seller.youtubeUrl} target="_blank" rel="noreferrer" className="text-primary-300 underline">YouTube</a>}
            {data.seller.twitterUrl && <a href={data.seller.twitterUrl} target="_blank" rel="noreferrer" className="text-primary-300 underline">Twitter / X</a>}
          </div>
        </div>
      </section>

      <section className="ak-panel p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">إعدادات المتجر</h2><p className="mt-1 text-xs text-ak-quiet">الاسم والرابط والوصف والشعار الظاهر للزوار.</p></div><div className="flex flex-wrap gap-2"><Link href="/properties/new" className="rounded-xl bg-ak-brand px-4 py-2.5 text-sm font-bold text-ak-cream shadow-ak-glow transition hover:brightness-105">إضافة إعلان عقاري</Link><Link href="/newPost" className="rounded-xl border border-ak-line px-4 py-2.5 text-sm transition hover:bg-ak-brand-soft">إضافة منتج</Link></div></div>
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
                  {nextLabel && <div className="flex flex-wrap gap-2"><input aria-label="رقم التتبع" placeholder="رقم التتبع (اختياري)" value={tracking[order.id] ?? order.trackingNumber ?? ''} onChange={(event) => setTracking((current) => ({ ...current, [order.id]: event.target.value }))} className="w-44 rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-xs" /><button disabled={busy === order.id} onClick={() => void advanceOrder(order)} className="rounded-lg bg-ak-amber px-3 py-2 text-xs font-bold text-ak-cream disabled:opacity-50">{busy === order.id ? 'جارٍ التحديث...' : nextLabel}</button></div>}
                </div>
              </article>;
            })}
          </div>
        )}
      </section>
      </div>
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
            <button type="submit" disabled={busy} className="rounded-lg bg-ak-amber px-3 py-2 text-xs font-bold text-ak-cream disabled:opacity-50">{busy ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</button>
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
            <button type="button" disabled={busy} onClick={() => void onDelete(property)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-800 hover:bg-rose-500/10 disabled:opacity-50">{busy ? 'جارٍ التنفيذ...' : 'حذف الإعلان'}</button>
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
          <button type="button" disabled={busy} onClick={() => void onDelete(product)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-800 disabled:opacity-50">حذف</button>
        </div>
      </td>
    </tr>
  );
}
