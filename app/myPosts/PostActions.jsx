'use client';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import toast from 'react-hot-toast';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import { useRouter } from 'next/navigation';

const PostActions = ({ post, session, fetchMyPosts }) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleDeletePost = async (postId) => {
    const data = JSON.parse(localStorage.getItem('CurrentUser'));
    const userId = data?.id;

    if (!userId) {
      toast.custom((t) => (
        <CustomToast t={t} message={'يجب تسجيل الدخول أولاً'} />
      ));
      return;
    }

    const response = await fetch(`/api/product`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId, userId }),
    });

    if (response.ok) {
      fetchMyPosts(userId); // تحديث القائمة بعد الحذف
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={'تم حذف الإعلان بنجاح ✅'}
          greenEmoji={'✔'}
        />
      ));
    } else {
      const errorData = await response.json();
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={errorData.error || 'حدث خطأ أثناء الحذف 😐'}
        />
      ));
    }
  };

  const handleEditPost = (post) => {
    router.push(`/editPost/${post?.id}`);
  };

  return (
    <>
      {/* نافذة تأكيد الحذف */}
      {isVisible && (
        <div className="absolute flex flex-col items-center p-4 z-50 inset-0 bg-five/70 text-white">
          <div className="sticky top-44 w-full sm:w-3/4/2 border border-white rounded bg-three">
            <h1 className="text-center text-lg sm:text-xl mt-4">
              هل تريد حذف هذه الإعلان نهائيا؟
            </h1>
            <div className="flex justify-between items-center w-full h-24 sm:h-28 z-50 gap-8 p-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePost(post?.id);
                  setIsVisible(false);
                }}
                className="btn rounded-[5px] w-full h-full border border-white hover:border-0"
              >
                حذف
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="btn rounded-[5px] w-full h-full border border-white hover:border-0"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* أزرار التعديل والحذف */}
      <div className="flex justify-between items-center w-full p-2 bg-one h-24 text-white">
        <div
          className="flex flex-col items-center justify-center cursor-pointer rounded p-1 md:text-xl hover:bg-three hover:scale-[105%] transition-transform duration-150 ease-in-out"
          onClick={(e) => {
            e.stopPropagation();
            if (session?.status === 'authenticated') {
              handleEditPost(post);
            } else {
              toast.custom((t) => (
                <CustomToast t={t} message={'يجب تسجيل الدخول أولاً'} />
              ));
            }
          }}
        >
          <MdEdit />
          <h6 className="text-sm select-none">تعديل</h6>
        </div>
        <div
          className="flex flex-col items-center justify-center cursor-pointer rounded p-1 md:text-xl hover:bg-three hover:scale-[105%] transition-transform duration-150 ease-in-out"
          onClick={(e) => {
            e.stopPropagation();
            if (session?.status === 'authenticated') {
              setIsVisible(true);
            } else {
              toast.custom((t) => (
                <CustomToast t={t} message={'يجب تسجيل الدخول أولاً'} />
              ));
            }
          }}
        >
          <IoMdClose />
          <h6 className="text-sm select-none">حذف</h6>
        </div>
      </div>
    </>
  );
};

export default PostActions;
