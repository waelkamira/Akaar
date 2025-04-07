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

function SearchCategoryContent({ params }) {
  const { performSearch, loading, selectedFilters } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
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
      className="container mx-auto px-4 py-8 relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block sticky lg:top-8 lg:self-start lg:h-[calc(100vh-4rem)] lg:overflow-y-auto md:flex flex-col gap-4 lg:col-span-1 px-2 mt-12 md:mt-16 xl:mt-0">
          <SelectedFilters />
          <StaticFilters />
          <DynamicFilters />
        </div>

        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {isMobile && showFilters && (
            <>
              <motion.div
                key="filters-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                key="filters-sidebar"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                }}
                className="fixed lg:relative inset-0 lg:inset-auto w-full sm:w-96 lg:w-80
                  h-screen lg:h-auto bg-white lg:bg-transparent z-30
                  rounded-xl lg:border lg:border-gray-200 overflow-y-auto"
              >
                <div className="p-2 space-y-4">
                  {/* Mobile Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      <span className="bg-primary-100 text-primary-800 py-1 px-3 rounded-full text-sm mr-2">
                        {selectedFiltersCount}
                      </span>
                      الفلاتر المحددة
                    </h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <FiX className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 space-y-6">
                    <SelectedFilters />
                    <StaticFilters />
                    <DynamicFilters onShowFilters={setShowFilters} />
                  </div>
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
          className="fixed bottom-6 right-6 z-30 flex gap-2"
          style={{ flexDirection: 'row-reverse' }}
        >
          {/* Filters Button */}
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-gradient-to-r ${
              showFilters
                ? 'from-red-500 to-red-400 hover:from-red-600 hover:to-red-500'
                : 'from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500'
            } text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all`}
            aria-label={showFilters ? 'إغلاق الفلاتر' : 'عرض الفلاتر'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              initial={false}
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showFilters ? (
                <FiX className="w-6 h-6" />
              ) : (
                <div className="relative">
                  <FiFilter className="w-6 h-6" />
                  {selectedFiltersCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center z-50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      {selectedFiltersCount}
                    </motion.span>
                  )}
                </div>
              )}
            </motion.div>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default function SearchCategoryPage(props) {
  const params = use(props.params);
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
