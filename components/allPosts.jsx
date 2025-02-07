'use client';
import React, { useContext, useEffect, useState } from 'react';
import SmallItem from './SmallItem';
import Loading from './Loading';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import Link from 'next/link';
import CustomToast from './CustomToast';
import toast from 'react-hot-toast';
import NavegationPages from './NavegationPages';

export default function AllPosts({}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // استدعاء البحث عند تغيير الصفحة فقط إذا تم الضغط على الزر
  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/search?limit=5&page=${pageNumber}&propertyCategory=${propertyCategory}`
      );
      if (response.ok) {
        const json = await response.json();
        console.log('API Response:', json?.properties);
        setAllPosts(json?.properties);

        if (json?.properties?.length === 0) {
          toast.custom((t) => (
            <CustomToast t={t} message={'لا يوجد نتائج لعرضها'} />
          ));
          console.log('No results to display');
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

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 sm:px-16 pt-4 sm:py-8  bg-seven overflow-y-auto z-10 ">
        <div className="flex flex-col justify-start w-full h-[1500px] overflow-y-auto z-10 my-4">
          {allPosts?.length === 0 ? (
            <Loading />
          ) : (
            allPosts?.map((post, index) => (
              <div key={index}>
                <SmallItem post={post} index={index} />
              </div>
            ))
          )}
          {/* <div className="flex items-center justify-around sm:my-4 sm:mt-8">
            {allPosts?.length >= 5 && (
              <Link href={'#post1'}>
                <div
                  className="flex items-center justify-around cursor-pointer"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  <h1 className=" ">الصفحة التالية</h1>
                  <MdKeyboardDoubleArrowRight className="text-2xl  text-one" />
                </div>
              </Link>
            )}
            {pageNumber > 1 && (
              <Link href={'#post1'}>
                <div
                  className="flex items-center justify-around cursor-pointer"
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  <MdKeyboardDoubleArrowLeft className="text-2xl  text-one" />
                  <h1 className=" ">الصفحة السابقة</h1>
                </div>
              </Link>
            )}
          </div> */}
          <NavegationPages
            array={allPosts}
            setPageNumber={setPageNumber}
            pageNumber={pageNumber}
          />{' '}
        </div>
      </div>
    </div>
  );
}
