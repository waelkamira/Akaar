// 'use client';
// import { useSearch } from '@/features/search/search-context';
// import SelectedFilters from '../../components/Search/SelectedFilters';
// import CategoryFilter from '../../components/Search/CategoryFilter';
// import StaticFilters from '../../components/Search/StaticFilters';
// import DynamicFilters from '../../components/Search/DynamicFilters';
// import SearchResults from '../../components/Search/SearchResults';
// import { useState, useCallback, useEffect, useContext } from 'react';
// import {
//   FilterIcon,
//   XIcon,
//   SearchIcon,
//   ChevronDownIcon,
//   SlidersHorizontalIcon,
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { inputsContext } from '@/features/auth/inputs-context';

// function FiltersContent({ setShowFilters }) {
//   const { category, performSearch } = useSearch();
//   const [isSearching, setIsSearching] = useState(false);
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
//     <div>
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <SelectedFilters />
//       </motion.div>

//       {!category && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className=" rounded-lg border border-gray-100"
//         >
//           {/* <button
//             onClick={() => toggleSection('category')}
//             className="w-full flex justify-between items-center mb-2 ml-2"
//           >
//             <h3 className="text-lg font-semibold px-4">التصنيفات</h3>
//             <ChevronDownIcon
//               className={`h-5 w-5 text-gray-500 transition-transform ${
//                 expandedSections.category ? 'rotate-180' : ''
//               }`}
//             />
//           </button> */}
//           <AnimatePresence>
//             {expandedSections.category && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="overflow-hidden"
//               >
//                 <CategoryFilter />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.2 }}
//         className=" rounded-lg border border-gray-100"
//       >
//         <button
//           onClick={() => toggleSection('static')}
//           className="w-full flex justify-between items-center mb-2 ml-2"
//         >
//           <h3 className="text-lg font-semibold px-4">الفلاتر الأساسية</h3>
//           <ChevronDownIcon
//             className={`h-5 w-5 text-gray-500 transition-transform ${
//               expandedSections.static ? 'rotate-180' : ''
//             }`}
//           />
//         </button>
//         <AnimatePresence>
//           {expandedSections.static && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="overflow-hidden"
//             >
//               <StaticFilters />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       {category && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.3 }}
//           className=" rounded-lg border border-gray-100"
//         >
//           <button
//             onClick={() => toggleSection('dynamic')}
//             className="w-full flex justify-between items-center mb-2 ml-2"
//           >
//             <h3 className="text-lg font-semibold text-white px-4">
//               فلاتر إضافية
//             </h3>
//             <ChevronDownIcon
//               className={`h-5 w-5 text-gray-500 transition-transform ${
//                 expandedSections.dynamic ? 'rotate-180' : ''
//               }`}
//             />
//           </button>
//           <AnimatePresence>
//             {expandedSections.dynamic && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="overflow-hidden"
//               >
//                 <DynamicFilters />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.4 }}
//         className="sticky bottom-0 pb-2"
//       >
//         <button
//           onClick={handleSearch}
//           disabled={isSearching}
//           className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 active:scale-95"
//         >
//           {isSearching ? (
//             <>
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                 className="rounded-full h-5 w-5 border-b-2 border-white"
//               />
//               <span>جاري البحث...</span>
//             </>
//           ) : (
//             <>
//               <SearchIcon className="h-5 w-5" />
//               <span>تطبيق الفلاتر و البحث</span>
//             </>
//           )}
//         </button>
//       </motion.div>
//     </div>
//   );
// }
// export default function SearchPage() {
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const { searchQuery } = useSearch();
//   const { selected } = useContext(inputsContext);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1024);
//       // console.log('window.innerWidth', window.innerWidth);
//       if (window.innerWidth >= 1024) {
//         setShowFilters(true);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-brown-100 to-brown-200 relative mt-60">
//       <main className=" mx-auto px-4 py-8 w-full mt-64 sm:mt-0">
//         <div className="flex flex-col lg:flex-row gap-2 w-full">
//           {/* Filters Sidebar - Always visible on desktop */}
//           <div className="pb-8 z-50 sticky top-0">
//             <AnimatePresence>
//               {(showFilters || !isMobile) && (
//                 <>
//                   <motion.aside
//                     key="filters-sidebar"
//                     initial={{ x: isMobile ? '100%' : '0%' }}
//                     animate={{ x: 0 }}
//                     exit={{ x: isMobile ? '100%' : '0%' }}
//                     transition={{
//                       type: 'spring',
//                       damping: 25,
//                       stiffness: 300,
//                     }}
//                     className={`
//                         fixed lg:sticky top inset-0 lg:inset-auto w-72
//                         h-screen lg:h-auto lg:bg-transparent z-40
//                         rounded-lg lg:border lg:border-gray-200 overflow-y-auto
//                       `}
//                   >
//                     <div className="z-50 sticky top-0 p-2 space-y-4 bg-white">
//                       {/* Mobile Header */}
//                       {isMobile && (
//                         <div className="flex justify-between items-center pb-4 border-b border-gray-200">
//                           <h2 className="text-xl font-bold text-gray-900">
//                             {selected?.length} الفلاتر المحددة
//                           </h2>
//                           <button
//                             onClick={() => setShowFilters(false)}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//                           >
//                             <XIcon className="w-6 h-6 text-gray-600" />
//                           </button>
//                         </div>
//                       )}

//                       <FiltersContent setShowFilters={setShowFilters} />
//                     </div>
//                   </motion.aside>

//                   {/* Overlay for mobile */}
//                   {isMobile && showFilters && (
//                     <motion.div
//                       key="filters-overlay"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
//                       onClick={() => setShowFilters(false)}
//                     />
//                   )}
//                 </>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Search Results */}
//           <section className="relative flex flex-col w-full lg:ml-6 sm:mt-0">
//             {/* الزر العائم لفلاتر وضع الهاتف والشاشات الصغيرة */}
//             {isMobile && (
//               <motion.button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="lg:hidden sticky top-[80px] left-6 z-30 w-fit bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mr-4"
//                 aria-label="Toggle Filters"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 {showFilters ? (
//                   <XIcon className="size-6" />
//                 ) : (
//                   <div className="relative">
//                     <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-white shadow-sm font-medium">
//                       {selected?.length || 0}
//                     </span>
//                     <SlidersHorizontalIcon className="size-6" />
//                   </div>
//                 )}
//               </motion.button>
//             )}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className=" rounded-lg shadow-sm border border-gray-200 overflow-hidden"
//             >
//               <div className="p-2 lg:p-4">
//                 <div className="flex justify-between items-center mb-6">
//                   {searchQuery && (
//                     <h1 className="text-2xl font-bold text-gray-400">
//                       نتائج البحث عن (
//                       <span className="text-black">{searchQuery}</span>)
//                     </h1>
//                   )}
//                   {!isMobile && (
//                     <button
//                       onClick={() => setShowFilters(!showFilters)}
//                       className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-primary-600"
//                     >
//                       <FilterIcon className="h-5 w-5" />
//                       <span>الفلاتر</span>
//                     </button>
//                   )}
//                 </div>
//                 <SearchResults />
//               </div>
//             </motion.div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';

import { useSearch } from '@/features/search/search-context';
import SelectedFilters from '../../components/Search/SelectedFilters';
import CategoryFilter from '../../components/Search/CategoryFilter';
import StaticFilters from '../../components/Search/StaticFilters';
import DynamicFilters from '../../components/Search/DynamicFilters';
import SearchResults from '../../components/Search/SearchResults';
import { useState, useCallback, useEffect, useContext } from 'react';
import {
  FilterIcon,
  XIcon,
  SearchIcon,
  ChevronDownIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inputsContext } from '@/features/auth/inputs-context';

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
    <div className="space-y-4">
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
          className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl overflow-hidden"
        >
          <AnimatePresence>
            {expandedSections.category && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden p-4"
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
        className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl overflow-hidden"
      >
        <button
          onClick={() => toggleSection('static')}
          className="w-full flex justify-between items-center p-4 hover:bg-neutral-800/50 transition-colors"
        >
          <h3 className="text-lg font-bold text-white">الفلاتر الأساسية</h3>
          <ChevronDownIcon
            className={`h-5 w-5 text-neutral-400 transition-transform duration-200 ${
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
              className="overflow-hidden px-4 pb-4"
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
          className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl overflow-hidden"
        >
          <button
            onClick={() => toggleSection('dynamic')}
            className="w-full flex justify-between items-center p-4 hover:bg-neutral-800/50 transition-colors"
          >
            <h3 className="text-lg font-bold text-white">فلاتر إضافية</h3>
            <ChevronDownIcon
              className={`h-5 w-5 text-neutral-400 transition-transform duration-200 ${
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
                className="overflow-hidden px-4 pb-4"
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
        className="sticky bottom-0 pt-2 pb-4"
      >
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
              <span>تطبيق الفلاتر والبحث</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { searchQuery } = useSearch();
  const { selected } = useContext(inputsContext);

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
    <div
      className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden mt-60"
      dir="rtl"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          SEARCH
        </h1>
      </div>

      <main className="w-full  mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Filters Sidebar */}
          <div className="pb-8 z-50">
            <AnimatePresence>
              {(showFilters || !isMobile) && (
                <>
                  <motion.aside
                    key="filters-sidebar"
                    initial={{ x: isMobile ? '100%' : '0%' }}
                    animate={{ x: 0 }}
                    exit={{ x: isMobile ? '100%' : '0%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`
                      fixed lg:sticky top-0 inset-0 lg:inset-auto w-full lg:w-80
                      h-screen lg:h-auto lg:bg-transparent z-40
                      overflow-y-auto lg:overflow-visible
                    `}
                  >
                    <div className="h-full lg:h-auto p-4 lg:p-0 space-y-4 bg-neutral-950 lg:bg-transparent">
                      {/* Mobile Header */}
                      {isMobile && (
                        <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-4">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FilterIcon className="w-5 h-5 text-orange-500" />
                            <span>{selected?.length || 0} فلاتر محددة</span>
                          </h2>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="p-2 hover:bg-neutral-800 rounded-full transition-colors duration-200"
                          >
                            <XIcon className="w-6 h-6 text-neutral-400 hover:text-white" />
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
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                      onClick={() => setShowFilters(false)}
                    />
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Search Results */}
          <section className="relative flex flex-col w-full">
            {/* Floating Filter Button for Mobile */}
            {isMobile && (
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden fixed bottom-6 left-6 z-30 bg-gradient-to-r from-orange-600 to-amber-600 text-white p-4 rounded-full shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 transition-all duration-300"
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
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-neutral-900 shadow-sm font-bold">
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
              className="rounded-3xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50"
            >
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  {searchQuery && (
                    <h1 className="text-2xl font-bold text-neutral-400">
                      نتائج البحث عن{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                        "{searchQuery}"
                      </span>
                    </h1>
                  )}
                  {!searchQuery && (
                    <h1 className="text-2xl font-bold text-white">
                      جميع الإعلانات
                    </h1>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <SearchResults />
                </motion.div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
