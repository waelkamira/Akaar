'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowUp, FaEnvelope, FaHeart, FaSearch, FaShoppingBag, FaStore } from 'react-icons/fa';

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
    <footer dir="rtl" className="border-t border-ak-line bg-ak-ink/95 text-ak-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Akaar الصفحة الرئيسية">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ak-amber/30 bg-ak-brand-soft text-lg font-black text-ak-honey shadow-ak-glow">A</span>
              <span className="text-2xl font-black tracking-wide">Akaar<span className="text-ak-amber">.</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-stone-400">
              سوق عقاري يجمع المشترين والوسطاء والوكالات لاكتشاف المساحات المناسبة بكل وضوح.
            </p>
            <Link href="/contactUs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ak-honey transition hover:text-ak-cream">
              <FaEnvelope aria-hidden="true" /> تواصل مع فريق أكار
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-bold text-ak-cream">روابط سريعة</h2>
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
            <h2 className="text-sm font-bold text-ak-cream">المعلومات والسياسات</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/about" className="text-ak-muted transition hover:text-ak-honey">من نحن</Link></li>
              <li><Link href="/terms" className="text-ak-muted transition hover:text-ak-honey">الشروط والأحكام</Link></li>
              <li><Link href="/privacy" className="text-ak-muted transition hover:text-ak-honey">سياسة الخصوصية</Link></li>
              <li><Link href="/contactUs" className="text-ak-muted transition hover:text-ak-honey">الدعم والتواصل</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ak-line pt-6 text-xs text-ak-quiet sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Akaar. جميع الحقوق محفوظة.</p>
          <p>تعرّف على تفاصيل المنتج والبائع قبل إتمام أي اتفاق.</p>
        </div>
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="العودة إلى أعلى الصفحة"
          className="fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-ak-amber/30 bg-ak-surface text-ak-honey shadow-ak-card transition hover:-translate-y-1 hover:bg-ak-brand hover:text-ak-ink"
        >
          <FaArrowUp aria-hidden="true" />
        </button>
      )}
    </footer>
  );
}
