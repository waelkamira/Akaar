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

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  return (
    <div
      className="relative flex justify-center items-start gap-4 overflow-auto w-full h-full border border-five xl:p-8 bg-four  right-0 top-0 2xl:-top-8 rounded-lg z-50"
      onClick={() => setIsVisible(false)}
    >
      ContactUs
    </div>
  );
}
