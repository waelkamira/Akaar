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
  resetFilters,
}) {
  const router = useRouter();
  return (
    <>
      {results?.length > 0 && (
        <div className="min-h-[50vh] pb-72 bg-three w-full inset-0 h-[900px] overflow-y-auto border-t border-gray-400">
          {/* عرض النتائج */}
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
                {results.map((item) => (
                  <motion.div
                    key={item?.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('item', JSON.stringify(item));
                      }
                      resetFilters();
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
      {/* حالة التحميل */}
      {isLoading && isSearchTriggered && (
        <div className="bg-three">
          {' '}
          <Loading myMessage="لا يوجد نتائج مطابقة للبحث قم بتعديل فلاتر البحث للعثور على نتائج أفضل" />
        </div>
      )}
    </>
  );
}
