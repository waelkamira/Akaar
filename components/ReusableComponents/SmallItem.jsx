'use client';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CustomToast from './CustomToast';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IoMdClose } from 'react-icons/io';
import { inputsContext } from '../Context';
import PostGallery from '../photos/PostGallery';
import UserNameAndPhoto from './userNameAndPhoto';

export default function SmallItem({ post, index }) {
  const [currentUser, setCurrentUser] = useState(null);
  const { dispatch } = useContext(inputsContext);
  const session = useSession();
  const router = useRouter();
  const path = usePathname();
  // console.log('post 77777777777777', post);

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
      className="rounded-xl bg-white/10 border w-[95%] border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      onClick={() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('item', JSON.stringify(post));
        }
        router.push(`/post`);
      }}
    >
      <div className="flex flex-col justify-center items-center w-full p-4">
        {/* صورة المستخدم واسمه */}
        <div className="flex items-center justify-between w-full mb-4">
          <UserNameAndPhoto post={post} />
          {currentUser?.isAdmin === 1 && path === '/' && (
            <div
              className="flex flex-col items-center justify-center cursor-pointer p-2 text-red-500 hover:bg-red-500/10 rounded-full"
              onClick={() => handleDeletePost(post)}
            >
              <IoMdClose className="text-xl" />
              <h6 className="text-sm select-none">حذف</h6>
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
        <div className="w-full border-t border-white/10 my-4"></div>
        <pre className="text-sm text-white/80 line-clamp-2 mb-4">
          {post?.description}
        </pre>

        {/* زر عرض الإعلان */}
        <button
          onClick={() => {
            if (session?.status === 'authenticated') {
              if (typeof window !== 'undefined') {
                localStorage.setItem('item', JSON.stringify(post));
              }
              router.push(`/post/${post?.id}`);
            } else {
              toast.custom((t) => (
                <CustomToast
                  t={t}
                  message={'يجب عليك تسجيل الدخول أولا لرؤية هذه الإعلان 😉'}
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
