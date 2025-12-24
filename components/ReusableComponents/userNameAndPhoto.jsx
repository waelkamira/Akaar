'use client';

import React, { useState, useEffect } from 'react';
import LoadingPhoto from '../photos/LoadingPhoto';
import Image from 'next/image';
import Link from 'next/link';

export default function UserNameAndPhoto({ post, size, rounded }) {
  const [user, setUser] = useState(null);
  const imageSize = size || 'size-10 sm:size-12 lg:size-14';

  console.log('post', post?.userImage);

  useEffect(() => {
    // تحميل بيانات المستخدم من localStorage
    const loadUserFromLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('CurrentUser');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
      }
    };

    // قم بالتحميل فقط إذا كان window موجودًا لتجنب الأخطاء من جانب الخادم
    if (typeof window !== 'undefined') {
      loadUserFromLocalStorage();
    }
  }, []);

  return (
    <div
      className={
        (rounded ? 'rounded-lg' : '') +
        ` absolute top-0 right-0 z-10 flex justify-start items-center gap-2 w-full p-2 h-10 mt-2`
      }
    >
      <Link
        href={post?.userId ? `/posts/${post?.userId}` : '/profile'}
        className={
          size +
          ' flex justify-between items-center gap-2 w-full h-fit cursor-pointer '
        }
      >
        <div className="flex justify-center items-center gap-2">
          {' '}
          <div className={`relative ${imageSize} overflow-hidden rounded-full`}>
            {/* تحقق من وجود صورة */}
            {post?.userImage || user?.userImage ? (
              <Image
                priority
                src={post?.userImage || user?.userImage || '/placeholder.jpg'}
                fill
                alt="userImage"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <LoadingPhoto />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h6 className={` text-eight select-none font-medium text-white`}>
              {post?.userName || user?.username}
            </h6>
          </div>
        </div>
      </Link>
    </div>
  );
}
