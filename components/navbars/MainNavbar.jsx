'use client';
import FirstNavBar from './FirstNavBar';
import Search from '../Search/Search';
import Hero from '../Home/Hero';
import { SearchProvider } from '../../contexts/SearchContext';

export default function MainNavbar() {
  return (
    <div className="relative flex flex-col justify-center items-center w-full inset-0 lg:mb-5">
      <FirstNavBar />

      <div className="w-full sm:h-96">
        <Hero />
      </div>
      <Search />
    </div>
  );
}
