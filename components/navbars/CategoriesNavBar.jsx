'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useMemo, useState } from 'react';
import categories from '../Categories/categories';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '../../contexts/SearchContext';
import { cities } from '../lists/Cities';

// تعريف الكومبوننت AnimatedCard مع تأثيرات التعويم المحسنة
const AnimatedCard = ({ children, isSelected, onClick, isHovered }) => (
  <motion.div
    className={`relative z-0 flex flex-col items-center justify-center
      ${isSelected ? 'text-white ' : 'text-gray-400 '}
      p-1 rounded-lg transition-all duration-300 w-full h-24 transform hover:scale-105 cursor-pointer
      backdrop-filter`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{
      scale: 1.05,
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {/* إطار متحرك عند التعويم */}
    {isHovered && (
      <motion.div
        className="absolute inset-0 rounded-lg transition-transform duration-100 ease-in-out"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: '0 0 15px 3px rgba(253, 170, 5, 0.7)',
        }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            'linear-gradient(45deg, rgba(253, 170, 5, 0.2), rgba(250, 109, 11, 0.2))',
          border: '2px solid transparent',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(253, 170, 5, 0.3), rgba(250, 109, 11, 0.3))',
              'linear-gradient(135deg, rgba(253, 170, 5, 0.4), rgba(250, 109, 11, 0.4))',
              'linear-gradient(225deg, rgba(253, 170, 5, 0.3), rgba(250, 109, 11, 0.3))',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
      </motion.div>
    )}

    {/* الخلفية المحددة */}
    {isSelected && (
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#FDAA05] to-[#FA6D0B]"
        layoutId="categoryIdBackground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}

    {children}

    {isSelected && (
      <motion.div
        className="absolute -bottom-1 w-2 h-2 bg-white border border-gray-500 rounded-full shadow-lg shadow-orange-500/50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </motion.div>
);

const CategoriesNavBar = () => {
  const router = useRouter();
  const {
    category,
    setCategory,
    availableFilters,
    setAvailableFilters,
    performSearch,
  } = useSearch();
  console.log('category', category);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleCategoryIdClick = useCallback(
    async (categoryItem) => {
      setCategory(categoryItem); // Update context first

      // Update URL and navigate to search page with new URL structure
      router.push(`/search/categoryId=${categoryItem.id}`);

      // Store category in localStorage
      localStorage.setItem('category', JSON.stringify(categoryItem));

      // Perform search with the selected category
      performSearch();
    },
    [setCategory, router, performSearch]
  );

  useEffect(() => {
    if (category) {
      const categoryId = categories.find((c) => c.id === category?.id)?.id;

      if (categoryId) {
        import(`../categoryFields/${category?.name}.jsx`)
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
                  max: 0,
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
    <div className="hidden sm:block w-full -z-10 absolute bottom-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden sm:flex overflow-x-auto gap-2 p-3 bg-white shadow-md w-full border-b border-orange-100/500 z-0"
      >
        {categories?.length > 0 &&
          categories?.map((categoryItem) => (
            <div
              key={categoryItem?.id}
              className="relative w-full"
              onMouseEnter={() => setHoveredCategory(categoryItem.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <AnimatedCard
                isSelected={selectedCategory?.id === categoryItem?.id}
                isHovered={hoveredCategory === categoryItem.id}
                onClick={() => handleCategoryIdClick(categoryItem)}
              >
                <div
                  className={`relative mb-2 flex items-center justify-center w-12 h-12 rounded-full
                    ${
                      selectedCategory?.id === categoryItem?.id ||
                      hoveredCategory === categoryItem.id
                        ? 'bg-primary-400 shadow-lg shadow-orange-500/30'
                        : 'bg-white/40 border border-gray-200/50'
                    } transition-all duration-300`}
                >
                  {(selectedCategory?.id === categoryItem?.id ||
                    hoveredCategory === categoryItem.id) && (
                    <div className="absolute inset-0 rounded-full bg-white/20 border border-white/20"></div>
                  )}
                  <div
                    className={
                      (hoveredCategory === categoryItem.id ||
                      selectedCategory?.id === categoryItem?.id
                        ? `text-white`
                        : `text-gray-400`) + ` relative text-2xl`
                    }
                  >
                    {categoryItem?.icon || <FaHome className="text-2xl" />}
                  </div>
                </div>

                <span
                  className={
                    (selectedCategory?.id === categoryItem?.id ||
                    hoveredCategory === categoryItem.id
                      ? ' text-white '
                      : ` text-gray-500 `) + ` relative text-xs font-bold mt-1`
                  }
                >
                  {categoryItem?.name}
                </span>
              </AnimatedCard>
            </div>
          ))}
      </motion.div>

      {/* mobile view */}
      <div className="sm:hidden flex overflow-x-auto gap-2 p-3 bg-white/70 backdrop-blur-lg shadow-md w-full border-b border-orange-100/50">
        {categories?.length > 0 &&
          categories?.map((categoryItem) => (
            <motion.button
              key={categoryItem?.id}
              onClick={() => handleCategoryIdClick(categoryItem)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={
                ('flex-shrink-0 flex flex-col items-center p-1 sm:p-2 rounded-lg min-size-12 backdrop-blur-md',
                selectedCategory?.id === categoryItem?.id
                  ? 'bg-gradient-to-br from-orange-500/90 via-orange-400/90 to-orange-600/90 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/70 text-gray-600 border border-gray-100/50')
              }
            >
              <div
                className={cn(
                  'relative flex items-center justify-center size-5 sm:size-8 rounded-full mb-1 ',
                  selectedCategory?.id === categoryItem?.id
                    ? 'text-white bg-orange-600/50'
                    : 'text-amber-500 bg-amber-50/50'
                )}
              >
                {selectedCategory?.id === categoryItem?.id && (
                  <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-30"></div>
                )}
                <div className="relative text-sm text-red-500">
                  {categoryItem?.icon}
                </div>
              </div>
              <span className="text-[10px] font-medium hover:text-gray-500">
                {categoryItem?.name}
              </span>
            </motion.button>
          ))}
      </div>
    </div>
  );
};

export default CategoriesNavBar;
