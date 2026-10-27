'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import categories from '../Categories/categories';
import { serializeCategory } from '../Categories/serializeCategory';
import { FaHome } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '@/features/search/search-context';

// تعريف الكومبوننت AnimatedCard بتصميم زجاجي وتأثيرات ناعمة
const AnimatedCard = ({ children, isSelected, onClick, isHovered }) => (
  <motion.div
    className={cn(
      'relative flex flex-col items-center justify-center p-2 rounded-xl w-fit h-24 cursor-pointer overflow-hidden transition-all duration-300',
      isSelected
        ? 'text-[#F5F0E9] shadow-lg shadow-[#C99B70]/15'
        : 'text-stone-400 hover:text-[#F5F0E9]',
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
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#C99B70] to-[#A8754D]"
        layoutId="categoryIdBackground"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}

    {/* تأثير الإضاءة الخلفية عند الحوم (Hover Glow Effect) */}
    <AnimatePresence>
      {isHovered && !isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-[#C99B70]/30 bg-[#C99B70]/10 backdrop-blur-sm"
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
        className="absolute bottom-1.5 w-1.5 h-1.5 bg-white rounded-full"
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
  } = useSearch();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleCategoryIdClick = useCallback(
    async (categoryItem) => {
      setCategory(categoryItem);
      router.push(`/search?categoryId=${categoryItem.id}`);
      localStorage.setItem('category', serializeCategory(categoryItem));
    },
    [setCategory, router],
  );

  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.id === category?.id) || null;
  }, [category]);

  return (
    <div className="w-full border-b border-white/10 bg-[#171512]/85 backdrop-blur-sm">
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
                        ? 'bg-white/20 border border-white/30 text-white'
                        : isHovered
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'bg-white border border-slate-200 text-slate-500 shadow-sm',
                    )}
                  >
                    <div className="text-xl">
                      {categoryItem?.icon || <FaHome />}
                    </div>
                  </div>

                  {/* اسم القسم في الديسكتوب */}
                  <span
                    className={cn(
                      'text-xs font-semibold mt-2 transition-colors duration-200 tracking-wide select-none',
                      isSelected
                        ? 'text-white font-bold'
                        : 'text-white/70 group-hover:text-orange-600',
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
      <div className="sm:hidden flex overflow-x-auto gap-2 p-2 bg-white/80 backdrop-blur-md scrollbar-none snap-x">
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
                    ? 'bg-gradient-to-br from-[#FDAA05] to-[#FA6D0B] text-white border-transparent shadow-md shadow-orange-500/25'
                    : 'bg-slate-50 text-slate-600 border-slate-100',
                )}
              >
                {/* حاوية الأيقونة للموبايل */}
                <div
                  className={cn(
                    // 🟢 تم تصغير حجم الأيقونة من text-xl إلى text-base (أو text-lg حسب رغبتك) وتقليل الهامش السفلي mb-1
                    'text-base mb-1',
                    isSelected ? 'text-white' : 'text-slate-500',
                  )}
                >
                  {categoryItem?.icon || <FaHome />}
                </div>

                {/* اسم القسم للموبايل */}
                <span
                  className={cn(
                    // 🟢 تم تصغير الخط قليلاً من 11px إلى 10px ليناسب الحجم الجديد للبطاقة
                    'text-[10px] font-medium tracking-tight whitespace-nowrap',
                    isSelected ? 'font-bold text-white' : 'text-slate-600',
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
