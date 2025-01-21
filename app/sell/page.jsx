'use client';
import { useContext, useState } from 'react';
import AllPosts from '../../components/allPosts';
import SearchBar from '../../components/SearchBar';
import { inputsContext } from '../../components/Context';
export default function Sell() {
  const { data } = useContext(inputsContext);
  const [propertyCity, setPropertyCity] = useState(data?.propertyCity);
  const [propertyTown, setPropertyTown] = useState(data?.propertyTown);
  const [propertyType, setPropertyType] = useState(data?.propertyType);
  return (
    <div className="flex flex-col items-center w-full">
      <SearchBar propertyCategory="بيع" />
    </div>
  );
}
