'use client';
import { motion } from 'framer-motion';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import SmallCard from '../ReusableComponents/SmallCard';
import Loading from '../ReusableComponents/Loading';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const ResultsGrid = ({ results, onItemClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
    {results?.map((item) => (
      <motion.div
        key={item?.id}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onItemClick(item)}
        className="cursor-pointer group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        <SmallCard item={item} />
      </motion.div>
    ))}
  </div>
);

const PaginationButtons = ({ hasMore, pageNumber, setPageNumber }) => (
  <div className="flex items-center gap-4 mt-12">
    {hasMore && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-2 sm:px-6 py-1 sm:py-3 bg-one text-white rounded-full shadow-lg hover:bg-opacity-90 transition-all"
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        <span className="text-sm sm:text-lg font-medium">الصفحة التالية</span>
        <FaAngleDoubleRight className="text-xl" />
      </motion.button>
    )}
    {pageNumber > 1 && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-2 sm:px-6 py-1 sm:py-3 bg-one text-white rounded-full shadow-lg hover:bg-opacity-90 transition-all"
        onClick={() => setPageNumber(pageNumber - 1)}
      >
        <FaAngleDoubleLeft className="text-xl" />
        <span className="text-sm sm:text-lg font-medium">الصفحة السابقة</span>
      </motion.button>
    )}
  </div>
);

const NoResults = () => (
  <motion.div
    {...fadeIn}
    className="h-[300px] flex flex-col items-center justify-center text-center px-4"
  >
    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
      <h3 className="text-white text-xl font-bold mb-3">
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

  if (isLoading && isSearchTriggered) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loading myMessage="جارٍ البحث عن النتائج..." />
      </div>
    );
  }

  if (!isLoading && isSearchTriggered && (!results || results.length === 0)) {
    return <NoResults />;
  }

  if (!isLoading && results?.length > 0) {
    return (
      <div className="min-h-[50vh] pb-72 pt-8 bg-three w-full inset-0 h-[900px] overflow-y-auto">
        <div className="flex justify-between items-center px-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="border hover:bg-one text-white px-4 py-1 rounded-[5px] transition-all"
          >
            إغلاق ❌
          </motion.button>
          <motion.h2 {...fadeIn} className="text-white text-lg">
            تم العثور على{' '}
            <span className="text-one font-bold">{totalCount}</span> نتيجة
          </motion.h2>
        </div>

        <motion.div {...fadeIn} className="p-2 mx-auto w-full">
          <ResultsGrid results={results} onItemClick={handleItemClick} />
          <PaginationButtons
            hasMore={hasMore}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        </motion.div>
      </div>
    );
  }

  return null;
}
