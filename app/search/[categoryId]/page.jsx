// 'use client';

// import { useCallback, useContext, useEffect, useState } from 'react';
// import { useSearch } from '@/features/search/search-context';
// import SearchResults from '../../../components/Search/SearchResults';
// import StaticFilters from '../../../components/Search/StaticFilters';
// import DynamicFilters from '../../../components/Search/DynamicFilters';
// import SelectedFilters from '../../../components/Search/SelectedFilters';
// import { AnimatePresence, motion } from 'framer-motion';
// import {
//   ChevronDownIcon,
//   FilterIcon,
//   SearchIcon,
//   XIcon,
//   SlidersHorizontalIcon,
// } from 'lucide-react';
// import CategoryFilter from '../../../components/Search/CategoryFilter';
// import { inputsContext } from '@/features/auth/inputs-context';

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
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
//             <SlidersHorizontalIcon className="size-5 text-white" />
//           </div>
//           <div>
//             <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//               فلاتر البحث
//             </h2>
//             <p className="text-xs text-slate-500 mt-1">اضبط بحثك حسب احتياجك</p>
//           </div>
//         </div>
//       )}

//       {/* Selected Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="bg-gradient-to-r from-teal-50 to-blue-50/50 rounded-lg p-4 border border-teal-100/50"
//       >
//         <div className="flex flex-col items-start gap-2 mb-2">
//           {!isMobile && (
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
//                 <SlidersHorizontalIcon className="size-5 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                   فلاتر البحث
//                 </h2>
//                 <p className="text-xs text-slate-500 mt-1">
//                   اضبط بحثك حسب احتياجك
//                 </p>
//               </div>
//             </div>
//           )}
//           <div className="flex items-center justify-start gap-1">
//             <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
//             <h3 className="text-sm font-medium text-teal-800">
//               الفلاتر المحددة ({selected?.length})
//             </h3>
//           </div>
//         </div>
//         <SelectedFilters />
//       </motion.div>

//       {/* Category Filter */}
//       {!category && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
//         >
//           <button
//             onClick={() => toggleSection('category')}
//             className="w-full flex justify-between items-center p-4 hover:bg-slate-50/80 transition-colors duration-200"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//               {/* <h3 className="text-base font-semibold text-slate-700">
//                 التصنيفات
//               </h3> */}
//             </div>
//             <ChevronDownIcon
//               className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
//                 expandedSections.category ? 'rotate-180' : ''
//               }`}
//             />
//           </button>
//           <AnimatePresence>
//             {expandedSections.category && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-4 pb-14">
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
//         className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
//       >
//         <button
//           onClick={() => toggleSection('static')}
//           className="w-full flex justify-between items-center p-4 hover:bg-slate-50/80 transition-colors duration-200"
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
//             <h3 className="text-base font-semibold text-slate-700">
//               الفلاتر الأساسية
//             </h3>
//           </div>
//           <ChevronDownIcon
//             className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
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
//               transition={{ duration: 0.3 }}
//               className="overflow-hidden"
//             >
//               <div className="px-4 pb-4">
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
//           className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
//         >
//           <button
//             onClick={() => toggleSection('dynamic')}
//             className="w-full flex justify-between items-center p-4 hover:bg-slate-50/80 transition-colors duration-200"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
//               <h3 className="text-base font-semibold text-slate-700">
//                 فلاتر إضافية
//               </h3>
//             </div>
//             <ChevronDownIcon
//               className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
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
//                 transition={{ duration: 0.3 }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-4 pb-14">
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
//         className={
//           (isMobile ? `sticky bottom-2` : 'fixed bottom-2') +
//           `  pt-4 bg-gradient-to-t from-white to-transparent min-w-[220px] max-w-[270px]`
//         }
//       >
//         <button
//           onClick={handleSearch}
//           disabled={isSearching}
//           className={
//             'w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-95 font-medium'
//           }
//         >
//           {isSearching ? (
//             <>
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                 className="rounded-full h-4 w-4 border-b-2 border-white"
//               />
//               <span>جاري البحث...</span>
//             </>
//           ) : (
//             <>
//               <SearchIcon className="size-4 transition-transform group-hover:scale-110" />
//               <span>تطبيق الفلاتر و البحث</span>
//             </>
//           )}
//         </button>
//       </motion.div>
//     </div>
//   );
// }

// function SearchCategoryContent() {
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const { selected } = useContext(inputsContext);

//   console.log('selected from category id', selected?.length);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1024);
//       if (window.innerWidth >= 1024) {
//         setShowFilters(true);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen lg:gap-2 pb-8"
//     >
//       <div className="flex justify-center items-start w-full min-h-screen px-2 lg:gap-2 md:mt-64 ">
//         {/* Filters Sidebar */}
//         <main className=" z-50 sticky ">
//           <div className="flex flex-col lg:flex-row w-full h-screen">
//             <div className="lg:sticky z-50 sm:top-4 sm:self-start sm:h-[calc(100vh-2rem)] sm:overflow-y-auto pb-16 sm:pb-0">
//               <AnimatePresence>
//                 {(showFilters || !isMobile) && (
//                   <>
//                     <motion.aside
//                       key="filters-sidebar"
//                       initial={{ x: isMobile ? '100%' : '0%' }}
//                       animate={{ x: 0 }}
//                       exit={{ x: isMobile ? '100%' : '0%' }}
//                       transition={{
//                         type: 'spring',
//                         damping: 25,
//                         stiffness: 300,
//                       }}
//                       className={`
//                         fixed lg:relative inset-0 lg:inset-auto w-72 lg:w-64
//                         h-screen lg:h-auto bg-white lg:bg-transparent z-50
//                         lg:rounded-r-lg overflow-y-auto
//                       `}
//                     >
//                       <div
//                         className="h-full lg:h-auto bg-white lg:bg-gradient-to-b from-white to-slate-50/80 lg:border lg:border-slate-200 lg:shadow-sm lg:rounded-r-lg"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <div className="space-y-6 p-4 h-full">
//                           <FiltersContent
//                             setShowFilters={setShowFilters}
//                             isMobile={isMobile}
//                           />
//                         </div>
//                       </div>
//                     </motion.aside>

//                     {/* الطبقة الرمادية تظهر عند ظهور الفلاتر في وضع الهاتف */}
//                     {isMobile && showFilters && (
//                       <motion.div
//                         key="filters-overlay"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
//                         onClick={() => setShowFilters(false)}
//                       />
//                     )}
//                   </>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </main>

//         {/* Search Results */}
//         <section className="relative flex flex-col justify-s w-full lg:ml-6 sm:mt-0">
//           {/* الزر العائم لفلاتر وضع الهاتف والشاشات الصغيرة */}
//           {isMobile && (
//             <motion.button
//               onClick={() => setShowFilters(!showFilters)}
//               className="lg:hidden sticky top-[80px] left-6 z-30 w-fit bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mr-4"
//               aria-label="Toggle Filters"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               {showFilters ? (
//                 <XIcon className="size-6" />
//               ) : (
//                 <div className="relative">
//                   <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-white shadow-sm font-medium">
//                     {selected?.length || 0}
//                   </span>
//                   <SlidersHorizontalIcon className="size-6" />
//                 </div>
//               )}
//             </motion.button>
//           )}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full"
//           >
//             <div className="p-4 w-full">
//               <div className="flex justify-between items-center mb-6 w-full">
//                 <div>
//                   <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
//                     نتائج البحث
//                   </h1>
//                 </div>
//                 {!isMobile && (
//                   <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="lg:hidden flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors duration-200 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
//                   >
//                     <FilterIcon className="h-4 w-4" />
//                     <span className="text-sm">إظهار/إخفاء الفلاتر</span>
//                   </button>
//                 )}
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
//   return <SearchCategoryContent params={params} />;
// }
'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { useSearch } from '@/features/search/search-context';
import SearchResults from '../../../components/Search/SearchResults';
import StaticFilters from '../../../components/Search/StaticFilters';
import DynamicFilters from '../../../components/Search/DynamicFilters';
import SelectedFilters from '../../../components/Search/SelectedFilters';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
  XIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import CategoryFilter from '../../../components/Search/CategoryFilter';
import { inputsContext } from '@/features/auth/inputs-context';

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
    <div className="relative space-y-4 h-full flex flex-col">
      {/* Header for mobile */}
      {isMobile && (
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl shadow-lg shadow-orange-600/20">
            <SlidersHorizontalIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">فلاتر البحث</h2>
            <p className="text-xs text-neutral-400 mt-1">
              اضبط بحثك حسب احتياجك
            </p>
          </div>
        </div>
      )}

      {/* Selected Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-neutral-800/50 backdrop-blur-xl rounded-2xl p-4 border border-neutral-700/50"
      >
        <div className="flex flex-col items-start gap-2 mb-3">
          {!isMobile && (
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl shadow-lg shadow-orange-600/20">
                <SlidersHorizontalIcon className="size-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">فلاتر البحث</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  اضبط بحثك حسب احتياجك
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-start gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-bold text-neutral-300">
              الفلاتر المحددة ({selected?.length || 0})
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
          className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex justify-between items-center p-4 hover:bg-neutral-800/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <h3 className="text-base font-bold text-white">التصنيفات</h3>
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${
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
                <div className="px-4 pb-4">
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
        className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 overflow-hidden"
      >
        <button
          onClick={() => toggleSection('static')}
          className="w-full flex justify-between items-center p-4 hover:bg-neutral-800/50 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <h3 className="text-base font-bold text-white">الفلاتر الأساسية</h3>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${
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
          className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('dynamic')}
            className="w-full flex justify-between items-center p-4 hover:bg-neutral-800/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <h3 className="text-base font-bold text-white">فلاتر إضافية</h3>
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${
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
                <div className="px-4 pb-4">
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
        className="mt-auto pt-4 pb-2 px-2 rounded-xl sticky bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent"
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
              <SearchIcon className="size-5" />
              <span>تطبيق الفلاتر والبحث</span>
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

      <main className="w-full mx-auto px-4 sm:px-6 py-8 sm:py-12s">
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
                      h-screen lg:h-[calc(100vh-4rem)] lg:bg-transparent z-40
                      overflow-y-auto lg:overflow-visible
                    `}
                  >
                    <div className="h-full lg:h-auto p-4 lg:p-0 space-y-4 bg-neutral-950 lg:bg-transparent">
                      <FiltersContent
                        setShowFilters={setShowFilters}
                        isMobile={isMobile}
                      />
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
                  <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                    نتائج البحث
                  </h1>
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

export default function SearchCategoryPage({ params }) {
  return <SearchCategoryContent params={params} />;
}
