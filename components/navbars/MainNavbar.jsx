'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { GiExitDoor } from 'react-icons/gi';
import { FcConferenceCall } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineMapsHomeWork,
} from 'react-icons/md';
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
import ClockWidget from '../ClockWidget';
import Link from 'next/link';

export default function MainNavbar() {
  const router = useRouter();
  const session = useSession();
  const [pageNumber, setPageNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [searshedKeyWord, setSearshedKeyWord] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true); // إضافة حالة جديدة لـ hasMore

  useEffect(() => {
    handleSearch(pageNumber);
  }, [pageNumber]);

  async function handleSearch(newPage = 1) {
    console.log('handleSearch');
    if (searshedKeyWord) {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searshedKeyWord, page: newPage }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log('json', json);

        // التحقق من أن json?.data هو مصفوفة
        if (Array.isArray(json?.data)) {
          if (newPage === 1) {
            setSearchResults(json?.data); // الصفحة الأولى، استبدل البيانات
            setTotalCount(json?.totalCount);
          } else {
            setSearchResults((prevResults) =>
              [...prevResults, ...json?.data].slice(-6)
            ); // أضف المزيد من النتائج
          }
          setHasMore(json.hasMore); // تحديث حالة hasMore
        } else {
          console.error(
            'Expected json?.data to be an array, but got:',
            json?.data
          );
        }
      }
    } else {
      setSearchResults([]);
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
            <div
              className="relative flex justify-end w-fit min-w-[218px] cursor-pointer "
              onClick={() => router.push('/')}
            >
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
      <div className="flex flex-col justify-center items-start w-full bg-three">
        <div className="flex justify-between items-center gap-2 sm:gap-4 w-full">
          <div className="flex justify-center items-center gap-2 sm:gap-4 w-full">
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
              {searchResults?.length > 0 ? (
                <button
                  className="btn sm:text-lg text-sm p-0.5 lg:p-3 my-2 text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover:scale-[101%]"
                  style={{
                    '--btn-background': '#F50610',
                    // '--btn-hover-background': '#F50610',
                  }}
                  onClick={() => {
                    setPageNumber(1); // إعادة تعيين رقم الصفحة إلى 1
                    setSearchResults([]); // مسح النتائج
                    setSearshedKeyWord(''); // مسح الكلمة المفتاحية
                  }}
                >
                  إغلاق البحث
                </button>
              ) : (
                <Button
                  style={' sm:p-6'}
                  onClick={() => handleSearch()}
                  title={'بحث'}
                  emoji={<ImSearch />}
                />
              )}
            </div>
            <input
              type="search"
              id="main_search"
              value={searshedKeyWord}
              onChange={(e) => {
                setSearshedKeyWord(e?.target?.value);
                if (searshedKeyWord?.length === 0) {
                  setSearchResults([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                  setPageNumber(1);
                }
              }}
              autoFocus
              placeholder="ابحث عن عقار .. سيارة ..."
              // onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full xl:w-1/2 2xl:w-2/5 my-2 text-sm sm:text-lg rounded text-start z-40 h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
            />
          </div>
          {/* <ClockWidget /> */}
        </div>
        {searchResults?.length > 0 && (
          <div
            className={`w-full text-white ${
              searchResults?.length > 0 ? 'pb-36 h-screen overflow-y-auto' : ''
            } `}
          >
            <div className="mt-8">
              <h1 className="p-8">
                نتائج البحث المطابقة:
                <span className="px-2 text-one">{totalCount}</span>
              </h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 p-2 sm:p-4 gap-4 justify-start items-start w-full py-16">
                {searchResults.map((post, index) => (
                  <div
                    className="relative flex flex-col border-2 items-start h-full justify-start bg-one hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer rounded-[10px] overflow-hidden"
                    key={index}
                  >
                    <SmallItem post={post} index={index} show={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* <NavegationPages
              array={searchResults}
              setPageNumber={setPageNumber}
              pageNumber={pageNumber}
            /> */}
            <div className="flex items-center justify-around  my-4 ">
              {/* عرض الأزرار بناءً على hasMore */}
              {pageNumber > 1 && (
                <Link href={'#post1'}>
                  <div
                    className="flex items-center justify-around cursor-pointer py-4"
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    <MdKeyboardDoubleArrowLeft className="text-2xl text-one select-none" />
                    <h1>الصفحة السابقة</h1>
                  </div>
                </Link>
              )}
              {hasMore && (
                <Link href={'#post1'}>
                  <div
                    className="flex items-center justify-around cursor-pointer py-4"
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    <MdKeyboardDoubleArrowRight className="text-2xl text-one select-none" />
                    <h1>الصفحة التالية</h1>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
