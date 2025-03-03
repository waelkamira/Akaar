'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { IoIosArrowBack } from 'react-icons/io';
import categories from '../lists/categories';

const Navbar = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    if (selectedOption) {
      if (typeof window !== 'undefined') {
        console.log('selectedOption', selectedOption);

        // حفظ فقط القيم القابلة للتخزين بدون React components
        const { id, name, path } = selectedOption;
        localStorage.setItem('category', JSON.stringify({ id, name, path }));
      }
      router.push(selectedOption.path);
    }
  };

  const options = categories.map((category) => ({
    id: category?.id,
    name: category.name,
    label: (
      <div className="flex items-center justify-between">
        <div className="flex justify-start items-center gap-2">
          <span className="ml-2 text-one">{category.icon}</span>
          <span>{category.name}</span>
        </div>
        <span>
          <IoIosArrowBack />
        </span>
      </div>
    ),
    path: category.path,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      borderRadius: '5px',
      // minHeight: '40px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#FF7C34',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#fadfae' : 'white',
      color: state.isFocused ? '#1a202c' : '#4a5568',
      // padding: '10px 15px',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '5px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }),
  };

  return (
    <div className="flex justify-start gap-2 items-center w-full text-white p-2">
      <h1 className="w-20 text-sm xl:text-lg">اختر الفئة</h1>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        options={options}
        placeholder=" عقارات... سيارات... هواتف..."
        isClearable
        isSearchable
        styles={customStyles}
        className="w-full  text-sm sm:text-lg text-start text-nowrap rounded-[5px] border border-gray-300 focus:outline-one "
        classNamePrefix="select"
      />
    </div>
  );
};

export default Navbar;
