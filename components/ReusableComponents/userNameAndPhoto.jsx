'use client';
import React, { useEffect } from 'react';
import LoadingPhoto from '../photos/LoadingPhoto';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns'; // استيراد الدالة
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UserNameAndPhoto({ post }) {
  const session = useSession();
  const path = usePathname();
  const [user, setUser] = React.useState();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = JSON.parse(localStorage.getItem('CurrentUser'));
        console.log('storedUser', storedUser);
        setUser(storedUser);
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
      }
    }
  }, []);

  // console.log(session?.data?.user?.image);
  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <>
      <div className="flex justify-start items-center gap-2 w-full mb-4 text-black">
        <Link
          href={'/profile'}
          className="cursor-pointer flex justify-start items-center gap-2 w-full h-fit "
        >
          <div
            className={`relative ${
              path.includes('myPosts') ||
              path.includes('favoritePosts') ||
              path.includes('/')
                ? 'size-10'
                : 'size-10 sm:size-12 lg:size-14'
            } overflow-hidden rounded`}
          >
            {/* تحقق من عدم وجود صورة */}
            {(session?.data?.user?.image || user?.userImage) && (
              <LoadingPhoto />
            )}
            {/* تحقق من وجود صورة */}
            {(session?.data?.user?.image || user?.userImage) && (
              <Image
                priority
                src={user?.userImage || session?.data?.user?.image}
                fill
                alt={session?.data?.user?.name}
              />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h6
              className={`${
                path.includes('myPosts') || path.includes('favoritePosts')
                  ? 'text-[11px]'
                  : 'text-[11px] sm:text-[15px]'
              }  text-eight select-non font-medium`}
            >
              {user?.username || session?.data?.user?.name}
            </h6>
            {post && (
              <h1
                className={`${
                  path.includes('myPosts') || path.includes('favoritePosts')
                    ? 'text-[8px]'
                    : 'text-[8px] sm:text-[12px]'
                }   text-black/70 select-none text-end`}
                dir="ltr"
              >
                {formatDate(post?.createdAt) || ''}
              </h1>
            )}
          </div>
        </Link>
      </div>
    </>
  );
}
