'use client';

import React from 'react';

const FormTextarea = ({
  label,
  icon,
  name,
  placeholder,
  register,
  errors,
  onChange,
  required = true,
}) => {
  return (
    <div>
      <label className="font-medium mb-2 flex items-center gap-2">
        {icon} {label}
      </label>
      <textarea
        {...register(name)}
        placeholder={placeholder}
        className={`w-full p-1 sm:p-2 lg:p-3 border rounded focus:outline-2 focus:outline-primary-500 ${
          errors.includes(name) ? 'outline-2 outline-red-500' : ''
        }`}
        onChange={onChange}
        required={required}
      ></textarea>
    </div>
  );
};

export default FormTextarea;
