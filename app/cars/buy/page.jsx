'use client';
import SearchBar from '../../../components/RealEstate/RealEstateSearchBar';
export default function Buy() {
  return (
    <div className="flex flex-col items-center w-full rounded-b z-0">
      <SearchBar propertyCategory="بيع" />
    </div>
  );
}
