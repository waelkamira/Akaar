'use client';
import { SearchProvider, useSearch } from '../../contexts/SearchContext';
import SelectedFilters from '../../components/Search/SelectedFilters';
import CategoryFilter from '../../components/Search/CategoryFilter';
import StaticFilters from '../../components/Search/StaticFilters';
import DynamicFilters from '../../components/Search/DynamicFilters';
import SearchResults from '../../components/Search/SearchResults';
import { useState, useCallback, useEffect } from 'react';
import { FilterIcon, XIcon, SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function FiltersContent({ setShowFilters }) {
  const { category, performSearch } = useSearch();
  const [isSearching, setIsSearching] = useState(false);

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
    <div className="space-y-6 px-2">
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
        >
          <CategoryFilter />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <StaticFilters />
      </motion.div>

      {category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <DynamicFilters />
        </motion.div>
      )}

      <motion.div
        className="p-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-400 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50"
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
  const { performSearch } = useSearch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
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
        {/* Mobile Filters Button - Always visible on mobile */}
        {isMobile && (
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary-500 to-primary-400 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all"
            aria-label="Toggle Filters"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showFilters ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <FilterIcon className="w-6 h-6" />
            )}
          </motion.button>
        )}

        <main className="container mx-auto px-4 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Filters Sidebar */}
            <div className="lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:z-0 pb-16">
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
                        shadow-xl lg:shadow-none overflow-y-auto
                      `}
                    >
                      <div className="p-6 lg:p-0 space-y-6">
                        {/* Mobile Header */}
                        {isMobile && (
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                              الفلاتر
                            </h2>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <XIcon className="w-6 h-6" />
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
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setShowFilters(false)}
                      />
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Search Results */}
            <section className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-6 lg:p-8"
              >
                <SearchResults />
              </motion.div>
            </section>
          </div>
        </main>
      </div>
    </SearchProvider>
  );
}
