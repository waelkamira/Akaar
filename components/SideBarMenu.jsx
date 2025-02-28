'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import CurrentUser from '../components/CurrentUser';
import Button from './Button';
import UserNameAndPhoto from './ReusableComponents/userNameAndPhoto';

export default function SideBarMenu({ setIsOpen }) {
  const session = useSession();
  const user = CurrentUser();

  return (
    <div className=" p-4 w-52 mx-2 h-fit rounded bg-white">
      {session?.status === 'authenticated' && <UserNameAndPhoto />}
      {session?.status === 'unauthenticated' && (
        <Button title={'تسجيل الدخول'} path={'/login'} />
      )}

      {session?.status === 'authenticated' && user?.isAdmin === 1 && (
        <Button path={'/users'} title={'المستخدمين'} />
      )}
      {session?.status === 'authenticated' && (
        <div>
          <Button title={'الرئيسية'} path="/" />
          <Button title={'بروفايل'} path="/profile" />
          <Button title={'عقارات'} path="/RealEstate" />
          <Button title={'سيارات'} path="/Cars" />
          <Button title={'متجري'} path="/myPosts" />
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
