'use client';
import React, { useEffect, useState } from 'react';
import { FaGear } from 'react-icons/fa6';

export default function Loading({ myMessage = 'لا يوجد نتائج لعرضها 😐' }) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setMessage(myMessage);
      setIsVisible(false);
    }, 5000);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-[300px] rounded-[5px] w-full px-4 bg-white">
      {isVisible && (
        <div className="flex flex-col justify-start items-center bg-four w-full h-full p-8 transition duration-300 rounded-[5px]">
          <div className="flex flex-col justify-center items-center">
            <FaGear className="animate-spin text-5xl mt-8 transition duration-300" />
            <FaGear className="animate-spin text-2xl transition duration-300 mx-8 w-full" />
          </div>
          <div className="w-full">
            <hr className="w-1/2 h-[10px] bg-one rounded-[5px] border-hidden  my-4 transition duration-300" />
            <hr className="w-3/4 h-[10px] bg-one rounded-[5px] border-hidden  my-4 transition duration-300" />
            <hr className="w-full h-[10px] bg-one rounded-[5px] border-hidden  my-4 transition duration-300" />
          </div>
        </div>
      )}
      <h1 className="text-2xl mt-4    p-2 text-center">
        {message ? message : 'جاري التحميل'}
      </h1>
    </div>
  );
}
