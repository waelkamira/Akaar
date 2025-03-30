// src/navbars/CategoriesNavBar.js
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import categories from '../Categories/categories';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '../../contexts/SearchContext';
import { cities } from '../lists/Cities';

// تعريف الكومبوننت AnimatedCard (تأكد من أنه يظهر قبل استخدامه)
const AnimatedCard = ({ children, isSelected, onClick }) => (
  <motion.div
    className={`relative flex flex-col items-center justify-center
      ${isSelected ? 'text-white' : 'text-gray-400'}
      p-3 rounded-xl transition-all duration-300 w-24 h-24 transform hover:scale-105 z-10 cursor-pointer
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
  const searchParams = useSearchParams();
  const {
    category,
    setCategory,
    availableFilters,
    setAvailableFilters,
    performSearch,
  } = useSearch();

  const handleCategoryIdClick = useCallback(
    async (categoryItem) => {
      setCategory(categoryItem); // Update context first

      // Update URL and navigate to search page
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('categoryId', categoryItem.id);
      await router.push(`/search?${newParams.toString()}`);

      // Store category in localStorage
      localStorage.setItem('category', JSON.stringify(categoryItem));

      // Perform search with the selected category
      performSearch();
    },
    [setCategory, router, searchParams, performSearch]
  );

  useEffect(() => {
    if (category) {
      const categoryId = categories.find((c) => c.id === category?.id)?.id;

      if (categoryId) {
        import(`../categoryFields/${category?.enName}.jsx`)
          .then((module) => {
            const dynamicFilters = module?.default;

            const filterOptionsUpdate = {
              ...availableFilters,
              static: {
                cities: cities.map((city) => ({
                  ...city,
                  id: city.name, // Use name as id for compatibility
                  towns: city.towns.map((town) => ({
                    ...town,
                    id: town.name, // Use name as id for compatibility
                  })),
                })),
                priceRange: {
                  min: 0,
                  max: 150000,
                },
              },
              dynamic: dynamicFilters,
            };

            setAvailableFilters(filterOptionsUpdate);
          })
          .catch((err) => {
            console.error('Failed to load fields:', err);
          });
      }
    }
  }, [category, setAvailableFilters, availableFilters]);

  // Use useMemo to memoize the selected categoryId object to prevent unnecessary re-renders
  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.id === category?.id) || null;
  }, [category]);

  return (
    <div className="hidden sm:block relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden sm:flex overflow-x-auto gap-2 p-3 bg-white shadow-md w-full border-b border-orange-100/500"
      >
        {categories?.length > 0 &&
          categories?.map(
            (
              categoryItem // Rename categoryId to categoryItem
            ) => (
              <AnimatedCard // استخدام الكومبوننت هنا
                key={categoryItem?.id}
                isSelected={selectedCategory?.id === categoryItem?.id} // Use selectedCategory and categoryItem
                onClick={() => handleCategoryIdClick(categoryItem)} // Use categoryItem
                className="min-w-[96px]"
              >
                <div
                  className={`relative z-10 mb-2 flex items-center justify-center w-12 h-12 rounded-full
            ${
              selectedCategory?.id === categoryItem?.id // Use selectedCategory and categoryItem
                ? 'bg-orange-600/50 shadow-lg shadow-orange-500/30'
                : 'bg-white/40 border border-gray-200/50'
            } transition-all duration-300`}
                >
                  {selectedCategory?.id === categoryItem?.id && ( // Use selectedCategory and categoryItem
                    <div className="absolute inset-0 rounded-full bg-orange-500 opacity-40"></div>
                  )}
                  <div className="relative z-10 text-2xl">
                    {categoryItem?.icon || <FaHome className="text-2xl" />}{' '}
                    {/* Use categoryItem */}
                  </div>
                </div>

                <span className="relative z-10 text-xs font-bold mt-1">
                  {categoryItem?.name} {/* Use categoryItem */}
                </span>
              </AnimatedCard>
            )
          )}
      </motion.div>

      {/* mobile view */}
      <div className="sm:hidden flex overflow-x-auto gap-2 p-3 bg-white/70 backdrop-blur-lg shadow-md w-full border-b border-orange-100/50">
        {categories?.length > 0 &&
          categories?.map(
            (
              categoryItem // Rename categoryId to categoryItem
            ) => (
              <motion.button
                key={categoryItem?.id}
                onClick={() => handleCategoryIdClick(categoryItem)} // Use categoryItem
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={
                  ('flex-shrink-0 flex flex-col items-center p-1 sm:p-2 rounded-lg min-size-12  backdrop-blur-md',
                  selectedCategory?.id === categoryItem?.id // Use selectedCategory and categoryItem
                    ? 'bg-gradient-to-br from-orange-500/90 via-orange-400/90 to-orange-600/90 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/70 text-gray-600 border border-gray-100/50')
                }
              >
                <div
                  className={cn(
                    'relative flex items-center justify-center size-5 sm:size-8 rounded-full mb-1',
                    selectedCategory?.id === categoryItem?.id // Use selectedCategory and categoryItem
                      ? 'text-white bg-orange-600/50'
                      : 'text-amber-500 bg-amber-50/50'
                  )}
                >
                  {selectedCategory?.id === categoryItem?.id && ( // Use selectedCategory and categoryItem
                    <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-30"></div>
                  )}
                  <div className="relative z-10 text-sm">
                    {categoryItem?.icon}
                  </div>{' '}
                  {/* Use categoryItem */}
                </div>
                <span className="text-[10px] font-medium hover:text-gray-500">
                  {categoryItem?.name} {/* Use categoryItem */}
                </span>
              </motion.button>
            )
          )}
      </div>
    </div>
  );
};

export default CategoriesNavBar;
