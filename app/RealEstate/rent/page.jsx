'use client';
import SearchBar from '../../../components/RealEstate/RealEstateSearchBar';
export default function Sell() {
  return (
    <div className="flex flex-col items-center w-full">
      <SearchBar propertyCategory="أجار" />
    </div>
  );
}
