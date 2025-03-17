'use client';
import toast from 'react-hot-toast';
import { ImSearch } from 'react-icons/im';

export default function SearchControls({ onSearch, onReset, searchData }) {
  // console.log('searchData', searchData);

  return (
    <div className="flex items-center justify-center w-full gap-2 text-black">
      {/* <button
        className="flex justify-center items-center w-full sm:w-32 focus:outline-none h-9 sm:h-6 bg-one rounded-[5px] text-white"
        onClick={handleSearchClick} // استخدام الدالة الجديدة
      >
        <span>
          {' '}
          <ImSearch className=" p-1 text-xl text-center w-full " />
        </span>
        بحث
      </button> */}

      <button
        className="w-full sm:w-32 focus:outline-none h-9 sm:h-[27px] bg-one text-white rounded-[5px] border border-white hover:scale-[102%]"
        onClick={onReset}
      >
        حذف الفلاتر
      </button>
    </div>
  );
}
