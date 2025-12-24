'use client';
import { motion } from 'framer-motion';
import React from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function Pagination({ hasMore, setPage, page }) {
  // console.log('page', page);

  return (
    <motion.div className="flex items-center justify-around gap-4 my-16">
      {hasMore && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center text-sm sm:text-lg gap-2 py-2 px-2 sm:py-3 sm:px-8 bg-three rounded-lg hover:border border-gray-500 transition-all ease-in-out duration-200"
          onClick={() => {
            setPage(page + 1);
            typeof window !== 'undefined'
              ? window.scrollTo({ top: 400, behavior: 'smooth' })
              : '';
          }}
        >
          الصفحة التالية
          <MdKeyboardDoubleArrowRight className="text-xl text-primary-500" />
        </motion.button>
      )}
      {hasMore && page}
      {page > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center text-sm sm:text-lg gap-2 py-2 px-2 sm:py-3 sm:px-8 bg-three rounded-lg hover:border border-gray-500 transition-all ease-in-out duration-200"
          onClick={() => {
            setPage(page - 1);

            typeof window !== 'undefined'
              ? window.scrollTo({ top: 400, behavior: 'smooth' })
              : '';
          }}
        >
          <MdKeyboardDoubleArrowLeft className="text-xl text-primary-500 " />
          الصفحة السابقة
        </motion.button>
      )}
    </motion.div>
  );
}
