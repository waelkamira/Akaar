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
import categories from '../components/Categories/categories';

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const router = useRouter();
  const { dispatch } = useContext(inputsContext);
  const session = useSession();

  useEffect(() => {
    if (session?.status === 'unauthenticated') {
      localStorage.clear();
    }
    fetchProductsByCategory();
  }, []);

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

  const images = [
    'https://i.imgur.com/wZ0aruw.jpg',
    'https://i.imgur.com/uPsQqzu.png',
    'https://i.imgur.com/wHyvDAD.png',
    'https://i.imgur.com/Kc6Pcu1.png',
    'https://i.imgur.com/rLz58YH.jpg',
    'https://i.imgur.com/VVu5la7.png',
  ];

  return (
    <main className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-five rounded-b">
      <MainNavbar />
      <HeroSlider images={images} />

      {/* عرض البيانات لكل فئة */}
      {categories.map((category) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center w-full h-full gap-8 py-8 my-8"
        >
          <div
            className="hidden xl:flex justify-center items-center w-1/8 mr-10 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
            onClick={() => router.push(`/categories/${category.id}`)}
          >
            <ColoredCards number={category.id} text={category.name} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
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
                  className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-[10px] overflow-hidden shadow-lg relative"
                >
                  <SmallCard item={item} />
                </motion.div>
              ))}
          </div>
        </motion.div>
      ))}

      <Footer />
      <h1 className="w-full text-sm select-none text-center pt-8 pb-4 border uppercase text-gray-600">
        Copyright © 2025 tobirni web site. All Rights Reserved
      </h1>
    </main>
  );
}
