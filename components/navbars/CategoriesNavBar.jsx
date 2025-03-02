'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { IoIosArrowBack } from 'react-icons/io';

import {
  FaHome,
  FaCar,
  FaMobile,
  FaLaptop,
  FaCouch,
  FaTshirt,
  FaGamepad,
  FaBook,
  FaSmile,
  FaUtensils,
  FaPaw,
  FaBicycle,
  FaPlane,
  FaTools,
  FaGift,
  FaSeedling,
  FaStethoscope,
  FaChevronLeft,
} from 'react-icons/fa';

const categories = [
  { id: 1, name: 'عقارات', path: '/categories/1', icon: <FaHome /> },
  { id: 2, name: 'سيارات', path: '/categories/2', icon: <FaCar /> },
  { id: 3, name: 'هواتف', path: '/categories/3', icon: <FaMobile /> },
  { id: 4, name: 'كمبيوترات', path: '/categories/4', icon: <FaLaptop /> },
  { id: 5, name: 'إلكترونيات', path: '/categories/5', icon: <FaLaptop /> },
  { id: 6, name: 'مطبخ', path: '/categories/6', icon: <FaLaptop /> },
  { id: 7, name: 'أثاث', path: '/categories/7', icon: <FaCouch /> },
  { id: 8, name: 'موضة', path: '/categories/8', icon: <FaTshirt /> },
  { id: 9, name: 'أجهزة', path: '/categories/9', icon: <FaMobile /> },
  { id: 10, name: 'رياضة', path: '/categories/10', icon: <FaGamepad /> },
  { id: 11, name: 'ألعاب', path: '/categories/11', icon: <FaGamepad /> },
  { id: 12, name: 'كتب', path: '/categories/12', icon: <FaBook /> },
  { id: 13, name: 'جمال', path: '/categories/13', icon: <FaSmile /> },
  { id: 14, name: 'أغذية', path: '/categories/14', icon: <FaUtensils /> },
  { id: 15, name: 'أدوات', path: '/categories/15', icon: <FaPaw /> },
  { id: 16, name: 'دراجات', path: '/categories/16', icon: <FaBicycle /> },
  { id: 17, name: 'سياحة', path: '/categories/17', icon: <FaPlane /> },
  { id: 18, name: 'أدوات', path: '/categories/18', icon: <FaTools /> },
  { id: 19, name: 'هدايا', path: '/categories/19', icon: <FaGift /> },
  { id: 20, name: 'زراعة', path: '/categories/20', icon: <FaSeedling /> },
  {
    id: 21,
    name: 'أجهزة_طبية',
    path: '/categories/21',
    icon: <FaStethoscope />,
  },
];

const Navbar = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    if (selectedOption) {
      if (typeof window !== 'undefined') {
        console.log('selectedOption', selectedOption);
        localStorage.setItem('category', JSON.stringify(selectedOption?.id));
      }
      router.push(selectedOption.path);
    }
  };

  const options = categories.map((category) => ({
    id: category?.id,
    value: category.name,
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
      <h1 className="w-20 text-sm">اختر الفئة</h1>
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
