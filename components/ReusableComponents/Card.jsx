// 'use client';
// import Image from 'next/image';
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import LoadingPhoto from '../photos/LoadingPhoto';

// export default function Card({ cardName, path, image, text, color, emoji }) {
//   const router = useRouter();

//   // تحديد الألوان بناءً على القيمة الممررة
//   const getColors = () => {
//     switch (color) {
//       case 'green':
//         return {
//           border: 'border-[#50F999]',
//           bg: 'bg-[#50F999]',
//           btn: '#50F999',
//           hover: '#7AFFB8', // لون أفتح للأخضر
//         };
//       case 'orange':
//         return {
//           border: 'border-[#FF7C34]',
//           bg: 'bg-[#FF7C34]',
//           btn: '#FF7C34',
//           hover: '#FF9D65', // لون أفتح للبرتقالي
//         };
//       case 'purple':
//         return {
//           border: 'border-[#803084]',
//           bg: 'bg-[#803084]',
//           btn: '#803084',
//           hover: '#9D4BA1', // لون أفتح للبنفسجي
//         };
//       default: // gray
//         return {
//           border: 'border-[#666666]',
//           bg: 'bg-[#666666]',
//           btn: '#666666',
//           hover: '#858585', // لون أفتح للرمادي
//         };
//     }
//   };

//   const colors = getColors();

//   return (
//     <div
//       className={`item w-72 xl:w-80 transition-transform duration-300 ease-in-out cursor-pointer m-2 xl:m-8`}
//     >
//       <div className="layer w-full">
//         <div
//           onClick={() => router.push(path)}
//           className={`relative w-full h-[200px] lg:h-[300px] overflow-visible`}
//         >
//           {!image && <LoadingPhoto />}
//           {image && (
//             <Image
//               src={image}
//               fill
//               style={{ objectFit: 'cover' }}
//               alt={cardName}
//               priority={false}
//             />
//           )}
//         </div>

//         <div
//           className={`w-full border overflow-hidden rounded-lg ${colors.border}`}
//         >
//           <div className="flex justify-center items-center gap-2 my-2">
//             <h1 className="text-md sm:text-xl">{emoji}</h1>
//             <h1 className="text-md sm:text-lg">{cardName}</h1>
//           </div>
//           <p className="p-2 px-4 text-sm lg:text-md select-none text-center w-full">
//             {text}
//           </p>
//           <div className="px-4 mt-2">
//             <button
//               onClick={() => router.push(path)}
//               className={`relative w-full my-2 text-white rounded-lg hover:scale-[101%] text-md sm:text-lg hover:shadow-sm hover:bg-${colors.hover} p-1 lg:p-2 transition-all duration-200 ease-in-out`}
//               style={{
//                 backgroundColor: colors.bg,
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.backgroundColor = colors.hover)
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.backgroundColor = colors.btn)
//               }
//             >
//               {cardName}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import LoadingPhoto from '../photos/LoadingPhoto';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

export default function Card({ cardName, path, image, text, color = 'default', emoji }) {
  const router = useRouter();

  // قاموس الألوان الفاخرة المتناسقة مع الثيم الداكن
  const getTheme = (colorType) => {
    switch (colorType?.toLowerCase()) {
      case 'green':
        return {
          borderHover: 'group-hover:border-emerald-500/40',
          shadowHover: 'group-hover:shadow-emerald-500/15',
          iconBg: 'bg-emerald-500/10',
          iconText: 'text-emerald-400',
          btnFrom: 'from-emerald-600',
          btnTo: 'to-teal-600',
          btnHoverFrom: 'hover:from-emerald-500',
          btnHoverTo: 'hover:to-teal-500',
        };
      case 'purple':
        return {
          borderHover: 'group-hover:border-violet-500/40',
          shadowHover: 'group-hover:shadow-violet-500/15',
          iconBg: 'bg-violet-500/10',
          iconText: 'text-violet-400',
          btnFrom: 'from-violet-600',
          btnTo: 'to-fuchsia-600',
          btnHoverFrom: 'hover:from-violet-500',
          btnHoverTo: 'hover:to-fuchsia-500',
        };
      case 'orange':
        return {
          borderHover: 'group-hover:border-orange-500/40',
          shadowHover: 'group-hover:shadow-orange-500/15',
          iconBg: 'bg-orange-500/10',
          iconText: 'text-orange-400',
          btnFrom: 'from-orange-600',
          btnTo: 'to-amber-600',
          btnHoverFrom: 'hover:from-orange-500',
          btnHoverTo: 'hover:to-amber-500',
        };
      default: // fallback أنيق
        return {
          borderHover: 'group-hover:border-neutral-600',
          shadowHover: 'group-hover:shadow-neutral-500/10',
          iconBg: 'bg-neutral-500/10',
          iconText: 'text-neutral-400',
          btnFrom: 'from-neutral-700',
          btnTo: 'to-neutral-600',
          btnHoverFrom: 'hover:from-neutral-600',
          btnHoverTo: 'hover:to-neutral-500',
        };
    }
  };

  const theme = getTheme(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={() => router.push(path)}
      className={`group relative w-full max-w-sm mx-auto cursor-pointer rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 ${theme.borderHover} ${theme.shadowHover} shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
    >
      {/* ================= قسم الصورة ================= */}
      <div className="relative w-full h-52 sm:h-60 overflow-hidden">
        {!image ? (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800/50">
            <LoadingPhoto />
          </div>
        ) : (
          <>
            <Image
              src={image}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              alt={cardName}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* تدرج لوني لدمج الصورة مع المحتوى بسلاسة */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
          </>
        )}
        
        {/* شارة الأيقونة العائمة */}
        <div className={`absolute top-4 right-4 w-12 h-12 ${theme.iconBg} backdrop-blur-md rounded-2xl border border-neutral-700/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {React.cloneElement(emoji, { className: `text-2xl ${theme.iconText}` })}
        </div>
      </div>

      {/* ================= قسم المحتوى ================= */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* العنوان */}
        <h2 className="text-xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all duration-300">
          {cardName}
        </h2>
        
        {/* الوصف */}
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed line-clamp-3 min-h-[4.5rem]">
          {text}
        </p>

        {/* زر الإجراء */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // منع تكرار حدث النقر
            router.push(path);
          }}
          className={`w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r ${theme.btnFrom} ${theme.btnTo} ${theme.btnHoverFrom} ${theme.btnHoverTo} text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg group-hover:shadow-xl group/btn`}
        >
          <span>استكشف المزيد</span>
          <FaArrowLeft className="group-hover/btn:-translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </motion.div>
  );
}