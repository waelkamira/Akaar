'use client';
import React, { useContext, useEffect, useState } from 'react';
import CitySelector from '../map/CitySelector';
import PropertyTypeSelector from '../PropertyTypeSelector';
import SmallItem from '../ReusableComponents/SmallItem';
import Loading from '../ReusableComponents/Loading';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import Link from 'next/link';
import { MdOutlinePriceCheck } from 'react-icons/md';
import Button from '../Button';
import { inputsContext } from '../Context';
import CustomToast from '../CustomToast';
import toast from 'react-hot-toast';
import RoomsNumberSelector from '../roomsNumberSelector';
import { ImSearch } from 'react-icons/im';
import { LuArrowDownNarrowWide } from 'react-icons/lu';
import { LuArrowUpNarrowWide } from 'react-icons/lu';
import Image from 'next/image';
import MiddleBarAndPhoto from './RealEstateSideBar';
import NavegationPages from '../ReusableComponents/NavegationPages';
import RealEstarteNavbar from '../RealEstate/RealEstarteNavbar';
import RealEstateSideBar from './RealEstateSideBar';

export default function SearchBar({ propertyCategory }) {
  const [isShow, setIsShow] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = useContext(inputsContext);
  const [propertyCity, setPropertyCity] = useState(data?.propertyCity || '');
  const [propertyTown, setPropertyTown] = useState(data?.propertyTown || '');
  const [propertyType, setPropertyType] = useState(data?.propertyType || '');
  const [propertyRoomsNumber, setPropertyRoomsNumber] = useState(
    data?.propertyRoomsNumber?.label || ''
  );

  useEffect(() => {
    fetchAllPosts();
  }, [pageNumber]);

  useEffect(() => {
    setPropertyCity(data?.propertyCity);
    setPropertyTown(data?.propertyTown);
    setPropertyType(data?.propertyType?.label);
    setPropertyRoomsNumber(data?.propertyRoomsNumber?.label);
  }, [data]);

  console.log('propertyRoomsNumber', propertyRoomsNumber);

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/RealEstate/search?limit=5&page=${pageNumber}&propertyCategory=${propertyCategory}&propertyCity=${propertyCity}&propertyTown=${propertyTown}&propertyType=${propertyType}&propertyRoomsNumber=${propertyRoomsNumber}&minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
      if (response.ok) {
        const json = await response.json();
        console.log('json?.properties', json?.properties);
        if (json?.properties?.length > 0) {
          setAllPosts(json.properties);
        } else {
          toast.custom((t) => (
            <CustomToast t={t} message={'لا يوجد نتائج لعرضها'} />
          ));
          setAllPosts([]);
        }
      } else {
        console.error('Failed to fetch posts:', response.status);
        setAllPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAllPosts();
  };

  return (
    <div className="flex flex-col justify-center items-center w-full rounded-b bg-five">
      <RealEstarteNavbar />
      <RealEstateSideBar Button={true} />
      <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full bg-three shadow-sm shadow-gray-300 text-white py-4">
        <div className="relative text-center w-full xl:w-1/4 px-2">
          <ImSearch className="hidden xl:block p-1 text-3xl text-one text-center w-full" />

          <Button
            style={'border'}
            onClick={handleSearch}
            title={'بحث'}
            // emoji={<ImSearch />}
          />
        </div>
        <div className="flex flex-col xl:flex-row items-center justify-center gap-2 mb-2 w-full px-2 ">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="w-full">
              <PropertyTypeSelector />
            </div>
            <div className="w-full">
              <RoomsNumberSelector />
            </div>
          </div>
          <CitySelector />

          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
            <div className=" w-full">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md select-none text-nowrap">
                  <span className="text-one xl:text-xl ml-2">
                    <MdOutlinePriceCheck />
                  </span>
                  أدنى سعر:
                </h1>
              </div>
              <input
                type="number"
                id="minPrice"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-sm sm:text-lg rounded text-start text-black z-40 h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one"
              />
            </div>
            <div className=" w-full">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md select-none text-nowrap">
                  <span className="text-one xl:text-xl ml-2">
                    <MdOutlinePriceCheck />
                  </span>
                  أعلى سعر:
                </h1>
              </div>
              <input
                type="number"
                id="maxPrice"
                placeholder="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-sm sm:text-lg rounded text-start text-black z-40 h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full mt-4 rounded-[5px] flex-grow xl:w-[90%] 2xl:w-[60%] h-[1370px] px-2 pt-2 overflow-y-auto border rounded-b z-[0]">
        <div className="flex flex-col w-full h-[1370px] overflow-y-auto">
          {allPosts?.length > 0 ? (
            <div className="flex flex-col justify-start w-full overflow-y-auto my-2 z-[0]">
              {allPosts?.map((post, index) => (
                <SmallItem key={index} post={post} />
              ))}
              <NavegationPages
                array={allPosts}
                setPageNumber={setPageNumber}
                pageNumber={pageNumber}
              />{' '}
            </div>
          ) : (
            <div>
              {' '}
              <div className="flex flex-col justify-center items-center w-full h-full">
                <h1 className="">لا توجد بيانات لعرضها</h1>
              </div>
              <Link href={'#post1'}>
                <div
                  className="flex items-center justify-center w-full cursor-pointer"
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  <MdKeyboardDoubleArrowLeft className="text-2xl  text-one" />
                  <h1 className="">الصفحة السابقة</h1>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
