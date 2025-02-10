'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Suspense } from 'react';
import Image from 'next/image';
import Card from '../../components/RealEstate/RealEstateCard';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { GiCarKey } from 'react-icons/gi';
import { FaHouseDamage } from 'react-icons/fa';
import RealEstateNavbar from '../../components/RealEstate/RealEstarteNavbar';

export default function RealEstateHomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  if (typeof window !== 'undefined' && session?.user?.image) {
    localStorage.setItem('image', JSON.stringify(session.user.image));
  }

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
            <Image
              src="https://i.imgur.com/wZ0aruw.jpg"
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
          </div>
        </div>
      </div>
    </Suspense>
  );
}
