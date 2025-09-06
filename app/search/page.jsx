'use client';
import { SearchProvider, useSearch } from '../../contexts/SearchContext';
import SelectedFilters from '../../components/Search/SelectedFilters';
import CategoryFilter from '../../components/Search/CategoryFilter';
import StaticFilters from '../../components/Search/StaticFilters';
import DynamicFilters from '../../components/Search/DynamicFilters';
import SearchResults from '../../components/Search/SearchResults';
import { useState, useCallback, useEffect } from 'react';
import { FilterIcon, XIcon, SearchIcon, ChevronDownIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function FiltersContent({ setShowFilters }) {
  const { category, performSearch } = useSearch();
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    static: true,
    dynamic: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      await performSearch();
      if (window.innerWidth < 1024) {
        setShowFilters(false);
      }
    } finally {
      setIsSearching(false);
    }
  }, [performSearch, setShowFilters]);

  return (
    <div className="space-y-4 px-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SelectedFilters />
      </motion.div>

      {!category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className=" rounded-xl border border-gray-100"
        >
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex justify-between items-center mb-2 ml-2"
          >
            <h3 className="text-lg font-semibold text-gray-800 px-4">
              التصنيفات
            </h3>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expandedSections.category ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSections.category && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <CategoryFilter />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className=" rounded-xl border border-gray-100"
      >
        <button
          onClick={() => toggleSection('static')}
          className="w-full flex justify-between items-center mb-2 ml-2"
        >
          <h3 className="text-lg font-semibold text-gray-800 px-4">
            الفلاتر الأساسية
          </h3>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${
              expandedSections.static ? 'rotate-180' : ''
            }`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.static && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <StaticFilters />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className=" rounded-xl border border-gray-100"
        >
          <button
            onClick={() => toggleSection('dynamic')}
            className="w-full flex justify-between items-center mb-2 ml-2"
          >
            <h3 className="text-lg font-semibold text-gray-800 px-4">
              فلاتر إضافية
            </h3>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expandedSections.dynamic ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSections.dynamic && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <DynamicFilters />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="sticky bottom-0 pb-2"
      >
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 active:scale-95"
        >
          {isSearching ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="rounded-full h-5 w-5 border-b-2 border-white"
              />
              <span>جاري البحث...</span>
            </>
          ) : (
            <>
              <SearchIcon className="h-5 w-5" />
              <span>بحث</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

export default function SearchPage({ searchParams }) {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      // console.log('window.innerWidth', window.innerWidth);
      if (window.innerWidth >= 1024) {
        setShowFilters(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let initialCategory = null;
  if (searchParams.category) {
    try {
      const categoryId = Number.parseInt(searchParams.category);
      initialCategory = { id: categoryId };
    } catch (e) {
      console.error('Error parsing category:', e);
    }
  }

  return (
    <SearchProvider initialCategory={initialCategory}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Floating Action Button for Mobile Filters */}
        {isMobile && (
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all"
            aria-label="Toggle Filters"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showFilters ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <div className="relative">
                <FilterIcon className="w-6 h-6" />
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  3
                </motion.span>
              </div>
            )}
          </motion.button>
        )}

        <main className="container mx-auto px-4 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Filters Sidebar - Always visible on desktop */}
            <div className="lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:z-0 pb-16 lg:pb-4 px-2">
              <AnimatePresence>
                {(showFilters || !isMobile) && (
                  <>
                    <motion.aside
                      key="filters-sidebar"
                      initial={{ x: isMobile ? '100%' : '0%' }}
                      animate={{ x: 0 }}
                      exit={{ x: isMobile ? '100%' : '0%' }}
                      transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 300,
                      }}
                      className={`
                        fixed lg:relative inset-0 lg:inset-auto w-full sm:w-96 lg:w-80
                        h-screen lg:h-auto bg-white lg:bg-transparent z-40
                        rounded-xl lg:border lg:border-gray-200 overflow-y-auto
                      `}
                    >
                      <div className="p-2 space-y-4">
                        {/* Mobile Header */}
                        {isMobile && (
                          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                              الفلاتر المحددة
                            </h2>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <XIcon className="w-6 h-6 text-gray-600" />
                            </button>
                          </div>
                        )}

                        <FiltersContent setShowFilters={setShowFilters} />
                      </div>
                    </motion.aside>

                    {/* Overlay for mobile */}
                    {isMobile && showFilters && (
                      <motion.div
                        key="filters-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setShowFilters(false)}
                      />
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Search Results */}
            <section className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-400">
                      نتائج البحث عن (
                      <span className="text-black">{searchQuery}</span>)
                    </h1>
                    {!isMobile && (
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-primary-600"
                      >
                        <FilterIcon className="h-5 w-5" />
                        <span>الفلاتر</span>
                      </button>
                    )}
                  </div>
                  <SearchResults />
                </div>
              </motion.div>
            </section>
          </div>
        </main>
      </div>
    </SearchProvider>
  );
}
