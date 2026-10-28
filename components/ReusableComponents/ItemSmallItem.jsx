import React from 'react';
import FormatDate from './FormatDate';

export default function ItemSmallItem({ icon, text, value }) {
  return (
    <div className="flex justify-start items-center bg-ak-surface rounded-lg hover:shadow-lg transition-shadow duration-300 w-full h-14 sm:h-16 lg:h-20 my-2 sm:my-3 select-none p-3 sm:p-4 border border-ak-line">
      <span className="flex items-center text-primary-500 text-lg sm:text-xl mx-2 sm:mx-3">
        {icon}
      </span>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-ak-cream text-sm sm:text-base lg:text-lg">
          {text}:
        </span>
        <span className="text-ak-cream text-sm sm:text-base lg:text-lg line-clamp-1">
          {text === 'تاريخ الإعلان' ? <FormatDate dateString={value} /> : value}
        </span>
      </div>
    </div>
  );
}
