'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '../Button';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Loading from '../Loading';
import { FaHouseDamage } from 'react-icons/fa';
import { RxSpaceEvenlyHorizontally } from 'react-icons/rx';
import { VscUngroupByRefType } from 'react-icons/vsc';
import { GiModernCity } from 'react-icons/gi';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { GiRotaryPhone } from 'react-icons/gi';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { FaTreeCity } from 'react-icons/fa6';
import dynamic from 'next/dynamic';

// استخدام dynamic لتحميل المكونات بشكل ديناميكي
const ImageSlider = dynamic(() => import('../imageSlider'), {
  loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
});

const SyriaMap = dynamic(() => import('../map/SyriaMap'), {
  loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
});

const UserNameAndPhoto = dynamic(() => import('../userNameAndPhoto'), {
  loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
});

export default function CarsItem({
  phoneNumber,
  createdAt,
  description,
  image1,
  image2,
  image3,
  image4,
  image5,
  lng,
  lat,
  link,
  brand,
  city,
  town,
  title,
  price,
  adType,
  model,
  usedNew,
  distance,
  userImage,
  userName,
}) {
  const session = useSession();
  const [iframeSrc, setIframeSrc] = useState(null);

  console.log('userName', userName);
  useEffect(() => {
    if (typeof window !== 'undefined' && link) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = link;
      const iframeElement = tempDiv.querySelector('iframe');
      setIframeSrc(iframeElement ? iframeElement.getAttribute('src') : null);
    }
  }, [link]);
  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <>
      {session?.status === 'unauthenticated' && (
        <div className="p-4   m-2 md:m-8 border border-one text-center h-screen">
          <h1 className="text-lg md:text-2xl p-2 my-8 ">
            يجب عليك تسجيل الدخول أولا لرؤية هذا الإعلان
          </h1>
          <Link href={'/login'}>
            <Button title={'تسجيل الدخول'} />
          </Link>
        </div>
      )}
      {session?.status === 'authenticated' && (
        <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[80%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          <div className="flex justify-center w-full ">
            <div className="flex flex-col w-full p-2 sm:p-8 my-2 bg-three border-t-[10px] border-one rounded-t-lg">
              <UserNameAndPhoto
                post={{
                  userImage: userImage,
                  userName: userName,
                  createdAt: createdAt,
                }}
              />

              <div className="flex justify-center w-full">
                <h1 className="sm:my-4 text-xl sm:text-3xl text-one font-medium select-none text-wrap line-clamp-1 max-w-[20ch] lg:max-w-[40ch] text-center">
                  {title}
                </h1>
              </div>
              {!image1 && <Loading myMessage={'جاري تحميل الصورة'} />}
              <ImageSlider
                image1={image1}
                image2={image2}
                image3={image3}
                image4={image4}
                image5={image5}
              />

              <div className=" mt-4 sm:mt-16">
                <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                  <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                    <span className="text-one text-2xl mx-2 select-none">
                      #
                    </span>
                    مواصفات السيارة:
                  </h1>
                </div>

                <div className="flex flex-col  w-full">
                  <div className="flex flex-col sm:grid md:grid-cols-2 sm:gap-x-4 w-full">
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <FaHouseDamage className="text-gray-500" />
                        اسم المعلن :
                      </span>
                      {userName}
                    </h1>

                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <VscUngroupByRefType className="text-gray-500" />
                        ماركة السيارة :
                      </span>
                      {brand}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <MdOutlineBedroomParent className="text-gray-500" />
                        موديل السيارة :
                      </span>
                      {model}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <MdOutlineBedroomParent className="text-gray-500" />
                        الحالة :
                      </span>
                      {usedNew}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <RxSpaceEvenlyHorizontally className="text-gray-500" />
                        نوع الإعلان :
                      </span>
                      {adType}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <FaHouseDamage className="text-gray-500" />
                        المسافة :
                      </span>
                      {distance}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <GiModernCity className="text-gray-500" />
                        المدينة :
                      </span>
                      {city}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <FaTreeCity className="text-gray-500" />
                        اسم المنطقة :
                      </span>
                      {town}
                    </h1>

                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2">
                        <GiRotaryPhone className="text-gray-500" />
                        رقم الهاتف :
                      </span>
                      {phoneNumber}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <MdOutlinePriceCheck className="text-gray-500" />
                        السعر :
                      </span>
                      {price}
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        $
                      </span>
                    </h1>
                  </div>

                  <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                    <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                      <span className="text-one text-2xl mx-2 select-none">
                        #
                      </span>
                      وصف السيارة:
                    </h1>
                  </div>

                  <div className="bg-white  p-4 w-full rounded-[5px]">
                    <pre className="text-sm sm:text-lg text-start w-full select-none h-72 overflow-y-auto">
                      {description}
                    </pre>
                  </div>
                </div>
                {lng !== '' && lat !== '' && (
                  <div>
                    <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                      <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                        <span className="text-one text-2xl mx-2 select-none">
                          #
                        </span>
                        الموقع على الخريطة:
                      </h1>
                    </div>
                    <div className="border border-one">
                      <SyriaMap lng={lng} lat={lat} />
                    </div>
                  </div>
                )}
                {(link || iframeSrc) && (
                  <div className="flex justify-between items-center my-4 sm:my-4 h-10 sm:h-16  w-full overflow-visible">
                    <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                      <span className="text-one text-2xl mx-2 select-none">
                        #
                      </span>
                      فيديو للسيارة:
                    </h1>
                  </div>
                )}
                <div className="flex justify-center items-center w-full">
                  <div className="flex flex-col w-full">
                    {(iframeSrc || link) && (
                      <div>
                        <iframe
                          src={iframeSrc || link}
                          className="w-full h-44 sm:h-96"
                          title="Property Video"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
