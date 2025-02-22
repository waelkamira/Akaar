'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '../Button';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Loading from '../ReusableComponents/Loading';
import { FaHouseDamage } from 'react-icons/fa';
import { RxSpaceEvenlyHorizontally } from 'react-icons/rx';
import { VscUngroupByRefType } from 'react-icons/vsc';
import { GiModernCity } from 'react-icons/gi';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { GiRotaryPhone } from 'react-icons/gi';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { FaTreeCity } from 'react-icons/fa6';
import dynamic from 'next/dynamic';
import CarsItemSmallItem from './CarsItemSmallItem';
import { GiPathDistance } from 'react-icons/gi';
import LoginButton from '../Buttons/LoginButton';

// استخدام dynamic لتحميل المكونات بشكل ديناميكي
const ImageSlider = dynamic(() => import('../imageSlider'), {
  loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
});

const SyriaMap = dynamic(() => import('../map/SyriaMap'), {
  loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
});

const UserNameAndPhoto = dynamic(
  () => import('../ReusableComponents/userNameAndPhoto'),
  {
    loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
  }
);

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

  return (
    <>
      <LoginButton />

      {session?.status === 'authenticated' && (
        <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[80%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          <div className="flex justify-center w-full ">
            <div className="flex flex-col w-full p-2 sm:p-8 my-2 bg-white border-t-[10px] border-one rounded-t-lg">
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
                    <CarsItemSmallItem
                      icon={<FaHouseDamage className="text-gray-500" />}
                      text={'اسم المعلن'}
                      value={userName}
                    />

                    <CarsItemSmallItem
                      icon={<VscUngroupByRefType className="text-gray-500" />}
                      text={'ماركة السيارة'}
                      value={brand}
                    />

                    <CarsItemSmallItem
                      icon={
                        <MdOutlineBedroomParent className="text-gray-500" />
                      }
                      text={'موديل السيارة'}
                      value={model}
                    />

                    <CarsItemSmallItem
                      icon={
                        <MdOutlineBedroomParent className="text-gray-500" />
                      }
                      text={'الحالة'}
                      value={usedNew}
                    />

                    <CarsItemSmallItem
                      icon={
                        <RxSpaceEvenlyHorizontally className="text-gray-500" />
                      }
                      text={'نوع الإعلان'}
                      value={adType}
                    />

                    <CarsItemSmallItem
                      icon={<GiPathDistance className="text-gray-500" />}
                      text={'المسافة'}
                      value={distance}
                    />

                    <CarsItemSmallItem
                      icon={<GiModernCity className="text-gray-500" />}
                      text={'المدينة'}
                      value={city}
                    />

                    <CarsItemSmallItem
                      icon={<FaTreeCity className="text-gray-500" />}
                      text={'اسم المنطقة'}
                      value={town}
                    />

                    <CarsItemSmallItem
                      icon={<GiRotaryPhone className="text-gray-500" />}
                      text={'رقم الهاتف'}
                      value={phoneNumber}
                    />

                    <CarsItemSmallItem
                      icon={<MdOutlinePriceCheck className="text-gray-500" />}
                      text={'السعر'}
                      value={price}
                    />
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
                    <pre className="flex justify-start items-start bg-white rounded-[5px] h-72 overflow-y-auto text-md sm:text-xl w-full shadow-sm shadow-gray-300 min-h-20 my-2 p-2 select-none">
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
                    <div>
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
