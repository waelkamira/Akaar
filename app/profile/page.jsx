'use client';
import CurrentUser from '../../components/CurrentUser';
import Button from '../../components/Button';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../../components/Context';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import BackButton from '../../components/BackButton';
import MiddleBarAndPhoto from '../../components/RealEstate/RealEstateSideBar';
import Loading from '../../components/ReusableComponents/Loading';
import LoadingPhoto from '../../components/photos/LoadingPhoto';
import MainNavbar from '../../components/navbars/MainNavbar';
import LoginButton from '../../components/Buttons/LoginButton';
export default function Profile() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const user = CurrentUser();
  const { profile_image, dispatch } = useContext(inputsContext);
  const [newUserName, setNewUserName] = useState('');
  // console.log('user', user);

  useEffect(() => {
    let newName = null;
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('CurrentUser');
        newName = storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
      }
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
          setNewUserName(newName?.name || '');
        }
      } else {
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث حطأ ما حاول مرة أخرى 😐'} />
        ));
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <MainNavbar />

      <LoginButton />

      {session?.status === 'authenticated' && (
        <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-full px-2 overflow-y-auto z-10 mb-16 sm:px-16 mt-8">
          <div className="flex flex-col items-start gap-4 justify-start w-full h-full overflow-hidden rounded-[5px] border xl:mt-4">
            <div className="flex justify-center items-center w-full bg-two py-2">
              {' '}
              <div className="relative min-h-64 w-64 rounded-full overflow-hidden bg-two">
                {!user?.image && <LoadingPhoto />}
                {user?.image && (
                  <Image
                    priority
                    src={user?.image}
                    layout="fill"
                    objectFit="contain"
                    alt={user?.name}
                    className="rounded-full overflow-hidden"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full text-start ">
              {/* <div className="flex flex-col items-start gap-2 justify-between  px-8 py-2 w-full my-2">
                <div className="flex justify-between items-center">
                  <h5 className="text-sm">تغيير الإسم: </h5>
                  <h1 className="text-nowrap text-start w-full select-none">
                    <span className="text-one  text-xl ml-2">
                      
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
                <h1 className="text-nowrap text-sm  md:text-lg lg:text-xl text-start w-full select-none">
                  <span className="text-one text-md xl:text-xl lg:text-2xl ml-2">
                    #
                  </span>
                  {session?.data?.user?.name}
                </h1>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between  px-8 py-2 w-full my-2">
                <h1 className="text-nowrap text-sm  md:text-lg lg:text-xl text-start w-full select-none">
                  <span className="text-one text-md xl:text-xl lg:text-2xl ml-2">
                    #
                  </span>
                  {session?.data?.user?.email}
                </h1>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between  px-8 py-2 w-full my-2">
                <Link href={'/myPosts'} className="w-full">
                  <h1 className="text-nowrap text-sm hover:text-one md:text-lg lg:text-xl text-start w-full select-none cursor-pointer ">
                    <span className="text-one text-md xl:text-xl lg:text-2xl ml-2 ">
                      #
                    </span>
                    إعلاناتي
                  </h1>
                </Link>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div>
              {/* <div className="flex flex-col items-center gap-2 justify-between  px-8 py-2 w-full my-2">
                <Link href={'/favoritePosts'} className="w-full">
                  <h1 className="text-nowrap text-sm  md:text-lg lg:text-xl text-start w-full select-none cursor-pointer ">
                    <span className="text-one text-md xl:text-xl lg:text-2xl ml-2 ">
                      #
                    </span>
                    إعلانات أعجبتني
                  </h1>
                </Link>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400  border-hidden" />
                </div>
              </div> */}

              <div className="w-full px-8 pb-8">
                <Button
                  title={'تسجيل الخروج'}
                  style={' '}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.clear();
                    }
                    signOut();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
