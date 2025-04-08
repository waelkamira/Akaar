'use client';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import toast from 'react-hot-toast';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const PostActions = ({ post, onDelete }) => {
  // تغيير من fetchMyPosts إلى onDelete
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleDeletePost = async (postId) => {
    if (status !== 'authenticated') {
      toast.custom((t) => (
        <CustomToast t={t} message={'يجب تسجيل الدخول أولاً'} />
      ));
      return;
    }

    try {
      const response = await fetch(`/api/product`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            message={'تم حذف الإعلان بنجاح ✅'}
            greenEmoji={'✔'}
          />
        ));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={error.message || 'حدث خطأ أثناء الحذف 😐'}
        />
      ));
    } finally {
      setIsVisible(false);
    }
  };

  const handleEditPost = () => {
    if (status !== 'authenticated') {
      toast.custom((t) => (
        <CustomToast t={t} message={'يجب تسجيل الدخول أولاً'} />
      ));
      return;
    }
    router.push(`/editPost/${post?.id}`);
  };

  return (
    <>
      {/* نافذة تأكيد الحذف */}
      {isVisible && (
        <div className="absolute flex flex-col items-center p-4 z-50 inset-0 bg-black bg-opacity-70 text-white">
          <div className="sticky top-44 w-full max-w-md border border-white rounded-lg bg-white text-black p-6">
            <h1 className="text-center text-lg sm:text-xl mb-6">
              هل تريد حذف هذا الإعلان نهائياً؟
            </h1>
            <div className="flex justify-between gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePost(post?.id);
                }}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                حذف
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="flex-1 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* أزرار التعديل والحذف */}
      <div className="flex justify-between items-center w-full p-3 bg-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditPost();
          }}
          className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-gray-800"
        >
          <MdEdit size={20} />
          <span className="text-xs mt-1">تعديل</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(true);
          }}
          className="flex flex-col items-center justify-center p-2 text-red-600 hover:text-red-800"
        >
          <IoMdClose size={20} />
          <span className="text-xs mt-1">حذف</span>
        </button>
      </div>
    </>
  );
};

export default PostActions;
