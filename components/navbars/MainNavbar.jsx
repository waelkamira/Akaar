'use client';
import React, { useState } from 'react';
import FirstNavBar from './FirstNavBar';
import ParentComponen from '../Search1/ParentComponen';
import SearchBar from '../Search/SearchBar';

export default function MainNavbar() {
  return (
    <div className="flex flex-col justify-center items-center w-full inset-0 bg-one/5 mb-44 bg-three">
      <div className="fixed top-0 right-0 z-[1000] w-full">
        <FirstNavBar />
        {/* <SearchBar /> */}
        <ParentComponen />
      </div>
    </div>
  );
}
