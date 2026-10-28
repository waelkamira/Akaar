'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import mainButtons from '../lists/mainButtons';
import { useCommerce } from '@/features/cart/commerce-context';

export default function FirstNavBar() {
  const pathname = usePathname();
  const { cartCount } = useCommerce();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-[1000] hidden w-full border-b border-ak-line bg-ak-ink/90 shadow-ak-card backdrop-blur-2xl lg:block"
    >
      <div className="mx-auto flex h-[76px] w-full max-w-[1600px] items-center justify-between gap-6 px-5 xl:px-8">
        <nav aria-label="التنقل الرئيسي" className="min-w-0 flex-1">
          <ul className="flex items-center justify-start gap-1 xl:gap-2">
            {mainButtons.map((button) => {
              const isActive = button.path === '/'
                ? pathname === '/'
                : pathname === button.path || pathname.startsWith(`${button.path}/`);
              const isCart = button.path === '/cart';

              return (
                <li key={button.path} className="shrink-0">
                  <Link
                    href={button.path}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={isCart && cartCount > 0 ? `${button.title}، ${cartCount} منتج` : button.title}
                    className={`relative inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors xl:px-3.5 ${
                      isActive
                        ? 'border-ak-amber/30 bg-ak-brand-soft text-ak-honey shadow-ak-glow'
                        : 'border-transparent text-ak-muted hover:border-ak-line hover:bg-ak-surface/70 hover:text-ak-cream'
                    }`}
                  >
                    <span className="text-sm" aria-hidden="true">{button.icon}</span>
                    <span className="whitespace-nowrap">{button.title}</span>
                    {isCart && cartCount > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-ak-brand px-1.5 py-0.5 text-[10px] font-black text-ak-ink">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link href="/" aria-label="Akaar الصفحة الرئيسية" className="flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ak-amber/30 bg-ak-brand-soft text-lg font-black text-ak-honey shadow-ak-glow">A</span>
          <span className="text-2xl font-black tracking-wide text-ak-cream">Akaar<span className="text-ak-amber">.</span></span>
        </Link>
      </div>
    </motion.header>
  );
}
