// src/navbars/CategoriesNavBar.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useMemo } from 'react';
import categories from '../Categories/categories';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '../../contexts/SearchContext';

// تعريف الكومبوننت AnimatedCard (تأكد من أنه يظهر قبل استخدامه)
const AnimatedCard = ({ children, isSelected, onClick }) => (
  <motion.div
    className={`relative z-0 flex flex-col items-center justify-center
      ${isSelected ? 'text-white' : 'text-gray-400'}
      p-3 rounded-xl transition-all duration-300 w-24 h-24 transform hover:scale-105  cursor-pointer
      backdrop-filter`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{
      scale: 1.05,
      boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)',
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {isSelected && (
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br text-white from-orange-500/80 via-orange-400/80 to-orange-600/80 "
        layoutId="categoryIdBackground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
    {children}
    {isSelected && (
      <motion.div
        className="absolute -bottom-1 w-2 h-2 bg-white rounded-full shadow-lg shadow-orange-500/50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </motion.div>
);

const CategoriesNavBar = () => {
  const router = useRouter();
  const { category, setCategory, performSearch, loadDynamicFilters } =
    useSearch();

  const handleCategoryIdClick = useCallback(
    async (categoryItem) => {
      setCategory(categoryItem);
      await router.push(`/search/categoryId=${categoryItem.id}`);
      localStorage.setItem('category', JSON.stringify(categoryItem));
      performSearch();
    },
    [setCategory, router, performSearch]
  );

  // Load dynamic filters when category changes
  useEffect(() => {
    if (category) {
      loadDynamicFilters(category);
    }
  }, [category, loadDynamicFilters]);

  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.id === category?.id) || null;
  }, [category]);

  return (
    <div className="relative w-full h-full mt-[50px] sm:mt-[70px] md:mt-[75px] lg:mt-[80px] xl:mt-0">
      <motion.div className="w-full z-10 absolute top-0">
        {/* Large Screen View (sm and up) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // This div is hidden by default, shown as flex on sm screens and larger
          className="hidden lg:flex overflow-x-auto gap-2 p-3 bg-white shadow-md w-full border-b border-orange-100/500"
        >
          {categories?.length > 0 &&
            categories?.map((categoryItem) => (
              <AnimatedCard
                key={categoryItem?.id}
                isSelected={selectedCategory?.id === categoryItem?.id}
                onClick={() => handleCategoryIdClick(categoryItem)}
                className="min-w-[96px]" // Ensure consistent naming if needed later
              >
                <div
                  className={`relative mb-2 flex items-center justify-center w-12 h-12 rounded-full
                  ${
                    selectedCategory?.id === categoryItem?.id
                      ? 'bg-orange-600/50 shadow-lg shadow-orange-500/30'
                      : 'bg-white/40 border border-gray-200/50'
                  } transition-all duration-300`}
                >
                  {selectedCategory?.id === categoryItem?.id && (
                    <div className="absolute inset-0 rounded-full bg-orange-500 opacity-40"></div>
                  )}
                  <div className="relative text-2xl">
                    {categoryItem?.icon || <FaHome className="text-2xl" />}
                  </div>
                </div>

                <span className="relative text-xs font-bold mt-1">
                  {categoryItem?.name}
                </span>
              </AnimatedCard>
            ))}
        </motion.div>
        {/* Small Screen View (below sm) */}
        <div className="lg:hidden flex overflow-x-auto gap-2 p-3 bg-white/70 backdrop-blur-lg shadow-md w-full border-b border-orange-100/50">
          {categories?.length > 0 &&
            categories?.map((categoryItem) => (
              <motion.button
                key={categoryItem?.id}
                onClick={() => handleCategoryIdClick(categoryItem)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center p-1 rounded-lg min-w-[50px] backdrop-blur-sm transition-all duration-200',
                  selectedCategory?.id === categoryItem?.id
                    ? 'bg-gray-100 shadow-md shadow-orange-400/20 border border-primary-600'
                    : 'bg-white/30 border border-gray-200/40 text-gray-400'
                )}
              >
                <div
                  className={`relative mb-1 flex items-center justify-center w-10 h-10 rounded-full ${
                    selectedCategory?.id === categoryItem?.id
                      ? 'bg-orange-500 shadow-inner text-white'
                      : 'bg-white/20'
                  } transition-all duration-200`}
                >
                  {selectedCategory?.id === categoryItem?.id && (
                    <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-pulse"></div>
                  )}
                  <div className="relative text-xl">
                    {categoryItem?.icon || <FaHome className="text-xl" />}
                  </div>
                </div>
                <span className="text-[9px] font-medium text-center line-clamp-1 px-0.5">
                  {categoryItem?.name}
                </span>
              </motion.button>
            ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoriesNavBar;
