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
import { TfiMenuAlt } from 'react-icons/tfi';
import ImageUpload from '../../components/ImageUpload';
import UploadingAndDisplayingImage from '../../components/UploadingAndDisplayingImage';
import AllPosts from '../../components/allPosts';
import SideBarMenu from '../../components/SideBarMenu';

export default function Buy() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  return (
    <div className="flex flex-col justify-center items-center gap-4 overflow-auto w-full h-full border border-five xl:p-8 bg-four">
      <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
        <TfiMenuAlt
          className="p-1 rounded-lg text-4xl lg:text-5xl text-one cursor-pointer z-50 animate-pulse"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      <div className="relative w-full h-[300px]">
        <Image
          src="https://i.imgur.com/wHyvDAD.png"
          fill
          objectFit="cover"
          alt="home_photo"
          objectPosition="center"
        />
      </div>
      <AllPosts />
    </div>
  );
}
