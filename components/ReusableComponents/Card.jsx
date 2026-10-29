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
//           border: 'border-[#E0926B]',
//           bg: 'bg-[#E0926B]',
//           btn: '#E0926B',
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

export default function Card({ cardName, path, image, text, emoji }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={() => router.push(path)}
      className="ak-glass group relative mx-auto w-full max-w-sm cursor-pointer overflow-hidden rounded-3xl border border-ak-line transition-all duration-500 hover:-translate-y-2 hover:border-ak-amber/40 hover:shadow-ak-panel"
    >
      {/* ================= قسم الصورة ================= */}
      <div className="relative w-full h-52 sm:h-60 overflow-hidden">
        {!image ? (
          <div className="flex h-full w-full items-center justify-center bg-ak-raised/70">
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
            <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-ak-ink/20 to-transparent" />
          </>
        )}
        
        {/* شارة الأيقونة العائمة */}
        <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-ak-amber/25 bg-ak-ink/60 shadow-ak-glow backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          {React.cloneElement(emoji, { className: 'text-2xl text-ak-honey' })}
        </div>
      </div>

      {/* ================= قسم المحتوى ================= */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* العنوان */}
        <h2 className="text-xl font-black text-white transition-all duration-300 group-hover:bg-ak-brand group-hover:bg-clip-text group-hover:text-transparent">
          {cardName}
        </h2>
        
        {/* الوصف */}
        <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed text-white sm:text-base">
          {text}
        </p>

        {/* زر الإجراء */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // منع تكرار حدث النقر
            router.push(path);
          }}
          className="group/btn mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-ak-brand px-4 py-3.5 font-bold text-ak-ink shadow-ak-glow transition-all duration-300 hover:brightness-105 group-hover:shadow-ak-panel"
        >
          <span>استكشف المزيد</span>
          <FaArrowLeft className="group-hover/btn:-translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </motion.div>
  );
}