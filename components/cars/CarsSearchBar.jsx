'use client';
import React, { useContext, useEffect, useState } from 'react';
import CitySelector from '../map/CitySelector';
import SmallItem from '../SmallItem';
import Loading from '../Loading';
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
import MiddleBarAndPhoto from '../middleBarAndPhoto';
import NavegationPages from '../NavegationPages';
import CarsBrandSelector from './CarsBrandSelector';
import CategoryComponent from '../CategoryComponent';
import CarsNavbar from './CarsNavbar';

export default function CarsSearchBar({ category, imgLink }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [carsAds, setCarsAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data, brand } = useContext(inputsContext);

  // State واحد لتخزين جميع بيانات البحث
  const [searchData, setSearchData] = useState({
    city: data?.city || '',
    town: data?.town || '',
    adType: category || '',
    brand: brand || '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchCarsAds();
  }, [pageNumber]);

  useEffect(() => {
    setSearchData((prevData) => ({
      ...prevData,
      city: data?.city || '',
      town: data?.town || '',
      adType: category || '',
      brand: brand || '',
    }));
  }, [data]);

  const fetchCarsAds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/Cars/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 5,
          page: pageNumber,
          ...searchData,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log('posts:', json);

        setCarsAds(json);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setCarsAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCarsAds();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center w-full rounded-b">
      <CarsNavbar />
      <div className="relative w-full h-[300px] lg:h-[600px] overflow-hidden">
        <Image
          src={imgLink}
          fill
          alt="home_photo"
          className="object-cover object-center w-full h-auto"
          objectPosition="center"
        />
      </div>
      <div className="flex flex-col w-full mt-4 rounded-[5px] flex-grow xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 pt-2 overflow-y-auto border rounded-b z-[0]">
        <MiddleBarAndPhoto
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isShow={isShow}
          setIsShow={setIsShow}
          noButton={true}
        />

        <div className="flex justify-center items-center w-full bg-gray-700/50 xl:bg-one rounded p-2 my-2">
          <button
            onClick={() => setIsShow(!isShow)}
            className="relative text-sm lg:text-xl text-one bg-white h-8 lg:h-11 w-3/4 border-r-[30%] shadow-lg border-one rounded hover:scale-[101%] transition-transform duration-200 ease-in-out"
          >
            فلاتر البحث
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
            <div className="flex flex-col-reverse sm:flex-row justify-center items-center w-full border bg-white shadow-sm shadow-gray-300 border-t-[8px] sm:border-t-[20px] border-one rounded-md ">
              <div className="relative text-center w-full md:w-1/4 px-2 xl:mb-4">
                <Button
                  style={' '}
                  onClick={handleSearch}
                  title={'بحث'}
                  emoji={<ImSearch />}
                />
              </div>
              <div className="flex flex-col xl:flex-row items-center justify-center gap-2 mb-2 w-full px-2 ">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <div className="w-full">
                    <CategoryComponent />
                  </div>
                  <div className="w-full">
                    <CarsBrandSelector />
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
                      value={searchData.minPrice}
                      onChange={handleInputChange}
                      className="w-full text-sm sm:text-lg rounded text-start z-40 h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
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
                      value={searchData.maxPrice}
                      onChange={handleInputChange}
                      className="w-full text-sm sm:text-lg rounded text-start z-40 h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <Loading />
          ) : carsAds?.length > 0 ? (
            <div className="flex flex-col justify-start w-full overflow-y-auto my-2 z-[0]">
              {carsAds?.map((post, index) => (
                <SmallItem key={index} post={post} />
              ))}
              <NavegationPages
                array={carsAds}
                setPageNumber={setPageNumber}
                pageNumber={pageNumber}
              />
            </div>
          ) : (
            <div>
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
