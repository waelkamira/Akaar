'use client';
import React from 'react';
import Button from './Button';
import { useSession } from 'next-auth/react';

export default function LoginButton() {
  const session = useSession();

  return (
    <>
      {' '}
      {session?.status === 'unauthenticated' && (
        <div className="fixed p-8 inset-0 bg-black/30 bottom-0 my-auto z-[500] flex justify-center items-center">
          <div className="bg-white w-full flex flex-col items-center justify-start p-8 border-2 border-primary-500 rounded-lg">
            <h1 className="text-sm md:text-lg lg:text-xl p-2 my-8 ">
              يجب عليك تسجيل الدخول أولاً
            </h1>
            <Button title={'تسجيل الدخول'} style={' '} path="/login" />
          </div>
        </div>
      )}
    </>
  );
}
