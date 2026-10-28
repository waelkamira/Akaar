'use client';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import CustomToast from './CustomToast';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IoMdClose } from 'react-icons/io';
import { inputsContext } from '@/features/auth/inputs-context';
import PostGallery from '../photos/PostGallery';
import UserNameAndPhoto from './userNameAndPhoto';
import { motion } from 'framer-motion';
export default function SmallItem({ post, index }) {
  const { dispatch } = useContext(inputsContext);
  const session = useSession();
  const router = useRouter();
  const path = usePathname();

  async function handleDeletePost(post) {
    const response = await fetch(
      `/api/posts/${encodeURIComponent(post?.id || '')}`,
      {
        method: 'DELETE',
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-lg bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-ak-line-strong/20
  shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] 
  transition-all duration-500 overflow-hidden w-[95%] group"
      onClick={() => {
        if (typeof window !== 'undefined')
          localStorage.setItem('item', JSON.stringify(post));
        router.push('/post');
      }}
    >
      <div className="flex flex-col items-center p-6 w-full">
        {/* User Info & Admin Controls */}
        <div className="flex justify-between items-center w-full mb-6">
          <UserNameAndPhoto post={post} />
          {session?.data?.user?.role === 'ADMIN' && path === '/' && (
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center cursor-pointer p-2.5 text-red-400 hover:bg-red-500/20 
          rounded-full transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePost(post);
              }}
            >
              <IoMdClose className="text-2xl" />
            </motion.div>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold text-ak-cream/90 line-clamp-1 mb-4
    group-hover:text-ak-cream transition-colors duration-300"
        >
          {post?.title}
        </h1>

        {/* Image Gallery */}
        <div className="w-full rounded-lg overflow-hidden mb-6">
          <PostGallery post={post} />
        </div>

        {/* Description */}
        <pre
          className="text-base text-ak-cream/70 line-clamp-2 mb-6 font-sans
    group-hover:text-ak-cream/90 transition-colors duration-300"
        >
          {post?.description}
        </pre>

        {/* View Post Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            if (session?.status === 'authenticated') {
              if (typeof window !== 'undefined')
                localStorage.setItem('item', JSON.stringify(post));
              router.push(`/post/${post?.id}`);
            } else {
              toast.custom((t) => (
                <CustomToast
                  t={t}
                  message="يجب تسجيل الدخول لرؤية هذا الإعلان 😉"
                />
              ));
            }
          }}
          className="w-full bg-gradient-to-r from-white/20 to-white/10 text-ak-cream py-3 px-6
      rounded-lg font-medium hover:from-white/30 hover:to-white/20 
      transition-all duration-300 transform hover:shadow-lg"
        >
          عرض الإعلان
        </motion.button>
      </div>
    </motion.div>
  );
}
