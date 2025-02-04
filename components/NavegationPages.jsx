import Link from 'next/link';
import React from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function NavegationPages({ array, setPageNumber, pageNumber }) {
  return (
    <div className="flex items-center justify-around text-white mt-4">
      {array?.length >= 5 && (
        <Link href={'#post1'}>
          <div
            className="flex items-center justify-around cursor-pointer py-4"
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <h1 className="text-white">الصفحة التالية</h1>
            <MdKeyboardDoubleArrowRight className="text-2xl  text-green-500 select-none" />
          </div>
        </Link>
      )}
      {pageNumber > 1 && (
        <Link href={'#post1'}>
          <div
            className="flex items-center justify-around cursor-pointer py-4"
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <MdKeyboardDoubleArrowLeft className="text-2xl  text-green-500 select-none" />
            <h1 className="text-white">الصفحة السابقة</h1>
          </div>
        </Link>
      )}
    </div>
  );
}
