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
  return (
    <Suspense>
      <CarsNavbar />
      <div className="relative flex flex-col justify-center items-center z-40 sm:my-0 w-full bg-five">
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
            <Image
              src="https://i.imgur.com/ZAC6X1M.jpg"
              fill
              alt="home_photo"
              className="object-cover object-center w-full h-auto"
              objectPosition="center"
            />

            {/* التعتيم عبر طبقة فوق الصورة */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div className="w-full">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-16 justify-center items-center gap-4 w-full h-full p-8">
              {cars?.length > 0 &&
                cars.map((car) => (
                  <div
                    className="flex flex-col justify-center items-center w-full border rounded-[5px] cursor-pointer bg-white"
                    key={car?.adType}
                    onClick={() => {
                      dispatch({ type: 'POST_ID', payload: car?.id });
                      router.push('/Cars/post');
                    }}
                  >
                    <div className="relative w-full size-44 rounded-[5px] overflow-hidden">
                      {!car?.image1 && <LoadingPhoto />}
                      {car?.image1 && (
                        <Image src={car?.image1} fill alt="car_photo" />
                      )}{' '}
                    </div>
                    <div className="flex justify-around gap-2 items-center w-full my-2">
                      {' '}
                      <h1>{car?.brand}</h1>
                      <h1>{car?.price}</h1>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
