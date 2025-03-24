// DetailsSection.jsx
import React from 'react';
import { IoLocationOutline } from 'react-icons/io5';

function DetailsSection({ item }) {
  return (
    <div className="flex flex-col justify-between gap-2 w-full p-4 bg-white text-black rounded-b-lg">
      <h5 className="flex items-center justify-start gap-1 font-thin text-sm text-gray-700">
        <IoLocationOutline className="text-one" />
        {item?.city || 'غير محدد'}
      </h5>

      {item?.title && (
        <h1 className="text-lg text-gray-800 line-clamp-1 font-serif font-medium">
          {item?.title?.split(' ').slice(0, 5).join(' ')}
        </h1>
      )}

      <div className="flex flex-col justify-between items-start">
        {item?.description && (
          <h1 className="text-sm line-clamp-2 font-thin text-gray-700">
            {item?.description}
          </h1>
        )}
      </div>
    </div>
  );
}

export default DetailsSection;
