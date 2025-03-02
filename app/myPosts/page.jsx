'use client';
import { useSession } from 'next-auth/react';
import SmallItem from '../../components/ReusableComponents/SmallItem';
import React, { useContext, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import toast from 'react-hot-toast';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import { inputsContext } from '../../components/Context';
import Loading from '../../components/ReusableComponents/Loading';
import { useRouter } from 'next/navigation';
import { MdEdit } from 'react-icons/md';
import NavegationPages from '../../components/ReusableComponents/NavegationPages';
import MainNavbar from '../../components/navbars/MainNavbar';
import Button from '../../components/Button';

export default function MyPosts() {
  const [postId, setpostId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { dispatch } = useContext(inputsContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [userPostsCount, setUserPostsCount] = useState(0);
  const session = useSession();
  const [myPosts, setmyPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('CurrentUser'));
      const userId = data?.id;
      console.log('userId', userId);
      fetchmyPosts(userId);
    }
  }, [pageNumber, session]);

  const fetchmyPosts = async (userId) => {
    await fetch(`/api/myPosts?page=${pageNumber}&userId=${userId}&limit=8`)
      .then((res) => res?.json())
      .then((res) => {
        setmyPosts(res?.posts);
        setUserPostsCount(res?.count);
        console.log(res?.posts);
        dispatch({ type: 'MY_POSTS', payload: res });
      });
  };

  //? هذه الدالة لحذف المنشورات
  async function handleDeletePost(postId) {
    const email = session?.data?.user?.email;
    const response = await fetch(`/api/deletePost`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId, email: email }),
    });

    if (response.ok) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={'تم حذف هذا الإعلان من قائمة إعلاناتك'}
          redEmoji={'✖'}
        />
      ));
      fetchmyPosts();
      setIsVisible(false);
    } else {
      toast.custom((t) => <CustomToast t={t} message={'حدث خطأ ما 😐'} />);
      setIsVisible(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <MainNavbar />

      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[80%] h-fit px-2 sm:px-16 pt-2 overflow-y-auto z-10 ">
        {/* <MiddleBarAndPhoto
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          Button={true}
        /> */}

        {isVisible && (
          <div className="absolute flex flex-col items-center p-4 /95 z-50 inset-0 bg-five/70 text-white">
            <div className="sticky top-72 w-full sm:w-1/2 border border-white rounded bg-three">
              <h1 className="text-center text-lg sm:text-xl mt-4">
                هل تريد حذف هذه الإعلان نهائيا؟
              </h1>
              <div className="flex justify-between items-center w-full h-24 sm:h-28 z-50 gap-8 p-8">
                <button
                  onClick={() => handleDeletePost(postId)}
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

        {session?.status === 'authenticated' ? (
          <div className="flex flex-col justify-center items-center w-full">
            {' '}
            <div className="flex flex-col justify-center items-center w-full gap-4 py-4">
              <h1 className="grow text-lg lg:text-2xl w-full ">
                <span className="text-one  text-2xl ml-2">#</span>
                إعلاناتي <span className="text-one"> {userPostsCount}</span>
              </h1>
            </div>
            {myPosts?.length === 0 && (
              <Loading
                myMessage={
                  '😉 لا يوجد نتائج لعرضها ,لم تقم بإنشاء أي إعلان بعد'
                }
              />
            )}
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 justify-start items-start w-full">
                {myPosts?.length > 0 &&
                  myPosts.map((post, index) => (
                    <div
                      className="relative flex flex-col border-2 items-start h-full justify-start bg-one hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer rounded-[10px] overflow-hidden"
                      key={index}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('item', JSON.stringify(post));
                        }
                        router.push('/post');
                      }}
                    >
                      <div className="flex justify-between items-center w-full p-2 bg-one h-24 text-white ">
                        <div
                          className="flex flex-col items-center justify-center cursor-pointer  rounded p-1 md:text-xl  hover:bg-three hover:scale-[105%] transition-transform duration-150 ease-in-out"
                          // onClick={() => {
                          //   if (typeof window !== 'undefined') {
                          //     localStorage.setItem(
                          //       'item',
                          //       JSON.stringify(post)
                          //     );
                          //   }
                          //   router.push('/post');
                          // }}
                        >
                          <MdEdit />

                          <h6 className="text-sm select-none">تعديل</h6>
                        </div>
                        <div
                          className="flex flex-col items-center justify-center cursor-pointer  rounded p-1 md:text-xl  hover:bg-three hover:scale-[105%] transition-transform duration-150 ease-in-out"
                          onClick={() => {
                            setIsVisible(true);
                            setpostId(post?.id);
                          }}
                        >
                          <IoMdClose />
                          <h6 className="text-sm select-none">حذف</h6>
                        </div>
                      </div>

                      <SmallItem post={post} index={index} show={false} />
                    </div>
                  ))}
              </div>

              <NavegationPages
                array={myPosts}
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
