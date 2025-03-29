// src/navbars/CategoriesNavBar.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import categories from '../Categories/categories';
import { FaHome } from 'react-icons/fa';
import { BsBuilding } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '../../contexts/SearchContext';

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
        layoutId="categoryBackground"
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
  const { categoryId, setCategoryId } = useSearch(); // Get categoryId from context

  useEffect(() => {
    // Load categoryId from localStorage on component mount
    const storedCategoryId = localStorage.getItem('categoryId');
    if (storedCategoryId) {
      setCategoryId(parseInt(storedCategoryId)); // Parse to number, ids are numbers
    } else {
      // Set a default category if none is stored
      const defaultCategoryId = 1; // Set your default category id
      setCategoryId(defaultCategoryId);
      localStorage.setItem('categoryId', defaultCategoryId.toString());
    }
  }, [setCategoryId]);

  const handleCategoryClick = (category) => {
    // Update categoryId in context before pushing to router
    setCategoryId(category?.id);
    localStorage.setItem('categoryId', category?.id.toString());
    router.push(`/search?category=${category?.id}`);
  };

  // Function to get the selected category object based on categoryId
  const getSelectedCategory = () => {
    return categories.find((cat) => cat.id === categoryId) || null;
  };

  const selectedCategory = getSelectedCategory();

  return (
    <div className="hidden sm:block relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden sm:flex overflow-x-auto gap-2 p-3 bg-white shadow-md w-full border-b border-orange-100/500"
      >
        {categories?.length > 0 &&
          categories?.map((category) => (
            <AnimatedCard // استخدام الكومبوننت هنا
              key={category?.id}
              isSelected={selectedCategory?.id === category?.id} // Use selectedCategory
              onClick={() => handleCategoryClick(category)}
              className="min-w-[96px]"
            >
              <div
                className={`relative z-10 mb-2 flex items-center justify-center w-12 h-12 rounded-full
            ${
              selectedCategory?.id === category?.id // Use selectedCategory
                ? 'bg-orange-600/50 shadow-lg shadow-orange-500/30'
                : 'bg-white/40 border border-gray-200/50'
            } transition-all duration-300`}
              >
                {selectedCategory?.id === category?.id && ( // Use selectedCategory
                  <div className="absolute inset-0 rounded-full bg-orange-500 opacity-40"></div>
                )}
                <div className="relative z-10 text-2xl">
                  {category?.icon || <FaHome className="text-2xl" />}
                </div>
              </div>

              <span className="relative z-10 text-xs font-bold mt-1">
                {category?.name}
              </span>
            </AnimatedCard>
          ))}
      </motion.div>

      {/* mobile view */}
      <div className="sm:hidden flex overflow-x-auto gap-2 p-3 bg-white/70 backdrop-blur-lg shadow-md w-full border-b border-orange-100/50">
        {categories?.length > 0 &&
          categories?.map((category) => (
            <motion.button
              key={category?.id}
              onClick={() => handleCategoryClick(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={
                ('flex-shrink-0 flex flex-col items-center p-1 sm:p-2 rounded-lg min-size-12  backdrop-blur-md',
                selectedCategory?.id === category?.id // Use selectedCategory
                  ? 'bg-gradient-to-br from-orange-500/90 via-orange-400/90 to-orange-600/90 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/70 text-gray-600 border border-gray-100/50')
              }
            >
              <div
                className={cn(
                  'relative flex items-center justify-center size-5 sm:size-8 rounded-full mb-1',
                  selectedCategory?.id === category?.id // Use selectedCategory
                    ? 'text-white bg-orange-600/50'
                    : 'text-amber-500 bg-amber-50/50'
                )}
              >
                {selectedCategory?.id === category?.id && ( // Use selectedCategory
                  <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-30"></div>
                )}
                <div className="relative z-10 text-sm">{category?.icon}</div>
              </div>
              <span className="text-[10px] font-medium hover:text-gray-500">
                {category?.name}
              </span>
            </motion.button>
          ))}
      </div>
    </div>
  );
};

export default CategoriesNavBar;
