'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowUp, FaEnvelope, FaHeart, FaSearch, FaShoppingBag, FaStore } from 'react-icons/fa';
import WebsiteLogo from '@/components/Brand/WebsiteLogo';

const FOOTER_LINKS = [
  { href: '/search', label: 'تصفح المنتجات', icon: FaSearch },
  { href: '/categories/1', label: 'الأقسام', icon: FaShoppingBag },
  { href: '/favorite', label: 'المفضلة', icon: FaHeart },
  { href: '/orders', label: 'طلباتي', icon: FaShoppingBag },
  { href: '/newPost', label: 'انشر منتجًا', icon: FaStore },
];

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setShowBackToTop(window.scrollY > 500);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer dir="rtl" className="relative mt-8 border-t border-ak-line bg-ak-ink/75 text-white backdrop-blur-xl">
      <div className="ak-page-shell py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ak-amber/30 bg-ak-brand-soft text-lg font-black text-ak-honey shadow-ak-glow">M</span>
              <WebsiteLogo className="h-44 w-144" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-ak-muted">
              سوق عقاري يجمع المشترين والوسطاء والوكالات لاكتشاف المساحات المناسبة بكل وضوح.
            </p>
            <Link href="/contactUs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ak-honey transition hover:text-white">
              <FaEnvelope aria-hidden="true" /> تواصل مع فريق الدعم
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">روابط سريعة</h2>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="inline-flex items-center gap-2 text-sm text-ak-muted transition hover:text-ak-honey">
                    <Icon className="text-[11px] text-ak-amber" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">المعلومات والسياسات</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/about" className="text-ak-muted transition hover:text-ak-honey">من نحن</Link></li>
              <li><Link href="/terms" className="text-ak-muted transition hover:text-ak-honey">الشروط والأحكام</Link></li>
              <li><Link href="/privacy" className="text-ak-muted transition hover:text-ak-honey">سياسة الخصوصية</Link></li>
              <li><Link href="/contactUs" className="text-ak-muted transition hover:text-ak-honey">الدعم والتواصل</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ak-line pt-6 text-xs text-ak-quiet sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة.</p>
          <p>تعرّف على تفاصيل المنتج والبائع قبل إتمام أي اتفاق.</p>
        </div>
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="العودة إلى أعلى الصفحة"
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-ak-amber/30 bg-ak-surface text-ak-honey shadow-ak-card transition hover:-translate-y-1 hover:bg-ak-brand hover:text-ak-ink xl:bottom-5 xl:left-5"
        >
          <FaArrowUp aria-hidden="true" />
        </button>
      )}
    </footer>
  );
}
