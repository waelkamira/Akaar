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

export default function Item({
  phoneNumber,
  createdAt,
  description,
  image,
  image1,
  image2,
  image3,
  image4,
  lng,
  lat,
  link,
  propertyArea,
  propertyCity,
  propertyTown,
  propertyName,
  propertyPrice,
  propertyType,
  propertyRoomsNumber,
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
        <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          {/* <div className="relative flex justify-between items-center w-full gap-2 my-2 bg-one p-1 md:p-2 rounded">
            <div>
              <TfiMenuAlt
                className="text-[30px] lg:text-5xl  cursor-pointer"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              />
              <div className="absolute top-14 lg:top-20 right-0 z-50">
                {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
              </div>
            </div>

            <BackButton />
          </div> */}

          <div className="flex justify-center w-full ">
            <div className="flex flex-col w-full p-2 sm:p-8 my-2 bg-gray-100 border-t-[20px] border-one rounded-t-lg">
              <UserNameAndPhoto
                post={{
                  userImage: userImage,
                  userName: userName,
                  createdAt: createdAt,
                }}
              />

              <div className="flex justify-center w-full">
                <h1 className="sm:my-4 text-xl sm:text-3xl text-one font-medium select-none text-wrap line-clamp-1 max-w-[20ch] lg:max-w-[40ch] text-center">
                  {propertyName}
                </h1>
              </div>
              {!image && <Loading myMessage={'جاري تحميل الصورة'} />}
              <ImageSlider
                image={image}
                image1={image1}
                image2={image2}
                image3={image3}
                image4={image4}
              />

              <div className=" mt-4 sm:mt-16">
                <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                  <h1 className=" text-lg sm:text-xl w-full mb-2 select-none">
                    <span className="text-one text-2xl mx-2 select-none">
                      #
                    </span>
                    المميزات:
                  </h1>
                </div>

                <div className="flex flex-col  w-full">
                  <div className="flex flex-col sm:grid md:grid-cols-2 sm:gap-x-4 w-full">
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <FaHouseDamage className="text-gray-500" />
                        اسم المعلن :
                      </span>
                      {userName}{' '}
                    </h1>

                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <GiModernCity className="text-gray-500" />
                        المدينة :
                      </span>
                      {propertyCity}{' '}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <FaTreeCity className="text-gray-500" />
                        اسم المنطقة :
                      </span>
                      {propertyTown}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <RxSpaceEvenlyHorizontally className="text-gray-500" />
                        نوع العقار :
                      </span>
                      {propertyType}{' '}
                    </h1>
                    {(propertyType === 'بيت' ||
                      propertyType === 'شقة' ||
                      propertyType === 'فيلا') && (
                      <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                        <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                          <MdOutlineBedroomParent className="text-gray-500" />
                          عدد الغرف :
                        </span>
                        {propertyRoomsNumber}{' '}
                      </h1>
                    )}
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <VscUngroupByRefType className="text-gray-500" />
                        المساحة :
                      </span>
                      {propertyArea}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <MdOutlinePriceCheck className="text-gray-500" />
                        السعر :
                      </span>
                      {propertyPrice}{' '}
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        $
                      </span>{' '}
                    </h1>

                    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <GiRotaryPhone className="text-gray-500" />
                        رقم الهاتف :
                      </span>
                      {phoneNumber}
                    </h1>
                    {/* <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                        <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                  
                        </span>
                      </h1> */}
                  </div>

                  <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                    <h1 className=" text-lg sm:text-xl w-full mb-2 select-none">
                      <span className="text-one text-2xl mx-2 select-none">
                        #
                      </span>
                      الوصف:
                    </h1>
                  </div>

                  <div className="bg-white  p-4 w-full">
                    <pre className="text-sm sm:text-lg text-start w-full select-none h-72 overflow-y-auto">
                      {description}
                    </pre>
                  </div>
                </div>
                {lng !== '' && lat !== '' && (
                  <div>
                    <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                      <h1 className=" text-lg sm:text-xl w-full mb-2 select-none">
                        <span className="text-one text-2xl mx-2 select-none">
                          #
                        </span>
                        موقع العقار على الخريطة:
                      </h1>
                    </div>
                    <div className="border border-one">
                      <SyriaMap lng={lng} lat={lat} />
                    </div>{' '}
                  </div>
                )}
                {(link || iframeSrc) && (
                  <div className="flex justify-between items-center my-4 sm:my-4 lg:my-16  h-10 sm:h-16  w-full overflow-visible">
                    <h1 className=" text-lg sm:text-xl w-full mb-2 select-none">
                      <span className="text-one text-2xl mx-2 select-none">
                        #
                      </span>
                      فيديو:
                    </h1>
                  </div>
                )}
                <div className="flex justify-center items-center w-full mt-16">
                  <div className="flex flex-col  w-full">
                    {/* Content rendering logic */}
                    {iframeSrc && (
                      <div className="mt-4">
                        <iframe
                          src={iframeSrc}
                          className="w-full h-44"
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
