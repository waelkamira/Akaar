'use client';
import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { inputsContext } from '../Context';
import { useRouter } from 'next/navigation';
import LoadingPhoto from '../photos/LoadingPhoto';
import FormatDate from './FormatDate';
import categoryFields from '../Categories/categoryFields';

export default function SmallCard({ item }) {
  const { dispatch } = useContext(inputsContext);
  const router = useRouter();
  const session = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const fields = categoryFields[item?.category] || [];

  return (
    <div
      className="flex flex-col justify-center items-center w-full cursor-pointer bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out rounded-lg overflow-hidden relative"
      key={item?.id}
      onClick={() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('item', JSON.stringify(item));
        }
        router.push('/post');
      }}
    >
      {/* الصورة */}
      <div className="relative w-full h-48">
        {!item?.image1 && <LoadingPhoto />}
        {item?.image1 && (
          <Image
            src={item?.image1}
            fill
            alt="item_photo"
            className="object-cover transition-transform duration-300 hover:scale-105 rounded-t-lg"
          />
        )}
      </div>

      {/* التفاصيل */}
      <div className="flex flex-col justify-between gap-2 w-full p-4 bg-white text-black rounded-b-lg">
        {/* العنوان */}
        <h1 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {item?.title}
        </h1>

        {/* السعر والمدينة */}
        <div className="flex justify-between items-center">
          <h1 className="text-sm text-gray-600">{item?.city}</h1>
          <h1 className="text-xl font-bold text-green-600">
            {item?.basePrice}{' '}
            <span className="text-green-600 mx-1 select-none text-sm">$</span>
          </h1>
        </div>

        {/* تاريخ الإنشاء */}
        <div className="absolute top-2 left-2 z-50 flex justify-center items-center bg-white/80 rounded-full px-2 py-1 shadow-sm text-xs text-gray-700">
          <FormatDate dateString={item?.createdAt} />
        </div>
      </div>

      {/* تفاصيل إضافية بناءً على الفئة */}
      <div className="w-full p-4 bg-gray-50 border-t border-gray-200">
        {fields?.slice(0, 2).map((field, index) => (
          <div
            key={index}
            className="flex items-center gap-2 mb-2 text-sm text-gray-700"
          >
            {field.icon}
            <p>
              {field.name}: {item.details?.[field.name]}
            </p>
          </div>
        ))}
      </div>

      {/* أيقونة المفضلة */}
      <div
        className={`absolute top-3 right-3 ${
          isFavorited ? 'bg-red-500' : 'bg-white/80'
        } backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-100 transition-all duration-300 cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
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
  );
}
