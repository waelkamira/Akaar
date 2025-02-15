'use client';
import React from 'react';
import LoadingPhoto from './LoadingPhoto';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns'; // استيراد الدالة
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UserNameAndPhoto({ post }) {
  const path = usePathname();
  // console.log('post', post);
  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <>
      <div className="flex justify-start items-center gap-2 w-full mb-4">
        <Link
          href={'/profile'}
          className="cursor-pointer flex justify-start items-center gap-2 w-fit h-fit "
        >
          <div
            className={`relative ${
              path.includes('myPosts') || path.includes('favoritePosts')
                ? 'size-8'
                : 'size-8 sm:size-12 lg:size-14'
            } overflow-hidden rounded`}
          >
            {![post?.userImage] && <LoadingPhoto />}
            {[post?.userImage] && (
              <Image priority src={post?.userImage} fill alt={post?.userName} />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h6
              className={`${
                path.includes('myPosts') || path.includes('favoritePosts')
                  ? 'text-[11px]'
                  : 'text-[11px] sm:text-[15px]'
              }  text-eight select-none`}
            >
              {post?.userName}
            </h6>
            <h1
              className={`${
                path.includes('myPosts') || path.includes('favoritePosts')
                  ? 'text-[8px]'
                  : 'text-[8px] sm:text-[12px]'
              }   text-gray-400 select-none text-end`}
              dir="ltr"
            >
              {formatDate(post?.createdAt)}
            </h1>
          </div>
        </Link>
      </div>
    </>
  );
}
