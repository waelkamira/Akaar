'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Suspense } from 'react';
import Image from 'next/image';
import CarsCard from '../../components/Cars/CarsCard';
import { GiCarKey } from 'react-icons/gi';
import CarsNavbar from '../../components/Cars/CarsNavbar';
import { MdCarRental } from 'react-icons/md';
import { MdOutlineSell } from 'react-icons/md';
import LoadingPhoto from '../../components/LoadingPhoto';
import { useRouter } from 'next/navigation';
import { inputsContext } from '../../components/Context';
import Button from '../../components/Button';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import HeroSlider from '../../components/photos/HeroSlider';

export default function CarsHomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const [cars, setCars] = useState();
  const router = useRouter();
  const { dispatch } = useContext(inputsContext);

  if (typeof window !== 'undefined' && session?.user?.image) {
    localStorage.setItem('image', JSON.stringify(session.user.image));
  }

  useEffect(() => {
    fetchCarsAds();
  }, []);
  async function fetchCarsAds() {
    const response = await fetch('/api/Cars/allPosts?limit=8');
    if (response.ok) {
      const json = await response?.json();
      console.log('json', json);
      setCars(json);
    }
  }

  const images = [
    'https://i.imgur.com/uPsQqzu.png',
    'https://i.imgur.com/xu9gOrf.jpg',
    'https://i.imgur.com/VVu5la7.png',
    'https://i.imgur.com/Kc6Pcu1.png',
    'https://i.imgur.com/yH5NGMz.jpg',
  ];

  return (
    <Suspense>
      <CarsNavbar />
      <div className="relative flex flex-col justify-center items-center z-40 w-full bg-five">
        <div className="w-full">
          <div className="xl:hidden absolute flex flex-col items-start gap-2 z-50 top-2 right-0 sm:top-4 sm:right-4 lg:right-12 w-fit">
            <TfiMenuAlt
              className="p-2 text-5xl text-one cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>

          {/* صورة الخلفية */}
          <div className="relative w-full h-[300px] lg:h-[900px] overflow-hidden">
            <HeroSlider images={images} />
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
              <CarsCard
                cardName={'بيع/تأجير سيارة'}
                path={'/Cars/newPost'}
                text={
                  'بغض النظر عن المسار الذي تسلكه لبيع سيارتك أو تأجيرها يمكننا مساعدتك في إتمام العملية بشكل ناجح و بأسرع وقت ممكن.'
                }
                color={'orange'}
                image={'https://i.imgur.com/ZAC6X1M.jpg'}
                emoji={<MdOutlineSell className="text-one" />}
              />
              <CarsCard
                cardName={'شراء سيارة'}
                path={'/Cars/buy'}
                text={
                  ' اعثر على سيارة أحلامك من خلال تجربة تصوير غامرة وأكبر عدد من الإعلانات، بما في ذلك أشياء لن تجدها في أي مكان آخر.'
                }
                color={'orange'}
                image={'https://i.imgur.com/ARNWG2B.jpg'}
                emoji={<GiCarKey className="text-one" />}
              />
              <CarsCard
                cardName={'استأجار سيارة'}
                path={'/Cars/rent'}
                text={
                  'نحن نعمل على إنشاء تجربة سلسة عبر الإنترنت, بدءاً من بناء أكبر شبكة تأجير سيارات إلى تقديم الطلبات، إلى دفع الإيجار.'
                }
                color={'orange'}
                image={'https://i.imgur.com/yH5NGMz.jpg'}
                emoji={<MdCarRental className="text-one" />}
              />
            </div>
            <h1 className="w-full text-center sm:text-lg my-4">
              أحدث الإعلانات
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
              {cars?.length > 0 &&
                cars.map((car) => (
                  <div
                    className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:scale-[103%] transition-transform duration-300 ease-in-out rounded-[15px] overflow-hidden"
                    key={car?.id}
                    onClick={() => {
                      dispatch({ type: 'POST_ID', payload: car?.id });
                      router.push('/Cars/post');
                    }}
                  >
                    <div className="relative w-full h-44">
                      {!car?.image1 && <LoadingPhoto />}
                      {car?.image1 && (
                        <Image src={car?.image1} fill alt="car_photo" />
                      )}
                    </div>
                    <div className="flex justify-evenly gap-2 items-center w-full my-2 text-sm sm:text-md">
                      <h1>{car?.brand}</h1>
                      <h1 className="flex justify-center items-center">
                        {car?.price}
                        <span className="text-one mx-1 select-none">$</span>
                      </h1>
                      <h1 className="flex justify-center items-center">
                        {car?.city}
                      </h1>
                    </div>
                  </div>
                ))}
            </div>
            <h1
              onClick={() => router.push('/Cars/buy')}
              className="flex items-center justify-center w-full text-one hover:scale-105 cursor-pointer mb-16 sm:text-xl"
            >
              المزيد من السيارات{' '}
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
