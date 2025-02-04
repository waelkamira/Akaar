'use client';
import React, { useContext, useEffect, useState } from 'react';
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
import Button from './Button';
import { inputsContext } from './Context';
import CustomToast from './CustomToast';
import toast from 'react-hot-toast';
import RoomsNumberSelector from './roomsNumberSelector';
import { ImSearch } from 'react-icons/im';
import { LuArrowDownNarrowWide } from 'react-icons/lu';
import { LuArrowUpNarrowWide } from 'react-icons/lu';
import Image from 'next/image';
import MiddleBarAndPhoto from './middleBarAndPhoto';

export default function SearchBar({ propertyCategory }) {
  const [isOpen, setIsOpen] = useState(false);
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
        `/api/search?limit=5&page=${pageNumber}&propertyCategory=${propertyCategory}&propertyCity=${propertyCity}&propertyTown=${propertyTown}&propertyType=${propertyType}&propertyRoomsNumber=${propertyRoomsNumber}&minPrice=${minPrice}&maxPrice=${maxPrice}`
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
    <div className="flex flex-col justify-center items-center w-full bg-gradient-to-tr from-[#494949] to-four rounded-b-[5px]">
      <div className="relative w-full h-[300px] lg:h-[400px] border-l-[18px] border-one overflow-hidden">
        <Image
          src="https://i.imgur.com/wZ0aruw.jpg"
          fill
          alt="home_photo"
          className="object-cover object-center w-full h-auto"
          objectPosition="center"
        />
      </div>
      <div className="flex flex-col w-full flex-grow xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 pt-2 overflow-y-auto rounded-b-[5px] z-[0]">
        <MiddleBarAndPhoto
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isShow={isShow}
          setIsShow={setIsShow}
          noButton={true}
        />

        <div className="flex justify-center items-center w-full bg-gray-700/50 border xl:bg-one rounded-[5px] p-2 my-2">
          {' '}
          <button
            onClick={() => setIsShow(!isShow)}
            className="relative text-sm lg:text-xl bg-white h-8 lg:h-11 w-3/4 border-r-[30%] shadow-lg border-one rounded-[5px] hover:scale-[101%]"
          >
            فلاتر البحث{' '}
            <span className="absolute left-3/4 top-1/4 mx-auto my-auto">
              {isShow ? (
                <LuArrowDownNarrowWide className="text-one sm:text-sm lg:text-xl" />
              ) : (
                <LuArrowUpNarrowWide className="text-one sm:text-sm lg:text-xl" />
              )}
            </span>
          </button>
        </div>

        <div className="flex flex-col w-full h-[1370px] overflow-y-auto">
          {isShow && (
            <div className="flex flex-col-reverse sm:flex-row justify-center items-center w-full bg-white shadow-sm shadow-gray-300 border-b-[8px] sm:border-b-[20px] border-one rounded-md text-black">
              <div className="relative text-center w-full md:w-1/4 px-2 xl:mb-4">
                <Button
                  style={' '}
                  onClick={handleSearch}
                  title={'بحث'}
                  emoji={<ImSearch className="text-one hover:text-white" />}
                />
              </div>
              <div className="flex flex-col xl:flex-row items-center justify-center gap-2 mb-2 w-full px-2 text-black">
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
                      className="w-full text-sm sm:text-lg rounded-[5px] text-start z-40 h-9 sm:h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
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
                      className="w-full text-sm sm:text-lg rounded-[5px] text-start z-40 h-9 sm:h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <Loading />
          ) : allPosts?.length > 0 ? (
            <div className="flex flex-col justify-start w-full overflow-y-auto my-2 z-[0]">
              {allPosts?.map((post, index) => (
                <SmallItem key={index} post={post} />
              ))}
              <div className="flex items-center justify-around sm:my-2">
                {allPosts?.length >= 5 && (
                  <Link href={'#post1'}>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setPageNumber(pageNumber + 1)}
                    >
                      <h1 className="text-white">الصفحة التالية</h1>
                      <MdKeyboardDoubleArrowRight className="text-2xl  text-one" />
                    </div>
                  </Link>
                )}
                {pageNumber > 1 && (
                  <Link href={'#post1'}>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setPageNumber(pageNumber - 1)}
                    >
                      <MdKeyboardDoubleArrowLeft className="text-2xl  text-one" />
                      <h1 className="text-white">الصفحة السابقة</h1>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div>
              {' '}
              <div className="flex flex-col justify-center items-center w-full h-full">
                <h1 className="text-white">لا توجد بيانات لعرضها</h1>
              </div>
              <Link href={'#post1'}>
                <div
                  className="flex items-center justify-center w-full cursor-pointer"
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  <MdKeyboardDoubleArrowLeft className="text-2xl  text-one" />
                  <h1 className="text-white">الصفحة السابقة</h1>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
