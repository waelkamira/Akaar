'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import Footer from '../components/ReusableComponents/Footer';
import Loading from '../components/ReusableComponents/Loading';
import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
import ColoredCards from '../components/ReusableComponents/ColoredCards';
import categories from '../components/Categories/categories';

// حجم الدفعة الأمثل (يمكن تعديله حسب الاختبار)
const OPTIMAL_BATCH_SIZE = 20;

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadedCategories, setLoadedCategories] = useState(0);
  const router = useRouter();

  // دالة محسنة لجلب البيانات مع التخزين المؤقت
  const fetchProductsByCategory = useCallback(async () => {
    setLoading(true);

    try {
      // تقسيم الفئات إلى دفعات
      const batches = [];
      for (let i = 0; i < categories.length; i += OPTIMAL_BATCH_SIZE) {
        batches.push(categories.slice(i, i + OPTIMAL_BATCH_SIZE));
      }

      // جلب كل دفعة مع التعامل مع الأخطاء
      for (const batch of batches) {
        try {
          const categoryIds = batch.map((c) => c.id).join(',');
          const response = await fetch(
            `/api/categories/bulk?categories=${categoryIds}`,
            {
              next: { revalidate: 3600 }, // إعادة التحقق بعد ساعة (ISR)
            }
          );

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const { data } = await response.json();

          setProductsByCategory((prev) => ({
            ...prev,
            ...data,
          }));

          setLoadedCategories((prev) => prev + batch.length);
        } catch (error) {
          console.error('خطأ في جلب دفعة الفئات:', error);
          // يمكنك هنا إضافة منطق لإعادة المحاولة أو التعامل مع الخطأ
        }
      }
    } catch (error) {
      console.error('خطأ عام في جلب البيانات:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  const handleCategoryClick = (category) => {
    localStorage.setItem('category', JSON.stringify(category));
    router.push(`/categories/${category.id}?category=${category.name}`);
  };

  const renderProducts = (category) => {
    const products = productsByCategory[category.id];
    console.log('products', products);
    if (!products) return <Loading small />;
    if (products.length === 0) return <p>لا توجد منتجات في هذه الفئة</p>;

    return products.map((item) => (
      <div
        key={item.id}
        className="flex flex-col justify-center items-center w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] border cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg shadow-lg relative"
      >
        <SmallCard item={item} category={category} />
      </div>
    ));
  };

  return (
    <main className="relative flex flex-row-reverse items-start justify-between overflow-hidden z-[30] h-fit w-full bg-five rounded-b mt-8">
      <div className="relative flex-col justify-between items-start w-full h-full">
        <div className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-five rounded-b mt-8">
          {loading && loadedCategories === 0 ? (
            <Loading fullPage />
          ) : (
            categories
              .filter((category) => productsByCategory[category.id]?.length > 0)
              .map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                  className="flex flex-col justify-center items-center w-full h-full"
                >
                  <div className="flex flex-col justify-center items-center w-full h-full gap-2 my-8">
                    <div
                      className=" rounded-2xl px-2 py-1 text-nowrap text-xs text-white font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <ColoredCards number={category.id} text={category.name} />
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
                      {renderProducts(category)}
                      <div
                        className="flex justify-center items-center gap-2 cursor-pointer text-lg transition-transform ease-in-out duration-200 mt-8 sm:mt-20"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <FaAngleDoubleLeft className="text-primary-500" />
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="text-xl xl:text-2xl font-medium text-three"
                          style={{
                            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          المزيد من {category.name}
                        </motion.span>
                        <FaAngleDoubleRight className="text-primary-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </div>
        <div className="flex justify-end w-full">
          <Footer />
        </div>
      </div>
    </main>
  );
}
