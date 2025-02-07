'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import PostForm from './RealEstate/RealEstatePostForm';
import { useSession } from 'next-auth/react';
import Button from './Button';
import UploadingAndDisplayingImage from './UploadingAndDisplayingImage';

export default function NewPostButton() {
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();

  return (
    <div className="w-full  z-50 ">
      <Button
        title={'إنشاء إعلان جديد'}
        style={' '}
        onClick={() => setIsVisible(true)}
      />

      {isVisible && (
        <div
          className="absolute flex justify-center items-start gap-4 overflow-auto w-full h-full border md:p-8 /95 border-five right-0 top-0 2xl:-top-8  z-50"
          onClick={() => setIsVisible(false)}
        >
          <div
            className="absolute top-2 right-2 sm:top-16 sm:right-16 flex justify-center items-center z-50 bg-five hover:bg-one cursor-pointer h-fit px-4 py-1  font-semibold  hover:scale-105 shadow-sm shadow-gray-300  "
            onClick={() => setIsVisible(false)}
          >
            <h1 className="tex-sm">إغلاق</h1>
            <RxCross2 className="text-xl" />
          </div>
          <div
            className={
              (session?.status === 'unauthenticated'
                ? 'h-[700px]'
                : 'h-[1700px]') +
              ' relative w-full 2xl:w-2/3 flex flex-col items-start justify-center sm:flex-row 2xl:my-8 top-0 z-40 overflow-hidden border border-one '
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute w-full h-full flex flex-col items-center justify-start  grow z-50  ">
              <div className="relative h-24 sm:h-28 w-36 my-2 ">
                <Image
                  priority
                  src={'https://i.imgur.com/rXaNY0v.png'}
                  fill
                  alt="decoration"
                  className="m-0"
                />
              </div>
              {session?.status === 'unauthenticated' && (
                <div className="p-4   m-2 md:m-8 border border-one text-center">
                  <h1 className="text-lg md:text-2xl p-2  ">
                    يجب عليك تسجيل الدخول أولا لكي تتمكن من إنشاء إعلان جديد
                  </h1>{' '}
                  <Button title={'تسجيل الدخول'} path={'/login'} style={' '} />
                </div>
              )}
              {session?.status === 'authenticated' && (
                <div className="w-full p-2">
                  <UploadingAndDisplayingImage height={'h-96'} />
                  <PostForm setIsVisible={setIsVisible} isVisible={isVisible} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
