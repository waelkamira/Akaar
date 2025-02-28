// app/categories/[category]/page.jsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SmallCard from '../../../components/ReusableComponents/SmallCard';
import {
  MdCarRental,
  MdKeyboardDoubleArrowDown,
  MdOutlineCalendarToday,
  MdOutlineSell,
  MdOutlineShoppingCart,
  MdShoppingBasket,
} from 'react-icons/md';
import Card from '../../../components/ReusableComponents/Card';
import { GiCarKey } from 'react-icons/gi';
import HeroSlider from '../../../components/photos/HeroSlider';
import SecondNavBar from '../../../components/navbars/SecondNavBar';
import CarsSideBar from '../../../components/Cars/CarsSideBar';

const CategoryPage = () => {
  const { category } = useParams(); // الحصول على اسم الفئة من الرابط
  const [items, setItems] = useState([]);

  useEffect(() => {
    // جلب البيانات المرتبطة بالفئة
    fetchCategory();
  }, [category]);

  async function fetchCategory() {
    const response = await fetch(`/api/categories/${category}`);
    if (response.ok) {
      const json = await response.json();
      setItems(json);
    }
  }
  return (
    <div className="relative flex flex-col justify-center items-center z-40 w-full  bg-five">
      <div className="w-full">
        <CarsSideBar Button={true} />
        <SecondNavBar category={category} />
        {/* صورة الخلفية */}
        <div className="relative w-full h-full overflow-hidden">
          <HeroSlider />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex justify-center items-center gap-2 w-full text-nowrap py-8 ">
            <div className="flex flex-col justify-end items-end text-two ">
              <h1
                className="px-1 tracking-widest uppercase font-bold text-[8px] sm:text-[10px] lg:text-[11px] xl:text-[12px] select-none border-l border-three"
                style={{ fontFamily: 'Raleway-light' }}
              >
                business
              </h1>
              <h1
                className="px-1 tracking-widest uppercase font-bold text-[8px] sm:text-[10px] lg:text-[11px] xl:text-[12px] select-none border-l border-three"
                style={{ fontFamily: 'Raleway-light' }}
              >
                illustration
              </h1>
              <h1
                className="px-1 tracking-widest uppercase font-bold text-[8px] sm:text-[10px] lg:text-[11px] xl:text-[12px] select-none border-l border-three"
                style={{ fontFamily: 'Raleway-light' }}
              >
                eps10
              </h1>
            </div>
            <div className="">
              <h1
                className="text-[30px] sm:text-[50px] xl:text-[70px] tracking-[1px] pb-2 xl:tracking-[3px] text-one font-medium text-center select-none uppercase"
                style={{ fontFamily: 'vanguardcf-heavy' }}
              >
                {/* اختر القسم المناسب */}
                categories
              </h1>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center w-full p-4">
            <Card
              cardName={'بيع '}
              path={'/products/newPost'}
              text={
                'بغض النظر عن المنتج الذي تريد بيعه أو تأجيره، يمكننا مساعدتك في إتمام العملية بشكل ناجح وبأسرع وقت ممكن.'
              }
              color={'orange'}
              image={'https://i.imgur.com/zktgE57.jpg'}
              emoji={<MdOutlineShoppingCart className="text-one" />}
            />
            <Card
              cardName={'شراء '}
              path={'/products/buy'}
              text={
                'اعثر على المنتج الذي تريده من خلال تجربة تصوير غامرة وأكبر عدد من الإعلانات، بما في ذلك أشياء لن تجدها في أي مكان آخر.'
              }
              color={'purple'}
              image={'https://i.imgur.com/Nai6Zkj.jpg'}
              emoji={<MdShoppingBasket className="text-[#803084]" />}
            />
            <Card
              cardName={'استئجار '}
              path={'/products/rent'}
              text={
                'نحن نعمل على إنشاء تجربة سلسة عبر الإنترنت، بدءاً من بناء أكبر شبكة تأجير إلى تقديم الطلبات، إلى دفع الإيجار.'
              }
              color={'green'}
              image={'https://i.imgur.com/dKOSQOs.jpg'}
              emoji={<MdOutlineCalendarToday className="text-[#119530]" />}
            />
          </div>
          <h1 className="w-full text-center sm:text-lg my-4">أحدث الإعلانات</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full xl:w-[70%]">
            {items.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg shadow-md">
                <SmallCard item={item} />
              </div>
            ))}
          </div>
          <h1
            onClick={() => router.push('/Cars/buy')}
            className="flex items-center justify-center w-full my-8 text-one hover:scale-105 cursor-pointer mb-16 sm:text-xl"
          >
            المزيد من الإعلانات{' '}
            <span>
              <MdKeyboardDoubleArrowDown />
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
