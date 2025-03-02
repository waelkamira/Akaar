'use client';
import { useSession } from 'next-auth/react';
import SmallItem from '../../components/ReusableComponents/SmallItem';
import React, { useContext, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import toast from 'react-hot-toast';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import Link from 'next/link';
import { inputsContext } from '../../components/Context';
import Loading from '../../components/ReusableComponents/Loading';
import { useRouter } from 'next/navigation';
import { MdEdit } from 'react-icons/md';
import MiddleBarAndPhoto from '../../components/RealEstate/RealEstateSideBar';
import Image from 'next/image';
import NavegationPages from '../../components/ReusableComponents/NavegationPages';
import MainNavbar from '../../components/navbars/MainNavbar';
import Button from '../../components/Button';
export default function MyFavorites() {
  const [isOpen, setIsOpen] = useState(false);
  const [favoriteId, setfavoriteId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { dispatch } = useContext(inputsContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [userFavoritesCount, setUserFavoritesCount] = useState(0);
  const session = useSession();
  const [myFavorites, setmyFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchmyFavorites();
  }, [session]);

  function fetchmyFavorites() {
    if (session?.data?.user?.email) {
      fetch(`/api/favorite?email=${session.data.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          const favoriteIds = data?.favorites?.map((fav) => fav?.id) || [];
          setmyFavorites(favoriteIds);
        })
        .catch((error) => console.error('Error fetching favorites:', error));
    }
  }
  //? هذه الدالة لحذف المنشورات من المفضلة
  async function handleDeletePost(favoriteId) {
    const email = session?.data?.user?.email;
    const response = await fetch(`/api/favorite`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: favoriteId, email: email }),
    });

    if (response.ok) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={'تم حذف هذا الإعلان من قائمة إعلاناتك'}
          redEmoji={'✖'}
        />
      ));
      fetchmyFavorites();
      setIsVisible(false);
    } else {
      toast.custom((t) => <CustomToast t={t} message={'حدث خطأ ما 😐'} />);
      setIsVisible(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <MainNavbar />

      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[80%] h-fit px-2 sm:px-16 pt-2 overflow-y-auto z-10 mt-16">
        {isVisible && (
          <div className="absolute flex flex-col items-center p-4 /95 z-50 inset-0 bg-black/60 text-white">
            <div className="sticky top-72 w-full sm:w-1/2 border border-white rounded bg-white">
              <h1 className="text-center text-lg sm:text-xl mt-4">
                هل تريد حذف هذه الإعلان نهائيا من المفضلة؟
              </h1>
              <div className="flex justify-between items-center w-full h-24 sm:h-28 z-50 gap-8 p-8">
                <button
                  onClick={() => handleDeletePost(favoriteId)}
                  className="btn rounded-[5px] w-full h-full border border-white hover:border-0"
                >
                  حذف
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="btn rounded-[5px] w-full h-full border border-white hover:border-0"
                >
                  تراجع
                </button>
              </div>
            </div>
          </div>
        )}
        {session?.data?.user ? (
          <div className="flex flex-col justify-center items-center w-full">
            {myFavorites?.length === 0 && session?.data?.user && (
              <Loading
                myMessage={
                  '😉 لا يوجد نتائج لعرضها ,لم تقم بإنشاء أي إعلان بعد'
                }
              />
            )}
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 justify-start items-start w-full">
                {myFavorites?.length > 0 &&
                  myFavorites.map((favorite, index) => (
                    <div
                      className="relative flex flex-col border-2 items-start h-full justify-start bg-one hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer rounded-[10px] overflow-hidden"
                      key={index}
                    >
                      {session?.status === 'authenticated' && (
                        <div className="flex justify-between items-center w-full p-2 bg-one h-24 text-white ">
                          <div
                            className="flex flex-col items-center justify-center cursor-pointer  rounded p-1 md:text-xl  hover:bg-three hover:scale-[105%] transition-transform duration-150 ease-in-out"
                            onClick={() => {
                              setIsVisible(true);
                              setfavoriteId(favorite?.id);
                            }}
                          >
                            <IoMdClose />
                            <h6 className="text-sm select-none">حذف</h6>
                          </div>
                        </div>
                      )}
                      <SmallItem
                        favorite={favorite}
                        index={index}
                        show={false}
                      />
                    </div>
                  ))}
              </div>

              <NavegationPages
                array={myFavorites}
                setPageNumber={setPageNumber}
                pageNumber={pageNumber}
              />
            </div>
          </div>
        ) : (
          <>
            {' '}
            <h1 className="mt-16 w-full text-center">
              يجب عليك تسجيل الدخول أولا
            </h1>
            <Button title={'تسجيل الدخول'} path="/login" style={' '} />
          </>
        )}
      </div>
    </div>
  );
}
