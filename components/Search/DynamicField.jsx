'use client';

export default function DynamicField({ field, value, onChange, onBlur }) {
  if (!field) return null;

  const handleChange = (e) => {
    onChange(field.name, e.target.value);
  };

  const handleBlur = (e) => {
    onBlur(field.name, e.target.value);
  };

  // Render select for fields with options
  if (field.options && Object.keys(field.options).length > 0) {
    return (
      <div className="space-y-2">
        <label className="flex gap-1 block text-sm font-medium ">
          {field.icon && <span className="mr-2">{field.icon}</span>}
          {field.label}
        </label>
        <select
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">{field.placeholder || 'اختر...'}</option>
          {Object.entries(field.options).map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Render input for fields without options
  return (
    <div className="space-y-2">
      <label className="flex gap-1 block text-sm font-medium">
        {field.icon && <span className="mr-2">{field.icon}</span>}
        {field.label}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );
}
