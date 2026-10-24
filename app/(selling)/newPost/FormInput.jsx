// 'use client';
// import React from 'react';

// const FormInput = ({
//   label,
//   icon,
//   name,
//   placeholder,
//   register,
//   errors,
//   onChange,
//   type = 'text',
//   required = true,
// }) => {
//   return (
//     <div>
//       <label className="font-medium mb-2 flex items-center gap-2">
//         {icon} {label}
//       </label>
//       <input
//         {...register(name)}
//         type={type}
//         placeholder={placeholder}
//         className={`w-full p-1 sm:p-2 lg:p-3 h-[32px] sm:h-[40px] xl:h-[48px] border rounded focus:outline-2 focus:outline-primary-500 ${
//           errors?.includes(name) ? 'outline-2 outline-red-500' : ''
//         }`}
//         onChange={onChange}
//         required={name === 'link' ? false : required}
//       />
//     </div>
//   );
// };

// export default FormInput;
'use client';

import React from 'react';
import { MdErrorOutline } from 'react-icons/md';

const FormInput = ({
  label,
  icon,
  name,
  placeholder,
  register,
  errors,
  onChange,
  type = 'text',
  required = true,
}) => {
  // دعم كل من مصفوفة الأخطاء (من الأب) وكائن الأخطاء (القياسي في react-hook-form)
  const hasError = Array.isArray(errors)
    ? errors.includes(name)
    : errors?.[name];

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 🏷️ التسمية (Label) */}
      <label
        htmlFor={name}
        className="text-sm font-semibold text-gray-700 flex items-center gap-2 mr-1 transition-colors duration-300"
      >
        {icon && <span className="text-orange-500 text-lg">{icon}</span>}
        {label}
        {required && name !== 'link' && (
          <span className="text-rose-500 text-xs font-bold">*</span>
        )}
      </label>

      {/* 📦 حاوية الحقل (تجمع الأيقونة وحقل الإدخال معاً) */}
      <div
        className={`relative group flex items-center w-full h-12 sm:h-14 rounded-xl border bg-white transition-all duration-300 ${
          hasError
            ? 'border-rose-300 bg-rose-50/40 focus-within:ring-4 focus-within:ring-rose-500/10'
            : 'border-gray-200 hover:border-orange-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10'
        }`}
      >
        {/* الأيقونة الداخلية */}
        {icon && (
          <div
            className={`absolute right-4 flex items-center justify-center transition-all duration-300 ${
              hasError
                ? 'text-rose-400'
                : 'text-gray-400 group-focus-within:text-orange-500 group-focus-within:scale-110'
            }`}
          >
            {icon}
          </div>
        )}

        {/* حقل الإدخال الفعلي */}
        <input
          id={name}
          {...register(name)}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          required={name === 'link' ? false : required}
          className={`w-full h-full bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none rounded-xl transition-all duration-300 ${
            icon ? 'pr-12 pl-4' : 'px-4'
          }`}
        />
      </div>

      {/* ⚠️ رسالة الخطأ الأنيقة */}
      {hasError && (
        <p className="text-rose-500 text-xs flex items-center gap-1.5 mr-1 animate-in fade-in slide-in-from-top-1 duration-300">
          <MdErrorOutline className="text-sm shrink-0" />
          <span>هذا الحقل مطلوب</span>
        </p>
      )}
    </div>
  );
};

export default FormInput;
