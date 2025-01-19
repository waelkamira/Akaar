'use client';
import Image from 'next/image';
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

export default function AllPosts({ propertyCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = useContext(inputsContext);
  const [propertyCity, setPropertyCity] = useState(data?.propertyCity);
  const [propertyTown, setPropertyTown] = useState(data?.propertyTown);
  const [propertyType, setPropertyType] = useState(data?.propertyType);

  // استدعاء البحث عند تغيير الصفحة فقط إذا تم الضغط على الزر
  useEffect(() => {
    fetchAllPosts();
  }, [pageNumber, data]);

  const fetchAllPosts = async () => {
    setLoading(true);

    try {
      setPropertyCity(data?.propertyCity);
      setPropertyTown(data?.propertyTown);
      setPropertyType(data?.propertyType?.label);
      const response = await fetch(
        `/api/search?limit=5&page=${pageNumber}&propertyCategory=${propertyCategory}&propertyCity=${propertyCity}&propertyTown=${propertyTown}&propertyType=${propertyType}`
      );
      if (response.ok) {
        const json = await response.json();
        setAllPosts(json);
        console.log('json', json);

        if (json.length === 0) {
          toast.custom((t) => (
            <CustomToast t={t} message={'لا يوجد نتائج لعرضها'} />
          ));
          setAllPosts([]);
          console.log('لا يوجد نتائج لعرضها');
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          }
          const interval = setInterval(() => {
            setPropertyCity('');
            setPropertyTown('');
            setPropertyType('');
            setMinPrice('');
            setMinPrice('');
            fetchAllPosts();
          }, 5000);
        } else {
          setAllPosts(json);
        }
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAllPosts(); // تشغيل البحث
  };

  return (
    <div className="flex flex-col items-center">
      {' '}
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
      <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full px-4 sm:px-8 bg-six text-black border-b border-black">
        <div className="relative text-center w-full md:w-1/3">
          <div className="flex items-center gap-2 w-full justify-start ">
            <h1 className="flex text-right text-md sm:text-lg text-nowrap">
              <span className="text-one text-2xl ml-2">
                <TbHomeSearch className="absolute top-0 bottom-0 m-auto left-16 right-0 z-50" />
              </span>
              {/* حدد خيارات البحث ثم اضغط بحث{' '} */}
            </h1>
          </div>
          <div className="w-full">
            <Button style={' '} onClick={handleSearch} title={'بحث'} />
          </div>{' '}
        </div>
        <div className="flex flex-col xl:flex-row items-center justify-center gap-4 w-full px-4 sm:px-8 bg-six mt-4 text-black ">
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full lg:w-3/5 ">
            <div className="w-full lg:w-1/3">
              <PropertyTypeSelector />
            </div>{' '}
            <CitySelector />
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full lg:w-2/5 ">
            <div className=" w-full  mb-3">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md sm:text-xl ">
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
                <h1 className="flex text-right text-md sm:text-xl ">
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
      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 sm:px-16 pt-4 sm:py-8  bg-seven overflow-y-auto z-10 ">
        <div className="flex flex-col justify-start w-full h-[1500px] overflow-y-auto z-10 my-4">
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
    </div>
  );
}
