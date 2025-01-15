'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Button from './Button';
import BackButton from './BackButton';
import SideBarMenu from './SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Loading from './Loading';
import LoadingPhoto from './LoadingPhoto';
import ImageSlider from './imageSlider';
import SyriaMap from './map/SyriaMap';

export default function Item({
  contactPhoneNumber,
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
  propertyName,
  propertyPrice,
  propertyType,
  userImage,
  userName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const videoRef = useRef(null); // Add a ref to the iframe element

  //? src نريد ان نستخرج منه قيمة ال string لكنه نص  ifram html الذي هو عبارة عن عنصر  link انشأنا ديف مؤقت لوضع ال
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = link;

  //? داخل هذا الديف iframe بحثنا عن اول
  let iframeElement = tempDiv.querySelector('iframe');

  //? موجود ifram اذا كان عنصر ال src استخرجنا قيمة ال
  let iframeSrc = iframeElement ? iframeElement.getAttribute('src') : null;

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
        <div className="p-4 bg-four rounded-lg m-2 md:m-8 border border-one text-center h-screen">
          <h1 className="text-lg md:text-2xl p-2 my-8 text-white">
            يجب عليك تسجيل الدخول أولا لرؤية هذا الإعلان
          </h1>
          <Link href={'/login'}>
            <Button title={'تسجيل الدخول'} />
          </Link>
        </div>
      )}
      {session?.status === 'authenticated' && (
        <div className="relative flex flex-col items-start w-full bg-four h-full p-2 lg:p-4 rounded-lg">
          <BackButton />
          <div className="absolute flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
            <TfiMenuAlt
              className=" p-1 rounded-lg text-4xl lg:text-5xl text-one cursor-pointer z-50  animate-pulse"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>

          <div className="flex justify-center w-full">
            <div className="flex flex-col w-full 2xl:w-2/3 rounded-lg p-2 sm:p-8 mt-8 bg-white border-t-[20px] border-one">
              <div className="flex justify-start items-center gap-2 w-full mb-4">
                <div className="relative size-14 overflow-hidden rounded-xl">
                  {!userImage && <LoadingPhoto />}
                  {userImage && (
                    <Image priority src={userImage} fill alt={propertyName} />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h6 className="text-[13px] sm:text-[18px] text-eight select-none">
                    {userName}
                  </h6>
                  <h1
                    className="text-[8px] sm:text-[12px] text-gray-400 select-none text-end"
                    dir="ltr"
                  >
                    {formatDate(createdAt)}
                  </h1>
                </div>
              </div>
              <h1 className="text-one my-4 sm:my-8 text-3xl sm:text-4xl lg:text-5xl text-center select-none  rounded-lg p-2 sm:p-4">
                {propertyName}
              </h1>
              {!image && <Loading myMessage={'جاري تحميل الصورة'} />}
              <ImageSlider
                image={image}
                image1={image1}
                image2={image2}
                image3={image3}
                image4={image4}
              />

              <div className="bg-white rounded-lg mt-4 sm:mt-16">
                <div className="flex justify-between items-center my-4 sm:my-8 lg:my-16 bg-four h-10 sm:h-16 rounded-lg w-full overflow-visible">
                  <h1 className="text-white  text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      #
                    </span>
                    الوصف
                  </h1>
                </div>
                <div className="text-black">
                  <h1 className=" text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      اسم المعلن :
                    </span>
                    {userName}{' '}
                  </h1>
                  <h1 className=" text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      نوع العقار :
                    </span>
                    {propertyType}{' '}
                  </h1>

                  <h1 className=" text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      المدينة :
                    </span>
                    {propertyCity}{' '}
                  </h1>
                  <h1 className=" text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      المساحة :
                    </span>
                    {propertyArea}
                  </h1>
                  <h1 className=" text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      السعر :
                    </span>
                    {propertyPrice}
                  </h1>
                  <h1 className=" text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      رقم الهاتف :
                    </span>
                    {contactPhoneNumber}
                  </h1>
                  <h1 className=" text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      الوصف :
                    </span>
                    {description}
                  </h1>
                </div>
                {lng !== '' && lat !== '' && <SyriaMap lng={lng} lat={lat} />}
                {(link || iframeSrc) && (
                  <div className="flex justify-between items-center my-4 sm:my-8 lg:my-16 bg-four h-10 sm:h-16 rounded-lg w-full overflow-visible">
                    <h1 className="text-white  text-2xl lg:text-3xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      فيديو
                    </h1>
                  </div>
                )}
                <div className="flex justify-center items-center w-full mt-16">
                  {iframeSrc && (
                    <div className>
                      <iframe
                        src={iframeSrc}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowfullscreen
                        referrerpolicy="strict-origin-when-cross-origin"
                        className={
                          ' rounded-lg w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px]'
                        }
                      />
                    </div>
                  )}

                  {!iframeSrc && (
                    <div className=" flex flex-col items-center justify-center w-full">
                      <iframe
                        src={link}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowfullscreen
                        referrerpolicy="strict-origin-when-cross-origin"
                        className={
                          ' rounded-lg w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px]'
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
