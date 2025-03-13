'use client';
import React from 'react';
import { motion } from 'framer-motion';
import categories from '../Categories/categories';
import { useRouter } from 'next/navigation';

export default function CategoriesSideBar() {
  const router = useRouter();

  const handleCategoryClick = (category) => {
    localStorage.setItem('category', JSON.stringify(category));
    router.push(`/categories/${category.id}?category=${category.name}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="hidden 2xl:flex flex-col items-center w-[7%]  overflow-y-auto">
      <motion.div
        className="flex flex-col items-center fixed top-40 right-0 z-50 w-[11%] h-screen pb-40 pt-14 overflow-y-auto bg-three shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative flex items-center justify-around gap-3 w-32 h-10 mb-4 rounded-lg cursor-pointer bg-gradient-to-r from-transparent to-transparent hover:from-one hover:to-three text-white shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => handleCategoryClick(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-three rounded-lg shadow-inner opacity-30 w-full" />
              <span className="text-2xl hover:text-one">{category.icon}</span>
              <span className="text-lg font-medium select-none">
                {category.name}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-one to-three rounded-lg opacity-0 transition-opacity duration-300"
                style={{ zIndex: -1 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
