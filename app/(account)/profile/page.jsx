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
// 'use client';

// import { signOut, useSession } from 'next-auth/react';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { FaSave, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
// import {
//   MdEmail,
//   MdPerson,
//   MdAdsClick,
//   MdEdit,
//   MdCheckCircle,
// } from 'react-icons/md';
// import LoadingPhoto from '../../../components/photos/LoadingPhoto';

// // متغيرات الحركة لحركة انسيابية فاخرة
// const containerVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 15 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };

// export default function Profile() {
//   const { data: session, status } = useSession();

//   // الحالة الأساسية تعتمد على session كخيار احتياطي آمن لمنع التعليق
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState('');
//   const [isSaving, setIsSaving] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);

//     if (status === 'authenticated') {
//       try {
//         const storedUserString = localStorage.getItem('CurrentUser');
//         if (storedUserString) {
//           const storedUser = JSON.parse(storedUserString);
//           setUser(storedUser);
//           setUserName(storedUser.username || session?.user?.name || '');
//         } else {
//           // fallback آمن إذا كان localStorage فارغاً
//           setUser({
//             id: session?.user?.id || 'unknown',
//             username:
//               session?.user?.name ||
//               session?.user?.email?.split('@')[0] ||
//               'مستخدم',
//             image: session?.user?.image,
//           });
//           setUserName(session?.user?.name || '');
//         }
//       } catch (error) {
//         console.error('Error parsing CurrentUser:', error);
//         // fallback في حال حدوث خطأ في الـ parsing
//         setUser({
//           username: session?.user?.name || 'مستخدم',
//           image: session?.user?.image,
//         });
//         setUserName(session?.user?.name || '');
//       }
//     }
//   }, [status, session]);

//   async function saveProfileChanges() {
//     if (!userName.trim()) {
//       toast.error('يرجى إدخال اسم صحيح');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const formData = {
//         id: user?.id || session?.user?.id,
//         username: userName.trim(),
//         userImage: session?.user?.image,
//       };

//       const response = await fetch('/api/user', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const updatedUserResponse = await fetch(
//           `/api/user?email=${encodeURIComponent(session?.user?.email || '')}`,
//         );

//         if (updatedUserResponse.ok) {
//           const updatedUser = await updatedUserResponse.json();
//           localStorage.setItem('CurrentUser', JSON.stringify(updatedUser));
//           setUser(updatedUser);
//         }

//         toast.success('تم تحديث الملف الشخصي بنجاح', {
//           icon: <MdCheckCircle className="text-emerald-500 text-xl" />,
//         });
//       } else {
//         throw new Error('فشل في التحديث من الخادم');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('حدث خطأ ما أثناء الحفظ، حاول مرة أخرى');
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   // 1. عرض التحميل فقط أثناء التحقق الأولي (لم نعد نعلق الصفحة بسبب !user)
//   if (status === 'loading' || !isMounted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <LoadingPhoto />
//       </div>
//     );
//   }

//   // 2. رفض الدخول بوضوح إذا لم يكن مسجلاً
//   // if (status === 'unauthenticated') {
//   //   return (
//   //     <div
//   //       className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4"
//   //       dir="rtl"
//   //     >
//   //       <FaUserCircle className="text-6xl text-gray-300" />
//   //       <p className="text-gray-600 text-lg font-semibold">
//   //         يرجى تسجيل الدخول للوصول إلى هذه الصفحة.
//   //       </p>
//   //       <Link
//   //         href="/login"
//   //         className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//   //       >
//   //         تسجيل الدخول
//   //       </Link>
//   //     </div>
//   //   );
//   // }

//   // 3. بيانات العرض الآمنة (Fallback نهائي)
//   const displayUser = user || {
//     username: session?.user?.name || 'مستخدم',
//     image: session?.user?.image,
//   };
//   const displayName = userName || displayUser.username;
//   const hasValidImage =
//     displayUser.image &&
//     typeof displayUser.image === 'string' &&
//     displayUser.image.length > 0;

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100 py-12 px-4 sm:px-8 mt-64"
//       dir="rtl"
//     >
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="max-w-3xl mx-auto bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-orange-500/5 border border-white/60 overflow-hidden"
//       >
//         {/* 🌟 رأس البطاقة */}
//         <motion.div
//           variants={itemVariants}
//           className="relative bg-gradient-to-l from-orange-500 to-orange-600 p-8 sm:p-10"
//         >
//           <div className="flex flex-col sm:flex-row items-center gap-6">
//             <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
//               {!hasValidImage ? (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                   <FaUserCircle className="text-6xl text-gray-300" />
//                 </div>
//               ) : (
//                 <Image
//                   priority
//                   src={displayUser.image}
//                   alt={displayName || 'صورة الملف الشخصي'}
//                   width={144}
//                   height={144}
//                   className="object-cover w-28 h-28 sm:w-36 sm:h-36"
//                   onError={(e) => {
//                     // إخفاء الصورة في حال كان الرابط تالفاً لمنع انهيار الصفحة
//                     e.target.style.display = 'none';
//                     e.target.parentElement.innerHTML =
//                       '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="text-6xl text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>';
//                   }}
//                 />
//               )}
//             </div>

//             <div className="text-center sm:text-right text-white flex-1">
//               <h1 className="text-2xl sm:text-3xl font-bold mb-2">
//                 {displayName}
//               </h1>
//               <p className="text-orange-100 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
//                 <MdEmail className="text-lg" />
//                 {session?.user?.email || 'لا يوجد بريد إلكتروني'}
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         {/* 🌟 جسم البطاقة */}
//         <div className="p-6 sm:p-10 space-y-8">
//           {/* قسم تعديل الاسم */}
//           <motion.div variants={itemVariants} className="space-y-4">
//             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//               <MdEdit className="text-orange-500 text-xl" />
//               تعديل المعلومات
//             </h2>

//             <div className="relative group">
//               <label className="text-sm font-semibold text-gray-600 mb-1.5 block mr-1">
//                 الاسم الظاهر
//               </label>
//               <div className="relative flex items-center w-full h-14 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-orange-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all duration-300">
//                 <MdPerson className="absolute right-4 text-gray-400 text-xl group-focus-within:text-orange-500 transition-colors" />
//                 <input
//                   type="text"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   placeholder="أدخل اسمك الجديد"
//                   className="w-full h-full bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none pr-12 pl-4 rounded-xl"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={saveProfileChanges}
//               disabled={isSaving}
//               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
//             >
//               {isSaving ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   جاري الحفظ...
//                 </>
//               ) : (
//                 <>
//                   <FaSave className="text-lg" />
//                   حفظ التغييرات
//                 </>
//               )}
//             </button>
//           </motion.div>

//           <div className="border-t border-gray-100" />

//           {/* قسم الروابط السريعة */}
//           <motion.div variants={itemVariants} className="space-y-4">
//             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//               <MdAdsClick className="text-orange-500 text-xl" />
//               إدارة الحساب
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Link
//                 href="/posts"
//                 className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-orange-50 hover:border-orange-200 transition-all duration-300"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
//                   <MdAdsClick />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-800 group-hover:text-orange-700">
//                     إعلاناتي
//                   </h3>
//                   <p className="text-xs text-gray-500">عرض وتعديل إعلاناتك</p>
//                 </div>
//               </Link>
//             </div>
//           </motion.div>

//           <div className="border-t border-gray-100" />

//           {/* قسم تسجيل الخروج */}
//           <motion.div variants={itemVariants}>
//             <button
//               onClick={() => {
//                 localStorage.clear();
//                 signOut({ callbackUrl: '/' });
//               }}
//               className="w-full flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 group"
//             >
//               <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
//               تسجيل الخروج
//             </button>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// 'use client';

// import { signOut, useSession } from 'next-auth/react';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { FaSave, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
// import {
//   MdEmail,
//   MdPerson,
//   MdAdsClick,
//   MdEdit,
//   MdCheckCircle,
// } from 'react-icons/md';
// import LoadingPhoto from '../../../components/photos/LoadingPhoto';

// // متغيرات الحركة لحركة انسيابية فاخرة
// const containerVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 15 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };

// export default function Profile() {
//   const { data: session, status } = useSession();

//   // الحالة الأساسية تعتمد على session كخيار احتياطي آمن لمنع التعليق
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState('');
//   const [isSaving, setIsSaving] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);

//     if (status === 'authenticated') {
//       try {
//         const storedUserString = localStorage.getItem('CurrentUser');
//         if (storedUserString) {
//           const storedUser = JSON.parse(storedUserString);
//           setUser(storedUser);
//           setUserName(storedUser.username || session?.user?.name || '');
//         } else {
//           // fallback آمن إذا كان localStorage فارغاً
//           setUser({
//             id: session?.user?.id || 'unknown',
//             username:
//               session?.user?.name ||
//               session?.user?.email?.split('@')[0] ||
//               'مستخدم',
//             image: session?.user?.image,
//           });
//           setUserName(session?.user?.name || '');
//         }
//       } catch (error) {
//         console.error('Error parsing CurrentUser:', error);
//         // fallback في حال حدوث خطأ في الـ parsing
//         setUser({
//           username: session?.user?.name || 'مستخدم',
//           image: session?.user?.image,
//         });
//         setUserName(session?.user?.name || '');
//       }
//     }
//   }, [status, session]);

//   async function saveProfileChanges() {
//     if (!userName.trim()) {
//       toast.error('يرجى إدخال اسم صحيح');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const formData = {
//         id: user?.id || session?.user?.id,
//         username: userName.trim(),
//         userImage: session?.user?.image,
//       };

//       const response = await fetch('/api/user', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const updatedUserResponse = await fetch(
//           `/api/user?email=${encodeURIComponent(session?.user?.email || '')}`,
//         );

//         if (updatedUserResponse.ok) {
//           const updatedUser = await updatedUserResponse.json();
//           localStorage.setItem('CurrentUser', JSON.stringify(updatedUser));
//           setUser(updatedUser);
//         }

//         toast.success('تم تحديث الملف الشخصي بنجاح', {
//           icon: <MdCheckCircle className="text-emerald-500 text-xl" />,
//         });
//       } else {
//         throw new Error('فشل في التحديث من الخادم');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('حدث خطأ ما أثناء الحفظ، حاول مرة أخرى');
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   // 1. عرض التحميل فقط أثناء التحقق الأولي
//   if (status === 'loading' || !isMounted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-neutral-950">
//         <LoadingPhoto />
//       </div>
//     );
//   }

//   // 3. بيانات العرض الآمنة (Fallback نهائي)
//   const displayUser = user || {
//     username: session?.user?.name || 'مستخدم',
//     image: session?.user?.image,
//   };
//   const displayName = userName || displayUser.username;
//   const hasValidImage =
//     displayUser.image &&
//     typeof displayUser.image === 'string' &&
//     displayUser.image.length > 0;

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden mt-60"
//       dir="rtl"
//     >
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
//         <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
//       </div>

//       {/* Vertical Text Decoration */}
//       <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
//         <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
//           PROFILE
//         </h1>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-neutral-800 overflow-hidden"
//         >
//           {/* 🌟 رأس البطاقة */}
//           <motion.div
//             variants={itemVariants}
//             className="relative bg-neutral-800/30 p-8 sm:p-10 border-b border-neutral-800"
//           >
//             <div className="flex flex-col sm:flex-row items-center gap-6">
//               <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-neutral-700 shadow-xl overflow-hidden bg-neutral-800 shrink-0 group hover:border-orange-500/50 transition-colors duration-300">
//                 {!hasValidImage ? (
//                   <div className="w-full h-full flex items-center justify-center bg-neutral-800">
//                     <FaUserCircle className="text-6xl text-neutral-600" />
//                   </div>
//                 ) : (
//                   <Image
//                     priority
//                     src={displayUser.image}
//                     alt={displayName || 'صورة الملف الشخصي'}
//                     width={144}
//                     height={144}
//                     className="object-cover w-full h-full"
//                     onError={(e) => {
//                       // إخفاء الصورة في حال كان الرابط تالفاً لمنع انهيار الصفحة
//                       e.target.style.display = 'none';
//                       e.target.parentElement.innerHTML =
//                         '<div class="w-full h-full flex items-center justify-center bg-neutral-800"><svg class="text-6xl text-neutral-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>';
//                     }}
//                   />
//                 )}
//               </div>

//               <div className="text-center sm:text-right text-white flex-1">
//                 <h1 className="text-2xl sm:text-3xl font-black mb-2">
//                   {displayName}
//                 </h1>
//                 <p className="text-neutral-400 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
//                   <MdEmail className="text-lg text-orange-500" />
//                   {session?.user?.email || 'لا يوجد بريد إلكتروني'}
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* 🌟 جسم البطاقة */}
//           <div className="p-6 sm:p-10 space-y-8">
//             {/* قسم تعديل الاسم */}
//             <motion.div variants={itemVariants} className="space-y-4">
//               <h2 className="text-lg font-bold text-white flex items-center gap-2">
//                 <MdEdit className="text-orange-500 text-xl" />
//                 تعديل المعلومات
//               </h2>

//               <div className="relative group">
//                 <label className="text-sm font-bold text-neutral-300 mb-1.5 block mr-1">
//                   الاسم الظاهر
//                 </label>
//                 <div className="relative flex items-center w-full h-14 rounded-xl border border-neutral-700/50 bg-neutral-800/50 hover:border-neutral-600 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/20 transition-all duration-300">
//                   <MdPerson className="absolute right-4 text-neutral-500 text-xl group-focus-within:text-orange-500 transition-colors" />
//                   <input
//                     type="text"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     placeholder="أدخل اسمك الجديد"
//                     className="w-full h-full bg-transparent text-white placeholder-neutral-500 focus:outline-none pr-12 pl-4 rounded-xl"
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={saveProfileChanges}
//                 disabled={isSaving}
//                 className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:from-neutral-700 disabled:to-neutral-700 disabled:text-neutral-400 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
//               >
//                 {isSaving ? (
//                   <>
//                     <svg
//                       className="animate-spin h-5 w-5 text-white"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                         fill="none"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     جاري الحفظ...
//                   </>
//                 ) : (
//                   <>
//                     <FaSave className="text-lg" />
//                     حفظ التغييرات
//                   </>
//                 )}
//               </button>
//             </motion.div>

//             <div className="border-t border-neutral-800" />

//             {/* قسم الروابط السريعة */}
//             <motion.div variants={itemVariants} className="space-y-4">
//               <h2 className="text-lg font-bold text-white flex items-center gap-2">
//                 <MdAdsClick className="text-amber-500 text-xl" />
//                 إدارة الحساب
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Link
//                   href="/posts"
//                   className="group flex items-center gap-4 p-5 rounded-2xl bg-neutral-800/30 border border-neutral-700/50 hover:bg-neutral-800/60 hover:border-orange-500/30 transition-all duration-300"
//                 >
//                   <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
//                     <MdAdsClick />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">
//                       إعلاناتي
//                     </h3>
//                     <p className="text-xs text-neutral-400 mt-1">
//                       عرض وتعديل إعلاناتك
//                     </p>
//                   </div>
//                 </Link>
//               </div>
//             </motion.div>

//             <div className="border-t border-neutral-800" />

//             {/* قسم تسجيل الخروج */}
//             <motion.div variants={itemVariants}>
//               <button
//                 onClick={() => {
//                   localStorage.clear();
//                   signOut({ callbackUrl: '/' });
//                 }}
//                 className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 font-bold py-4 px-6 rounded-xl transition-all duration-300 group"
//               >
//                 <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
//                 تسجيل الخروج
//               </button>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import React, { useState } from 'react';
// import { 
//   Home, 
//   BarChart3, 
//   FolderKanban, 
//   CheckSquare, 
//   Calendar, 
//   MessageSquare, 
//   Settings,
//   Search,
//   Bell,
//   Mail,
//   MoreHorizontal,
//   TrendingUp,
//   Users,
//   Award,
//   Clock,
//   ChevronRight
// } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState('Overview');

//   const navItems = [
//     { name: 'Overview', icon: Home },
//     { name: 'Analytics', icon: BarChart3 },
//     { name: 'Projects', icon: FolderKanban },
//     { name: 'Tasks', icon: CheckSquare },
//     { name: 'Calendar', icon: Calendar },
//     { name: 'Messages', icon: MessageSquare },
//     { name: 'Settings', icon: Settings },
//   ];

//   const stats = [
//     { 
//       title: 'Total Projects', 
//       value: '24', 
//       change: '+12%', 
//       icon: FolderKanban,
//       color: 'bg-purple-500',
//       bgColor: 'bg-purple-50'
//     },
//     { 
//       title: 'Tasks Completed', 
//       value: '86', 
//       change: '+18%', 
//       icon: Award,
//       color: 'bg-orange-400',
//       bgColor: 'bg-orange-50'
//     },
//     { 
//       title: 'Total Followers', 
//       value: '1.2K', 
//       change: '+8%', 
//       icon: Users,
//       color: 'bg-green-500',
//       bgColor: 'bg-green-50'
//     },
//   ];

//   const tasks = [
//     { 
//       title: 'UI Design Review', 
//       time: 'Today, 10:00 AM', 
//       status: 'In Progress',
//       color: 'bg-pink-400',
//       icon: FolderKanban
//     },
//     { 
//       title: 'Develop Landing Page', 
//       time: 'Today, 01:00 PM', 
//       status: 'In Progress',
//       color: 'bg-yellow-400',
//       icon: Clock
//     },
//     { 
//       title: 'Fix Dashboard Bugs', 
//       time: 'Tomorrow, 11:00 AM', 
//       status: 'To Do',
//       color: 'bg-green-400',
//       icon: CheckSquare
//     },
//     { 
//       title: 'Client Meeting', 
//       time: 'Tomorrow, 03:00 PM', 
//       status: 'Upcoming',
//       color: 'bg-purple-400',
//       icon: Users
//     },
//   ];

//   const projectStats = [
//     { label: 'Design', value: '68%', color: 'bg-purple-500' },
//     { label: 'Development', value: '52%', color: 'bg-blue-500' },
//     { label: 'Testing', value: '40%', color: 'bg-yellow-400' },
//     { label: 'Marketing', value: '30%', color: 'bg-green-500' },
//   ];

//   return (
//     <div className="min-h-screen mt-64 bg-gradient-to-br from-purple-50 via-white to-orange-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-6">
          
//           {/* Sidebar */}
//           <motion.div 
//             initial={{ x: -50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             className="w-64 bg-gradient-to-b from-purple-400 to-purple-600 rounded-3xl p-6 text-white hidden lg:block shadow-2xl shadow-purple-300/50"
//           >
//             <div className="flex items-center gap-3 mb-10">
//               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                 <span className="text-2xl"></span>
//               </div>
//               <span className="font-bold text-xl">Dashboard</span>
//             </div>

//             <nav className="space-y-2">
//               {navItems.map((item) => (
//                 <button
//                   key={item.name}
//                   onClick={() => setActiveTab(item.name)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     activeTab === item.name 
//                       ? 'bg-white text-purple-600 shadow-lg' 
//                       : 'text-white/80 hover:bg-white/10'
//                   }`}
//                 >
//                   <item.icon size={20} />
//                   <span className="font-medium">{item.name}</span>
//                 </button>
//               ))}
//             </nav>

//             <div className="absolute bottom-6 left-6 right-6">
//               <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
//                 <div className="flex items-center gap-3">
//                   <div className="text-3xl"></div>
//                   <div>
//                     <p className="text-sm font-medium">Plant Care</p>
//                     <p className="text-xs text-white/70">Water your plant</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Header */}
//             <motion.div 
//               initial={{ y: -20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="flex items-center justify-between mb-8"
//             >
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800 mb-1">
//                   Dashboard <span className="text-2xl">👋</span>
//                 </h1>
//                 <p className="text-gray-500">Welcome back, Nidhi! 💜</p>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                   <input 
//                     type="text" 
//                     placeholder="Search anything..."
//                     className="pl-10 pr-4 py-2.5 bg-white rounded-2xl border-0 shadow-sm focus:ring-2 focus:ring-purple-300 w-64"
//                   />
//                 </div>
//                 <button className="relative p-2.5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
//                   <Bell size={20} className="text-gray-600" />
//                   <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                 </button>
//                 <button className="p-2.5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
//                   <Mail size={20} className="text-gray-600" />
//                 </button>
//                 <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 p-0.5">
//                   <div className="w-full h-full rounded-2xl bg-white p-0.5">
//                     <img 
//                       src="https://i.pravatar.cc/150?img=5" 
//                       alt="Profile" 
//                       className="w-full h-full rounded-xl object-cover"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Welcome Card & Stats */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//               {/* Welcome Card */}
//               <motion.div 
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.1 }}
//                 className="lg:col-span-1 bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl p-6 border border-pink-100"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg">
//                     <img 
//                       src="https://i.pravatar.cc/150?img=5" 
//                       alt="Welcome" 
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-800 mb-1">
//                       Good Morning! 🌟
//                     </h2>
//                     <p className="text-gray-600 text-sm">
//                       Let's make today amazing! 💜
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Stats Cards */}
//               {stats.map((stat, index) => (
//                 <motion.div
//                   key={stat.title}
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.2 + index * 0.1 }}
//                   className={`${stat.bgColor} rounded-3xl p-6 border border-white/50`}
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
//                       <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
//                     </div>
//                     <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
//                       <stat.icon size={24} />
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
//                     <TrendingUp size={16} />
//                     <span>{stat.change}</span>
//                     <span className="text-gray-500 font-normal">from last month</span>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Activity & Tasks */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//               {/* Activity Overview */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-bold text-gray-800">Activity Overview</h3>
//                   <select className="bg-gray-50 border-0 rounded-xl px-4 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-purple-300">
//                     <option>This Week</option>
//                     <option>Last Week</option>
//                     <option>This Month</option>
//                   </select>
//                 </div>
                
//                 {/* Simple Line Chart Visualization */}
//                 <div className="relative h-48">
//                   <svg className="w-full h-full" viewBox="0 0 800 200">
//                     <defs>
//                       <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
//                         <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
//                         <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
//                       </linearGradient>
//                     </defs>
//                     <path
//                       d="M 0 150 Q 100 120, 200 100 T 400 80 T 600 100 T 800 60"
//                       fill="none"
//                       stroke="#A78BFA"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                     />
//                     <path
//                       d="M 0 150 Q 100 120, 200 100 T 400 80 T 600 100 T 800 60 V 200 H 0 Z"
//                       fill="url(#gradient)"
//                     />
//                     {/* Data Points */}
//                     {[0, 100, 200, 300, 400, 500, 600, 700].map((x, i) => (
//                       <circle
//                         key={i}
//                         cx={x}
//                         cy={[150, 130, 110, 90, 80, 95, 100, 60][i]}
//                         r="6"
//                         fill="#A78BFA"
//                         className="hover:r-8 transition-all"
//                       />
//                     ))}
//                   </svg>
//                   <div className="flex justify-between mt-2 text-xs text-gray-500">
//                     <span>Mon</span>
//                     <span>Tue</span>
//                     <span>Wed</span>
//                     <span>Thu</span>
//                     <span>Fri</span>
//                     <span>Sat</span>
//                     <span>Sun</span>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* My Tasks */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-bold text-gray-800">My Tasks</h3>
//                   <button className="text-purple-500 text-sm font-medium hover:text-purple-600">
//                     View All
//                   </button>
//                 </div>
                
//                 <div className="space-y-3">
//                   {tasks.map((task, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ x: 20, opacity: 0 }}
//                       animate={{ x: 0, opacity: 1 }}
//                       transition={{ delay: 0.6 + index * 0.1 }}
//                       className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer"
//                     >
//                       <div className={`${task.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
//                         <task.icon size={18} />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
//                         <p className="text-xs text-gray-500">{task.time}</p>
//                       </div>
//                       <span className={`text-xs font-medium px-3 py-1 rounded-full ${
//                         task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
//                         task.status === 'To Do' ? 'bg-blue-100 text-blue-700' :
//                         'bg-purple-100 text-purple-700'
//                       }`}>
//                         {task.status}
//                       </span>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             </div>

//             {/* Bottom Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Project Progress */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.7 }}
//                 className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-bold text-gray-800">Project Progress</h3>
//                   <button className="text-purple-500 text-sm font-medium hover:text-purple-600">
//                     View All
//                   </button>
//                 </div>
                
//                 <div className="flex items-center gap-6">
//                   {/* Donut Chart */}
//                   <div className="relative w-32 h-32">
//                     <svg className="w-full h-full transform -rotate-90">
//                       <circle
//                         cx="64"
//                         cy="64"
//                         r="56"
//                         stroke="#E5E7EB"
//                         strokeWidth="12"
//                         fill="none"
//                       />
//                       <circle
//                         cx="64"
//                         cy="64"
//                         r="56"
//                         stroke="#A78BFA"
//                         strokeWidth="12"
//                         fill="none"
//                         strokeDasharray="351.86"
//                         strokeDashoffset="112.6"
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center">
//                         <span className="text-2xl font-bold text-gray-800">68%</span>
//                         <p className="text-xs text-gray-500">Completed</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Stats List */}
//                   <div className="flex-1 space-y-2">
//                     {projectStats.map((stat, index) => (
//                       <div key={index} className="flex items-center gap-2">
//                         <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
//                         <span className="text-sm text-gray-600 flex-1">{stat.label}</span>
//                         <span className="text-sm font-semibold text-gray-800">{stat.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Reminder */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//                 className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="text-4xl">🌵</div>
//                   <div>
//                     <h3 className="font-bold text-gray-800 mb-1">Don't forget!</h3>
//                     <p className="text-sm text-gray-600 mb-3">You have 3 tasks due today.</p>
//                     <button className="bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors shadow-lg shadow-purple-300/50">
//                       View Tasks
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Motivational Message */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.9 }}
//                 className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border border-yellow-100"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="text-5xl">☁️</div>
//                   <div>
//                     <h3 className="font-bold text-gray-800 mb-1">
//                       You're doing great! 💜
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Keep going and achieve more.
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  FolderKanban, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Settings,
  Search,
  Bell,
  Mail,
  TrendingUp,
  Users,
  Award,
  Clock,
  ShoppingCart,
  Package,
  MessageCircle,
  LogOut,
  User,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FaStore, FaChartLine, FaBox, FaComments, FaCog, FaHome } from 'react-icons/fa';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const navItems = [
    { name: 'الرئيسية', icon: FaHome, path: '/dashboard', id: 'overview' },
    { name: 'متجري', icon: FaStore, path: '/my-store', id: 'mystore' },
    { name: 'الإعلانات', icon: Package, path: '/posts', id: 'ads' },
    { name: 'الرسائل', icon: FaComments, path: '/messages', id: 'messages' },
    { name: 'الإحصائيات', icon: FaChartLine, path: '/analytics', id: 'analytics' },
    { name: 'الإعدادات', icon: FaCog, path: '/settings', id: 'settings' },
  ];

  const stats = [
    { 
      title: 'إجمالي الإعلانات', 
      value: '24', 
      change: '+12%', 
      icon: FolderKanban,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    { 
      title: 'المهام المكتملة', 
      value: '86', 
      change: '+18%', 
      icon: Award,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    { 
      title: 'المتابعين', 
      value: '1.2K', 
      change: '+8%', 
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
  ];

  const tasks = [
    { 
      title: 'مراجعة تصميم الواجهة', 
      time: 'اليوم، 10:00 ص', 
      status: 'قيد التنفيذ',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      color: 'from-pink-500 to-rose-500',
      icon: FolderKanban
    },
    { 
      title: 'تطوير الصفحة الرئيسية', 
      time: 'اليوم، 01:00 م', 
      status: 'قيد التنفيذ',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      color: 'from-amber-500 to-orange-500',
      icon: Clock
    },
    { 
      title: 'إصلاح الأخطاء', 
      time: 'غداً، 11:00 ص', 
      status: 'معلق',
      statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      color: 'from-emerald-500 to-teal-500',
      icon: CheckSquare
    },
    { 
      title: 'اجتماع مع العميل', 
      time: 'غداً، 03:00 م', 
      status: 'قادم',
      statusColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      color: 'from-purple-500 to-violet-500',
      icon: Users
    },
  ];

  const projectStats = [
    { label: 'التصميم', value: '68%', color: 'bg-orange-500' },
    { label: 'التطوير', value: '52%', color: 'bg-blue-500' },
    { label: 'الاختبار', value: '40%', color: 'bg-amber-400' },
    { label: 'التسويق', value: '30%', color: 'bg-emerald-500' },
  ];

  const handleNavigation = (path, id) => {
    setActiveTab(id);
    router.push(path);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen mt-60 bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden mt-60" dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          DASHBOARD
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex gap-6">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-72 bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 text-white hidden lg:block border border-neutral-800 shadow-2xl sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto"
          >
            {/* Logo & Profile */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <FaHome className="text-xl" />
              </div>
              <div>
                <span className="font-bold text-xl block">لوحة التحكم</span>
                <span className="text-xs text-neutral-400">مرحباً بك</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path, item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20' 
                      : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`text-lg ${activeTab === item.id ? 'text-white' : 'group-hover:text-orange-500'} transition-colors`} />
                  <span className="font-medium">{item.name}</span>
                  {activeTab === item.id && <ChevronLeft className="mr-auto text-white" size={18} />}
                </button>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="pt-6 border-t border-neutral-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="text-lg" />
                <span className="font-medium">تسجيل الخروج</span>
              </button>
            </div>

            {/* User Profile Card */}
            <div className="mt-6 bg-neutral-800/50 backdrop-blur rounded-2xl p-4 border border-neutral-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">المستخدم</p>
                  <p className="text-xs text-neutral-400 truncate">user@example.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h1 className="text-3xl font-black text-white mb-1">
                  لوحة التحكم
                </h1>
                <p className="text-neutral-400">نتمنى لك يوماً موفقاً! ✨</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="ابحث عن شيء..."
                    className="pr-10 pl-4 py-2.5 bg-neutral-900/60 border border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 w-64 text-white placeholder-neutral-500 backdrop-blur-xl"
                  />
                </div>
                <button className="relative p-2.5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:bg-neutral-800/60 transition-all backdrop-blur-xl group">
                  <Bell size={20} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <button className="p-2.5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:bg-neutral-800/60 transition-all backdrop-blur-xl group">
                  <Mail size={20} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
                </button>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-0.5 cursor-pointer">
                  <div className="w-full h-full rounded-2xl bg-neutral-800 p-0.5">
                    <img 
                      src="https://i.pravatar.cc/150?img=5" 
                      alt="Profile" 
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Welcome Card & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* Welcome Card */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1 bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-500/30">
                    <img 
                      src="https://i.pravatar.cc/150?img=5" 
                      alt="Welcome" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      صباح الخير! 
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      لنجعل اليوم رائعاً! 💜
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`${stat.bgColor} backdrop-blur-xl rounded-3xl p-6 border ${stat.borderColor} hover:border-opacity-40 transition-all group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-neutral-400 text-sm font-medium mb-2">{stat.title}</p>
                      <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon size={22} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                    <TrendingUp size={16} />
                    <span>{stat.change}</span>
                    <span className="text-neutral-500 font-normal text-xs">من الشهر الماضي</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Activity & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Activity Overview */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">نظرة عامة على النشاط</h3>
                  <select className="bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-2 text-sm text-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <option>هذا الأسبوع</option>
                    <option>الأسبوع الماضي</option>
                    <option>هذا الشهر</option>
                  </select>
                </div>
                
                {/* Simple Line Chart Visualization */}
                <div className="relative h-48">
                  <svg className="w-full h-full" viewBox="0 0 800 200">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 150 Q 100 120, 200 100 T 400 80 T 600 100 T 800 60"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 150 Q 100 120, 200 100 T 400 80 T 600 100 T 800 60 V 200 H 0 Z"
                      fill="url(#gradient)"
                    />
                    {[0, 100, 200, 300, 400, 500, 600, 700].map((x, i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy={[150, 130, 110, 90, 80, 95, 100, 60][i]}
                        r="6"
                        fill="#F97316"
                        className="hover:r-8 transition-all"
                      />
                    ))}
                  </svg>
                  <div className="flex justify-between mt-2 text-xs text-neutral-500">
                    <span>الاثنين</span>
                    <span>الثلاثاء</span>
                    <span>الأربعاء</span>
                    <span>الخميس</span>
                    <span>الجمعة</span>
                    <span>السبت</span>
                    <span>الأحد</span>
                  </div>
                </div>
              </motion.div>

              {/* My Tasks */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">مهامي</h3>
                  <button className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors">
                    عرض الكل
                  </button>
                </div>
                
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-800/50 transition-all group cursor-pointer border border-transparent hover:border-neutral-700"
                    >
                      <div className={`bg-gradient-to-br ${task.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                        <task.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{task.title}</h4>
                        <p className="text-xs text-neutral-500">{task.time}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${task.statusColor}`}>
                        {task.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Progress */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">تقدم المشاريع</h3>
                  <button className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors">
                    عرض الكل
                  </button>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#262626"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#F97316"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray="351.86"
                        strokeDashoffset="112.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-black text-white">68%</span>
                        <p className="text-xs text-neutral-500">مكتمل</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats List */}
                  <div className="flex-1 space-y-3">
                    {projectStats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                        <span className="text-sm text-neutral-400 flex-1">{stat.label}</span>
                        <span className="text-sm font-bold text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Reminder */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl"></div>
                  <div>
                    <h3 className="font-bold text-white mb-1">لا تنسَ!</h3>
                    <p className="text-sm text-neutral-400 mb-3">لديك 3 مهام مستحقة اليوم.</p>
                    <button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg shadow-orange-600/20">
                      عرض المهام
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Motivational Message */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">☁️</div>
                  <div>
                    <h3 className="font-bold text-white mb-1">
                      أنت تبلي بلاءً حسناً! 💜
                    </h3>
                    <p className="text-sm text-neutral-400">
                      استمر في التقدم وحقق المزيد.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}