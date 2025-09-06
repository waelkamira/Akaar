// 'use client';
// import React, { useEffect, useState } from 'react';
// import { FaGear } from 'react-icons/fa6';

// export default function Loading({ myMessage = 'لا يوجد نتائج لعرضها 😐' }) {
//   const [message, setMessage] = useState('');
//   const [isVisible, setIsVisible] = useState(true);
//   useEffect(() => {
//     setTimeout(() => {
//       setMessage(myMessage);
//       setIsVisible(false);
//     }, 5000);
//   }, []);
//   return (
//     <div className="flex flex-col items-center justify-center w-1/2 px-4">
//       {isVisible && (
//         <div className="flex flex-col justify-start items-center w-full h-full p-8 transition duration-300 rounded-[5px]">
//           <div className="flex flex-col justify-center items-center">
//             <FaGear className="animate-spin text-5xl mt-8 transition duration-300" />
//             <FaGear className="animate-spin text-2xl transition duration-300 mx-8 w-full" />
//           </div>
//           <div className="w-full">
//             <hr className="w-1/2 h-[10px] bg-primary-500 rounded-[5px] border-hidden  my-4 transition duration-300" />
//             <hr className="w-3/4 h-[10px] bg-primary-500 rounded-[5px] border-hidden  my-4 transition duration-300" />
//             <hr className="w-full h-[10px] bg-primary-500 rounded-[5px] border-hidden  my-4 transition duration-300" />
//           </div>
//         </div>
//       )}
//       <h1 className="sm:text-lg mt-2 p-2 text-center">
//         {message ? message : 'جاري التحميل'}
//       </h1>
//     </div>
//   );
// }
'use client';

import { motion } from 'framer-motion';

export default function Loading({ myMessage }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
        className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full"
      />
      <p className="mt-4 text-neutral-600">{myMessage || 'جاري التحميل...'}</p>
    </div>
  );
}
