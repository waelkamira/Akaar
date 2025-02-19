'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Suspense } from 'react';
import Image from 'next/image';
import Card from '../../components/ReusableComponents/Card';
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
import LoadingPhoto from '../../components/LoadingPhoto';
import RealEstateSmallCard from '../../components/RealEstate/RealEstateSmallCard';

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
    const response = await fetch('/api/RealEstate/allPosts?limit=16');
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
    <div>
      <RealEstateNavbar />
      <div className="relative flex flex-col justify-center items-center z-40 sm:my-0 w-full">
        <div className="w-full">
          <div className="xl:hidden absolute flex flex-col items-start gap-2 z-50 top-2 right-0 sm:top-4 sm:right-4  lg:right-12 w-fit">
            <TfiMenuAlt
              className="p-2 text-5xl text-one cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>

          {/* التعتيم عبر طبقة فوق الصورة */}
          <div className="relative w-full h-full overflow-hidden">
            <HeroSlider images={images} />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div> */}
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
                  categories
                </h1>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center w-full p-2 xl:p-4">
              <Card
                cardName={'بيع عقار'}
                path={'/RealEstate/newPost'}
                text={
                  'بغض النظر عن المسار الذي تسلكه لبيع منزلك، يمكننا مساعدتك في إتمام عملية بيع ناجحة و بأسرع وقت ممكن.'
                }
                color={'orange'}
                image={'https://i.imgur.com/uGXmBJO.jpg'}
                emoji={<FaHouseDamage className="text-one" />}
              />
              <Card
                cardName={'شراء عقار'}
                path={'/RealEstate/buy'}
                text={
                  ' اعثر على عقارك من خلال تجربة تصوير غامرة وأكبر عدد من الإعلانات، بما في ذلك أشياء لن تجدها في أي مكان آخر.'
                }
                color={'purple'}
                image={'https://i.imgur.com/qnZeVQk.jpg'}
                emoji={<GiCarKey className="text-[#803084]" />}
              />
              <Card
                cardName={'تأجير عقار'}
                path={'/RealEstate/rent'}
                text={
                  'نحن نعمل على إنشاء تجربة سلسة عبر الإنترنت, بدءاً من بناء أكبر شبكة تأجير، إلى تقديم الطلبات، إلى دفع الإيجار.'
                }
                color={'green'}
                image={'https://i.imgur.com/sZoXjKz.png'}
                emoji={<MdOutlineBedroomParent className="text-[#119530]" />}
              />
            </div>
            <h1 className="w-full text-center sm:text-lg my-4">
              أحدث الإعلانات
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
              {realEstate?.length > 0 &&
                realEstate.map((item) => (
                  <div
                    className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:scale-[103%] transition-transform duration-300 ease-in-out rounded-[15px] overflow-hidden text-black shadow-lg hover:shadow-xl relative"
                    key={item?.id}
                    onClick={() => {
                      dispatch({ type: 'POST_ID', payload: item?.id });
                      router.push('/RealEstate/post');
                    }}
                  >
                    <RealEstateSmallCard item={item} />
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
    </div>
  );
}
