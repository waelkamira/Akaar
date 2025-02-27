'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import dynamic from 'next/dynamic';
import ItemSmallItem from './ItemSmallItem';
import LoginButton from '../Buttons/LoginButton';

// استخدام dynamic لتحميل المكونات بشكل ديناميكي
const ImageSlider = dynamic(() => import('../photos/imageSlider'), {
  loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
});

const SyriaMap = dynamic(() => import('../map/SyriaMap'), {
  loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
});

const UserNameAndPhoto = dynamic(() => import('./userNameAndPhoto'), {
  loading: () => <Loading />, // عرض تحميل مؤقت أثناء التحميل
});

export default function Item({ fields }) {
  const session = useSession();
  const [iframeSrc, setIframeSrc] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && fields?.link) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = fields?.link;
      const iframeElement = tempDiv.querySelector('iframe');
      setIframeSrc(iframeElement ? iframeElement.getAttribute('src') : null);
    }
  }, [fields?.link]);

  return (
    <>
      <LoginButton />

      {session?.status === 'authenticated' && (
        <div className="flex flex-col justify-center items-center w-full h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          <div className="flex justify-center w-full ">
            <div className="flex flex-col w-full p-2 sm:p-8 my-2 bg-white border-t-[10px] border-one rounded-t-lg">
              <UserNameAndPhoto
                post={{
                  createdAt: fields?.createdAt,
                }}
              />

              <div className="flex justify-center w-full">
                <h1 className="sm:my-4 text-xl sm:text-3xl text-one font-medium select-none text-wrap line-clamp-1 max-w-[20ch] lg:max-w-[40ch] text-center">
                  {fields[0]?.title}
                </h1>
              </div>
              {!fields[1]?.image1 && (
                <Loading myMessage={'جاري تحميل الصورة'} />
              )}
              <ImageSlider
                image1={fields[1]?.image1}
                image2={fields[2]?.image2}
                image3={fields[3]?.image3}
                image4={fields[4]?.image4}
                image5={fields[5]?.image5}
              />

              <div className=" mt-4 sm:mt-16">
                <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                  <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                    <span className="text-one text-2xl mx-2 select-none">
                      #
                    </span>
                    مواصفات الإعلان:
                  </h1>
                </div>

                <div className="flex flex-col  w-full">
                  <div className="flex flex-col sm:grid md:grid-cols-2 sm:gap-x-4 w-full">
                    {/* عرض الحقول باستخدام map */}
                    {fields?.slice(6)?.map((field, index) => (
                      <ItemSmallItem
                        key={index}
                        icon={field.icon} // استخدام الأيقونة من الحقل
                        text={field.name} // اسم الحقل
                        value={field.value} // قيمة الحقل
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center my-4 lg:my-8  h-10 sm:h-16  w-full overflow-visible">
                    <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                      <span className="text-one text-2xl mx-2 select-none">
                        #
                      </span>
                      وصف الإعلان:
                    </h1>
                  </div>

                  <div className="bg-white  p-4 w-full rounded-[5px]">
                    <pre className="flex justify-start items-start bg-white rounded-[5px] h-72 overflow-y-auto text-md sm:text-xl w-full shadow-sm shadow-gray-300 min-h-20 my-2 p-2 select-none">
                      {fields?.description}
                    </pre>
                  </div>
                </div>

                {fields?.lng !== '' && fields?.lat !== '' && (
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
                      <SyriaMap lng={fields?.lng} lat={fields?.lat} />
                    </div>
                  </div>
                )}

                {(fields?.link || iframeSrc) && (
                  <div className="flex justify-between items-center my-4 sm:my-4 h-10 sm:h-16  w-full overflow-visible">
                    <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                      <span className="text-one text-2xl mx-2 select-none">
                        #
                      </span>
                      فيديو للإعلان:
                    </h1>
                  </div>
                )}
                <div className="flex justify-center items-center w-full">
                  <div className="flex flex-col w-full">
                    {(iframeSrc || fields?.link) && (
                      <div>
                        <iframe
                          src={iframeSrc || fields?.link}
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
