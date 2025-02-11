'use client';

import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import MainNavbar from '../components/navbars/MainNavbar';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../components/Context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingPhoto from '../components/LoadingPhoto';
import Loading from '../components/Loading';

export default function Home() {
  const [cars, setCars] = useState();
  const [realEstate, setRealEstate] = useState();
  const router = useRouter();
  const { dispatch } = useContext(inputsContext);

  useEffect(() => {
    fetchCarsAds();
    fetchRealEstateAds();
  }, []);

  async function fetchCarsAds() {
    const response = await fetch('/api/Cars/allPosts?limit=8');
    if (response.ok) {
      const json = await response?.json();
      console.log('json', json);
      setCars(json);
    }
  }
  async function fetchRealEstateAds() {
    const response = await fetch('/api/RealEstate/allPosts?limit=8');
    if (response.ok) {
      const json = await response?.json();
      console.log('json', json);
      setRealEstate(json);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-five rounded-b">
      <MainNavbar />
      <div className="flex flex-col justify-center items-center w-full border ">
        <h1 className="w-full text-center sm:text-lg my-4">
          أحدث إعلانات العقارات
        </h1>
        {!realEstate && <Loading />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
          {realEstate?.length > 0 &&
            realEstate.map((item) => (
              <div
                className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:scale-[103%] transition-transform duration-300 ease-in-out rounded-[15px] overflow-hidden"
                key={item?.id}
                onClick={() => {
                  dispatch({ type: 'POST_ID', payload: item?.id });
                  router.push('/RealEstate/post');
                }}
              >
                <div className="relative w-full h-44">
                  {!item?.image1 && <LoadingPhoto />}
                  {item?.image1 && (
                    <Image src={item?.image1} fill alt="item_photo" />
                  )}
                </div>
                <div className="flex justify-evenly gap-2 items-center w-full my-2 text-sm sm:text-md">
                  <h1>{item?.propertyType}</h1>
                  <h1>{item?.propertyCategory}</h1>
                  <h1 className="flex justify-center items-center">
                    {item?.propertyCity}
                  </h1>
                  <h1 className="flex justify-center items-center">
                    {item?.propertyPrice}
                    <span className="text-one mx-1 select-none">$</span>
                  </h1>
                </div>
              </div>
            ))}
        </div>
        <h1
          onClick={() => router.push('/RealEstate/buy')}
          className="flex items-center justify-center w-full text-one hover:scale-105 cursor-pointer mb-16 sm:text-xl"
        >
          المزيد من العقارات{' '}
          <span>
            <MdKeyboardDoubleArrowDown />
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full border ">
        <h1 className="w-full text-center sm:text-lg my-4">
          أحدث إعلانات السيارات
        </h1>

        {!cars && <Loading />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
          {cars?.length > 0 &&
            cars.map((car) => (
              <div
                className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:scale-[103%] transition-transform duration-300 ease-in-out rounded-[15px] overflow-hidden"
                key={car?.id}
                onClick={() => {
                  dispatch({ type: 'POST_ID', payload: car?.id });
                  router.push('/Cars/post');
                }}
              >
                <div className="relative w-full h-44">
                  {!car?.image1 && <LoadingPhoto />}
                  {car?.image1 && (
                    <Image src={car?.image1} fill alt="car_photo" />
                  )}
                </div>
                <div className="flex justify-evenly gap-2 items-center w-full my-2 text-sm sm:text-md">
                  <h1>{car?.brand}</h1>
                  <h1 className="flex justify-center items-center">
                    {car?.price}
                    <span className="text-one mx-1 select-none">$</span>
                  </h1>
                  <h1 className="flex justify-center items-center">
                    {car?.city}
                  </h1>
                </div>
              </div>
            ))}
        </div>
        <h1
          onClick={() => router.push('/Cars/buy')}
          className="flex items-center justify-center w-full text-one hover:scale-105 cursor-pointer mb-16 sm:text-xl"
        >
          المزيد من السيارات{' '}
          <span>
            <MdKeyboardDoubleArrowDown />
          </span>
        </h1>
      </div>
      <Footer />
      {/* <div className="hidden lg:block relative w-full h-[300px] lg:h-[400px] border overflow-hidden">
        <Image
          src="https://i.imgur.com/1fGMLUK.png"
          fill
          alt="home_photo"
          className="object-contain object-center w-1/3 h-auto px-14"
          objectPosition="center"
        />
      </div> */}
      <h1
        className="text-one font-stratos w-full text-lg tracking-wider select-none text-center pt-8 pb-4 border uppercase"
        style={{ fontFamily: 'vanguardcf-heavy' }}
      >
        Copyright © 2025 tobirni web site. All Rights Reserved
      </h1>
    </main>
  );
}
