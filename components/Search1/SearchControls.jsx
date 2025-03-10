'use client';
import toast from 'react-hot-toast';
import { ImSearch } from 'react-icons/im';

export default function SearchControls({ onSearch, onReset, searchData }) {
  console.log('searchData', searchData);

  // دالة للتحقق من وجود فلتر واحد على الأقل
  const hasAtLeastOneFilter = () => {
    const { searchedKeyword, city, town, minPrice, maxPrice, details } =
      searchData;

    // التحقق من وجود قيمة في أي من الحقول
    return (
      searchedKeyword.trim() !== '' ||
      city.trim() !== '' ||
      town.trim() !== '' ||
      minPrice.trim() !== '' ||
      maxPrice.trim() !== '' ||
      Object.keys(details).length > 0
    );
  };

  // دالة البحث مع التحقق من الفلاتر
  const handleSearchClick = () => {
    if (hasAtLeastOneFilter()) {
    } else {
      toast.success('الرجاء تحديد فلتر واحد على الأقل قبل البحث.', {
        duration: 6000, // زيادة فترة ظهور الـ toast إلى 6 ثواني
      });
    }
  };

  return (
    <div className="flex items-center justify-center w-fit gap-2 text-black">
      {/* <button
        className="flex justify-center items-center w-28 focus:outline-none h-6 bg-one rounded-[5px] text-white"
        onClick={handleSearchClick} // استخدام الدالة الجديدة
      >
        <span>
          {' '}
          <ImSearch className=" p-1 text-xl text-center w-full " />
        </span>
        بحث
      </button> */}

      <button
        className="w-28 focus:outline-none h-[27px] bg-one text-white rounded-[5px] "
        onClick={onReset}
      >
        حذف الفلاتر
      </button>
    </div>
  );
}
