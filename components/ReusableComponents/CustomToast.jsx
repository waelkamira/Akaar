'use client';
import Image from 'next/image';
import React from 'react';
export default function CustomToast({
  t,
  message,
  emoji,
  greenEmoji,
  redEmoji,
}) {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white text-two shadow-sm shadow-gray-300 rounded pointer-events-auto flex-2 items-center justify-center p-4 mx-2 border-t-[10px] border-one`}
    >
      <div className="flex justify-between items-center my-1">
        <div className="flex-1 w-full">
          <div className="flex justify-center items-center gap-2">
            <div className="relative h-16 w-56 my-2 hover:scale-[103%] z-20">
              <Image
                src="/logo.png"
                fill
                objectFit="contain"
                alt="home_photo"
                objectPosition="top"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div>
          <h1 className="sm:mt-4 text-[12px] sm:text-sm s:text-nowrap text-center  ">
            <span className="text-green-400 text-xl ">{greenEmoji}</span>
            <span className="text-one text-xl mx-1 ">{redEmoji}</span>

            {message}
            <span className="text-green-400 text-xl mx-1 ">{emoji}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
