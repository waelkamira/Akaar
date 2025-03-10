'use client';
import React, { useState, useEffect, useContext } from 'react';
import CitySelector from '../Selectors/CitySelector';
import { inputsContext } from '../Context';
import SearchControls from './SearchControls';
import PriceInput from './PriceInput';
import DynamicField from './DynamicField';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import { useSearchParams } from 'next/navigation';

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

  const handleChange = (name, value) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
    handleDetailsChange(name, value);
  };

  useEffect(() => {
    setSearchData((prev) => ({
      ...prev,
      category: id,
      city: data?.propertyCity || '',
      town: data?.propertyTown || '',
    }));
  }, [category, data]);

  // جلب الحقول حسب اسم الفئة
  useEffect(() => {
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
    <div className="flex items-start justify-start gap-2 text-white overflow-x-scroll w-full flex-nowrap bg-three px-2 ">
      <div className="flex justify-end items-start gap-2">
        <SearchControls
          onSearch={onSearch}
          onReset={onReset}
          searchData={searchData}
        />
        <CategoriesNavBar />
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
