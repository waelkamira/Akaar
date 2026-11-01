// 'use client';

// import React, { useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import ImageComponent from './ImageComponent';
// import FavoriteButton from './FavoriteButton';
// import { formatDistanceToNow } from 'date-fns';
// import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';

// const SmallCard = React.memo(
//   /** @param {{ item: { id: string; createdAt?: string | Date; basePrice?: number | null; location?: string; subLocation?: string; description?: string; title?: string; stockQuantity?: number; images?: string[] }; category?: { id?: string; name?: string | null; slug?: string; categoryName?: string | null }; priority?: boolean; onFavoriteChange?: (favorited: boolean) => void }} props */
//   function SmallCard({
//     item,
//     category,
//     priority = false,
//     onFavoriteChange,
//   }) {
//   const router = useRouter();

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
//   }, []);

//   const safeStringify = (obj, isCategory = false) => {
//     if (!obj) return '{}';

//     if (isCategory) {
//       const safeCategory = {
//         id: category?.id,
//         name: category?.name,
//         slug: category?.slug,
//         categoryName: category?.categoryName,
//       };
//       return JSON.stringify(safeCategory);
//     }

//     try {
//       return JSON.stringify(obj, (key, value) => {
//         if (typeof value === 'function') return undefined;
//         if (typeof value === 'object' && value !== null) {
//           if (value.$$typeof || value.Provider || value.Consumer) {
//             return undefined;
//           }
//         }
//         return value;
//         }
//       );
//     } catch (error) {
//       console.error('Error stringifying:', error);
//       return '{}';
//     }
//   };

//   const handleClick = () => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('item', safeStringify(item));
//         localStorage.setItem('category', safeStringify(category, true));
//       }
//       router.push(`/post/${item?.id}`);
//     } catch (error) {
//       console.error('Error:', error);
//       router.push(`/post/${item?.id}`);
//     }
//   };

//   if (!item) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -6 }}
//       transition={{ duration: 0.35, ease: 'easeOut' }}
//       onClick={handleClick}
//       className="group h-full min-w-0 cursor-pointer"
//     >
//       <article className="ak-listing-card flex h-full min-w-0 flex-col overflow-hidden rounded-[1.65rem] border border-ak-line bg-ak-surface shadow-ak-card transition duration-300 group-hover:border-ak-amber/35 group-hover:shadow-ak-panel">
//           <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-ak-raised">
//             <div className="relative h-full">
//               <ImageComponent
//                 item={item}
//                 priority={priority}
//                 className="absolute inset-0 h-full w-full"
//               />
//               <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ak-ink/75 via-transparent to-ak-ink/10" />

//               <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-3">
//                 <div
//                   onClick={(event) => event.stopPropagation()}
//                   className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-ak-ink/55 shadow-lg backdrop-blur-md"
//                 >
//                   <FavoriteButton item={item} onFavoriteChange={onFavoriteChange} />
//                 </div>
//                 {category?.name && (
//                   <motion.div
//                     initial={{ opacity: 0, x: 12 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     className="flex max-w-[65%] items-center gap-2 truncate rounded-full border border-white/25 bg-ak-ink/70 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md"
//                   >
//                     <FaTag className="shrink-0 text-[10px] text-ak-honey" />
//                     <span className="truncate">{category.name}</span>
//                   </motion.div>
//                 )}
//               </div>

//               <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-3">
//                 <div className="min-w-0">
//                   <span className="block text-[10px] font-semibold text-white/70">السعر</span>
//                   <span className="mt-1 flex min-w-0 items-baseline gap-1.5 text-white">
//                     <span className="truncate text-2xl font-black leading-none tracking-tight">
//                       {item.basePrice?.toLocaleString() || '0'}
//                     </span>
//                     <span className="text-[11px] font-bold text-white/80">ل.س</span>
//                   </span>
//                 </div>
//                 {item?.createdAt && (
//                   <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-ak-ink/45 px-2.5 py-1.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
//                     <FaClock className="text-[9px] text-ak-honey" />
//                     {formatDate(item.createdAt)}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
//             <div className="flex items-start justify-between gap-3">
//               <h2 className="line-clamp-2 min-h-12 flex-1 text-base font-bold leading-6 text-white transition-colors group-hover:text-ak-honey sm:text-lg">
//                 {item?.title || 'إعلان جديد'}
//               </h2>
//               <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-ak-amber/20 bg-ak-amber/10 text-ak-honey">
//                 <FaTag className="text-xs" />
//               </span>
//             </div>

//             <div className="flex min-w-0 items-center gap-2.5 text-sm">
//               <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ak-amber/10 text-ak-amber">
//                 <FaMapMarkerAlt className="text-xs" />
//               </span>
//               <div className="min-w-0">
//                 <span className="block truncate font-semibold text-white/90">
//                   {item?.location || 'غير محدد'}
//                 </span>
//                 {item?.subLocation && (
//                   <span className="block truncate text-xs text-ak-quiet">
//                     {item.subLocation}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <p className="line-clamp-2 min-h-10 text-sm leading-6 text-ak-muted">
//               {item?.description || 'اكتشف تفاصيل هذا الإعلان والمزيد.'}
//             </p>

//             <div className="mt-auto flex items-center justify-between gap-3 border-t border-ak-line pt-3">
//               {item?.stockQuantity !== undefined ? (
//                 <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-bold text-emerald-300">
//                   <span className="size-1.5 rounded-full bg-emerald-400" />
//                   متاح ({item.stockQuantity})
//                 </div>
//               ) : (
//                 <span className="text-xs font-medium text-ak-quiet">
//                   اضغط لاكتشاف المزيد
//                 </span>
//               )}
//               <button
//                 onClick={(event) => {
//                   event.stopPropagation();
//                   handleClick();
//                 }}
//                 className="group/btn inline-flex items-center gap-2 rounded-full border border-ak-amber/25 bg-ak-amber/10 px-4 py-2.5 text-xs font-bold text-ak-honey transition-all duration-300 hover:bg-ak-brand hover:text-ak-ink active:scale-95 sm:text-sm"
//               >
//                 <span>التفاصيل</span>
//                 <FaArrowLeft className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
//               </button>
//             </div>
//           </div>
//           </article>
//     </motion.div>
//   );
// });

// export default SmallCard;
'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageComponent from './ImageComponent';
import FavoriteButton from './FavoriteButton';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';

const SmallCard = React.memo(
  /** @param {{ item: { id: string; createdAt?: string | Date; basePrice?: number | null; location?: string; subLocation?: string; description?: string; title?: string; stockQuantity?: number; images?: string[] }; category?: { id?: string; name?: string | null; slug?: string; categoryName?: string | null }; priority?: boolean; onFavoriteChange?: (favorited: boolean) => void }} props */
  function SmallCard({
    item,
    category,
    priority = false,
    onFavoriteChange,
  }) {
    const router = useRouter();

    const formatDate = useCallback((dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
    }, []);

    const safeStringify = (obj, isCategory = false) => {
      if (!obj) return '{}';

      if (isCategory) {
        const safeCategory = {
          id: category?.id,
          name: category?.name,
          slug: category?.slug,
          categoryName: category?.categoryName,
        };
        return JSON.stringify(safeCategory);
      }

      try {
        return JSON.stringify(obj, (key, value) => {
          if (typeof value === 'function') return undefined;
          if (typeof value === 'object' && value !== null) {
            if (value.$$typeof || value.Provider || value.Consumer) {
              return undefined;
            }
          }
          return value;
        });
      } catch (error) {
        console.error('Error stringifying:', error);
        return '{}';
      }
    };

    const handleClick = () => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('item', safeStringify(item));
          localStorage.setItem('category', safeStringify(category, true));
        }
        router.push(`/post/${item?.id}`);
      } catch (error) {
        console.error('Error:', error);
        router.push(`/post/${item?.id}`);
      }
    };

    if (!item) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        }}
        onClick={handleClick}
        className="group h-full min-w-0 cursor-pointer "
      >
        <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_32px_rgba(15,61,58,0.08)] transition-all duration-500 group-hover:shadow-[0_16px_48px_rgba(15,61,58,0.15)]">
          {/* Decorative accent bar */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#0F3D3A] via-[#F4B13B] to-[#E0745E] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Image Section */}
          <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#F2E6D6]">
            <div className="relative h-full">
              <ImageComponent
                item={item}
                priority={priority}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F3D3A]/80 via-[#0F3D3A]/20 to-transparent" />

              {/* Top badges */}
              <div className="absolute inset-x-4 top-4 z-20 flex items-start justify-between gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={(event) => event.stopPropagation()}
                  className="flex size-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/30"
                >
                  <FavoriteButton item={item} onFavoriteChange={onFavoriteChange} />
                </motion.div>
                
                {category?.name && (
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex max-w-[70%] items-center gap-2 truncate rounded-full border border-white/30 bg-[#0F3D3A]/80 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-xl"
                  >
                    <FaTag className="shrink-0 text-[10px] text-[#F4B13B]" />
                    <span className="truncate">{category.name}</span>
                  </motion.div>
                )}
              </div>

              {/* Bottom price & time */}
              <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-white/70 uppercase tracking-wider">السعر</span>
                  <div className="mt-1 flex min-w-0 items-baseline gap-1.5">
                    <span className="truncate text-3xl font-black leading-none text-white drop-shadow-lg">
                      {item.basePrice?.toLocaleString() || '0'}
                    </span>
                    <span className="text-xs font-bold text-[#F4B13B]">ل.س</span>
                  </div>
                </div>
                
                {item?.createdAt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-2 text-[10px] font-semibold text-white backdrop-blur-xl"
                  >
                    <FaClock className="text-[9px] text-[#F4B13B]" />
                    {formatDate(item.createdAt)}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="line-clamp-2 min-h-14 flex-1 text-lg font-bold leading-7 text-[#0F3D3A] transition-colors duration-300 group-hover:text-[#E0745E] sm:text-xl">
                {item?.title || 'إعلان جديد'}
              </h2>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#F4B13B]/30 bg-[#F4B13B]/10 text-[#F4B13B] transition-all duration-300 group-hover:border-[#F4B13B]/50 group-hover:bg-[#F4B13B]/20">
                <FaTag className="text-sm" />
              </span>
            </div>

            {/* Location */}
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E0745E]/10 text-[#E0745E]">
                <FaMapMarkerAlt className="text-sm" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block truncate font-bold text-[#0F3D3A]">
                  {item?.location || 'غير محدد'}
                </span>
                {item?.subLocation && (
                  <span className="block truncate text-xs text-[#0F3D3A]/60">
                    {item.subLocation}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="line-clamp-2 min-h-12 text-sm leading-6 text-[#0F3D3A]/70">
              {item?.description || 'اكتشف تفاصيل هذا الإعلان والمزيد.'}
            </p>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-[#0F3D3A]/10 pt-4">
              {item?.stockQuantity !== undefined ? (
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2 text-xs font-bold text-emerald-600">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  متاح ({item.stockQuantity})
                </div>
              ) : (
                <span className="text-xs font-medium text-[#0F3D3A]/50">
                  اضغط لاكتشاف المزيد
                </span>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClick();
                }}
                className="group/btn inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl sm:text-sm"
              >
                <span>التفاصيل</span>
                <FaArrowLeft className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
              </motion.button>
            </div>
          </div>

          {/* Subtle texture overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230F3D3A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </article>
      </motion.div>
    );
  }
);

export default SmallCard;