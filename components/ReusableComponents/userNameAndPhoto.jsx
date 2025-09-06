'use client';

import React, { useState, useEffect, useCallback } from 'react';
import LoadingPhoto from '../photos/LoadingPhoto';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UserNameAndPhoto({ post, size }) {
  const session = useSession();
  const path = usePathname();
  const [user, setUser] = useState(null);

  // تعيين حجم الصورة بناءً على المسار والحجم الممرر
  const imageSize = size || 'size-12 sm:size-14 lg:size-16';

  // استخدم useCallback لتجنب إعادة إنشاء الدالة في كل مرة يتم فيها إعادة عرض المكون
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  }, []);

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
    <div className="flex justify-start items-center gap-2 w-full text-black">
      <Link
        href={'/profile'}
        className={
          size
            ? 'flex flex-col justify-center items-center gap-4'
            : 'flex justify-start items-center gap-2' +
              ' w-full h-fit cursor-pointer '
        }
      >
        <div className={`relative ${imageSize} overflow-hidden rounded-full`}>
          {/* تحقق من وجود صورة */}
          {user?.userImage ? (
            <Image
              priority
              src={user?.userImage}
              fill
              alt="userImage"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <LoadingPhoto />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h6
            className={
              size
                ? 'text-lg '
                : 'text-[11px] sm:text-[15px] ' +
                  ` text-eight select-none font-medium`
            }
          >
            {user?.username}
          </h6>
          {post && (
            <h1
              className={`text-[8px] sm:text-[12px] text-black/70 select-none text-end`}
              dir="ltr"
            >
              {formatDate(post?.createdAt) || ''}
            </h1>
          )}
        </div>
      </Link>
    </div>
  );
}
