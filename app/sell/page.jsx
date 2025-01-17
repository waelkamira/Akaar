'use client';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { TfiMenuAlt } from 'react-icons/tfi';
import AllPosts from '../../components/allPosts';
import SideBarMenu from '../../components/SideBarMenu';
import CitySelector from '../../components/map/CitySelector';
import { inputsContext } from '../../components/Context';
import SelectComponent from '../../components/SelectComponent';

export default function Sell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useContext(inputsContext);

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  return (
    <div className="flex flex-col justify-center items-center gap-4 overflow-auto w-full h-full border border-five bg-four z-20">
      <div className="absolute flex flex-col items-start gap-2 z-40 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
        <TfiMenuAlt
          className="xl:hidden p-1  text-4xl lg:text-5xl text-one cursor-pointer z-50 animate-pulse"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      <div className="relative w-full h-[300px]">
        <Image
          src="https://i.imgur.com/wHyvDAD.png"
          fill
          objectFit="cover"
          alt="home_photo"
          objectPosition="center"
        />
      </div>
      <div className="w-full xl:w-[90%] px-4 sm:px-8">
        <CitySelector />
        <SelectComponent />
      </div>
      <AllPosts propertyCategory={'بيع'} />
    </div>
  );
}
