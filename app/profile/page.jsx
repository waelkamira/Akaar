'use client';
import CurrentUser from '../../components/CurrentUser';
import ImageUpload from '../../components/ImageUpload';
import Button from '../../components/Button';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../../components/Context';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CustomToast from '../../components/CustomToast';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { MdEdit } from 'react-icons/md';

export default function Profile() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const user = CurrentUser();
  const { profile_image, dispatch } = useContext(inputsContext);
  const [newUserName, setNewUserName] = useState('');
  console.log('user', user);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newName = JSON.parse(localStorage.getItem('CurrentUser'));
      setNewUserName(newName?.name);
    }
    // setNewImage(profile_image?.image);
    editProfileImageAndUserName();
  }, [profile_image?.image]);

  async function editProfileImageAndUserName() {
    if (profile_image?.image || newUserName) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('image', JSON.stringify(profile_image?.image));
      }
      // console.log('newUserName', newUserName);
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.data?.user?.email,
          image: profile_image?.image,
          name: newUserName,
        }),
      });
      if (response.ok) {
        toast.custom((t) => (
          <CustomToast t={t} message={'تم التعديل بنجاح '} greenEmoji={'✔'} />
        ));
        dispatch({ type: 'PROFILE_IMAGE', payload: profile_image?.image });
        if (typeof window !== 'undefined') {
          const newName = JSON.parse(localStorage.getItem('CurrentUser'));
          setNewUserName(newName?.name);
        }
      } else {
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث حطأ ما حاول مرة أخرى 😐'} />
        ));
      }
    }
  }

  return (
    <div className="flex justify-center w-full bg-gradient-to-r from-[#494949] to-four">
      {session?.status === 'unauthenticated' && (
        <div className="p-4 bg-four  m-2 md:m-8 border border-one text-center h-screen">
          <h1 className="text-lg md:text-2xl p-2 my-8 text-white">
            يجب عليك تسجيل الدخول أولا لرؤية هذا البروفايل
          </h1>
          <div className="flex flex-col justify-between items-center gap-4 w-full">
            <Button title={'تسجيل الدخول'} style={' '} path="/login" />

            <BackButton />
          </div>
        </div>
      )}
      {session?.status === 'authenticated' && (
        <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-full px-2 overflow-y-auto z-10 mb-16 sm:px-16 ">
          <div className="relative flex justify-between items-center w-full gap-2 my-4 bg-one p-1 md:p-2 rounded-[5px]">
            <div>
              <TfiMenuAlt
                className="text-[30px] lg:text-5xl text-white cursor-pointer"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              />
              <div className="absolute top-14 lg:top-20 right-0 z-50">
                {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
              </div>
            </div>

            <BackButton />
          </div>
          <div className="flex flex-col items-start gap-4 justify-start w-full h-full overflow-hidden rounded-[5px] border border-one">
            <div className="relative w-full my-2">
              <div className="relative min-h-64 w-full">
                <Image
                  priority
                  src={user?.image}
                  layout="fill"
                  objectFit="contain"
                  alt={user?.name}
                />
              </div>
              {/* <div className="relative">
                <div className="absolute right-1 -bottom-6 h-20 w-20  rounded-xl cursor-pointer overflow-hidden z-40">
                  <ImageUpload
                    priority
                    src={user?.image}
                    style={
                      'peer/image  w-20 h-20 cursor-pointer overflow-hidden'
                    }
                  />
                </div>
              </div> */}
            </div>

            <div className="flex flex-col justify-center items-center w-full text-start text-white">
              {/* <div className="flex flex-col items-start gap-2 justify-between  px-8 py-2 w-full my-2">
                <div className="flex justify-between items-center">
                  <h5 className="text-sm">تغيير الإسم: </h5>
                  <h1 className="text-nowrap text-start w-full select-none">
                    <span className="text-one  text-xl ml-2">
                      {' '}
                      <MdEdit />
                    </span>
                    <span
                      contentEditable="true"
                      onInput={(e) =>
                        setNewUserName(e.currentTarget.textContent)
                      }
                    >
                      {user?.name}
                    </span>
                  </h1>
                </div>
                <div className="w-44 ">
                  <Button
                    title={'حفظ الإسم'}
                    onClick={() => editProfileImageAndUserName()}
                  />
                </div>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div> */}
              <div className="flex flex-col items-center gap-2 justify-between  px-8 py-2 w-full my-2">
                <h1 className="text-nowrap text-start w-full select-none">
                  <span className="text-one  text-2xl ml-2">#</span>
                  {session?.data?.user?.name}
                </h1>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between  px-8 py-2 w-full my-2">
                <h1 className="text-nowrap text-start w-full select-none">
                  <span className="text-one  text-2xl ml-2">#</span>
                  {session?.data?.user?.email}
                </h1>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between  px-8 py-2 w-full my-2">
                <Link href={'/myPosts'} className="w-full">
                  <h1 className="text-nowrap text-start w-full select-none cursor-pointer ">
                    <span className="text-one  text-2xl ml-2 ">#</span>
                    إعلاناتي{' '}
                  </h1>
                </Link>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between  px-8 py-2 w-full my-2">
                <Link href={'/favoritePosts'} className="w-full">
                  <h1 className="text-nowrap text-start w-full select-none cursor-pointer ">
                    <span className="text-one  text-2xl ml-2 ">#</span>
                    إعلانات أعجبتني{' '}
                  </h1>
                </Link>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div>

              <div className="w-full px-8">
                <Button
                  title={'تسجيل الخروج'}
                  style={' '}
                  onClick={() => signOut()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
