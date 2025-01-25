'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import SideBarMenu from './SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Suspense } from 'react';
import Image from 'next/image';
import Card from './card';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { GiBuyCard } from 'react-icons/gi';
import { GiCarKey } from 'react-icons/gi';
import { FaHouseDamage } from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { GiAnchor } from 'react-icons/gi';
import Footer from './Footer';
export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  if (typeof window !== 'undefined' && session?.user?.image) {
    localStorage.setItem('image', JSON.stringify(session.user.image));
  }

  return (
    <Suspense>
      <div className="relative flex flex-col justify-center items-center z-40 sm:my-0 w-full bg-four">
        <div className="w-full">
          <div className="xl:hidden absolute flex flex-col items-start gap-2 z-50 top-2 right-0 sm:top-4 sm:right-4  lg:right-12 w-full">
            <TfiMenuAlt
              className=" p-2  text-5xl text-one  cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>

          <div className="relative w-full h-[400px] border-l-[18px] border-one overflow-hidden">
            <Image
              src="https://i.imgur.com/wZ0aruw.jpg"
              fill
              alt="home_photo"
              className="object-cover object-center w-full h-auto"
              objectPosition="center"
            />
          </div>

          <div className="flex justify-center w-full">
            <h1 className=" text-3xl p-2 text-white my-4 font-medium text-center w-fit mt-4 select-none border-y-[3px] border-seven ">
              {/* <hr className="w-full h-2" /> */}
              اختر القسم المناسب
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row justify-center w-full gap-4 xl:gap-8 px-4 xl:px-8 my-8">
            <Card
              cardName={'بيع عقار'}
              path={'/newPost'}
              text={
                'بغض النظر عن المسار الذي تسلكه لبيع منزلك، يمكننا مساعدتك في إتمام عملية بيع ناجحة و بأسرع وقت ممكن.'
              }
              color={'red'}
              image={'https://i.imgur.com/85xCFcd.jpg'}
              emoji={<FaHouseDamage className="text-two" />}
            />
            <Card
              cardName={'شراء عقار'}
              path={'/buy'}
              text={
                ' اعثر على عقارك من خلال تجربة تصوير غامرة وأكبر عدد من الإعلانات، بما في ذلك أشياء لن تجدها في أي مكان آخر.'
              }
              color={'green'}
              image={'https://i.imgur.com/9gIMgUg.png'}
              emoji={<GiCarKey className="text-gray-700" />}
            />
            <Card
              cardName={'تأجير عقار'}
              path={'/rent'}
              text={
                'نحن نعمل على إنشاء تجربة سلسة عبر الإنترنت, بدءاً من بناء أكبر شبكة تأجير، إلى تقديم الطلبات، إلى دفع الإيجار.'
              }
              color={'orange'}
              image={'https://i.imgur.com/uGXmBJO.jpg'}
              emoji={<MdOutlineBedroomParent className="text-one" />}
            />
          </div>
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}
