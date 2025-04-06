'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import Footer from '../components/ReusableComponents/Footer';
import Loading from '../components/ReusableComponents/Loading';
import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
import ColoredCards from '../components/ReusableComponents/ColoredCards';
import categories from '../components/Categories/categories';

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const session = useSession();

  const fetchAllProductsByCategory = useCallback(async () => {
    try {
      setLoading(true);
      const allCategoryIds = categories
        .map((category) => category.id)
        .join(',');
      const response = await fetch(
        `/api/categories/bulk?categories=${allCategoryIds}`,
        {
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch');
      const { data } = await response.json();
      setProductsByCategory(data || {});
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProductsByCategory();
  }, [fetchAllProductsByCategory]);

  const handleCategoryClick = (category) => {
    localStorage.setItem('category', JSON.stringify(category));
    router.push(`/categories/${category.id}?category=${category.name}`);
  };

  const renderProducts = (category) => {
    const products = productsByCategory[category.id];

    if (!products)
      return (
        <div className="min-h-[250px] w-full flex justify-center items-center">
          <Loading myMessage="جاري تحميل المنتجات..." />
        </div>
      );
    if (products.length === 0) return <p>لا توجد منتجات في هذه الفئة</p>;

    return products.map((item) => (
      <motion.div
        layout
        key={item.id}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col justify-center items-center w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] border cursor-pointer bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-[10px] overflow-hidden shadow-lg relative"
        onClick={() => router.push(`/post/${item.id}`)}
      >
        <SmallCard item={item} category={category} />
      </motion.div>
    ));
  };

  return (
    <Suspense className="relative flex flex-row-reverse items-start justify-between overflow-hidden z-[40] h-fit w-full bg-five rounded-b">
      <div className="relative flex-col justify-between items-start w-full h-full">
        <div className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-five rounded-b">
          {loading ? (
            <Loading fullPage />
          ) : (
            categories
              .filter((category) => productsByCategory[category.id]?.length > 0)
              .map((category) => (
                <motion.div
                  layout
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                  className="flex flex-col justify-center items-center w-full h-full"
                >
                  <div className="flex flex-col justify-center items-center w-full h-full gap-8 py-8 my-8">
                    <div
                      className="flex justify-center items-center w-1/8 hover:scale-105 mb-8 transition-transform duration-300 ease-in-out cursor-pointer"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <ColoredCards number={category.id} text={category.name} />
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
                      {renderProducts(category)}
                      <div
                        className="flex justify-center items-center gap-2 cursor-pointer text-lg hover:scale-105 transition-transform ease-in-out duration-200 mt-8 sm:mt-20"
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
        <h1 className="w-full text-sm select-none text-center pt-8 pb-4 border uppercase text-gray-600">
          حقوق النشر © 2025 موقع متجر. جميع الحقوق محفوظة
        </h1>
      </div>
    </Suspense>
  );
}
