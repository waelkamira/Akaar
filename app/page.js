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
import HeroSlider from '../components/photos/HeroSlider';
import CarsSmallCard from '../components/Cars/CarsSmallCard';
import RealEstateSmallCard from '../components/RealEstate/RealEstateSmallCard';

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
      setCars(json);
    }
  }

  async function fetchRealEstateAds() {
    const response = await fetch('/api/RealEstate/allPosts?limit=8');
    if (response.ok) {
      const json = await response?.json();
      setRealEstate(json);
    }
  }

  const images = [
    'https://i.imgur.com/wZ0aruw.jpg',
    'https://i.imgur.com/uPsQqzu.png',
    'https://i.imgur.com/wHyvDAD.png',
    'https://i.imgur.com/Kc6Pcu1.png',
    'https://i.imgur.com/rLz58YH.jpg',
    'https://i.imgur.com/VVu5la7.png',
  ];

  return (
    <main className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-five rounded-b">
      <MainNavbar />
      <HeroSlider images={images} />

      {/* Real Estate Section */}
      <div className="flex flex-col justify-center items-center w-full border-b mt-16">
        <h1 className="w-full text-center sm:text-lg my-4 font-bold">عقارات</h1>
        {!realEstate && <Loading />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
          {realEstate?.length > 0 &&
            realEstate.map((item) => (
              <div
                key={item?.id}
                onClick={() => {
                  dispatch({ type: 'POST_ID', payload: item?.id });
                  router.push('/RealEstate/post');
                }}
                className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:scale-[103%] transition-transform duration-300 ease-in-out rounded-[10px] overflow-hidden shadow-lg hover:shadow-xl relative"
              >
                <RealEstateSmallCard item={item} />
              </div>
            ))}
        </div>
        <h1
          onClick={() => router.push('/RealEstate/buy')}
          className="flex items-center justify-center w-full text-one hover:scale-105 cursor-pointer mb-8 sm:text-xl"
        >
          المزيد من العقارات{' '}
          <span>
            <MdKeyboardDoubleArrowDown />
          </span>
        </h1>
      </div>

      {/* Cars Section */}
      <div className="flex flex-col justify-center items-center w-full ">
        <h1 className="w-full text-center sm:text-lg my-4 font-bold">سيارات</h1>
        {!cars && <Loading />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
          {cars?.length > 0 &&
            cars.map((car) => (
              <div
                key={car?.id}
                onClick={() => {
                  dispatch({ type: 'POST_ID', payload: car?.id });
                  router.push('/Cars/post');
                }}
                className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:scale-[103%] transition-transform duration-300 ease-in-out rounded-[10px] overflow-hidden shadow-lg hover:shadow-xl relative"
              >
                <CarsSmallCard item={car} />
              </div>
            ))}
        </div>
        <h1
          onClick={() => router.push('/Cars/buy')}
          className="flex items-center justify-center w-full text-one hover:scale-105 cursor-pointer mb-8 sm:text-xl"
        >
          المزيد من السيارات{' '}
          <span>
            <MdKeyboardDoubleArrowDown />
          </span>
        </h1>
      </div>

      <Footer />
      <h1 className="w-full text-sm select-none text-center pt-8 pb-4 border uppercase">
        Copyright © 2025 tobirni web site. All Rights Reserved
      </h1>
    </main>
  );
}
