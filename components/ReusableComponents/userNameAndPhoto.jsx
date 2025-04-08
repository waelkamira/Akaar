// UserNameAndPhoto.js (بدون تغليف بـ Link)
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import LoadingPhoto from '../photos/LoadingPhoto'; // تأكد من صحة المسار
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
// تم حذف import Link from 'next/link' لأنه لم يعد مستخدماً هنا

export default function UserNameAndPhoto({ post, size }) {
  const [user, setUser] = useState(null);

  // تعيين حجم الصورة بناءً على المسار والحجم الممرر
  // إذا لم يتم تمرير 'size'، سيتم استخدام القيم الافتراضية
  const imageSize = size || 'size-12 sm:size-14 lg:size-16';

  // استخدم useCallback لتجنب إعادة إنشاء الدالة في كل مرة يتم فيها إعادة عرض المكون
  const formatDate = useCallback((dateString) => {
    if (!dateString) return ''; // التعامل مع حالة عدم وجود تاريخ
    try {
      const date = new Date(dateString);
      // تحقق مما إذا كان التاريخ صالحًا
      return isNaN(date.getTime())
        ? 'Invalid date'
        : formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }, []);

  useEffect(() => {
    // تحميل بيانات المستخدم من localStorage
    const loadUserFromLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('CurrentUser');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
        setUser(null); // إعادة التعيين إلى null في حالة حدوث خطأ
      }
    };

    // قم بالتحميل فقط إذا كان window موجودًا لتجنب الأخطاء من جانب الخادم
    if (typeof window !== 'undefined') {
      loadUserFromLocalStorage();
    }
  }, []); // تعتمد فقط على التحميل الأولي

  // الكلاسات الأساسية للحاوية بناءً على 'size'
  const containerClasses = size
    ? 'flex flex-col justify-center items-center gap-4' // حالة وجود 'size'
    : 'flex justify-start items-center gap-2 w-full h-fit'; // الحالة الافتراضية

  return (
    // --- تم تغيير Link إلى div ---
    <div className={containerClasses}>
      {/* المحتوى الداخلي يظل كما هو، لكن العنصر لم يعد قابلاً للنقر للانتقال إلى /profile بشكل افتراضي */}
      <div className="flex flex-col justify-start items-center gap-2 w-full text-black">
        {/* حاوية الصورة */}
        <div
          className={`relative ${imageSize} overflow-hidden rounded-full bg-gray-200`}
        >
          {' '}
          {/* إضافة لون خلفية احتياطي */}
          {/* تحقق من وجود صورة المستخدم */}
          {user?.userImage ? (
            <Image
              priority // تحميل الصورة بأولوية
              src={user.userImage} // استخدام user.userImage مباشرة
              fill // لملء الحاوية
              alt={
                user?.username
                  ? `${user.username}'s profile picture`
                  : 'User profile picture'
              } // نص بديل وصفي
              sizes="(max-width: 640px) 48px, (max-width: 1024px) 56px, 64px" // تحسين تحميل الصورة لأحجام مختلفة
              style={{ objectFit: 'cover' }} // لضمان تغطية الصورة للمساحة
            />
          ) : (
            // عرض مكون التحميل في حالة عدم وجود صورة
            <LoadingPhoto />
          )}
        </div>
        {/* حاوية الاسم والتاريخ */}
        <div className="flex flex-col justify-center">
          {/* اسم المستخدم */}
          <h6
            className={
              size
                ? 'text-lg font-medium text-eight select-none' // تنسيق الاسم مع 'size'
                : 'text-[11px] sm:text-[15px] font-medium text-eight select-none' // تنسيق الاسم الافتراضي
            }
          >
            {user?.username || 'Username'}{' '}
            {/* عرض اسم مستخدم افتراضي إذا لم يتم تحميله */}
          </h6>
          {/* تاريخ المنشور (إذا كان موجوداً) */}
          {post?.createdAt && ( // عرض التاريخ فقط إذا كان post.createdAt موجودًا
            <h1
              className={`text-[8px] sm:text-[12px] text-black/70 select-none text-end`}
              dir="ltr" // ضمان اتجاه النص لليسار للتاريخ
            >
              {formatDate(post.createdAt)} {/* عرض التاريخ المنسق */}
            </h1>
          )}
        </div>
      </div>
    </div>
    // --- نهاية الـ div الذي حل محل Link ---
  );
}
