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
// import { useCommerce } from '../contexts/CommerceContext';

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
//   FaLeaf,
// } from 'react-icons/fa';
// import Footer from '../components/ReusableComponents/Footer';
// import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
// import categories from '../components/Categories/categories';
// import Image from 'next/image';
// import DemoProductCard from '../components/Store/DemoProductCard';
// import demoProducts from '../lib/demoProducts';
// import { useCommerce } from '../contexts/CommerceContext';

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
//       className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 text-white overflow-x-hidden"
//       dir="rtl"
//     >
//       {/* ==================== HEADER ==================== */}
//       <header className="sticky top-0 z-50 bg-emerald-950/80 backdrop-blur-xl border-b border-emerald-800/30">
//         <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
//           <div className="flex items-center gap-16">
//             <Link href="/" className="flex items-center gap-3">
//               <div className="w-12 h-12 border-2 border-emerald-400 rounded-full flex items-center justify-center">
//                 <FaLeaf className="text-emerald-400 text-xl" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold tracking-wide text-emerald-50">
//                   مَتْجَر
//                 </h1>
//                 <p className="text-xs text-emerald-400/70 tracking-widest">
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
//                   className="text-sm font-medium text-emerald-200/80 hover:text-emerald-100 transition-colors relative group"
//                 >
//                   {item.title}
//                   <span className="absolute -bottom-2 right-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-300" />
//                 </a>
//               ))}
//             </nav>
//           </div>

//           <div className="flex items-center gap-6">
//             <Link
//               href="/search"
//               aria-label="البحث"
//               className="text-emerald-300/70 hover:text-emerald-100 transition-colors"
//             >
//               <FaSearch className="text-lg" />
//             </Link>
//             <Link
//               href="/profile"
//               aria-label="الملف الشخصي"
//               className="text-emerald-300/70 hover:text-emerald-100 transition-colors"
//             >
//               <FaUser className="text-lg" />
//             </Link>
//             <Link
//               href="/cart"
//               aria-label={`سلة التسوق، ${cartCount} منتج`}
//               className="relative text-emerald-300/70 hover:text-emerald-100 transition-colors"
//             >
//               <FaShoppingBag className="text-lg" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-400 text-emerald-950 text-[10px] font-bold flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* ==================== HERO SECTION ==================== */}
//       <section className="relative min-h-screen flex items-center overflow-hidden">
//         {/* خلفية متدرجة */}
//         <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-green-900/50 to-emerald-950" />

//         {/* عناصر زخرفية */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl" />
//           <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-green-600/10 blur-3xl" />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full py-20">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
//             {/* المحتوى */}
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
//                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-100 text-xs font-semibold tracking-[0.2em] uppercase rounded-full">
//                   <span className="relative flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
//                   </span>
//                   مجموعة 2026 الحصرية
//                 </div>
//               </motion.div>

//               <motion.h1
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3, duration: 1 }}
//                 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-emerald-50"
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
//                       stroke="#34d399"
//                       strokeWidth="2"
//                       fill="none"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </span>
//                 <br />
//                 <span className="text-emerald-400">أبسط</span> التفاصيل
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="text-lg text-emerald-200/80 leading-relaxed max-w-md"
//               >
//                 اكتشف مجموعة مختارة بعناية فائقة من المنتجات الفاخرة التي تجمع
//                 بين الجودة الاستثنائية والتصميم الراقي.
//               </motion.p>

//               {/* إحصائيات */}
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
//                     <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all duration-500 rounded-2xl backdrop-blur-md border border-emerald-400/20 group-hover:border-emerald-400/40" />
//                     <div className="relative p-4">
//                       <div className="text-emerald-400 text-xs mb-2 opacity-60">
//                         {stat.icon}
//                       </div>
//                       <div className="text-3xl font-bold text-emerald-50 mb-1">
//                         {stat.value}
//                       </div>
//                       <div className="text-xs text-emerald-300/70 tracking-wide">
//                         {stat.label}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>

//               {/* أزرار */}
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
//                   className="group relative inline-flex items-center gap-4 px-8 py-4 bg-emerald-500 text-emerald-950 font-medium tracking-wide rounded-full shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300"
//                 >
//                   <span>اكتشف المجموعة</span>
//                   <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="group inline-flex items-center gap-3 px-6 py-4 text-emerald-200 font-medium tracking-wide hover:text-emerald-100 transition-colors"
//                 >
//                   <div className="w-10 h-10 rounded-full border-2 border-emerald-400/50 group-hover:border-emerald-400 flex items-center justify-center transition-colors">
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
//                 className="flex items-center gap-6 pt-4 text-xs text-emerald-300/70"
//               >
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-emerald-400" />
//                   <span>شحن مجاني</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-emerald-400" />
//                   <span>ضمان الجودة</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-emerald-400" />
//                   <span>دفع آمن</span>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* صورة المنتج المميز */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.4, duration: 1 }}
//               className="lg:col-span-7 relative"
//             >
//               {activeCategories[0] &&
//                 productsByCategory[activeCategories[0].id]?.[0] && (
//                   <div className="relative">
//                     {/* البطاقة الرئيسية بتأثير زجاجي */}
//                     <div className="relative aspect-[4/5] bg-emerald-800/30 backdrop-blur-xl border border-emerald-400/20 overflow-hidden rounded-3xl shadow-2xl">
//                       <Image
//                         src={
//                           productsByCategory[activeCategories[0].id][0]
//                             .image1 || '/placeholder.jpg'
//                         }
//                         alt={activeCategories[0].name}
//                         fill
//                         className="object-cover hover:scale-105 transition-transform duration-700"
//                       />

//                       {/* تراكب */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />

//                       {/* شارة جديد */}
//                       <div className="absolute top-6 right-6 z-10">
//                         <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-5 py-2.5 rounded-full flex items-center gap-2">
//                           <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
//                           <span className="text-xs font-bold tracking-widest uppercase text-emerald-100">
//                             جديد
//                           </span>
//                         </div>
//                       </div>

//                       {/* زر المفضلة */}
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="absolute top-6 left-6 z-10 w-11 h-11 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full flex items-center justify-center hover:bg-emerald-500/40 transition-colors"
//                       >
//                         <FaHeart className="text-sm text-emerald-100" />
//                       </motion.button>

//                       {/* معلومات المنتج */}
//                       <div className="absolute bottom-0 right-0 left-0 p-8">
//                         <div className="bg-emerald-900/60 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20">
//                           <div className="flex items-start justify-between mb-4">
//                             <div>
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
//                                   {activeCategories[0].name}
//                                 </span>
//                               </div>
//                               <h3 className="text-2xl sm:text-3xl font-bold text-emerald-50 mb-2 leading-tight">
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
//                                       className="text-emerald-400 text-xs"
//                                     />
//                                   ))}
//                                 </div>
//                                 <span className="text-xs text-emerald-300/70">
//                                   (128 تقييم)
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex items-center justify-between pt-4 border-t border-emerald-400/20">
//                             <div>
//                               <div className="text-[10px] text-emerald-300/70 tracking-widest uppercase mb-1">
//                                 يبدأ من
//                               </div>
//                               <div className="flex items-baseline gap-2">
//                                 <span className="text-3xl font-bold text-emerald-50">
//                                   {productsByCategory[
//                                     activeCategories[0].id
//                                   ][0].basePrice?.toLocaleString()}
//                                 </span>
//                                 <span className="text-sm text-emerald-300/70">
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
//                               className="px-6 py-3 bg-emerald-500 text-emerald-950 font-medium tracking-wide rounded-full hover:bg-emerald-400 transition-all flex items-center gap-2"
//                             >
//                               <span>التفاصيل</span>
//                               <FaArrowRight className="text-xs" />
//                             </motion.button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== DEMO PRODUCTS ==================== */}
//       <section id="demo-products" className="relative px-6 py-20 sm:px-12">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 text-center"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-px w-12 bg-emerald-400/50" />
//               <span className="text-sm font-medium text-emerald-300/70 tracking-widest uppercase">
//                 تجربة تفاعلية
//               </span>
//               <div className="h-px w-12 bg-emerald-400/50" />
//             </div>
//             <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 text-emerald-50">
//               منتجات تجريبية
//             </h2>
//             <p className="max-w-2xl mx-auto text-lg text-emerald-200/80 leading-relaxed">
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
//                 <div className="h-px w-12 bg-emerald-400/50" />
//                 <span className="text-sm font-medium text-emerald-300/70 tracking-widest uppercase">
//                   {activeCategories.length} قسم متاح
//                 </span>
//               </div>
//               <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-emerald-50">
//                 الأقسام
//               </h2>
//             </div>
//           </motion.div>

//           {/* شبكة البطاقات بتأثير زجاجي */}
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
//                 <div className="relative aspect-[3/4] bg-emerald-800/30 backdrop-blur-xl border border-emerald-400/20 overflow-hidden rounded-3xl hover:border-emerald-400/40 transition-all duration-500">
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
//                       <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/50 to-emerald-900/50" />
//                     )}
//                     <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/50 to-transparent" />
//                   </div>

//                   {/* محتوى البطاقة */}
//                   <div className="relative z-10 h-full flex flex-col justify-between p-8">
//                     {/* الأعلى */}
//                     <div className="flex items-start justify-between">
//                       <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-4 py-2 rounded-full">
//                         <span className="text-2xl font-bold text-emerald-50">
//                           {productsByCategory[category.id]?.length || 0}
//                         </span>
//                         <span className="text-xs text-emerald-300/70 mr-2">
//                           منتج
//                         </span>
//                       </div>
//                       <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full flex items-center justify-center group-hover:bg-emerald-500/40 transition-colors">
//                         <FaArrowRight className="text-emerald-100 transform group-hover:rotate-45 transition-all" />
//                       </div>
//                     </div>

//                     {/* الأسفل */}
//                     <div>
//                       <h3 className="text-4xl font-bold text-emerald-50 mb-2">
//                         {category.name}
//                       </h3>
//                       <p className="text-sm text-emerald-300/70">
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
//       <section id="featured-products" className="relative px-6 sm:px-12 py-20">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-16 text-center"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-px w-12 bg-emerald-400/50" />
//               <span className="text-sm font-medium text-emerald-300/70 tracking-widest uppercase">
//                 منتجات مختارة
//               </span>
//               <div className="h-px w-12 bg-emerald-400/50" />
//             </div>
//             <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-emerald-50">
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
//       <div className="relative border-t border-emerald-800/30 mt-20">
//         <Footer />
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaStar,
  FaPlay,
  FaCheckCircle,
  FaHeart,
  FaAward,
  FaLeaf,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
import categories from '../components/Categories/categories';
import Image from 'next/image';
import demoProducts from '../lib/demoProducts';
import { useCommerce } from '../contexts/CommerceContext';

const OPTIMAL_BATCH_SIZE = 20;

const safeStringify = (obj) => {
  if (!obj) return '{}';
  try {
    return JSON.stringify({
      id: obj.id,
      name: obj.name,
      slug: obj.slug,
      categoryName: obj.categoryName,
    });
  } catch {
    return '{}';
  }
};

const badgeStyles = {
  NEW: 'bg-orange-100 text-orange-700 border-orange-200',
  TRENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  'BEST SELLER': 'bg-orange-600 text-white border-orange-600',
  POPULAR: 'bg-stone-100 text-stone-700 border-stone-200',
};

const badgeLabels = ['NEW', 'TRENDING', 'BEST SELLER', 'POPULAR', 'NEW'];

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [currentSlide, setCurrentSlide] = useState(2);
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const router = useRouter();
  const { cartCount, addToCart } = useCommerce();

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      toast.success('تمت إضافة المنتج إلى السلة');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBuyNow = (product) => {
    try {
      addToCart(product);
      router.push('/cart');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    let isActive = true;

    async function loadProductsByCategory() {
      try {
        const batches = [];
        for (let i = 0; i < categories.length; i += OPTIMAL_BATCH_SIZE) {
          batches.push(categories.slice(i, i + OPTIMAL_BATCH_SIZE));
        }

        for (const batch of batches) {
          try {
            const categoryIds = batch.map((category) => category.id).join(',');
            const response = await fetch(
              `/api/categories/bulk?categories=${categoryIds}`,
              { next: { revalidate: 3600 } },
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { data } = await response.json();
            if (isActive) {
              setProductsByCategory((previous) => ({ ...previous, ...data }));
            }
          } catch (error) {
            console.error('خطأ في جلب دفعة الفئات:', error);
          }
        }
      } catch (error) {
        console.error('خطأ عام في جلب البيانات:', error);
      }
    }

    loadProductsByCategory();
    return () => {
      isActive = false;
    };
  }, []);

  const handleCategoryClick = (category) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('category', safeStringify(category));
      }
      router.push(
        `/categories/${category.id}?category=${encodeURIComponent(category.name)}`,
      );
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeCategories = categories.filter(
    (category) => productsByCategory[category.id]?.length > 0,
  );
  const activeCategoryCount = new Set([
    ...activeCategories.map((category) => category.name),
    ...demoProducts.map((product) => product.categoryName),
  ]).size;
  const productCount =
    activeCategories.reduce(
      (count, category) =>
        count + (productsByCategory[category.id]?.length || 0),
      0,
    ) + demoProducts.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoProducts.length);
  };
  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + demoProducts.length) % demoProducts.length,
    );
  };

  const nextCategorySlide = () => {
    setCurrentCategorySlide((prev) => (prev + 1) % activeCategories.length);
  };
  const prevCategorySlide = () => {
    setCurrentCategorySlide(
      (prev) => (prev - 1 + activeCategories.length) % activeCategories.length,
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50/40 via-stone-50 to-amber-50/30 text-stone-900 overflow-x-hidden mt-64"
      dir="rtl"
    >
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-orange-600 rounded-full flex items-center justify-center bg-orange-50">
                <FaLeaf className="text-orange-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold tracking-wide text-stone-900">
                  مَتْجَر
                </h1>
                <p className="text-xs text-stone-500 tracking-widest">
                  LUXURY STORE
                </p>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-10">
              {[
                { title: 'المنتجات المميزة', href: '#demo-products' },
                { title: 'الأقسام', href: '#categories' },
                { title: 'المنتجات', href: '#featured-products' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-stone-600 hover:text-orange-700 transition-colors relative group"
                >
                  {item.title}
                  <span className="absolute -bottom-2 right-0 w-0 h-px bg-orange-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/search"
              aria-label="البحث"
              className="text-stone-600 hover:text-orange-700 transition-colors"
            >
              <FaSearch className="text-lg" />
            </Link>
            <Link
              href="/profile"
              aria-label="الملف الشخصي"
              className="text-stone-600 hover:text-orange-700 transition-colors"
            >
              <FaUser className="text-lg" />
            </Link>
            <Link
              href="/cart"
              aria-label={`سلة التسوق، ${cartCount} منتج`}
              className="relative text-stone-600 hover:text-orange-700 transition-colors"
            >
              <FaShoppingBag className="text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-400/10 to-amber-300/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-orange-300/8 to-transparent blur-3xl" />
          <div
            className="absolute top-0 left-0 w-full h-full opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(#C2410C 1px, transparent 1px), linear-gradient(90deg, #C2410C 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="lg:col-span-5 space-y-8 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-full shadow-lg shadow-orange-600/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  مجموعة 2026 الحصرية
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold leading-[1.05] tracking-tight text-stone-900"
              >
                الأناقة
                <br />
                <span className="italic font-light relative inline-block">
                  في
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,4 Q25,0 50,4 T100,4"
                      stroke="#C2410C"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                <span className="text-orange-700">أبسط</span> التفاصيل
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-stone-600 leading-relaxed max-w-md"
              >
                اكتشف مجموعة مختارة بعناية فائقة من المنتجات الفاخرة التي تجمع
                بين الجودة الاستثنائية والتصميم الراقي.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 pt-8"
              >
                {[
                  { value: activeCategoryCount, label: 'قسم متميز', icon: '◆' },
                  { value: productCount, label: 'منتج فاخر', icon: '✦' },
                  { value: 'A+', label: 'جودة عالية', icon: '★' },
                ].map((stat, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-orange-600/0 group-hover:from-orange-600/5 group-hover:to-orange-600/10 transition-all duration-500 rounded-2xl" />
                    <div className="relative p-4 border border-stone-200/60 rounded-2xl bg-white/60 backdrop-blur-sm hover:border-orange-600/30 transition-all duration-500">
                      <div className="text-orange-700 text-xs mb-2 opacity-60">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-serif font-bold text-stone-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-stone-500 tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (activeCategories[0]) {
                      handleCategoryClick(activeCategories[0]);
                    }
                  }}
                  className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-orange-700 to-orange-800 text-white font-medium tracking-wide rounded-full shadow-xl shadow-orange-700/30 hover:shadow-2xl hover:shadow-orange-700/40 transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-800 to-orange-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">اكتشف المجموعة</span>
                  <FaArrowRight className="relative transform group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-3 px-6 py-4 text-stone-700 font-medium tracking-wide hover:text-orange-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-stone-300 group-hover:border-orange-700 flex items-center justify-center transition-colors">
                    <FaPlay className="text-xs ml-0.5" />
                  </div>
                  <span>شاهد الفيديو</span>
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-6 pt-4 text-xs text-stone-500"
              >
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-orange-700" />
                  <span>شحن مجاني</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-orange-700" />
                  <span>ضمان الجودة</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-orange-700" />
                  <span>دفع آمن</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="lg:col-span-7 relative"
            >
              {activeCategories[0] &&
                productsByCategory[activeCategories[0].id]?.[0] && (
                  <div className="relative">
                    <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-orange-600/30 rounded-tr-[80px]" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-orange-600/30 rounded-bl-[80px]" />

                    <div className="relative aspect-[4/5] bg-gradient-to-br from-stone-100 to-stone-50 overflow-hidden rounded-3xl shadow-2xl shadow-stone-900/10">
                      <Image
                        src={
                          productsByCategory[activeCategories[0].id][0]
                            .image1 || '/placeholder.jpg'
                        }
                        alt={activeCategories[0].name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent" />

                      <div className="absolute top-6 right-6 z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-orange-600 blur-xl opacity-50" />
                          <div className="relative bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase text-stone-800">
                              جديد
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-6 left-6 z-10 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors group"
                      >
                        <FaHeart className="text-sm group-hover:scale-110 transition-transform" />
                      </motion.button>

                      <div className="absolute bottom-0 right-0 left-0 p-8">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-700 bg-orange-50 px-2 py-1 rounded">
                                  {activeCategories[0].name}
                                </span>
                              </div>
                              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2 leading-tight">
                                {
                                  productsByCategory[activeCategories[0].id][0]
                                    .title
                                }
                              </h3>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className="text-orange-600 text-xs"
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-stone-500">
                                  (128 تقييم)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                            <div>
                              <div className="text-[10px] text-stone-500 tracking-widest uppercase mb-1">
                                يبدأ من
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-serif font-bold text-stone-900">
                                  {productsByCategory[
                                    activeCategories[0].id
                                  ][0].basePrice?.toLocaleString()}
                                </span>
                                <span className="text-sm text-stone-500">
                                  ر.س
                                </span>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleCategoryClick(activeCategories[0])
                              }
                              className="group relative px-6 py-3 bg-stone-900 text-white font-medium tracking-wide rounded-full hover:bg-orange-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                            >
                              <span>التفاصيل</span>
                              <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                      className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4 w-48 border border-stone-100"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white">
                          <FaAward className="text-sm" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            جودة ممتازة
                          </div>
                          <div className="text-[10px] text-stone-500">
                            معتمدة دولياً
                          </div>
                        </div>
                      </div>
                      <div className="flex -space-x-2 space-x-reverse">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 border-2 border-white"
                          />
                        ))}
                        <div className="w-7 h-7 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                          +99
                        </div>
                      </div>
                      <div className="text-[10px] text-stone-500 mt-2">
                        عميل سعيد هذا الشهر
                      </div>
                    </motion.div>
                  </div>
                )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== DEMO PRODUCTS CAROUSEL ==================== */}
      <section id="demo-products" className="relative px-6 py-24 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-orange-400/50" />
              <span className="text-sm font-medium text-stone-500 tracking-[0.3em] uppercase">
                OUR COLLECTION
              </span>
              <div className="h-px w-12 bg-orange-400/50" />
            </div>
            <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight mb-4 text-stone-900">
              Featured Products
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-stone-600 leading-relaxed">
              Explore our most popular items loved by customers
            </p>
          </motion.div>

          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 group -mr-6"
              aria-label="السابق"
            >
              <FaChevronRight className="text-stone-700 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 group -ml-6"
              aria-label="التالي"
            >
              <FaChevronLeft className="text-stone-700 group-hover:text-white transition-colors" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
              {demoProducts.map((product, idx) => {
                const isCenter = idx === currentSlide;
                const badge = badgeLabels[idx % badgeLabels.length];
                const isFavorite = favorites.has(product.id);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative transition-all duration-500 ${
                      isCenter
                        ? 'lg:scale-110 lg:-translate-y-4 z-10'
                        : 'lg:scale-95 opacity-90'
                    }`}
                  >
                    <div
                      className={`relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border transition-all duration-500 ${
                        isCenter
                          ? 'border-orange-200 shadow-2xl shadow-orange-600/15'
                          : 'border-stone-200/60 shadow-lg shadow-stone-900/5'
                      }`}
                    >
                      <div className="absolute top-4 right-4 z-10">
                        <span
                          className={`inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${
                            badgeStyles[badge] || badgeStyles.NEW
                          }`}
                        >
                          {badge}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-4 left-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full border border-stone-200/60 flex items-center justify-center hover:border-orange-400 transition-all group"
                        aria-label="المفضلة"
                      >
                        <FaHeart
                          className={`text-sm transition-all ${
                            isFavorite
                              ? 'text-orange-600 scale-110'
                              : 'text-stone-400 group-hover:text-orange-600'
                          }`}
                        />
                      </button>

                      <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-orange-50/30 p-6 flex items-center justify-center">
                        <Image
                          src={product.image || '/placeholder.jpg'}
                          alt={product.title}
                          width={200}
                          height={200}
                          className="object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500"
                        />

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {[0, 1, 2].map((dot) => (
                            <div
                              key={dot}
                              className={`h-1.5 rounded-full transition-all ${
                                dot === 0
                                  ? 'bg-orange-600 w-4'
                                  : 'bg-stone-300 w-1.5'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-serif font-bold text-stone-900 mb-1.5">
                          {product.title}
                        </h3>
                        <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2">
                          {product.description ||
                            'منتج عالي الجودة بتصميم أنيق'}
                        </p>

                        <div className="flex items-center gap-1.5 mb-4">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-xs ${
                                  i < Math.floor(product.rating || 4.5)
                                    ? 'text-orange-500'
                                    : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-stone-600 font-medium">
                            {product.rating || 4.5}
                          </span>
                          <span className="text-xs text-stone-400">
                            ({product.reviewCount || 89})
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-serif font-bold text-stone-900">
                              ${product.price?.toFixed(2) || '99.99'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center justify-center gap-1 rounded-full border border-orange-600 px-2 py-2.5 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-600 hover:text-white"
                            aria-label={`Add to Cart: ${product.title}`}
                          >
                            <FaShoppingCart aria-hidden="true" />
                            <span>Add to Cart</span>
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleBuyNow(product)}
                            className="rounded-full bg-stone-900 px-2 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-700"
                          >
                            Buy Now
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 mt-10">
              {demoProducts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? 'w-8 h-2 bg-orange-600'
                      : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`المنتج ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES CAROUSEL ==================== */}
      <section id="categories" className="relative px-6 sm:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex items-end justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-orange-400/50" />
                <span className="text-sm font-medium text-stone-500 tracking-[0.3em] uppercase">
                  {activeCategories.length} قسم متاح
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-stone-900">
                الأقسام
              </h2>
            </div>
          </motion.div>

          <div className="relative">
            <button
              onClick={prevCategorySlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all group -mr-6"
              aria-label="السابق"
            >
              <FaChevronRight className="text-stone-700 group-hover:text-white" />
            </button>
            <button
              onClick={nextCategorySlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all group -ml-6"
              aria-label="التالي"
            >
              <FaChevronLeft className="text-stone-700 group-hover:text-white" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCategories.map((category, idx) => {
                const isActive = idx === currentCategorySlide;
                const badge = badgeLabels[idx % badgeLabels.length];

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleCategoryClick(category)}
                    className={`group relative cursor-pointer transition-all duration-500 ${
                      isActive ? 'lg:scale-105 lg:-translate-y-2 z-10' : ''
                    }`}
                  >
                    <div
                      className={`relative aspect-[3/4] bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border transition-all duration-500 ${
                        isActive
                          ? 'border-orange-300 shadow-2xl shadow-orange-600/15'
                          : 'border-stone-200/60 shadow-lg'
                      }`}
                    >
                      <div className="absolute inset-0">
                        {productsByCategory[category.id]?.[0]?.image1 ? (
                          <Image
                            src={productsByCategory[category.id][0].image1}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-stone-100" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
                      </div>

                      <div className="absolute top-5 right-5 z-10">
                        <span
                          className={`inline-block px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-full border backdrop-blur-md ${
                            badgeStyles[badge] || badgeStyles.NEW
                          }`}
                        >
                          {badge}
                        </span>
                      </div>

                      <div className="absolute top-5 left-5 z-10">
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center group-hover:border-orange-400 transition-all">
                          <FaHeart className="text-sm text-stone-600 group-hover:text-orange-600 transition-colors" />
                        </div>
                      </div>

                      <div className="relative z-10 h-full flex flex-col justify-between p-7">
                        <div className="flex items-start justify-between">
                          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/50">
                            <span className="text-2xl font-serif font-bold text-stone-900">
                              {productsByCategory[category.id]?.length || 0}
                            </span>
                            <span className="text-xs text-stone-600 mr-2">
                              منتج
                            </span>
                          </div>
                          <div className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
                            <FaArrowRight className="text-stone-900 group-hover:text-white transform group-hover:rotate-45 transition-all" />
                          </div>
                        </div>

                        <div>
                          <div className="flex gap-1.5 mb-4">
                            {[0, 1, 2].map((dot) => (
                              <div
                                key={dot}
                                className={`h-1.5 rounded-full transition-all ${
                                  dot === 0
                                    ? 'w-6 bg-orange-500'
                                    : 'w-1.5 bg-white/50'
                                }`}
                              />
                            ))}
                          </div>

                          <h3 className="text-3xl font-serif font-bold text-white mb-2">
                            {category.name}
                          </h3>
                          <p className="text-sm text-white/70 mb-4">
                            استكشف المجموعة الكاملة
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-white/20">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className="text-orange-400 text-xs"
                                />
                              ))}
                              <span className="text-xs text-white/80 mr-1">
                                (4.8)
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold rounded-full hover:bg-orange-600 hover:text-white transition-all"
                            >
                              عرض القسم
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {activeCategories.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {activeCategories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCategorySlide(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentCategorySlide
                        ? 'w-8 h-2 bg-orange-600'
                        : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`القسم ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section
        id="featured-products"
        className="relative px-6 sm:px-12 py-20 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-orange-400/50" />
              <span className="text-sm font-medium text-stone-500 tracking-[0.3em] uppercase">
                منتجات مختارة
              </span>
              <div className="h-px w-12 bg-orange-400/50" />
            </div>
            <h2 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-stone-900">
              منتجات مميزة
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activeCategories.flatMap((category, catIdx) =>
              productsByCategory[category.id]?.slice(0, 2).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: (catIdx * 2 + idx) * 0.1,
                    duration: 0.4,
                  }}
                >
                  <SmallCard item={item} category={category} />
                </motion.div>
              )),
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
