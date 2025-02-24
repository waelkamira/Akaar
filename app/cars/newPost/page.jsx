'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import CarsPostForm from '../../../components/Cars/CarsPostForm';
import { useSession } from 'next-auth/react';
import Button from '../../../components/Button';
import UploadingAndDisplayingImage from '../../../components/photos/UploadingAndDisplayingImage';
import CarsSideBar from '../../../components/Cars/CarsSideBar';
import CarsNavbar from '../../../components/Cars/CarsNavbar';
export default function NewCarPost() {
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  return (
    <div className="flex flex-col justify-center items-center w-full bg-five">
      <CarsNavbar />
      <CarsSideBar Button={false} />
      <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
        <div
          className={
            (session?.status === 'unauthenticated' ? 'h-fit ' : 'h-fit ') +
            ' relative border border-gray-300 rounded w-full flex flex-col items-start justify-center sm:flex-row top-0 overflow-hidden'
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className=" w-full h-full flex flex-col items-center justify-start grow z-40 bg-five">
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
                  أدخل بيانات السيارة التي تريد بيعها أو تأجيرها
                </h1>
                <UploadingAndDisplayingImage height={'h-96'} />

                <CarsPostForm
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
