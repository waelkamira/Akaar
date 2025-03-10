'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingPhoto from '../photos/LoadingPhoto';
import FormatDate from './FormatDate';

export default function SmallCard({ item, categoryName }) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [categoryFields, setCategoryFields] = useState([]);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || categoryName;

  // console.log('item', item);

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
      import(`../categoryFields/${category}.jsx`)
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

          {/* التفاصيل */}
          <div className="flex flex-col justify-between gap-2 w-full p-4 bg-white text-black rounded-b-lg">
            {/* العنوان */}
            <h1 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {item?.title?.split(' ').slice(0, 3).join(' ')}
            </h1>

            {/* السعر والمدينة */}
            <div className="flex justify-between items-center">
              <h1 className="text-sm text-gray-600">{item?.city}</h1>
              <h1 className="text-xl font-bold text-green-600">
                {item?.basePrice}{' '}
                <span className="text-green-600 mx-1 select-none text-sm">
                  $
                </span>
              </h1>
            </div>

            {/* تاريخ الإنشاء */}
            <div className="absolute top-2 left-2 z-0 flex justify-center items-center bg-white/80 rounded-full px-2 py-1 shadow-sm text-xs text-gray-700">
              <FormatDate dateString={item?.createdAt} />
            </div>
          </div>

          <div className="w-full p-4 bg-gray-50 border-t border-gray-200">
            {categoryFields
              ?.slice(0, 2) // أخذ أول حقلين فقط
              ?.map((field, index) => {
                // 1. التحقق من وجود الحقل في `item.details`
                if (item?.details && item.details.hasOwnProperty(field.name)) {
                  // 2. الحصول على قيمة الحقل من `item.details`
                  const value = item.details[field.name];

                  // 3. تحويل القيمة إلى النص المقابل باستخدام `getFieldValue` إذا كان الحقل يحتوي على خيارات (`options`)
                  const displayValue = getFieldValue(field, value);

                  // 4. عرض الحقل والقيمة
                  return (
                    <div
                      key={index} // مفتاح فريد لكل عنصر
                      className="flex items-center gap-2 mb-2 text-sm text-gray-700"
                    >
                      {field?.icon}{' '}
                      {/* 5. عرض الأيقونة المقابلة للحقل إذا كانت موجودة */}
                      <p>
                        {field?.label || field.name}: {displayValue}{' '}
                        {/* 6. عرض اسم الحقل (`label`) أو المفتاح (`name`) والقيمة (`displayValue`) */}
                      </p>
                    </div>
                  );
                }

                // 7. إذا لم يكن الحقل موجودًا في `item.details`، لا يتم عرضه
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
