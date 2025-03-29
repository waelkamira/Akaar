'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { SearchIcon } from 'lucide-react';

export default function SearchBar() {
  const { setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState(''); // Initial state can be empty
  const inputRef = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      setSearchQuery(inputValue);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex justify-center items-center w-full mx-auto"
    >
      <button
        type="submit"
        className=" bg-one py-1 rounded-md text-black z-50 bg-primary-500 px-2"
      >
        بحث
      </button>
      <div className="flex justify-center items-center bg-green-500">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="ابحث عن منتج..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-one"
          ref={inputRef} // Attach the ref to the input element
        />
        {/* <SearchIcon className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /> */}
      </div>
    </form>
  );
}
