'use client';
import Image from 'next/image';
import React from 'react';
import Button from './Button';
import { useRouter } from 'next/navigation';

export default function Card({ cardName, path, image, text, color }) {
  const router = useRouter();
  return (
    <div className="w-full sm:w-96 h-[500px] bg-white rounded-3xl overflow-hidden hover:scale-[102%] transition-transform duration-300 ease-in-out cursor-pointer">
      {' '}
      <div
        onClick={() => router.push(path)}
        className={
          `relative w-full h-[200px] overflow-hidden border-l-[18px] ` +
          (color === 'red'
            ? 'border-two'
            : color === 'orange'
            ? 'border-three'
            : color === 'green'
            ? 'border-one'
            : '')
        }
      >
        <Image
          src={image}
          fill
          objectFit="cover"
          alt={cardName}
          //   objectPosition="top"
        />
      </div>
      <h1 className="text-2xl my-4 font-bold text-center w-full">{cardName}</h1>
      <p className="p-4 mb-4">{text}</p>
      <div className="px-4 mt-4">
        <Button
          title={cardName}
          style={
            color === 'red'
              ? 'bg-two'
              : color === 'orange'
              ? 'bg-three'
              : color === 'green'
              ? 'bg-one'
              : ''
          }
          path={path}
          className="bg-one"
        />
      </div>{' '}
      <div
        className={
          `h-20 w-full ` +
          (color === 'red'
            ? 'bg-two'
            : color === 'orange'
            ? 'bg-three'
            : color === 'green'
            ? 'bg-one'
            : '')
        }
      ></div>
    </div>
  );
}
