'use client';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Loading from './Loading';
import CustomToast from './CustomToast';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IoMdClose } from 'react-icons/io';
import { FaHeart } from 'react-icons/fa';
import { inputsContext } from '../components/Context';
import PostGallery from './PostGallery';
import LoadingPhoto from './LoadingPhoto';
import UserNameAndPhoto from './userNameAndPhoto';

export default function SmallItem({ post, index, show = true, id = false }) {
  const [currentUser, setCurrentUser] = useState('');
  const [heart, setHeart] = useState(false);
  const { dispatch } = useContext(inputsContext);
  const session = useSession();
  const router = useRouter();
  const path = usePathname();

  // console.log('post', post);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('CurrentUser');
      if (userData !== 'undefined') {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    }

    checkPostActionsStatus(post);
  }, [post?.id]);

  async function checkPostActionsStatus(post) {
    try {
      const response = await fetch(`/api/actions?postId=${post?.id}`);
      const json = await response?.json();
      if (response.ok) {
        // console.log('json', json);

        setHeart(json[0]?.hearts === 1);
      }
    } catch (error) {
      console.error('Error in updatePostActionNumbers:', error);
    }
  }

  async function updatePostActionNumbers(postId, actionType, newActionValue) {
    try {
      const response = await fetch(`/api/allPosts?id=${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType,
          newActionValue,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to update ${actionType} for post ${postId}`);
      }
    } catch (error) {
      console.error('Error in updatePostActionNumbers:', error);
    }
  }

  async function handleInteraction(postId, action, currentState, setState) {
    setState(!action);
    try {
      const email = session?.data?.user?.email;
      console.log(email);
      const response = await fetch(`/api/actions?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          actionType: action,
          actionValue: currentState ? 0 : 1,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newActionValue = result.newActionValue;
        setState(true);
        // قم بتحديث العدد في قاعدة البيانات
        await updatePostActionNumbers(postId, action, newActionValue);

        toast.custom((t) => (
          <CustomToast
            t={t}
            message={result.message}
            greenEmoji={'✔'}
            emoji={'😋'}
          />
        ));
      } else {
        console.error(`Failed to toggle ${action}`);
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث خطأ ما'} emoji={'😐'} />
        ));
      }
    } catch (error) {
      console.error('Error in handleInteraction:', error);
      toast.custom((t) => (
        <CustomToast t={t} message={'حدث خطأ ما'} emoji={'😐'} />
      ));
    }
  }

  //? لحذف أي بوست من أي مستخدم هذه الدالة خاصة بالأدمن فقط
  async function handleDeletePost(post) {
    const response = await fetch(
      `/api/allPosts?id=${post?.id}&isAdmin=${true}`,
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

  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="rounded-lg border-t-[20px] border-one bg-white my-2 w-full">
      {!post && <Loading />}
      <div
        key={index}
        id="post1"
        className="flex flex-col justify-center items-center w-full mt-0 p-2 my-2 rounded-lg rounded-t-none border-t-0  border border-white transition-all duration-300"
      >
        <div className="flex items-center justify-start w-full">
          <UserNameAndPhoto
            userImage={post?.userImage}
            userName={post?.userName}
            createdAt={post?.createdAt}
          />

          {currentUser?.isAdmin === 1 && path === '/' && (
            <div
              className="flex flex-col items-center justify-center cursor-pointer bg-four  p-2 md:text-2xl text-white hover:bg-one"
              onClick={() => handleDeletePost(post)}
            >
              <IoMdClose className="" />
              <h6 className="text-sm select-none">حذف</h6>
            </div>
          )}
        </div>
        <h1
          className={`text-one ${
            path.includes('myPosts')
              ? 'sm:my-2 text-lg'
              : 'sm:my-4 text-xl sm:text-3xl'
          }  font-medium select-none line-clamp-1`}
        >
          {post?.propertyName}
        </h1>
        <PostGallery post={post} />
        {show && (
          <>
            <div className="flex justify-between items-center gap-2 w-full text-gray-400 my-2">
              <div
                className="flex justify-center items-center gap-2 cursor-pointer hover:bg-seven p-1 lg:p-2  select-none"
                onClick={() => {
                  handleInteraction(post.id, 'hearts', heart, setHeart);
                  if (session?.status === 'unauthenticated') {
                    toast.custom((t) => (
                      <CustomToast
                        t={t}
                        message={
                          'يجب عليك تسجيل الدخول أولا لحفظ هذه الإعلان 😉'
                        }
                      />
                    ));
                  }
                }}
              >
                <div className="hover:scale-105">
                  <FaHeart
                    className={
                      (heart ? 'text-one' : 'text-gray-400') +
                      ' text-[10px] md:text-[13px] lg:text-[15px] select-none'
                    }
                  />
                </div>

                <h1
                  className={
                    (heart ? 'text-one' : 'text-gray-400') +
                    '  text-[10px] md:text-[13px] lg:text-[15px] select-none'
                  }
                >
                  حفظ
                </h1>
              </div>
            </div>
            <hr className="w-full h-[1.5px] bg-gray-400  border-hidden select-none" />
          </>
        )}
        <div className="text-nine p-2 w-full">
          <pre className="text-sm sm:text-lg text-start w-full line-clamp-1 select-none">
            {post?.description}
          </pre>
        </div>
        <button
          onClick={() => {
            if (session?.status === 'authenticated') {
              router.push(`/post/${id ? post?.postId : post?.id}`);
            } else {
              toast.custom((t) => (
                <CustomToast
                  t={t}
                  message={'يجب عليك تسجيل الدخول أولا لرؤية هذه الإعلان 😉'}
                />
              ));
            }
          }}
          className={`  
            ${
              path.includes('myPosts') ? 'text-md' : 'sm:text-2xl'
            }  p-2 my-2 bg-seven text-white hover:scale-[101%] hover:text-white font-medium text-center select-none w-full transition-all duration-300 rounded-[5px]`}
        >
          عرض الإعلان
        </button>
      </div>
    </div>
  );
}
