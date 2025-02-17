import React from 'react';

export default function TextAreaField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
}) {
  return (
    <div>
      <label>{label}</label>
      <textarea
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
