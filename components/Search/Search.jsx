'use client';
import React from 'react';
import SearchInput from './SearchInput';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import { SearchProvider } from '../../contexts/SearchContext';
export default function Search() {
  return (
    <div className="w-full z-50">
      <SearchInput />
      <SearchProvider>
        <CategoriesNavBar />
      </SearchProvider>
    </div>
  );
}
