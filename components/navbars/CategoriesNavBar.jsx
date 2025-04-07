// src/navbars/CategoriesNavBar.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
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
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/80 via-orange-400/80 to-orange-600/80 "
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
    // Suspense might not be needed directly here unless child components use it heavily.
    // Also, className on Suspense itself doesn't usually have visual effects.
    <div className="relative w-full h-full mt-[50px] sm:mt-[70px] md:mt-[75px] lg:mt-[80px] xl:mt-0">
      {' '}
      {/* Changed from Suspense, adjust if needed */}
      {/* Remove hidden sm:block from this outer div */}
      <motion.div className="w-full z-10 absolute top-0">
        {' '}
        {/* <--- CHANGE HERE */}
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
        {/* This div is shown by default (as flex), hidden on sm screens and larger */}
        <div className="lg:hidden flex overflow-x-auto gap-2 p-3 bg-white/70 backdrop-blur-lg shadow-md w-full border-b border-orange-100/50">
          {categories?.length > 0 &&
            categories?.map((categoryItem) => (
              <motion.button
                key={categoryItem?.id}
                onClick={() => handleCategoryIdClick(categoryItem)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // Simplified className logic for clarity
                className={cn(
                  'flex-shrink-0 flex flex-col items-center p-1 rounded-lg min-w-[60px] backdrop-blur-md transition-colors duration-200', // Added min-w for consistency, adjust as needed
                  selectedCategory?.id === categoryItem?.id
                    ? 'bg-gradient-to-br from-orange-500/90 via-orange-400/90 to-orange-600/90 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/70 text-gray-600 border border-gray-100/50'
                )}
              >
                <div
                  className={cn(
                    'relative flex items-center justify-center size-5 rounded-full mb-1 transition-colors duration-200', // Removed sm:size-8 as this view is only for small screens
                    selectedCategory?.id === categoryItem?.id
                      ? 'text-white bg-orange-600/50'
                      : 'text-amber-500 bg-amber-50/50'
                  )}
                >
                  {selectedCategory?.id === categoryItem?.id && (
                    <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-30"></div>
                  )}
                  <div className="relative text-sm">
                    {categoryItem?.icon || <FaHome />}
                  </div>{' '}
                  {/* Added fallback icon */}
                </div>
                <span className="text-[10px] font-medium text-center line-clamp-1">
                  {' '}
                  {/* Added text-center and line-clamp */}
                  {categoryItem?.name}
                </span>
              </motion.button>
            ))}
        </div>
      </motion.div>
    </div> // Closing the outer div
  );
};

export default CategoriesNavBar;
