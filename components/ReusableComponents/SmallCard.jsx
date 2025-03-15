'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingPhoto from '../photos/LoadingPhoto';
import FormatDate from './FormatDate';

export default function SmallCard({ item, category }) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [categoryFields, setCategoryFields] = useState([]);

  // دالة لتحويل القيم إلى النصوص المقابلة
  const getFieldValue = (field, value) => {
    if (field?.options && field.options[value]) {
      return field.options[value]; // إرجاع النص المقابل للقيمة
    }
    return value; // إذا لم يكن هناك خيارات، إرجاع القيمة كما هي
  };

  // جلب الحقول بناءً على الفئة
  useEffect(() => {
    if (category) {
      import(`../categoryFields/${category?.name}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
        });
    }
  }, [category]);

  return (
    <>
      {item && (
        <div
          className="flex flex-col justify-center items-center w-full cursor-pointer bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out rounded-lg overflow-hidden relative group"
          key={item?.id}
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('item', JSON.stringify(item));
              localStorage.setItem('category', JSON.stringify(category));
            }
            router.push(`/post/${item?.id}`);
          }}
        >
          {/* الصورة مع طبقة هوفر برتقالية */}
          <div className="relative w-full h-48">
            {!item?.image1 && <LoadingPhoto />}
            {item?.image1 && (
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={item?.image1}
                  fill
                  alt="item_photo"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            {/* الطبقة البرتقالية عند الهوفر */}
            <div className="absolute inset-0 bg-one/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="flex flex-col justify-between gap-2 w-full p-4 bg-white text-black rounded-b-lg">
            {item?.title && (
              <h1 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {item?.title?.split(' ').slice(0, 5).join(' ')}
              </h1>
            )}

            <div className="flex justify-between items-center">
              {/* {item?.city && (
                <h1 className="text-sm text-gray-600">{item?.city}</h1>
              )}
              {item?.basePrice > 0 && (
                <h1 className="text-xl font-bold text-green-600">
                  {item?.basePrice}
                  <span className="text-green-600 mx-1 select-none text-sm">
                    $
                  </span>
                </h1>
              )} */}
              {item?.description && (
                <h1 className="text-sm line-clamp-2">{item?.description}</h1>
              )}
            </div>

            {item?.createdAt && (
              <div className="absolute top-2 left-2 z-0 flex justify-center items-center bg-white/80 rounded-full px-2 py-1 shadow-sm text-xs text-gray-700">
                <FormatDate dateString={item?.createdAt} />
              </div>
            )}
          </div>

          {/* الحقول الإضافية */}
          <div className="w-full p-4 bg-gray-50 border-t border-gray-200">
            {categoryFields
              ?.slice(0, 2) // أخذ أول حقلين فقط
              ?.map((field, index) => {
                const value = item.details[field.name];
                const displayValue = getFieldValue(field, value);

                return (
                  <div
                    key={index} // مفتاح فريد لكل عنصر
                    className="flex items-center gap-2 mb-2 text-sm text-gray-700"
                  >
                    {field?.icon}{' '}
                    <h3>
                      <span className="text-gray-500">
                        {field?.label || field.name}
                      </span>
                      :{' '}
                      <span className="font-bold">
                        {' '}
                        {displayValue || 'غير محدد'}
                      </span>
                    </h3>
                  </div>
                );

                return null;
              })}
          </div>

          {/* أيقونة المفضلة */}
          <div
            className={`absolute top-2 right-2 ${
              isFavorited ? 'bg-red-500' : 'bg-white/80'
            } backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-100 transition-all duration-300 cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                isFavorited ? 'text-white' : 'text-gray-700 hover:text-red-500'
              }`}
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
      )}
    </>
  );
}
