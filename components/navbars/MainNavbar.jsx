'use client';
import FirstNavBar from './FirstNavBar';
import Search from '../Search/Search';

export default function MainNavbar() {
  return (
    <div className="relative flex flex-col justify-center items-center w-full inset-0 mb-20 z-50">
      {/* FirstNavBar و Search ثابتة على الشاشات الصغيرة */}
      <div className=" sm:block top-0 right-0 z-40 w-full">
        <FirstNavBar />
        <Search />
      </div>
    </div>
  );
}
