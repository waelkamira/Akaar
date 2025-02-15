'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { GiExitDoor } from 'react-icons/gi';
import { FcConferenceCall } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { MdOutlineMapsHomeWork } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ImProfile } from 'react-icons/im';
import { GiCarWheel } from 'react-icons/gi';
import { ImSearch } from 'react-icons/im';
import Button from '../Button';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from '../SideBarMenu';
import NavegationPages from '../NavegationPages';
import SmallItem from '../SmallItem';

export default function MainNavbar() {
  const router = useRouter();
  const session = useSession();
  const [pageNumber, setPageNumber] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [searshedKeyWord, setSearshedKeyWord] = useState('');
  // console.log('searshedKeyWord', searshedKeyWord);
  const [searchResults, setSearchResults] = useState([]);

  async function handleSearch() {
    console.log('handleSearch');
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searshedKeyWord, page: pageNumber }),
    });
    if (response.ok) {
      const json = await response.json();
      console.log('json', json);
      setSearchResults(json);
    }
  }
  return (
    <div className="flex-1 w-full fixed top-0 right-0 z-50">
      <div
        className={`hidden xl:flex xl:flex-col xl:justify-between w-full overflow-hidden bg-two text-white border-b-[10px] border-one px-4`}
      >
        <div className="flex justify-between items-center w-full">
          <ul className="flex justify-between gap-4 items-center h-20 py-4 w-5/6">
            <div
              className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-lg  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
              onClick={() => router.push('/')}
            >
              <FaHome className="text-xl select-none text-one" />
              <li className=" text-xl select-none">الرئيسية</li>
            </div>
            <div className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-lg  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300">
              {session?.status === 'unauthenticated' && (
                <div
                  className="flex items-center justify-center gap-2 hover:cursor-pointer h-14 transition-all duration-300"
                  onClick={() => router.push('/login')}
                >
                  <GiExitDoor className="text-xl select-none text-one" />
                  <li className=" text-xl select-none">تسجيل الدخول</li>
                </div>
              )}
              {session?.status === 'authenticated' && (
                <div
                  className="flex items-center justify-center gap-2 border-one px-2 h-14 transition-all duration-300"
                  onClick={() => router.push('/profile')}
                >
                  <ImProfile className="text-xl select-none text-one" />
                  <li className=" text-xl select-none">بروفايل</li>
                </div>
              )}
            </div>

            <div
              className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-lg  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
              onClick={() => router.push('/myPosts')}
            >
              <FaCanadianMapleLeaf className="text-xl select-none text-one" />
              <li className=" text-md xl:text-xl select-none text-nowrap">
                متجري
              </li>
            </div>
            {/* <div
            className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-lg  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            onClick={() => router.push('/favoritePosts')}
          >
            <TbTargetArrow className="text-xl select-none text-one" />
            <li className=" text-md xl:text-xl select-none text-nowrap">
              المفضلة
            </li>
          </div> */}
            <div
              className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-lg  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
              onClick={() => router.push('/RealEstate')}
            >
              <MdOutlineMapsHomeWork className="text-xl select-none text-one" />
              <li className=" text-xl select-none">عقارات</li>
            </div>
            <div
              className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-lg  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
              onClick={() => router.push('/Cars')}
            >
              <GiCarWheel className="text-xl select-none text-one" />
              <li className=" text-xl select-none">سيارات</li>
            </div>

            <div
              className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-lg  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
              onClick={() => router.push('/contactUs')}
            >
              <FcConferenceCall className="text-xl select-none text-one" />
              <li className=" text-md xl:text-xl select-none text-nowrap">
                اتصل بنا
              </li>
            </div>
          </ul>
          <div className="flex items-center justify-center">
            {/* <ClockWidget /> */}
            <div
              className="relative flex justify-end w-fit min-w-[218px] cursor-pointer "
              onClick={() => router.push('/')}
            >
              {/* <div className="absolute top-5 left-24 flex justify-end ">
              <div className="absolute">
                <h1 className="akar akarStroke lg:text-4xl lg:font-extrabold text-lg text-nowrap select-none">
                  تؤبرني
                </h1>
                <h1 className="absolute akarStroke lg:text-4xl lg:font-extrabold text-transparent text-lg text-nowrap select-none top-0 left-0 z-0">
                  تؤبرني
                </h1>
              </div>
            </div> */}
              <div className="relative h-16 w-44 py-2">
                <Image
                  src="https://i.imgur.com/bhzNopE.png"
                  fill
                  objectFit="contain"
                  alt="home_photo"
                  objectPosition="top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2 w-full bg-three px-2 sm:px-4 min-h-20">
        <div className="relative xl:hidden">
          <TfiMenuAlt
            className="text-[30px] sm:text-5xl text-white cursor-pointer"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
          <div className="absolute top-14 lg:top-20 right-0 z-50">
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>
        </div>
        <div className="relative text-center w-1/4 2xl:w-1/12">
          <Button
            style={' sm:p-6'}
            onClick={handleSearch}
            title={'بحث'}
            emoji={<ImSearch />}
          />
        </div>
        <input
          type="search"
          id="main_search"
          value={searshedKeyWord}
          onChange={(e) => setSearshedKeyWord(e.target.value)}
          autoFocus
          placeholder="ابحث عن عقار .. سيارة ..."
          // onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full xl:w-1/2 2xl:w-2/5 my-2 text-sm sm:text-lg rounded text-start z-40 h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
        />
      </div>
      <div
        className={`bg-five ${
          searchResults?.length > 0 ? 'h-screen overflow-y-auto pb-24' : ''
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 p-2 sm:p-4 gap-4 justify-start items-start w-full border border-five">
          {searchResults?.length > 0 &&
            searchResults.map((post, index) => (
              <div
                className="relative flex flex-col border-2 items-start h-full justify-start bg-one hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer rounded-[10px] overflow-hidden"
                key={index}
              >
                <SmallItem post={post} index={index} show={false} />
              </div>
            ))}
        </div>

        <NavegationPages
          array={searchResults}
          setPageNumber={setPageNumber}
          pageNumber={pageNumber}
        />
      </div>
    </div>
  );
}
