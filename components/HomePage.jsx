'use client';
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import NewRecipeButton from './NewRecipeButton';
import AllPosts from './allPosts';
import { useSession } from 'next-auth/react';
import SideBarMenu from './SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Suspense } from 'react';
import Button from './Button';
import Image from 'next/image';
import SideBar from './SideBar';
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

          <div className="relative w-full h-[500px]">
            <Image
              src="https://i.imgur.com/66tiYGd.jpg"
              fill
              objectFit="cover"
              alt="home_photo"
              objectPosition="top"
            />
          </div>
          <SearchBar />
          <div className="flex">
            <div className={'xl:hidden'}>
              <NewRecipeButton />
              {session?.status === 'unauthenticated' && (
                <Button title={'تسجيل الدخول'} path={'/login'} style={' '} />
              )}
            </div>
            <h1 className="hidden xl:block text-md sm:text-lg lg:text-3xl text-nowrap mx-2  text-white bg-four rounded-xl py-2 px-4 select-none text-center">
              أحدث المنشورات
            </h1>
          </div>
          <div className="flex justify-start items-center w-full rounded-lg sm:p-8 gap-4">
            <h1 className="xl:hidden text-md sm:text-lg lg:text-3xl text-nowrap mx-2  text-white bg-four rounded-xl py-2 px-4 select-none text-center">
              أحدث المنشورات
            </h1>
            <SideBar />
            <AllPosts />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
