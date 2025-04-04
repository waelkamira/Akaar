'use client';
import { motion } from 'framer-motion';
import React from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function NavegationPages({
  hasMore,
  setPageNumber,
  pageNumber,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-around gap-4 my-16"
    >
      {hasMore && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center text-sm sm:text-lg gap-2 py-2 px-2 sm:py-3 sm:px-8 bg-three rounded-[5px]"
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          الصفحة التالية
          <MdKeyboardDoubleArrowRight className="text-xl text-primary-500" />
        </motion.button>
      )}

      {pageNumber > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center text-sm sm:text-lg gap-2 py-2 px-2 sm:py-3 sm:px-8 bg-three rounded-[5px]"
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          <MdKeyboardDoubleArrowLeft className="text-xl text-primary-500 " />
          الصفحة السابقة
        </motion.button>
      )}
    </motion.div>
  );
}
