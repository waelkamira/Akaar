'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Loading from '../../../components/ReusableComponents/Loading';
import dynamic from 'next/dynamic';
import ItemSmallItem from '../../../components/ReusableComponents/ItemSmallItem';
import {
  FaTag,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaPhone,
  FaVideo,
} from 'react-icons/fa';

// تحميل المكونات بشكل ديناميكي
const ImageSlider = dynamic(
  () => import('../../../components/photos/imageSlider'),
  {
    loading: () => <Loading />,
  }
);

const SyriaMap = dynamic(() => import('../../../components/map/SyriaMap'), {
  loading: () => <Loading />,
});

const UserNameAndPhoto = dynamic(
  () => import('../../../components/ReusableComponents/userNameAndPhoto'),
  {
    loading: () => <Loading />,
  }
);

export default function Page() {
  const [post, setPost] = useState({});
  const [iframeSrc, setIframeSrc] = useState(null);
  const session = useSession();
  const [categoryFields, setCategoryFields] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = JSON.parse(localStorage.getItem('item'));
      const categoryName = JSON.parse(localStorage.getItem('category'));

      console.log('item', item);
      console.log('categoryName', categoryName?.name);
      setPost(item);
      setCategory(categoryName?.name);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && post?.link) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post?.link;
      const iframeElement = tempDiv.querySelector('iframe');
      setIframeSrc(iframeElement ? iframeElement.getAttribute('src') : null);
    }
  }, [post?.link]);

  // جلب الحقول بناءً على الفئة
  useEffect(() => {
    if (category) {
      import(`../../../components/categoryFields/${category}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
          setError('فشل في تحميل الحقول');
        });
    }
  }, [category]);

  // دالة لتحويل القيم إلى النصوص المقابلة
  const getFieldValue = (field, value) => {
    if (field.options && field.options[value]) {
      return field.options[value]; // إرجاع النص المقابل للقيمة
    }
    return value; // إذا لم يكن هناك خيارات، إرجاع القيمة كما هي
  };

  // الحقول المشتركة
  const commonFields = [
    {
      name: 'العنوان',
      icon: <FaTag className="text-one text-lg sm:text-xl" />,
      value: post?.title,
    },
    {
      name: 'تاريخ الإعلان',
      icon: <FaClock className="text-one text-lg sm:text-xl" />,
      value: post?.createdAt,
    },
    {
      name: 'السعر',
      icon: <FaDollarSign className="text-one text-lg sm:text-xl" />,
      value: post?.basePrice,
    },

    {
      name: 'المدينة',
      icon: <FaMapMarkerAlt className="text-one text-lg sm:text-xl" />,
      value: post?.city,
    },
    {
      name: 'المنطقة',
      icon: <FaMapMarkerAlt className="text-one text-lg sm:text-xl" />,
      value: post?.town,
    },
    {
      name: 'رقم الهاتف',
      icon: <FaPhone className="text-one text-lg sm:text-xl" />,
      value: post?.phoneNumber,
    },
  ];

  // دمج الحقول المشتركة مع الحقول الخاصة بالفئة
  const fields = [
    ...commonFields,
    ...categoryFields, // الحقول الخاصة بالفئة
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full bg-five mt-16 text-black">
      {post && (
        <div className="w-full xl:w-[80%] 2xl:w-[70%] p-3 bg-gray-100">
          {session?.status === 'authenticated' && (
            <div className="flex flex-col justify-center items-center w-full h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
              <div className="flex justify-center w-full">
                <div className="flex flex-col w-full p-2 sm:p-8 my-2 bg-white border-t-[10px] border-one rounded-t-lg">
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
                    image5={post?.image5}
                  />

                  <div className="mt-4 sm:mt-16">
                    <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
                      <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                        <span className="text-one text-2xl mx-2 select-none">
                          #
                        </span>
                        مواصفات الإعلان:
                      </h1>
                    </div>

                    <div className="flex flex-col w-full">
                      <div className="flex flex-col sm:grid md:grid-cols-2 sm:gap-x-4 w-full">
                        {fields.map((field, index) => {
                          const value =
                            post?.details?.[field?.name] || field?.value;
                          const displayValue = getFieldValue(field, value);

                          return (
                            <ItemSmallItem
                              key={index}
                              icon={field?.icon}
                              text={field?.label || field?.name}
                              value={displayValue}
                            />
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
                        <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                          <span className="text-one text-2xl mx-2 select-none">
                            #
                          </span>
                          وصف الإعلان:
                        </h1>
                      </div>

                      <div className="bg-white p-4 w-full rounded-[5px]">
                        <pre className="flex justify-start items-start bg-white rounded-[5px] h-72 overflow-y-auto text-md sm:text-xl w-full shadow-sm shadow-gray-300 min-h-20 my-2 p-2 select-none">
                          {post?.description}
                        </pre>
                      </div>
                    </div>

                    {post?.lng && post?.lat && (
                      <div>
                        <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
                          <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                            <span className="text-one text-2xl mx-2 select-none">
                              #
                            </span>
                            الموقع على الخريطة:
                          </h1>
                        </div>
                        <div>
                          <SyriaMap lng={post?.lng} lat={post?.lat} />
                        </div>
                      </div>
                    )}

                    {(post?.link || iframeSrc) && (
                      <div>
                        <div className="flex justify-between items-center my-4 sm:my-4 h-10 sm:h-16 w-full overflow-visible">
                          <h1 className="text-one font-bold text-lg sm:text-xl w-full mb-2 select-none">
                            <span className="text-one text-2xl mx-2 select-none">
                              #
                            </span>
                            الفيديو :
                          </h1>
                        </div>
                        <div className="flex justify-center items-center w-full">
                          <div className="flex flex-col w-full">
                            <iframe
                              src={iframeSrc || post?.link}
                              className="w-full h-44 sm:h-96"
                              title="Property Video"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
