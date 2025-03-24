// ImageComponent.jsx
import React from 'react';
import Image from 'next/image';
import LoadingPhoto from '../../photos/LoadingPhoto';
import FormatDate from '../FormatDate';

function ImageComponent({ item }) {
  return (
    <div className="relative w-full h-48 bg-gray-300">
      {!item?.image1 && <LoadingPhoto />}
      {item?.image1 && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={item?.image1}
            fill
            priority
            objectFit="cover"
            alt="item_photo"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item?.createdAt && (
            <div className="absolute bottom-2 right-2 z-0 flex justify-center items-center bg-white rounded-full px-2 py-1 shadow-sm text-xs text-black">
              <FormatDate dateString={item?.createdAt} />
            </div>
          )}
          {item?.details?.propertyType && (
            <div className="absolute top-2 right-2 z-0 flex justify-center items-center bg-one rounded-full px-3 py-1 shadow-sm text-xs text-white">
              {item?.details?.propertyType === '1' ? 'بيع' : 'إجار'}
            </div>
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-one/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}

export default ImageComponent;
