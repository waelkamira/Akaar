'use client';

import { useEffect, use, useState } from 'react';
import { useSearch } from '../../../contexts/SearchContext';
import SearchResults from '../../../components/Search/SearchResults';
import StaticFilters from '../../../components/Search/StaticFilters';
import DynamicFilters from '../../../components/Search/DynamicFilters';
import SelectedFilters from '../../../components/Search/SelectedFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchProvider } from '../../../contexts/SearchContext';
import { filterOptions } from '../../../lib/mockData';
import { FiFilter, FiX } from 'react-icons/fi';
import { ImSearch } from 'react-icons/im';
import { useParams } from 'next/navigation';

function SearchCategoryContent({ params }) {
  const { performSearch, loading, selectedFilters } = useSearch();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // إغلاق الفلاتر عند تغيير حجم الشاشة إلى كبير
      if (!mobile) setShowMobileFilters(false);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Count selected filters for badge
  const selectedFiltersCount = selectedFilters
    ? Object.values(selectedFilters).reduce(
        (count, filter) => count + (Array.isArray(filter) ? filter.length : 0),
        0
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen mt-14">
        {/* Desktop Filters Sidebar - تظهر فقط على الشاشات الكبيرة */}
        {!isMobile && (
          <div className="hidden lg:flex flex-col gap-4 sticky top-8 self-start h-[calc(100vh-4rem)] overflow-y-auto  col-span-1 px-2">
            <SelectedFilters />
            <StaticFilters />
            <DynamicFilters />
          </div>
        )}

        {/* Mobile Filters Overlay - تظهر فقط على الشاشات الصغيرة */}
        <AnimatePresence>
          {isMobile && showMobileFilters && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />

              {/* Filters Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', ease: 'easeInOut' }}
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-40 shadow-xl p-4 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">الفلاتر</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col gap-2 space-y-6">
                  <SelectedFilters />
                  <StaticFilters />
                  <DynamicFilters
                    onShowFilters={() => setShowMobileFilters(false)}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <SearchResults />
        </div>
      </div>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <div
          className="fixed bottom-6 right-6 z-40 flex gap-2"
          style={{ flexDirection: 'row-reverse' }}
        >
          {/* Filters Button */}
          <motion.button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-50"
            aria-label="Toggle Filters"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showMobileFilters ? (
              <FiX className="w-6 h-6" />
            ) : (
              <div className="relative">
                <FiFilter className="w-6 h-6" />
                {selectedFiltersCount > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    {selectedFiltersCount}
                  </motion.span>
                )}
              </div>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default function SearchCategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId?.split('=')[1];
  const category = filterOptions.categories.find(
    (cat) => cat.id.toString() === categoryId
  );

  return (
    <SearchProvider initialCategory={category}>
      <SearchCategoryContent params={params} />
    </SearchProvider>
  );
}
