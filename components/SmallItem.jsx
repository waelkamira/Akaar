'use client';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from './Loading';
import CustomToast from './CustomToast';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IoMdClose } from 'react-icons/io';
import { inputsContext } from '../components/Context';
import PostGallery from './PostGallery';
import UserNameAndPhoto from './userNameAndPhoto';

export default function SmallItem({ post, index, show = true, id = false }) {
  const [currentUser, setCurrentUser] = useState('');
  const [heart, setHeart] = useState(post?.hearts);
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

    // checkPostActionsStatus(post);
  }, [post]);

  async function checkPostActionsStatus(post) {
    try {
      const response = await fetch(`/api/favoritePosts?postId=${post?.id}`);
      const json = await response?.json();
      if (response.ok) {
        console.log('hearts', json);
        setHeart(json[0]?.hearts); // تحديث حالة القلب بناءً على القيمة من الخادم
      }
    } catch (error) {
      console.error('Error in updatePostActionNumbers:', error);
    }
  }

  // async function handleInteraction(postId) {
  //   console.log('postId', postId, 'heart', heart);
  //   setHeart(!heart); // تحديث حالة القلب المحلية
  //   try {
  //     const email = session?.data?.user?.email;
  //     console.log(email);
  //     const response = await fetch(`/api/favoritePosts`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         postId,
  //         email,
  //       }),
  //     });

  //     if (response.ok) {
  //       const result = await response.json();

  //       toast.custom((t) => (
  //         <CustomToast
  //           t={t}
  //           message={'تمت إضافة هذا الإعلان إلى المفضلة'}
  //           greenEmoji={'✔'}
  //           emoji={''}
  //         />
  //       ));
  //     } else {
  //       console.error(`Failed to toggle ${action}`);
  //       toast.custom((t) => (
  //         <CustomToast t={t} message={'حدث خطأ ما'} emoji={'😐'} />
  //       ));
  //     }
  //   } catch (error) {
  //     console.error('Error in handleInteraction:', error);
  //     toast.custom((t) => (
  //       <CustomToast t={t} message={'حدث خطأ ما'} emoji={'😐'} />
  //     ));
  //   }
  // }

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

  return (
    <div className="rounded-[5px] bg-white mb-4 w-full h-full border sm:px-16">
      {!post && <Loading />}
      <div
        key={index}
        id="post1"
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
              className="flex flex-col items-center justify-center cursor-pointer   p-2 md:text-2xl  hover:bg-one"
              onClick={() => handleDeletePost(post)}
            >
              <IoMdClose className="" />
              <h6 className="text-sm select-none">حذف</h6>
            </div>
          )}
        </div>
        <h1
          className={`text-one ${
            path.includes('myPosts') || path.includes('favoritePosts')
              ? 'sm:my-2 text-lg line-clamp-1 max-w-[20ch]'
              : 'sm:my-4 text-xl sm:text-3xl line-clamp-1 max-w-[20ch] lg:max-w-[40ch]'
          } font-medium select-none text-wrap `}
        >
          {post?.propertyName || post?.title}
        </h1>
        <PostGallery post={post} />
        {/* {show && (
          <>
            <div className=" w-full my-2 ">
              <div
                className="btn flex justify-center items-center gap-2 w-fit cursor-pointer p-1 lg:p-2  border border-gray-500 select-none text-gray-200 hover: rounded-md"
                onClick={() => {
                  handleInteraction(post?.id, 'hearts', heart, setHeart);
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
                      (heart ? 'text-one' : '') +
                      ' text-[10px] md:text-[13px] lg:text-[16px] select-none'
                    }
                  />
                </div>

                <h1
                  className={
                    (heart ? 'text-one' : '') +
                    '  text-[10px] md:text-[13px] lg:text-[16px] select-none'
                  }
                >
                  حفظ
                </h1>
              </div>
            </div>

            <hr className="w-full h-[1.5px] bg-gray-400  border-hidden select-none" />
          </>
        )} */}
        <div className="text-four p-2 w-full">
          <pre className="text-sm sm:text-lg text-start w-full line-clamp-1 select-none">
            {post?.description}
          </pre>
        </div>
        <button
          onClick={() => {
            if (session?.status === 'authenticated') {
              dispatch({ type: 'POST_ID', payload: post?.postId || post?.id });
              if (post.adType) {
                router.push(`/Cars/post`);
              } else {
                router.push(`/RealEstate/post`);
              }
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
              path.includes('myPosts') || path.includes('favoritePosts')
                ? 'text-md'
                : 'sm:text-2xl'
            } btn p-2 my-2 bg-three text-white hover:scale-[101%] hover:font-medium rounded-[5px] text-center select-none w-full transition-all duration-300`}
        >
          عرض الإعلان
        </button>
      </div>
    </div>
  );
}
