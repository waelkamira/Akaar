'use client';
import React from 'react';
import SearchInput from './SearchInput';
import CategoriesNavBar from '../navbars/CategoriesNavBar';

export default function Search() {
  return (
    <div className="w-full z-50">
      <SearchInput />
      <CategoriesNavBar />
    </div>
  );
}
