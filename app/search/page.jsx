'use client';

import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes, FaSearch, FaSlidersH, FaTrashAlt } from 'react-icons/fa';
import { useSearch } from '@/features/search/search-context';
import { inputsContext } from '@/features/auth/inputs-context';
import CategoryFilter from '@/components/Search/CategoryFilter';
import StaticFilters from '@/components/Search/StaticFilters';
import DynamicFilters from '@/components/Search/DynamicFilters';
import SelectedFilters from '@/components/Search/SelectedFilters';
import SearchResults from '@/components/Search/SearchResults';

function FilterPanel({ onApply, onClose, mobile = false }) {
  const { category, performSearch, clearFilters } = useSearch();
  const { selected } = useContext(inputsContext);
  const [expanded, setExpanded] = useState({ category: true, basic: true, dynamic: true });

  const toggle = (section) => setExpanded((current) => ({ ...current, [section]: !current[section] }));

  const apply = async () => {
    await performSearch();
    onApply?.();
  };

  const clear = () => {
    clearFilters();
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {mobile && (
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C99B70]/10 text-[#D9B18C]"><FaSlidersH aria-hidden="true" /></span>
            <div><h2 className="font-bold text-white">فلاتر البحث</h2><p className="mt-1 text-xs text-stone-400">خصص النتائج حسب احتياجك</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="إغلاق الفلاتر" className="rounded-lg p-2 text-stone-400 hover:bg-white/5 hover:text-white"><FaTimes /></button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#211F1B]">
        <button type="button" onClick={() => toggle('category')} aria-expanded={expanded.category} className="flex w-full items-center justify-between px-4 py-4 text-right transition hover:bg-white/[.03]">
          <span className="font-semibold text-[#F5F0E9]">الفئة</span><FaFilter className="text-xs text-[#C99B70]" aria-hidden="true" />
        </button>
        {expanded.category && <div className="border-t border-white/[.06] p-4"><CategoryFilter /></div>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#211F1B]">
        <button type="button" onClick={() => toggle('basic')} aria-expanded={expanded.basic} className="flex w-full items-center justify-between px-4 py-4 text-right transition hover:bg-white/[.03]">
          <span className="font-semibold text-[#F5F0E9]">الفلاتر الأساسية</span><FaFilter className="text-xs text-[#C99B70]" aria-hidden="true" />
        </button>
        {expanded.basic && <div className="border-t border-white/[.06] p-4"><StaticFilters /></div>}
      </section>

      {category && (
        <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#211F1B]">
          <button type="button" onClick={() => toggle('dynamic')} aria-expanded={expanded.dynamic} className="flex w-full items-center justify-between px-4 py-4 text-right transition hover:bg-white/[.03]">
            <span className="font-semibold text-[#F5F0E9]">مواصفات الفئة</span><FaFilter className="text-xs text-[#C99B70]" aria-hidden="true" />
          </button>
          {expanded.dynamic && <div className="border-t border-white/[.06] p-4"><DynamicFilters /></div>}
        </section>
      )}

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-white/[.08] pt-4">
        <button type="button" onClick={clear} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs font-semibold text-stone-300 transition hover:border-rose-400/30 hover:text-rose-300">
          <FaTrashAlt aria-hidden="true" /> مسح الفلاتر
        </button>
        <button type="button" onClick={apply} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C99B70] px-3 py-3 text-xs font-bold text-[#171512] transition hover:bg-[#D9B18C]">
          <FaSearch aria-hidden="true" /> تطبيق النتائج
        </button>
      </div>
      {mobile && selected?.length > 0 && <p className="text-center text-[11px] text-stone-500">تم تحديد {selected.length} خيار</p>}
    </div>
  );
}

export default function SearchPage() {
  const { category, query, results, totalCount, clearFilters } = useSearch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <main dir="rtl" className="min-h-[70vh] bg-[#141311] px-4 py-8 text-[#F5F0E9] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/[.08] pb-6">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.24em] text-[#C99B70]">اكتشف الكتالوج</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">البحث والمنتجات</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-400">
              استخدم الفلاتر للوصول إلى المنتجات المناسبة، وقارن التفاصيل قبل التواصل مع البائع.
            </p>
            {(category || query) && (
              <p className="mt-3 text-xs text-[#D9B18C]">
                {category?.name ? `الفئة: ${category.name}` : ''}{category?.name && query ? ' · ' : ''}{query ? `البحث عن: ${query}` : ''}
              </p>
            )}
          </div>
          <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-[#C99B70]/30 bg-[#C99B70]/10 px-4 py-3 text-sm font-semibold text-[#E5C5A5] transition hover:bg-[#C99B70]/15 lg:hidden">
            <FaFilter aria-hidden="true" /> الفلاتر
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-white/[.08] bg-[#191714] p-4">
              <FilterPanel onApply={() => {}} />
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-5 rounded-2xl border border-white/[.08] bg-[#191714] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="font-bold text-white">نتائج البحث</h2><p className="mt-1 text-xs text-stone-400">النتائج تتحدث عند تعديل معايير البحث</p></div>
                <div className="rounded-full border border-white/10 bg-[#211F1B] px-3 py-2 text-xs text-stone-300">
                  {Array.isArray(results) ? results.length : 0} من {typeof totalCount === 'number' ? totalCount : 0}
                </div>
              </div>
              <div className="mt-4"><SelectedFilters /></div>
            </div>
            <SearchResults />
          </section>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="fixed inset-0 z-[1100] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="إغلاق نافذة الفلاتر" onClick={() => setMobileFiltersOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }} className="absolute right-0 top-0 flex h-full w-[min(92vw,420px)] flex-col overflow-y-auto border-l border-white/10 bg-[#171512] p-4 shadow-2xl sm:p-5">
              <FilterPanel mobile onClose={() => setMobileFiltersOpen(false)} onApply={() => setMobileFiltersOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
