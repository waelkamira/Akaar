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
export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  if (typeof window !== 'undefined' && session?.user?.image) {
    localStorage.setItem('image', JSON.stringify(session.user.image));
  }

  return (
    <Suspense>
      <div className="relative flex flex-col justify-center items-center xl:w-4/5 z-40 sm:my-0 w-full bg-four">
        <div className="w-full p-2 sm:p-4 lg:p-8">
          <div className="xl:hidden absolute flex flex-col items-start gap-2 z-50 top-2 right-0 sm:top-4 sm:right-4  lg:right-12 w-full">
            <TfiMenuAlt
              className=" p-2 rounded-lg text-5xl text-one animate-pulse"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>

          <SearchBar />
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
        <div className="flex flex-col justify-center items-center w-full rounded-lg sm:p-8 gap-4">
          <h1 className="xl:hidden text-md sm:text-lg lg:text-3xl text-nowrap mx-2  text-white bg-four rounded-xl py-2 px-4 select-none text-center">
            أحدث المنشورات
          </h1>
          <AllPosts />
        </div>
      </div>
    </Suspense>
  );
}
