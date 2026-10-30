'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import categories from '../Categories/categories';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '@/features/search/search-context';
import { serializeCategory } from '../Categories/serializeCategory';
import CategoryThumbnail from '../Categories/CategoryThumbnail';

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
        'focus-visible:ring-ak-honey focus-visible:ring-offset-2',
        'focus-visible:ring-offset-ak-ink',
        selected
          ? 'border-ak-honey/70 bg-ak-brand-soft shadow-ak-glow'
          : 'border-ak-line-strong bg-ak-ink/25 hover:border-ak-honey/50 hover:bg-ak-surface/70'
      )}
    >
      {/* خلفية متوهجة للقسم المحدد */}
      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId="category-active-glow"
            className="absolute inset-0 -z-10 bg-ak-brand-soft"
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
          'border-ak-line-strong/[0.07] transition-transform duration-500',
          'group-hover:scale-125'
        )}
      />

      {/* أيقونة القسم */}
      <div
        className={cn(
          'relative flex h-12 w-12 shrink-0 items-center justify-center',
          'rounded-xl border transition-all duration-300',
          selected
            ? 'border-ak-honey/60 bg-ak-brand text-ak-ink shadow-ak-glow'
            : 'border-ak-line-strong bg-ak-surface/70 text-ak-honey group-hover:border-ak-honey/50 group-hover:bg-ak-brand-soft group-hover:text-white'
        )}
      >
        <CategoryThumbnail category={item} className="size-12" />
      </div>

      {/* اسم القسم */}
      <div className="relative flex min-w-0 w-full flex-col items-center gap-1">
        <span
          className={cn(
            'w-full text-center text-[10px] font-bold',
            'transition-colors duration-300',
            selected
              ? 'text-white'
              : 'text-white/75 group-hover:text-white'
          )}
        >
          {item?.name}
        </span>

        <span
          className={cn(
            'h-px transition-all duration-300',
            selected
              ? 'w-10 bg-ak-honey'
              : 'w-0 bg-ak-honey group-hover:w-8'
          )}
        />
      </div>

      {/* مؤشر الاختيار */}
      <span
        className={cn(
          'absolute right-2 top-2 h-1.5 w-1.5 rounded-full',
          'transition-all duration-300',
          selected
            ? 'bg-ak-honey shadow-ak-glow'
            : 'bg-ak-line-strong group-hover:bg-ak-honey/70'
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
        'relative z-40 w-full overflow-hidden',
        'border-b border-ak-line-strong',
        'bg-ak-surface shadow-ak-panel',
        'text-white'
      )}
    >
      {/* توهجات زخرفية في الخلفية */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-ak-amber/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 left-0 h-72 w-72 rounded-full bg-ak-honey/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* رأس الأقسام */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-11 w-1 shrink-0 rounded-full bg-gradient-to-b from-ak-honey to-ak-copper/30" />

            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-tight text-white sm:text-xl">
                تصفح الأقسام
              </h2>

              <p className="mt-1 text-xs text-white sm:text-sm">
                اكتشف ما تبحث عنه بسهولة
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-ak-line-strong bg-ak-ink/25 px-3 py-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-ak-honey shadow-ak-glow" />

            <span className="text-xs font-medium text-white/90">
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
        <div className="mt-5 flex items-center justify-between border-t border-ak-line pt-3">
          <span className="text-[10px] font-medium tracking-[0.18em] text-ak-quiet">
            DISCOVER YOUR CATEGORY
          </span>

          <span className="text-xs text-white">
            {selectedCategory?.name || 'اختر قسماً للبدء'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CategoriesNavBar;
