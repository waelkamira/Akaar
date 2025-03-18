'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SmallCard from '../../../components/ReusableComponents/SmallCard';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import Loading from '../../../components/ReusableComponents/Loading';

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
    <div className=" mx-auto w-full lg:max-w-[90%] mt-40 sm:mt-2 p-4 sm:p-0">
      <div className="flex flex-col items-center">
        <h1 className="text-lg sm:text-3xl font-bold text-three mb-8 border-b-2 border-one pb-2 select-none">
          أحدث إعلانات ال{category}
        </h1>

        <div className="w-full xl:w-[70%] space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium select-none">
              عدد الإعلانات الموجودة:
              <span className="text-green-600 font-bold mx-2">
                {totalCount}
              </span>
            </h2>
          </div>

          {products.length === 0 && <Loading myMessage={'جاري التحميل...'} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0
              ? products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    <SmallCard item={item} category={item} />
                  </div>
                ))
              : !loading && (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500 text-lg">
                      لا توجد منتجات متاحة
                    </p>
                  </div>
                )}
          </div>
        </div>

        {hasMore && (
          <div className="mt-12 mb-8">
            <button
              className="group flex items-center gap-3 bg-three hover:bg-two px-8 py-3 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleNextPage}
              disabled={loading}
            >
              <span>المزيد من النتائج</span>
              <MdKeyboardDoubleArrowRight className="text-xl group-hover:translate-x-1 transition-transform text-one" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
