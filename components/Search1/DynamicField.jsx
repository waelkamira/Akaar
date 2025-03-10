'use client';

import { useEffect } from 'react';

export default function DynamicField({ field, value, onChange }) {
  return (
    <div
      className={`relative flex items-center w-fit border rounded focus:outline-2 focus:outline-one bg-white text-nowrap text-gray-400 text-sm`}
    >
      <div className="flex-grow">
        {field?.options ? (
          <select
            onChange={(e) => onChange(field?.name, e.target.value)}
            className="w-28 bg-transparent focus:outline-none text-black h-6"
          >
            <option value="" disabled selected>
              <div className="flex items-center gap-2 text-black">
                <span className="text-one">{field?.icon}</span>
                <span>{field?.label}</span>
              </div>
            </option>
            {Object.entries(field?.options).map(([key, value]) => (
              <option key={key} value={key}>
                <div className="flex items-center gap-2 text-black">
                  <span className="text-one">{field?.icon}</span>
                  <span className="text-black">{value}</span>
                </div>
              </option>
            ))}
          </select>
        ) : (
          <div className="relative flex items-center w-fit border rounded focus:outline-2 focus:outline-one bg-white text-nowrap h-6">
            <input
              placeholder={field?.placeholder}
              className="w-28 bg-transparent focus:outline-none h-6 bg-white rounded-[5px] text-black"
              onChange={(e) => onChange(field?.name, e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
