// 'use client';
// import Button from '../../components/Buttons/Button';
// import { signOut, useSession } from 'next-auth/react';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import Link from 'next/link';
// import CustomToast from '../../components/ReusableComponents/CustomToast';
// import LoadingPhoto from '../../components/photos/LoadingPhoto';
// import { motion } from 'framer-motion';
// import { FaSave, FaSignOutAlt } from 'react-icons/fa';

// export default function Profile() {
//   const session = useSession();
//   const [user, setUser] = useState('');
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const getUser = JSON.parse(localStorage.getItem('CurrentUser'));
//         console.log(getUser);
//         setUser(getUser);
//       } catch (error) {
//         console.error('Error parsing CurrentUser from localStorage:', error);
//       }
//     }
//   }, []);

//   // Save changes (name)
//   async function saveProfileChanges() {
//     if (user) {
//       console.log(user);
//       const formData = {
//         id: user?.id,
//         username: userName || user?.username,
//         userImage: session?.data?.user?.image,
//       };

//       const response = await fetch('/api/user', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         toast.success('تم تحديث الملف الشخصي بنجاح');
//         const response = await fetch(
//           `/api/user?email=${session?.data?.user?.email}`,
//         );
//         const json = await response.json();

//         if (typeof window !== 'undefined') {
//           localStorage.setItem('CurrentUser', JSON.stringify(json));
//         }
//       } else {
//         toast.custom((t) => (
//           <CustomToast t={t} message={'حدث خطأ ما حاول مرة أخرى 😐'} />
//         ));
//       }
//     }
//   }

//   if (session?.status === 'unauthenticated') {
//     // return <LoginButton />;
//   }
//   return (
//     <div className="flex flex-col items-center justify-start mt-64 sm:mt-0 w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 sm:p-12">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-full px-6 py-8 bg-white shadow-2xl rounded-lg border border-gray-200 "
//       >
//         <div className="flex flex-col items-center gap-4 w-full">
//           {/* Profile Image Section */}
//           <div className="relative size-40 rounded-full overflow-hidden shadow-lg bg-gray-200">
//             {!session?.data?.user?.image ? (
//               <LoadingPhoto />
//             ) : (
//               <Image
//                 priority
//                 src={session?.data?.user?.image || '/palceholder.jpg'}
//                 layout="fill"
//                 objectFit="cover"
//                 alt={session?.data?.user?.name}
//                 className="rounded-full"
//               />
//             )}
//           </div>

//           <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-2 w-full">
//             {/* Save Button */}
//             <div className="w-full sm:w-[20%]">
//               <Button
//                 title="حفظ"
//                 onClick={saveProfileChanges}
//                 style=" btn bg-primary-500 text-white hover:bg-primary-600 transition-all py-2 rounded-lg w-1/2 text-lg font-semibold"
//                 emoji={<FaSave />}
//               />
//             </div>
//             {/* User Name Section */}
//             <div className="flex-grow flex flex-col items-center gap-2 w-full">
//               <input
//                 type="text"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 autoFocus
//                 placeholder="أدخل اسمك الجديد"
//                 className="px-4 sm:py-1 text-lg text-gray-700 border rounded-lg w-full bg-gray-50 outline-none focus:border-transparent transition-all focus:outline-primary-400 placeholder:text-sm placeholder:sm:text-lg"
//               />
//             </div>
//           </div>
//           <div className="w-full border-t border-gray-300"></div>

//           {/* User Email and Name Section */}
//           <div className="flex flex-col items-start gap-2 w-full">
//             <h2 className="text-sm sm:text-lg text-gray-600">
//               الإسم: <span>{user?.username}</span>
//             </h2>
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="flex flex-col items-start gap-2 w-full">
//             <h2 className="text-sm sm:text-lg text-gray-600">
//               الإيميل: <span>{session?.data?.user?.email}</span>
//             </h2>

//             <div className="w-full border-t border-gray-300"></div>
//           </div>

//           {/* Links to Other Pages */}
//           <div className="flex flex-col items-start gap-4 w-full mt-4">
//             <Link href="/posts">
//               <h1 className="text-sm sm:text-lg text-gray-700 hover:text-primary-500 transition-all">
//                 إعلاناتي
//               </h1>
//             </Link>
//             <div className="w-full border-t border-gray-300"></div>
//           </div>

//           {/* Logout Button */}
//           <div className="w-full lg:w-1/2 mt-6">
//             <Button
//               title="تسجيل الخروج"
//               onClick={() => {
//                 if (typeof window !== 'undefined') {
//                   localStorage.clear();
//                 }
//                 signOut();
//               }}
//               emoji={<FaSignOutAlt />}
//               style=" btn font-bold text-white hover:bg-red-600 transition-all py-3 rounded-lg w-full text-lg font-semibold"
//             />
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSave, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import {
  MdEmail,
  MdPerson,
  MdAdsClick,
  MdEdit,
  MdCheckCircle,
} from 'react-icons/md';
import LoadingPhoto from '../../components/photos/LoadingPhoto';

// متغيرات الحركة لحركة انسيابية فاخرة
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Profile() {
  const { data: session, status } = useSession();

  // الحالة الأساسية تعتمد على session كخيار احتياطي آمن لمنع التعليق
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (status === 'authenticated') {
      try {
        const storedUserString = localStorage.getItem('CurrentUser');
        if (storedUserString) {
          const storedUser = JSON.parse(storedUserString);
          setUser(storedUser);
          setUserName(storedUser.username || session?.user?.name || '');
        } else {
          // fallback آمن إذا كان localStorage فارغاً
          setUser({
            id: session?.user?.id || 'unknown',
            username:
              session?.user?.name ||
              session?.user?.email?.split('@')[0] ||
              'مستخدم',
            image: session?.user?.image,
          });
          setUserName(session?.user?.name || '');
        }
      } catch (error) {
        console.error('Error parsing CurrentUser:', error);
        // fallback في حال حدوث خطأ في الـ parsing
        setUser({
          username: session?.user?.name || 'مستخدم',
          image: session?.user?.image,
        });
        setUserName(session?.user?.name || '');
      }
    }
  }, [status, session]);

  async function saveProfileChanges() {
    if (!userName.trim()) {
      toast.error('يرجى إدخال اسم صحيح');
      return;
    }

    setIsSaving(true);
    try {
      const formData = {
        id: user?.id || session?.user?.id,
        username: userName.trim(),
        userImage: session?.user?.image,
      };

      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUserResponse = await fetch(
          `/api/user?email=${encodeURIComponent(session?.user?.email || '')}`,
        );

        if (updatedUserResponse.ok) {
          const updatedUser = await updatedUserResponse.json();
          localStorage.setItem('CurrentUser', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }

        toast.success('تم تحديث الملف الشخصي بنجاح', {
          icon: <MdCheckCircle className="text-emerald-500 text-xl" />,
        });
      } else {
        throw new Error('فشل في التحديث من الخادم');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ ما أثناء الحفظ، حاول مرة أخرى');
    } finally {
      setIsSaving(false);
    }
  }

  // 1. عرض التحميل فقط أثناء التحقق الأولي (لم نعد نعلق الصفحة بسبب !user)
  if (status === 'loading' || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingPhoto />
      </div>
    );
  }

  // 2. رفض الدخول بوضوح إذا لم يكن مسجلاً
  // if (status === 'unauthenticated') {
  //   return (
  //     <div
  //       className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4"
  //       dir="rtl"
  //     >
  //       <FaUserCircle className="text-6xl text-gray-300" />
  //       <p className="text-gray-600 text-lg font-semibold">
  //         يرجى تسجيل الدخول للوصول إلى هذه الصفحة.
  //       </p>
  //       <Link
  //         href="/login"
  //         className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
  //       >
  //         تسجيل الدخول
  //       </Link>
  //     </div>
  //   );
  // }

  // 3. بيانات العرض الآمنة (Fallback نهائي)
  const displayUser = user || {
    username: session?.user?.name || 'مستخدم',
    image: session?.user?.image,
  };
  const displayName = userName || displayUser.username;
  const hasValidImage =
    displayUser.image &&
    typeof displayUser.image === 'string' &&
    displayUser.image.length > 0;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100 py-12 px-4 sm:px-8 mt-64"
      dir="rtl"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-orange-500/5 border border-white/60 overflow-hidden"
      >
        {/* 🌟 رأس البطاقة */}
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-l from-orange-500 to-orange-600 p-8 sm:p-10"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
              {!hasValidImage ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <FaUserCircle className="text-6xl text-gray-300" />
                </div>
              ) : (
                <Image
                  priority
                  src={displayUser.image}
                  alt={displayName || 'صورة الملف الشخصي'}
                  width={144}
                  height={144}
                  className="object-cover w-28 h-28 sm:w-36 sm:h-36"
                  onError={(e) => {
                    // إخفاء الصورة في حال كان الرابط تالفاً لمنع انهيار الصفحة
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML =
                      '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="text-6xl text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>';
                  }}
                />
              )}
            </div>

            <div className="text-center sm:text-right text-white flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {displayName}
              </h1>
              <p className="text-orange-100 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                <MdEmail className="text-lg" />
                {session?.user?.email || 'لا يوجد بريد إلكتروني'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 🌟 جسم البطاقة */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* قسم تعديل الاسم */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MdEdit className="text-orange-500 text-xl" />
              تعديل المعلومات
            </h2>

            <div className="relative group">
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block mr-1">
                الاسم الظاهر
              </label>
              <div className="relative flex items-center w-full h-14 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-orange-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all duration-300">
                <MdPerson className="absolute right-4 text-gray-400 text-xl group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="أدخل اسمك الجديد"
                  className="w-full h-full bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none pr-12 pl-4 rounded-xl"
                />
              </div>
            </div>

            <button
              onClick={saveProfileChanges}
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FaSave className="text-lg" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </motion.div>

          <div className="border-t border-gray-100" />

          {/* قسم الروابط السريعة */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MdAdsClick className="text-orange-500 text-xl" />
              إدارة الحساب
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/posts"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-orange-50 hover:border-orange-200 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <MdAdsClick />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-orange-700">
                    إعلاناتي
                  </h3>
                  <p className="text-xs text-gray-500">عرض وتعديل إعلاناتك</p>
                </div>
              </Link>
            </div>
          </motion.div>

          <div className="border-t border-gray-100" />

          {/* قسم تسجيل الخروج */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => {
                localStorage.clear();
                signOut({ callbackUrl: '/' });
              }}
              className="w-full flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 group"
            >
              <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
              تسجيل الخروج
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
