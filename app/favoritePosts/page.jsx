'use client';
import { useSession } from 'next-auth/react';
import SmallItem from '../../components/SmallItem';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import toast from 'react-hot-toast';
import CustomToast from '../../components/CustomToast';
import BackButton from '../../components/BackButton';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import MiddleBarAndPhoto from '../../components/middleBarAndPhoto';
import { usePathname } from 'next/navigation';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const session = useSession();
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchUserFavorites();
    }
  }, [session.status, pageNumber]);

  const fetchUserFavorites = async () => {
    const email = session?.data?.user?.email;
    console.log('email', email);
    if (email) {
      try {
        const res = await fetch(
          `/api/favoritePosts?page=${pageNumber}&email=${email}&limit=8`
        );
        const data = await res.json();
        console.log('data', data);
        if (res.ok) {
          setUserFavorites(data);
        }
      } catch (error) {
        console.error('Error fetching user favorites:', error);
      }
    }
  };

  async function handleDeletePost(post) {
    const email = session?.data?.user?.email;

    if (email) {
      try {
        const response = await fetch(`/api/actions?email=${email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mealId: post?.id,
            actionType: 'hearts',
            newActionValue: 0,
          }),
        });

        if (response.ok) {
          toast.custom((t) => (
            <CustomToast
              t={t}
              message={'👍 تم حذف هذا البوست من قائمة المفضلة لديك'}
            />
          ));
          fetchUserFavorites(); // Refresh the favorites list
        } else {
          toast.custom((t) => <CustomToast t={t} message={'حدث خطأ ما 😐'} />);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.custom((t) => <CustomToast t={t} message={'حدث خطأ ما 😐'} />);
      }
    }
  }

  return (
    <div className="flex justify-center items-start w-full bg-gradient-to-tr from-[#494949] to-four rounded-b-[5px]">
      <div className="relative w-full xl:w-[90%] 2xl:w-[70%] px-2 sm:pt-4 rounded-b-[5px] z-50">
        <MiddleBarAndPhoto
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          noButton={true}
        />
        <div className="relative w-full h-[300px] lg:h-[400px] border-l-[18px] border-one overflow-hidden rounded-[5px]">
          <Image
            src="https://i.imgur.com/wZ0aruw.jpg"
            fill
            alt="home_photo"
            className="object-cover object-center w-full h-auto"
            objectPosition="center"
          />
        </div>

        <div className="flex justify-between items-center w-full gap-2 mt-2 sm:my-8">
          <h1 className="text-right text-xl text-white">
            <span className="text-one text-2xl ml-2">#</span>
            وصفاتي المفضلة
          </h1>
        </div>

        <div className=" my-4 sm:my-8">
          {userFavorites?.length === 0 && (
            <Loading
              myMessage={'لا يوجد نتائج لعرضها 😉 لم تقم بحفظ أي وصفة بعد'}
            />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 mb-2 sm:p-0 gap-x-2 justify-start items-start w-full sm:border border-gray-500 rounded-[5px]">
            {userFavorites?.length > 0 &&
              userFavorites.map((post, index) => (
                <div className="relative " key={index}>
                  <SmallItem post={post} index={index} show={false} id={true} />
                </div>
              ))}
          </div>
          <div className="flex items-center justify-around my-4 mt-8 text-white">
            {userFavorites?.length >= 5 && (
              <Link href={'#post1'}>
                <div
                  className="flex items-center justify-around cursor-pointer"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  <h1 className="">الصفحة التالية</h1>
                  <MdKeyboardDoubleArrowRight className="text-2xl  text-one" />
                </div>
              </Link>
            )}
            {pageNumber > 1 && (
              <Link href={'#post1'}>
                <div
                  className="flex items-center justify-around cursor-pointer"
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  <MdKeyboardDoubleArrowLeft className="text-2xl  text-one" />
                  <h1 className="">الصفحة السابقة</h1>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
