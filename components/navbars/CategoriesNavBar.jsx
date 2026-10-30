'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import categories from '../Categories/categories';
import { serializeCategory } from '../Categories/serializeCategory';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '@/features/search/search-context';
import CategoryThumbnail from '../Categories/CategoryThumbnail';

// تعريف الكومبوننت AnimatedCard بتصميم زجاجي وتأثيرات ناعمة
const AnimatedCard = ({ children, isSelected, onClick, isHovered }) => (
  <motion.div
    className={cn(
      'relative flex flex-col items-center justify-center p-2 rounded-xl w-fit h-24 cursor-pointer overflow-hidden transition-all duration-300',
      isSelected
        ? 'text-white shadow-ak-glow'
        : 'text-white hover:text-white',
    )}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
  >
    {/* الخلفية المحددة (تنتقل بسلاسة بين الكاردات بفضل layoutId) */}
    {isSelected && (
      <motion.div
        className="absolute inset-0 rounded-xl bg-ak-brand"
        layoutId="categoryIdBackground"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}

    {/* تأثير الإضاءة الخلفية عند الحوم (Hover Glow Effect) */}
    <AnimatePresence>
      {isHovered && !isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-ak-amber/30 bg-ak-brand-soft backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </AnimatePresence>

    {/* محتوى الكارد المستدعى */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-fit">
      {children}
    </div>

    {/* مؤشر نقطي سفلي ناعم عند التحديد */}
    {isSelected && (
      <motion.div
        className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-ak-ink"
        layoutId="activeDot"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
  </motion.div>
);

const CategoriesNavBar = () => {
  const router = useRouter();
  const {
    category,
    setCategory,
    searchQuery,
  } = useSearch();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleCategoryIdClick = useCallback(
    async (categoryItem) => {
      setCategory(categoryItem);
      const query = searchQuery.trim();
      const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';
      router.push(`/search?categoryId=${categoryItem.id}${queryParam}`);
      localStorage.setItem('category', serializeCategory(categoryItem));
    },
    [setCategory, router, searchQuery],
  );

  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.id === category?.id) || null;
  }, [category]);

  return (
    <div className="w-full border-b border-ak-line bg-ak-ink/85 backdrop-blur-xl">
      {/* ديسكتوب (Desktop View - يبقى كما هو تماماً دون تغيير */}
      <div className="hidden w-full sm:flex mx-auto px-1 overflow-x-auto gap-1 py-3 scrollbar-none justify-start items-center">
        {categories?.length > 0 &&
          categories.map((categoryItem) => {
            const isSelected = selectedCategory?.id === categoryItem?.id;
            const isHovered = hoveredCategory === categoryItem.id;

            return (
              <div
                key={categoryItem?.id}
                className="relative w-fit flex-1 group"
                onMouseEnter={() => setHoveredCategory(categoryItem.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <AnimatedCard
                  isSelected={isSelected}
                  isHovered={isHovered}
                  onClick={() => handleCategoryIdClick(categoryItem)}
                >
                  {/* حاوية الأيقونة في الديسكتوب */}
                  <div
                    className={cn(
                      'flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 transform group-hover:-translate-y-0.5',
                      isSelected
                        ? 'border border-ak-honey/40 bg-ak-ink/35 text-ak-honey'
                        : isHovered
                          ? 'bg-ak-brand text-ak-ink shadow-ak-glow'
                          : 'border border-ak-line bg-ak-raised text-white shadow-ak-card',
                    )}
                  >
                    <CategoryThumbnail category={categoryItem} className="size-10" />
                  </div>

                  {/* اسم القسم في الديسكتوب */}
                  <span
                    className={cn(
                      'text-xs font-semibold mt-2 transition-colors duration-200 tracking-wide select-none',
                      isSelected
                        ? 'font-bold text-ak-ink'
                        : 'text-white/70 group-hover:text-ak-honey',
                    )}
                  >
                    {categoryItem?.name}
                  </span>
                </AnimatedCard>
              </div>
            );
          })}
      </div>

      {/* موبايل (Mobile View) - 🟢 تم تصغير الأيقونات والحشوات هنا */}
      <div className="flex snap-x gap-2 overflow-x-auto bg-ak-ink/85 p-2 backdrop-blur-xl scrollbar-none sm:hidden">
        {categories?.length > 0 &&
          categories.map((categoryItem) => {
            const isSelected = selectedCategory?.id === categoryItem?.id;

            return (
              <motion.button
                key={categoryItem?.id}
                onClick={() => handleCategoryIdClick(categoryItem)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  // 🟢 تم تقليل الـ padding من p-3 إلى p-2 والـ min-w من 84px إلى 72px لتوفير مساحة
                  'flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-xl lg:min-w-[72px] sm:w-6 snap-center transition-all duration-300 border',
                  isSelected
                    ? 'bg-ak-brand text-ak-ink border-transparent shadow-ak-glow'
                    : 'border-ak-line bg-ak-surface text-white',
                )}
              >
                {/* حاوية الأيقونة للموبايل */}
                <div
                  className={cn(
                    // 🟢 تم تصغير حجم الأيقونة من text-xl إلى text-base (أو text-lg حسب رغبتك) وتقليل الهامش السفلي mb-1
                    'text-base mb-1',
                    isSelected ? 'text-ak-ink' : 'text-ak-honey',
                  )}
                >
                  <CategoryThumbnail category={categoryItem} className="size-8" />
                </div>

                {/* اسم القسم للموبايل */}
                <span
                  className={cn(
                    // 🟢 تم تصغير الخط قليلاً من 11px إلى 10px ليناسب الحجم الجديد للبطاقة
                    'text-[10px] font-medium tracking-tight whitespace-nowrap',
                    isSelected ? 'font-bold text-ak-ink' : 'text-white/75',
                  )}
                >
                  {categoryItem?.name}
                </span>
              </motion.button>
            );
          })}
      </div>
    </div>
  );
};

export default CategoriesNavBar;
