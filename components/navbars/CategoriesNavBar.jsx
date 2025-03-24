'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import categories from '../Categories/categories';
import { FaHome } from 'react-icons/fa';
import { BsBuilding } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const AnimatedCard = ({ children, isSelected, onClick }) => (
  <motion.div
    onClick={onClick}
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const storedCategory = localStorage.getItem('category');
    let category;

    try {
      category = storedCategory ? JSON.parse(storedCategory) : null;
    } catch (error) {
      console.error('Failed to parse category from localStorage', error);
      category = null;
    }

    if (category) {
      setSelectedCategory(category);
    } else {
      const defaultValue = {
        id: 1,
        name: 'عقارات',
        path: '/categories/1?category=عقارات',
        icon: <BsBuilding className="h-6 w-6" />,
      };
      setSelectedCategory(defaultValue);
      localStorage.setItem('category', JSON.stringify(defaultValue));
    }
  }, []);

  const handleCategoryClick = (category) => {
    localStorage.setItem('category', JSON.stringify(category));
    setSelectedCategory(category);
    router.push(category.path);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden sm:flex overflow-x-auto gap-2 p-3 bg-white/70 shadow-md w-full border-b border-orange-100/500"
      >
        {categories?.map((category) => (
          <AnimatedCard
            key={category.id}
            isSelected={selectedCategory?.id === category.id}
            onClick={() => handleCategoryClick(category)}
            className="min-w-[96px]" //  Added here. Adjust value as needed.
          >
            <div
              className={`relative z-10 mb-2 flex items-center justify-center w-12 h-12 rounded-full
            ${
              selectedCategory?.id === category.id
                ? 'bg-orange-600/50 shadow-lg shadow-orange-500/30'
                : 'bg-white/40 border border-gray-200/50'
            } transition-all duration-300`}
            >
              {selectedCategory?.id === category.id && (
                <div className="absolute inset-0 rounded-full bg-orange-500 opacity-40"></div>
              )}
              <div className="relative z-10 text-2xl">
                {category.icon || <FaHome className="text-2xl" />}
              </div>
            </div>

            <span className="relative z-10 text-xs font-bold mt-1">
              {category.name}
            </span>
          </AnimatedCard>
        ))}
      </motion.div>

      {/* mobile view */}
      <div className="sm:hidden flex overflow-x-auto gap-2 p-3 bg-white/70 backdrop-blur-lg shadow-md w-full border-b border-orange-100/50">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex-shrink-0 flex flex-col items-center p-1 sm:p-2 rounded-lg min-size-12  backdrop-blur-md',
              selectedCategory?.id === category.id
                ? 'bg-gradient-to-br from-orange-500/90 via-orange-400/90 to-orange-600/90 text-white shadow-lg shadow-orange-500/30'
                : 'bg-white/70 text-gray-600 border border-gray-100/50'
            )}
          >
            <div
              className={cn(
                'relative flex items-center justify-center size-5 sm:size-8 rounded-full mb-1',
                selectedCategory?.id === category.id
                  ? 'text-white bg-orange-600/50'
                  : 'text-amber-500 bg-amber-50/50'
              )}
            >
              {selectedCategory?.id === category.id && (
                <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-30"></div>
              )}
              <div className="relative z-10 text-sm">{category.icon}</div>
            </div>
            <span className="text-[10px] font-medium hover:text-gray-500">
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesNavBar;
