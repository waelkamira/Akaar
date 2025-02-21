'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Button from './Button';
import Image from 'next/image';
import CurrentUser from '../components/CurrentUser';
import NewPostButton from './NewPostButton';
import Loading from './Loading';
import LoadingPhoto from './LoadingPhoto';

export default function SideBar() {
  const router = useRouter();
  const session = useSession();
  const [newImage, setNewImage] = useState('');
  const user = CurrentUser();
  const [userRecipeCount, setUserRecipeCount] = useState();

  // console.log('user', user);
  useEffect(() => {
    getTheUserRecipeCount();
    if (typeof window !== 'undefined') {
      const img = localStorage.getItem('image');
      setNewImage(img);
    }
  }, []);

  //? معرفة عدد الطبخات حتى يتم اظهار زر الجوائز اولا
  async function getTheUserRecipeCount() {
    const response = await fetch('/api/myPosts');
    const json = await response?.json();
    // console.log('json from sidebar', json);
    if (response.ok) {
      setUserRecipeCount(json?.count);
    }
  }
  // console.log('userRecipeCount from sidebar', userRecipeCount);

  return (
    <div className="hidden xl:block w-80 h-full border-l-[16px] border-one">
      <div
        className={
          (session?.status === 'unauthenticated' ? 'min-h-screen' : '') +
          ` w-full  rounded-r-lg  h-full `
        }
      >
        {session?.status === 'authenticated' && (
          <div className="flex flex-col justify-between items-center p-4 rounded-r-lg w-full">
            <div
              className="flex justify-start items-center w-full cursor-pointer gap-2 line-clamp-1"
              onClick={() => router.push('/profile?username')}
            >
              <div className="relative size-14 overflow-hidden rounded-[5px]">
                {!user?.image && <LoadingPhoto />}

                {user?.image && (
                  <Image priority src={user?.image} fill alt={user?.name} />
                )}
              </div>
              <h1 className="  text-nowrap">{user?.name} </h1>
            </div>
          </div>
        )}

        {session?.status === 'unauthenticated' && (
          <div className="px-4 py-8">
            <Button title={'تسجيل دخول'} style={' '} path="/login" />
          </div>
        )}
      </div>
      {session?.status === 'authenticated' && (
        <div className="w-full rounded-r-lg my-4">
          <div className="p-4 rounded-r-lg  overflow-hidden my-4">
            <div className=" relative w-full h-32">
              <Image
                priority
                src={
                  'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716955/cooking/nasoh_and_bahiga_cn3e7h.png'
                }
                layout="fill"
                objectFit="contain"
                alt="photo"
              />
            </div>
            <div className="hidden lg:flex flex-col justify-between items-center w-full h-full rounded-r-lg">
              <NewPostButton />
            </div>

            <Button title={'إعلاناتي'} style={' '} path="/myPosts" />
            <Button
              title={'إعلانات أعجبتني'}
              style={' '}
              path="/favoritePosts"
            />
            {session?.status === 'authenticated' && user?.isAdmin === 0 && (
              <Button title={'المستخدمين'} style={' '} path="/users" />
            )}
          </div>

          <div className="relative w-full h-52 ">
            <Image
              priority
              src={'https://i.imgur.com/hILi6c8.jpg'}
              layout="fill"
              objectFit="contain"
              alt="photo"
            />
          </div>
        </div>
      )}
    </div>
  );
}
