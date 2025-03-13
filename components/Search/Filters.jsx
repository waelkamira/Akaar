'use client';
import React, { useState, useEffect, useContext } from 'react';
import CitySelector from '../Selectors/CitySelector';
import { inputsContext } from '../authContext/Context';
import SearchControls from './SearchControls';
import PriceInput from './PriceInput';
import DynamicField from './DynamicField';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import { useSearchParams } from 'next/navigation';
import { FaArrowUp } from 'react-icons/fa6';

export default function Filters({
  searchData,
  setSearchData,
  onSearch,
  onReset,
  rerender,
}) {
  const { data } = useContext(inputsContext);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('category'); // استخراج قيمة "category"
  const id = searchParams.get('id'); // استخراج قيمة "category"
  const [showSearch, setShowSearch] = useState(false);
  const [selectedValues, setSelectedValues] = useState({});
  const [showArrow, setShowArrow] = useState(false); // حالة لإظهار السهم

  const handleChange = (name, value) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
    handleDetailsChange(name, value);
  };

  useEffect(() => {
    // console.log('تم اعادة الريندر من فلترز');
    setSearchData((prev) => ({
      ...prev,
      category: id,
      city: data?.propertyCity || '',
      town: data?.propertyTown || '',
    }));
  }, [category, data, rerender]);

  // جلب الحقول حسب اسم الفئة
  useEffect(() => {
    // console.log('تم اعادة الريندر من فلترز2 ');

    if (category) {
      setLoading(true);
      setError(null);

      import(`../categoryFields/${category}.jsx`)
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
  }, [category, rerender]);

  useEffect(() => {
    setShowArrow(true);
  }, [rerender]);

  // إخفاء السهم بعد 5 ثوانٍ
  setTimeout(() => {
    setShowArrow(false);
  }, 10000);
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

  return (
    <div className="flex items-start justify-start gap-2 text-white overflow-x-scroll overflow-visible w-full flex-nowrap bg-three px-2 ">
      <div className="flex justify-end items-start gap-2">
        <SearchControls
          onSearch={onSearch}
          onReset={onReset}
          searchData={searchData}
        />
        <div className="relative flex-2 items-center gap-2 justify-center w-full">
          <CategoriesNavBar />
          {showArrow && (
            <FaArrowUp className="animate-pulse mt-2 text-center w-full text-one" />
          )}
        </div>
        <CitySelector />
      </div>

      <div className="flex justify-end items-start gap-2">
        {loading && <p>جاري التحميل...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading &&
          !error &&
          fields?.map((field, index) => (
            <DynamicField
              key={index}
              field={field}
              value={selectedValues[field.name]}
              onChange={handleChange}
            />
          ))}
      </div>

      <PriceInput
        label="أدنى سعر"
        name="minPrice"
        value={searchData.minPrice}
        onChange={handleInputChange}
      />
      <PriceInput
        label="أعلى سعر"
        name="maxPrice"
        value={searchData.maxPrice}
        onChange={handleInputChange}
      />
    </div>
  );
}
