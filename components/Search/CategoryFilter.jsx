// 'use client';

// import { useSearch } from '@/features/search/search-context';
// import { useEffect } from 'react';
// import categories from '../Categories/categories';
// import { ChevronLeft } from 'lucide-react';

// export default function CategoryFilter() {
//   const { category, setCategory } = useSearch();

//   // Handle category selection
//   const handleCategoryChange = (selectedCategory) => {
//     // If clicking the already selected category, deselect it
//     if (category && selectedCategory && category.id === selectedCategory?.id) {
//       setCategory(null);
//       localStorage.removeItem('category');
//     } else {
//       // Update category in context with the full category object
//       setCategory(selectedCategory);

//       // Save to localStorage for persistence
//       if (selectedCategory) {
//         localStorage.setItem('category', JSON.stringify(selectedCategory));
//       } else {
//         localStorage.removeItem('category');
//       }
//     }
//     // Remove automatic search trigger
//     // performSearch();
//   };

//   // Load category from localStorage on mount
//   useEffect(() => {
//     const storedCategory = localStorage.getItem('category');
//     if (storedCategory && !category) {
//       try {
//         const parsedCategory = JSON.parse(storedCategory);
//         setCategory(parsedCategory);
//       } catch (error) {
//         console.error('Error parsing stored category:', error);
//         localStorage.removeItem('category');
//       }
//     }
//   }, [category, setCategory]);

//   // The selected category is directly from the context
//   const selectedCategory = category;

//   return (
//     <div className="bg-white p-2 rounded-lg shadow-sm mb-4 text-lg">
//       <h2 className="font-medium mb-3">اختر فئة</h2>

//       <div className="space-y-2">
//         {/* Always show the "All Categories" option */}
//         <div className="flex items-center">
//           <input
//             id="category-all"
//             type="checkbox"
//             checked={!category}
//             onChange={() => handleCategoryChange(null)}
//             className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
//           />
//           <label htmlFor="category-all" className="mr-2">
//             كل الفئات
//           </label>
//         </div>

//         {/* Show only the selected category if one is selected */}
//         {selectedCategory ? (
//           <div className="flex items-center">
//             <input
//               id={`category-${selectedCategory?.id}`}
//               type="checkbox"
//               checked={true}
//               onChange={() => {}} // No need to handle change here
//               className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 border"
//             />
//             <label
//               htmlFor={`category-${selectedCategory?.id}`}
//               className="mr-2 flex items-center"
//             >
//               <span className="mr-1">{selectedCategory?.icon}</span>
//               {selectedCategory?.name}
//             </label>
//           </div>
//         ) : (
//           // If no category is selected, show all categories
//           categories?.map((cat) => (
//             <div
//               key={cat?.id}
//               className="flex items-center p-2 hover:scale-105 border border-gray-100 hover:shadow-md hover:border-green-400 rounded-lg m-2 transition-all ease-in-out duration-300 hover:cursor-pointer"
//               onClick={() => handleCategoryChange(cat)}
//             >
//               <input
//                 id={`category-${cat?.id}`}
//                 type="checkbox"
//                 checked={category && category.id === cat?.id}
//                 onChange={() => handleCategoryChange(cat)}
//                 className="h-4 w-4 text-primary-500 focus:ring-primary-500 hover:cursor-pointer"
//               />
//               <label
//                 htmlFor={`category-${cat?.id}`}
//                 className="mr-2 flex items-center text-sm"
//               >
//                 <span className="mx-1 text-primary-400">{cat?.icon}</span>
//                 {cat?.name}
//               </label>
//             </div>
//           ))
//         )}

//         {/* If a category is selected, show a button to view all categories */}
//         {selectedCategory && (
//           <button
//             onClick={() => handleCategoryChange(null)}
//             className="text-primary-500 hover:text-blue-800 flex items-center mt-2"
//           >
//             <ChevronLeft size={16} className="mr-1" />
//             عرض جميع الفئات
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useRouter } from 'next/navigation';
// import { useCallback, useMemo } from 'react';
// import categories from '../Categories/categories';
// import { FaHome } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import { cn } from '../lib/utils';
// import { useSearch } from '@/features/search/search-context';
// import { serializeCategory } from '../Categories/serializeCategory';

// const CategoryCard = ({
//   item,
//   selected,
//   onClick,
// }) => {
//   return (
//     <motion.button
//       type="button"
//       onClick={onClick}
//       aria-pressed={selected}
//       whileTap={{ scale: 0.97 }}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.25 }}
//       className={cn(
//         'group relative isolate flex flex-col justify-center items-center w-full min-w-0 gap-3',
//         'overflow-hidden rounded-2xl border p-3 text-right',
//         'transition-colors duration-300',
//         'focus-visible:outline-none focus-visible:ring-2',
//         'focus-visible:ring-orange-500 focus-visible:ring-offset-2',
//         'focus-visible:ring-offset-neutral-950',
//         selected
//           ? 'border-[#C99B70]/50 bg-[#C99B70]/10'
//           : 'border-white/[0.07] bg-white/[0.025] hover:border-[#C99B70]/30 hover:bg-white/[0.055]'
//       )}
//     >
//       {/* Active glow */}
//       <AnimatePresence>
//         {selected && (
//           <motion.div
//             layoutId="category-active-glow"
//             className="absolute inset-0 -z-10 bg-gradient-to-l from-orange-500/15 via-orange-500/[0.04] to-transparent"
//             transition={{
//               type: 'spring',
//               stiffness: 300,
//               damping: 30,
//             }}
//           />
//         )}
//       </AnimatePresence>

//       {/* Icon */}
//       <div
//         className={cn(
//           'relative flex h-12 w-12 shrink-0 items-center justify-center',
//           'rounded-xl border transition-all duration-300',
//           selected
//             ? 'border-orange-400/30 bg-gradient-to-br from-[#C99B70] to-[#A8754D] text-white shadow-lg shadow-orange-500/20'
//             : 'border-white/[0.06] bg-neutral-900 text-neutral-400 group-hover:border-[#C99B70]/30 group-hover:text-[#D9B18C]'
//         )}
//       >
//         <span className="text-xl">
//           {item?.icon || <FaHome />}
//         </span>
//       </div>

//       {/* Category name */}
//       <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
//         <span
//           className={cn(
//             'w-full truncate text-sm font-bold transition-colors',
//             selected
//               ? 'text-white'
//               : 'text-neutral-300 group-hover:text-white'
//           )}
//         >
//           {item?.name}
//         </span>

//       </div>

//       {/* Active indicator */}
//       <div
//         className={cn(
//           'h-2 w-2 shrink-0 rounded-full transition-all duration-300',
//           selected
//             ? 'bg-[#D9B18C] shadow-[0_0_10px_rgba(251,146,60,0.65)]'
//             : 'bg-neutral-800 group-hover:bg-[#C99B70]/50'
//         )}
//       />
//     </motion.button>
//   );
// };

// const CategoriesNavBar = () => {
//   const router = useRouter();
//   const { category, setCategory, performSearch } = useSearch();

//   const selectedCategory = useMemo(
//     () => categories?.find((item) => item.id === category?.id) || null,
//     [category]
//   );

//   const handleCategoryClick = useCallback(
//     (item) => {
//       setCategory(item);

//       try {
//         localStorage.setItem(
//           'category',
//           serializeCategory(item)
//         );
//       } catch {
//         // Storage may be unavailable in private browsing.
//       }

//       router.push(`/search?categoryId=${encodeURIComponent(item.id)}`);
//       performSearch();
//     },
//     [setCategory, router, performSearch]
//   );

//   return (
//     <section
//       dir="rtl"
//       aria-label="تصفح الأقسام"
//       className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-neutral-950/90 backdrop-blur-2xl"
//     >
//       <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-5 flex items-center justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#C99B70] to-[#A8754D]" />

//             <div>
//               <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
//                 تصفح الأقسام
//               </h2>

//               <p className="mt-1 text-xs text-neutral-500">
//                 اكتشف ما تبحث عنه بسهولة
//               </p>
//             </div>
//           </div>

//           <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-2 sm:flex">
//             <span className="h-1.5 w-1.5 rounded-full bg-[#D9B18C]" />
//             <span className="text-xs text-neutral-400">
//               {categories?.length || 0} قسم
//             </span>
//           </div>
//         </div>

//         {/* Categories grid */}
//         <div className="grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ">
//           {categories?.map((item, index) => (
//             <motion.div
//               key={item.id}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 duration: 0.25,
//                 delay: Math.min(index * 0.035, 0.3),
//               }}
//             >
//               <CategoryCard
//                 item={item}
//                 selected={selectedCategory?.id === item.id}
//                 onClick={() => handleCategoryClick(item)}
//               />
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CategoriesNavBar;

'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import categories from '../Categories/categories';
import { FaHome } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSearch } from '@/features/search/search-context';
import { serializeCategory } from '../Categories/serializeCategory';

const CategoryCard = ({ item, selected, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative isolate flex w-full min-w-0',
        'min-h-[118px] flex-col items-center justify-center gap-3',
        'overflow-hidden rounded-xl border p-4 text-right',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-orange-300 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[#54251c]',
        selected
          ? 'border-orange-200/70 bg-[#ffb17c]/20 shadow-lg shadow-black/10'
          : 'border-white/15 bg-white/[0.055] hover:border-orange-200/50 hover:bg-white/[0.11]'
      )}
    >
      {/* خلفية متوهجة للقسم المحدد */}
      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId="category-active-glow"
            className="absolute inset-0 -z-10 bg-gradient-to-br from-[#C99B70]/25 via-[#C99B70]/10 to-transparent"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          />
        )}
      </AnimatePresence>

      {/* زخرفة هندسية مستوحاة من التصميم المرجعي */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -bottom-8 -left-5',
          'h-20 w-20 rounded-full border',
          'border-white/[0.07] transition-transform duration-500',
          'group-hover:scale-125'
        )}
      />

      {/* أيقونة القسم */}
      <div
        className={cn(
          'relative flex h-12 w-12 shrink-0 items-center justify-center',
          'rounded-xl border transition-all duration-300',
          selected
            ? 'border-white/40 bg-gradient-to-br from-[#ffb06e] to-[#e85c25] text-white shadow-lg shadow-orange-950/20'
            : 'border-white/15 bg-[#572b21]/40 text-[#E5C5A5] group-hover:border-orange-200/50 group-hover:bg-[#a8492b]/50 group-hover:text-white'
        )}
      >
        <span className="text-xl">
          {item?.icon || <FaHome />}
        </span>
      </div>

      {/* اسم القسم */}
      <div className="relative flex min-w-0 w-full flex-col items-center gap-1">
        <span
          className={cn(
            'w-full text-center text-[10px] font-bold',
            'transition-colors duration-300',
            selected
              ? 'text-white'
              : 'text-[#E5C5A5]/85 group-hover:text-white'
          )}
        >
          {item?.name}
        </span>

        <span
          className={cn(
            'h-px transition-all duration-300',
            selected
              ? 'w-10 bg-[#D9B18C]'
              : 'w-0 bg-[#D9B18C] group-hover:w-8'
          )}
        />
      </div>

      {/* مؤشر الاختيار */}
      <span
        className={cn(
          'absolute right-2 top-2 h-1.5 w-1.5 rounded-full',
          'transition-all duration-300',
          selected
            ? 'bg-[#D9B18C] shadow-[0_0_9px_rgba(255,207,157,0.9)]'
            : 'bg-white/15 group-hover:bg-[#D9B18C]/70'
        )}
      />
    </motion.button>
  );
};

const CategoriesNavBar = () => {
  const router = useRouter();
  const { category, setCategory, performSearch } = useSearch();

  const selectedCategory = useMemo(
    () => categories?.find((item) => item.id === category?.id) || null,
    [category]
  );

  const handleCategoryClick = useCallback(
    (item) => {
      setCategory(item);

      try {
        localStorage.setItem(
          'category',
          serializeCategory(item)
        );
      } catch {
        // Storage may be unavailable in private browsing.
      }

      router.push(
        `/search?categoryId=${encodeURIComponent(item.id)}`
      );

      performSearch();
    },
    [setCategory, router, performSearch]
  );

  return (
    <section
      dir="rtl"
      aria-label="تصفح الأقسام"
      className={cn(
        'sticky top-0 z-40 w-full overflow-hidden',
        'border-b border-white/10',
        'bg-gradient-to-br from-[#e97842] via-[#a94e31] to-[#54291f]',
        'text-white shadow-xl shadow-black/10'
      )}
    >
      {/* توهجات زخرفية في الخلفية */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-300/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 left-0 h-72 w-72 rounded-full bg-[#351b19]/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* رأس الأقسام */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-11 w-1 shrink-0 rounded-full bg-gradient-to-b from-orange-100 to-orange-300/30" />

            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-tight text-white sm:text-xl">
                تصفح الأقسام
              </h2>

              <p className="mt-1 text-xs text-[#E5C5A5]/75 sm:text-sm">
                اكتشف ما تبحث عنه بسهولة
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/[0.10] px-3 py-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D9B18C] shadow-[0_0_8px_rgba(255,220,180,0.7)]" />

            <span className="text-xs font-medium text-[#E5C5A5]/90">
              {categories?.length || 0} قسم
            </span>
          </div>
        </div>

        {/* شبكة الأقسام: حافظنا على توزيع الأعمدة الأصلي */}
        <div className="grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
          {categories?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.035, 0.3),
              }}
            >
              <CategoryCard
                item={item}
                selected={selectedCategory?.id === item.id}
                onClick={() => handleCategoryClick(item)}
              />
            </motion.div>
          ))}
        </div>

        {/* تذييل بسيط */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[10px] font-medium tracking-[0.18em] text-[#E5C5A5]/50">
            DISCOVER YOUR CATEGORY
          </span>

          <span className="text-xs text-orange-50/60">
            {selectedCategory?.name || 'اختر قسماً للبدء'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CategoriesNavBar;
