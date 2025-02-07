'use client';
import React from 'react';
import LoadingPhoto from './LoadingPhoto';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns'; // استيراد الدالة
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMdClose } from 'react-icons/io';
import { useSession } from 'next-auth/react';
import CustomToast from './CustomToast';
import toast from 'react-hot-toast';

export default function UserNameAndPhoto({ post }) {
  const path = usePathname();
  const session = useSession();
  console.log('post', post);
  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  async function handleDeletePost(post) {
    const response = await fetch(`/api/favoritePosts?id=${post?.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });

    if (response.ok) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={'تم حذف هذا البوست بنجاح'}
          greenEmoji={'✔'}
        />
      ));
      dispatch({ type: 'DELETE_POST', payload: post });
    } else {
      toast.custom((t) => (
        <CustomToast t={t} message={'😐 حدث خطأ ما'} redEmoji={'✖'} />
      ));
    }
  }
  return (
    <>
      {' '}
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
      <div className="flex justify-end items-center gap-2 w-full mb-4">
        {session?.status === 'authenticated' &&
          path.includes('favoritePosts') && (
            <div
              className={`px-1 py-[1px] flex flex-col items-center justify-center cursor-pointer  overflow-hidden rounded  hover:bg-one`}
              onClick={() => handleDeletePost(post)}
            >
              <IoMdClose className="" />
              <h6 className="text-[11px] select-none">حذف</h6>
            </div>
          )}
      </div>
    </>
  );
}
