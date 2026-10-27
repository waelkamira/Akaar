'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import categories from '../Categories/categories';
import { FaHome } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '@/features/search/search-context';
import { serializeCategory } from '../Categories/serializeCategory';

const CategoryCard = ({ item, selected, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative isolate flex w-full min-w-0',
        'min-h-[118px] flex-col items-center justify-center gap-3',
        'overflow-hidden rounded-xl border p-4 text-right',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-orange-300 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[#54251c]',
        selected
          ? 'border-orange-200/70 bg-[#ffb17c]/20 shadow-lg shadow-black/10'
          : 'border-white/15 bg-white/[0.055] hover:border-orange-200/50 hover:bg-white/[0.11]'
      )}
    >
      {/* خلفية متوهجة للقسم المحدد */}
      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId="category-active-glow"
            className="absolute inset-0 -z-10 bg-gradient-to-br from-[#C99B70]/25 via-[#C99B70]/10 to-transparent"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          />
        )}
      </AnimatePresence>

      {/* زخرفة هندسية مستوحاة من التصميم المرجعي */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -bottom-8 -left-5',
          'h-20 w-20 rounded-full border',
          'border-white/[0.07] transition-transform duration-500',
          'group-hover:scale-125'
        )}
      />

      {/* أيقونة القسم */}
      <div
        className={cn(
          'relative flex h-12 w-12 shrink-0 items-center justify-center',
          'rounded-xl border transition-all duration-300',
          selected
            ? 'border-white/40 bg-gradient-to-br from-[#ffb06e] to-[#e85c25] text-white shadow-lg shadow-orange-950/20'
            : 'border-white/15 bg-[#572b21]/40 text-[#E5C5A5] group-hover:border-orange-200/50 group-hover:bg-[#a8492b]/50 group-hover:text-white'
        )}
      >
        <span className="text-xl">
          {item?.icon || <FaHome />}
        </span>
      </div>

      {/* اسم القسم */}
      <div className="relative flex min-w-0 w-full flex-col items-center gap-1">
        <span
          className={cn(
            'w-full text-center text-[10px] font-bold',
            'transition-colors duration-300',
            selected
              ? 'text-white'
              : 'text-[#E5C5A5]/85 group-hover:text-white'
          )}
        >
          {item?.name}
        </span>

        <span
          className={cn(
            'h-px transition-all duration-300',
            selected
              ? 'w-10 bg-[#D9B18C]'
              : 'w-0 bg-[#D9B18C] group-hover:w-8'
          )}
        />
      </div>

      {/* مؤشر الاختيار */}
      <span
        className={cn(
          'absolute right-2 top-2 h-1.5 w-1.5 rounded-full',
          'transition-all duration-300',
          selected
            ? 'bg-[#D9B18C] shadow-[0_0_9px_rgba(255,207,157,0.9)]'
            : 'bg-white/15 group-hover:bg-[#D9B18C]/70'
        )}
      />
    </motion.button>
  );
};

const CategoriesNavBar = () => {
  const router = useRouter();
  const { category, setCategory, searchQuery } = useSearch();

  const selectedCategory = useMemo(
    () => categories?.find((item) => item.id === category?.id) || null,
    [category]
  );

  const handleCategoryClick = useCallback(
    (item) => {
      setCategory(item);

      try {
        localStorage.setItem(
          'category',
          serializeCategory(item)
        );
      } catch {
        // Storage may be unavailable in private browsing.
      }

      const query = searchQuery.trim();
      const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';
      router.push(`/search?categoryId=${encodeURIComponent(item.id)}${queryParam}`);
    },
    [setCategory, router, searchQuery]
  );

  return (
    <section
      dir="rtl"
      aria-label="تصفح الأقسام"
      className={cn(
        'sticky top-0 z-40 w-full overflow-hidden',
        'border-b border-white/10',
        'bg-gradient-to-br from-[#e97842] via-[#a94e31] to-[#54291f]',
        'text-white shadow-xl shadow-black/10'
      )}
    >
      {/* توهجات زخرفية في الخلفية */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-300/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 left-0 h-72 w-72 rounded-full bg-[#351b19]/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* رأس الأقسام */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-11 w-1 shrink-0 rounded-full bg-gradient-to-b from-orange-100 to-orange-300/30" />

            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-tight text-white sm:text-xl">
                تصفح الأقسام
              </h2>

              <p className="mt-1 text-xs text-[#E5C5A5]/75 sm:text-sm">
                اكتشف ما تبحث عنه بسهولة
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/[0.10] px-3 py-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D9B18C] shadow-[0_0_8px_rgba(255,220,180,0.7)]" />

            <span className="text-xs font-medium text-[#E5C5A5]/90">
              {categories?.length || 0} قسم
            </span>
          </div>
        </div>

        {/* شبكة الأقسام: حافظنا على توزيع الأعمدة الأصلي */}
        <div className="grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
          {categories?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.035, 0.3),
              }}
            >
              <CategoryCard
                item={item}
                selected={selectedCategory?.id === item.id}
                onClick={() => handleCategoryClick(item)}
              />
            </motion.div>
          ))}
        </div>

        {/* تذييل بسيط */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[10px] font-medium tracking-[0.18em] text-[#E5C5A5]/50">
            DISCOVER YOUR CATEGORY
          </span>

          <span className="text-xs text-orange-50/60">
            {selectedCategory?.name || 'اختر قسماً للبدء'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CategoriesNavBar;
