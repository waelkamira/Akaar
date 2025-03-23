'use client';
import React from 'react';
import SearchInput from './SearchInput';
import Filters from './Filters';
import SearchResults from './SearchResults';
import { useSearchLogic } from './useSearchLogic';
import CategoriesNavBar from '../navbars/CategoriesNavBar';

export default function Search() {
  const {
    searchData,
    setSearchData,
    searchResults,
    isLoading,
    isSearchTriggered,
    totalCount,
    hasMore,
    pageNumber,
    setPageNumber,
    handleSearchButtonClick,
    resetFilters,
  } = useSearchLogic();

  return (
    <div className="w-full">
      <SearchInput
        searchData={searchData}
        setSearchData={setSearchData}
        onSearch={handleSearchButtonClick}
      />
      <Filters
        searchData={searchData}
        setSearchData={setSearchData}
        onSearch={handleSearchButtonClick}
        onReset={resetFilters}
      />
      <CategoriesNavBar />
      <SearchResults
        results={searchResults}
        isLoading={isLoading}
        isSearchTriggered={isSearchTriggered}
        totalCount={totalCount}
        hasMore={hasMore}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
        onReset={resetFilters}
      />
    </div>
  );
}
