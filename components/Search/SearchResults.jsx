'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SmallCard from '../ReusableComponents/SmallCard';
import Loading from '../ReusableComponents/Loading';
import NavegationPages from '../ReusableComponents/NavegationPages';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }, // تحسين الـ transition
};

const ResultsGrid = ({ results, onItemClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
    <AnimatePresence>
      {' '}
      {/* إضافة AnimatePresence هنا */}
      {results?.map((item, index) => (
        <motion.div
          key={item?.id} // التأكد من أن الـ key فريد
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }} // إضافة تأثير الخروج
          transition={{ delay: index * 0.05, duration: 0.3 }} // تقليل الـ delay وتحسين الـ duration
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onItemClick(item)}
          className="cursor-pointer group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <SmallCard item={item} />
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const NoResults = () => (
  <motion.div
    {...fadeIn}
    className="h-[300px] flex flex-col items-center justify-center text-center px-4"
  >
    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
      <h3 className="text-two text-sm sm:text-lg lg:text-xl font-bold mb-3">
        عذراً، لم نتمكن من العثور على نتائج
      </h3>
      <p className="text-gray-300 text-sm mb-4">
        جرب تعديل معايير البحث أو استخدم كلمات مفتاحية مختلفة
      </p>
      <ul className="text-gray-300 text-sm list-disc list-inside text-right">
        <li>تأكد من كتابة الكلمات بشكل صحيح</li>
        <li>جرب استخدام كلمات مفتاحية أقل</li>
        <li>قم بتوسيع نطاق البحث</li>
      </ul>
    </div>
  </motion.div>
);

export default function SearchResults({
  results,
  totalCount,
  hasMore,
  isLoading,
  isSearchTriggered,
  pageNumber,
  setPageNumber,
  onReset,
}) {
  const router = useRouter();

  const handleItemClick = (item) => {
    onReset();
    if (typeof window !== 'undefined') {
      localStorage.setItem('item', JSON.stringify(item));
    }
    router.push(`/post/${item?.id}`);
  };

  return (
    <AnimatePresence>
      {' '}
      {/* تغليف الكل بـ AnimatePresence */}
      {isLoading && isSearchTriggered ? (
        <motion.div
          key="loading" // إضافة key
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[300px] flex items-center justify-center"
        >
          <Loading myMessage="جارٍ البحث عن النتائج..." />
        </motion.div>
      ) : !isLoading &&
        isSearchTriggered &&
        (!results || results.length === 0) ? (
        <NoResults key="no-results" /> // إضافة key
      ) : !isLoading && results?.length > 0 ? (
        <motion.div
          key="results" // إضافة key
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-[50vh] pb-72 pt-8 bg-white w-full inset-0 h-[900px] overflow-y-auto"
        >
          <div className="flex justify-between items-center px-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="border border-one hover:bg-one text-two text-sm sm:text-lg px-4 py-1 rounded-[5px] transition-all"
            >
              إغلاق ❌
            </motion.button>
            <motion.h2
              {...fadeIn}
              className="w-full text-center text-two text-sm sm:text-lg"
            >
              تم العثور على
              <span className="text-one font-bold">{totalCount}</span> نتيجة
              مطابقة للبحث
            </motion.h2>
          </div>

          <motion.div
            {...fadeIn}
            className="flex flex-col justify-center items-center p-2 mx-auto w-full"
          >
            <ResultsGrid results={results} onItemClick={handleItemClick} />
            <NavegationPages
              hasMore={hasMore}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
