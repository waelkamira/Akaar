// 'use client';
// import React, { useContext, useEffect, useState } from 'react';
// import CitySelector from '../map/CitySelector';
// import SmallItem from '../SmallItem';
// import Loading from '../Loading';
// import { MdOutlinePriceCheck } from 'react-icons/md';
// import Button from '../Button';
// import { inputsContext } from '../Context';
// import { ImSearch } from 'react-icons/im';
// import { LuArrowDownNarrowWide } from 'react-icons/lu';
// import { LuArrowUpNarrowWide } from 'react-icons/lu';
// import MiddleBarAndPhoto from '../RealEstate/RealEstateSideBar';
// import NavegationPages from '../NavegationPages';
// import CarsBrandSelector from './CarsBrandSelector';
// import CarsUsedNewSelector from './CarsUsedNewSelector';
// import CarsNavbar from './CarsNavbar';
// import CarsSideBar from './CarsSideBar';

// export default function CarsSearchBar({ imgLink }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isShow, setIsShow] = useState(false);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [carsAds, setCarsAds] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { data, brand, usedNew } = useContext(inputsContext);

//   // State واحد لتخزين جميع بيانات البحث
//   const [searchData, setSearchData] = useState({
//     city: data?.propertyCity || '',
//     town: data?.propertyTown || '',
//     usedNew: usedNew || '',
//     brand: brand?.label || '',
//     minPrice: '',
//     maxPrice: '',
//   });

//   useEffect(() => {
//     fetchCarsAds();
//   }, [pageNumber]);

//   useEffect(() => {
//     setSearchData((prevData) => ({
//       ...prevData,
//       city: data?.propertyCity || '',
//       town: data?.propertyTown || '',
//       usedNew: usedNew?.label || '',
//       brand: brand?.label || '',
//     }));
//   }, [data, brand, usedNew]);

//   const fetchCarsAds = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/Cars/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           limit: 5,
//           page: pageNumber,
//           ...searchData,
//         }),
//       });

//       if (response.ok) {
//         const json = await response.json();
//         console.log('posts:', json);

//         setCarsAds(json);
//         setSearchData({
//           ...searchData,
//           city: '',
//           town: '',
//           usedNew: '',
//           brand: '',
//           minPrice: '',
//           maxPrice: '',
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       setCarsAds([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     await fetchCarsAds();
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setSearchData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   return (
//     <div className="flex flex-col justify-center items-center w-full rounded-b">
//       <CarsNavbar />
//       <CarsSideBar Button={true} />
//       {!carsAds && <Loading />}

//       <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full bg-three shadow-sm shadow-gray-300 text-white py-4">
//         <div className="relative text-center w-full xl:w-1/4 px-2">
//           <ImSearch className="hidden xl:block p-1 text-3xl text-one text-center w-full" />

//           <Button
//             style={'border'}
//             onClick={handleSearch}
//             title={'بحث'}
//             // emoji={<ImSearch />}
//           />
//         </div>
//         <div className="flex flex-col xl:flex-row items-center justify-center gap-2 mb-2 w-full px-2 ">
//           <div className="flex flex-col sm:flex-row gap-2 w-full">
//             <div className="w-full">
//               <CarsUsedNewSelector />
//             </div>
//             <div className="w-full">
//               <CarsBrandSelector />
//             </div>
//           </div>
//           <CitySelector />

//           <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
//             <div className=" w-full">
//               <div className="flex items-center gap-2 w-full justify-start my-2">
//                 <h1 className="flex text-right text-md select-none text-nowrap">
//                   <span className="text-one xl:text-xl ml-2">
//                     <MdOutlinePriceCheck />
//                   </span>
//                   أدنى سعر:
//                 </h1>
//               </div>
//               <input
//                 type="number"
//                 id="minPrice"
//                 placeholder="0"
//                 value={searchData.minPrice}
//                 onChange={handleInputChange}
//                 className="w-full text-sm sm:text-lg rounded text-start text-black z-40 h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one"
//               />
//             </div>
//             <div className=" w-full">
//               <div className="flex items-center gap-2 w-full justify-start my-2">
//                 <h1 className="flex text-right text-md select-none text-nowrap">
//                   <span className="text-one xl:text-xl ml-2">
//                     <MdOutlinePriceCheck />
//                   </span>
//                   أعلى سعر:
//                 </h1>
//               </div>
//               <input
//                 type="number"
//                 id="maxPrice"
//                 placeholder="0"
//                 value={searchData.maxPrice}
//                 onChange={handleInputChange}
//                 className="w-full text-sm sm:text-lg rounded text-start text-black z-40 h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col w-full mt-4 rounded-[5px] flex-grow xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 pt-2 overflow-y-auto border rounded-b z-[0]">
//         <div className="flex flex-col w-full h-full overflow-y-auto ">
//           {carsAds?.length > 0 ? (
//             <div className="flex flex-col justify-start w-full overflow-y-auto my-2 z-[0]">
//               {carsAds?.map((post, index) => (
//                 <SmallItem key={index} post={post} />
//               ))}
//               <NavegationPages
//                 array={carsAds}
//                 setPageNumber={setPageNumber}
//                 pageNumber={pageNumber}
//               />
//             </div>
//           ) : (
//             <div>
//               <div className="flex flex-col justify-center items-center w-full h-full my-4">
//                 <h1 className="text-md sm:text-xl mb-8">
//                   لم يتم العثور على نتائج مطابقة للبحث
//                 </h1>
//                 <Loading />
//               </div>
//               {/* <Link href={'#post1'}>
//                 <div
//                   className="flex items-center justify-center w-full cursor-pointer"
//                   onClick={() => setPageNumber(pageNumber - 1)}
//                 >
//                   <MdKeyboardDoubleArrowLeft className="text-2xl  text-one" />
//                   <h1 className="">الصفحة السابقة</h1>
//                 </div>
//               </Link> */}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import CitySelector from '../map/CitySelector';
import SmallItem from '../ReusableComponents/SmallItem';
import { MdOutlinePriceCheck } from 'react-icons/md';
import Button from '../Button';
import { inputsContext } from '../Context';
import { ImSearch } from 'react-icons/im';
import CarsBrandSelector from './CarsBrandSelector';
import CarsUsedNewSelector from './CarsUsedNewSelector';
import CarsNavbar from './CarsNavbar';
import CarsSideBar from './CarsSideBar';
import NavegationPages from '../ReusableComponents/NavegationPages';

export default function CarsSearchBar({ imgLink }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [carsAds, setCarsAds] = useState([]);
  const { data, brand, usedNew } = useContext(inputsContext);

  // State واحد لتخزين جميع بيانات البحث
  const [searchData, setSearchData] = useState({
    city: data?.propertyCity || '',
    town: data?.propertyTown || '',
    usedNew: usedNew || '',
    brand: brand?.label || '',
    minPrice: '',
    maxPrice: '',
  });

  // تخزين البيانات في الكاش لتجنب الطلبات المتكررة
  const cache = useMemo(() => new Map(), []);

  const fetchCarsAds = async () => {
    const cacheKey = JSON.stringify({ pageNumber, ...searchData });
    if (cache.has(cacheKey)) {
      setCarsAds(cache.get(cacheKey));
      return;
    }

    try {
      const response = await fetch('/api/Cars/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 5,
          page: pageNumber,
          ...searchData,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        setCarsAds(json);
        cache.set(cacheKey, json); // حفظ البيانات في الكاش
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setCarsAds([]);
    }
  };

  useEffect(() => {
    fetchCarsAds();
  }, [pageNumber, searchData]);

  const handleSearch = () => {
    setPageNumber(1); // إعادة التصفح إلى الصفحة الأولى عند البحث
    fetchCarsAds();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center w-full rounded-b">
      <CarsNavbar />
      <CarsSideBar Button={true} />
      <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full bg-three shadow-sm shadow-gray-300 text-white py-4">
        <div className="relative text-center w-full xl:w-1/4 px-2">
          <ImSearch className="hidden xl:block p-1 text-3xl text-one text-center w-full" />
          <Button style={'border'} onClick={handleSearch} title={'بحث'} />
        </div>
        <div className="flex flex-col xl:flex-row items-center justify-center gap-2 mb-2 w-full px-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="w-full">
              <CarsUsedNewSelector />
            </div>
            <div className="w-full">
              <CarsBrandSelector />
            </div>
          </div>
          <CitySelector />
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
            <div className="w-full">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md select-none text-nowrap">
                  <span className="text-one xl:text-xl ml-2">
                    <MdOutlinePriceCheck />
                  </span>
                  أدنى سعر:
                </h1>
              </div>
              <input
                type="number"
                id="minPrice"
                placeholder="0"
                value={searchData.minPrice}
                onChange={handleInputChange}
                className="w-full text-sm sm:text-lg rounded text-start text-black z-40 h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one"
              />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md select-none text-nowrap">
                  <span className="text-one xl:text-xl ml-2">
                    <MdOutlinePriceCheck />
                  </span>
                  أعلى سعر:
                </h1>
              </div>
              <input
                type="number"
                id="maxPrice"
                placeholder="0"
                value={searchData.maxPrice}
                onChange={handleInputChange}
                className="w-full text-sm sm:text-lg rounded text-start text-black z-40 h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full mt-4 rounded-[5px] flex-grow xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 pt-2 overflow-y-auto border rounded-b z-[0]">
        <div className="flex flex-col w-full h-full overflow-y-auto">
          {carsAds?.length > 0 ? (
            <div className="flex flex-col justify-start w-full overflow-y-auto my-2 z-[0]">
              {carsAds.map((post, index) => (
                <SmallItem key={index} post={post} />
              ))}
              <NavegationPages
                array={carsAds}
                setPageNumber={setPageNumber}
                pageNumber={pageNumber}
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-full my-4">
              <h1 className="text-md sm:text-xl mb-8">
                لم يتم العثور على نتائج مطابقة للبحث
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
