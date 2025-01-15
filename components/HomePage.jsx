'use client';
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import NewPostButton from './NewPostButton';
import AllPosts from './allPosts';
import { useSession } from 'next-auth/react';
import SideBarMenu from './SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Suspense } from 'react';
import Button from './Button';
import Image from 'next/image';
import SideBar from './SideBar';
import Card from './card';
import SyriaMap from './map/SyriaMap';
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
              className=" p-2 rounded-lg text-5xl text-one animate-pulse"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>

          <div className="relative w-full h-[400px] border-l-[18px] border-one">
            <Image
              src="https://i.imgur.com/66tiYGd.jpg"
              fill
              objectFit="cover"
              alt="home_photo"
              objectPosition="top"
            />
            <div className="relative top-16 sm:right-12 px-2">
              <SearchBar />
            </div>
          </div>
          {/* <SyriaMap /> */}

          <h1 className="text-3xl text-white my-4 font-bold text-center w-full mt-4">
            اختر القسم المناسب
          </h1>
          <div className="flex flex-col sm:flex-row justify-center w-full gap-8 px-4 sm:px-8 mt-8">
            <Card
              cardName={'بيع عقار'}
              path={'/sell'}
              text={
                'بيع عقارك بغض النظر عن المسار الذي تتخذه لبيع عقارك، يمكننا مساعدتك في إتمام عملية بيع ناجحة وسريعة بأبسط جهد ممكن وأعلى كفاءة'
              }
              color={'green'}
              image={'https://i.imgur.com/uGXmBJO.jpg'}
            />
            <Card
              cardName={'شراء عقار'}
              path={'/buy'}
              text={
                'اشترِ عقارا اعثر على عقارك من خلال تجربة تصوير غامرة وأكبر عدد من الإعلانات، بما في ذلك أشياء لن تجدها في أي مكان آخر.'
              }
              color={'orange'}
              image={'https://i.imgur.com/hILi6c8.jpg'}
            />
            <Card
              cardName={'استأجار عقار'}
              path={'/rent'}
              text={
                'استئجار عقار نعمل على إنشاء تجربة سلسة عبر الإنترنت - من التسوق على أكبر شبكة إيجار، إلى تقديم الطلبات، إلى دفع الإيجار.'
              }
              color={'red'}
              image={'https://i.imgur.com/9gIMgUg.png'}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
