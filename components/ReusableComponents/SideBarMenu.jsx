'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import CurrentUser from './CurrentUser';
import Button from '../Buttons/Button';
import UserNameAndPhoto from './userNameAndPhoto';
import categories from '../Categories/categories';
import mainButtons from '../lists/mainButtons';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';

export default function SideBarMenu({ setIsOpen }) {
  const session = useSession();
  const user = CurrentUser();

  return (
    <div className="p-4 w-60 mx-2 rounded-lg bg-five shadow-xl text-three overflow-y-auto h-screen pb-24">
      {/* زر إغلاق القائمة */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(false)}
          className="text-2xl text-three hover:text-gray-300 transition duration-200"
        >
          <IoCloseOutline />
        </button>
      </div>

      {/* عرض معلومات المستخدم */}
      {session?.status === 'authenticated' && <UserNameAndPhoto />}
      {session?.status === 'unauthenticated' && (
        <Button title={'تسجيل الدخول'} path={'/login'} />
      )}

      {session?.status === 'authenticated' && user?.isAdmin === 1 && (
        <Button path={'/users'} title={'المستخدمين'} />
      )}

      {session?.status === 'authenticated' && (
        <div className="mt-4">
          {mainButtons?.map((button) => (
            <Button
              key={button?.title}
              title={button?.title}
              path={button?.path}
              emoji={button?.emoji}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>
      )}

      {/* عرض أزرار الفئات */}
      <h1 className="mt-6 text-lg font-semibold border-b pb-2">اختر فئة:</h1>
      <div className="space-y-2 border rounded-lg p-4 bg-white shadow-md">
        {categories.map((category) => (
          <Link
            href={category.path}
            key={category.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 hover:text-one transition-all duration-300 ease-in-out"
          >
            <span className="text-xl">{category?.icon}</span>
            <span className="text-sm text-gray-700 hover:text-gray-700">
              {category?.name}
            </span>
          </Link>
        ))}
      </div>

      {/* زر إغلاق القائمة */}
      <div className="mt-6">
        <Button
          title={'إغلاق'}
          onClick={() => setIsOpen(false)}
          emoji={<IoCloseOutline />}
        />
      </div>
    </div>
  );
}
