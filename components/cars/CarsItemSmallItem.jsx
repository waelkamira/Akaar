import React from 'react';

export default function CarsItemSmallItem({ icon, text, value }) {
  return (
    <h1 className="flex justify-start items-center bg-white shadow-sm shadow-gray-300 rounded-[5px] text-sm sm:text-lg lg:text-xl w-full h-10 sm:h-16 lg:h-20 my-1 sm:my-2 select-none">
      <span className="flex gap-1 items-center text-one text-md sm:text-xl mx-2 select-none">
        {icon}
        {text}:
      </span>
      {value}
    </h1>
  );
}
