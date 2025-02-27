'use client';
import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { inputsContext } from '../Context';
import { useRouter } from 'next/navigation';
import LoadingPhoto from '../photos/LoadingPhoto';
import FormatDate from './FormatDate';

export default function SmallCard({ item }) {
  const { dispatch } = useContext(inputsContext);
  const router = useRouter();
  const session = useSession();
  const [isFavorited, setIsFavorited] = useState(false);

  // جلب حالة الإعجاب عند تحميل المكون
  useEffect(() => {
    if (session?.data?.user?.email) {
      fetch(`/api/favorite?postId=${item?.id}&email=${session.data.user.email}`)
        .then((res) => res.json())
        .then((data) => setIsFavorited(data?.favorited || false))
        .catch((error) =>
          console.error('Error fetching favorite status:', error)
        );
    }
  }, [session, item?.id]);

  const handleFavoriteClick = async (id) => {
    if (!session) {
      alert('يجب تسجيل الدخول أولاً!');
      return;
    }

    try {
      const res = await fetch('/api/favorite', {
        method: 'POST',
        body: JSON.stringify({
          postId: id,
          email: session?.data?.user?.email,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setIsFavorited(data.favorited || false);
    } catch (error) {
      console.error('خطأ أثناء الإضافة للمفضلة:', error);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center w-full cursor-pointer bg-one hover:scale-[103%] transition-transform duration-300 ease-in-out overflow-hidden hover:shadow-xl relative"
      key={item?.id}
      onClick={() => {
        dispatch({ type: 'POST_ID', payload: item?.id });
        router.push('/post');
      }}
    >
      {/* الصورة */}
      <div className="relative w-full h-44">
        {!item?.image1 && <LoadingPhoto />}
        {item?.image1 && (
          <Image
            src={item?.image1}
            fill
            alt="item_photo"
            className="object-cover transition-opacity duration-300 hover:opacity-90"
          />
        )}
      </div>
      {/* التفاصيل */}
      <div className="flex justify-evenly gap-2 items-center w-full mt-2 text-sm sm:text-md p-3 bg-white text-black">
        <h1>{item?.propertyCategory}</h1>
        <h1 className="flex justify-center items-center">
          {item?.propertyPrice}
          <span className="text-one mx-1 select-none">$</span>
        </h1>
        <h1 className="flex justify-center items-center">
          {item?.propertyCity}
        </h1>
        <h1 className="flex justify-center items-center">
          {<FormatDate dateString={item?.createdAt} />}
        </h1>
      </div>
      {/* أيقونة تفاعلية */}
      <div
        className={`absolute top-3 right-3 ${
          isFavorited ? 'bg-orange-500' : 'bg-white/80'
        } backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-all duration-300 cursor-pointer`}
        onClick={(e) => {
          handleFavoriteClick(item?.id);
          e.stopPropagation();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${
            isFavorited ? 'text-white' : 'text-gray-700 hover:text-gray-900'
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
