'use client';
import FirstNavBar from './FirstNavBar';
import Search from '../Search/Search';
import Hero from '../Home/Hero';

export default function MainNavBar() {
  return (
    <div className=" flex flex-col justify-center items-center w-full inset-0 mb-20">
      <FirstNavBar />
      <Hero />
    </div>
  );
}
