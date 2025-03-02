'use client';

import React from 'react';

const FormSelect = ({
  label,
  icon,
  name,
  options,
  register,
  errors,
  onChange,
  required = true,
  placeholder,
}) => {
  return (
    <div>
      <label className="font-medium mb-2 flex items-center gap-2">
        {icon} {label}
      </label>
      <select
        {...register(name)}
        className={`w-full p-1 sm:p-2 lg:p-3 border rounded focus:outline-2 cursor-pointer focus:outline-one ${
          errors.includes(name) ? 'outline-2 outline-red-500' : ''
        }`}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="cursor-pointer"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
