'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Boxes,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Package,
  RotateCcw,
  Settings2,
  ShoppingBag,
  Star,
  Users,
} from 'lucide-react';

const links = [
  { href: '/seller/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/seller/products', label: 'المنتجات', icon: Package },
  { href: '/seller/inventory', label: 'المخزون', icon: Boxes },
  { href: '/seller/orders', label: 'الطلبات', icon: ShoppingBag },
  { href: '/seller/customers', label: 'العملاء', icon: Users },
  { href: '/seller/reviews', label: 'التقييمات', icon: Star },
  { href: '/seller/finance', label: 'المالية', icon: CreditCard },
  { href: '/seller/shipping', label: 'الشحن والإرجاع', icon: RotateCcw },
  { href: '/seller/marketing', label: 'التسويق', icon: Megaphone },
  { href: '/seller/store', label: 'المتجر', icon: Settings2 },
  { href: '/seller/staff', label: 'الفريق', icon: MessageCircle },
  { href: '/seller/reports', label: 'التقارير', icon: BarChart3 },
];

export default function SellerNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="أقسام مركز البائع" className="min-w-0 flex-1 overflow-x-auto">
      <ul className="flex min-w-max items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/seller/dashboard' && pathname.startsWith(`${href}/`));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  active ? 'bg-orange-300/15 text-orange-200' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
