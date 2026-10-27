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
      className="sticky top-0 z-[1000] hidden w-full border-b border-white/[.08] bg-[#171512]/95 shadow-lg shadow-black/10 backdrop-blur-xl lg:block"
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
                        ? 'border-[#C99B70]/25 bg-[#C99B70]/10 text-[#E5C5A5]'
                        : 'border-transparent text-stone-400 hover:border-white/[.08] hover:bg-white/[.04] hover:text-[#F5F0E9]'
                    }`}
                  >
                    <span className="text-sm" aria-hidden="true">{button.icon}</span>
                    <span className="whitespace-nowrap">{button.title}</span>
                    {isCart && cartCount > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#C99B70] px-1.5 py-0.5 text-[10px] font-black text-[#171512]">
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
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C99B70]/25 bg-[#C99B70]/10 text-lg font-black text-[#D9B18C]">A</span>
          <span className="text-2xl font-black tracking-wide text-[#F5F0E9]">Akaar<span className="text-[#C99B70]">.</span></span>
        </Link>
      </div>
    </motion.header>
  );
}
