'use client';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from '../../components/SideBarMenu';
import CitySelector from '../../components/map/CitySelector';
import { inputsContext } from '../../components/Context';
import PropertyTypeSelector from '../../components/PropertyTypeSelector';
import SmallItem from '../../components/SmallItem';
import Loading from '../../components/Loading';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import Link from 'next/link';
import { GiModernCity } from 'react-icons/gi';
import Button from '../../components/Button';

export default function Sell() {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { data, dispatch, newPost, deletedPost } = useContext(inputsContext);
  console.log('propertyType', data?.propertyType?.value);
  const [filters, setFilters] = useState({
    propertyCategory: 'بيع',
    propertyCity: data?.propertyCity,
    propertyTown: data?.propertyTown,
    propertyType: data?.propertyType?.value,
    minPrice: '',
    maxPrice: '',
  });

  const [pageNumber, setPageNumber] = useState(1);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  const handleSearch = () => {
    const updatedFilters = {
      propertyCategory: filters.propertyCategory || 'بيع',
      propertyCity: data?.propertyCity || '',
      propertyTown: data?.propertyTown || '',
      propertyType: data?.propertyType || '',
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
    };

    setFilters(updatedFilters);

    // يمكنك استدعاء `fetchAllPosts` مباشرة إذا كنت تريد تحميل البيانات فورًا:
    fetchAllPosts(updatedFilters);
  };

  useEffect(() => {
    fetchAllPosts();
  }, [
    newPost,
    deletedPost,
    pageNumber,
    data,
    filters.propertyCategory,
    filters.propertyCity,
    filters.propertyTown,
    filters.propertyType,
    filters.minPrice,
    filters.maxPrice,
  ]);

  async function fetchAllPosts(updatedFilters = filters) {
    try {
      const params = new URLSearchParams({
        page: pageNumber,
        limit: 5,
        propertyCategory: updatedFilters.propertyCategory,
        propertyCity: updatedFilters.propertyCity || '',
        propertyTown: updatedFilters.propertyTown || '',
        propertyType: updatedFilters.propertyType || '',
        minPrice: updatedFilters.minPrice || '',
        maxPrice: updatedFilters.maxPrice || '',
      });

      const response = await fetch(`/api/search?${params.toString()}`);
      if (response.ok) {
        const json = await response.json();
        dispatch({ type: 'SET_POSTS', payload: json });
        setAllPosts(json);
        console.log('json', json);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 overflow-auto w-full h-full border border-five bg-four z-20">
      <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12">
        <TfiMenuAlt
          className="xl:hidden p-1 text-4xl lg:text-5xl text-one cursor-pointer z-50 animate-pulse"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      {/* <div className="relative w-full h-[300px]">
        <Image
          src="https://i.imgur.com/wHyvDAD.png"
          fill
          objectFit="cover"
          alt="home_photo"
          objectPosition="center"
        />
      </div> */}
      <div className="flex flex-col justify-center items-center gap-4 w-full px-4 p-2 sm:px-8 bg-six mt-4 text-black">
        <div className="flex flex-col xl:flex-row items-center justify-center gap-4 w-full px-4 p-2 sm:px-8 bg-six mt-4 text-black ">
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            <div className="w-full lg:w-1/3">
              <PropertyTypeSelector />
            </div>{' '}
            <CitySelector />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="mb-2 w-full">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md sm:text-xl">
                  <span className="text-one text-2xl ml-2">
                    <GiModernCity />
                  </span>
                  الحد الأدنى للسعر:
                </h1>
              </div>
              {/* <label htmlFor="minPrice">الحد الأدنى للسعر</label> */}
              <input
                type="number"
                id="minPrice"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xl sm:text-2xl text-start z-40 h-12 text-nowrap px-2 border border-slate-300"
              />
            </div>
            <div className="mb-2 w-full">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md sm:text-xl">
                  <span className="text-one text-2xl ml-2">
                    <GiModernCity />
                  </span>
                  الحد الأقصى للسعر:
                </h1>
              </div>
              {/* <label htmlFor="maxPrice">الحد الأقصى للسعر</label> */}
              <input
                type="number"
                id="maxPrice"
                placeholder="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xl sm:text-2xl text-start z-40 h-12 text-nowrap px-2 border border-slate-300"
              />
            </div>
          </div>
        </div>
        <div className="text-center w-full md:w-1/3">
          <Button style={' '} onClick={handleSearch} title={'بحث'} />
        </div>
      </div>
      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 sm:px-16 pt-4 sm:py-8  bg-seven overflow-y-auto z-10">
        {allPosts.length === 0 ? (
          <Loading />
        ) : (
          allPosts.map((post, index) => (
            <div key={index}>
              <SmallItem post={post} index={index} />
            </div>
          ))
        )}
        <div className="flex items-center justify-around sm:my-4 sm:mt-8">
          {allPosts?.length >= 5 && (
            <Link href={'#post1'}>
              <div
                className="flex items-center justify-around cursor-pointer"
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                <h1 className="text-gray-600 ">الصفحة التالية</h1>
                <MdKeyboardDoubleArrowRight className="text-2xl animate-pulse text-one" />
              </div>
            </Link>
          )}
          {pageNumber > 1 && (
            <Link href={'#post1'}>
              <div
                className="flex items-center justify-around cursor-pointer"
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                <MdKeyboardDoubleArrowLeft className="text-2xl animate-pulse text-one" />
                <h1 className="text-gray-600 ">الصفحة السابقة</h1>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
