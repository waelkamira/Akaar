'use client';
import FirstNavBar from './FirstNavBar';
import Search from '../Search/Search';
import { usePathname } from 'next/navigation';
import CategoriesNavBar from './CategoriesNavBar';

export default function MainNavbar() {
  const path = usePathname();
  return (
    <div className="relative flex flex-col justify-center items-center w-full inset-0 mb-20 z-50">
      {/* FirstNavBar و Search ثابتة على الشاشات الصغيرة */}
      <div className="max-sm:fixed max-sm:top-0 max-sm:right-0 max-sm:z-50 w-full">
        <FirstNavBar />
        <Search />
      </div>

      {/* CategoriesNavBar يبقى sticky على جميع الشاشات */}
      <div className="sticky top-0 z-[1000] w-full">
        {/* <CategoriesNavBar /> */}
      </div>
    </div>
  );
}
