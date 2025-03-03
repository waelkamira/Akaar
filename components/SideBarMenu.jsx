'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import CurrentUser from '../components/CurrentUser';
import Button from './Button';
import UserNameAndPhoto from './ReusableComponents/userNameAndPhoto';
import categories from './lists/categories'; // تأكد من استيراد القائمة

export default function SideBarMenu({ setIsOpen }) {
  const session = useSession();
  const user = CurrentUser();

  return (
    <div className="p-4 w-52 mx-2 rounded bg-white overflow-y-auto h-screen pb-24">
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
          <Button title={'متجري'} path="/myPosts" />
          <Button title={'اتصل بنا'} path={'/contactUs'} />
          <button
            className="text-sm p-0.5 my-2 bg-one text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover:border hover:border-[#596067] hover:scale-[101%]"
            onClick={() => setIsOpen(false)}
          >
            إغلاق
          </button>
        </div>
      )}

      {/* عرض أزرار الفئات */}
      <div className="mt-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            title={
              <div className="flex items-center gap-2">
                {category.icon} {/* عرض الأيقونة */}
                <span>{category.name}</span> {/* عرض اسم الفئة */}
              </div>
            }
            path={category.path}
          />
        ))}
      </div>

      <button
        className="text-sm p-0.5 my-2 bg-one text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover:border hover:border-[#596067] hover:scale-[101%]"
        onClick={() => setIsOpen(false)}
      >
        إغلاق
      </button>
    </div>
  );
}
