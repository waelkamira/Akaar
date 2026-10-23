// 'use client';
// import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import Footer from '../components/ReusableComponents/Footer';
// import Loading from '../components/ReusableComponents/Loading';
// import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
// import ColoredCards from '../components/ReusableComponents/ColoredCards';
// import categories from '../components/Categories/categories';
// import Image from 'next/image';

// // حجم الدفعة الأمثل (يمكن تعديله حسب الاختبار)
// const OPTIMAL_BATCH_SIZE = 20;

// export default function Home() {
//   const [productsByCategory, setProductsByCategory] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [loadedCategories, setLoadedCategories] = useState(0);
//   const router = useRouter();

//   // دالة محسنة لجلب البيانات مع التخزين المؤقت
//   const fetchProductsByCategory = useCallback(async () => {
//     setLoading(true);

//     try {
//       // تقسيم الفئات إلى دفعات
//       const batches = [];
//       for (let i = 0; i < categories.length; i += OPTIMAL_BATCH_SIZE) {
//         batches.push(categories.slice(i, i + OPTIMAL_BATCH_SIZE));
//       }

//       // جلب كل دفعة مع التعامل مع الأخطاء
//       for (const batch of batches) {
//         try {
//           const categoryIds = batch.map((c) => c.id).join(',');
//           const response = await fetch(
//             `/api/categories/bulk?categories=${categoryIds}`,
//             {
//               next: { revalidate: 3600 }, // إعادة التحقق بعد ساعة (ISR)
//             },
//           );

//           if (!response.ok)
//             throw new Error(`HTTP error! status: ${response.status}`);

//           const { data } = await response.json();

//           setProductsByCategory((prev) => ({
//             ...prev,
//             ...data,
//           }));

//           setLoadedCategories((prev) => prev + batch.length);
//         } catch (error) {
//           console.error('خطأ في جلب دفعة الفئات:', error);
//           // يمكنك هنا إضافة منطق لإعادة المحاولة أو التعامل مع الخطأ
//         }
//       }
//     } catch (error) {
//       console.error('خطأ عام في جلب البيانات:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProductsByCategory();
//   }, [fetchProductsByCategory]);

//   const handleCategoryClick = (category) => {
//     localStorage.setItem('category', JSON.stringify(category));
//     router.push(`/categories/${category.id}?category=${category.name}`);
//   };

//   const renderProducts = (category) => {
//     const products = productsByCategory[category.id];
//     console.log('products', products);
//     if (!products) return <Loading small />;
//     if (products.length === 0) return <p>لا توجد منتجات في هذه الفئة</p>;

//     return products.map((item) => (
//       <div
//         key={item.id}
//         className="flex flex-col justify-center items-center w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)]  cursor-pointer transition-shadow duration-300 ease-in-out  relative "
//       >
//         <SmallCard item={item} category={category} />
//       </div>
//     ));
//   };

//   return (
//     <div className="flex flex-col justify-center items-center">
//       <main className="relative flex flex-row-reverse items-start mt-56  justify-between overflow-hidden z-[30] h-fit w-full bg-five lg:mt-56">
//         <div className="relative flex-col justify-between items-start w-full  h-full">
//           <div className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-five rounded-b  ">
//             {loading && loadedCategories === 0 ? (
//               <Loading fullPage />
//             ) : (
//               categories
//                 .filter(
//                   (category) => productsByCategory[category.id]?.length > 0,
//                 )
//                 .map((category) => (
//                   <motion.div
//                     key={category.id}
//                     initial={{ opacity: 0, y: 50 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     viewport={{ once: true, margin: '0px 0px -100px 0px' }}
//                     className="flex flex-col justify-center items-center w-full h-full"
//                   >
//                     <div className="flex flex-col justify-center items-center w-full h-full gap-2 mt-16 ">
//                       <div
//                         className=" rounded-2xl px-2 py-1 text-nowrap text-xs text-white font-semibold flex items-center gap-2 shadow-lg"
//                         onClick={() => handleCategoryClick(category)}
//                       >
//                         <ColoredCards
//                           number={category.id}
//                           text={category.name}
//                         />
//                       </div>

//                       <div className="flex flex-wrap justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
//                         {renderProducts(category)}
//                         <div
//                           className="flex justify-center items-center gap-2 cursor-pointer text-lg transition-transform ease-in-out duration-200 mt-8 sm:mt-20"
//                           onClick={() => handleCategoryClick(category)}
//                         >
//                           <FaAngleDoubleLeft className="text-primary-500" />
//                           <motion.span
//                             whileHover={{ scale: 1.05 }}
//                             className="text-xl xl:text-2xl font-medium text-three"
//                             style={{
//                               textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)',
//                             }}
//                           >
//                             المزيد من {category.name}
//                           </motion.span>
//                           <FaAngleDoubleRight className="text-primary-500" />
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))
//             )}
//           </div>
//           <div className="flex justify-end w-full">
//             <Footer />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaShoppingBag, FaSearch, FaUser, FaArrowRight } from 'react-icons/fa';
// import Footer from '../components/ReusableComponents/Footer';
// import Loading from '../components/ReusableComponents/Loading';
// import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
// import ColoredCards from '../components/ReusableComponents/ColoredCards';
// import categories from '../components/Categories/categories';
// import Image from 'next/image';

// const OPTIMAL_BATCH_SIZE = 20;

// const safeStringify = (obj) => {
//   if (!obj) return '{}';
//   try {
//     const safeObj = {
//       id: obj.id,
//       name: obj.name,
//       slug: obj.slug,
//       categoryName: obj.categoryName,
//     };
//     return JSON.stringify(safeObj);
//   } catch (error) {
//     console.error('Error stringifying category:', error);
//     return '{}';
//   }
// };

// export default function Home() {
//   const [productsByCategory, setProductsByCategory] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const router = useRouter();

//   const fetchProductsByCategory = useCallback(async () => {
//     setLoading(true);
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
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProductsByCategory();
//   }, [fetchProductsByCategory]);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const handleCategoryClick = (category) => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('category', safeStringify(category));
//       }
//       setActiveCategory(category.id);
//       setTimeout(() => {
//         router.push(
//           `/categories/${category.id}?category=${encodeURIComponent(category.name)}`,
//         );
//       }, 300);
//     } catch (error) {
//       console.error('Navigation error:', error);
//     }
//   };

//   const activeCategories = categories.filter(
//     (category) => productsByCategory[category.id]?.length > 0,
//   );

//   const featuredCategory = activeCategories[0];
//   const otherCategories = activeCategories.slice(1, 4);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-950 via-neutral-950 to-orange-950 flex items-center justify-center">
//         <Loading fullPage />
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-neutral-950 text-white overflow-x-hidden"
//       dir="rtl"
//     >
//       {/* Animated Background Gradient */}
//       <div className="fixed inset-0 z-0">
//         <div
//           className="absolute w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[120px] transition-all duration-700 ease-out"
//           style={{
//             left: mousePosition.x - 400,
//             top: mousePosition.y - 400,
//           }}
//         />
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[100px]" />
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-700/10 rounded-full blur-[100px]" />
//       </div>

//       {/* Vertical Text Decoration */}
//       <div className="fixed right-8 top-1/2 -translate-y-1/2 z-0 hidden xl:block pointer-events-none select-none">
//         <h1 className="text-[12rem] font-black text-neutral-800/20 writing-vertical-rl tracking-tighter leading-none">
//           MATJAR
//         </h1>
//       </div>

//       {/* Header Navigation */}
//       <motion.header
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative z-50 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-neutral-800/50 backdrop-blur-xl"
//       >
//         <div className="flex items-center gap-8">
//           <h1 className="text-3xl font-black tracking-tighter">مَتْجَر</h1>
//           <nav className="hidden md:flex items-center gap-6">
//             {['الرئيسية', 'الأقسام', 'عروض', 'من نحن'].map((item, idx) => (
//               <motion.a
//                 key={idx}
//                 href="#"
//                 whileHover={{ scale: 1.05 }}
//                 className="text-sm font-bold text-neutral-400 hover:text-orange-500 transition-colors uppercase tracking-wider"
//               >
//                 {item}
//               </motion.a>
//             ))}
//           </nav>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="p-2 text-neutral-400 hover:text-white transition-colors">
//             <FaSearch className="text-xl" />
//           </button>
//           <button className="p-2 text-neutral-400 hover:text-white transition-colors">
//             <FaUser className="text-xl" />
//           </button>
//           <button className="p-2 text-neutral-400 hover:text-white transition-colors relative">
//             <FaShoppingBag className="text-xl" />
//             <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] font-bold flex items-center justify-center">
//               0
//             </span>
//           </button>
//         </div>
//       </motion.header>

//       {/* Hero Section - Featured Category */}
//       {featuredCategory && (
//         <motion.section
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="relative z-10 px-6 sm:px-12 py-16 sm:py-24"
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Content Side */}
//             <div className="space-y-8">
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <div className="inline-flex items-center gap-2 mb-6">
//                   <ColoredCards
//                     number={featuredCategory.id}
//                     text={featuredCategory.name}
//                   />
//                 </div>

//                 <h2 className="text-5xl sm:text-7xl font-black leading-tight mb-6">
//                   اكتشف{' '}
//                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
//                     {featuredCategory.name}
//                   </span>
//                 </h2>

//                 <p className="text-neutral-400 text-lg leading-relaxed max-w-lg">
//                   مجموعة حصرية من المنتجات المختارة بعناية. جودة استثنائية
//                   وتصاميم عصرية تناسب ذوقك الرفيع.
//                 </p>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="flex flex-wrap gap-4"
//               >
//                 <button
//                   onClick={() => handleCategoryClick(featuredCategory)}
//                   className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black uppercase tracking-wider overflow-hidden transition-all hover:scale-105"
//                 >
//                   <span className="relative z-10 flex items-center gap-3">
//                     تسوق الآن
//                     <FaArrowRight className="transform group-hover:-translate-x-1 transition-transform" />
//                   </span>
//                   <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </button>

//                 <button className="px-8 py-4 border-2 border-neutral-700 hover:border-orange-500 text-white font-bold uppercase tracking-wider transition-all hover:scale-105">
//                   المزيد من التفاصيل
//                 </button>
//               </motion.div>

//               {/* Stats */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//                 className="flex gap-8 pt-8 border-t border-neutral-800"
//               >
//                 <div>
//                   <div className="text-3xl font-black text-orange-500">
//                     {productsByCategory[featuredCategory.id]?.length || 0}
//                   </div>
//                   <div className="text-sm text-neutral-500 font-bold uppercase tracking-wider">
//                     منتج
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-black text-amber-500">+50</div>
//                   <div className="text-sm text-neutral-500 font-bold uppercase tracking-wider">
//                     علامة تجارية
//                   </div>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Image Side - Product Grid Preview */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.3, duration: 0.8 }}
//               className="relative"
//             >
//               <div className="grid grid-cols-2 gap-4">
//                 {productsByCategory[featuredCategory.id]
//                   ?.slice(0, 4)
//                   .map((item, idx) => (
//                     <motion.div
//                       key={item.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.5 + idx * 0.1 }}
//                       onClick={() => handleCategoryClick(featuredCategory)}
//                       className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer group ${
//                         idx === 0 ? 'col-span-2 row-span-2' : ''
//                       }`}
//                     >
//                       <Image
//                         src={item.image1 || '/placeholder.jpg'}
//                         alt={item.title}
//                         fill
//                         className="object-cover transition-transform duration-700 group-hover:scale-110"
//                         sizes="(max-width: 768px) 50vw, 33vw"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                       <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
//                         <p className="text-white font-bold text-sm">
//                           {item.title}
//                         </p>
//                         <p className="text-orange-500 font-black text-lg">
//                           {item.basePrice?.toLocaleString()} ر.س
//                         </p>
//                       </div>
//                     </motion.div>
//                   ))}
//               </div>
//             </motion.div>
//           </div>
//         </motion.section>
//       )}

//       {/* Other Categories - Horizontal Scroll */}
//       <section className="relative z-10 px-6 sm:px-12 py-16">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mb-8"
//         >
//           <h3 className="text-3xl font-black uppercase tracking-tight mb-2">
//             الأقسام الأخرى
//           </h3>
//           <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {otherCategories.map((category, idx) => (
//             <motion.div
//               key={category.id}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: idx * 0.1 }}
//               onClick={() => handleCategoryClick(category)}
//               className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border-2 border-neutral-800 hover:border-orange-500 transition-all duration-500"
//             >
//               {/* Background Gradient */}
//               <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-neutral-900 group-hover:from-orange-600/40 transition-all duration-500" />

//               {/* Category Image or Pattern */}
//               <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
//                 {productsByCategory[category.id]?.[0] && (
//                   <Image
//                     src={
//                       productsByCategory[category.id][0].image1 ||
//                       '/placeholder.jpg'
//                     }
//                     alt={category.name}
//                     fill
//                     className="object-cover"
//                   />
//                 )}
//               </div>

//               {/* Content */}
//               <div className="absolute inset-0 p-8 flex flex-col justify-end">
//                 <div className="mb-4">
//                   <ColoredCards number={category.id} text={category.name} />
//                 </div>
//                 <h4 className="text-3xl font-black mb-2 group-hover:translate-x-2 transition-transform">
//                   {category.name}
//                 </h4>
//                 <p className="text-neutral-400 text-sm mb-4">
//                   {productsByCategory[category.id]?.length || 0} منتج متاح
//                 </p>
//                 <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
//                   استكشف الآن
//                   <FaArrowRight />
//                 </div>
//               </div>

//               {/* Hover Border Effect */}
//               <div className="absolute inset-0 border-2 border-orange-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* All Products Grid */}
//       <section className="relative z-10 px-6 sm:px-12 py-16">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mb-12 flex items-center justify-between"
//         >
//           <div>
//             <h3 className="text-4xl font-black uppercase tracking-tight mb-2">
//               جميع المنتجات
//             </h3>
//             <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
//           </div>
//           <button className="hidden sm:flex items-center gap-2 text-neutral-400 hover:text-orange-500 font-bold uppercase tracking-wider transition-colors">
//             عرض الكل
//             <FaArrowRight />
//           </button>
//         </motion.div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {activeCategories.flatMap((category) =>
//             productsByCategory[category.id]?.slice(0, 2).map((item) => (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true, margin: '-50px' }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <SmallCard item={item} category={category} />
//               </motion.div>
//             )),
//           )}
//         </div>
//       </section>

//       {/* Footer */}
//       <div className="relative z-10 border-t border-neutral-800 mt-20">
//         <Footer />
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FaShoppingBag,
//   FaSearch,
//   FaUser,
//   FaArrowRight,
//   FaThLarge,
// } from 'react-icons/fa';
// import Footer from '../components/ReusableComponents/Footer';
// import Loading from '../components/ReusableComponents/Loading';
// import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
// import ColoredCards from '../components/ReusableComponents/ColoredCards';
// import categories from '../components/Categories/categories';
// import Image from 'next/image';

// const OPTIMAL_BATCH_SIZE = 20;

// const safeStringify = (obj) => {
//   if (!obj) return '{}';
//   try {
//     const safeObj = {
//       id: obj.id,
//       name: obj.name,
//       slug: obj.slug,
//       categoryName: obj.categoryName,
//     };
//     return JSON.stringify(safeObj);
//   } catch (error) {
//     console.error('Error stringifying category:', error);
//     return '{}';
//   }
// };

// export default function Home() {
//   const [productsByCategory, setProductsByCategory] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const router = useRouter();

//   const fetchProductsByCategory = useCallback(async () => {
//     setLoading(true);
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
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProductsByCategory();
//   }, [fetchProductsByCategory]);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
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

//   const activeCategories = categories.filter(
//     (category) => productsByCategory[category.id]?.length > 0,
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-950 via-neutral-950 to-orange-950 flex items-center justify-center">
//         <Loading fullPage />
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-neutral-950 text-white overflow-x-hidden mt-96"
//       dir="rtl"
//     >
//       {/* Animated Background Gradient */}
//       <div className="fixed inset-0 z-0">
//         <div
//           className="absolute w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[120px] transition-all duration-700 ease-out"
//           style={{
//             left: mousePosition.x - 400,
//             top: mousePosition.y - 400,
//           }}
//         />
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[100px]" />
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-700/10 rounded-full blur-[100px]" />
//       </div>

//       {/* Vertical Text Decoration */}
//       <div className="fixed right-8 top-1/2 -translate-y-1/2 z-0 hidden xl:block pointer-events-none select-none">
//         <h1 className="text-[12rem] font-black text-neutral-800/20 writing-vertical-rl tracking-tighter leading-none">
//           MATJAR
//         </h1>
//       </div>

//       {/* Header Navigation */}
//       <motion.header
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative z-50 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-neutral-800/50 backdrop-blur-xl"
//       >
//         <div className="flex items-center gap-8">
//           <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
//             مَتْجَر
//           </h1>
//           <nav className="hidden md:flex items-center gap-6">
//             {['الرئيسية', 'الأقسام', 'عروض', 'من نحن'].map((item, idx) => (
//               <motion.a
//                 key={idx}
//                 href="#"
//                 whileHover={{ scale: 1.05 }}
//                 className="text-sm font-bold text-neutral-400 hover:text-orange-500 transition-colors uppercase tracking-wider"
//               >
//                 {item}
//               </motion.a>
//             ))}
//           </nav>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="p-2 text-neutral-400 hover:text-white transition-colors">
//             <FaSearch className="text-xl" />
//           </button>
//           <button className="p-2 text-neutral-400 hover:text-white transition-colors">
//             <FaUser className="text-xl" />
//           </button>
//           <button className="p-2 text-neutral-400 hover:text-white transition-colors relative">
//             <FaShoppingBag className="text-xl" />
//             <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] font-bold flex items-center justify-center">
//               0
//             </span>
//           </button>
//         </div>
//       </motion.header>

//       {/* Main Categories Grid - كل الأقسام مع ColoredCards */}
//       <main className="relative z-10 px-6 sm:px-12 py-16 space-y-24">
//         {/* عرض جميع الأقسام في شبكة */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {activeCategories.map((category, idx) => (
//             <motion.div
//               key={category.id}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, margin: '-50px' }}
//               transition={{ delay: idx * 0.1, duration: 0.6 }}
//               className="group relative"
//             >
//               <div
//                 onClick={() => handleCategoryClick(category)}
//                 className="relative h-full min-h-[400px] rounded-3xl overflow-hidden cursor-pointer border-2 border-neutral-800 hover:border-orange-500 transition-all duration-500 bg-neutral-900/50 backdrop-blur-sm"
//               >
//                 {/* Background Image أو Gradient */}
//                 <div className="absolute inset-0">
//                   {productsByCategory[category.id]?.[0]?.image1 ? (
//                     <Image
//                       src={productsByCategory[category.id][0].image1}
//                       alt={category.name}
//                       fill
//                       className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-neutral-900 to-amber-600/20" />
//                   )}
//                   <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
//                 </div>

//                 {/* Content */}
//                 <div className="relative z-10 h-full flex flex-col justify-between p-8">
//                   {/* Top: ColoredCards + Stats */}
//                   <div className="flex items-start justify-between">
//                     <ColoredCards number={category.id} text={category.name} />

//                     <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/80 backdrop-blur-md rounded-full border border-neutral-700">
//                       <FaThLarge className="text-orange-500" />
//                       <span className="text-white font-bold">
//                         {productsByCategory[category.id]?.length || 0}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Middle: Category Name */}
//                   <div className="space-y-4">
//                     <h2 className="text-4xl sm:text-5xl font-black leading-tight group-hover:text-orange-500 transition-colors">
//                       {category.name}
//                     </h2>

//                     {/* Preview Products */}
//                     <div className="flex gap-3">
//                       {productsByCategory[category.id]
//                         ?.slice(0, 3)
//                         .map((item, i) => (
//                           <div
//                             key={i}
//                             className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-700 group-hover:border-orange-500/50 transition-colors"
//                           >
//                             {item.image1 && (
//                               <Image
//                                 src={item.image1}
//                                 alt={item.title}
//                                 width={80}
//                                 height={80}
//                                 className="w-full h-full object-cover"
//                               />
//                             )}
//                           </div>
//                         ))}
//                       {productsByCategory[category.id]?.length > 3 && (
//                         <div className="w-20 h-20 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
//                           <span className="text-neutral-400 font-bold text-xs">
//                             +{productsByCategory[category.id].length - 3}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Bottom: CTA Button */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3 text-orange-500 font-bold uppercase tracking-wider group-hover:gap-4 transition-all">
//                       استكشف القسم
//                       <FaArrowRight className="transform group-hover:-translate-x-1 transition-transform" />
//                     </div>

//                     <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
//                       <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">
//                         تصفح الآن
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Hover Effect Border */}
//                 <div className="absolute inset-0 rounded-3xl border-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Featured Products Section */}
//         {activeCategories.length > 0 && (
//           <motion.section
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="pt-12 border-t-2 border-neutral-800"
//           >
//             <div className="flex items-center justify-between mb-12">
//               <div>
//                 <h3 className="text-4xl font-black uppercase tracking-tight mb-2">
//                   أحدث المنتجات
//                 </h3>
//                 <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
//               </div>

//               <button className="hidden sm:flex items-center gap-2 text-neutral-400 hover:text-orange-500 font-bold uppercase tracking-wider transition-colors">
//                 عرض الكل
//                 <FaArrowRight />
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {activeCategories.flatMap((category) =>
//                 productsByCategory[category.id]?.slice(0, 2).map((item) => (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     viewport={{ once: true, margin: '-50px' }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     <SmallCard item={item} category={category} />
//                   </motion.div>
//                 )),
//               )}
//             </div>

//             <div className="mt-12 text-center sm:hidden">
//               <button className="px-8 py-4 bg-neutral-900 border-2 border-neutral-800 hover:border-orange-500 text-white font-bold uppercase tracking-wider transition-all">
//                 عرض جميع المنتجات
//               </button>
//             </div>
//           </motion.section>
//         )}
//       </main>

//       {/* Footer */}
//       <div className="relative z-10 border-t border-neutral-800 mt-20">
//         <Footer />
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaCheck,
  FaTint,
  FaGem,
  FaCogs,
  FaClock,
  FaTag,
} from 'react-icons/fa';
import Footer from '../components/ReusableComponents/Footer';
import SmallCard from '../components/ReusableComponents/SmallCard/SmallCard';
import ColoredCards from '../components/ReusableComponents/ColoredCards';
import categories from '../components/Categories/categories';
import Image from 'next/image';
import DemoProductCard from '../components/Store/DemoProductCard';
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

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const router = useRouter();
  const { cartCount } = useCommerce();

  const fetchProductsByCategory = useCallback(async () => {
    try {
      const batches = [];
      for (let i = 0; i < categories.length; i += OPTIMAL_BATCH_SIZE) {
        batches.push(categories.slice(i, i + OPTIMAL_BATCH_SIZE));
      }

      for (const batch of batches) {
        try {
          const categoryIds = batch.map((c) => c.id).join(',');
          const response = await fetch(
            `/api/categories/bulk?categories=${categoryIds}`,
            {
              next: { revalidate: 3600 },
            },
          );

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const { data } = await response.json();
          setProductsByCategory((prev) => ({ ...prev, ...data }));
        } catch (error) {
          console.error('خطأ في جلب دفعة الفئات:', error);
        }
      }
    } catch (error) {
      console.error('خطأ عام في جلب البيانات:', error);
    }
  }, []);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

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

  return (
    <div
      className="min-h-screen mt-64 bg-neutral-950 text-white overflow-x-hidden"
      dir="rtl"
    >
      {/* ==================== HEADER ==================== */}
      <header className="relative z-50 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black tracking-tighter">
            مَتْجَر<span className="text-orange-500">.</span>
          </h1>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { title: 'الرئيسية', href: '/' },
              { title: 'المنتجات التجريبية', href: '#demo-products' },
              { title: 'الأقسام', href: '#categories' },
              { title: 'المنتجات', href: '#featured-products' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-bold text-neutral-400 hover:text-orange-500 transition-colors uppercase tracking-[0.2em]"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="البحث"
            className="p-2.5 text-neutral-400 hover:text-white transition-colors border border-neutral-800 hover:border-orange-500 rounded-sm"
          >
            <FaSearch className="text-sm" />
          </Link>
          <Link
            href="/profile"
            aria-label="الملف الشخصي"
            className="p-2.5 text-neutral-400 hover:text-white transition-colors border border-neutral-800 hover:border-orange-500 rounded-sm"
          >
            <FaUser className="text-sm" />
          </Link>
          <Link
            href="/cart"
            aria-label={`سلة التسوق، ${cartCount} منتج`}
            className="p-2.5 text-neutral-400 hover:text-white transition-colors border border-neutral-800 hover:border-orange-500 rounded-sm relative"
          >
            <FaShoppingBag className="text-sm" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-[9px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex">
        {/* الشريط البرتقالي العمودي (مستوحى من الصورة) */}
        <div className="hidden lg:flex absolute left-0 top-0 bottom-0 w-24 bg-orange-500 flex-col items-center justify-between py-12 z-20">
          {/* Barcode زخرفي في الأعلى */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-[2px]">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="bg-black"
                  style={{
                    width: i % 3 === 0 ? '3px' : '1px',
                    height: `${20 + (i % 5) * 3}px`,
                  }}
                />
              ))}
            </div>
            <span className="text-[8px] font-black text-black tracking-widest mt-2">
              NO.2026
            </span>
          </div>

          {/* نص عمودي ضخم */}
          <h2 className="text-[10rem] font-black text-black leading-none tracking-tighter writing-vertical-rl rotate-180">
            MATJAR
          </h2>

          {/* QR Code زخرفي في الأسفل */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-white p-1">
              <div className="w-full h-full bg-black grid grid-cols-5 grid-rows-5 gap-[1px]">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className={`${(i * 7 + 3) % 11 > 5 ? 'bg-black' : 'bg-white'}`}
                  />
                ))}
              </div>
            </div>
            <span className="text-[8px] font-black text-black tracking-widest">
              SCAN ME
            </span>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col lg:flex-row px-6 sm:px-12 lg:pr-12 py-12 lg:py-20 gap-12">
          {/* الجانب الأيمن: النص */}
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {/* ColoredCards للقسم المميز */}
            {activeCategories[0] && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ColoredCards
                  number={activeCategories[0].id}
                  text={activeCategories[0].name}
                />
              </motion.div>
            )}

            {/* العنوان الضخم */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl sm:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter"
            >
              تسوّق
              <br />
              <span className="text-orange-500">بأسلوب</span>
              <br />
              مختلف
            </motion.h1>

            {/* الوصف */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-neutral-400 text-lg max-w-md leading-relaxed"
            >
              مجموعة حصرية من المنتجات المختارة بعناية. جودة استثنائية وتصاميم
              عصرية تناسب ذوقك الرفيع.
            </motion.p>

            {/* صناديق المواصفات (مستوحاة من الصورة) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4 max-w-md"
            >
              {/* صندوق 1 */}
              <div className="border border-orange-500/50 p-4 relative group hover:border-orange-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    الأقسام
                  </span>
                  <FaTag className="text-orange-500" />
                </div>
                <div className="text-3xl font-black">
                  {activeCategoryCount}
                </div>
                <div className="text-xs text-neutral-500 mt-1">قسم نشط</div>
              </div>

              {/* صندوق 2 */}
              <div className="border border-orange-500/50 p-4 relative group hover:border-orange-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    المنتجات
                  </span>
                  <FaCheck className="text-orange-500" />
                </div>
                <div className="text-3xl font-black">
                  {productCount}
                </div>
                <div className="text-xs text-neutral-500 mt-1">منتج متاح</div>
              </div>

              {/* صندوق 3 */}
              <div className="border border-orange-500/50 p-4 relative group hover:border-orange-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    الجودة
                  </span>
                  <FaGem className="text-orange-500" />
                </div>
                <div className="text-3xl font-black">A+</div>
                <div className="text-xs text-neutral-500 mt-1">ضمان الجودة</div>
              </div>

              {/* صندوق 4 */}
              <div className="border border-orange-500/50 p-4 relative group hover:border-orange-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    الشحن
                  </span>
                  <FaClock className="text-orange-500" />
                </div>
                <div className="text-3xl font-black">24h</div>
                <div className="text-xs text-neutral-500 mt-1">توصيل سريع</div>
              </div>
            </motion.div>

            {/* زر CTA */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => {
                if (activeCategories[0]) {
                  handleCategoryClick(activeCategories[0]);
                }
              }}
              className="group flex items-center gap-4 bg-orange-500 hover:bg-orange-600 text-black font-black px-8 py-4 uppercase tracking-wider transition-all self-start"
            >
              <span>ابدأ التسوق</span>
              <FaArrowRight className="transform group-hover:-translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* الجانب الأيسر: صورة المنتج المميز */}
          <div className="flex-1 relative flex items-center justify-center">
            {activeCategories[0] &&
              productsByCategory[activeCategories[0].id]?.[0] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative w-full max-w-lg aspect-square"
                >
                  {/* خلفية صخرية/نسيجية */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black rounded-3xl overflow-hidden">
                    <Image
                      src={
                        productsByCategory[activeCategories[0].id][0].image1 ||
                        '/placeholder.jpg'
                      }
                      alt={activeCategories[0].name}
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </div>

                  {/* بطاقة معلومات المنتج */}
                  <div className="absolute bottom-6 right-6 left-6 bg-black/80 backdrop-blur-md border border-orange-500/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">
                        {activeCategories[0].name}
                      </span>
                      <span className="text-xs text-neutral-400">
                        ID: {productsByCategory[activeCategories[0].id][0].id}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mb-1">
                      {productsByCategory[activeCategories[0].id][0].title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-orange-500">
                        {productsByCategory[
                          activeCategories[0].id
                        ][0].basePrice?.toLocaleString()}{' '}
                        ر.س
                      </span>
                      <button
                        onClick={() => handleCategoryClick(activeCategories[0])}
                        className="text-xs font-bold text-white hover:text-orange-500 uppercase tracking-wider"
                      >
                        عرض الكل →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
          </div>
        </div>
      </section>

      <section
        id="demo-products"
        className="relative px-6 py-16 sm:px-12 border-t border-neutral-800"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold text-orange-400">
              تجربة تفاعلية
            </p>
            <h2 className="text-4xl font-black tracking-tight">
              منتجات تجريبية
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-neutral-400">
            بيانات وصور محلية لاختبار الإعجاب والسلة وإتمام الطلب دون تحصيل أي
            مبالغ.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {demoProducts.map((product) => (
            <DemoProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ==================== CATEGORIES GRID ==================== */}
      <section
        id="categories"
        className="relative px-6 sm:px-12 py-20 border-t border-neutral-800"
      >
        {/* عنوان القسم */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter mb-2">
              الأقسام
            </h2>
            <div className="w-20 h-1 bg-orange-500" />
          </div>
          <span className="text-neutral-500 text-sm font-bold uppercase tracking-widest hidden sm:block">
            {activeCategories.length} قسم متاح
          </span>
        </div>

        {/* شبكة الأقسام */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleCategoryClick(category)}
              className="group relative cursor-pointer"
            >
              <div className="relative h-96 bg-neutral-900 border-2 border-neutral-800 hover:border-orange-500 transition-all duration-500 overflow-hidden">
                {/* خلفية الصورة */}
                <div className="absolute inset-0">
                  {productsByCategory[category.id]?.[0]?.image1 ? (
                    <Image
                      src={productsByCategory[category.id][0].image1}
                      alt={category.name}
                      fill
                      className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-neutral-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* محتوى البطاقة */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  {/* الأعلى: ColoredCards + عدد المنتجات */}
                  <div className="flex items-start justify-between">
                    <ColoredCards number={category.id} text={category.name} />
                    <div className="w-12 h-12 border border-orange-500/50 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                      <span className="text-xl font-black text-orange-500">
                        {productsByCategory[category.id]?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* الأسفل: اسم القسم + زر */}
                  <div>
                    <h3 className="text-3xl font-black mb-4 group-hover:text-orange-500 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-wider text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>استكشف</span>
                      <FaArrowRight className="transform group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* تأثير الحدود عند التحويم */}
                <div className="absolute inset-0 border-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section
        id="featured-products"
        className="relative px-6 sm:px-12 py-20 border-t border-neutral-800"
      >
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter mb-2">
              منتجات مميزة
            </h2>
            <div className="w-20 h-1 bg-orange-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeCategories.flatMap((category) =>
            productsByCategory[category.id]?.slice(0, 2).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <SmallCard item={item} category={category} />
              </motion.div>
            )),
          )}
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <div className="relative border-t border-neutral-800 mt-20">
        <Footer />
      </div>
    </div>
  );
}
