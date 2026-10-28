// 'use client';
// import { FaGear } from 'react-icons/fa6';

// export default function LoadingPhoto() {
//   return (
//     <div className="flex items-center justify-center h-full ">
//       <FaGear className="animate-spin text-xl transition duration-300 text-ak-muted" />
//     </div>
//   );
// }
'use client';

import { FaGear } from 'react-icons/fa6';

export default function LoadingPhoto() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] w-full"
      dir="rtl"
    >
      {/* حاوية الحركة الرئيسية */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* 1. الحلقة الخارجية: تدور ببطء مع تدرج لوني فاخر */}
        <div
          className="absolute w-full h-full rounded-full border-[3px] border-amber-200/20 border-t-amber-500 border-r-amber-400"
          style={{ animation: 'spin 2s linear infinite' }}
        />

        {/* 2. الحلقة الوسطى: تدور في الاتجاه المعاكس لإضافة عمق بصري */}
        <div
          className="absolute w-16 h-16 rounded-full border-[3px] border-amber-500/20 border-b-amber-600 border-l-amber-500"
          style={{ animation: 'spin 1.5s linear infinite reverse' }}
        />

        {/* 3. القلب المتوهج: نبض ضوئي ناعم في المركز */}
        <div className="absolute w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

        {/* 4. أيقونة الترس (كلمسة من تصميمك الأصلي) لكن بتأثير فاخر */}
        <div
          className="absolute text-amber-600/40"
          style={{ animation: 'spin 8s linear infinite reverse' }}
        >
          <FaGear className="text-5xl" />
        </div>
      </div>

      {/* نص التحميل الأنيق */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-amber-700/80 text-sm font-bold tracking-[0.2em] uppercase animate-pulse">
          جاري التحميل
        </p>
        {/* نقاط متحركة بجانب النص */}
        <div className="flex gap-1">
          <span
            className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
