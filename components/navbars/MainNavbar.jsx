'use client';
import FirstNavBar from './FirstNavBar';
import Search from '../Search/Search';
import { usePathname } from 'next/navigation';
import CategoriesNavBar from './CategoriesNavBar';
//toast بهذه القيمة حتى يكون أعلى من الخريطة التي هي افتراضيا 1000 وأقل من z-[1001]  تم تعيين
export default function MainNavbar() {
  const path = usePathname();
  return (
    <div className="flex flex-col justify-center items-center w-full inset-0 mb-44 bg-one z-50 ">
      <div className="fixed top-0 right-0 z-[1001] w-full ">
        <FirstNavBar />
        <Search />
        <CategoriesNavBar />
      </div>
    </div>
  );
}
