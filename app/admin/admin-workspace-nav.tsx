'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
  { href: '/admin/dashboard', label: 'لوحة المؤشرات', color: 'bg-violet-300' },
  { href: '/admin/control-panel/products', label: 'إدارة المنتجات', color: 'bg-emerald-300', controlPanel: true },
  { href: '/admin/reviews/products', label: 'تقييمات المنتجات', color: 'bg-amber-300' },
  { href: '/admin/control-panel/stores', label: 'إدارة المتاجر', color: 'bg-sky-300', controlPanel: true },
  { href: '/admin/reviews/stores', label: 'تقييمات المتاجر', color: 'bg-orange-300' },
  { href: '/admin/properties', label: 'إعلانات العقارات', color: 'bg-fuchsia-300' },
  { href: '/admin/settings', label: 'إعدادات المنصة', color: 'bg-cyan-300' },
  { href: '/admin/control-panel/messages', label: 'الرسائل للمستخدمين', color: 'bg-rose-300', controlPanel: true },
  { href: '/admin/control-panel/site-pages', label: 'صفحات الموقع والمحتوى', color: 'bg-indigo-300', controlPanel: true },
  { href: '/admin/control-panel/subscribers', label: 'مشتركو النشرة البريدية', color: 'bg-lime-300', controlPanel: true },
  { href: '/admin/control-panel/payments', label: 'وسائل الدفع', color: 'bg-teal-300', controlPanel: true },
  { href: '/admin/control-panel', label: 'إدارة المستخدمين', color: 'bg-pink-300', controlPanel: true },
];

export default function AdminWorkspaceNav({ canManageControlPanel }: { canManageControlPanel: boolean }) {
  const pathname = usePathname();
  const visibleSections = sections.filter((section) => canManageControlPanel || !section.controlPanel);

  return (
    <div className="sticky top-0 z-30 border-b border-ak-line bg-ak-canvas/95 px-4 py-3 shadow-ak-card backdrop-blur-xl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="ak-eyebrow">ADMIN WORKSPACE</p>
            <h2 className="text-sm font-bold">أقسام الإدارة</h2>
          </div>
          <Link href="/" className="shrink-0 rounded-lg border border-ak-line px-3 py-2 text-xs text-stone-300 transition hover:bg-ak-brand-soft hover:text-white">العودة للمتجر</Link>
        </div>
        <nav aria-label="أقسام الإدارة" className="flex flex-wrap justify-start gap-2">
          {visibleSections.map((section) => {
            const active = pathname === section.href || section.href !== '/admin/dashboard' && section.href !== '/admin/control-panel' && pathname.startsWith(`${section.href}/`);
            return (
              <Link
                key={section.href}
                href={section.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:text-sm ${active ? 'border-ak-amber/40 bg-ak-brand-soft text-white shadow-ak-glow' : 'border-transparent text-stone-300 hover:border-ak-line hover:bg-ak-surface hover:text-white'}`}
              >
                <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${section.color}`} />
                {section.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
