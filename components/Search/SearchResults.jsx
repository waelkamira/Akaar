'use client';

import { useEffect } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { Loader2 } from 'lucide-react';
import SmallCard from '../ReusableComponents/SmallCard/SmallCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchResults() {
  const {
    results,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    category,
    filters,
  } = useSearch();

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500 mr-2" />
        <span className="text-gray-600">جاري البحث...</span>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  // Show empty state
  if (!loading && results.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-2">لم يتم العثور على نتائج</p>
        <p className="text-sm text-gray-400">
          جرب تعديل معايير البحث للحصول على نتائج أفضل
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Results header with count and category */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white rounded-xl shadow-sm p-4 border border-gray-100"
      >
        <motion.p
          whileHover={{ scale: 1.02 }}
          className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full inline-flex items-center"
        >
          <span className="font-medium text-primary mx-1">{totalCount}</span>
          نتيجة متاحة
          {category && (
            <span className="flex items-center mr-2">
              <span className="mx-2 text-gray-400">|</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
                  clipRule="evenodd"
                />
              </svg>
              {category.name}
            </span>
          )}
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full"
        >
          عرض {results.length} من {totalCount}
        </motion.div>
      </motion.div>

      {/* Results grid with beautiful animations */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {results.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <SmallCard item={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load more button with beautiful effects */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            disabled={loading}
            className="relative px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:bg-primary-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {loading && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-0 left-0 h-1 bg-white/30"
              />
            )}
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Loader2 className="h-5 w-5" />
                  </motion.div>
                  جاري التحميل...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  تحميل المزيد
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
