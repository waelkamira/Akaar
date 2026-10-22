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
  // تم تصحيح السطر أدناه لإزالة كود الـ TypeScript ليناسب ملف الـ .jsx
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="hidden fixed left-0 right-0 w-full lg:flex xl:flex-col xl:justify-start top-0 -translate-x-1/2 z-[1000] border border-white/[0.08] bg-black/50 backdrop-blur-xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)]"
    >
      <div className="w-full flex justify-between items-center px-10 h-20">
        {/* أزرار التنقل (القائمة) */}
        <nav className="flex items-center h-full">
          <ul className="flex items-center gap-2">
            {mainButtons?.map((button) => {
              const isHovered = hoveredIndex === button?.title;

              return (
                <li
                  key={button?.title}
                  className="relative px-1 py-2"
                  onMouseEnter={() => setHoveredIndex(button?.title)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    href={button?.path}
                    className="flex items-center gap-3 font-medium text-[13px] tracking-widest uppercase transition-colors duration-500 px-5 py-2.5 rounded-xl relative z-10 select-none text-neutral-400 hover:text-white"
                  >
                    {button?.icon && (
                      <span
                        className={`text-base flex items-center transition-all duration-500 ${
                          isHovered
                            ? 'text-primary-600 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] scale-110'
                            : 'text-slate-400'
                        }`}
                      >
                        {button?.icon}
                      </span>
                    )}
                    <span className="whitespace-nowrap font-light text-white tracking-wider">
                      {button?.title}
                    </span>
                  </Link>

                  {/* تأثير الخلفية الانسيابية المتحركة (Premium Fluid Capsule) */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/[0.04] to-white/[0.08] border border-white/[0.05] pointer-events-none z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
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
            className="relative flex items-center cursor-pointer group"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative h-12 w-40 flex items-center justify-end transition-all duration-500"
            >
              {/* توهج خافي خلف الشعار يظهر عند تمرير الماوس */}
              <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <Image
                src="/images/matjar.png"
                alt="luxury_logo"
                width={145}
                height={20}
                className="object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] brightness-105 group-hover:brightness-120 transition-all duration-500 bg-white "
                priority
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
