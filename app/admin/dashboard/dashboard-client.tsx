'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpLeft,
  BadgeCheck,
  Boxes,
  Building2,
  Check,
  CircleDollarSign,
  Clock3,
  FileText,
  Headphones,
  Megaphone,
  PackageCheck,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Store,
  Users,
  X,
  Zap,
} from 'lucide-react';

type Settings = {
  marketplaceEnabled: boolean;
  sellerApplicationsEnabled: boolean;
  productApprovalEnabled: boolean;
  cashOnDeliveryEnabled: boolean;
  stripeSandboxCheckoutEnabled: boolean;
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
  hasIdentityDocument: boolean;
  user: { email: string };
};

type DashboardData = {
  metrics: {
    users: number;
    activeUsers: number;
    activeVendors: number;
    totalVendors: number;
    pendingVendors: number;
    productQueue: number;
    products: number;
    orders: number;
    completedSales: number;
    returns: number;
    pageViews: number;
    pageViewsToday: number;
    pageViewsLast7Days: number;
    pageViewsLast30Days: number;
    pageViewsLast365Days: number;
    pageViewsThisYear: number;
    pageViewsByDay: Array<{ day: string; views: number }>;
    analyticsEnabled: boolean;
    subscribers: number;
    pendingItems: number;
  };
  monthly: Array<{ month: string; revenue: number; sales: number; newUsers: number; newVendors: number }>;
  topSellingProducts: Array<{ id: string; title: string; categoryName: string; unitsSold: number }>;
  settings: Settings;
};

type QueueState<T> = { items: T[]; page: number; hasMore: boolean };
type QueueResponse<T> = QueueState<T>;

const modules = [
  {
    title: 'المنتجات والمخزون',
    description: 'إدارة الكتالوج ومراجعة المنتجات الجديدة.',
    href: '/admin/control-panel/products',
    countKey: 'products' as const,
    countLabel: 'منتج',
    icon: Boxes,
    tone: 'emerald',
    keywords: 'منتجات كتالوج مخزون inventory catalog',
  },
  {
    title: 'الطلبات والتنفيذ',
    description: 'متابعة حركة الطلبات ومؤشرات الإنجاز.',
    href: '#orders-fulfillment',
    countKey: 'orders' as const,
    countLabel: 'طلب',
    icon: ShoppingCart,
    tone: 'amber',
    keywords: 'طلبات شحن تسليم orders fulfillment',
  },
  {
    title: 'البائعون والمتاجر',
    description: 'مراجعة المتاجر وإدارة البائعين.',
    href: '/admin/control-panel/stores',
    countKey: 'totalVendors' as const,
    countLabel: 'بائع',
    icon: Store,
    tone: 'sky',
    keywords: 'بائعين متاجر sellers vendors stores',
  },
  {
    title: 'العملاء والمستخدمون',
    description: 'الحسابات والأدوار وحالة المستخدمين.',
    href: '/admin/control-panel',
    countKey: 'users' as const,
    countLabel: 'حساب',
    icon: Users,
    tone: 'violet',
    keywords: 'عملاء حسابات مستخدمين customers users accounts',
    restricted: true,
  },
  {
    title: 'التسويق والإعلانات',
    description: 'المشتركون وقنوات التواصل مع العملاء.',
    href: '/admin/control-panel/subscribers',
    countKey: 'subscribers' as const,
    countLabel: 'مشترك',
    icon: Megaphone,
    tone: 'pink',
    keywords: 'تسويق اعلانات نشرة مشتركون marketing advertising',
    restricted: true,
  },
  {
    title: 'المالية ووسائل الدفع',
    description: 'تهيئة الدفع ومراجعة مؤشرات المبيعات.',
    href: '/admin/control-panel/payments',
    countKey: 'completedSales' as const,
    countLabel: 'معاملة مكتملة',
    icon: CircleDollarSign,
    tone: 'lime',
    keywords: 'مالية محاسبة مدفوعات finance accounting payment',
    restricted: true,
  },
  {
    title: 'التقييمات والدعم',
    description: 'تقييمات المنتجات والمتاجر ورسائل الدعم.',
    href: '/admin/reviews/products',
    countKey: null,
    icon: Headphones,
    tone: 'orange',
    keywords: 'تقييمات مراجعات دعم رسائل reviews support',
  },
  {
    title: 'الإعدادات ومحتوى الموقع',
    description: 'ضبط المنصة وإدارة صفحات المحتوى.',
    href: '/admin/settings',
    countKey: null,
    icon: Settings2,
    tone: 'cyan',
    keywords: 'اعدادات cms محتوى صفحات settings site pages',
  },
  {
    title: 'صحة النظام',
    description: 'مراقبة حالة الخدمات ومؤشرات التشغيل.',
    href: '#system-health',
    countKey: null,
    icon: Activity,
    tone: 'teal',
    keywords: 'صحة النظام مراقبة خدمات system health monitoring',
  },
  {
    title: 'إعلانات العقارات',
    description: 'إدارة الإعلانات العقارية ومراجعتها.',
    href: '/admin/properties',
    countKey: null,
    icon: Building2,
    tone: 'fuchsia',
    keywords: 'عقارات properties listings',
  },
] as const;

const toneStyles = {
  emerald: 'border-emerald-300/15 bg-emerald-300/[.06] text-emerald-200',
  amber: 'border-amber-300/20 bg-amber-300/[.07] text-amber-200',
  sky: 'border-sky-300/15 bg-sky-300/[.06] text-sky-200',
  violet: 'border-violet-300/15 bg-violet-300/[.06] text-violet-200',
  pink: 'border-pink-300/15 bg-pink-300/[.06] text-pink-200',
  lime: 'border-lime-300/15 bg-lime-300/[.06] text-lime-200',
  orange: 'border-orange-300/15 bg-orange-300/[.06] text-orange-200',
  cyan: 'border-cyan-300/15 bg-cyan-300/[.06] text-cyan-200',
  teal: 'border-teal-300/15 bg-teal-300/[.06] text-teal-200',
  fuchsia: 'border-fuchsia-300/15 bg-fuchsia-300/[.06] text-fuchsia-200',
} as const;

const number = (value: number) => new Intl.NumberFormat('ar').format(value);

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
  iconTone,
}: {
  label: string;
  value: number;
  note: string;
  icon: typeof Users;
  tone: string;
  iconTone: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[1.4rem] border border-white/[.08] bg-[#131b2d] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/[.14]">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-l ${tone}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-white">{number(value)}</p>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">{note}</p>
        </div>
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/[.05] ${iconTone}`}>
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </span>
      </div>
    </article>
  );
}

function BarChart({
  title,
  data,
  field,
  color,
  format = 'number',
}: {
  title: string;
  data: DashboardData['monthly'];
  field: 'revenue' | 'sales' | 'newUsers' | 'newVendors';
  color: string;
  format?: 'number' | 'currency';
}) {
  const visibleData = data.slice(-8);
  const maximum = Math.max(...visibleData.map((item) => item[field]), 1);
  const formatter = format === 'currency'
    ? new Intl.NumberFormat('ar', { notation: 'compact', maximumFractionDigits: 1 })
    : new Intl.NumberFormat('ar');

  return (
    <section className="rounded-3xl border border-white/[.08] bg-[#11192a] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="mt-1 text-[11px] text-slate-500">آخر 8 أشهر</p>
        </div>
        <span className="rounded-xl border border-white/[.07] bg-white/[.03] px-2.5 py-1 text-[10px] text-slate-400">شهري</span>
      </div>
      {visibleData.length ? (
        <div className="mt-6 grid h-40 grid-flow-col grid-cols-8 items-end gap-2 sm:gap-3" role="img" aria-label={title}>
          {visibleData.map((item) => {
            const value = item[field];
            const height = value ? Math.max((value / maximum) * 100, 5) : 2;
            return (
              <div key={item.month} className="group/bar flex h-full min-w-0 flex-col items-center justify-end gap-2">
                <span className="text-[9px] tabular-nums text-slate-500 opacity-0 transition group-hover/bar:opacity-100">
                  {formatter.format(value)}
                </span>
                <div className="flex h-[106px] w-full items-end overflow-hidden rounded-lg bg-white/[.035]">
                  <div
                    className={`w-full rounded-t-md ${color} transition-[height] duration-500`}
                    style={{ height: `${height}%` }}
                    title={`${item.month}: ${formatter.format(value)}`}
                  />
                </div>
                <span className="max-w-full truncate text-[9px] text-slate-500">{item.month.slice(5)}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-white/10 p-4 text-xs text-slate-500">
          لا تتوفر بيانات كافية لعرض الرسم البياني.
        </p>
      )}
    </section>
  );
}

function StatusIndicator({ label, detail, healthy }: { label: string; detail: string; healthy: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-4">
      <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl ${healthy ? 'bg-emerald-300/10 text-emerald-300' : 'bg-amber-300/10 text-amber-200'}`}>
        {healthy ? <Check aria-hidden="true" className="size-4" /> : <Clock3 aria-hidden="true" className="size-4" />}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-slate-200">{label}</span>
        <span className="mt-1 block text-[10px] leading-5 text-slate-500">{detail}</span>
      </span>
      <span className={`mr-auto mt-2 size-1.5 shrink-0 rounded-full ${healthy ? 'bg-emerald-300' : 'bg-amber-300'}`} />
    </div>
  );
}

export default function AdminDashboard({ canManageUsers = false }: { canManageUsers?: boolean }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [products, setProducts] = useState<QueueState<ProductQueueItem>>({ items: [], page: 1, hasMore: false });
  const [sellers, setSellers] = useState<QueueState<SellerQueueItem>>({ items: [], page: 1, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState('');
  const [moduleSearch, setModuleSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardResponse, productQueueResponse, sellerQueueResponse] = await Promise.all([
        fetch('/api/admin/dashboard', { cache: 'no-store' }),
        fetch('/api/admin/queue?type=products&page=1&limit=6', { cache: 'no-store' }),
        fetch('/api/admin/queue?type=sellers&page=1&limit=6', { cache: 'no-store' }),
      ]);
      const [dashboard, productQueue, sellerQueue] = await Promise.all([
        readJson<DashboardData>(dashboardResponse),
        readJson<QueueResponse<ProductQueueItem>>(productQueueResponse),
        readJson<QueueResponse<SellerQueueItem>>(sellerQueueResponse),
      ]);
      setData(dashboard);
      setProducts(productQueue);
      setSellers(sellerQueue);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل لوحة الإدارة.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => active ? load() : undefined);
    return () => { active = false; };
  }, [load]);

  const visibleModules = useMemo(() => {
    const term = moduleSearch.trim().toLocaleLowerCase();
    return modules.filter((module) => {
      if ('restricted' in module && module.restricted && !canManageUsers) return false;
      if (!term) return true;
      return `${module.title} ${module.description} ${module.keywords}`.toLocaleLowerCase().includes(term);
    });
  }, [canManageUsers, moduleSearch]);

  async function loadMore(type: 'products' | 'sellers') {
    const queue = type === 'products' ? products : sellers;
    setError('');
    try {
      const response = await fetch(`/api/admin/queue?type=${type}&page=${queue.page + 1}&limit=6`, { cache: 'no-store' });
      const next = await readJson<QueueResponse<ProductQueueItem | SellerQueueItem>>(response);
      if (type === 'products') {
        setProducts((current) => ({ ...next, items: [...current.items, ...(next.items as ProductQueueItem[])] }));
      } else {
        setSellers((current) => ({ ...next, items: [...current.items, ...(next.items as SellerQueueItem[])] }));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المزيد من الطلبات.');
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
      if (type === 'products') {
        setProducts((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
      } else {
        setSellers((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
      }
      await load();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'تعذرت مراجعة الطلب.');
    } finally {
      setPendingAction('');
    }
  }

  if (loading && !data) {
    return (
      <main className="space-y-5" aria-busy="true">
        <div className="h-52 animate-pulse rounded-[2rem] bg-white/[.04]" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-3xl bg-white/[.04]" />)}
        </div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="rounded-3xl border border-rose-300/15 bg-rose-300/[.06] p-6 text-sm text-rose-200">
        <p role="alert">{error}</p>
        <button onClick={() => void load()} className="mt-4 rounded-xl border border-rose-200/20 px-4 py-2 font-semibold transition hover:bg-rose-200/10">إعادة المحاولة</button>
      </main>
    );
  }
  if (!data) return null;

  const metrics = data.metrics;

  return (
    <main className="min-w-0 space-y-6 pb-10">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-amber-200/[.13] bg-gradient-to-l from-[#33251c] via-[#1b2130] to-[#141c2b] p-6 sm:p-8">
        <div aria-hidden="true" className="absolute -left-12 -top-20 -z-10 size-64 rounded-full bg-orange-400/10 blur-3xl" />
        <div aria-hidden="true" className="absolute bottom-[-8rem] right-[35%] -z-10 size-64 rounded-full bg-indigo-400/[.08] blur-3xl" />
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/[.07] px-3 py-1.5 text-[10px] font-bold tracking-wide text-amber-100">
              <Zap aria-hidden="true" className="size-3.5" />
              مركز القيادة والتحكم
            </div>
            <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-4xl">نظرة شاملة على أكار</h1>
            <p className="mt-3 max-w-xl text-xs leading-6 text-slate-300 sm:text-sm">
              راقب أداء السوق، أنجز المهام العاجلة، وانتقل مباشرة إلى أدوات إدارة المنصة من مكان واحد.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            <RefreshCw aria-hidden="true" className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث المؤشرات
          </button>
        </div>
        <div className="mt-7 flex flex-wrap gap-2">
          <a href="#work-queue" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-200">
            مراجعة المهام المعلقة
            <ArrowDownLeft aria-hidden="true" className="size-4" />
          </a>
          <a href="#workspace-modules" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-xs font-semibold text-slate-100 transition hover:bg-white/[.08]">
            استعراض أدوات الإدارة
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
        </div>
      </section>

      {error && <p role="alert" className="rounded-2xl border border-rose-300/15 bg-rose-300/[.06] p-4 text-xs text-rose-200">{error}</p>}

      <section aria-label="المؤشرات الرئيسية" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="إجمالي المستخدمين"
          value={metrics.users}
          note={`${number(metrics.activeUsers)} حساب نشط`}
          icon={Users}
          tone="from-sky-300/30 to-transparent"
          iconTone="text-sky-200"
        />
        <MetricCard
          label="المنتجات المنشورة"
          value={metrics.products}
          note={`${number(metrics.productQueue)} بانتظار المراجعة`}
          icon={Boxes}
          tone="from-emerald-300/30 to-transparent"
          iconTone="text-emerald-200"
        />
        <MetricCard
          label="البائعون المعتمدون"
          value={metrics.activeVendors}
          note={`${number(metrics.pendingVendors)} طلب انضمام جديد`}
          icon={Store}
          tone="from-violet-300/30 to-transparent"
          iconTone="text-violet-200"
        />
        <MetricCard
          label="الطلبات والمعاملات"
          value={metrics.orders}
          note={`${number(metrics.completedSales)} معاملة مكتملة`}
          icon={ShoppingCart}
          tone="from-amber-300/30 to-transparent"
          iconTone="text-amber-200"
        />
      </section>

      <section id="workspace-modules" className="scroll-mt-6 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[.18em] text-amber-200/75">WORKSPACE</p>
            <h2 className="mt-1 text-lg font-black text-white">أدوات ومسارات الإدارة</h2>
          </div>
          <label className="relative w-full sm:w-72">
            <Search aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <span className="sr-only">ابحث عن أداة إدارية</span>
            <input
              type="search"
              value={moduleSearch}
              onChange={(event) => setModuleSearch(event.target.value)}
              placeholder="ابحث عن أداة أو قسم..."
              className="h-10 w-full rounded-xl border border-white/[.08] bg-[#121a2b] py-2 pe-10 ps-3 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-2 focus:ring-amber-200/10"
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleModules.map((module) => {
            const Icon = module.icon;
            const count = module.countKey ? metrics[module.countKey] : null;
            return (
              <Link
                key={module.title}
                href={module.href}
                className="group flex min-h-32 items-start gap-4 rounded-3xl border border-white/[.08] bg-[#11192a] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-amber-200/20 hover:bg-[#151f32]"
              >
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border ${toneStyles[module.tone]}`}>
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-slate-100">{module.title}</span>
                    <ArrowUpLeft aria-hidden="true" className="size-4 shrink-0 text-slate-600 transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-200" />
                  </span>
                  <span className="mt-1.5 block text-[11px] leading-5 text-slate-500">{module.description}</span>
                  {count !== null && 'countLabel' in module && <span className="mt-3 inline-flex rounded-lg bg-white/[.045] px-2 py-1 text-[10px] font-semibold text-slate-300">{number(count)} {module.countLabel}</span>}
                </span>
              </Link>
            );
          })}
          {!visibleModules.length && (
            <p className="col-span-full rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs text-slate-500">
              لا توجد أدوات مطابقة لعبارة البحث.
            </p>
          )}
        </div>
      </section>

      <section id="orders-fulfillment" className="scroll-mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="أداء الطلبات والتنفيذ">
        {[
          { label: 'إجمالي الطلبات', value: metrics.orders, icon: ShoppingCart, color: 'text-amber-200' },
          { label: 'معاملات مكتملة', value: metrics.completedSales, icon: PackageCheck, color: 'text-emerald-200' },
          { label: 'مشاهدات آخر 7 أيام', value: metrics.pageViewsLast7Days, icon: Activity, color: 'text-sky-200' },
          { label: 'المرتجعات المسجلة', value: metrics.returns, icon: ArrowDownLeft, color: 'text-orange-200' },
        ].map((item) => (
          <article key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-[#11192a] px-4 py-4">
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[.04] ${item.color}`}>
              <item.icon aria-hidden="true" className="size-[18px]" />
            </span>
            <span>
              <span className="block text-[10px] text-slate-500">{item.label}</span>
              <span className="mt-1 block text-lg font-bold tabular-nums text-white">{number(item.value)}</span>
            </span>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2" aria-label="تحليلات المنصة">
        <BarChart title="إيرادات المعاملات المكتملة" data={data.monthly} field="revenue" color="bg-gradient-to-t from-amber-500 to-amber-200" format="currency" />
        <BarChart title="حجم المبيعات شهريًا" data={data.monthly} field="sales" color="bg-gradient-to-t from-violet-500 to-violet-300" />
        <BarChart title="نمو المستخدمين الجدد" data={data.monthly} field="newUsers" color="bg-gradient-to-t from-sky-500 to-sky-300" />
        <BarChart title="انضمام البائعين" data={data.monthly} field="newVendors" color="bg-gradient-to-t from-emerald-500 to-emerald-300" />
      </section>

      <section id="work-queue" className="scroll-mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/[.08] bg-[#11192a] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[.15em] text-emerald-200/75">CATALOG REVIEW</p>
              <h2 className="mt-1 text-base font-bold text-white">مراجعة المنتجات</h2>
              <p className="mt-1 text-[11px] text-slate-500">اعتماد المنتجات قبل ظهورها في السوق.</p>
            </div>
            <span className="rounded-xl border border-emerald-200/10 bg-emerald-200/[.06] px-3 py-1.5 text-xs font-bold text-emerald-200">{number(metrics.productQueue)} معلّق</span>
          </div>
          <div className="mt-4 divide-y divide-white/[.06]">
            {products.items.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0">
                {item.images[0]
                  ? <Image src={item.images[0]} alt="" width={52} height={52} unoptimized className="size-12 rounded-xl border border-white/[.06] object-cover" />
                  : <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/[.04] text-slate-500"><Boxes aria-hidden="true" className="size-5" /></span>}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-1 truncate text-[10px] text-slate-500">{item.categoryName} · {item.userName || 'بائع'} · {item.basePrice === null ? 'السعر غير محدد' : `${number(item.basePrice)} ل.س`}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={Boolean(pendingAction)}
                    onClick={() => void review('products', item.id, 'APPROVED')}
                    aria-label={`اعتماد ${item.title}`}
                    className="flex size-9 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200 transition hover:bg-emerald-300/20 disabled:opacity-50"
                  >
                    <Check aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(pendingAction)}
                    onClick={() => void review('products', item.id, 'REJECTED')}
                    aria-label={`رفض ${item.title}`}
                    className="flex size-9 items-center justify-center rounded-xl bg-rose-300/[.07] text-rose-200 transition hover:bg-rose-300/[.14] disabled:opacity-50"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </article>
            ))}
            {!products.items.length && <p className="py-5 text-center text-xs text-slate-500">لا توجد منتجات بانتظار المراجعة.</p>}
          </div>
          {products.hasMore && <button type="button" onClick={() => void loadMore('products')} className="mt-3 text-xs font-semibold text-amber-200 hover:text-amber-100">عرض المزيد من المنتجات ←</button>}
        </div>

        <div className="rounded-3xl border border-white/[.08] bg-[#11192a] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[.15em] text-sky-200/75">SELLER ONBOARDING</p>
              <h2 className="mt-1 text-base font-bold text-white">طلبات فتح المتاجر</h2>
              <p className="mt-1 text-[11px] text-slate-500">راجع معلومات البائع قبل تفعيل متجره.</p>
            </div>
            <span className="rounded-xl border border-sky-200/10 bg-sky-200/[.06] px-3 py-1.5 text-xs font-bold text-sky-200">{number(metrics.pendingVendors)} معلّق</span>
          </div>
          <div className="mt-4 divide-y divide-white/[.06]">
            {sellers.items.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-300/[.07] text-sky-200">
                  <Store aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-100">{item.storeName}</p>
                  <p className="mt-1 truncate text-[10px] text-slate-500">{item.contactName || item.contactEmail || item.user.email}</p>
                  {item.hasIdentityDocument && <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-emerald-200"><BadgeCheck aria-hidden="true" className="size-3" /> وثيقة هوية مرفقة</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={Boolean(pendingAction)}
                    onClick={() => void review('sellers', item.id, 'ACTIVE')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-300/10 px-3 py-2 text-[10px] font-semibold text-emerald-200 transition hover:bg-emerald-300/20 disabled:opacity-50"
                  >
                    <Check aria-hidden="true" className="size-3.5" />
                    اعتماد
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(pendingAction)}
                    onClick={() => void review('sellers', item.id, 'REJECTED')}
                    className="flex size-8 items-center justify-center rounded-xl bg-rose-300/[.07] text-rose-200 transition hover:bg-rose-300/[.14] disabled:opacity-50"
                    aria-label={`رفض طلب ${item.storeName}`}
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </article>
            ))}
            {!sellers.items.length && <p className="py-5 text-center text-xs text-slate-500">لا توجد طلبات متاجر بانتظار المراجعة.</p>}
          </div>
          {sellers.hasMore && <button type="button" onClick={() => void loadMore('sellers')} className="mt-3 text-xs font-semibold text-amber-200 hover:text-amber-100">عرض المزيد من الطلبات ←</button>}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-white/[.08] bg-[#11192a] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[.15em] text-amber-200/75">TOP PERFORMERS</p>
              <h2 className="mt-1 text-base font-bold text-white">المنتجات الأعلى مبيعًا</h2>
            </div>
            <Link href="/admin/control-panel/products" className="text-[10px] font-semibold text-amber-200 hover:text-amber-100">إدارة المنتجات</Link>
          </div>
          <ol className="mt-4 space-y-3">
            {data.topSellingProducts.map((product, index) => {
              const maxUnits = Math.max(...data.topSellingProducts.map((item) => item.unitsSold), 1);
              return (
                <li key={product.id} className="flex items-center gap-3">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-black ${index === 0 ? 'bg-amber-300/15 text-amber-200' : 'bg-white/[.05] text-slate-400'}`}>{number(index + 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-slate-200">{product.title}</span>
                    <span className="mt-1 block text-[10px] text-slate-500">{product.categoryName}</span>
                    <span className="mt-2 block h-1 overflow-hidden rounded-full bg-white/[.05]">
                      <span className="block h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-300" style={{ width: `${(product.unitsSold / maxUnits) * 100}%` }} />
                    </span>
                  </span>
                  <span className="text-[10px] font-semibold text-amber-100">{number(product.unitsSold)} وحدة</span>
                </li>
              );
            })}
            {!data.topSellingProducts.length && <li className="rounded-xl border border-dashed border-white/10 p-4 text-xs text-slate-500">ستظهر المنتجات بعد تسجيل مبيعات مكتملة.</li>}
          </ol>
        </div>

        <div id="system-health" className="scroll-mt-6 rounded-3xl border border-white/[.08] bg-[#11192a] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-300/[.08] text-emerald-200"><ShieldCheck aria-hidden="true" className="size-5" /></span>
            <div>
              <p className="text-[10px] font-bold tracking-[.15em] text-emerald-200/75">SYSTEM HEALTH</p>
              <h2 className="mt-1 text-base font-bold text-white">حالة التشغيل</h2>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <StatusIndicator label="لوحة البيانات والاتصال" detail="تم تحميل المؤشرات ومزامنتها مع قاعدة البيانات." healthy />
            <StatusIndicator
              label="تحليلات الزيارات"
              detail={metrics.analyticsEnabled ? `${number(metrics.pageViewsLast30Days)} مشاهدة خلال آخر 30 يومًا.` : 'تحتاج إلى تفعيل جدول تسجيل الزيارات.'}
              healthy={metrics.analyticsEnabled}
            />
            <StatusIndicator
              label="مراجعة المنتجات"
              detail={data.settings.productApprovalEnabled ? 'مراجعة المنتجات الجديدة مفعّلة.' : 'النشر المباشر مفعّل دون انتظار المراجعة.'}
              healthy={data.settings.productApprovalEnabled}
            />
            <StatusIndicator
              label="خيارات الدفع"
              detail={data.settings.cashOnDeliveryEnabled ? 'الدفع عند الاستلام متاح.' : data.settings.stripeSandboxCheckoutEnabled ? 'بيئة دفع Stripe التجريبية مفعّلة.' : 'لا توجد وسيلة دفع مفعّلة حاليًا.'}
              healthy={data.settings.cashOnDeliveryEnabled || data.settings.stripeSandboxCheckoutEnabled}
            />
          </div>
          <Link href="/admin/settings" className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold text-amber-200 hover:text-amber-100">
            فتح إعدادات المنصة
            <ArrowLeft aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/admin/control-panel/messages" className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-4 transition hover:bg-white/[.05]">
          <span className="flex size-10 items-center justify-center rounded-xl bg-orange-300/[.08] text-orange-200"><Headphones aria-hidden="true" className="size-5" /></span>
          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-200">رسائل الدعم</span><span className="mt-1 block text-[10px] text-slate-500">تواصل مع العملاء</span></span>
          <ArrowLeft aria-hidden="true" className="size-4 text-slate-600" />
        </Link>
        <Link href="/admin/control-panel/site-pages" className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-4 transition hover:bg-white/[.05]">
          <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-300/[.08] text-indigo-200"><FileText aria-hidden="true" className="size-5" /></span>
          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-200">إدارة المحتوى</span><span className="mt-1 block text-[10px] text-slate-500">صفحات الموقع وCMS</span></span>
          <ArrowLeft aria-hidden="true" className="size-4 text-slate-600" />
        </Link>
        <Link href="/admin/control-panel/payments" className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-4 transition hover:bg-white/[.05]">
          <span className="flex size-10 items-center justify-center rounded-xl bg-lime-300/[.08] text-lime-200"><CircleDollarSign aria-hidden="true" className="size-5" /></span>
          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-200">تهيئة المدفوعات</span><span className="mt-1 block text-[10px] text-slate-500">إدارة وسائل التحصيل</span></span>
          <ArrowLeft aria-hidden="true" className="size-4 text-slate-600" />
        </Link>
      </section>
    </main>
  );
}
