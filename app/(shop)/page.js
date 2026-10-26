// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';

// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import {
//   FaArrowRight,
//   FaSearch,
//   FaUser,
//   FaShoppingBag,
//   FaStar,
//   FaPlay,
//   FaCheckCircle,
//   FaHeart,
//   FaAward,
// } from 'react-icons/fa';
// import Footer from '../components/ReusableComponents/Footer';
// import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
// import ColoredCards from '../components/ReusableComponents/ColoredCards';
// import categories from '../components/Categories/categories';
// import Image from 'next/image';
// import DemoProductCard from '../components/Store/DemoProductCard';
// import demoProducts from '../lib/demoProducts';
// import { useCommerce } from '@/features/cart/commerce-context';

// const OPTIMAL_BATCH_SIZE = 20;

// const safeStringify = (obj) => {
//   if (!obj) return '{}';
//   try {
//     return JSON.stringify({
//       id: obj.id,
//       name: obj.name,
//       slug: obj.slug,
//       categoryName: obj.categoryName,
//     });
//   } catch {
//     return '{}';
//   }
// };

// export default function Home() {
//   const [productsByCategory, setProductsByCategory] = useState({});
//   const router = useRouter();
//   const { cartCount } = useCommerce();

//   const fetchProductsByCategory = useCallback(async () => {
//     try {
//       const batches = [];
//       for (let i = 0; i < categories.length; i += OPTIMAL_BATCH_SIZE) {
//         batches.push(categories.slice(i, i + OPTIMAL_BATCH_SIZE));
//       }

//       for (const batch of batches) {
//         try {
//           const categoryIds = batch.map((c) => c.id).join(',');
//           const response = await fetch(
//             `/api/categories/bulk?categories=${categoryIds}`,
//             {
//               next: { revalidate: 3600 },
//             },
//           );

//           if (!response.ok)
//             throw new Error(`HTTP error! status: ${response.status}`);
//           const { data } = await response.json();
//           setProductsByCategory((prev) => ({ ...prev, ...data }));
//         } catch (error) {
//           console.error('خطأ في جلب دفعة الفئات:', error);
//         }
//       }
//     } catch (error) {
//       console.error('خطأ عام في جلب البيانات:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProductsByCategory();
//   }, [fetchProductsByCategory]);

//   const handleCategoryClick = (category) => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('category', safeStringify(category));
//       }
//       router.push(
//         `/categories/${category.id}?category=${encodeURIComponent(category.name)}`,
//       );
//     } catch (error) {
//       console.error('Navigation error:', error);
//     }
//   };

//   const activeCategories = categories.filter(
//     (category) => productsByCategory[category.id]?.length > 0,
//   );
//   const activeCategoryCount = new Set([
//     ...activeCategories.map((category) => category.name),
//     ...demoProducts.map((product) => product.categoryName),
//   ]).size;
//   const productCount =
//     activeCategories.reduce(
//       (count, category) =>
//         count + (productsByCategory[category.id]?.length || 0),
//       0,
//     ) + demoProducts.length;

//   return (
//     <div
//       className="min-h-screen bg-stone-50 text-stone-900 overflow-x-hidden mt-64"
//       dir="rtl"
//     >
//       {/* ==================== HEADER ==================== */}
//       <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
//         <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
//           <div className="flex items-center gap-16">
//             <Link href="/" className="flex items-center gap-3">
//               <div className="w-12 h-12 border-2 border-stone-900 rounded-full flex items-center justify-center">
//                 <span className="text-xl font-serif font-bold">م</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-serif font-bold tracking-wide">
//                   مَتْجَر
//                 </h1>
//                 <p className="text-xs text-stone-500 tracking-widest">
//                   LUXURY STORE
//                 </p>
//               </div>
//             </Link>
//             <nav className="hidden lg:flex items-center gap-10">
//               {[
//                 { title: 'المنتجات المميزة', href: '#demo-products' },
//                 { title: 'الأقسام', href: '#categories' },
//                 { title: 'المنتجات', href: '#featured-products' },
//               ].map((item) => (
//                 <a
//                   key={item.href}
//                   href={item.href}
//                   className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors relative group"
//                 >
//                   {item.title}
//                   <span className="absolute -bottom-2 right-0 w-0 h-px bg-stone-900 group-hover:w-full transition-all duration-300" />
//                 </a>
//               ))}
//             </nav>
//           </div>

//           <div className="flex items-center gap-6">
//             <Link
//               href="/search"
//               aria-label="البحث"
//               className="text-stone-600 hover:text-stone-900 transition-colors"
//             >
//               <FaSearch className="text-lg" />
//             </Link>
//             <Link
//               href="/profile"
//               aria-label="الملف الشخصي"
//               className="text-stone-600 hover:text-stone-900 transition-colors"
//             >
//               <FaUser className="text-lg" />
//             </Link>
//             <Link
//               href="/cart"
//               aria-label={`سلة التسوق، ${cartCount} منتج`}
//               className="relative text-stone-600 hover:text-stone-900 transition-colors"
//             >
//               <FaShoppingBag className="text-lg" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 w-5 h-5 bg-stone-900 text-stone-50 text-[10px] font-bold flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* ==================== HERO SECTION ==================== */}
//       <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-stone-50/30 to-orange-50/20">
//         {/* عناصر زخرفية خلفية */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {/* دائرة برتقالية كبيرة */}
//           <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-500/10 to-orange-600/5 blur-3xl" />
//           <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-orange-400/8 to-transparent blur-3xl" />

//           {/* شبكة خطوط رفيعة */}
//           <div
//             className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
//             style={{
//               backgroundImage:
//                 'linear-gradient(#9A3412 1px, transparent 1px), linear-gradient(90deg, #9A3412 1px, transparent 1px)',
//               backgroundSize: '60px 60px',
//             }}
//           />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full py-20">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
//             {/* الجانب الأيمن: المحتوى */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1 }}
//               className="lg:col-span-5 space-y-8 relative z-10"
//             >
//               {/* Badge حصري */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="inline-flex items-center gap-3"
//               >
//                 <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-full shadow-lg shadow-orange-600/20">
//                   <span className="relative flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
//                   </span>
//                   مجموعة 2026 الحصرية
//                 </div>
//               </motion.div>

//               {/* العنوان الرئيسي */}
//               <motion.h1
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3, duration: 1 }}
//                 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold leading-[1.05] tracking-tight text-stone-900"
//               >
//                 الأناقة
//                 <br />
//                 <span className="italic font-light relative inline-block">
//                   في
//                   <svg
//                     className="absolute -bottom-2 left-0 w-full"
//                     height="8"
//                     viewBox="0 0 100 8"
//                     preserveAspectRatio="none"
//                   >
//                     <path
//                       d="M0,4 Q25,0 50,4 T100,4"
//                       stroke="#C2410C"
//                       strokeWidth="2"
//                       fill="none"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </span>
//                 <br />
//                 <span className="text-orange-700">أبسط</span> التفاصيل
//               </motion.h1>

//               {/* الوصف */}
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="text-lg text-stone-600 leading-relaxed max-w-md"
//               >
//                 اكتشف مجموعة مختارة بعناية فائقة من المنتجات الفاخرة التي تجمع
//                 بين الجودة الاستثنائية والتصميم الراقي.
//               </motion.p>

//               {/* إحصائيات محسّنة */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="grid grid-cols-3 gap-4 pt-8"
//               >
//                 {[
//                   { value: activeCategoryCount, label: 'قسم متميز', icon: '◆' },
//                   { value: productCount, label: 'منتج فاخر', icon: '✦' },
//                   { value: 'A+', label: 'جودة عالية', icon: '★' },
//                 ].map((stat, idx) => (
//                   <div key={idx} className="relative group">
//                     <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-orange-600/0 group-hover:from-orange-600/5 group-hover:to-orange-600/10 transition-all duration-500 rounded-2xl" />
//                     <div className="relative p-4 border border-stone-200/60 rounded-2xl bg-white/60 backdrop-blur-sm hover:border-orange-600/30 transition-all duration-500">
//                       <div className="text-orange-700 text-xs mb-2 opacity-60">
//                         {stat.icon}
//                       </div>
//                       <div className="text-3xl font-serif font-bold text-stone-900 mb-1">
//                         {stat.value}
//                       </div>
//                       <div className="text-xs text-stone-500 tracking-wide">
//                         {stat.label}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>

//               {/* أزرار CTA */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7 }}
//                 className="flex flex-wrap items-center gap-4 pt-4"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     if (activeCategories[0]) {
//                       handleCategoryClick(activeCategories[0]);
//                     }
//                   }}
//                   className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-orange-700 to-orange-800 text-white font-medium tracking-wide rounded-full shadow-xl shadow-orange-700/30 hover:shadow-2xl hover:shadow-orange-700/40 transition-all duration-300 overflow-hidden"
//                 >
//                   <span className="absolute inset-0 bg-gradient-to-r from-orange-800 to-orange-900 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   <span className="relative">اكتشف المجموعة</span>
//                   <FaArrowRight className="relative transform group-hover:translate-x-1 transition-transform" />
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="group inline-flex items-center gap-3 px-6 py-4 text-stone-700 font-medium tracking-wide hover:text-orange-700 transition-colors"
//                 >
//                   <div className="w-10 h-10 rounded-full border-2 border-stone-300 group-hover:border-orange-700 flex items-center justify-center transition-colors">
//                     <FaPlay className="text-xs ml-0.5" />
//                   </div>
//                   <span>شاهد الفيديو</span>
//                 </motion.button>
//               </motion.div>

//               {/* شارات الثقة */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.9 }}
//                 className="flex items-center gap-6 pt-4 text-xs text-stone-500"
//               >
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>شحن مجاني</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>ضمان الجودة</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>دفع آمن</span>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* الجانب الأيسر: صورة المنتج المميز */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.4, duration: 1 }}
//               className="lg:col-span-7 relative"
//             >
//               {activeCategories[0] &&
//                 productsByCategory[activeCategories[0].id]?.[0] && (
//                   <div className="relative">
//                     {/* إطار زخرفي خارجي */}
//                     <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-orange-600/30 rounded-tr-[80px]" />
//                     <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-orange-600/30 rounded-bl-[80px]" />

//                     {/* البطاقة الرئيسية */}
//                     <div className="relative aspect-[4/5] bg-gradient-to-br from-stone-100 to-stone-50 overflow-hidden rounded-3xl shadow-2xl shadow-stone-900/10">
//                       <Image
//                         src={
//                           productsByCategory[activeCategories[0].id][0]
//                             .image1 || '/placeholder.jpg'
//                         }
//                         alt={activeCategories[0].name}
//                         fill
//                         className="object-cover hover:scale-105 transition-transform duration-700"
//                       />

//                       {/* تراكب متدرج */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
//                       <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent" />

//                       {/* شارة "جديد" */}
//                       <div className="absolute top-6 right-6 z-10">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-orange-600 blur-xl opacity-50" />
//                           <div className="relative bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
//                             <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
//                             <span className="text-xs font-bold tracking-widest uppercase text-stone-800">
//                               جديد
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* زر المفضلة */}
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="absolute top-6 left-6 z-10 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors group"
//                       >
//                         <FaHeart className="text-sm group-hover:scale-110 transition-transform" />
//                       </motion.button>

//                       {/* معلومات المنتج - أسفل */}
//                       <div className="absolute bottom-0 right-0 left-0 p-8">
//                         <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
//                           <div className="flex items-start justify-between mb-4">
//                             <div>
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-700 bg-orange-50 px-2 py-1 rounded">
//                                   {activeCategories[0].name}
//                                 </span>
//                               </div>
//                               <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2 leading-tight">
//                                 {
//                                   productsByCategory[activeCategories[0].id][0]
//                                     .title
//                                 }
//                               </h3>
//                               <div className="flex items-center gap-2">
//                                 <div className="flex items-center gap-0.5">
//                                   {[...Array(5)].map((_, i) => (
//                                     <FaStar
//                                       key={i}
//                                       className="text-orange-600 text-xs"
//                                     />
//                                   ))}
//                                 </div>
//                                 <span className="text-xs text-stone-500">
//                                   (128 تقييم)
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex items-center justify-between pt-4 border-t border-stone-100">
//                             <div>
//                               <div className="text-[10px] text-stone-500 tracking-widest uppercase mb-1">
//                                 يبدأ من
//                               </div>
//                               <div className="flex items-baseline gap-2">
//                                 <span className="text-3xl font-serif font-bold text-stone-900">
//                                   {productsByCategory[
//                                     activeCategories[0].id
//                                   ][0].basePrice?.toLocaleString()}
//                                 </span>
//                                 <span className="text-sm text-stone-500">
//                                   ر.س
//                                 </span>
//                               </div>
//                             </div>
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() =>
//                                 handleCategoryClick(activeCategories[0])
//                               }
//                               className="group relative px-6 py-3 bg-stone-900 text-white font-medium tracking-wide rounded-full hover:bg-orange-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
//                             >
//                               <span>التفاصيل</span>
//                               <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform" />
//                             </motion.button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* بطاقة عائمة جانبية */}
//                     <motion.div
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 1 }}
//                       className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4 w-48 border border-stone-100"
//                     >
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white">
//                           <FaAward className="text-sm" />
//                         </div>
//                         <div>
//                           <div className="text-xs font-bold text-stone-900">
//                             جودة ممتازة
//                           </div>
//                           <div className="text-[10px] text-stone-500">
//                             معتمدة دولياً
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex -space-x-2 space-x-reverse">
//                         {[1, 2, 3, 4].map((i) => (
//                           <div
//                             key={i}
//                             className="w-7 h-7 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 border-2 border-white"
//                           />
//                         ))}
//                         <div className="w-7 h-7 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
//                           +99
//                         </div>
//                       </div>
//                       <div className="text-[10px] text-stone-500 mt-2">
//                         عميل سعيد هذا الشهر
//                       </div>
//                     </motion.div>

//                     {/* مؤشر التمرير */}
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 1.2 }}
//                       className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
//                     >
//                       <span className="text-[10px] tracking-widest uppercase text-stone-400">
//                         استكشف
//                       </span>
//                       <motion.div
//                         animate={{ y: [0, 8, 0] }}
//                         transition={{ duration: 1.5, repeat: Infinity }}
//                         className="w-6 h-10 border-2 border-stone-300 rounded-full flex items-start justify-center p-1.5"
//                       >
//                         <div className="w-1 h-2 bg-orange-600 rounded-full" />
//                       </motion.div>
//                     </motion.div>
//                   </div>
//                 )}
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== DEMO PRODUCTS ==================== */}
//       <section
//         id="demo-products"
//         className="relative px-6 py-20 sm:px-12 bg-stone-100"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 text-center"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-px w-12 bg-stone-400" />
//               <span className="text-sm font-medium text-stone-500 tracking-widest uppercase">
//                 تجربة تفاعلية
//               </span>
//               <div className="h-px w-12 bg-stone-400" />
//             </div>
//             <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight mb-4">
//               منتجات تجريبية
//             </h2>
//             <p className="max-w-2xl mx-auto text-lg text-stone-600 leading-relaxed">
//               بيانات وصور محلية لاختبار الإعجاب والسلة وإتمام الطلب دون تحصيل أي
//               مبالغ
//             </p>
//           </motion.div>
//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {demoProducts.map((product, idx) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.1 }}
//               >
//                 <DemoProductCard product={product} />
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ==================== CATEGORIES GRID ==================== */}
//       <section id="categories" className="relative px-6 sm:px-12 py-20">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 flex items-end justify-between"
//           >
//             <div>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="h-px w-12 bg-stone-400" />
//                 <span className="text-sm font-medium text-stone-500 tracking-widest uppercase">
//                   {activeCategories.length} قسم متاح
//                 </span>
//               </div>
//               <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight">
//                 الأقسام
//               </h2>
//             </div>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {activeCategories.map((category, idx) => (
//               <motion.div
//                 key={category.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.1 }}
//                 onClick={() => handleCategoryClick(category)}
//                 className="group relative cursor-pointer"
//               >
//                 <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
//                   {/* خلفية الصورة */}
//                   <div className="absolute inset-0">
//                     {productsByCategory[category.id]?.[0]?.image1 ? (
//                       <Image
//                         src={productsByCategory[category.id][0].image1}
//                         alt={category.name}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-700"
//                       />
//                     ) : (
//                       <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
//                     )}
//                     <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
//                   </div>

//                   {/* محتوى البطاقة */}
//                   <div className="relative z-10 h-full flex flex-col justify-between p-8">
//                     {/* الأعلى: عدد المنتجات */}
//                     <div className="flex items-start justify-between">
//                       <div className="bg-stone-50 px-4 py-2">
//                         <span className="text-2xl font-serif font-bold">
//                           {productsByCategory[category.id]?.length || 0}
//                         </span>
//                         <span className="text-xs text-stone-600 mr-2">
//                           منتج
//                         </span>
//                       </div>
//                       <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center group-hover:bg-stone-900 transition-colors">
//                         <FaArrowRight className="text-stone-900 group-hover:text-stone-50 transform group-hover:rotate-45 transition-all" />
//                       </div>
//                     </div>

//                     {/* الأسفل: اسم القسم */}
//                     <div>
//                       <h3 className="text-4xl font-serif font-bold text-stone-50 mb-2">
//                         {category.name}
//                       </h3>
//                       <p className="text-sm text-stone-300">
//                         استكشف المجموعة الكاملة
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ==================== FEATURED PRODUCTS ==================== */}
//       <section
//         id="featured-products"
//         className="relative px-6 sm:px-12 py-20 bg-stone-100"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 text-center"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-px w-12 bg-stone-400" />
//               <span className="text-sm font-medium text-stone-500 tracking-widest uppercase">
//                 منتجات مختارة
//               </span>
//               <div className="h-px w-12 bg-stone-400" />
//             </div>
//             <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight">
//               منتجات مميزة
//             </h2>
//           </motion.div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {activeCategories.flatMap((category, catIdx) =>
//               productsByCategory[category.id]?.slice(0, 2).map((item, idx) => (
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{
//                     delay: (catIdx * 2 + idx) * 0.1,
//                     duration: 0.4,
//                   }}
//                 >
//                   <SmallCard item={item} category={category} />
//                 </motion.div>
//               )),
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ==================== FOOTER ==================== */}
//       <div className="relative border-t border-stone-200 mt-20">
//         <Footer />
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import {
//   FaArrowRight,
//   FaSearch,
//   FaUser,
//   FaShoppingBag,
//   FaStar,
//   FaPlay,
//   FaCheckCircle,
//   FaHeart,
//   FaAward,
//   FaLeaf,
//   FaChevronLeft,
//   FaChevronRight,
//   FaShoppingCart,
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import SmallCard from '@/components/ReusableComponents/SmallCard/SmallCard';
// import categories from '@/components/Categories/categories';
// import Image from 'next/image';
// import demoProducts from '@/lib/demoProducts';
// import { useCommerce } from '@/features/cart/commerce-context';

// const safeStringify = (obj) => {
//   if (!obj) return '{}';
//   try {
//     return JSON.stringify({
//       id: obj.id,
//       name: obj.name,
//       slug: obj.slug,
//       categoryName: obj.categoryName,
//     });
//   } catch {
//     return '{}';
//   }
// };

// const badgeStyles = {
//   NEW: 'bg-orange-100 text-orange-700 border-orange-200',
//   TRENDING: 'bg-amber-100 text-amber-700 border-amber-200',
//   'BEST SELLER': 'bg-orange-600 text-white border-orange-600',
//   POPULAR: 'bg-stone-100 text-stone-700 border-stone-200',
// };

// const badgeLabels = ['NEW', 'TRENDING', 'BEST SELLER', 'POPULAR', 'NEW'];

// export default function Home() {
//   const [productsByCategory, setProductsByCategory] = useState({});
//   const [productCounts, setProductCounts] = useState({});
//   const [currentSlide, setCurrentSlide] = useState(2);
//   const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
//   const [favorites, setFavorites] = useState(new Set());
//   const router = useRouter();
//   const { cartCount, addToCart } = useCommerce();

//   const handleAddToCart = (product) => {
//     try {
//       addToCart(product);
//       toast.success('تمت إضافة المنتج إلى السلة');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleBuyNow = (product) => {
//     try {
//       addToCart(product);
//       router.push('/cart');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     let isActive = true;

//     async function loadProductsByCategory() {
//       try {
//         const categoryIds = categories.map((category) => category.id).join(',');
//         const response = await fetch(
//           `/api/categories/bulk?categories=${categoryIds}`,
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const { data, counts } = await response.json();
//         if (isActive) {
//           setProductsByCategory(data);
//           setProductCounts(counts);
//         }
//       } catch (error) {
//         console.error('خطأ في جلب منتجات الصفحة الرئيسية:', error);
//       }
//     }

//     loadProductsByCategory();
//     return () => {
//       isActive = false;
//     };
//   }, []);

//   const handleCategoryClick = (category) => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('category', safeStringify(category));
//       }
//       router.push(
//         `/categories/${category.id}?category=${encodeURIComponent(category.name)}`,
//       );
//     } catch (error) {
//       console.error('Navigation error:', error);
//     }
//   };

//   const toggleFavorite = (id) => {
//     setFavorites((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const activeCategories = categories.filter(
//     (category) => productsByCategory[category.id]?.length > 0,
//   );
//   const activeCategoryCount = new Set([
//     ...activeCategories.map((category) => category.name),
//     ...demoProducts.map((product) => product.categoryName),
//   ]).size;
//   const productCount =
//     activeCategories.reduce(
//       (count, category) => count + (productCounts[category.id] || 0),
//       0,
//     ) + demoProducts.length;

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % demoProducts.length);
//   };
//   const prevSlide = () => {
//     setCurrentSlide(
//       (prev) => (prev - 1 + demoProducts.length) % demoProducts.length,
//     );
//   };

//   const nextCategorySlide = () => {
//     setCurrentCategorySlide((prev) => (prev + 1) % activeCategories.length);
//   };
//   const prevCategorySlide = () => {
//     setCurrentCategorySlide(
//       (prev) => (prev - 1 + activeCategories.length) % activeCategories.length,
//     );
//   };

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-orange-50/40 via-stone-50 to-amber-50/30 text-stone-900 overflow-x-hidden mt-64"
//       dir="rtl"
//     >
//       {/* ==================== HEADER ==================== */}
//       <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-orange-100/50">
//         <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
//           <div className="flex items-center gap-16">
//             <Link href="/" className="flex items-center gap-3">
//               <div className="w-12 h-12 border-2 border-orange-600 rounded-full flex items-center justify-center bg-orange-50">
//                 <FaLeaf className="text-orange-600 text-xl" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-serif font-bold tracking-wide text-stone-900">
//                   مَتْجَر
//                 </h1>
//                 <p className="text-xs text-stone-500 tracking-widest">
//                   LUXURY STORE
//                 </p>
//               </div>
//             </Link>
//             <nav className="hidden lg:flex items-center gap-10">
//               {[
//                 { title: 'المنتجات المميزة', href: '#demo-products' },
//                 { title: 'الأقسام', href: '#categories' },
//                 { title: 'المنتجات', href: '#featured-products' },
//               ].map((item) => (
//                 <a
//                   key={item.href}
//                   href={item.href}
//                   className="text-sm font-medium text-stone-600 hover:text-orange-700 transition-colors relative group"
//                 >
//                   {item.title}
//                   <span className="absolute -bottom-2 right-0 w-0 h-px bg-orange-600 group-hover:w-full transition-all duration-300" />
//                 </a>
//               ))}
//             </nav>
//           </div>

//           <div className="flex items-center gap-6">
//             <Link
//               href="/search"
//               aria-label="البحث"
//               className="text-stone-600 hover:text-orange-700 transition-colors"
//             >
//               <FaSearch className="text-lg" />
//             </Link>
//             <Link
//               href="/profile"
//               aria-label="الملف الشخصي"
//               className="text-stone-600 hover:text-orange-700 transition-colors"
//             >
//               <FaUser className="text-lg" />
//             </Link>
//             <Link
//               href="/cart"
//               aria-label={`سلة التسوق، ${cartCount} منتج`}
//               className="relative text-stone-600 hover:text-orange-700 transition-colors"
//             >
//               <FaShoppingBag className="text-lg" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* ==================== HERO SECTION ==================== */}
//       <section className="relative min-h-screen flex items-center overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-400/10 to-amber-300/5 blur-3xl" />
//           <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-orange-300/8 to-transparent blur-3xl" />
//           <div
//             className="absolute top-0 left-0 w-full h-full opacity-[0.02]"
//             style={{
//               backgroundImage:
//                 'linear-gradient(#C2410C 1px, transparent 1px), linear-gradient(90deg, #C2410C 1px, transparent 1px)',
//               backgroundSize: '60px 60px',
//             }}
//           />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full py-20">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1 }}
//               className="lg:col-span-5 space-y-8 relative z-10"
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="inline-flex items-center gap-3"
//               >
//                 <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-full shadow-lg shadow-orange-600/20">
//                   <span className="relative flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
//                   </span>
//                   مجموعة 2026 الحصرية
//                 </div>
//               </motion.div>

//               <motion.h1
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3, duration: 1 }}
//                 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold leading-[1.05] tracking-tight text-stone-900"
//               >
//                 الأناقة
//                 <br />
//                 <span className="italic font-light relative inline-block">
//                   في
//                   <svg
//                     className="absolute -bottom-2 left-0 w-full"
//                     height="8"
//                     viewBox="0 0 100 8"
//                     preserveAspectRatio="none"
//                   >
//                     <path
//                       d="M0,4 Q25,0 50,4 T100,4"
//                       stroke="#C2410C"
//                       strokeWidth="2"
//                       fill="none"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </span>
//                 <br />
//                 <span className="text-orange-700">أبسط</span> التفاصيل
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="text-lg text-stone-600 leading-relaxed max-w-md"
//               >
//                 اكتشف مجموعة مختارة بعناية فائقة من المنتجات الفاخرة التي تجمع
//                 بين الجودة الاستثنائية والتصميم الراقي.
//               </motion.p>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="grid grid-cols-3 gap-4 pt-8"
//               >
//                 {[
//                   { value: activeCategoryCount, label: 'قسم متميز', icon: '◆' },
//                   { value: productCount, label: 'منتج فاخر', icon: '✦' },
//                   { value: 'A+', label: 'جودة عالية', icon: '★' },
//                 ].map((stat, idx) => (
//                   <div key={idx} className="relative group">
//                     <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-orange-600/0 group-hover:from-orange-600/5 group-hover:to-orange-600/10 transition-all duration-500 rounded-2xl" />
//                     <div className="relative p-4 border border-stone-200/60 rounded-2xl bg-white/60 backdrop-blur-sm hover:border-orange-600/30 transition-all duration-500">
//                       <div className="text-orange-700 text-xs mb-2 opacity-60">
//                         {stat.icon}
//                       </div>
//                       <div className="text-3xl font-serif font-bold text-stone-900 mb-1">
//                         {stat.value}
//                       </div>
//                       <div className="text-xs text-stone-500 tracking-wide">
//                         {stat.label}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7 }}
//                 className="flex flex-wrap items-center gap-4 pt-4"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     if (activeCategories[0]) {
//                       handleCategoryClick(activeCategories[0]);
//                     }
//                   }}
//                   className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-orange-700 to-orange-800 text-white font-medium tracking-wide rounded-full shadow-xl shadow-orange-700/30 hover:shadow-2xl hover:shadow-orange-700/40 transition-all duration-300 overflow-hidden"
//                 >
//                   <span className="absolute inset-0 bg-gradient-to-r from-orange-800 to-orange-900 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   <span className="relative">اكتشف المجموعة</span>
//                   <FaArrowRight className="relative transform group-hover:translate-x-1 transition-transform" />
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="group inline-flex items-center gap-3 px-6 py-4 text-stone-700 font-medium tracking-wide hover:text-orange-700 transition-colors"
//                 >
//                   <div className="w-10 h-10 rounded-full border-2 border-stone-300 group-hover:border-orange-700 flex items-center justify-center transition-colors">
//                     <FaPlay className="text-xs ml-0.5" />
//                   </div>
//                   <span>شاهد الفيديو</span>
//                 </motion.button>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.9 }}
//                 className="flex items-center gap-6 pt-4 text-xs text-stone-500"
//               >
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>شحن مجاني</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>ضمان الجودة</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>دفع آمن</span>
//                 </div>
//               </motion.div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.4, duration: 1 }}
//               className="lg:col-span-7 relative"
//             >
//               {activeCategories[0] &&
//                 productsByCategory[activeCategories[0].id]?.[0] && (
//                   <div className="relative">
//                     <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-orange-600/30 rounded-tr-[80px]" />
//                     <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-orange-600/30 rounded-bl-[80px]" />

//                     <div className="relative aspect-[4/5] bg-gradient-to-br from-stone-100 to-stone-50 overflow-hidden rounded-3xl shadow-2xl shadow-stone-900/10">
//                       <Image
//                         src={
//                           productsByCategory[activeCategories[0].id][0]
//                             .image1 || '/placeholder.jpg'
//                         }
//                         alt={activeCategories[0].name}
//                         fill
//                         className="object-cover hover:scale-105 transition-transform duration-700"
//                       />

//                       <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
//                       <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent" />

//                       <div className="absolute top-6 right-6 z-10">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-orange-600 blur-xl opacity-50" />
//                           <div className="relative bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
//                             <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
//                             <span className="text-xs font-bold tracking-widest uppercase text-stone-800">
//                               جديد
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="absolute top-6 left-6 z-10 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors group"
//                       >
//                         <FaHeart className="text-sm group-hover:scale-110 transition-transform" />
//                       </motion.button>

//                       <div className="absolute bottom-0 right-0 left-0 p-8">
//                         <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
//                           <div className="flex items-start justify-between mb-4">
//                             <div>
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-700 bg-orange-50 px-2 py-1 rounded">
//                                   {activeCategories[0].name}
//                                 </span>
//                               </div>
//                               <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2 leading-tight">
//                                 {
//                                   productsByCategory[activeCategories[0].id][0]
//                                     .title
//                                 }
//                               </h3>
//                               <div className="flex items-center gap-2">
//                                 <div className="flex items-center gap-0.5">
//                                   {[...Array(5)].map((_, i) => (
//                                     <FaStar
//                                       key={i}
//                                       className="text-orange-600 text-xs"
//                                     />
//                                   ))}
//                                 </div>
//                                 <span className="text-xs text-stone-500">
//                                   (128 تقييم)
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex items-center justify-between pt-4 border-t border-stone-100">
//                             <div>
//                               <div className="text-[10px] text-stone-500 tracking-widest uppercase mb-1">
//                                 يبدأ من
//                               </div>
//                               <div className="flex items-baseline gap-2">
//                                 <span className="text-3xl font-serif font-bold text-stone-900">
//                                   {productsByCategory[
//                                     activeCategories[0].id
//                                   ][0].basePrice?.toLocaleString()}
//                                 </span>
//                                 <span className="text-sm text-stone-500">
//                                   ر.س
//                                 </span>
//                               </div>
//                             </div>
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() =>
//                                 handleCategoryClick(activeCategories[0])
//                               }
//                               className="group relative px-6 py-3 bg-stone-900 text-white font-medium tracking-wide rounded-full hover:bg-orange-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
//                             >
//                               <span>التفاصيل</span>
//                               <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform" />
//                             </motion.button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <motion.div
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 1 }}
//                       className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4 w-48 border border-stone-100"
//                     >
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white">
//                           <FaAward className="text-sm" />
//                         </div>
//                         <div>
//                           <div className="text-xs font-bold text-stone-900">
//                             جودة ممتازة
//                           </div>
//                           <div className="text-[10px] text-stone-500">
//                             معتمدة دولياً
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex -space-x-2 space-x-reverse">
//                         {[1, 2, 3, 4].map((i) => (
//                           <div
//                             key={i}
//                             className="w-7 h-7 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 border-2 border-white"
//                           />
//                         ))}
//                         <div className="w-7 h-7 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
//                           +99
//                         </div>
//                       </div>
//                       <div className="text-[10px] text-stone-500 mt-2">
//                         عميل سعيد هذا الشهر
//                       </div>
//                     </motion.div>
//                   </div>
//                 )}
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== DEMO PRODUCTS CAROUSEL ==================== */}
//       <section id="demo-products" className="relative px-6 py-24 sm:px-12">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 text-center"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-px w-12 bg-orange-400/50" />
//               <span className="text-sm font-medium text-stone-500 tracking-[0.3em] uppercase">
//                 OUR COLLECTION
//               </span>
//               <div className="h-px w-12 bg-orange-400/50" />
//             </div>
//             <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight mb-4 text-stone-900">
//               Featured Products
//             </h2>
//             <p className="max-w-2xl mx-auto text-lg text-stone-600 leading-relaxed">
//               Explore our most popular items loved by customers
//             </p>
//           </motion.div>

//           <div className="relative">
//             <button
//               onClick={prevSlide}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 group -mr-6"
//               aria-label="السابق"
//             >
//               <FaChevronRight className="text-stone-700 group-hover:text-white transition-colors" />
//             </button>
//             <button
//               onClick={nextSlide}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 group -ml-6"
//               aria-label="التالي"
//             >
//               <FaChevronLeft className="text-stone-700 group-hover:text-white transition-colors" />
//             </button>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
//               {demoProducts.map((product, idx) => {
//                 const isCenter = idx === currentSlide;
//                 const badge = badgeLabels[idx % badgeLabels.length];
//                 const isFavorite = favorites.has(product.id);

//                 return (
//                   <motion.div
//                     key={product.id}
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: idx * 0.1 }}
//                     className={`relative transition-all duration-500 ${
//                       isCenter
//                         ? 'lg:scale-110 lg:-translate-y-4 z-10'
//                         : 'lg:scale-95 opacity-90'
//                     }`}
//                   >
//                     <div
//                       className={`relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border transition-all duration-500 ${
//                         isCenter
//                           ? 'border-orange-200 shadow-2xl shadow-orange-600/15'
//                           : 'border-stone-200/60 shadow-lg shadow-stone-900/5'
//                       }`}
//                     >
//                       <div className="absolute top-4 right-4 z-10">
//                         <span
//                           className={`inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${
//                             badgeStyles[badge] || badgeStyles.NEW
//                           }`}
//                         >
//                           {badge}
//                         </span>
//                       </div>

//                       <button
//                         onClick={() => toggleFavorite(product.id)}
//                         className="absolute top-4 left-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full border border-stone-200/60 flex items-center justify-center hover:border-orange-400 transition-all group"
//                         aria-label="المفضلة"
//                       >
//                         <FaHeart
//                           className={`text-sm transition-all ${
//                             isFavorite
//                               ? 'text-orange-600 scale-110'
//                               : 'text-stone-400 group-hover:text-orange-600'
//                           }`}
//                         />
//                       </button>

//                       <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-orange-50/30 p-6 flex items-center justify-center">
//                         <Image
//                           src={product.image || '/placeholder.jpg'}
//                           alt={product.title}
//                           width={200}
//                           height={200}
//                           className="object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500"
//                         />

//                         <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//                           {[0, 1, 2].map((dot) => (
//                             <div
//                               key={dot}
//                               className={`h-1.5 rounded-full transition-all ${
//                                 dot === 0
//                                   ? 'bg-orange-600 w-4'
//                                   : 'bg-stone-300 w-1.5'
//                               }`}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       <div className="p-5">
//                         <h3 className="text-lg font-serif font-bold text-stone-900 mb-1.5">
//                           {product.title}
//                         </h3>
//                         <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2">
//                           {product.description ||
//                             'منتج عالي الجودة بتصميم أنيق'}
//                         </p>

//                         <div className="flex items-center gap-1.5 mb-4">
//                           <div className="flex items-center gap-0.5">
//                             {[...Array(5)].map((_, i) => (
//                               <FaStar
//                                 key={i}
//                                 className={`text-xs ${
//                                   i < Math.floor(product.rating || 4.5)
//                                     ? 'text-orange-500'
//                                     : 'text-stone-200'
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                           <span className="text-xs text-stone-600 font-medium">
//                             {product.rating || 4.5}
//                           </span>
//                           <span className="text-xs text-stone-400">
//                             ({product.reviewCount || 89})
//                           </span>
//                         </div>

//                         <div className="flex items-center justify-between pt-3 border-t border-stone-100">
//                           <div className="flex items-baseline gap-1">
//                             <span className="text-xl font-serif font-bold text-stone-900">
//                               ${product.price?.toFixed(2) || '99.99'}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="mt-3 grid grid-cols-2 gap-2">
//                           <motion.button
//                             type="button"
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={() => handleAddToCart(product)}
//                             className="flex items-center justify-center gap-1 rounded-full border border-orange-600 px-2 py-2.5 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-600 hover:text-white"
//                             aria-label={`Add to Cart: ${product.title}`}
//                           >
//                             <FaShoppingCart aria-hidden="true" />
//                             <span>Add to Cart</span>
//                           </motion.button>
//                           <motion.button
//                             type="button"
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={() => handleBuyNow(product)}
//                             className="rounded-full bg-stone-900 px-2 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-700"
//                           >
//                             Buy Now
//                           </motion.button>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             <div className="flex items-center justify-center gap-2 mt-10">
//               {demoProducts.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setCurrentSlide(idx)}
//                   className={`transition-all duration-300 rounded-full ${
//                     idx === currentSlide
//                       ? 'w-8 h-2 bg-orange-600'
//                       : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
//                   }`}
//                   aria-label={`المنتج ${idx + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== CATEGORIES CAROUSEL ==================== */}
//       <section id="categories" className="relative px-6 sm:px-12 py-20">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 flex items-end justify-between"
//           >
//             <div>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="h-px w-12 bg-orange-400/50" />
//                 <span className="text-sm font-medium text-stone-500 tracking-[0.3em] uppercase">
//                   {activeCategories.length} قسم متاح
//                 </span>
//               </div>
//               <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-stone-900">
//                 الأقسام
//               </h2>
//             </div>
//           </motion.div>

//           <div className="relative">
//             <button
//               onClick={prevCategorySlide}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all group -mr-6"
//               aria-label="السابق"
//             >
//               <FaChevronRight className="text-stone-700 group-hover:text-white" />
//             </button>
//             <button
//               onClick={nextCategorySlide}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all group -ml-6"
//               aria-label="التالي"
//             >
//               <FaChevronLeft className="text-stone-700 group-hover:text-white" />
//             </button>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {activeCategories.map((category, idx) => {
//                 const isActive = idx === currentCategorySlide;
//                 const badge = badgeLabels[idx % badgeLabels.length];

//                 return (
//                   <motion.div
//                     key={category.id}
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: idx * 0.1 }}
//                     onClick={() => handleCategoryClick(category)}
//                     className={`group relative cursor-pointer transition-all duration-500 ${
//                       isActive ? 'lg:scale-105 lg:-translate-y-2 z-10' : ''
//                     }`}
//                   >
//                     <div
//                       className={`relative aspect-[3/4] bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border transition-all duration-500 ${
//                         isActive
//                           ? 'border-orange-300 shadow-2xl shadow-orange-600/15'
//                           : 'border-stone-200/60 shadow-lg'
//                       }`}
//                     >
//                       <div className="absolute inset-0">
//                         {productsByCategory[category.id]?.[0]?.image1 ? (
//                           <Image
//                             src={productsByCategory[category.id][0].image1}
//                             alt={category.name}
//                             fill
//                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                             className="object-cover group-hover:scale-105 transition-transform duration-700"
//                           />
//                         ) : (
//                           <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-stone-100" />
//                         )}
//                         <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
//                       </div>

//                       <div className="absolute top-5 right-5 z-10">
//                         <span
//                           className={`inline-block px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-full border backdrop-blur-md ${
//                             badgeStyles[badge] || badgeStyles.NEW
//                           }`}
//                         >
//                           {badge}
//                         </span>
//                       </div>

//                       <div className="absolute top-5 left-5 z-10">
//                         <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center group-hover:border-orange-400 transition-all">
//                           <FaHeart className="text-sm text-stone-600 group-hover:text-orange-600 transition-colors" />
//                         </div>
//                       </div>

//                       <div className="relative z-10 h-full flex flex-col justify-between p-7">
//                         <div className="flex items-start justify-between">
//                           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/50">
//                             <span className="text-2xl font-serif font-bold text-stone-900">
//                               {productCounts[category.id] || 0}
//                             </span>
//                             <span className="text-xs text-stone-600 mr-2">
//                               منتج
//                             </span>
//                           </div>
//                           <div className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
//                             <FaArrowRight className="text-stone-900 group-hover:text-white transform group-hover:rotate-45 transition-all" />
//                           </div>
//                         </div>

//                         <div>
//                           <div className="flex gap-1.5 mb-4">
//                             {[0, 1, 2].map((dot) => (
//                               <div
//                                 key={dot}
//                                 className={`h-1.5 rounded-full transition-all ${
//                                   dot === 0
//                                     ? 'w-6 bg-orange-500'
//                                     : 'w-1.5 bg-white/50'
//                                 }`}
//                               />
//                             ))}
//                           </div>

//                           <h3 className="text-3xl font-serif font-bold text-white mb-2">
//                             {category.name}
//                           </h3>
//                           <p className="text-sm text-white/70 mb-4">
//                             استكشف المجموعة الكاملة
//                           </p>

//                           <div className="flex items-center justify-between pt-4 border-t border-white/20">
//                             <div className="flex items-center gap-1">
//                               {[...Array(5)].map((_, i) => (
//                                 <FaStar
//                                   key={i}
//                                   className="text-orange-400 text-xs"
//                                 />
//                               ))}
//                               <span className="text-xs text-white/80 mr-1">
//                                 (4.8)
//                               </span>
//                             </div>
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               className="px-4 py-2 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold rounded-full hover:bg-orange-600 hover:text-white transition-all"
//                             >
//                               عرض القسم
//                             </motion.button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {activeCategories.length > 0 && (
//               <div className="flex items-center justify-center gap-2 mt-10">
//                 {activeCategories.map((_, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentCategorySlide(idx)}
//                     className={`transition-all duration-300 rounded-full ${
//                       idx === currentCategorySlide
//                         ? 'w-8 h-2 bg-orange-600'
//                         : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
//                     }`}
//                     aria-label={`القسم ${idx + 1}`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ==================== FEATURED PRODUCTS ==================== */}
//       <section
//         id="featured-products"
//         className="relative px-6 sm:px-12 py-20 bg-white/50 backdrop-blur-sm"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 text-center"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-px w-12 bg-orange-400/50" />
//               <span className="text-sm font-medium text-stone-500 tracking-[0.3em] uppercase">
//                 منتجات مختارة
//               </span>
//               <div className="h-px w-12 bg-orange-400/50" />
//             </div>
//             <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-stone-900">
//               منتجات مميزة
//             </h2>
//           </motion.div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {activeCategories.flatMap((category, catIdx) =>
//               productsByCategory[category.id]?.slice(0, 2).map((item, idx) => (
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{
//                     delay: (catIdx * 2 + idx) * 0.1,
//                     duration: 0.4,
//                   }}
//                 >
//                   <SmallCard item={item} category={category} />
//                 </motion.div>
//               )),
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import {
//   FaArrowRight,
//   FaSearch,
//   FaUser,
//   FaShoppingBag,
//   FaStar,
//   FaPlay,
//   FaCheckCircle,
//   FaHeart,
//   FaAward,
//   FaLeaf,
//   FaChevronLeft,
//   FaChevronRight,
//   FaShoppingCart,
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import SmallCard from '@/components/ReusableComponents/SmallCard/SmallCard';
// import categories from '@/components/Categories/categories';
// import Image from 'next/image';
// import demoProducts from '@/lib/demoProducts';
// import { useCommerce } from '@/features/cart/commerce-context';

// const safeStringify = (obj) => {
//   if (!obj) return '{}';
//   try {
//     return JSON.stringify({
//       id: obj.id,
//       name: obj.name,
//       slug: obj.slug,
//       categoryName: obj.categoryName,
//     });
//   } catch {
//     return '{}';
//   }
// };

// // ✅ توحيد البادجات بالعربية
// const badgeStyles = {
//   جديد: 'bg-orange-100 text-orange-700 border-orange-200',
//   رائج: 'bg-amber-100 text-amber-700 border-amber-200',
//   'الأكثر مبيعاً': 'bg-orange-600 text-white border-orange-600',
//   مميز: 'bg-stone-100 text-stone-700 border-stone-200',
// };

// const badgeLabels = ['جديد', 'رائج', 'الأكثر مبيعاً', 'مميز', 'جديد'];

// export default function Home() {
//   const [productsByCategory, setProductsByCategory] = useState({});
//   const [productCounts, setProductCounts] = useState({});
//   const [currentSlide, setCurrentSlide] = useState(2);
//   const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
//   const [favorites, setFavorites] = useState(new Set());
//   const router = useRouter();
//   const { cartCount, addToCart } = useCommerce();

//   const handleAddToCart = (product) => {
//     try {
//       addToCart(product);
//       toast.success('تمت إضافة المنتج إلى السلة');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleBuyNow = (product) => {
//     try {
//       addToCart(product);
//       router.push('/cart');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     let isActive = true;

//     async function loadProductsByCategory() {
//       try {
//         const categoryIds = categories.map((category) => category.id).join(',');
//         const response = await fetch(
//           `/api/categories/bulk?categories=${categoryIds}`,
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const { data, counts } = await response.json();
//         if (isActive) {
//           setProductsByCategory(data);
//           setProductCounts(counts);
//         }
//       } catch (error) {
//         console.error('خطأ في جلب منتجات الصفحة الرئيسية:', error);
//       }
//     }

//     loadProductsByCategory();
//     return () => {
//       isActive = false;
//     };
//   }, []);

//   const handleCategoryClick = (category) => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('category', safeStringify(category));
//       }
//       router.push(
//         `/categories/${category.id}?category=${encodeURIComponent(category.name)}`,
//       );
//     } catch (error) {
//       console.error('Navigation error:', error);
//     }
//   };

//   const toggleFavorite = (id) => {
//     setFavorites((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const activeCategories = categories.filter(
//     (category) => productsByCategory[category.id]?.length > 0,
//   );
//   const activeCategoryCount = new Set([
//     ...activeCategories.map((category) => category.name),
//     ...demoProducts.map((product) => product.categoryName),
//   ]).size;
//   const productCount =
//     activeCategories.reduce(
//       (count, category) => count + (productCounts[category.id] || 0),
//       0,
//     ) + demoProducts.length;

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % demoProducts.length);
//   };
//   const prevSlide = () => {
//     setCurrentSlide(
//       (prev) => (prev - 1 + demoProducts.length) % demoProducts.length,
//     );
//   };

//   const nextCategorySlide = () => {
//     setCurrentCategorySlide((prev) => (prev + 1) % activeCategories.length);
//   };
//   const prevCategorySlide = () => {
//     setCurrentCategorySlide(
//       (prev) => (prev - 1 + activeCategories.length) % activeCategories.length,
//     );
//   };

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-orange-50/40 via-stone-50 to-amber-50/30 text-stone-900 overflow-x-hidden mt-64"
//       dir="rtl"
//     >
//       {/* ==================== HERO SECTION ==================== */}
//       <section className="relative min-h-screen flex items-center overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-400/10 to-amber-300/5 blur-3xl" />
//           <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-orange-300/8 to-transparent blur-3xl" />
//           <div
//             className="absolute top-0 left-0 w-full h-full opacity-[0.02]"
//             style={{
//               backgroundImage:
//                 'linear-gradient(#C2410C 1px, transparent 1px), linear-gradient(90deg, #C2410C 1px, transparent 1px)',
//               backgroundSize: '60px 60px',
//             }}
//           />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full py-20">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1 }}
//               className="lg:col-span-5 space-y-8 relative z-10"
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="inline-flex items-center gap-3"
//               >
//                 <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-full shadow-lg shadow-orange-600/20">
//                   <span className="relative flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
//                   </span>
//                   مجموعة ٢٠٢٦ الحصرية
//                 </div>
//               </motion.div>

//               <motion.h1
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3, duration: 1 }}
//                 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold leading-[1.05] tracking-tight text-stone-900"
//               >
//                 الأناقة
//                 <br />
//                 <span className="italic font-light relative inline-block">
//                   في
//                   <svg
//                     className="absolute -bottom-2 left-0 w-full"
//                     height="8"
//                     viewBox="0 0 100 8"
//                     preserveAspectRatio="none"
//                   >
//                     <path
//                       d="M0,4 Q25,0 50,4 T100,4"
//                       stroke="#C2410C"
//                       strokeWidth="2"
//                       fill="none"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </span>
//                 <br />
//                 <span className="text-orange-700">أبسط</span> التفاصيل
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="text-lg text-stone-600 leading-relaxed max-w-md"
//               >
//                 اكتشف مجموعة مختارة بعناية فائقة من المنتجات الفاخرة التي تجمع
//                 بين الجودة الاستثنائية والتصميم الراقي.
//               </motion.p>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="grid grid-cols-3 gap-4 pt-8"
//               >
//                 {[
//                   { value: activeCategoryCount, label: 'قسم متميز', icon: '◆' },
//                   { value: productCount, label: 'منتج فاخر', icon: '✦' },
//                   { value: 'A+', label: 'جودة عالية', icon: '★' },
//                 ].map((stat, idx) => (
//                   <div key={idx} className="relative group">
//                     <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-orange-600/0 group-hover:from-orange-600/5 group-hover:to-orange-600/10 transition-all duration-500 rounded-2xl" />
//                     <div className="relative p-4 border border-stone-200/60 rounded-2xl bg-white/60 backdrop-blur-sm hover:border-orange-600/30 transition-all duration-500">
//                       <div className="text-orange-700 text-xs mb-2 opacity-60">
//                         {stat.icon}
//                       </div>
//                       <div className="text-3xl font-serif font-bold text-stone-900 mb-1">
//                         {stat.value}
//                       </div>
//                       <div className="text-xs text-stone-500 tracking-wide">
//                         {stat.label}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7 }}
//                 className="flex flex-wrap items-center gap-4 pt-4"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     if (activeCategories[0]) {
//                       handleCategoryClick(activeCategories[0]);
//                     }
//                   }}
//                   className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-orange-700 to-orange-800 text-white font-medium tracking-wide rounded-full shadow-xl shadow-orange-700/30 hover:shadow-2xl hover:shadow-orange-700/40 transition-all duration-300 overflow-hidden"
//                 >
//                   <span className="absolute inset-0 bg-gradient-to-r from-orange-800 to-orange-900 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   <span className="relative">اكتشف المجموعة</span>
//                   <FaArrowRight className="relative transform rotate-180 group-hover:-translate-x-1 transition-transform" />
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="group inline-flex items-center gap-3 px-6 py-4 text-stone-700 font-medium tracking-wide hover:text-orange-700 transition-colors"
//                 >
//                   <div className="w-10 h-10 rounded-full border-2 border-stone-300 group-hover:border-orange-700 flex items-center justify-center transition-colors">
//                     <FaPlay className="text-xs mr-0.5" />
//                   </div>
//                   <span>شاهد الفيديو</span>
//                 </motion.button>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.9 }}
//                 className="flex items-center gap-6 pt-4 text-xs text-stone-500"
//               >
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>شحن مجاني</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>ضمان الجودة</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-orange-700" />
//                   <span>دفع آمن</span>
//                 </div>
//               </motion.div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.4, duration: 1 }}
//               className="lg:col-span-7 relative"
//             >
//               {activeCategories[0] &&
//                 productsByCategory[activeCategories[0].id]?.[0] && (
//                   <div className="relative">
//                     <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-orange-600/30 rounded-tr-[80px]" />
//                     <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-orange-600/30 rounded-bl-[80px]" />

//                     <div className="relative aspect-[4/5] bg-gradient-to-br from-stone-100 to-stone-50 overflow-hidden rounded-3xl shadow-2xl shadow-stone-900/10">
//                       <Image
//                         src={
//                           productsByCategory[activeCategories[0].id][0]
//                             .image1 || '/placeholder.jpg'
//                         }
//                         alt={activeCategories[0].name}
//                         fill
//                         className="object-cover hover:scale-105 transition-transform duration-700"
//                       />

//                       <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
//                       <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent" />

//                       <div className="absolute top-6 right-6 z-10">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-orange-600 blur-xl opacity-50" />
//                           <div className="relative bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
//                             <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
//                             <span className="text-xs font-bold tracking-widest text-stone-800">
//                               جديد
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="absolute top-6 left-6 z-10 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors group"
//                       >
//                         <FaHeart className="text-sm group-hover:scale-110 transition-transform" />
//                       </motion.button>

//                       <div className="absolute bottom-0 right-0 left-0 p-8">
//                         <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
//                           <div className="flex items-start justify-between mb-4">
//                             <div>
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className="text-[10px] font-bold tracking-[0.2em] text-orange-700 bg-orange-50 px-2 py-1 rounded">
//                                   {activeCategories[0].name}
//                                 </span>
//                               </div>
//                               <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2 leading-tight">
//                                 {
//                                   productsByCategory[activeCategories[0].id][0]
//                                     .title
//                                 }
//                               </h3>
//                               <div className="flex items-center gap-2">
//                                 <div className="flex items-center gap-0.5">
//                                   {[...Array(5)].map((_, i) => (
//                                     <FaStar
//                                       key={i}
//                                       className="text-orange-600 text-xs"
//                                     />
//                                   ))}
//                                 </div>
//                                 <span className="text-xs text-stone-500">
//                                   (١٢٨ تقييم)
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex items-center justify-between pt-4 border-t border-stone-100">
//                             <div>
//                               <div className="text-[10px] text-stone-500 tracking-widest mb-1">
//                                 يبدأ من
//                               </div>
//                               <div className="flex items-baseline gap-2">
//                                 <span className="text-3xl font-serif font-bold text-stone-900">
//                                   {productsByCategory[
//                                     activeCategories[0].id
//                                   ][0].basePrice?.toLocaleString()}
//                                 </span>
//                                 <span className="text-sm text-stone-500">
//                                   ر.س
//                                 </span>
//                               </div>
//                             </div>
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() =>
//                                 handleCategoryClick(activeCategories[0])
//                               }
//                               className="group relative px-6 py-3 bg-stone-900 text-white font-medium tracking-wide rounded-full hover:bg-orange-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
//                             >
//                               <span>التفاصيل</span>
//                               <FaArrowRight className="text-xs transform rotate-180 group-hover:translate-x-1 transition-transform" />
//                             </motion.button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <motion.div
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 1 }}
//                       className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4 w-48 border border-stone-100"
//                     >
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white">
//                           <FaAward className="text-sm" />
//                         </div>
//                         <div>
//                           <div className="text-xs font-bold text-stone-900">
//                             جودة ممتازة
//                           </div>
//                           <div className="text-[10px] text-stone-500">
//                             معتمدة دولياً
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex -space-x-2 space-x-reverse">
//                         {[1, 2, 3, 4].map((i) => (
//                           <div
//                             key={i}
//                             className="w-7 h-7 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 border-2 border-white"
//                           />
//                         ))}
//                         <div className="w-7 h-7 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
//                           +٩٩
//                         </div>
//                       </div>
//                       <div className="text-[10px] text-stone-500 mt-2">
//                         عميل سعيد هذا الشهر
//                       </div>
//                     </motion.div>
//                   </div>
//                 )}
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== DEMO PRODUCTS CAROUSEL ==================== */}
//       <section id="demo-products" className="relative px-6 py-24 sm:px-12">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 text-center"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-px w-12 bg-orange-400/50" />
//               <span className="text-sm font-medium text-stone-500 tracking-[0.3em]">
//                 مجموعتنا المميزة
//               </span>
//               <div className="h-px w-12 bg-orange-400/50" />
//             </div>
//             {/* ✅ توحيد العنوان بالعربية */}
//             <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight mb-4 text-stone-900">
//               منتجات مختارة
//             </h2>
//             <p className="max-w-2xl mx-auto text-lg text-stone-600 leading-relaxed">
//               استكشف أكثر منتجاتنا شعبية والتي يحبها عملاؤنا
//             </p>
//           </motion.div>

//           <div className="relative">
//             <button
//               onClick={prevSlide}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 group -mr-6"
//               aria-label="السابق"
//             >
//               <FaChevronRight className="text-stone-700 group-hover:text-white transition-colors" />
//             </button>
//             <button
//               onClick={nextSlide}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 group -ml-6"
//               aria-label="التالي"
//             >
//               <FaChevronLeft className="text-stone-700 group-hover:text-white transition-colors" />
//             </button>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
//               {demoProducts.map((product, idx) => {
//                 const isCenter = idx === currentSlide;
//                 const badge = badgeLabels[idx % badgeLabels.length];
//                 const isFavorite = favorites.has(product.id);

//                 return (
//                   <motion.div
//                     key={product.id}
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: idx * 0.1 }}
//                     className={`relative transition-all duration-500 ${
//                       isCenter
//                         ? 'lg:scale-110 lg:-translate-y-4 z-10'
//                         : 'lg:scale-95 opacity-90'
//                     }`}
//                   >
//                     <div
//                       className={`relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border transition-all duration-500 ${
//                         isCenter
//                           ? 'border-orange-200 shadow-2xl shadow-orange-600/15'
//                           : 'border-stone-200/60 shadow-lg shadow-stone-900/5'
//                       }`}
//                     >
//                       <div className="absolute top-4 right-4 z-10">
//                         <span
//                           className={`inline-block px-3 py-1 text-[10px] font-bold tracking-wider rounded-full border ${
//                             badgeStyles[badge] || badgeStyles['جديد']
//                           }`}
//                         >
//                           {badge}
//                         </span>
//                       </div>

//                       <button
//                         onClick={() => toggleFavorite(product.id)}
//                         className="absolute top-4 left-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full border border-stone-200/60 flex items-center justify-center hover:border-orange-400 transition-all group"
//                         aria-label="المفضلة"
//                       >
//                         <FaHeart
//                           className={`text-sm transition-all ${
//                             isFavorite
//                               ? 'text-orange-600 scale-110'
//                               : 'text-stone-400 group-hover:text-orange-600'
//                           }`}
//                         />
//                       </button>

//                       <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-orange-50/30 p-6 flex items-center justify-center">
//                         <Image
//                           src={product.image || '/placeholder.jpg'}
//                           alt={product.title}
//                           width={200}
//                           height={200}
//                           className="object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500"
//                         />

//                         <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//                           {[0, 1, 2].map((dot) => (
//                             <div
//                               key={dot}
//                               className={`h-1.5 rounded-full transition-all ${
//                                 dot === 0
//                                   ? 'bg-orange-600 w-4'
//                                   : 'bg-stone-300 w-1.5'
//                               }`}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       <div className="p-5">
//                         <h3 className="text-lg font-serif font-bold text-stone-900 mb-1.5">
//                           {product.title}
//                         </h3>
//                         <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2">
//                           {product.description ||
//                             'منتج عالي الجودة بتصميم أنيق'}
//                         </p>

//                         <div className="flex items-center gap-1.5 mb-4">
//                           <div className="flex items-center gap-0.5">
//                             {[...Array(5)].map((_, i) => (
//                               <FaStar
//                                 key={i}
//                                 className={`text-xs ${
//                                   i < Math.floor(product.rating || 4.5)
//                                     ? 'text-orange-500'
//                                     : 'text-stone-200'
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                           <span className="text-xs text-stone-600 font-medium">
//                             {product.rating || 4.5}
//                           </span>
//                           <span className="text-xs text-stone-400">
//                             ({product.reviewCount || 89} تقييم)
//                           </span>
//                         </div>

//                         {/* ✅ توحيد العملة بالريال السعودي */}
//                         <div className="flex items-center justify-between pt-3 border-t border-stone-100">
//                           <div className="flex items-baseline gap-1">
//                             <span className="text-xl font-serif font-bold text-stone-900">
//                               {product.price?.toFixed(2) || '99.99'}
//                             </span>
//                             <span className="text-xs text-stone-500">ر.س</span>
//                           </div>
//                         </div>

//                         {/* ✅ توحيد أزرار الشراء بالعربية */}
//                         <div className="mt-3 grid grid-cols-2 gap-2">
//                           <motion.button
//                             type="button"
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={() => handleAddToCart(product)}
//                             className="flex items-center justify-center gap-1 rounded-full border border-orange-600 px-2 py-2.5 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-600 hover:text-white"
//                             aria-label={`أضف إلى السلة: ${product.title}`}
//                           >
//                             <FaShoppingCart aria-hidden="true" />
//                             <span>أضف للسلة</span>
//                           </motion.button>
//                           <motion.button
//                             type="button"
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={() => handleBuyNow(product)}
//                             className="rounded-full bg-stone-900 px-2 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-700"
//                           >
//                             اشترِ الآن
//                           </motion.button>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             <div className="flex items-center justify-center gap-2 mt-10">
//               {demoProducts.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setCurrentSlide(idx)}
//                   className={`transition-all duration-300 rounded-full ${
//                     idx === currentSlide
//                       ? 'w-8 h-2 bg-orange-600'
//                       : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
//                   }`}
//                   aria-label={`المنتج ${idx + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== CATEGORIES CAROUSEL ==================== */}
//       <section id="categories" className="relative px-6 sm:px-12 py-20">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 flex items-end justify-between"
//           >
//             <div>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="h-px w-12 bg-orange-400/50" />
//                 <span className="text-sm font-medium text-stone-500 tracking-[0.3em]">
//                   {activeCategories.length} قسم متاح
//                 </span>
//               </div>
//               <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-stone-900">
//                 تصفح الأقسام
//               </h2>
//             </div>
//           </motion.div>

//           <div className="relative">
//             <button
//               onClick={prevCategorySlide}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all group -mr-6"
//               aria-label="السابق"
//             >
//               <FaChevronRight className="text-stone-700 group-hover:text-white" />
//             </button>
//             <button
//               onClick={nextCategorySlide}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all group -ml-6"
//               aria-label="التالي"
//             >
//               <FaChevronLeft className="text-stone-700 group-hover:text-white" />
//             </button>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {activeCategories.map((category, idx) => {
//                 const isActive = idx === currentCategorySlide;
//                 const badge = badgeLabels[idx % badgeLabels.length];

//                 return (
//                   <motion.div
//                     key={category.id}
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: idx * 0.1 }}
//                     onClick={() => handleCategoryClick(category)}
//                     className={`group relative cursor-pointer transition-all duration-500 ${
//                       isActive ? 'lg:scale-105 lg:-translate-y-2 z-10' : ''
//                     }`}
//                   >
//                     <div
//                       className={`relative aspect-[3/4] bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border transition-all duration-500 ${
//                         isActive
//                           ? 'border-orange-300 shadow-2xl shadow-orange-600/15'
//                           : 'border-stone-200/60 shadow-lg'
//                       }`}
//                     >
//                       <div className="absolute inset-0">
//                         {productsByCategory[category.id]?.[0]?.image1 ? (
//                           <Image
//                             src={productsByCategory[category.id][0].image1}
//                             alt={category.name}
//                             fill
//                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                             className="object-cover group-hover:scale-105 transition-transform duration-700"
//                           />
//                         ) : (
//                           <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-stone-100" />
//                         )}
//                         <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
//                       </div>

//                       <div className="absolute top-5 right-5 z-10">
//                         <span
//                           className={`inline-block px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-full border backdrop-blur-md ${
//                             badgeStyles[badge] || badgeStyles['جديد']
//                           }`}
//                         >
//                           {badge}
//                         </span>
//                       </div>

//                       <div className="absolute top-5 left-5 z-10">
//                         <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center group-hover:border-orange-400 transition-all">
//                           <FaHeart className="text-sm text-stone-600 group-hover:text-orange-600 transition-colors" />
//                         </div>
//                       </div>

//                       <div className="relative z-10 h-full flex flex-col justify-between p-7">
//                         <div className="flex items-start justify-between">
//                           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/50">
//                             <span className="text-2xl font-serif font-bold text-stone-900">
//                               {productCounts[category.id] || 0}
//                             </span>
//                             <span className="text-xs text-stone-600 mr-2">
//                               منتج
//                             </span>
//                           </div>
//                           <div className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
//                             <FaArrowRight className="text-stone-900 group-hover:text-white transform rotate-180 group-hover:rotate-0 transition-all" />
//                           </div>
//                         </div>

//                         <div>
//                           <div className="flex gap-1.5 mb-4">
//                             {[0, 1, 2].map((dot) => (
//                               <div
//                                 key={dot}
//                                 className={`h-1.5 rounded-full transition-all ${
//                                   dot === 0
//                                     ? 'w-6 bg-orange-500'
//                                     : 'w-1.5 bg-white/50'
//                                 }`}
//                               />
//                             ))}
//                           </div>

//                           <h3 className="text-3xl font-serif font-bold text-white mb-2">
//                             {category.name}
//                           </h3>
//                           <p className="text-sm text-white/70 mb-4">
//                             استكشف المجموعة الكاملة
//                           </p>

//                           <div className="flex items-center justify-between pt-4 border-t border-white/20">
//                             <div className="flex items-center gap-1">
//                               {[...Array(5)].map((_, i) => (
//                                 <FaStar
//                                   key={i}
//                                   className="text-orange-400 text-xs"
//                                 />
//                               ))}
//                               <span className="text-xs text-white/80 mr-1">
//                                 (٤.٨)
//                               </span>
//                             </div>
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               className="px-4 py-2 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold rounded-full hover:bg-orange-600 hover:text-white transition-all"
//                             >
//                               عرض القسم
//                             </motion.button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {activeCategories.length > 0 && (
//               <div className="flex items-center justify-center gap-2 mt-10">
//                 {activeCategories.map((_, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentCategorySlide(idx)}
//                     className={`transition-all duration-300 rounded-full ${
//                       idx === currentCategorySlide
//                         ? 'w-8 h-2 bg-orange-600'
//                         : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
//                     }`}
//                     aria-label={`القسم ${idx + 1}`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ==================== FEATURED PRODUCTS ==================== */}
//       <section
//         id="featured-products"
//         className="relative px-6 sm:px-12 py-20 bg-white/50 backdrop-blur-sm"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 text-center"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-px w-12 bg-orange-400/50" />
//               <span className="text-sm font-medium text-stone-500 tracking-[0.3em]">
//                 منتجات مختارة بعناية
//               </span>
//               <div className="h-px w-12 bg-orange-400/50" />
//             </div>
//             <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-stone-900">
//               أبرز المنتجات
//             </h2>
//           </motion.div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {activeCategories.flatMap((category, catIdx) =>
//               productsByCategory[category.id]?.slice(0, 2).map((item, idx) => (
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{
//                     delay: (catIdx * 2 + idx) * 0.1,
//                     duration: 0.4,
//                   }}
//                 >
//                   <SmallCard item={item} category={category} />
//                 </motion.div>
//               )),
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// 'use client';

// import { useRouter } from 'next/navigation';
// import { useCallback, useMemo } from 'react';
// import categories from '@/components/Categories/categories';
// import { FaHome } from 'react-icons/fa';
// import {
//   motion,
//   AnimatePresence,
//   useReducedMotion,
// } from 'framer-motion';
// import { cn } from '@/lib/utils';
// import { useSearch } from '@/features/search/search-context';
// import { serializeCategory } from '@/components/Categories/serializeCategory';

// const CategoryCard = ({ item, selected, onClick, index }) => {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.button
//       type="button"
//       onClick={onClick}
//       aria-pressed={selected}
//       aria-label={`تصفح قسم ${item?.name || ''}`}
//       title={item?.name || ''}
//       whileHover={reduceMotion ? undefined : { y: -4 }}
//       whileTap={reduceMotion ? undefined : { scale: 0.99 }}
//       initial={reduceMotion ? false : { opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{
//         duration: reduceMotion ? 0 : 0.35,
//         delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.2),
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       className={cn(
//         'group relative isolate flex min-h-[124px] w-full min-w-0',
//         'flex-col items-center justify-center gap-3',
//         'overflow-hidden rounded-2xl border p-4 text-center',
//         'transition-[border-color,background-color,box-shadow] duration-300',
//         'focus-visible:outline-none focus-visible:ring-2',
//         'focus-visible:ring-[#d9a477] focus-visible:ring-offset-2',
//         'focus-visible:ring-offset-[#141311]',
//         selected
//           ? [
//               'border-[#c99b70]/60',
//               'bg-gradient-to-br from-[#30271f] to-[#211d19]',
//               'shadow-[0_8px_28px_rgba(0,0,0,0.18)]',
//             ].join(' ')
//           : [
//               'border-white/[0.085]',
//               'bg-white/[0.025]',
//               'hover:border-[#c99b70]/35',
//               'hover:bg-white/[0.045]',
//               'hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
//             ].join(' ')
//       )}
//     >
//       {/* Selected background */}
//       <AnimatePresence>
//         {selected && (
//           <motion.div
//             layoutId="premium-category-glow"
//             className="absolute inset-0 -z-10 bg-gradient-to-br from-[#c99b70]/[0.13] via-[#c99b70]/[0.035] to-transparent"
//             transition={{
//               type: 'spring',
//               stiffness: 300,
//               damping: 30,
//             }}
//           />
//         )}
//       </AnimatePresence>

//       {/* Decorative rings */}
//       <div
//         aria-hidden="true"
//         className={cn(
//           'pointer-events-none absolute -bottom-12 -left-10',
//           'h-28 w-28 rounded-full border',
//           'border-white/[0.045]',
//           'transition-transform duration-700',
//           !reduceMotion && 'group-hover:scale-125'
//         )}
//       />

//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -bottom-14 -left-4 h-20 w-20 rounded-full border border-white/[0.035]"
//       />

//       {/* Icon */}
//       <div
//         className={cn(
//           'relative flex h-[50px] w-[50px] shrink-0',
//           'items-center justify-center rounded-[16px] border',
//           'transition-all duration-300',
//           selected
//             ? [
//                 'border-[#e2bd99]/40',
//                 'bg-gradient-to-br from-[#d4ad87] to-[#956342]',
//                 'text-[#201812]',
//                 'shadow-[0_5px_18px_rgba(201,155,112,0.16)]',
//               ].join(' ')
//             : [
//                 'border-white/[0.08]',
//                 'bg-[#201e1a]',
//                 'text-[#c5a184]',
//                 'group-hover:border-[#c99b70]/35',
//                 'group-hover:bg-[#2b241e]',
//                 'group-hover:text-[#e6c4a4]',
//               ].join(' ')
//         )}
//       >
//         <span className="text-xl leading-none">
//           {item?.icon || <FaHome aria-hidden="true" />}
//         </span>
//       </div>

//       {/* Category name */}
//       <div className="relative flex w-full min-w-0 flex-col items-center gap-2">
//         <span
//           className={cn(
//             'w-full truncate text-sm font-semibold tracking-wide',
//             'transition-colors duration-300',
//             selected
//               ? 'text-[#f5e6d7]'
//               : 'text-stone-300 group-hover:text-white'
//           )}
//         >
//           {item?.name}
//         </span>

//         <motion.span
//           initial={false}
//           animate={{
//             width: selected ? 30 : 10,
//             opacity: selected ? 1 : 0.4,
//           }}
//           transition={{ duration: reduceMotion ? 0 : 0.25 }}
//           className="h-[2px] rounded-full bg-gradient-to-r from-[#d9b18c] to-[#9d704d]"
//         />
//       </div>

//       {/* Selection indicator */}
//       <span
//         aria-hidden="true"
//         className={cn(
//           'absolute right-3 top-3 h-1.5 w-1.5 rounded-full',
//           'transition-all duration-300',
//           selected
//             ? 'bg-[#e3bb94] shadow-[0_0_9px_rgba(217,177,140,0.5)]'
//             : 'bg-white/15 group-hover:bg-[#d9b18c]/70'
//         )}
//       />

//       {/* Top accent */}
//       <motion.span
//         aria-hidden="true"
//         initial={false}
//         animate={{
//           scaleX: selected ? 1 : 0,
//           opacity: selected ? 1 : 0,
//         }}
//         transition={{ duration: reduceMotion ? 0 : 0.25 }}
//         className="absolute inset-x-5 top-0 h-px origin-center bg-gradient-to-r from-transparent via-[#d9b18c] to-transparent"
//       />
//     </motion.button>
//   );
// };

// const CategoriesNavBar = () => {
//   const router = useRouter();
//   const reduceMotion = useReducedMotion();

//   const { category, setCategory, performSearch } = useSearch();

//   const categoryList = categories || [];

//   const selectedCategory = useMemo(
//     () =>
//       categoryList.find((item) => item.id === category?.id) || null,
//     [categoryList, category]
//   );

//   const handleCategoryClick = useCallback(
//     (item) => {
//       if (!item?.id) return;

//       setCategory(item);

//       try {
//         localStorage.setItem(
//           'category',
//           serializeCategory(item)
//         );
//       } catch {
//         // Local storage might be unavailable.
//       }

//       router.push(
//         `/search?categoryId=${encodeURIComponent(item.id)}`
//       );

//       performSearch();
//     },
//     [setCategory, router, performSearch]
//   );

//   return (
//     <section
//       dir="rtl"
//       aria-labelledby="categories-heading"
//       className={cn(
//         'relative isolate w-full overflow-hidden',
//         'border-y border-white/[0.065]',
//         'bg-[#141311] text-white'
//       )}
//     >
//       {/* Background atmosphere */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(153,105,68,0.12),transparent_48%),radial-gradient(ellipse_at_bottom_left,rgba(111,77,48,0.07),transparent_42%)]"
//       />

//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -right-32 -top-40 -z-10 h-80 w-80 rounded-full bg-[#bc8c62]/[0.055] blur-3xl"
//       />

//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -bottom-40 left-[20%] -z-10 h-72 w-72 rounded-full bg-[#8a6244]/[0.045] blur-3xl"
//       />

//       <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">

//         {/* Header */}
//         <div className="mb-7 flex items-center justify-between gap-4 sm:mb-9">
//           <div className="flex min-w-0 items-center gap-3 sm:gap-4">
//             <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#c99b70]/25 bg-gradient-to-br from-[#c99b70]/[0.13] to-transparent sm:h-14 sm:w-14">
//               <span
//                 aria-hidden="true"
//                 className="h-3.5 w-3.5 rotate-45 rounded-[2px] border border-[#d7b18c] bg-[#c99b70]/10 sm:h-4 sm:w-4"
//               />

//               <span
//                 aria-hidden="true"
//                 className="absolute bottom-2.5 right-2.5 h-1 w-1 rounded-full bg-[#d7b18c]"
//               />
//             </div>

//             <div className="min-w-0">
//               <div className="mb-1.5 flex items-center gap-2">
//                 <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#c99b70] sm:text-[10px]">
//                   EXPLORE COLLECTION
//                 </span>

//                 <span className="h-px w-5 bg-[#c99b70]/45 sm:w-8" />
//               </div>

//               <h2
//                 id="categories-heading"
//                 className="text-lg font-bold tracking-tight text-[#f5f0e9] sm:text-2xl"
//               >
//                 تصفح الأقسام
//               </h2>

//               <p className="mt-1 text-xs leading-5 text-stone-400 sm:text-sm">
//                 كل ما تبحث عنه، في مكان واحد
//               </p>
//             </div>
//           </div>

//           {/* Category count */}
//           <div className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-white/[0.075] bg-white/[0.025] px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
//             <div className="text-left">
//               <span className="block text-xl font-light tabular-nums tracking-wide text-[#dfbd9c] sm:text-2xl">
//                 {String(categoryList.length).padStart(2, '0')}
//               </span>

//               <span className="block text-[9px] text-stone-500 sm:text-[10px]">
//                 الأقسام
//               </span>
//             </div>

//             <span
//               aria-hidden="true"
//               className="h-8 w-px bg-white/[0.09]"
//             />

//             <span
//               aria-hidden="true"
//               className="h-2 w-2 rounded-full bg-[#c99b70] shadow-[0_0_8px_rgba(201,155,112,0.35)]"
//             />
//           </div>
//         </div>

//         {/* Subtle divider */}
//         <div className="mb-5 flex items-center gap-3 sm:mb-6">
//           <span className="h-px flex-1 bg-gradient-to-l from-white/[0.12] to-transparent" />

//           <span className="text-[9px] font-medium tracking-[0.16em] text-stone-500">
//             ALL CATEGORIES
//           </span>

//           <span className="h-px flex-1 bg-gradient-to-r from-white/[0.12] to-transparent" />
//         </div>

//         {/* Responsive category grid — original column layout preserved */}
//         {categoryList.length > 0 ? (
//           <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
//             {categoryList.map((item, index) => (
//               <CategoryCard
//                 key={item.id}
//                 item={item}
//                 index={index}
//                 selected={selectedCategory?.id === item.id}
//                 onClick={() => handleCategoryClick(item)}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-12 text-center">
//             <div className="mb-3 text-2xl text-[#c99b70]">
//               <FaHome className="mx-auto" aria-hidden="true" />
//             </div>

//             <p className="text-sm font-semibold text-stone-200">
//               لا توجد أقسام متاحة حالياً
//             </p>

//             <p className="mt-2 text-xs text-stone-500">
//               يرجى المحاولة مرة أخرى لاحقاً
//             </p>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4 sm:mt-7 sm:pt-5">
//           <div className="flex items-center gap-2.5">
//             <span
//               aria-hidden="true"
//               className="h-1.5 w-1.5 rounded-full bg-[#c99b70]"
//             />

//             <span className="text-[9px] font-medium uppercase tracking-[0.17em] text-stone-500 sm:text-[10px]">
//               DISCOVER YOUR STYLE
//             </span>
//           </div>

//           <AnimatePresence mode="wait" initial={false}>
//             <motion.div
//               key={selectedCategory?.id || 'default'}
//               initial={reduceMotion ? false : { opacity: 0, y: 3 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={reduceMotion ? undefined : { opacity: 0, y: -3 }}
//               transition={{ duration: reduceMotion ? 0 : 0.2 }}
//               className="flex min-w-0 items-center gap-2"
//             >
//               <span className="text-[11px] text-stone-500">
//                 اختيارك
//               </span>

//               <span className="max-w-[160px] truncate text-xs font-semibold text-[#dfbd9c] sm:max-w-none">
//                 {selectedCategory?.name || 'تصفح الأقسام'}
//               </span>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CategoriesNavBar;

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import categories from '@/components/Categories/categories';
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingBag,
  FaArrowLeft,
  FaArrowUp,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
  FaInstagram,
  FaFacebookF,
  FaBars,
  FaTimes,
  FaCheck,
  FaEnvelope,
  FaChevronLeft,
} from 'react-icons/fa';

const C = {
  bg: '#141311',
  panel: '#1C1A17',
  card: '#211F1B',
  line: 'rgba(255,255,255,.09)',
  gold: '#C99B70',
  ivory: '#F5F0E9',
  muted: '#A49A8E',
};

const products = [
  {
    id: 'p1',
    name: 'حقيبة جلدية بتصميم كلاسيكي',
    category: 'الإكسسوارات',
    price: 189,
    oldPrice: 245,
    rating: 4.9,
    reviews: 128,
    badge: 'الأكثر مبيعاً',
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'p2',
    name: 'ساعة بتفاصيل معدنية أنيقة',
    category: 'الساعات',
    price: 259,
    oldPrice: null,
    rating: 4.8,
    reviews: 86,
    badge: 'اختيار المحرر',
    image:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'p3',
    name: 'عطر فاخر بعبق دافئ',
    category: 'العطور',
    price: 145,
    oldPrice: 180,
    rating: 4.7,
    reviews: 94,
    badge: 'عرض خاص',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'p4',
    name: 'حذاء يومي بخامات ممتازة',
    category: 'الأزياء',
    price: 215,
    oldPrice: null,
    rating: 4.8,
    reviews: 61,
    badge: 'وصل حديثاً',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85',
  },
];

const newArrivals = [
  {
    id: 'n1',
    name: 'مجموعة جلدية عصرية',
    price: 175,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'n2',
    name: 'نظارات بتصميم مميز',
    price: 95,
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'n3',
    name: 'حذاء بتصميم عصري',
    price: 220,
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'n4',
    name: 'ساعة بلمسة كلاسيكية',
    price: 290,
    image:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=85',
  },
];

const benefits = [
  {
    icon: FaTruck,
    title: 'توصيل موثوق',
    desc: 'خيارات توصيل واضحة ومناسبة',
  },
  {
    icon: FaShieldAlt,
    title: 'دفع آمن',
    desc: 'حماية بياناتك أثناء الدفع',
  },
  {
    icon: FaUndo,
    title: 'استرجاع واضح',
    desc: 'سياسة استبدال واسترجاع معلنة',
  },
  {
    icon: FaHeadset,
    title: 'نحن هنا لمساعدتك',
    desc: 'فريق دعم لخدمتك',
  },
];

function SectionHeading({ eyebrow, title, desc, href, linkText = 'اكتشف المجموعة' }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-9">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.25em] text-[#C99B70]">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-[#F5F0E9] sm:text-3xl">
          {title}
        </h2>
        {desc && (
          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">
            {desc}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9B18C] transition hover:text-white"
        >
          {linkText}
          <FaArrowLeft aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function ProductCard({ product, onAddFavorite, favorite }) {
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-2xl border border-white/[.07] bg-[#211F1B]">
        <Link
          href={`/products/${product.id}`}
          aria-label={`عرض ${product.name}`}
          className="block"
        >
          <div className="aspect-[4/4.7] overflow-hidden bg-[#29251F]">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
            />
          </div>
        </Link>

        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-[#171512]/90 px-3 py-1.5 text-[10px] font-semibold text-[#E5C5A5] backdrop-blur">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => onAddFavorite(product.id)}
          aria-label={
            favorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'
          }
          aria-pressed={favorite}
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#171512]/85 text-sm text-white transition hover:border-[#C99B70]/50 hover:text-[#D9B18C]"
        >
          <FaHeart
            className={favorite ? 'text-rose-400' : ''}
            aria-hidden="true"
          />
        </button>

        <Link
          href={`/products/${product.id}`}
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#171512]/95 px-3 py-3 text-xs font-semibold text-white opacity-0 transition duration-300 hover:bg-[#33271E] group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
        >
          عرض التفاصيل
          <FaArrowLeft aria-hidden="true" />
        </Link>
      </div>

      <div className="px-1 pt-4">
        <p className="mb-1.5 text-[10px] text-[#C99B70]">
          {product.category || 'تشكيلة مختارة'}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-6 text-stone-200 transition hover:text-white">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-400">
          <FaStar className="text-[#D4AE83]" aria-hidden="true" />
          <span>{product.rating}</span>
          <span>({product.reviews} تقييم)</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-base font-bold text-[#F5F0E9]">
            {product.price.toLocaleString('ar')} 
          </span>
          {product.oldPrice && (
            <span className="text-xs text-stone-500 line-through">
              {product.oldPrice.toLocaleString('ar')}
            </span>
          )}
          <span className="text-[10px] text-stone-500">
            وحدة نقدية
          </span>
        </div>
      </div>
    </article>
  );
}

function CategoryTile({ item, index }) {
  const colors = [
    'from-[#493326] to-[#201A16]',
    'from-[#39342A] to-[#1C1B18]',
    'from-[#45352F] to-[#211A18]',
    'from-[#34352D] to-[#191B18]',
  ];

  return (
    <Link
      href={`/search?categoryId=${encodeURIComponent(item.id)}`}
      className={`group relative flex min-h-28 items-center justify-between overflow-hidden rounded-2xl border border-white/[.08] bg-gradient-to-br ${colors[index % colors.length]} p-4 transition duration-300 hover:-translate-y-1 hover:border-[#C99B70]/40 sm:min-h-32 sm:p-5`}
    >
      <div className="relative z-10 min-w-0">
        <h3 className="max-w-full truncate text-sm font-bold text-[#F5F0E9] sm:text-base">
          {item.name}
        </h3>
        <span className="mt-3 inline-flex items-center gap-2 text-[10px] text-[#D9B18C]">
          تسوق الآن <FaArrowLeft aria-hidden="true" />
        </span>
      </div>

      <div className="relative mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/15 text-xl text-[#D9B18C] transition duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
        {item.icon || <FaShoppingBag aria-hidden="true" />}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full border border-white/[.06]"
      />
    </Link>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categoryList = categories || [];

  const featuredProducts = products;

  const filteredProducts = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return products;

    return products.filter((p) =>
      `${p.name} ${p.category}`.toLowerCase().includes(value)
    );
  }, [query]);

  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const handleNewsletter = (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    // Connect this action to your newsletter provider/API.
    setSubscribed(true);
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-clip bg-[#141311] text-[#F5F0E9] selection:bg-[#C99B70]/30"
    >
      {/* 01 — Announcement bar */}
      <div className="border-b border-white/[.06] bg-[#211C17]">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-[10px] text-stone-300 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C99B70]" />
          اكتشف مجموعتنا الجديدة واستمتع بتجربة تسوق استثنائية
          <Link
            href="/products"
            className="font-semibold text-[#D9B18C] underline-offset-4 hover:underline"
          >
            اكتشف الآن
          </Link>
        </div>
      </div>

      {/* 02 — Main header */}
      <header className="relative z-30 border-b border-white/[.08] bg-[#141311]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 flex-col">
              <span className="text-xl font-black tracking-[.08em] text-[#F5F0E9] sm:text-2xl">
                MAISON<span className="text-[#C99B70]">.</span>
              </span>
              <span className="mt-0.5 text-[8px] tracking-[.25em] text-stone-500">
                CURATED LIVING
              </span>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              {[
                ['الرئيسية', '/'],
                ['جميع المنتجات', '/products'],
                ['وصل حديثاً', '/products?sort=newest'],
                ['الأكثر مبيعاً', '/products?sort=popular'],
                ['العروض', '/offers'],
              ].map(([label, href], index) => (
                <Link
                  key={label}
                  href={href}
                  className={`text-xs transition hover:text-[#D9B18C] ${index === 0 ? 'font-semibold text-[#D9B18C]' : 'text-stone-300'}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Link
                href="/account"
                aria-label="حسابي"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/[.08] text-stone-300 transition hover:border-[#C99B70]/40 hover:text-white sm:flex"
              >
                <FaUser aria-hidden="true" />
              </Link>

              <Link
                href="/wishlist"
                aria-label="المفضلة"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/[.08] text-stone-300 transition hover:border-[#C99B70]/40 hover:text-white sm:flex"
              >
                <FaHeart aria-hidden="true" />
              </Link>

              <Link
                href="/cart"
                aria-label="سلة التسوق"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C99B70]/25 bg-[#C99B70]/[.07] text-[#D9B18C] transition hover:bg-[#C99B70]/15"
              >
                <FaShoppingBag aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenu(!mobileMenu)}
                aria-label={mobileMenu ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={mobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[.08] text-white lg:hidden"
              >
                {mobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Search */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }}
            className="mb-4 flex h-11 items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.025] px-4 transition focus-within:border-[#C99B70]/40 sm:mb-5"
          >
            <FaSearch className="shrink-0 text-sm text-[#C99B70]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث عن منتج، علامة تجارية أو مجموعة..."
              aria-label="البحث عن المنتجات"
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-stone-500 sm:text-sm"
            />
            <button
              type="submit"
              className="hidden text-xs text-[#D9B18C] sm:block"
            >
              بحث
            </button>
          </form>

          {/* Mobile navigation */}
          {mobileMenu && (
            <nav className="grid grid-cols-2 gap-2 pb-4 lg:hidden">
              {[
                ['الرئيسية', '/'],
                ['جميع المنتجات', '/products'],
                ['وصل حديثاً', '/products?sort=newest'],
                ['الأكثر مبيعاً', '/products?sort=popular'],
                ['العروض', '/offers'],
                ['حسابي', '/account'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileMenu(false)}
                  className="rounded-xl border border-white/[.07] bg-white/[.025] p-3 text-xs text-stone-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* 03 — Hero */}
      <section className="relative isolate overflow-hidden border-b border-white/[.06]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_20%_30%,rgba(171,113,70,0.17),transparent_48%),linear-gradient(115deg,#181613,#201A15_55%,#141311)]"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-8 lg:py-16">
          <div className="relative z-10 order-2 lg:order-1">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C99B70]/25 bg-[#C99B70]/[.06] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C99B70]" />
              <span className="text-[10px] font-semibold tracking-wide text-[#D9B18C]">
                THE NEW SEASON · 2026
              </span>
            </div>

            <p className="mb-3 text-xs tracking-[.2em] text-stone-400">
              ذوق مختلف. تفاصيل تصنع الفرق.
            </p>

            <h1 className="max-w-xl text-4xl font-black leading-[1.35] tracking-tight text-[#F5F0E9] sm:text-5xl lg:text-6xl">
              الفخامة
              <br />
              <span className="font-light italic text-[#D1A982]">
                في كل تفصيل.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-8 text-stone-400 sm:text-base">
              اكتشف مجموعة مختارة بعناية من المنتجات التي تجمع بين
              التصميم المميز، والجودة، والتفاصيل التي تستحقها.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#C99B70] px-5 py-3 text-xs font-bold text-[#211912] transition hover:bg-[#E0BB98]"
              >
                تسوق المجموعة
                <FaArrowLeft aria-hidden="true" />
              </Link>

              <Link
                href="/products?sort=newest"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/[.12] px-5 py-3 text-xs font-semibold text-stone-200 transition hover:border-[#C99B70]/50 hover:text-white"
              >
                اكتشف الجديد
                <FaChevronLeft aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/[.08] pt-5">
              {[
                ['منتجات', 'مختارة بعناية'],
                ['تجربة', 'تسوق سهلة'],
                ['خدمة', 'تهتم بك'],
              ].map(([title, desc]) => (
                <div key={title}>
                  <p className="text-xs font-semibold text-[#E5C5A5]">
                    {title}
                  </p>
                  <p className="mt-1 text-[10px] text-stone-500">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative order-1 min-w-0 lg:order-2">
            <div className="absolute -inset-4 rounded-[32px] bg-[#C99B70]/[.045] blur-2xl" />

            <div className="relative overflow-hidden rounded-[24px] border border-white/[.10] bg-[#29231E] p-2">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[18px] sm:aspect-[5/3.7] lg:aspect-[4/4.4]">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=90"
                  alt="مساحة تسوق بتصميم فاخر"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/[.08] to-transparent" />

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 sm:inset-x-7 sm:bottom-7">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[.22em] text-[#E8C5A2]">
                      SELECTED FOR YOU
                    </p>
                    <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                      اختيارات الموسم
                    </p>
                  </div>

                  <Link
                    href="/products"
                    aria-label="اكتشف اختيارات الموسم"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur transition hover:bg-[#C99B70] hover:text-black"
                  >
                    <FaArrowLeft aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 right-5 rounded-xl border border-white/10 bg-[#201B17]/95 px-4 py-3 shadow-xl backdrop-blur sm:right-8">
              <p className="text-[9px] text-stone-400">اختيارات بعناية</p>
              <p className="mt-1 text-xs font-semibold text-[#E2BD99]">
                جودة تلاحظها
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Shopping categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="SHOP BY CATEGORY"
          title="اكتشف عالمك"
          desc="ابدأ من القسم الذي يناسب أسلوبك، واستكشف مجموعتنا."
          href="/categories"
        />

        {categoryList.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categoryList.slice(0, 8).map((item, index) => (
              <CategoryTile key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/[.08] p-6 text-sm text-stone-400">
            ستظهر الأقسام هنا بعد تحميل بيانات الأقسام من المتجر.
          </p>
        )}
      </section>

      {/* 05 — Featured products */}
      <section className="border-y border-white/[.055] bg-[#191714]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <SectionHeading
            eyebrow="THE EDIT"
            title="منتجات مميزة"
            desc="مجموعة مختارة تجمع بين الجمال والعملية والتفاصيل المدروسة."
            href="/products?sort=featured"
          />

          {query.trim() && (
            <p className="mb-5 text-xs text-stone-400">
              نتائج البحث المحلية: {filteredProducts.length}
            </p>
          )}

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                favorite={favorites.includes(product.id)}
                onAddFavorite={toggleFavorite}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-white/[.08] py-12 text-center">
              <p className="text-sm text-stone-300">
                لم نجد منتجاً مطابقاً لعبارة البحث.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 text-xs text-[#D9B18C] underline underline-offset-4"
              >
                مسح البحث
              </button>
            </div>
          )}

          <div className="mt-9 text-center">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[#C99B70]/35 px-6 py-3 text-xs font-semibold text-[#E0BB98] transition hover:bg-[#C99B70]/10"
            >
              استكشف جميع المنتجات
              <FaArrowLeft aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 06 — Editorial campaign banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative isolate grid overflow-hidden rounded-[24px] border border-white/[.08] bg-[#282019] lg:grid-cols-2">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(201,155,112,.17),transparent_48%)]" />

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.23em] text-[#D9B18C]">
              THE ART OF CHOOSING
            </p>

            <h2 className="max-w-lg text-3xl font-bold leading-relaxed text-[#F5F0E9] sm:text-4xl">
              الأشياء الجميلة
              <br />
              <span className="font-light italic text-[#D9B18C]">
                تبدأ باختيارك.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-stone-400">
              استكشف مجموعاتنا المختارة، وابحث عن القطعة التي تعكس
              ذوقك وتكمل تفاصيل يومك.
            </p>

            <Link
              href="/collections"
              className="mt-7 inline-flex w-fit items-center gap-3 rounded-xl bg-[#C99B70] px-5 py-3.5 text-xs font-bold text-[#211912] transition hover:bg-[#E0BB98]"
            >
              اكتشف المجموعات
              <FaArrowLeft aria-hidden="true" />
            </Link>
          </div>

          <div className="min-h-[260px] overflow-hidden sm:min-h-[360px]">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
              alt="مجموعة أزياء مختارة"
              loading="lazy"
              className="h-full min-h-[260px] w-full object-cover sm:min-h-[360px]"
            />
          </div>
        </div>
      </section>

      {/* 07 — New arrivals */}
      <section className="border-y border-white/[.055] bg-[#191714]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <SectionHeading
            eyebrow="JUST ARRIVED"
            title="وصل حديثاً"
            desc="اكتشف أحدث الإضافات إلى مجموعتنا."
            href="/products?sort=newest"
            linkText="كل المنتجات الجديدة"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {newArrivals.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group min-w-0"
              >
                <div className="aspect-[4/4.5] overflow-hidden rounded-2xl border border-white/[.07] bg-[#24211D]">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-start justify-between gap-2 pt-3">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-xs font-semibold leading-6 text-stone-200 group-hover:text-white sm:text-sm">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#D9B18C]">
                      {product.price.toLocaleString('ar')} وحدة نقدية
                    </p>
                  </div>

                  <span className="mt-1 shrink-0 text-[#C99B70]">
                    <FaArrowLeft aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="CUSTOMER FAVORITES"
          title="الأكثر طلباً"
          desc="تصفح اختيارات من مجموعتنا، ثم اربطها ببيانات المبيعات الفعلية."
          href="/products?sort=popular"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
          {[
            {
              n: '01',
              title: 'التفاصيل تصنع الفرق',
              text: 'منتجات بتصميم مدروس وخامات مميزة.',
              image: products[0].image,
              href: '/products/p1',
            },
            {
              n: '02',
              title: 'أسلوبك الخاص',
              text: 'اختيارات متنوعة لتناسب ذوقك.',
              image: products[1].image,
              href: '/products/p2',
            },
            {
              n: '03',
              title: 'هدية تستحقها',
              text: 'اكتشف خيارات مناسبة لمختلف المناسبات.',
              image: products[2].image,
              href: '/products/p3',
            },
          ].map((item) => (
            <Link
              href={item.href}
              key={item.n}
              className="group relative isolate flex min-h-[260px] items-end overflow-hidden rounded-2xl border border-white/[.08] bg-[#211F1B] sm:min-h-[330px]"
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

              <div className="w-full p-5 sm:p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] tracking-[.2em] text-[#E0BB98]">
                    EDITION {item.n}
                  </span>
                  <FaArrowLeft className="text-sm text-white transition group-hover:-translate-x-1" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-stone-300">
                  {item.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 09 — Brand / collection strip */}
      <section className="border-y border-white/[.055] bg-[#1A1815]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <p className="mb-7 text-center text-[10px] font-semibold uppercase tracking-[.22em] text-stone-500">
            EXPLORE OUR COLLECTIONS
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['01', 'الكلاسيكيات', 'CLASSICS'],
              ['02', 'الاختيارات الحديثة', 'CONTEMPORARY'],
              ['03', 'القطع المميزة', 'SIGNATURE'],
              ['04', 'هدايا مختارة', 'GIFT EDIT'],
            ].map(([n, title, subtitle]) => (
              <Link
                href="/collections"
                key={n}
                className="group rounded-xl border border-white/[.065] p-4 text-center transition hover:border-[#C99B70]/35 hover:bg-white/[.025] sm:p-6"
              >
                <span className="text-[10px] text-[#C99B70]">{n}</span>
                <h3 className="mt-3 text-sm font-semibold text-stone-200 group-hover:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-[8px] tracking-[.16em] text-stone-500">
                  {subtitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — Service benefits */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/[.07] bg-white/[.02] p-4 sm:p-5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#C99B70]/20 bg-[#C99B70]/[.06] text-[#D9B18C]">
                <Icon aria-hidden="true" />
              </div>
              <h3 className="text-xs font-bold text-stone-200 sm:text-sm">
                {title}
              </h3>
              <p className="mt-2 text-[10px] leading-6 text-stone-500 sm:text-xs">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 11 — Customer testimonials */}
      <section className="border-y border-white/[.055] bg-[#191714]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <SectionHeading
            eyebrow="CUSTOMER STORIES"
            title="تجربة تستحق المشاركة"
            desc="اعرض هنا آراء العملاء الموثقة من نظام التقييم في متجرك."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ['تجربة تسوق سهلة', 'واجهة واضحة وخيارات منتجات منظمة.'],
              ['اهتمام بالتفاصيل', 'طريقة عرض المنتجات تجعل المقارنة أسهل.'],
              ['خدمة تهتم بالعميل', 'ضع هنا مراجعات موثقة بعد إتمام الطلب.'],
            ].map(([title, text], index) => (
              <article
                key={title}
                className="rounded-2xl border border-white/[.07] bg-[#211F1B] p-5 sm:p-6"
              >
                <div className="mb-4 flex gap-1 text-xs text-[#D9B18C]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} aria-hidden="true" />
                  ))}
                </div>
                <h3 className="text-sm font-bold text-stone-200">
                  {title}
                </h3>
                <p className="mt-3 text-xs leading-7 text-stone-400">
                  {text}
                </p>
                <p className="mt-5 border-t border-white/[.07] pt-4 text-[10px] text-stone-500">
                  {['تجربة العميل', 'تقييم المنتج', 'خدمة المتجر'][index]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 12 — Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[24px] border border-[#C99B70]/20 bg-[#211B16] p-6 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-24 -z-10 h-64 w-64 rounded-full bg-[#C99B70]/[.09] blur-3xl"
          />

          <div className="grid items-center gap-7 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="mb-3 text-[10px] font-semibold tracking-[.22em] text-[#D9B18C]">
                THE INNER CIRCLE
              </p>
              <h2 className="text-2xl font-bold leading-relaxed text-[#F5F0E9] sm:text-3xl">
                كن أول من يكتشف الجديد.
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                اشترك لتصلك أخبار المجموعات الجديدة والعروض عبر البريد الإلكتروني.
              </p>
            </div>

            <form onSubmit={handleNewsletter}>
              <label
                htmlFor="newsletter-email"
                className="mb-2 block text-xs text-stone-300"
              >
                بريدك الإلكتروني
              </label>

              <div className="flex gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/[.10] bg-black/[.15] px-3">
                  <FaEnvelope className="shrink-0 text-xs text-[#C99B70]" />
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    className="h-12 w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-stone-600"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#C99B70] px-4 text-xs font-bold text-[#211912] transition hover:bg-[#E0BB98]"
                >
                  اشتراك
                  <FaArrowLeft aria-hidden="true" />
                </button>
              </div>

              {subscribed && (
                <p role="status" className="mt-3 flex items-center gap-2 text-xs text-[#D9B18C]">
                  <FaCheck aria-hidden="true" />
                  تم استلام طلبك في هذه المعاينة.
                </p>
              )}

              <p className="mt-3 text-[10px] leading-5 text-stone-500">
                بالاشتراك، توافق على سياسة الخصوصية. يجب ربط النموذج بخدمة البريد الفعلية.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* 13 — Footer */}
      <footer className="border-t border-white/[.08] bg-[#100F0D]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="inline-flex flex-col">
                <span className="text-2xl font-black tracking-[.08em] text-[#F5F0E9]">
                  MAISON<span className="text-[#C99B70]">.</span>
                </span>
                <span className="mt-1 text-[8px] tracking-[.25em] text-stone-500">
                  CURATED LIVING
                </span>
              </Link>

              <p className="mt-5 max-w-xs text-xs leading-7 text-stone-500">
                مساحة تجمع المنتجات المختارة والتصميم المدروس وتجربة التسوق العصرية.
              </p>

              <div className="mt-5 flex gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[.08] text-stone-400 transition hover:border-[#C99B70]/40 hover:text-white"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[.08] text-stone-400 transition hover:border-[#C99B70]/40 hover:text-white"
                >
                  <FaFacebookF />
                </a>
              </div>
            </div>

            {[
              {
                title: 'تسوق',
                links: [
                  ['جميع المنتجات', '/products'],
                  ['الأقسام', '/categories'],
                  ['وصل حديثاً', '/products?sort=newest'],
                  ['العروض', '/offers'],
                ],
              },
              {
                title: 'خدمة العملاء',
                links: [
                  ['تواصل معنا', '/contact'],
                  ['الأسئلة الشائعة', '/faq'],
                  ['الشحن والتوصيل', '/shipping'],
                  ['الاسترجاع والاستبدال', '/returns'],
                ],
              },
              {
                title: 'معلومات',
                links: [
                  ['من نحن', '/about'],
                  ['سياسة الخصوصية', '/privacy'],
                  ['الشروط والأحكام', '/terms'],
                  ['حسابي', '/account'],
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-xs font-bold text-[#E5C5A5]">
                  {column.title}
                </h3>

                <ul className="space-y-3">
                  {column.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-xs text-stone-500 transition hover:text-stone-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[.07] pt-5 sm:flex-row sm:items-center">
            <p className="text-[10px] text-stone-600">
              © {new Date().getFullYear()} MAISON. جميع الحقوق محفوظة.
            </p>

            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-[10px] text-stone-500 transition hover:text-[#D9B18C]"
            >
              العودة إلى الأعلى
              <FaArrowUp aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
