'use client';

import { useSearch } from '@/features/search/search-context';
import { Loader2 } from 'lucide-react';
import SmallCard from '../ReusableComponents/SmallCard/SmallCard';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../ReusableComponents/Pagination';
import CategoryFilter from './CategoryFilter';

export default function SearchResults() {
  const {
    results,
    loading,
    error,
    totalCount,
    hasMore,
    category,
    setPage,
    page,
  } = useSearch();

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ak-amber mr-2" />
        <span className="text-stone-300">جاري البحث...</span>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[.05] text-rose-200 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  // Show empty state
  if (!loading && results.length === 0) {
    return (
      <div className="rounded-2xl border border-ak-line-strong/[.08] bg-ak-surface px-4 py-8 text-center sm:px-6 sm:py-12">
        <p className="mb-2 text-stone-200">لم يتم العثور على نتائج</p>
        <p className="text-sm text-stone-400">
          جرب تعديل معايير البحث أو اختر فئة أخرى
        </p>
        <div className="mt-8 text-right">
          <h2 className="mb-4 text-lg font-bold text-white">تصفح الأقسام</h2>
          <CategoryFilter />
        </div>
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
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <motion.p className="text-sm text-white bg-ak-surface border border-ak-line-strong/[.08] px-4 py-2 rounded-full inline-flex items-center">
          <span className="font-medium text-ak-honey mx-1">{totalCount}</span>
          نتيجة متاحة
          {category && (
            <span className="flex items-center mr-2">
              <span className="mx-2 text-stone-500">|</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white mr-1"
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

        <motion.div className="text-xs text-stone-400 bg-ak-surface border border-ak-line-strong/[.08] px-3 py-1.5 rounded-full">
          عرض {results?.length} من {totalCount}
        </motion.div>
      </motion.div>

      {/* Results grid with beautiful animations */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 "
      >
        <AnimatePresence>
          {results?.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <SmallCard item={product} priority={index === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Pagination hasMore={hasMore} setPage={setPage} page={page} />
    </motion.div>
  );
}
