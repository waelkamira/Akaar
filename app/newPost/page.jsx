'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import PostForm from '../../components/PostForm';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { signIn, useSession } from 'next-auth/react';
import Button from '../../components/Button';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import ImageUpload from '../../components/ImageUpload';
import UploadingAndDisplayingImage from '../../components/UploadingAndDisplayingImage';

export default function NewRecipe() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  return (
    <div
      className="relative flex justify-center items-start gap-4 overflow-auto w-full h-full xl:p-8 bg-four  right-0 top-0 2xl:-top-8  z-50 xl:mt-8"
      onClick={() => setIsVisible(false)}
    >
      <div className="absolute xl:hidden flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
        <TfiMenuAlt
          className="p-1 text-4xl lg:text-5xl text-one cursor-pointer z-50 "
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      <div
        className={
          (session?.status === 'unauthenticated' ? 'h-fit ' : 'h-fit ') +
          ' relative border border-one rounded-[5px] w-full 2xl:w-2/3 flex flex-col items-start justify-center sm:flex-row top-0 overflow-hidden'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-full h-full flex flex-col items-center justify-start  grow z-40 mt-16">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="relative size-20 xl:h-44 xl:w-44 mt-2 ">
              <Image
                priority
                src={'https://i.imgur.com/5pvgiAk.png'}
                fill
                alt="decoration"
                className="m-0"
              />
            </div>
            <h1 className="text-white w-full text-2xl text-center m-0">عقار</h1>
          </div>
          <BackButton className="z-50 bg-one" />

          {session?.status === 'unauthenticated' && (
            <div className="p-4 bg-four  m-2 md:m-8 border border-one text-center">
              <h1 className="text-lg md:text-2xl p-2  text-white">
                يجب عليك تسجيل الدخول أولا لكي تتمكن من إنشاء إعلان جديد
              </h1>

              <Button title={'تسجيل الدخول'} path="/login" style={' '} />
            </div>
          )}
          {session?.status === 'authenticated' && (
            <div className="w-full p-2">
              <h1 className="w-full text-center text-white text-sm md:text-lg my-4">
                أدخل بيانات العقار الذي تريد بيعه أو تأجيره
              </h1>
              <UploadingAndDisplayingImage height={'h-96'} />

              <PostForm
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                cancel={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
