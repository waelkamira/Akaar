// 'use client';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import mainButtons from '../lists/mainButtons';
// import Image from 'next/image';

// export default function FirstNavBar() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
//       className="hidden xl:flex xl:flex-col xl:justify-start w-full overflow-hidden z-[1000] shadow-lg bg-black/20"
//     >
//       {/* شريط التنقل الرئيسي */}
//       <div className="flex justify-between items-center w-full px-4 py-2">
//         {/* الأزرار الجانبية */}
//         <ul className="flex justify-evenly gap-8 items-center h-20 w-full 2xl:w-[60%]">
//           {mainButtons?.map((button) => (
//             <li
//               key={button?.title}
//               className="relative flex justify-center w-full"
//             >
//               <Link
//                 href={button?.path}
//                 className="relative flex items-center justify-center gap-1 w-full text-white font-sans text-lg transition-all duration-300 ease-in-out group hover:scale-105"
//               >
//                 <div className="flex justify-center items-center gap-2">
//                   {/* أيقونة الزر */}
//                   <span className="text-primary text-2xl">{button?.icon}</span>

//                   {/* نص الزر */}
//                   <span className="relative text-center text-sm font-bold">
//                     {button?.title}
//                   </span>
//                 </div>
//                 {/* خط أسفل الزر - تصميم جديد */}
//                 <span className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-primary group-hover:to-transparent transition-transform duration-500">
//                   <motion.span
//                     className="absolute inset-0 bg-primary"
//                     initial={{ scaleX: 0, originX: 0.5 }}
//                     whileHover={{
//                       scaleX: 1,
//                       opacity: [0, 1, 0],
//                       originX: 0.5,
//                       transition: {
//                         duration: 0.6,
//                         ease: [0.43, 0.13, 0.23, 0.96],
//                       },
//                     }}
//                   />
//                 </span>
//               </Link>
//             </li>
//           ))}
//         </ul>

//         {/* الشعار الجانبي */}
//         <div className="flex items-center justify-center">
//           <Link href={'/'} className="relative flex justify-end cursor-pointer">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 20 }}
//               className="relative h-16 w-44 my-2"
//             >
//               <Image
//                 src="/logo.png"
//                 alt="luxury_logo"
//                 fill
//                 className="object-contain drop-shadow-xl"
//               />
//             </motion.div>
//           </Link>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import mainButtons from '../lists/mainButtons';
import Image from 'next/image';
import { useState } from 'react';

export default function FirstNavBar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="hidden xl:flex xl:flex-col xl:justify-start w-full fixed top-0 left-0 right-0 z-[1000] border-b border-white/[0.06] bg-black/40 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="max-w-[1600px] w-full mx-auto flex justify-between items-center px-8 h-20">
        {/* أزرار التنقل (القائمة) */}
        <nav className="flex items-center h-full">
          <ul className="flex items-center gap-6">
            {mainButtons?.map((button) => {
              // التحقق مما إذا كان الماوس فوق هذا الزر حالياً
              const isHovered = hoveredIndex === button?.title;

              return (
                <li
                  key={button?.title}
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(button?.title)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    href={button?.path}
                    className="flex items-center gap-2.5 text-gray-300 hover:text-white font-medium text-sm tracking-wide transition-colors duration-300 px-6 py-3 rounded-xl relative z-10"
                  >
                    {button?.icon && (
                      <span
                        className={`text-lg flex items-center transition-colors duration-300 ${
                          isHovered ? 'text-orange-500' : 'text-gray-400'
                        }`}
                      >
                        {button?.icon}
                      </span>
                    )}
                    <span className="whitespace-nowrap select-none">
                      {button?.title}
                    </span>
                  </Link>

                  {/* خلفية الإطار البرتقالي الفاخر بتصميم الواسع والمضيء */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        layoutId="nav-hover-border"
                        className="absolute inset-[-4px] rounded-xl p-[2px] overflow-hidden pointer-events-none z-0 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 28,
                        }}
                      >
                        {/* التأثير الدوّار للون البرتقالي */}
                        <div className="absolute inset-0 w-[300%] h-[300%] top-[-100%] left-[-100%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_30%,#f97316_50%,transparent_70%)]" />

                        {/* طبقة داخلية لحجب المنتصف */}
                        <div className="absolute inset-[2px] bg-[#0c0c0c] rounded-[10px]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* شعار الموقع (Logo) */}
        <div className="flex items-center justify-end">
          <Link
            href={'/'}
            className="relative flex items-center cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-12 w-40 flex items-center justify-end"
            >
              <Image
                src="/logo.png"
                alt="luxury_logo"
                fill
                className="object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                priority
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
