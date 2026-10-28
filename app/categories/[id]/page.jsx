// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
// import SmallCard from '../../../components/ReusableComponents/SmallCard/SmallCard';
// import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
// import Loading from '../../../components/ReusableComponents/Loading';
// import categories from '../../../components/Categories/categories';

// const CategoryPage = () => {
//   const [products, setProducts] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [totalCount, setTotalCount] = useState(0);
//   const searchParams = useSearchParams();
//   const category = searchParams.get('category'); // استخراج قيمة "category"
//   const { id } = useParams();
//   // console.log('id', id);
//   console.log('category', category);

//   useEffect(() => {
//     fetchCategoryProducts();
//   }, [category, id, page]);

//   // find category name function
//   const categoryName = categories?.filter((cat) => cat?.name === category);
//   // console.log('categories', categories);

//   async function fetchCategoryProducts() {
//     if (!hasMore || loading) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`/api/categories/${id}?page=${page}`);
//       if (response.ok) {
//         const json = await response.json();
//         setProducts((prev) =>
//           page === 1 ? json.data : [...prev, ...json.data],
//         ); // تحديث القائمة بشكل تراكمي أو إعادة تعيينها إذا كانت الصفحة الأولى
//         setHasMore(json.hasMore);
//         // console.log('json?.totalCount', json?.totalCount);
//         setTotalCount(json?.totalCount);
//       }
//     } catch (error) {
//       console.error('❌ خطأ أثناء جلب البيانات:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleNextPage = () => {
//     if (hasMore && !loading) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className=" mx-auto w-full lg:max-w-[90%] lg:mt-40 sm:mt-2 p-4 sm:p-0">
//       <div className="flex flex-col items-center">
//         <h1 className="text-lg sm:text-3xl font-bold text-three mb-8 border-b-2 border-primary-500 pb-2 select-none">
//           أحدث إعلانات ال{categoryName[0]?.name}
//         </h1>

//         <div className="w-full xl:w-[85%] space-y-6 my-8">
//           <div className="flex items-center justify-between bg-ak-surface p-4 rounded-lg shadow-sm">
//             <h2 className="text-lg font-medium select-none">
//               عدد الإعلانات الموجودة:
//               <span className="text-green-600 font-bold mx-2">
//                 {totalCount}
//               </span>
//             </h2>
//           </div>

//           {products.length === 0 && <Loading myMessage={'جاري التحميل...'} />}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ">
//             {products.length > 0
//               ? products.map((item) => (
//                   <div
//                     key={item.id}
//                     className="bg-ak-surface rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//                   >
//                     <SmallCard item={item} category={item} />
//                   </div>
//                 ))
//               : !loading && (
//                   <div className="col-span-full text-center py-12 mb-8 bg-ak-surface rounded-lg shadow-md">
//                     <p className="text-ak-muted text-lg">
//                       لا توجد منتجات متاحة
//                     </p>
//                   </div>
//                 )}
//           </div>
//         </div>

//         {hasMore && (
//           <div className="mt-12 mb-8">
//             <button
//               className="group flex items-center gap-3 bg-three hover:bg-two px-8 py-3 rounded-full text-two font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
//               onClick={handleNextPage}
//               disabled={loading}
//             >
//               <span>المزيد من النتائج</span>
//               <MdKeyboardDoubleArrowRight className="text-xl group-hover:translate-x-1 transition-transform text-primary-500" />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
// import SmallCard from '../../../components/ReusableComponents/SmallCard/SmallCard';
// import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
// import Loading from '../../../components/ReusableComponents/Loading';
// import categories from '../../../components/Categories/categories';

// const CategoryPage = () => {
//   const [products, setProducts] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [totalCount, setTotalCount] = useState(0);

//   const searchParams = useSearchParams();
//   const categoryParam = searchParams.get('category');
//   const { id } = useParams();

//   // ✅ التصحيح 1: استخدام find بدلاً من filter للحصول على الكائن مباشرة
//   const currentCategory =
//     categories?.find((cat) => String(cat.id) === String(id)) ||
//     categories?.find(
//       (cat) => cat.name === decodeURIComponent(categoryParam || ''),
//     );

//   const categoryName = currentCategory?.name || 'القسم';

//   // ✅ التصحيح 2: إعادة تعيين الحالة عند تغيير القسم لمنع اختلاط البيانات
//   useEffect(() => {
//     setProducts([]);
//     setPage(1);
//     setHasMore(true);
//     setTotalCount(0);
//   }, [id, categoryParam]);

//   // ✅ التصحيح 3: فصل منطق الجلب مع إضافة isMounted لمنع تحديث المكونات غير النشطة
//   useEffect(() => {
//     if (!id) return;

//     let isMounted = true;

//     const fetchCategoryProducts = async () => {
//       // منع التكرار إذا كان يحمل بالفعل أو لا يوجد المزيد من البيانات
//       if (loading || !hasMore) return;

//       setLoading(true);
//       try {
//         const response = await fetch(`/api/categories/${id}?page=${page}`);
//         if (!response.ok) throw new Error('فشل في جلب البيانات');

//         const json = await response.json();

//         if (isMounted) {
//           setProducts((prev) =>
//             page === 1 ? json.data : [...prev, ...json.data],
//           );
//           setHasMore(json.hasMore);
//           setTotalCount(json?.totalCount || 0);
//         }
//       } catch (error) {
//         console.error('❌ خطأ أثناء جلب البيانات:', error);
//         if (isMounted) setHasMore(false);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchCategoryProducts();

//     // دالة التنظيف لمنع تحديث الحالة إذا غادر المستخدم الصفحة أثناء التحميل
//     return () => {
//       isMounted = false;
//     };
//   }, [id, page]); // الاعتماد فقط على id و page

//   const handleNextPage = () => {
//     if (hasMore && !loading) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="mx-auto w-full lg:max-w-[90%] lg:mt-40 sm:mt-2 p-4 sm:p-0">
//       <div className="flex flex-col items-center">
//         <h1 className="text-lg sm:text-3xl font-bold text-three mb-8 border-b-2 border-primary-500 pb-2 select-none">
//           أحدث إعلانات {categoryName}
//         </h1>

//         <div className="w-full xl:w-[85%] space-y-6 my-8">
//           <div className="flex items-center justify-between bg-ak-surface p-4 rounded-lg shadow-sm">
//             <h2 className="text-lg font-medium select-none">
//               عدد الإعلانات الموجودة:
//               <span className="text-green-600 font-bold mx-2">
//                 {totalCount}
//               </span>
//             </h2>
//           </div>

//           {products.length === 0 && loading && (
//             <Loading myMessage={'جاري التحميل...'} />
//           )}

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
//             {products.length > 0
//               ? products.map((item) => (
//                   <div
//                     key={item.id}
//                     className="bg-ak-surface rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//                   >
//                     {/* ✅ التصحيح 4: تمرير currentCategory بدلاً من item */}
//                     <SmallCard item={item} category={currentCategory} />
//                   </div>
//                 ))
//               : !loading && (
//                   <div className="col-span-full text-center py-12 mb-8 bg-ak-surface rounded-lg shadow-md">
//                     <p className="text-ak-muted text-lg">
//                       لا توجد منتجات متاحة
//                     </p>
//                   </div>
//                 )}
//           </div>
//         </div>

//         {hasMore && products.length > 0 && (
//           <div className="mt-12 mb-8">
//             <button
//               className="group flex items-center gap-3 bg-three hover:bg-two px-8 py-3 rounded-full text-two font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleNextPage}
//               disabled={loading}
//             >
//               <span>{loading ? 'جاري التحميل...' : 'المزيد من النتائج'}</span>
//               {!loading && (
//                 <MdKeyboardDoubleArrowRight className="text-xl group-hover:translate-x-1 transition-transform text-primary-500" />
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SmallCard from '../../../components/ReusableComponents/SmallCard/SmallCard';
import Loading from '../../../components/ReusableComponents/Loading';
import categories from '../../../components/Categories/categories';
import { motion } from 'framer-motion';
import { FaLayerGroup, FaBoxOpen, FaArrowLeft } from 'react-icons/fa6';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { id } = useParams();

  // العثور على الفئة الحالية
  const currentCategory =
    categories?.find((cat) => String(cat.id) === String(id)) ||
    categories?.find((cat) => cat.name === decodeURIComponent(categoryParam || ''));

  const categoryName = currentCategory?.name || 'القسم';

  // إعادة تعيين الحالة عند تغيير القسم
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
  }, [id, categoryParam]);

  // جلب البيانات
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchCategoryProducts = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/categories/${id}?page=${page}`);
        if (!response.ok) throw new Error('فشل في جلب البيانات');

        const json = await response.json();

        if (isMounted) {
          setProducts((prev) => (page === 1 ? json.data : [...prev, ...json.data]));
          setHasMore(json.hasMore);
          setTotalCount(json?.totalCount || 0);
        }
      } catch (error) {
        console.error('❌ خطأ أثناء جلب البيانات:', error);
        if (isMounted) setHasMore(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, [id, page]);

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden " dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          CATEGORY
        </h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-2xl px-6 py-4 shadow-xl">
            <FaLayerGroup className="text-2xl text-orange-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-ak-cream">
              أحدث إعلانات <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">{categoryName}</span>
            </h1>
          </div>
        </motion.div>

        <div className="w-full space-y-8">
          
          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-4 sm:p-5 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FaBoxOpen className="text-xl sm:text-2xl text-emerald-400" />
              </div>
              <span className="text-neutral-300 font-medium text-sm sm:text-base">إجمالي الإعلانات في هذا القسم:</span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{totalCount}</span>
          </motion.div>

          {/* Loading State */}
          {products.length === 0 && loading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl"
            >
              <Loading myMessage="جاري تحميل الإعلانات..." />
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl"
            >
              <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                <FaBoxOpen className="text-4xl text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold text-ak-cream mb-2">لا توجد إعلانات حالياً</h3>
              <p className="text-neutral-400 text-center max-w-md">
                لم يتم إضافة أي إعلانات في قسم <span className="text-orange-400 font-bold">{categoryName}</span> حتى الآن.
              </p>
            </motion.div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((item) => (
                // تمت إزالة الغلاف الأبيض (bg-ak-surface) لأن SmallCard مصمم بالفعل ليدعم الثيم الداكن بشكل جميل
                <SmallCard 
                  key={item.id} 
                  item={item} 
                  category={currentCategory} 
                />
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {hasMore && products.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-12 mb-8"
            >
              <button
                onClick={handleNextPage}
                disabled={loading}
                className="group flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-ak-cream font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-ak-cream" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <span>المزيد من النتائج</span>
                    <MdKeyboardDoubleArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;