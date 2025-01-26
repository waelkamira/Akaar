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
import RoomsNumberSelector from './roomsNumberSelector';
import BackButton from './BackButton';
import { ImSearch } from 'react-icons/im';
import { LuArrowDownNarrowWide } from 'react-icons/lu';
import { LuArrowUpNarrowWide } from 'react-icons/lu';

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
    <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 sm:px-16 pt-2 overflow-y-auto z-10 ">
      <div className="relative flex justify-between items-center w-full gap-2 my-2 bg-one p-1 md:p-2 rounded-[5px]">
        <div>
          <TfiMenuAlt
            className="text-[30px] lg:text-5xl text-white cursor-pointer"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
          <div className="absolute top-14 lg:top-20 right-0 z-50">
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>
        </div>
        <button
          onClick={() => setIsShow(!isShow)}
          className="relative text-sm lg:text-xl bg-white h-8 lg:h-11 w-3/4 border-r-[30%] shadow-lg border-one z-40 rounded-[5px] hover:scale-[101%]"
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
        <BackButton />
      </div>{' '}
      <div className="flex flex-col w-full h-[1370px] overflow-y-auto z-10">
        {isShow && (
          <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full bg-white shadow-sm shadow-gray-300 border-b-[20px] border-one rounded-md text-black">
            <div className="relative text-center w-full md:w-1/4 px-2">
              <Button
                style={' '}
                onClick={handleSearch}
                title={'بحث'}
                emoji={<ImSearch className="text-one hover:text-white" />}
              />
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center gap-2 mb-2 w-full px-2 text-black">
              <div className="flex flex-col-reverse xl:flex-row gap-2 w-full xl:w-4/6">
                <div className="flex flex-col xl:flex-row gap-2 w-full ">
                  <PropertyTypeSelector />
                  <RoomsNumberSelector />
                </div>
                <CitySelector />
              </div>

              <div className="flex flex-col-reverse xl:flex-row gap-2 w-full xl:w-2/6">
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
                    className="w-full text-lg rounded-[5px] text-start z-40 h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
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
                    className="w-full text-lg rounded-[5px] text-start z-40 h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : allPosts?.length > 0 ? (
          <div className="flex flex-col justify-start w-full overflow-y-auto z-10 my-2">
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
  );
}
