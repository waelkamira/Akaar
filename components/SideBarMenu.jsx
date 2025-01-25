'use client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import CurrentUser from '../components/CurrentUser';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import LoadingPhoto from './LoadingPhoto';

export default function SideBarMenu({ setIsOpen }) {
  const session = useSession();
  const user = CurrentUser();

  return (
    <div className=" p-4 w-52 mx-2 h-fit border-[5px] border-one bg-four">
      {session?.status === 'authenticated' && (
        <Link href={'/profile?username'}>
          <div className="flex flex-col justify-between items-center  w-full">
            <div className="flex justify-start items-center w-full cursor-pointer line-clamp-1 mb-2">
              <div className="relative size-10 overflow-hidden rounded-xl">
                {!user?.image && <LoadingPhoto />}
                {user?.image && (
                  <Image
                    priority
                    src={user?.image}
                    fill
                    alt={session?.data?.user?.name}
                  />
                )}
              </div>
              <h1 className=" text-white text-nowrap text-start mx-3 text-sm line-clamp-1 select-none">
                {session?.data?.user?.name}
              </h1>
            </div>
          </div>
        </Link>
      )}
      {session?.status === 'unauthenticated' && (
        <Button title={'تسجيل الدخول'} path={'/login'} />
      )}

      {session?.status === 'authenticated' && user?.isAdmin === 0 && (
        <Button path={'/users'} title={'المستخدمين'} />
      )}
      {session?.status === 'authenticated' && (
        <div>
          <Button title={'الرئيسية'} path="/" />
          <Button title={'بيع'} path="/newPost" />
          <Button title={'شراء'} path="/buy" />
          <Button title={'بروفايلي'} path="/profile" />
          <Button title={'إعلاناتي'} path="/myPosts" />
          <Button title={'إعلانات أعجبتني'} path={'/favoritePosts'} />
          <Button title={'اتصل بنا'} path={'/contactUs'} />
          <Button title={'تسجيل الخروج'} path={'/'} onClick={() => signOut()} />
        </div>
      )}

      <button
        className="text-sm p-0.5 my-2 bg-red-600 text-white text-nowrap select-none rounded-lg w-full max-h-12 hover:text-white border hover:border-[#596067] hover:scale-[101%]"
        onClick={() => setIsOpen(false)}
      >
        إغلاق
      </button>
    </div>
  );
}
