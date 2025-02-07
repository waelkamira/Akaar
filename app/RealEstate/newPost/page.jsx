'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import RealEstatePostForm from '../../../components/RealEstate/RealEstatePostForm';
import { useSession } from 'next-auth/react';
import Button from '../../../components/Button';
import UploadingAndDisplayingImage from '../../../components/UploadingAndDisplayingImage';
import MiddleBarAndPhoto from '../../../components/middleBarAndPhoto';
import RealEstateNavbar from '../../../components/navbars/RealEstarteNavbar';

export default function NewRealEstatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <RealEstateNavbar />
      <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
        <MiddleBarAndPhoto
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          noButton={false}
        />

        <div
          className={
            (session?.status === 'unauthenticated' ? 'h-fit ' : 'h-fit ') +
            ' relative border border-gray-500 rounded w-full flex flex-col items-start mt-16 justify-center sm:flex-row top-0 overflow-hidden'
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className=" w-full h-full flex flex-col items-center justify-start grow z-40 mt-16">
            <div className="flex flex-col w-full justify-center items-center">
              <div className="relative size-20 xl:h-44 xl:w-44 mt-2 ">
                <Image
                  priority
                  src={'https://i.imgur.com/5pvgiAk.png'}
                  fill
                  alt="decoration"
                  className="m-0"
                />
              </div>
            </div>

            {session?.status === 'unauthenticated' && (
              <div className="p-4   m-2 md:m-8 border border-gray-500 text-center">
                <h1 className="text-lg md:text-2xl p-2  ">
                  يجب عليك تسجيل الدخول أولا لكي تتمكن من إنشاء إعلان جديد
                </h1>

                <Button title={'تسجيل الدخول'} path="/login" style={' '} />
              </div>
            )}
            {session?.status === 'authenticated' && (
              <div className="w-full p-2">
                <h1 className="w-full text-center  text-sm md:text-lg my-4">
                  أدخل بيانات العقار الذي تريد بيعه أو تأجيره
                </h1>
                <UploadingAndDisplayingImage height={'h-96'} />

                <RealEstatePostForm
                  setIsVisible={setIsVisible}
                  isVisible={isVisible}
                  cancel={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
