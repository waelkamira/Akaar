'use client';
import React from 'react';
import LoadingPhoto from './LoadingPhoto';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns'; // استيراد الدالة
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserNameAndPhoto({ userImage, userName, createdAt }) {
  const path = usePathname();
  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="flex justify-start items-center gap-2 w-full mb-4">
      <Link
        href={'/profile'}
        className="cursor-pointer flex justify-start items-center gap-2 w-fit h-fit "
      >
        <div
          className={`relative ${
            path.includes('myPosts') ? 'size-8' : 'size-8 sm:size-12 lg:size-14'
          } overflow-hidden rounded-[5px]`}
        >
          {![userImage] && <LoadingPhoto />}
          {[userImage] && (
            <Image priority src={userImage} fill alt={userName} />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h6
            className={`${
              path.includes('myPosts')
                ? 'text-[11px]'
                : 'text-[11px] sm:text-[15px]'
            }  text-eight select-none`}
          >
            {userName}
          </h6>
          <h1
            className={`${
              path.includes('myPosts')
                ? 'text-[8px]'
                : 'text-[8px] sm:text-[12px]'
            }   text-gray-400 select-none text-end`}
            dir="ltr"
          >
            {formatDate(createdAt)}
          </h1>
        </div>
      </Link>
    </div>
  );
}
