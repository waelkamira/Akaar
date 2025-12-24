'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { useSearch } from '../../../contexts/SearchContext';
import SearchResults from '../../../components/Search/SearchResults';
import StaticFilters from '../../../components/Search/StaticFilters';
import DynamicFilters from '../../../components/Search/DynamicFilters';
import SelectedFilters from '../../../components/Search/SelectedFilters';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchProvider } from '../../../contexts/SearchContext';
import { filterOptions } from '../../../lib/mockData';
import {
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
  XIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import CategoryFilter from '../../../components/Search/CategoryFilter';
import { inputsContext } from '../../../components/authContext/Context';

function FiltersContent({ setShowFilters, isMobile }) {
  const { category, performSearch } = useSearch();
  const [isSearching, setIsSearching] = useState(false);
  const { selected } = useContext(inputsContext);

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
    <div className="relative space-y-6">
      {/* Header for mobile */}
      {isMobile && (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
            <SlidersHorizontalIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              فلاتر البحث
            </h2>
            <p className="text-xs text-slate-500 mt-1">اضبط بحثك حسب احتياجك</p>
          </div>
        </div>
      )}

      {/* Selected Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-teal-50 to-blue-50/50 rounded-lg p-4 border border-teal-100/50"
      >
        <div className="flex flex-col items-start gap-2 mb-2">
          {!isMobile && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
                <SlidersHorizontalIcon className="size-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  فلاتر البحث
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  اضبط بحثك حسب احتياجك
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-start gap-1">
            <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
            <h3 className="text-sm font-medium text-teal-800">
              الفلاتر المحددة ({selected?.length})
            </h3>
          </div>
        </div>
        <SelectedFilters />
      </motion.div>

      {/* Category Filter */}
      {!category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
        >
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex justify-between items-center p-4 hover:bg-slate-50/80 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              {/* <h3 className="text-base font-semibold text-slate-700">
                التصنيفات
              </h3> */}
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
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
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-14">
                  <CategoryFilter />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Static Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
      >
        <button
          onClick={() => toggleSection('static')}
          className="w-full flex justify-between items-center p-4 hover:bg-slate-50/80 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            <h3 className="text-base font-semibold text-slate-700">
              الفلاتر الأساسية
            </h3>
          </div>
          <ChevronDownIcon
            className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
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
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <StaticFilters />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dynamic Filters */}
      {category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
        >
          <button
            onClick={() => toggleSection('dynamic')}
            className="w-full flex justify-between items-center p-4 hover:bg-slate-50/80 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <h3 className="text-base font-semibold text-slate-700">
                فلاتر إضافية
              </h3>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
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
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-14">
                  <DynamicFilters />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Search Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className={
          (isMobile ? `sticky bottom-2` : 'fixed bottom-2') +
          `  pt-4 bg-gradient-to-t from-white to-transparent min-w-[220px] max-w-[270px]`
        }
      >
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className={
            'w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-95 font-medium'
          }
        >
          {isSearching ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="rounded-full h-4 w-4 border-b-2 border-white"
              />
              <span>جاري البحث...</span>
            </>
          ) : (
            <>
              <SearchIcon className="size-4 transition-transform group-hover:scale-110" />
              <span>تطبيق الفلاتر و البحث</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

function SearchCategoryContent() {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { selected } = useContext(inputsContext);

  console.log('selected from category id', selected?.length);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
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
      className="min-h-screen lg:gap-2 pb-8"
    >
      <div className="flex justify-center items-start w-full min-h-screen px-2 lg:gap-2">
        {/* Filters Sidebar */}
        <main className=" z-50 sticky top-0 ">
          <div className="flex flex-col lg:flex-row w-full h-screen">
            <div className="lg:sticky z-50 sm:top-4 sm:self-start sm:h-[calc(100vh-2rem)] sm:overflow-y-auto pb-16 sm:pb-0">
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
                        fixed lg:relative inset-0 lg:inset-auto w-72 lg:w-64
                        h-screen lg:h-auto bg-white lg:bg-transparent z-50
                        lg:rounded-r-lg overflow-y-auto
                      `}
                    >
                      <div
                        className="h-full lg:h-auto bg-white lg:bg-gradient-to-b from-white to-slate-50/80 lg:border lg:border-slate-200 lg:shadow-sm lg:rounded-r-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-6 p-4 h-full">
                          <FiltersContent
                            setShowFilters={setShowFilters}
                            isMobile={isMobile}
                          />
                        </div>
                      </div>
                    </motion.aside>

                    {/* الطبقة الرمادية تظهر عند ظهور الفلاتر في وضع الهاتف */}
                    {isMobile && showFilters && (
                      <motion.div
                        key="filters-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
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
        <section className="relative flex flex-col justify-start w-full lg:ml-6 sm:mt-0">
          {/* الزر العائم لفلاتر وضع الهاتف والشاشات الصغيرة */}
          {isMobile && (
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden sticky top-[80px] left-6 z-30 w-fit bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mr-4"
              aria-label="Toggle Filters"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showFilters ? (
                <XIcon className="size-6" />
              ) : (
                <div className="relative">
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-white shadow-sm font-medium">
                    {selected?.length || 0}
                  </span>
                  <SlidersHorizontalIcon className="size-6" />
                </div>
              )}
            </motion.button>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full"
          >
            <div className="p-4 w-full">
              <div className="flex justify-between items-center mb-6 w-full">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
                    نتائج البحث
                  </h1>
                </div>
                {!isMobile && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors duration-200 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                  >
                    <FilterIcon className="h-4 w-4" />
                    <span className="text-sm">إظهار/إخفاء الفلاتر</span>
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

export default function SearchCategoryPage({ params }) {
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

// 'use client';

// import { useCallback, useContext, useEffect, useState } from 'react';
// import { useSearch } from '../../../contexts/SearchContext';
// import SearchResults from '../../../components/Search/SearchResults';
// import StaticFilters from '../../../components/Search/StaticFilters';
// import DynamicFilters from '../../../components/Search/DynamicFilters';
// import SelectedFilters from '../../../components/Search/SelectedFilters';
// import { AnimatePresence, motion } from 'framer-motion';
// import { SearchProvider } from '../../../contexts/SearchContext';
// import { filterOptions } from '../../../lib/mockData';
// import {
//   ChevronDownIcon,
//   FilterIcon,
//   SearchIcon,
//   XIcon,
//   SparklesIcon,
//   SlidersHorizontalIcon,
// } from 'lucide-react';
// import CategoryFilter from '../../../components/Search/CategoryFilter';
// import { inputsContext } from '../../../components/authContext/Context';

// function FiltersContent({ setShowFilters, isMobile }) {
//   const { category, performSearch } = useSearch();
//   const [isSearching, setIsSearching] = useState(false);
//   const { selected } = useContext(inputsContext);

//   const [expandedSections, setExpandedSections] = useState({
//     category: true,
//     static: true,
//     dynamic: true,
//   });

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const handleSearch = useCallback(async () => {
//     setIsSearching(true);
//     try {
//       await performSearch();
//       if (window.innerWidth < 1024) {
//         setShowFilters(false);
//       }
//     } finally {
//       setIsSearching(false);
//     }
//   }, [performSearch, setShowFilters]);

//   return (
//     <div className="relative space-y-6">
//       {/* Header for mobile */}
//       {isMobile && (
//         <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200/60">
// <div className="flex items-center gap-3">
//   <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
//     <SlidersHorizontalIcon className="size-5 text-white" />
//   </div>
//   <div>
//     <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//       فلاتر البحث
//     </h2>
//     <p className="text-xs text-slate-500 mt-1">
//       اضبط بحثك حسب احتياجك
//     </p>
//   </div>
// </div>
//           <button
//             onClick={() => setShowFilters(false)}
//             className="p-2 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 transition-all duration-300 shadow-sm hover:shadow-md border border-slate-300/30"
//           >
//             <XIcon className="size-5 text-slate-700" />
//           </button>
//         </div>
//       )}

//       {/* Selected Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 rounded-2xl p-5 border border-amber-200/50 shadow-sm relative overflow-hidden"
//       >
//         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full -translate-y-8 translate-x-8"></div>
//         <div className="relative z-10">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-1.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-sm">
//               <SparklesIcon className="size-3.5 text-white" />
//             </div>
//             <h3 className="text-sm font-semibold text-amber-800">
//               الفلاتر المحددة{' '}
//               <span className="text-orange-600">({selected?.length || 0})</span>
//             </h3>
//           </div>
//           <SelectedFilters />
//         </div>
//       </motion.div>

//       {/* Category Filter */}
//       {!category && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className="bg-gradient-to-br from-white to-slate-50/80 rounded-2xl border border-slate-300/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden backdrop-blur-sm"
//         >
//           <button
//             onClick={() => toggleSection('category')}
//             className="w-full flex justify-between items-center p-5 hover:bg-blue-50/50 transition-all duration-300 group"
//           >
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
//                 <div className="size-2 bg-white rounded-full"></div>
//               </div>
//               <div className="text-right">
//                 <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
//                   التصنيفات
//                 </h3>
//                 <p className="text-xs text-slate-500 mt-1">
//                   اختر التصنيف المناسب
//                 </p>
//               </div>
//             </div>
//             <ChevronDownIcon
//               className={`size-5 text-slate-500 transition-all duration-500 ${
//                 expandedSections.category
//                   ? 'rotate-180 text-blue-500'
//                   : 'group-hover:text-blue-500'
//               }`}
//             />
//           </button>
//           <AnimatePresence>
//             {expandedSections.category && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.4, ease: 'easeInOut' }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-5 pb-5">
//                   <CategoryFilter />
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       )}

//       {/* Static Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.2 }}
//         className="bg-gradient-to-br from-white to-slate-50/80 rounded-2xl border border-slate-300/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden backdrop-blur-sm"
//       >
//         <button
//           onClick={() => toggleSection('static')}
//           className="w-full flex justify-between items-center p-5 hover:bg-indigo-50/50 transition-all duration-300 group"
//         >
//           <div className="flex items-center gap-4">
//             <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
//               <div className="size-2 bg-white rounded-full"></div>
//             </div>
//             <div className="text-right">
//               <h3 className="text-base font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors duration-300">
//                 الفلاتر الأساسية
//               </h3>
//               <p className="text-xs text-slate-500 mt-1">
//                 الفلاتر الرئيسية للبحث
//               </p>
//             </div>
//           </div>
//           <ChevronDownIcon
//             className={`size-5 text-slate-500 transition-all duration-500 ${
//               expandedSections.static
//                 ? 'rotate-180 text-indigo-500'
//                 : 'group-hover:text-indigo-500'
//             }`}
//           />
//         </button>
//         <AnimatePresence>
//           {expandedSections.static && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.4, ease: 'easeInOut' }}
//               className="overflow-hidden"
//             >
//               <div className="px-5 pb-5">
//                 <StaticFilters />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       {/* Dynamic Filters */}
//       {category && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.3 }}
//           className="bg-gradient-to-br from-white to-slate-50/80 rounded-2xl border border-slate-300/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden backdrop-blur-sm"
//         >
//           <button
//             onClick={() => toggleSection('dynamic')}
//             className="w-full flex justify-between items-center p-5 hover:bg-purple-50/50 transition-all duration-300 group"
//           >
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
//                 <div className="size-2 bg-white rounded-full"></div>
//               </div>
//               <div className="text-right">
//                 <h3 className="text-base font-semibold text-slate-800 group-hover:text-purple-700 transition-colors duration-300">
//                   فلاتر إضافية
//                 </h3>
//                 <p className="text-xs text-slate-500 mt-1">
//                   فلاتر متقدمة ومتخصصة
//                 </p>
//               </div>
//             </div>
//             <ChevronDownIcon
//               className={`size-5 text-slate-500 transition-all duration-500 ${
//                 expandedSections.dynamic
//                   ? 'rotate-180 text-purple-500'
//                   : 'group-hover:text-purple-500'
//               }`}
//             />
//           </button>
//           <AnimatePresence>
//             {expandedSections.dynamic && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.4, ease: 'easeInOut' }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-5 pb-5">
//                   <DynamicFilters />
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       )}

//       {/* Search Button */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.4 }}
//         className={`${isMobile ? 'sticky bottom-4' : 'fixed bottom-4'} pt-4 bg-gradient-to-t from-white/90 to-transparent backdrop-blur-sm min-w-[240px] max-w-[280px] rounded-2xl`}
//       >
//         <button
//           onClick={handleSearch}
//           disabled={isSearching}
//           className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group relative overflow-hidden"
//         >
//           {isSearching ? (
//             <>
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                 className="rounded-full size-5 border-b-2 border-white"
//               />
//               <span className="relative">جاري البحث...</span>
//             </>
//           ) : (
//             <>
//               <SearchIcon className="size-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 relative" />
//               <span className="relative">تطبيق الفلاتر والبحث</span>
//             </>
//           )}
//         </button>
//       </motion.div>
//     </div>
//   );
// }

// function SearchCategoryContent() {
//   const [isClient, setIsClient] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const { selected } = useContext(inputsContext);

//   useEffect(() => {
//     setIsClient(true);

//     const handleResize = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       if (!mobile) {
//         setShowFilters(true);
//       } else {
//         setShowFilters(false);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // عرض حالة تحميل أثناء التهيئة
//   if (!isClient) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center"
//         >
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//             className="rounded-full size-12 border-b-2 border-indigo-500 mx-auto mb-4"
//           />
//           <p className="text-slate-600">جاري تحميل الفلاتر...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-8"
//     >
//       <div className="flex justify-start items-start w-full min-h-screen px-3 lg:pl-0 lg:pr-3 lg:gap-6">
//         {/* Filters Sidebar - Now positioned on the left */}
//         <div className="flex-shrink-0">
//           <div className="flex flex-col lg:flex-row w-full h-screen">
//             <div className="lg:sticky z-50 top-0 self-end h-[calc(100vh-2rem)] overflow-y-auto pb-16 lg:pb-0">
//               <AnimatePresence>
//                 {(showFilters || !isMobile) && (
//                   <>
//                     <motion.aside
//                       key="filters-sidebar"
//                       transition={{
//                         type: 'spring',
//                         damping: 25,
//                         stiffness: 300,
//                       }}
//                       className={`
//                         fixed lg:relative inset-0 lg:inset-auto w-80 lg:w-72
//                         h-screen lg:h-auto bg-white lg:bg-transparent z-50
//                         lg:rounded-l-lg overflow-y-auto shadow-2xl lg:shadow-sm
//                         ${isMobile ? 'right-0 left-auto' : ''}
//                       `}
//                     >
//                       <div
//                         className="h-full lg:h-auto bg-gradient-to-b from-white to-slate-50/80 lg:border lg:border-slate-300/50 lg:shadow-sm lg:rounded-l-lg lg:mr-3"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <div className="space-y-6 p-5 h-full">
//                           <FiltersContent
//                             setShowFilters={setShowFilters}
//                             isMobile={isMobile}
//                           />
//                         </div>
//                       </div>
//                     </motion.aside>

//                     {/* Overlay for mobile */}
//                     {isMobile && showFilters && (
//                       <motion.div
//                         key="filters-overlay"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
//                         onClick={() => setShowFilters(false)}
//                       />
//                     )}
//                   </>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>

//         {/* Search Results */}
//         <section className="flex-1 flex flex-col min-w-0 lg:mr-3">
//           {/* Floating Filter Button for Mobile - Now on the left */}
//           {isMobile && (
//             <motion.button
//               onClick={() => setShowFilters(!showFilters)}
//               className="lg:hidden sticky top-24 z-30 w-fit bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ml-3 border border-white/20 backdrop-blur-sm"
//               aria-label="Toggle Filters"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               {showFilters ? (
//                 <XIcon className="size-6" />
//               ) : (
//                 <div className="relative">
//                   <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full size-6 flex items-center justify-center border-2 border-white shadow-lg font-bold">
//                     {selected?.length || 0}
//                   </span>
//                   <SlidersHorizontalIcon className="size-6" />
//                 </div>
//               )}
//             </motion.button>
//           )}

//           {/* Desktop Filter Toggle Button */}
//           {/* {!isMobile && (
//             <motion.button
//               onClick={() => setShowFilters(!showFilters)}
//               className="hidden lg:flex items-center gap-3 text-slate-700 hover:text-indigo-600 transition-all duration-300 px-4 py-3 rounded-xl bg-white/80 hover:bg-white shadow-sm hover:shadow-md border border-slate-300/50 backdrop-blur-sm mb-4 w-fit"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <SlidersHorizontalIcon className="size-5" />
//               <span className="text-sm font-medium">
//                 {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
//               </span>
//             </motion.button>
//           )} */}

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-300/50 overflow-hidden flex-1 min-h-[600px]"
//           >
//             <div className="p-6 w-full">
//               <div className="flex justify-between items-center mb-8 w-full">
//                 <div>
//                   <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     نتائج البحث
//                   </h1>
//                   <p className="text-slate-500 mt-2">
//                     اكتشف أفضل النتائج المناسبة لك
//                   </p>
//                 </div>
//               </div>
//               <SearchResults />
//             </div>
//           </motion.div>
//         </section>
//       </div>
//     </motion.div>
//   );
// }

// export default function SearchCategoryPage({ params }) {
//   const categoryId = params.categoryId?.split('=')[1];
//   const category = filterOptions.categories.find(
//     (cat) => cat.id.toString() === categoryId
//   );

//   return (
//     <SearchProvider initialCategory={category}>
//       <SearchCategoryContent params={params} />
//     </SearchProvider>
//   );
// }
