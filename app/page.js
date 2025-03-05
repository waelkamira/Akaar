'use client';
import Footer from '../components/Footer';
import MainNavbar from '../components/navbars/MainNavbar';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../components/Context';
import { useRouter } from 'next/navigation';
import Loading from '../components/ReusableComponents/Loading';
import HeroSlider from '../components/photos/HeroSlider';
import SmallCard from '../components/ReusableComponents/SmallCard';
import { motion } from 'framer-motion';
import ColoredCards from '../components/ReusableComponents/ColoredCards';
import { useSession } from 'next-auth/react';
import CategoriesNavBar from '../components/navbars/CategoriesNavBar';
import categories from '../components/lists/categories';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const router = useRouter();
  const { dispatch } = useContext(inputsContext);
  const session = useSession();

  useEffect(() => {
    // if (session?.status === 'unauthenticated') {
    //   localStorage.clear();
    // }
    fetchProductsByCategory();
  }, []);
  // ✅ تحميل الحقول بناءً على الفئة عند تغيير `category`
  // useEffect(() => {
  //   if (selectedCategory) {
  //     console.log('selectedCategory *************', selectedCategory);

  //     import(`../../components/categoryFields/${selectedCategory?.name}.jsx`)
  //       .then((module) => {
  //         setCategoryFields(module.default);
  //         console.log('module.default *************', module.default);
  //       })
  //       .catch((err) => {
  //         console.error('Failed to load fields:', err);
  //         setError('فشل في تحميل الحقول');
  //       });
  //   }
  // }, [selectedCategory]);

  async function fetchProductsByCategory() {
    try {
      // جلب البيانات لكل فئة
      const promises = categories.map((category) =>
        fetch(`/api/categories/${category.id}?limit=8`).then((response) =>
          response.json()
        )
      );

      // انتظار اكتمال جميع الطلبات
      const results = await Promise.all(promises);

      // تخزين البيانات في حالة منفصلة لكل فئة
      const data = {};
      categories.forEach((category, index) => {
        data[category.id] = results[index];
      });

      setProductsByCategory(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  return (
    <main className="relative flex flex-row-reverse items-start justify-between  overflow-hidden z-50 h-fit w-full bg-five rounded-b">
      <div className="relative flex-col justify-between items-start w-full 2xl:w-[93%] h-full">
        <MainNavbar />
        {/* <HeroSlider /> */}
        <div className="flex flex-col items-center justify-center mt-28 sm:mt-36 overflow-hidden z-50 h-fit w-full bg-five rounded-b">
          {categories?.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center items-center w-full h-full"
            >
              <div className="flex flex-col 2xl:flex-row justify-center items-center w-full h-full gap-8 py-8 my-8">
                <div
                  className="flex justify-center items-center w-1/8 xl:mr-6 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem(
                        'category',
                        JSON.stringify(category)
                      );
                    }
                    router.push(`/categories/${category.id}`);
                  }}
                >
                  <ColoredCards number={category.id} text={category.name} />
                </div>
                <div className="flex flex-wrap justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
                  {!productsByCategory[category.id] && <Loading />}
                  {productsByCategory[category.id]?.length > 0 &&
                    productsByCategory[category.id].map((item) => (
                      <motion.div
                        key={item?.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('item', JSON.stringify(item));
                          }
                          router.push('/post');
                        }}
                        className="flex flex-col justify-center items-center w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] border cursor-pointer bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-[10px] overflow-hidden shadow-lg relative"
                      >
                        <SmallCard item={item} />
                      </motion.div>
                    ))}
                  <div
                    className="flex justify-center items-center gap-2 cursor-pointer text-lg hover:scale-105 transition-transform ease-in-out duration-200 mt-8 sm:mt-20"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem(
                          'category',
                          JSON.stringify(category)
                        );
                      }
                      router.push(`/categories/${category.id}`);
                    }}
                  >
                    <FaAngleDoubleLeft className="text-one" />
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-xl xl:text-2xl font-medium text-three"
                      style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)' }}
                    >
                      المزيد من ال{category.name}
                    </motion.span>
                    <FaAngleDoubleRight className="text-one" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <Footer />
        <h1 className="w-full text-sm select-none text-center pt-8 pb-4 border uppercase text-gray-600">
          Copyright © 2025 Matjar web site. All Rights Reserved
        </h1>
      </div>
      <div className="hidden 2xl:flex flex-col align-center w-[7%] bg-white h-screen overflow-y-auto">
        <div className="flex flex-col items-center fixed top-28 right-0 z-50 w-[7%] h-[800px] py-16 overflow-y-auto bg-three">
          {categories?.map((ca) => (
            <button
              key={ca?.id}
              className="w-full text-center p-3 h-12 text-white hover:bg-white hover:text-two transition-all duration-300 ease-in-out transform hover:scale-105 "
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('category', JSON.stringify(ca));
                }
                router.push(ca?.path);
              }}
            >
              {ca?.name}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
