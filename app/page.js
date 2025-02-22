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
import { motion } from 'framer-motion';
import ColoredCards from '../components/reuseableComponents/ColoredCards';
import {
  FaBullseye,
  FaClock,
  FaComment,
  FaCommentAlt,
  FaHome,
  FaLock,
} from 'react-icons/fa';

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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center w-full h-full gap-8 border py-8 my-8"
      >
        <div
          className="hidden lg:flex justify-center items-center w-1/8 mr-10 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
          onClick={() => router.push('/RealEstate')}
        >
          <ColoredCards number="1" text="عقارات" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
          {!realEstate && <Loading />}
          {realEstate?.length > 0 &&
            realEstate.map((item) => (
              <motion.div
                key={item?.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  dispatch({ type: 'POST_ID', payload: item?.id });
                  router.push('/RealEstate/post');
                }}
                className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-[10px] overflow-hidden shadow-lg relative"
              >
                <RealEstateSmallCard item={item} />
              </motion.div>
            ))}
        </div>

        <button
          onClick={() => router.push('/RealEstate/buy')}
          className="lg:hidden flex items-center justify-center w-auto px-6 py-1 sm:py-3 bg-one text-white font-bold rounded-full hover:bg-two transition-colors duration-300 ease-in-out mb-8"
        >
          المزيد من العقارات{' '}
          <MdKeyboardDoubleArrowDown className="ml-2 text-xl" />
        </button>
      </motion.div>

      {/* Cars Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center w-full h-full gap-8 border py-8 my-8"
      >
        <div
          className="hidden lg:flex justify-center items-center w-1/8 mr-10 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
          onClick={() => router.push('/Cars')}
        >
          <ColoredCards number="2" text="سيارات" />
        </div>{' '}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-4 w-full 2xl:w-[80%] h-full p-4 mb-4">
          {!cars && <Loading />}
          {cars?.length > 0 &&
            cars.map((car) => (
              <motion.div
                key={car?.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  dispatch({ type: 'POST_ID', payload: car?.id });
                  router.push('/Cars/post');
                }}
                className="flex flex-col justify-center items-center w-full border cursor-pointer bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-[10px] overflow-hidden shadow-lg relative"
              >
                <CarsSmallCard item={car} />
              </motion.div>
            ))}
        </div>
      </motion.div>
      <button
        onClick={() => router.push('/Cars/buy')}
        className="lg:hidden flex items-center justify-center w-auto px-6 py-1 sm:py-3 bg-one text-white font-bold rounded-full hover:bg-two transition-colors duration-300 ease-in-out mb-8"
      >
        المزيد من السيارات{' '}
        <MdKeyboardDoubleArrowDown className="ml-2 text-xl" />
      </button>
      <Footer />
      <h1 className="w-full text-sm select-none text-center pt-8 pb-4 border uppercase text-gray-600">
        Copyright © 2025 tobirni web site. All Rights Reserved
      </h1>
    </main>
  );
}
