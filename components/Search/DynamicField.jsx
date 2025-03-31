'use client';

export default function DynamicField({ field, value, onChange, onBlur }) {
  if (!field) return null;

  const handleChange = (e) => {
    let newValue = e.target.value;

    // Convert to number if the field type expects numeric values
    if (field.type === 'select' || field.options) {
      newValue = Number(newValue) || newValue;
    }

    onChange(field.name, newValue);

    // For select fields, trigger onBlur immediately
    if (field.options) {
      onBlur(field.name, newValue);
    }
  };

  const handleBlur = (e) => {
    let finalValue = e.target.value;

    // Convert to number if the field type expects numeric values
    if (field.type === 'select' || field.options) {
      finalValue = Number(finalValue) || finalValue;
    }

    onBlur(field.name, finalValue);
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
          value={value?.toString() || ''}
          onChange={handleChange}
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
        type={field.type || 'text'}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );
}
