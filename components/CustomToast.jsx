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
      } max-w-md w-full bg-white text-four shadow-lg rounded-lg pointer-events-auto flex-2 items-center justify-center p-4 mx-2 border`}
    >
      <div className="flex justify-between items-center my-1">
        <div className="flex-1 w-full">
          <div className="flex justify-center items-center gap-2">
            <div className="relative w-14 h-14 flex-shrink-0 pt-0.5 rounded-xl ">
              <Image
                priority
                className="h-10 w-10 rounded-xl"
                src="https://i.imgur.com/rXaNY0v.png"
                alt="photo"
                fill
              />
            </div>
            <div className="ml-3 flex-1">
              <h1 className="text-xl">عقار</h1>
            </div>
          </div>
        </div>
      </div>
      {/* <hr className="w-full h-[1px] bg-four rounded-xl border-hidden select-none my-1" /> */}

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
