'use client';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CustomToast from './CustomToast';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IoMdClose } from 'react-icons/io';
import { inputsContext } from '../authContext/Context';
import PostGallery from '../photos/PostGallery';
import UserNameAndPhoto from './userNameAndPhoto';

export default function SmallItem({ post, index }) {
  const [currentUser, setCurrentUser] = useState(null);
  const { dispatch } = useContext(inputsContext);
  const session = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('CurrentUser');
      if (userData && userData !== 'undefined') {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  async function handleDeletePost(post) {
    const response = await fetch(
      `/api/Cars/allPosts?id=${post?.id}&isAdmin=true`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      }
    );

    if (response.ok) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={'تم حذف هذا البوست بنجاح'}
          greenEmoji={'✔'}
        />
      ));
      dispatch({ type: 'DELETE_POST', payload: post });
    } else {
      toast.custom((t) => (
        <CustomToast t={t} message={'😐 حدث خطأ ما'} redEmoji={'✖'} />
      ));
    }
  }

  return (
    <div
      className="rounded-xl bg-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden w-[95%]"
      onClick={() => {
        if (typeof window !== 'undefined')
          localStorage.setItem('item', JSON.stringify(post));
        router.push('/post');
      }}
    >
      <div className="flex flex-col items-center p-4 w-full">
        {/* صورة المستخدم واسمه */}
        <div className="flex justify-between w-full mb-4">
          <UserNameAndPhoto post={post} />
          {currentUser?.isAdmin === 1 && path === '/' && (
            <div
              className="flex items-center cursor-pointer p-2 text-red-500 hover:bg-red-500/10 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePost(post);
              }}
            >
              <IoMdClose className="text-xl" />
            </div>
          )}
        </div>

        {/* العنوان */}
        <h1 className="text-xl font-semibold text-white line-clamp-1 mb-2">
          {post?.title}
        </h1>

        {/* معرض الصور */}
        <PostGallery post={post} />

        {/* الوصف */}
        <pre className="text-sm text-white/80 line-clamp-2 my-4">
          {post?.description}
        </pre>

        {/* زر عرض الإعلان */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (session?.status === 'authenticated') {
              if (typeof window !== 'undefined')
                localStorage.setItem('item', JSON.stringify(post));
              router.push(`/post/${post?.id}`);
            } else {
              toast.custom((t) => (
                <CustomToast
                  t={t}
                  message="يجب تسجيل الدخول لرؤية هذا الإعلان 😉"
                />
              ));
            }
          }}
          className="w-full bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors duration-300"
        >
          عرض الإعلان
        </button>
      </div>
    </div>
  );
}
