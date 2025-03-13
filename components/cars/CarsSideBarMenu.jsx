'use client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import CurrentUser from '../ReusableComponents/CurrentUser';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../ReusableComponents/Button';
import LoadingPhoto from '../photos/LoadingPhoto';

export default function CarsSideBarMenu({ setIsOpen }) {
  const session = useSession();
  const user = CurrentUser();

  return (
    <div className=" p-4 w-52 mx-2 h-fit rounded bg-white border">
      {session?.status === 'authenticated' && (
        <Link href={'/profile?username'}>
          <div className="flex flex-col justify-between items-center  w-full">
            <div className="flex justify-start items-center w-full cursor-pointer line-clamp-1 mb-2">
              <div className="relative size-10 overflow-hidden rounded-[5px]">
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
              <h1 className="  text-nowrap text-start mx-3 text-sm line-clamp-1 select-none">
                {session?.data?.user?.name}
              </h1>
            </div>
          </div>
        </Link>
      )}
      {session?.status === 'unauthenticated' && (
        <Button title={'تسجيل الدخول'} path={'/login'} />
      )}

      {session?.status === 'authenticated' && user?.isAdmin === 1 && (
        <Button path={'/users'} title={'المستخدمين'} />
      )}
      {session?.status === 'authenticated' && (
        <div>
          <Button title={'الرئيسية'} path="/" />
          <Button title={'سيارات'} path="/Cars" />
          <Button title={'متجري'} path="/myPosts" />
          <Button title={'بيع/تأجير سيارة'} path="/Cars/newPost" />
          <Button title={'شراء سيارة'} path="/Cars/buy" />
          <Button title={'استأجار سيارة'} path="/Cars/rent" />
          <Button title={'بروفايل'} path="/profile" />
          <Button title={'اتصل بنا'} path={'/contactUs'} />
          {/* <Button title={'المفضلة'} path={'/favoritePosts'} /> */}
        </div>
      )}

      <button
        className="text-sm p-0.5 my-2 bg-one text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover: border hover:border-[#596067] hover:scale-[101%]"
        onClick={() => setIsOpen(false)}
      >
        إغلاق
      </button>
    </div>
  );
}
