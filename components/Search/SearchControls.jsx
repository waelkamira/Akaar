// components/SearchControls.js
'use client';
import { ImSearch } from 'react-icons/im';

export default function SearchControls({ onSearch, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center w-full xl:w-1/5 p-2 gap-3">
      <button
        className="flex justify-center items-center sm:text-lg text-sm bg-one text-white text-nowrap h-12 select-none rounded-[5px] w-full hover:scale-[101%]"
        onClick={onSearch}
      >
        <span>
          {' '}
          <ImSearch className="hidden xl:block p-1 text-3xl text-center w-full" />
        </span>
        بحث
      </button>

      <button
        className="flex justify-center items-center sm:text-lg text-sm bg-three border text-white text-nowrap  h-12 select-none rounded-[5px] w-full hover:scale-[101%]"
        onClick={onReset}
      >
        حذف الفلاتر
      </button>
    </div>
  );
}
