'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearch } from '../../../contexts/SearchContext';
import SearchResults from '../../../components/Search/SearchResults';
import StaticFilters from '../../../components/Search/StaticFilters';
import DynamicFilters from '../../../components/Search/DynamicFilters';
import SelectedFilters from '../../../components/Search/SelectedFilters';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchProvider } from '../../../contexts/SearchContext';
import { filterOptions } from '../../../lib/mockData';
import { ChevronDownIcon, FilterIcon, SearchIcon, XIcon } from 'lucide-react';
import CategoryFilter from '../../../components/Search/CategoryFilter';

function SearchCategoryContent({ params }) {
  const { performSearch, loading } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Trigger search when the page loads
    performSearch();
  }, [performSearch]);

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-8"
    >
      {/* الزر العائم لفلاتر وضع الهاتف والشاشات الصغيرة */}
      {isMobile && (
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-primary-400 z-30 hover:from-primary-600 hover:to-primary-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all "
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
            </div>
          )}
        </motion.button>
      )}
      <div className="flex justify-center items-start w-full min-h-screen ">
        {/* Filters Sidebar */}
        <main className=" pb-8 z-50 sticky top-0">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="lg:sticky z-50 sm:top-4 sm:self-start sm:h-[calc(100vh-2rem)] sm:overflow-y-auto pb-16 sm:pb-0 bg-white">
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
                      onClick={() => setShowFilters(false)}
                      className={`
                        fixed sm:block lg:relative inset-0 lg:inset-auto w-72 sm-w-96 lg:w-72
                        h-screen lg:h-auto bg-black/20 lg:bg-transparent z-50
                        lg:rounded-xl overflow-y-auto
                      `}
                    >
                      <div className="space-y-4 w-full">
                        {/* رندرت الفلاتر */}
                        <FiltersContent setShowFilters={setShowFilters} />
                      </div>
                    </motion.aside>
                    <div className="hidden lg:block ">
                      <FiltersContent setShowFilters={setShowFilters} />
                    </div>

                    {/*  الطبقة الرمادية تظهر عند ظهور الفلاتر في وضع الهاتف*/}
                    {isMobile && showFilters && (
                      <motion.div
                        key="filters-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
                        onClick={() => setShowFilters(false)}
                      />
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Search Results */}
        <section className="flex-1  w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full"
          >
            <div className="p-6 lg:p-8 w-full">
              <div className="flex justify-between items-center mb-6 w-full">
                <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                  نتائج البحث
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
    </motion.div>
  );
}

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
    <div
      className="absolute sm:block right-0 space-y-4 px-2 z-50 bg-white lg:rounded-xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex lg:hidden justify-between items-center pb-4 bg-white ">
        <button
          onClick={() => setShowFilters(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <XIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
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
        className=" rounded-xl border border-gray-100 "
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
      {/*  زر البحث  */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="sticky bottom-0"
      >
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 active:scale-95"
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
export default function SearchCategoryPage({ params }) {
  // Extract categoryId from params
  const categoryId = params.categoryId?.split('=')[1];

  // Find the full category object
  const category = filterOptions.categories.find(
    (cat) => cat.id.toString() === categoryId
  );

  return (
    <SearchProvider initialCategory={category}>
      <SearchCategoryContent params={params} />
    </SearchProvider>
  );
}
