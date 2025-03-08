'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SmallCard from '../../../components/ReusableComponents/SmallCard';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import Loading from '../../../components/ReusableComponents/Loading';
import { toInteger } from 'lodash';

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const searchParams = useSearchParams();
  const category = searchParams.get('category'); // استخراج قيمة "category"
  const { id } = useParams();
  // console.log('category', category);

  useEffect(() => {
    fetchCategoryProducts();
  }, [category, id, pageNumber]);

  async function fetchCategoryProducts() {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/categories/${id}?page=${pageNumber}`);
      if (response.ok) {
        const json = await response.json();
        setProducts((prev) =>
          pageNumber === 1 ? json.data : [...prev, ...json.data]
        ); // تحديث القائمة بشكل تراكمي أو إعادة تعيينها إذا كانت الصفحة الأولى
        setHasMore(json.hasMore);
        console.log('json?.totalCount', json?.totalCount);
        setTotalCount(json?.totalCount);
      }
    } catch (error) {
      console.error('❌ خطأ أثناء جلب البيانات:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center z-0 w-full bg-five mt-44">
      <div className="w-full">
        {/* <div className="p-2 bg-three">
          <button
            className="flex justify-center items-center rounded-[5px] sm:text-lg text-sm bg-one text-white h-12 w-full hover:scale-105 transition-transform"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? 'إخفاء فلاتر البحث' : 'عرض فلاتر البحث'}
          </button>
        </div> */}

        {/* {showSearch && <CategoriesProductsSearchBar />} */}

        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="w-full text-center sm:text-lg my-4">أحدث الإعلانات</h1>
          <div className="flex flex-col justify-center items-center w-full xl:w-[70%]">
            {' '}
            <h1 className="w-full text-start sm:text-lg my-4">
              {' '}
              عدد الإعلانات الموجودة:
              <span className="px-2 text-green-600"> {totalCount}</span>{' '}
            </h1>
            {loading && pageNumber === 1 && <Loading />}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full ">
              {products.length > 0
                ? products.map((item) => (
                    <div
                      key={item.id}
                      className="border p-4 rounded-lg shadow-md"
                    >
                      <SmallCard item={item} />
                    </div>
                  ))
                : !loading && (
                    <p className="text-center text-gray-500">
                      لا توجد منتجات متاحة
                    </p>
                  )}
            </div>
          </div>

          {/* أزرار التنقل بين الصفحات */}
          <div className="flex items-center justify-around my-16 w-full">
            {hasMore && (
              <button
                className="flex items-center justify-center gap-2 py-2 px-6 bg-three text-white rounded-[5px] hover:bg-two transition-colors shadow-md"
                onClick={handleNextPage}
                disabled={loading}
              >
                المزيد من النتائج{' '}
                <MdKeyboardDoubleArrowRight className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
