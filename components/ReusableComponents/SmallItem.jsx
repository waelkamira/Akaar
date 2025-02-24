'use client';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CustomToast from '../CustomToast';
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
  console.log('post 77777777777777', post);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('CurrentUser');
      if (userData && userData !== 'undefined') {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  async function handleDeletePost(post) {
    const response = await fetch(`/api/allPosts?id=${post?.id}&isAdmin=true`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });

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
    <div className="rounded-[5px] bg-white mb-4 w-full h-full border">
      <div
        key={index}
        className="flex flex-col justify-center items-center w-full mt-0 p-2 my-2 transition-all duration-300"
      >
        <div className="flex items-center justify-start w-full">
          <UserNameAndPhoto
            userImage={post?.userImage}
            userName={post?.userName}
            createdAt={post?.createdAt}
            post={post}
          />
          {currentUser?.isAdmin === 1 && path === '/' && (
            <div
              className="flex flex-col items-center justify-center cursor-pointer p-2 md:text-2xl hover:bg-one"
              onClick={() => handleDeletePost(post)}
            >
              <IoMdClose />
              <h6 className="text-sm select-none">حذف</h6>
            </div>
          )}
        </div>
        <h1
          className={`text-one ${
            path.includes('myPosts') || path.includes('favoritePosts')
              ? 'sm:my-2 text-lg line-clamp-1 max-w-[20ch]'
              : 'sm:my-4 text-xl sm:text-3xl line-clamp-1 max-w-[20ch] lg:max-w-[40ch]'
          } font-medium select-none`}
        >
          {post?.propertyName || post?.title}
        </h1>
        <PostGallery post={post} />
        <div className="p-2 w-full border-b my-2">
          <pre className="text-sm sm:text-lg text-start w-full line-clamp-1 select-none">
            {post?.description}
          </pre>
        </div>
        <button
          onClick={() => {
            if (session?.status === 'authenticated') {
              dispatch({ type: 'POST_ID', payload: post?.postId || post?.id });
              router.push(
                post?.details?.distance ? `/Cars/post` : `/RealEstate/post`
              );
            } else {
              toast.custom((t) => (
                <CustomToast
                  t={t}
                  message={'يجب عليك تسجيل الدخول أولا لرؤية هذه الإعلان 😉'}
                />
              ));
            }
          }}
          className={`${
            path.includes('myPosts') || path.includes('favoritePosts')
              ? 'text-md'
              : 'sm:text-2xl'
          } btn flex justify-center items-center sm:text-lg p-1 lg:p-2 text-white text-nowrap select-none rounded-[5px] w-full md:w-1/2 max-h-12 hover:scale-[101%]`}
        >
          عرض الإعلان
        </button>
      </div>
    </div>
  );
}
