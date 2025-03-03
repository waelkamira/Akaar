'use client';
import React, { useState, useEffect, useContext } from 'react';
import CitySelector from '../Selectors/CitySelector';
import SmallItem from '../ReusableComponents/SmallItem';
import { MdOutlinePriceCheck } from 'react-icons/md';
import Button from '../Button';
import { inputsContext } from '../Context';
import { ImSearch } from 'react-icons/im';
import CarsBrandSelector from '../Cars/CarsBrandSelector';
import CarsUsedNewSelector from '../Cars/CarsUsedNewSelector';
import FirstNavBar from '../navbars/FirstNavBar';
import CarsSideBar from '../Cars/CarsSideBar';
import NavegationPages from '../ReusableComponents/NavegationPages';
import Image from 'next/image';
import Select from 'react-select'; // استيراد react-select

export default function CategoriesProductsSearchBar({ adCategory }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [categoryAds, setCategoryAds] = useState([]);
  const { data, brand, usedNew } = useContext(inputsContext);
  const [category, setCategory] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ بيانات البحث يتم تحديثها فقط عند الضغط على "بحث"
  const [searchData, setSearchData] = useState({
    adCategory: adCategory || 'بيع',
    category: category?.id,
    city: data?.propertyCity || '',
    town: data?.propertyTown || '',
    minPrice: '',
    maxPrice: '',
    details: {},
  });
  const [selectedValues, setSelectedValues] = useState({});

  const handleChange = (name, value) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
    handleDetailsChange(name, value);
  };

  // ✅ تحديث بيانات البحث عند تغير `category` أو `adCategory`
  useEffect(() => {
    setSearchData((prev) => ({
      ...prev,
      adCategory: adCategory || 'بيع',
      category: category?.id,
      city: data?.propertyCity || '',
      town: data?.propertyTown || '',
    }));
  }, [adCategory, category, data]);

  // ✅ تحميل الفئة من `localStorage` عند التحميل فقط
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const categoryData = JSON.parse(localStorage.getItem('category'));
      console.log('categoryData', categoryData);
      setCategory(categoryData);
    }
  }, []);

  // ✅ تحميل الحقول بناءً على الفئة عند تغيير `category`
  useEffect(() => {
    if (category?.name) {
      setLoading(true);
      setError(null);

      import(`../categoryFields/${category.name}.jsx`)
        .then((module) => {
          setFields(module.default);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
          setError('فشل في تحميل الحقول');
          setLoading(false);
        });
    }
  }, [category]);

  // ✅ استدعاء البحث فقط عند الضغط على زر البحث أو تغيير `pageNumber`
  const fetchCategoryAds = async () => {
    try {
      const response = await fetch('/api/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 5, page: pageNumber, ...searchData }),
      });

      if (response.ok) {
        const json = await response.json();
        setCategoryAds(json);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setCategoryAds([]);
    }
  };

  const handleSearch = () => {
    setPageNumber(1);
    fetchCategoryAds();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: value },
    }));
  };

  function customTheme(theme) {
    return {
      ...theme,
      borderRadius: 5,
      colors: {
        ...theme.colors,
        primary: '#FF7C34',
        primary25: '#fadfae',
      },
    };
  }
  return (
    <div className="flex flex-col justify-center items-center w-full rounded-b text-black">
      <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full bg-three shadow-sm shadow-gray-300 py-2">
        <div className="relative text-center w-full xl:w-1/5 px-2">
          <ImSearch className="hidden xl:block p-1 text-3xl text-one text-center w-full" />
          <button
            className="flex justify-center items-center sm:text-lg text-sm bg-one text-white text-nowrap mt-2 h-12 select-none rounded-[5px] w-full  hover:scale-[101%]"
            onClick={handleSearch}
          >
            بحث{' '}
          </button>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          <div className="flex flex-col xl:flex-row items-center justify-center gap-2 w-full px-2 text-white">
            <CitySelector />
            <div className="relative flex items-center w-full border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
              <h1
                className={`flex justify-start items-center gap-1 text-black transition-all duration-300 text-nowrap ${
                  searchData?.minPrice
                    ? 'absolute top-0 right-0 scale-75 text-xs'
                    : 'px-2 scale-100 text-base'
                } peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base`}
              >
                <span className="text-one xl:text-xl transition-all duration-300">
                  <MdOutlinePriceCheck />
                </span>
                أدنى سعر
              </h1>
              <input
                type="number"
                name="minPrice"
                placeholder="0 $"
                value={searchData.minPrice}
                onChange={handleInputChange}
                className="w-full bg-transparent focus:outline-none h-12 px-2 pt-4 peer bg-white rounded-[5px] text-black"
              />
            </div>
            <div className="relative flex items-center w-full border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
              <h1
                className={`flex justify-start items-center gap-1 text-black transition-all duration-300 text-nowrap ${
                  searchData?.maxPrice
                    ? 'absolute top-0 right-0 scale-75 text-xs'
                    : 'px-2 scale-100 text-base'
                } peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base`}
              >
                <span className="text-one xl:text-xl transition-all duration-300">
                  <MdOutlinePriceCheck />
                </span>
                أعلى سعر
              </h1>
              <input
                type="number"
                name="maxPrice"
                placeholder="0 $"
                value={searchData.maxPrice}
                onChange={handleInputChange}
                className="w-full bg-transparent focus:outline-none h-12 px-2 pt-4 peer bg-white rounded-[5px] text-black"
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center gap-2 w-full px-2">
            {loading && <p>جاري التحميل...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading &&
              !error &&
              fields?.map((field, index) => (
                <div
                  key={index}
                  className="flex flex-col xl:flex-row justify-center items-center w-full"
                >
                  <div className="relative flex items-center w-full border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
                    {/* عنصر الإدخال */}
                    <div className="flex-grow min-w-[100px]">
                      {field?.options ? (
                        <Select
                          options={Object.entries(field?.options).map(
                            ([key, value]) => ({
                              value: value,
                              label: (
                                <div className="flex items-center gap-2">
                                  <span className="text-one">
                                    {field?.icon}
                                  </span>
                                  <span>{value}</span>
                                </div>
                              ),
                            })
                          )}
                          formatOptionLabel={(option) => option.label}
                          onChange={(selectedOption) =>
                            handleChange(field?.name, selectedOption.value)
                          }
                          placeholder={
                            <div className="flex items-center gap-2">
                              <span className="text-one">{field?.icon}</span>
                              <span>{field?.name}</span>
                            </div>
                          }
                          classNamePrefix="select"
                          theme={customTheme}
                          className="w-full bg-transparent focus:outline-none h-12 px-2"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '3rem', // ضمان تساوي الارتفاعات
                              border: 'none', // إزالة الحدود
                              boxShadow: 'none', // إزالة الظل
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isFocused
                                ? '#fadfae'
                                : 'white',
                              color: state.isFocused ? '#1a202c' : '#4a5568',
                            }),
                            menu: (provided) => ({
                              ...provided,
                              borderRadius: '5px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }),
                          }}
                        />
                      ) : (
                        <div className="relative flex items-center w-full border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
                          {/* اسم الحقل */}
                          <h1
                            className={`flex justify-start items-center gap-1 text-black transition-all duration-300 text-nowrap ${
                              selectedValues[field.name]
                                ? 'absolute top-0 right-0 scale-75 text-xs'
                                : 'px-2 scale-100 text-base'
                            } peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base`}
                          >
                            {/* الأيقونة */}
                            <span
                              className={`text-one xl:text-xl transition-all duration-300`}
                            >
                              {field?.icon}
                            </span>
                            {/* اسم الحقل */}
                            {field?.name}
                          </h1>
                          <input
                            placeholder={field?.placeholder}
                            className="w-full bg-transparent focus:outline-none h-12 px-2 pt-4 peer bg-white rounded-[5px] text-black"
                            onChange={(e) =>
                              handleChange(field?.name, e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
