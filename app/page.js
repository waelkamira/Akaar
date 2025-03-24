'use client';
import Footer from '../components/ReusableComponents/Footer';
import { useRouter } from 'next/navigation';
import Loading from '../components/ReusableComponents/Loading';
import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
import { motion } from 'framer-motion';
import ColoredCards from '../components/ReusableComponents/ColoredCards';
import categories from '../components/Categories/categories';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import CategoriesNavBar from '../components/navbars/CategoriesNavBar';

const Home = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true); // حالة التحميل
  const router = useRouter();
  // console.log('productsByCategory', productsByCategory);

  useEffect(() => {
    fetchProductsByCategory();
  }, []);

  const fetchProductsByCategory = async () => {
    try {
      // تحويل قائمة الفئات إلى سلسلة (مثل "1,2,3")
      const categoryIds = categories.map((category) => category.id).join(',');

      // جلب المنتجات لجميع الفئات في طلب واحد
      const response = await fetch(
        `/api/categories/bulk?categories=${categoryIds}`
      );
      const data = await response.json();

      // تحديث الحالة بالمنتجات
      setProductsByCategory(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // إنهاء حالة التحميل
    }
  };

  const handleCategoryClick = (category) => {
    localStorage.setItem('category', JSON.stringify(category));
    router.push(`/categories/${category.id}?category=${category.name}`);
  };

  const renderProducts = (category) => {
    if (!productsByCategory[category.id]) return <Loading />;

    return productsByCategory[category.id].map((item) => (
      <motion.div
        key={item.id}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push(`/post/${item.id}`)}
        className="flex flex-col justify-center items-center w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] border cursor-pointer bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-[10px] overflow-hidden shadow-lg relative"
      >
        <SmallCard item={item} category={category} />
      </motion.div>
    ));
  };

  return (
    <main className="relative flex flex-row-reverse items-start justify-between overflow-hidden z-[40] h-fit w-full bg-five rounded-b">
      <div className="relative flex-col justify-between items-start w-full h-full">
        <div className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-five rounded-b ">
          {loading ? (
            <Loading /> // ✅ عرض التحميل بشكل صحيح
          ) : (
            categories
              .filter(
                (category) => productsByCategory[category?.id]?.length > 0
              )
              .map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
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
                      {loading ? <Loading /> : renderProducts(category)}
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
                          المزيد من ال{category.name}
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
          Copyright © 2025 Matjar web site. All Rights Reserved
        </h1>
      </div>
    </main>
  );
};

export default Home;
