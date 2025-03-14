'use client';
import Image from 'next/image';
import React, { useContext } from 'react';
import LoadingPhoto from '../photos/LoadingPhoto';
import { inputsContext } from '../authContext/Context';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import FormatDate from '../ReusableComponents/FormatDate';
export default function CarsSmallCard({ item }) {
  const { dispatch } = useContext(inputsContext);
  const router = useRouter();

  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   if (isNaN(date)) return 'تاريخ غير صالح';

  //   const diffInMs = Date.now() - date.getTime();
  //   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  //   const diffInDays = Math.floor(diffInHours / 24);

  //   if (diffInHours < 24) {
  //     return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعة'}`;
  //   } else {
  //     return `منذ ${diffInDays} ${diffInDays === 1 ? 'يوم' : 'يوم'}`;
  //   }
  // };

  return (
    <div
      className="flex flex-col justify-center items-center w-full cursor-pointer bg-one hover:scale-[103%] transition-transform duration-300 ease-in-out overflow-hidden hover:shadow-xl relative"
      key={item?.id}
      onClick={() => {
        dispatch({ type: 'POST_ID', payload: item?.id });
        router.push(`/Cars/post`);
      }}
    >
      {/* الصورة */}
      <div className="relative w-full h-44">
        {!item?.image1 && <LoadingPhoto />}
        {item?.image1 && (
          <Image
            src={item?.image1}
            fill
            alt="item_photo"
            className="object-cover transition-opacity duration-300 hover:opacity-90"
          />
        )}
        {/* طبقة المثلث البرتقالي الشفاف */}
        {/* <div className="absolute inset-0 w-full h-full clip-triangle-right bg-white/20"></div> */}
      </div>

      {/* طبقة تظليل فوق الصورة */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}

      {/* التفاصيل */}
      <div className="flex justify-evenly gap-2 items-center w-full mt-2 text-sm sm:text-md p-3 bg-white text-black">
        <h1 className="">
          {item?.brand?.match(/[\u0600-\u06FF\s]+/g)?.join('')}
        </h1>{' '}
        <h1 className="flex justify-center items-center">
          {item?.price}
          <span className="text-one mx-1 select-none">$</span>
        </h1>
        <h1 className="flex justify-center items-center">{item?.city}</h1>
        <h1 className="flex justify-center items-center">
          {<FormatDate dateString={item?.createdAt} />}
        </h1>
      </div>

      {/* أيقونة تفاعلية */}
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-all duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700 hover:text-gray-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
    </div>
  );
}
