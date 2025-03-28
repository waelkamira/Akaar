'use client';

export default function DynamicField({ field, value, onChange }) {
  return (
    <div className="relative w-full sm:w-28 h-9 sm:h-[27px] bg-white rounded text-black">
      {field?.options ? (
        <select
          onChange={(e) => onChange(field?.name, e.target.value)}
          className="w-full sm:w-28 bg-transparent focus:outline-none text-black h-9 sm:h-6 text-sm px-2 sm:p-0 border sm:border-none"
        >
          <option value="" disabled selected className="text-sm">
            <div className="flex items-center gap-2 text-black">
              <span className="text-primary-500">{field?.icon}</span>
              <span className="text-sm">{field?.label}</span>
            </div>
          </option>
          {Object.entries(field?.options).map(([key, value]) => (
            <option key={key} value={key} className="text-sm">
              <div className="flex items-center gap-2 text-black text-sm">
                <span className="text-primary-500">{field?.icon}</span>
                <span className="text-black text-sm">{value}</span>
              </div>
            </option>
          ))}
        </select>
      ) : (
        <div className="relative flex items-center w-full border rounded focus:outline-2 focus:outline-primary-500 text-sm bg-white text-nowrap h-9 sm:h-6 px-2 sm:p-0">
          <input
            placeholder={field?.placeholder}
            className="w-full sm:w-28 bg-transparent focus:outline-none h-9 sm:h-6 bg-white rounded-[5px] text-black"
            onChange={(e) => onChange(field?.name, e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
