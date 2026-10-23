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
//           <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
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
//                     className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//                   >
//                     <SmallCard item={item} category={item} />
//                   </div>
//                 ))
//               : !loading && (
//                   <div className="col-span-full text-center py-12 mb-8 bg-white rounded-lg shadow-md">
//                     <p className="text-gray-500 text-lg">
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
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SmallCard from '../../../components/ReusableComponents/SmallCard/SmallCard';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import Loading from '../../../components/ReusableComponents/Loading';
import categories from '../../../components/Categories/categories';

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { id } = useParams();

  // ✅ التصحيح 1: استخدام find بدلاً من filter للحصول على الكائن مباشرة
  const currentCategory =
    categories?.find((cat) => String(cat.id) === String(id)) ||
    categories?.find(
      (cat) => cat.name === decodeURIComponent(categoryParam || ''),
    );

  const categoryName = currentCategory?.name || 'القسم';

  // ✅ التصحيح 2: إعادة تعيين الحالة عند تغيير القسم لمنع اختلاط البيانات
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
  }, [id, categoryParam]);

  // ✅ التصحيح 3: فصل منطق الجلب مع إضافة isMounted لمنع تحديث المكونات غير النشطة
  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchCategoryProducts = async () => {
      // منع التكرار إذا كان يحمل بالفعل أو لا يوجد المزيد من البيانات
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/categories/${id}?page=${page}`);
        if (!response.ok) throw new Error('فشل في جلب البيانات');

        const json = await response.json();

        if (isMounted) {
          setProducts((prev) =>
            page === 1 ? json.data : [...prev, ...json.data],
          );
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

    // دالة التنظيف لمنع تحديث الحالة إذا غادر المستخدم الصفحة أثناء التحميل
    return () => {
      isMounted = false;
    };
  }, [id, page]); // الاعتماد فقط على id و page

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="mx-auto w-full lg:max-w-[90%] lg:mt-40 sm:mt-2 p-4 sm:p-0">
      <div className="flex flex-col items-center">
        <h1 className="text-lg sm:text-3xl font-bold text-three mb-8 border-b-2 border-primary-500 pb-2 select-none">
          أحدث إعلانات {categoryName}
        </h1>

        <div className="w-full xl:w-[85%] space-y-6 my-8">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium select-none">
              عدد الإعلانات الموجودة:
              <span className="text-green-600 font-bold mx-2">
                {totalCount}
              </span>
            </h2>
          </div>

          {products.length === 0 && loading && (
            <Loading myMessage={'جاري التحميل...'} />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.length > 0
              ? products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    {/* ✅ التصحيح 4: تمرير currentCategory بدلاً من item */}
                    <SmallCard item={item} category={currentCategory} />
                  </div>
                ))
              : !loading && (
                  <div className="col-span-full text-center py-12 mb-8 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500 text-lg">
                      لا توجد منتجات متاحة
                    </p>
                  </div>
                )}
          </div>
        </div>

        {hasMore && products.length > 0 && (
          <div className="mt-12 mb-8">
            <button
              className="group flex items-center gap-3 bg-three hover:bg-two px-8 py-3 rounded-full text-two font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNextPage}
              disabled={loading}
            >
              <span>{loading ? 'جاري التحميل...' : 'المزيد من النتائج'}</span>
              {!loading && (
                <MdKeyboardDoubleArrowRight className="text-xl group-hover:translate-x-1 transition-transform text-primary-500" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
