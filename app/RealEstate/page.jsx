'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Suspense } from 'react';
import Image from 'next/image';
import Card from '../../components/RealEstate/RealEstateCard';
import {
  MdKeyboardDoubleArrowDown,
  MdOutlineBedroomParent,
} from 'react-icons/md';
import { GiCarKey } from 'react-icons/gi';
import { FaHouseDamage } from 'react-icons/fa';
import RealEstateNavbar from '../../components/RealEstate/RealEstarteNavbar';
import HeroSlider from '../../components/photos/HeroSlider';
import { useRouter } from 'next/navigation';
import { inputsContext } from '../../components/Context';

export default function RealEstateHomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const [realEstate, setRealEstate] = useState();
  const router = useRouter();
  const { dispatch } = useContext(inputsContext);

  if (typeof window !== 'undefined' && session?.user?.image) {
    localStorage.setItem('image', JSON.stringify(session.user.image));
  }

  useEffect(() => {
    fetchRealEstateAds();
  }, []);

  async function fetchRealEstateAds() {
    const response = await fetch('/api/RealEstate/allPosts?limit=8');
    if (response.ok) {
      const json = await response?.json();
      console.log('json', json);
      setRealEstate(json);
    }
  }
  const images = [
    'https://i.imgur.com/wHyvDAD.png',
    'https://i.imgur.com/0DDS22z.jpg',
    'https://i.imgur.com/Bw4Kof8.jpg',
    'https://i.imgur.com/rLz58YH.jpg',
    'https://i.imgur.com/qZteMbj.jpg',
  ];
  return (
    <Suspense>
      <RealEstateNavbar />
      <div className="relative flex flex-col justify-center items-center z-40 sm:my-0 w-full">
        <div className="w-full">
          <div className="xl:hidden absolute flex flex-col items-start gap-2 z-50 top-2 right-0 sm:top-4 sm:right-4  lg:right-12 w-full">
            <TfiMenuAlt
              className="p-2 text-5xl text-one cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>

          <div className="relative w-full h-[300px] lg:h-[900px] overflow-hidden">
            {/* صورة الخلفية */}
            {/* <Image
              src="https://i.imgur.com/wZ0aruw.jpg"
              fill
              alt="home_photo"
              className="object-cover object-center w-full h-auto"
              objectPosition="center"
            /> */}

            <HeroSlider images={images} />
            {/* التعتيم عبر طبقة فوق الصورة */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div className="flex flex-col justify-center items-center w-full ">
            <div className="flex justify-center items-center gap-2 w-full text-nowrap py-8 ">
              <div className="flex flex-col justify-end items-end text-two ">
                <h1
                  className="px-1 tracking-widest uppercase font-bold text-[8px] sm:text-[10px] lg:text-[11px] xl:text-[12px] select-none border-l border-two"
                  style={{ fontFamily: 'Raleway-light' }}
                >
                  business
                </h1>
                <h1
                  className="px-1 tracking-widest uppercase font-bold text-[8px] sm:text-[10px] lg:text-[11px] xl:text-[12px] select-none border-l border-two"
                  style={{ fontFamily: 'Raleway-light' }}
                >
                  illustration
                </h1>
                <h1
                  className="px-1 tracking-widest uppercase font-bold text-[8px] sm:text-[10px] lg:text-[11px] xl:text-[12px] select-none border-l border-two"
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

            <div className="flex flex-col sm:flex-row justify-center w-full gap-4 xl:gap-16 px-4 xl:px-8 py-8 ">
              <Card
                cardName={'بيع عقار'}
                path={'/RealEstate/newPost'}
                text={
                  'بغض النظر عن المسار الذي تسلكه لبيع منزلك، يمكننا مساعدتك في إتمام عملية بيع ناجحة و بأسرع وقت ممكن.'
                }
                color={'gray'}
                image={'https://i.imgur.com/85xCFcd.jpg'}
                emoji={<FaHouseDamage className="text-one" />}
              />
              <Card
                cardName={'شراء عقار'}
                path={'/RealEstate/buy'}
                text={
                  ' اعثر على عقارك من خلال تجربة تصوير غامرة وأكبر عدد من الإعلانات، بما في ذلك أشياء لن تجدها في أي مكان آخر.'
                }
                color={'gray'}
                image={'https://i.imgur.com/9gIMgUg.png'}
                emoji={<GiCarKey className="text-one" />}
              />
              <Card
                cardName={'تأجير عقار'}
                path={'/RealEstate/rent'}
                text={
                  'نحن نعمل على إنشاء تجربة سلسة عبر الإنترنت, بدءاً من بناء أكبر شبكة تأجير، إلى تقديم الطلبات، إلى دفع الإيجار.'
                }
                color={'gray'}
                image={'https://i.imgur.com/uGXmBJO.jpg'}
                emoji={<MdOutlineBedroomParent className="text-one" />}
              />
            </div>
            <h1 className="w-full text-center sm:text-lg my-4">
              أحدث الإعلانات
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
              {realEstate?.length > 0 &&
                realEstate.map((item) => (
                  <div
                    className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:scale-[103%] transition-transform duration-300 ease-in-out rounded-[15px] overflow-hidden text-black"
                    key={item?.id}
                    onClick={() => {
                      dispatch({ type: 'POST_ID', payload: item?.id });
                      router.push('/RealEstate/post');
                    }}
                  >
                    <div className="relative w-full h-44">
                      {!item?.image1 && <LoadingPhoto />}
                      {item?.image1 && (
                        <Image src={item?.image1} fill alt="item_photo" />
                      )}
                    </div>
                    <div className="flex justify-evenly gap-2 items-center w-full my-2 text-sm sm:text-md">
                      <h1>{item?.propertyCategory}</h1>
                      <h1 className="flex justify-center items-center">
                        {item?.propertyPrice}
                        <span className="text-one mx-1 select-none">$</span>
                      </h1>
                      <h1 className="flex justify-center items-center">
                        {item?.propertyCity}
                      </h1>
                    </div>
                  </div>
                ))}
            </div>
            <h1
              onClick={() => router.push('/RealEstate/buy')}
              className="flex items-center justify-center w-full text-one hover:scale-105 cursor-pointer mb-16 sm:text-xl"
            >
              المزيد من العقارات{' '}
              <span>
                <MdKeyboardDoubleArrowDown />
              </span>
            </h1>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
