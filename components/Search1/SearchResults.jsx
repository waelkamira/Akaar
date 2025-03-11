'use client';
import { motion } from 'framer-motion';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import SmallCard from '../ReusableComponents/SmallCard';
import Loading from '../ReusableComponents/Loading';

export default function SearchResults({
  results,
  totalCount,
  hasMore,
  isLoading,
  isSearchTriggered,
  setPageNumber,
  pageNumber,
  onReset,
}) {
  const router = useRouter();

  return (
    <div className="bg-three h-full border-t border-gray-400">
      {/* حالة التحميل */}
      {isLoading && (
        <div className="h-[300px] flex items-center justify-center">
          <Loading myMessage="جارٍ التحميل..." />
        </div>
      )}

      {/* عرض النتائج */}
      {!isLoading && results?.length > 0 && (
        <div className="min-h-[50vh] pb-72 pt-8 bg-three w-full inset-0 h-[900px] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2 mx-auto w-full"
          >
            <div className="flex flex-col items-center gap-8 w-full min-w-72 my-4 sm:my-12">
              <h1 className="sm:text-3xl font-bold text-white select-none">
                عدد النتائج المطابقة للبحث{' '}
                <span className="text-one">{totalCount}</span>
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {results?.map((item) => (
                  <motion.div
                    key={item?.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onReset();
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('item', JSON.stringify(item));
                      }

                      router.push(`/post/${item?.id}`);
                    }}
                    className="cursor-pointer group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <SmallCard item={item} />
                  </motion.div>
                ))}
              </div>

              {/* زر تحميل المزيد */}
              {hasMore && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 mt-12 bg-one text-white rounded-full shadow-lg hover:bg-opacity-90 transition-all"
                  onClick={() => {
                    setPageNumber(pageNumber + 1);
                  }}
                >
                  <FaAngleDoubleLeft className="text-xl" />
                  <span className="text-lg font-medium">المزيد من النتائج</span>
                  <FaAngleDoubleRight className="text-xl" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* حالة عدم وجود نتائج */}
      {!isLoading &&
        isSearchTriggered &&
        (!results || results.length === 0) && (
          <div className="h-[300px] flex flex-col items-center justify-center">
            <p className="text-white text-lg font-bold">
              لا يوجد نتائج مطابقة للبحث.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              حاول تعديل فلاتر البحث أو إدخال كلمات بحث مختلفة.
            </p>
          </div>
        )}
    </div>
  );
}
