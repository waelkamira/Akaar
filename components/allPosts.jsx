'use client';
import React, { useEffect, useState, useContext } from 'react';
import { inputsContext } from './Context';
import SmallItem from './SmallItem';
import Loading from './Loading';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import Link from 'next/link';

export default function AllPosts({ propertyCategory }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [allPosts, setallPosts] = useState([]);
  const { dispatch, newPost, deletedPost, data } = useContext(inputsContext);
  console.log('data from allPosts', data);
  useEffect(() => {
    fetchAllPosts();
    // console.log('rerendered');
  }, [newPost, deletedPost, pageNumber, data]);

  async function fetchAllPosts() {
    // console.log('تم ارسال طلب****************');

    try {
      const response = await fetch(
        `/api/search?page=${pageNumber}&limit=5&propertyCategory=${propertyCategory}&propertyCity=${data?.propertyCity}&propertyTown=${data?.propertyTown}&propertyType=${data?.propertyType}`
      );
      if (response.ok) {
        const json = await response.json();
        console.log('json****************', json);
        dispatch({ type: 'SET_POSTS', payload: json });
        setallPosts(json);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  return (
    <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 sm:px-16 pt-4 sm:py-8  bg-seven overflow-y-auto z-10 ">
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
  );
}
