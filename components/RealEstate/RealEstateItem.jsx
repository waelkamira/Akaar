'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '../Button';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Loading from '../ReusableComponents/Loading';
import { FaHouseDamage } from 'react-icons/fa';
import { RxSpaceEvenlyHorizontally, RxVideo } from 'react-icons/rx';
import { VscUngroupByRefType } from 'react-icons/vsc';
import { GiModernCity } from 'react-icons/gi';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { GiRotaryPhone } from 'react-icons/gi';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { FaTreeCity } from 'react-icons/fa6';
import dynamic from 'next/dynamic';
import LoginButton from '../Buttons/LoginButton';
// استخدام dynamic لتحميل المكونات بشكل ديناميكي
const ImageSlider = dynamic(() => import('../photos/imageSlider'), {
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

export default function RealEstateItem({ post }) {
  const session = useSession();
  const [iframeSrc, setIframeSrc] = useState(null);

  console.log('post', post);
  useEffect(() => {
    if (typeof window !== 'undefined' && post?.link) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post?.link;
      const iframeElement = tempDiv.querySelector('iframe');
      setIframeSrc(iframeElement ? iframeElement.getAttribute('src') : null);
    }
  }, [post?.link]);

  return (
    <>
      <LoginButton />
      {session?.status === 'authenticated' && (
        <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          <div className="flex items-center justify-center w-full ">
            <div className="flex flex-col w-full p-2 sm:p-8 my-2 bg-white border-t-[20px] border-one rounded-t-lg">
              <UserNameAndPhoto
                post={{
                  createdAt: post?.createdAt,
                }}
              />

              <div className="flex justify-center w-full">
                <h1 className="sm:my-4 text-xl sm:text-3xl text-one font-medium select-none text-wrap line-clamp-1 max-w-[20ch] lg:max-w-[40ch] text-center">
                  {post?.title}
                </h1>
              </div>
              {!post?.image1 && <Loading myMessage={'جاري تحميل الصورة'} />}
              <ImageSlider
                image1={post?.image1}
                image2={post?.image2}
                image3={post?.image3}
                image4={post?.image4}
                image={post?.image5}
              />

              <div className=" mt-4 sm:mt-16">
                <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                  <h1 className=" text-lg sm:text-xl w-full mb-2 select-none text-one">
                    <span className="text-one text-2xl mx-2 select-none">
                      #
                    </span>
                    المميزات:
                  </h1>
                </div>

                <div className="flex flex-col  w-full">
                  <div className="flex flex-col sm:grid md:grid-cols-2 sm:gap-x-4 w-full">
                    <h1 className="flex justify-start items-center bg-white rounded-[5px] shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <FaHouseDamage className="text-gray-500" />
                        اسم المعلن :
                      </span>
                      {session?.data?.user?.name}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white rounded-[5px] shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <GiModernCity className="text-gray-500" />
                        المدينة :
                      </span>
                      {post?.city}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white rounded-[5px] shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <FaTreeCity className="text-gray-500" />
                        اسم المنطقة :
                      </span>
                      {post?.town}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white rounded-[5px] shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <RxSpaceEvenlyHorizontally className="text-gray-500" />
                        نوع العقار :
                      </span>
                      {post?.details?.propertyType}
                    </h1>

                    <h1 className="flex justify-start items-center bg-white rounded-[5px] shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <MdOutlineBedroomParent className="text-gray-500" />
                        عدد الغرف :
                      </span>
                      {post?.details?.roomsNumber}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white rounded-[5px] shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <VscUngroupByRefType className="text-gray-500" />
                        المساحة :
                      </span>
                      {post?.details?.area}
                    </h1>
                    <h1 className="flex justify-start items-center bg-white rounded-[5px] shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <MdOutlinePriceCheck className="text-gray-500" />
                        السعر :
                      </span>
                      {post?.basePrice}
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        $
                      </span>
                    </h1>
                    <h1 className="flex justify-start items-center bg-white rounded-[5px] shadow-sm shadow-gray-300  text-md sm:text-xl w-full min-h-20 my-2 select-none">
                      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
                        <GiRotaryPhone className="text-gray-500" />
                        رقم الهاتف :
                      </span>
                      {post?.phoneNumber}
                    </h1>
                  </div>

                  <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                    <h1 className=" text-lg sm:text-xl w-full mb-2 select-none text-one">
                      <span className="text-one text-2xl mx-2 select-none">
                        #
                      </span>
                      الوصف:
                    </h1>
                  </div>

                  <p className="flex justify-start items-start bg-white rounded-[5px] h-72 overflow-y-auto text-md sm:text-xl w-full shadow-sm shadow-gray-300 min-h-20 my-2 p-2 select-none">
                    {post?.description}
                  </p>
                </div>
                {post?.lng !== '' && post?.lat !== '' && (
                  <div>
                    <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                      <h1 className=" text-lg sm:text-xl w-full mb-2 select-none text-one">
                        <span className="text-one text-2xl mx-2 select-none">
                          #
                        </span>
                        موقع العقار على الخريطة:
                      </h1>
                    </div>
                    <div className="">
                      <SyriaMap lng={post?.lng} lat={post?.lat} />
                    </div>
                  </div>
                )}
                {(post?.details?.link || iframeSrc) && (
                  <div className="w-full">
                    <div className="flex justify-between items-center my-4 sm:my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                      <h1 className=" text-lg sm:text-xl w-full mb-2 select-none text-one">
                        <span className="text-one text-2xl mx-2 select-none">
                          #
                        </span>
                        فيديو:
                      </h1>
                    </div>
                    (
                    <div>
                      <iframe
                        width="560"
                        height="315"
                        src={post?.link || iframeSrc}
                        frameBorder="0"
                        allowFullScreen
                        title="Embedded YouTube Video"
                        className=" w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px] rounded-[5px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
