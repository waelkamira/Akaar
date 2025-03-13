'use client';
import React from 'react';

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
  return (
    <div>
      <label className="font-medium mb-2 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`w-full p-1 sm:p-2 lg:p-3 h-[32px] sm:h-[40px] xl:h-[48px] border rounded focus:outline-2 focus:outline-one ${
          errors?.includes(name) ? 'outline-2 outline-red-500' : ''
        }`}
        onChange={onChange}
        required={name === 'link' ? false : required}
      />
    </div>
  );
};

export default FormInput;
