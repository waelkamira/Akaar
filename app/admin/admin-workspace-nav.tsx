'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  BarChart3,
  Boxes,
  Building2,
  ChevronLeft,
  CircleDollarSign,
  Headphones,
  LayoutDashboard,
  Megaphone,
  Search,
  RotateCcw,
  Settings2,
  ShoppingCart,
  Star,
  Store,
  Truck,
  TicketPercent,
  Languages,
  Users,
} from 'lucide-react';

const sections = [
  {
    href: '/admin/dashboard',
    label: 'نظرة عامة',
    description: 'مؤشرات المنصة والملخص',
    keywords: 'الرئيسية مؤشرات overview dashboard',
    icon: LayoutDashboard,
    tone: 'text-amber-300',
  },
  {
    href: '/admin/control-panel/products',
    label: 'المنتجات والمخزون',
    description: 'الكتالوج والمراجعة',
    keywords: 'المنتجات المخزون الكتالوج inventory catalog',
    icon: Boxes,
    tone: 'text-emerald-300',
    controlPanel: true,
  },
  {
    href: '/admin/dashboard#orders-fulfillment',
    label: 'الطلبات والتنفيذ',
    description: 'حركة الطلبات والمبيعات',
    keywords: 'الطلبات الشحن التنفيذ orders sales fulfillment',
    icon: ShoppingCart,
  },
  {
    href: '/admin/control-panel/stores',
    label: 'البائعون والمتاجر',
    description: 'المتاجر وطلبات الانضمام',
    keywords: 'البائعين المتاجر الموردين vendors sellers stores',
    icon: Store,
    tone: 'text-sky-300',
    controlPanel: true,
  },
  {
    href: '/admin/control-panel',
    label: 'العملاء والمستخدمون',
    description: 'الحسابات والصلاحيات',
    keywords: 'العملاء المستخدمين الحسابات customers users',
    icon: Users,
    tone: 'text-violet-300',
    controlPanel: true,
  },
  {
    href: '/admin/control-panel/subscribers',
    label: 'التسويق والإعلانات',
    description: 'النشرة والحملات',
    keywords: 'التسويق الاعلانات النشرة البريدية marketing advertising campaigns',
    icon: Megaphone,
    tone: 'text-pink-300',
    controlPanel: true,
  },
  {
    href: '/admin/control-panel/payments',
    label: 'المالية والمحاسبة',
    description: 'وسائل الدفع والتحصيل',
    keywords: 'المالية المحاسبة الدفع المدفوعات finance accounting payments',
    icon: CircleDollarSign,
    tone: 'text-lime-300',
    controlPanel: true,
  },
  {
    href: '/admin/returns',
    label: 'الإرجاع والاسترداد',
    description: 'طلبات الإرجاع وقرارات المراجعة',
    keywords: 'الإرجاع الاسترداد refunds returns',
    icon: RotateCcw,
    tone: 'text-rose-300',
    controlPanel: true,
  },
  {
    href: '/admin/shipping-methods',
    label: 'وسائل الشحن',
    description: 'إدارة طرق الشحن والتكاليف',
    keywords: 'الشحن التوصيل التتبع shipping delivery',
    icon: Truck,
    tone: 'text-cyan-300',
    controlPanel: true,
  },
  {
    href: '/admin/discounts',
    label: 'الخصومات والعروض',
    description: 'رموز الخصم وفترات الصلاحية',
    keywords: 'الخصومات العروض الكوبونات discounts coupons promotions',
    icon: TicketPercent,
    tone: 'text-amber-300',
    controlPanel: true,
  },
  {
    href: '/admin/product-translations',
    label: 'ترجمات المنتجات',
    description: 'الكتالوج متعدد اللغات',
    keywords: 'اللغات الترجمة المنتجات localization translations multilingual',
    icon: Languages,
    tone: 'text-violet-300',
    controlPanel: true,
  },
  {
    href: '/admin/reviews/products',
    label: 'التقييمات والدعم',
    description: 'آراء العملاء والرسائل',
    keywords: 'التقييمات المراجعات الدعم الرسائل reviews support messages',
    icon: Headphones,
    tone: 'text-orange-300',
  },
  {
    href: '/admin/settings',
    label: 'الإعدادات والمحتوى',
    description: 'تهيئة المنصة وصفحاتها',
    keywords: 'الاعدادات المحتوى صفحات الموقع cms settings',
    icon: Settings2,
    tone: 'text-cyan-300',
  },
  {
    href: '/admin/dashboard#system-health',
    label: 'صحة النظام',
    description: 'حالة الخدمات والتشغيل',
    keywords: 'صحة النظام المراقبة التشغيل system health monitoring',
    icon: Activity,
    tone: 'text-teal-300',
  },
  {
    href: '/admin/reviews/stores',
    label: 'تقييمات المتاجر',
    description: 'سمعة وتجربة البائعين',
    keywords: 'تقييمات المتاجر store reviews',
    icon: Star,
    tone: 'text-yellow-300',
  },
  {
    href: '/admin/control-panel/site-pages',
    label: 'صفحات الموقع',
    description: 'إدارة صفحات ومحتوى CMS',
    keywords: 'صفحات الموقع محتوى cms site pages',
    icon: BarChart3,
    tone: 'text-indigo-300',
    controlPanel: true,
  },
  {
    href: '/admin/properties',
    label: 'إعلانات العقارات',
    description: 'إدارة الإعلانات العقارية',
    keywords: 'العقارات الاعلانات properties listings',
    icon: Building2,
    tone: 'text-fuchsia-300',
  },
];

export default function AdminWorkspaceNav({ canManageControlPanel }: { canManageControlPanel: boolean }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const visibleSections = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return sections.filter((section) => {
      if (section.controlPanel && !canManageControlPanel) return false;
      if (!normalizedQuery) return true;
      return `${section.label} ${section.description} ${section.keywords}`
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    });
  }, [canManageControlPanel, query]);

  return (
    <aside className="w-full shrink-0 self-start lg:sticky lg:top-5 lg:w-[17rem]">
      <div className="rounded-3xl border border-white/[.08] bg-[#11182a]/90 p-3 shadow-[0_24px_70px_rgba(0,0,0,.24)] backdrop-blur-xl">
        <label className="relative block">
          <Search aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <span className="sr-only">ابحث في أقسام الإدارة</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن قسم..."
            className="h-11 w-full rounded-2xl border border-white/[.08] bg-white/[.04] py-2 pe-10 ps-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/10"
          />
        </label>

        <nav aria-label="أقسام الإدارة" className="mt-3 grid max-h-[min(68vh,44rem)] grid-cols-2 gap-1 overflow-y-auto lg:grid-cols-1">
          {visibleSections.map((section) => {
            const Icon = section.icon;
            const hrefPath = section.href.split('#')[0];
            const active = pathname === hrefPath
              && (hrefPath !== '/admin/dashboard' || !section.href.includes('#'));
            return (
              <Link
                key={section.href}
                href={section.href}
                aria-current={active ? 'page' : undefined}
                className={`group flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 transition ${active ? 'bg-gradient-to-l from-amber-300/15 to-orange-400/[.06] text-white ring-1 ring-amber-200/20' : 'text-slate-300 hover:bg-white/[.05] hover:text-white'}`}
              >
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[.05] ${section.tone || 'text-amber-300'} group-hover:bg-white/[.08]`}>
                  <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">{section.label}</span>
                  <span className="mt-0.5 hidden truncate text-[10px] text-slate-500 lg:block">{section.description}</span>
                </span>
                <ChevronLeft aria-hidden="true" className="hidden size-4 text-slate-600 transition group-hover:-translate-x-0.5 group-hover:text-slate-300 lg:block" />
              </Link>
            );
          })}
          {!visibleSections.length && (
            <p className="col-span-2 rounded-xl px-3 py-5 text-center text-xs text-slate-500">
              لا توجد أقسام مطابقة لبحثك.
            </p>
          )}
        </nav>

        <div className="mt-3 flex items-center justify-between border-t border-white/[.07] px-2 pt-3">
          <span className="text-[11px] text-slate-500">مساحة إدارة أكار</span>
          <Link href="/" className="rounded-lg px-2 py-1 text-[11px] font-medium text-amber-200 transition hover:bg-amber-300/10">
            المتجر
          </Link>
        </div>
      </div>
    </aside>
  );
}
