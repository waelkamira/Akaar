'use client';
import React, { useContext, useEffect, useState } from 'react';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from './SideBarMenu';
import CitySelector from './map/CitySelector';
import PropertyTypeSelector from './PropertyTypeSelector';
import SmallItem from './SmallItem';
import Loading from './Loading';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import Link from 'next/link';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { TbHomeSearch } from 'react-icons/tb';
import Button from './Button';
import { inputsContext } from './Context';
import CustomToast from './CustomToast';
import toast from 'react-hot-toast';
import Posts from './allPosts';

export default function SearchBar({ propertyCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = useContext(inputsContext);
  const [propertyCity, setPropertyCity] = useState(data?.propertyCity || '');
  const [propertyTown, setPropertyTown] = useState(data?.propertyTown || '');
  const [propertyType, setPropertyType] = useState(data?.propertyType || '');

  useEffect(() => {
    fetchAllPosts();
  }, [pageNumber]);

  useEffect(() => {
    setPropertyCity(data?.propertyCity);
    setPropertyTown(data?.propertyTown);
    setPropertyType(data?.propertyType?.label);
  }, [data]);

  console.log(propertyCity, propertyTown, propertyType);
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?limit=5&page=${pageNumber}&propertyCategory=${propertyCategory}&propertyCity=${propertyCity}&propertyTown=${propertyTown}&propertyType=${propertyType}`
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
    <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 sm:px-16 pt-4 sm:py-8  bg-seven overflow-y-auto z-10 ">
      <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12">
        <TfiMenuAlt
          className="xl:hidden p-1 text-4xl lg:text-5xl text-one cursor-pointer z-50 animate-pulse"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full px-4 sm:px-8 bg-six text-black border-b border-black">
        <div className="relative text-center w-full md:w-1/3">
          <Button style={' '} onClick={handleSearch} title={'بحث'} />
        </div>
        <div className="flex flex-col xl:flex-row items-center justify-center gap-4 w-full px-4 sm:px-8 bg-six mt-4 text-black">
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full lg:w-3/5">
            <div className="w-full lg:w-1/3">
              <PropertyTypeSelector />
            </div>
            <CitySelector />
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full lg:w-2/5 ">
            <div className=" w-full  mb-3">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md sm:text-xl select-none">
                  <span className="text-one text-lg sm:text-xl ml-2 text-nowrap">
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
                className="w-full text-lg sm:text-xl text-start z-40 h-11 text-nowrap px-2 border border-slate-300"
              />
            </div>
            <div className=" w-full  mb-3">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md sm:text-xl select-none">
                  <span className="text-one text-lg sm:text-xl ml-2 text-nowrap">
                    <MdOutlinePriceCheck />
                  </span>
                  أعلى سعر:
                </h1>
              </div>
              <input
                type="number"
                id="maxPrice"
                placeholder="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-lg sm:text-xl text-start z-40 h-11 text-nowrap px-2 border border-slate-300"
              />
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : allPosts.length > 0 ? (
        <div className="flex flex-col justify-start w-full overflow-y-auto z-10 my-4">
          {allPosts.map((post, index) => (
            <SmallItem key={index} post={post} />
          ))}
          <div className="flex items-center justify-around sm:my-4 sm:mt-8">
            {allPosts.length >= 5 && (
              <Link href={'#post1'}>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  <h1 className="text-gray-600">الصفحة التالية</h1>
                  <MdKeyboardDoubleArrowRight className="text-2xl animate-pulse text-one" />
                </div>
              </Link>
            )}
            {pageNumber > 1 && (
              <Link href={'#post1'}>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  <MdKeyboardDoubleArrowLeft className="text-2xl animate-pulse text-one" />
                  <h1 className="text-gray-600">الصفحة السابقة</h1>
                </div>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div>
          {' '}
          <div className="flex flex-col justify-center items-center w-full h-full">
            <h1 className="text-gray-500">لا توجد بيانات لعرضها</h1>
          </div>
          <Link href={'#post1'}>
            <div
              className="flex items-center justify-center w-full cursor-pointer"
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <MdKeyboardDoubleArrowLeft className="text-2xl animate-pulse text-one" />
              <h1 className="text-gray-600">الصفحة السابقة</h1>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
