import React from 'react';

export default function InputField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
}) {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
