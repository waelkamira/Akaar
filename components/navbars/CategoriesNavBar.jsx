'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { IoIosArrowBack } from 'react-icons/io';
import categories from '../lists/categories';

const Navbar = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // دالة لمعالجة اختيار الفئة
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption); // تحديث الحالة بالفئة المختارة
    if (selectedOption) {
      if (typeof window !== 'undefined') {
        console.log('selectedOption', selectedOption);

        // حفظ فقط القيم القابلة للتخزين بدون مكونات React
        const { id, name, path } = selectedOption;
        localStorage.setItem('category', JSON.stringify({ id, name, path }));
      }
      router.push(selectedOption.path); // توجيه المستخدم إلى المسار الخاص بالفئة المختارة
    }
  };

  // تحويل قائمة الفئات إلى خيارات مناسبة لـ react-select
  const options = categories.map((category) => ({
    id: category?.id,
    name: category.name,
    label: (
      <div className="flex items-center justify-between">
        <div className="flex justify-start items-center gap-2">
          <span className="ml-2 text-one">{category.icon}</span>{' '}
          {/* أيقونة الفئة */}
          <span>{category.name}</span> {/* اسم الفئة */}
        </div>
        <span>
          <IoIosArrowBack /> {/* أيقونة السهم */}
        </span>
      </div>
    ),
    path: category.path, // المسار المرتبط بالفئة
  }));

  // الأنماط المخصصة لـ react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#5B6069',
      borderColor: '#e2e8f0',
      borderRadius: '5px',
      minHeight: '32px', // الارتفاع الافتراضي
      height: '32px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#FF7C34',
      },
      '@media (min-width: 640px)': {
        // شاشات فوق 640px (تابلت فأعلى)
        minHeight: '40px',
        height: '40px',
      },
      '@media (min-width: 1280px)': {
        // شاشات فوق 1024px (ديسكتوب)
        minHeight: '50px',
        height: '50px',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#fadfae' : 'white', // لون الخلفية عند التركيز
      color: state.isSelected ? '#FFFFFF' : '#000', // لون النص الأبيض إذا كانت الفئة مختارة
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '5px', // تدوير زوايا القائمة المنسدلة
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // إضافة ظل للقائمة
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#99A0AC', // تغيير لون الـ placeholder إلى الأبيض
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#FFFFFF', // لون النص للأيقونة المختارة
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#99A0AC', // تغيير لون المؤشر إلى الأبيض
      '&:hover': {
        color: '#FF7C34', // تغيير لون المؤشر عند التحويم
      },
    }),
    input: (provided) => ({
      ...provided,
      color: '#FFFFFF', // لون النص عند الكتابة
      caretColor: '#FFFFFF', // تغيير لون مؤشر الكتابة إلى الأبيض
    }),
  };

  return (
    <div className="flex justify-start gap-2 items-center w-full text-white p-2 bg-one lg:bg-transparent">
      {/* عنوان اختيار الفئة */}
      <h1 className="flex justify-center items-center sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] w-[20%] lg:w-[40%] p-2">
        اختر الفئة:
      </h1>

      {/* قائمة منسدلة لاختيار الفئة */}
      <Select
        value={selectedCategory} // القيمة المحددة حاليًا
        onChange={handleCategoryChange} // دالة لمعالجة التغيير عند الاختيار
        options={options} // الخيارات المتاحة للاختيار
        placeholder=" عقارات... سيارات..." // النص الافتراضي قبل الاختيار
        isClearable // إمكانية مسح الاختيار
        isSearchable // إمكانية البحث داخل القائمة
        styles={customStyles} // الأنماط المخصصة
        className="flex-grow sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] h-[32px] sm:h-[40px] xl:h-[50px] bg-gray-700/50 backdrop-blur-lg transition-all shadow-md hover:shadow-lg"
        classNamePrefix="select" // بادئة لفئات CSS
      />
    </div>
  );
};

export default Navbar;
