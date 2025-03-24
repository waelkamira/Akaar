// SmallCard.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ImageComponent from './ImageComponent';
import DetailsSection from './DetailsSection';
import AdditionalFields from './AdditionalFields';
import FavoriteButton from './FavoriteButton';

const SmallCard = React.memo(function SmallCard({ item, category }) {
  const router = useRouter();

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
          <ImageComponent item={item} />
          <DetailsSection item={item} />
          <AdditionalFields item={item} category={category} />
          <h1 className="flex justify-between items-center text-start w-full text-md font-bold text-one p-4">
            <span className="text-one"> {item?.basePrice} $</span>
            <button className="bg-one text-white p-2 rounded-full text-sm font-thin">
              عرض التفاصيل
            </button>
          </h1>
          <FavoriteButton item={item} />
        </div>
      )}
    </>
  );
});

export default SmallCard;
