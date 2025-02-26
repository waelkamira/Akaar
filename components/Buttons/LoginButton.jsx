'use client';
import React from 'react';
import Button from '../Button';
import { useSession } from 'next-auth/react';

export default function LoginButton() {
  const session = useSession();

  return (
    <>
      {session?.status === 'unauthenticated' && (
        <div className="p-4 m-2 md:m-8 border text-center rounded-[5px] bg-white">
          <h1 className="text-sm md:text-lg lg:text-xl p-2 my-8 ">
            يجب عليك تسجيل الدخول أولاً
          </h1>

          <Button title={'تسجيل الدخول'} style={' '} path="/login" />
        </div>
      )}
    </>
  );
}
