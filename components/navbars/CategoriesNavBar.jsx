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
    onClick={onClick} // ✅ تمرير onClick هنا
    className={`relative flex flex-col items-center justify-center
      ${isSelected ? 'text-white' : 'text-gray-400 hover:text-white'}
      p-3 rounded-xl transition-all duration-300 w-24 h-24 transform hover:scale-105 z-10 cursor-pointer`} // ✅ التأكد من cursor-pointer
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {isSelected && (
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600"
        layoutId="categoryBackground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
    {children}
    {isSelected && (
      <motion.div
        className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full"
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
    router.push(category.path); // ✅ التنقل عبر `router.push`
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden sm:flex justify-center items-center gap-3 p-6 shadow-lg w-full bg-white/80 backdrop-blur-sm mx-auto"
      >
        {categories?.map((category) => (
          <AnimatedCard
            key={category.id}
            isSelected={selectedCategory?.id === category.id}
            onClick={() => handleCategoryClick(category)} // ✅ تمرير `onClick`
          >
            <div
              className={`relative z-10 mb-2 flex items-center justify-center w-12 h-12 rounded-full
                ${
                  selectedCategory?.id === category.id
                    ? 'bg-orange-600/50 shadow-lg shadow-orange-500/30'
                    : 'bg-zinc-800/20'
                } transition-all duration-300`}
            >
              {selectedCategory?.id === category.id && (
                <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-30"></div>
              )}
              <div className="relative z-10">
                {category.icon || <FaHome className="text-2xl" />}
              </div>
            </div>

            <span className="relative z-10 text-xs font-bold mt-1">
              {category.name}
            </span>
          </AnimatedCard>
        ))}
      </motion.div>

      <div className="sm:hidden flex overflow-x-auto gap-2 p-3 bg-white/90 backdrop-blur-sm shadow-md w-full">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)} // ✅ تمرير `onClick`
            className={cn(
              'flex-shrink-0 flex flex-col items-center p-2 rounded-lg min-w-16',
              selectedCategory?.id === category.id
                ? 'bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 text-white'
                : 'bg-white text-gray-600'
            )}
          >
            <div
              className={cn(
                selectedCategory?.id === category.id
                  ? 'text-white'
                  : 'text-amber-500'
              )}
            >
              {category.icon}
            </div>
            <span className="text-[10px] mt-1 font-medium">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesNavBar;
