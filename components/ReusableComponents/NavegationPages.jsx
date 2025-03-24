'use client';
import { motion } from 'framer-motion';
import React from 'react';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function NavegationPages({
  hasMore,
  setPageNumber,
  pageNumber,
}) {
  // console.log('array', array);
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
          className="flex items-center justify-center text-sm sm:text-lg gap-2 py-2 px-2 sm:py-3 sm:px-8 bg-three rounded-[5px] text-white"
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
          className="flex items-center justify-center text-sm sm:text-lg gap-2 py-2 px-2 sm:py-3 sm:px-8 bg-three rounded-[5px] text-white"
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          <MdKeyboardDoubleArrowLeft className="text-xl text-primary-500 " />
          الصفحة السابقة
        </motion.button>
      )}
    </motion.div>
    // <motion.div
    //   whileHover={{ scale: 1.03 }}
    //   whileTap={{ scale: 0.95 }}
    //   className="flex items-center justify-around gap-4 my-16"
    // >
    //   {hasMore && (
    //     <motion.button
    //       whileHover={{ scale: 1.05 }}
    //       whileTap={{ scale: 0.95 }}
    //       className="flex items-center justify-center text-sm sm:text-lg gap-2 py-2 px-2 sm:py-3 sm:px-8
    //   bg-transparent
    //   hover:bg-primary-500/10
    //   rounded-xl shadow-lg hover:shadow-xl
    //   text-white font-semibold
    //   border-2 border-primary-500/20 hover:border-primary-500/50
    //   transition-all duration-300"
    //       onClick={() => setPageNumber(pageNumber + 1)}
    //     >
    //       الصفحة التالية
    //       <MdKeyboardDoubleArrowRight className="text-xl text-primary-500 animate-pulse" />
    //     </motion.button>
    //   )}

    //   {pageNumber > 1 && (
    //     <motion.button
    //       whileHover={{ scale: 1.05 }}
    //       whileTap={{ scale: 0.95 }}
    //       className="flex items-center justify-center text-sm sm:text-lg gap-2 py-2 px-2 sm:py-3 sm:px-8
    //   bg-transparent
    //   hover:bg-primary-500/10
    //   rounded-xl shadow-lg hover:shadow-xl
    //   text-white font-semibold
    //   border-2 border-primary-500/20 hover:border-primary-500/50
    //   transition-all duration-300"
    //       onClick={() => setPageNumber(pageNumber - 1)}
    //     >
    //       <MdKeyboardDoubleArrowLeft className="text-xl text-primary-500 animate-pulse" />
    //       الصفحة السابقة
    //     </motion.button>
    //   )}
    // </motion.div>
  );
}
