// components/SearchResults.js
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
}) {
  const router = useRouter();

  return (
    <div className="min-h-[50vh] py-12">
      {/* حالة التحميل */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <Loading />
          <h2 className="text-2xl text-center text-three font-semibold">
            جاري البحث... <span className="animate-pulse">⏳</span>
          </h2>
        </motion.div>
      )}

      {/* حالة عدم وجود نتائج */}
      {!isLoading && isSearchTriggered && results?.length === 0 && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center justify-center gap-6 py-16"
        >
          <h2 className="text-3xl text-center text-three font-bold">
            لم يتم العثور على نتائج مطابقة
          </h2>
          <p className="text-lg text-gray-600 max-w-md text-center">
            حاول تعديل فلاتر البحث أو تغيير معايير البحث لعرض نتائج أفضل
          </p>
        </motion.div>
      )}

      {/* عرض النتائج */}
      {!isLoading && results?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto"
        >
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold text-three mb-12">
              عدد النتائج المطابقة للبحث{' '}
              <span className="text-green-600">{totalCount}</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((item) => (
                <motion.div
                  key={item?.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
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
      )}
    </div>
  );
}
