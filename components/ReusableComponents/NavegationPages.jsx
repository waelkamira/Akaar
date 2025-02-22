'use client';
import Link from 'next/link';
import React from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function NavegationPages({ array, setPageNumber, pageNumber }) {
  console.log('array', array);
  return (
    <div className="flex items-center justify-around  mt-4 ">
      {array?.length >= 5 && (
        <Link href={'#post1'}>
          <div
            className="flex items-center justify-around cursor-pointer py-4"
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <MdKeyboardDoubleArrowRight className="text-2xl text-one select-none" />
            <h1 className="">الصفحة التالية</h1>
          </div>
        </Link>
      )}
      {pageNumber > 1 && (
        <Link href={'#post1'}>
          <div
            className="flex items-center justify-around cursor-pointer py-4"
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <MdKeyboardDoubleArrowLeft className="text-2xl text-one select-none" />
            <h1 className="">الصفحة السابقة</h1>
          </div>
        </Link>
      )}
    </div>
  );
}
