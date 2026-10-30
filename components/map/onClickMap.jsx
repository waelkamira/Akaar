// 'use client';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Tooltip,
//   useMapEvents,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { icon } from 'leaflet';
// import { useState, useRef, useEffect, useContext, useCallback } from 'react';
// import { inputsContext } from '@/features/auth/inputs-context';
// import { cities } from '../lists/Cities';
// import { FaMapMarkedAlt } from 'react-icons/fa';
// import Select from 'react-select';
// import { GiModernCity } from 'react-icons/gi';
// import { FaTreeCity } from 'react-icons/fa6';

// // أيقونة مخصصة للدبوس الأحمر
// const redIcon = icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
//   iconSize: [30, 30],
// });

// // مكون لالتقاط الأحداث على الخريطة
// function AddMarker({ onLocationSelect }) {
//   const [position, setPosition] = useState(null);

//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setPosition([lat, lng]);
//       onLocationSelect([lat, lng]);
//     },
//   });

//   return position ? (
//     <Marker position={position} icon={redIcon} className="relative">
//       <Tooltip
//         permanent
//         className="absolute -top-8 right-4 left-4 mx-auto z-50 w-20 "
//       >
//         موقع العقار هنا
//       </Tooltip>
//     </Marker>
//   ) : null;
// }

// export default function OnClickMap({
//   chosenCity,
//   chosentown,
//   propertyCityLocation,
//   propertyTownLocation,
//   lat,
//   lng,
// }) {
//   const [selectedLocation, setSelectedLocation] = useState(
//     propertyTownLocation || propertyCityLocation || [34.8021, 38.9968],
//   );
//   const [selectedCity, setSelectedCity] = useState(chosenCity || null);
//   const [selectedTown, setSelectedTown] = useState(chosentown || null);
//   const { dispatch } = useContext(inputsContext);
//   const mapRef = useRef();
//   const [minHeight, setMinHeight] = useState('20px');
//   const [mapType, setMapType] = useState('normal'); // 'normal' للخريطة العادية، 'satellite' لخريطة القمر الصناعي

//   useEffect(() => {
//     const updateSize = () => {
//       setMinHeight(window.innerWidth >= 640 ? '48px' : '20px'); // sm: 640px
//     };

//     updateSize(); // استدعاء أولي عند التحميل
//     window.addEventListener('resize', updateSize);

//     return () => window.removeEventListener('resize', updateSize);
//   }, []);

//   useEffect(() => {
//     if (lat && lng) {
//       const newLocation = [parseFloat(lat), parseFloat(lng)];
//       setSelectedLocation(newLocation);

//       // عمل زووم على الموقع الجديد
//       if (mapRef.current) {
//         const map = mapRef.current;
//         map.setView(newLocation, 14); // مستوى الزووم 14
//       }
//     }
//   }, [lat, lng]);

//   useEffect(() => {
//     if (propertyCityLocation) {
//       setSelectedLocation(propertyCityLocation);
//     }
//     if (propertyTownLocation) {
//       setSelectedLocation(propertyTownLocation);
//     }
//   }, [propertyCityLocation, propertyTownLocation]);

//   const handleLocationSelect = useCallback(
//     (location) => {
//       setSelectedLocation(location);
//       dispatch({ type: 'LOCATION', payload: location });
//     },
//     [dispatch],
//   );

//   const handleCityChange = useCallback((selectedOption) => {
//     const city = cities?.find((c) => c.name === selectedOption?.value);
//     setSelectedCity(city);
//     setSelectedTown(null);

//     if (city && mapRef?.current) {
//       const map = mapRef?.current;
//       map.setView(city?.latlng, 12);
//       setSelectedLocation(city.latlng);
//     }
//   }, []);

//   const handleTownChange = useCallback(
//     (selectedOption) => {
//       const town = selectedCity?.towns.find(
//         (t) => t.name === selectedOption.value,
//       );
//       setSelectedTown(town);

//       if (town && mapRef?.current) {
//         const map = mapRef?.current;
//         map.setView(town?.latlng, 14);
//         setSelectedLocation(town?.latlng);
//       }
//     },
//     [selectedCity],
//   );

//   const cityOptions = cities?.map((city) => ({
//     value: city?.name,
//     label: city?.name,
//   }));

//   const townOptions =
//     selectedCity?.towns?.map((town) => ({
//       value: town?.name,
//       label: town?.name,
//     })) || [];

//   const customTheme = (theme) => ({
//     ...theme,
//     borderRadius: 5,
//     colors: {
//       ...theme.colors,
//       primary: '#E0926B',
//       primary25: '#FCE5DC',
//     },
//   });

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       minHeight: minHeight,
//       height: 'auto',
//       backgroundColor: 'white',
//       // borderColor: state.isFocused ? '#E0926B' : '#A1A5AD',
//       '&:hover': {
//         borderColor: '#E0926B',
//       },
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       minHeight: minHeight,
//       padding: '0 1rem',
//       display: 'flex',
//       alignItems: 'center',
//     }),
//     indicatorsContainer: (provided) => ({
//       ...provided,
//       minHeight: minHeight,
//     }),
//   };

//   return (
//     <div className="w-full ">
//       <>
//         <div className="flex flex-col justify-start items-start gap-2 w-full my-3">
//           <div className="flex">
//             <span className="flex text-primary-500 text-lg xl:text-2xl ml-2">
//               <FaMapMarkedAlt />
//             </span>
//             <span className="flex text-sm sm:text-lg select-none text-nowrap ">
//               حدد الموقع على الخريطة :
//             </span>
//           </div>
//           <h1 className="text-right text-sm sm:text-lg select-none ">
//             اختر المدينة من القائمة ثم اختر المنطقة من القائمة الثانية ثم قم
//             بعمل زووم على الخريطة واضغط على الموقع بدقة
//           </h1>
//         </div>
//         <div className="mb-4 relative z-50">
//           <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap">
//             <span className="text-primary-500 text-lg xl:text-2xl ml-2">
//               <GiModernCity />
//             </span>
//             اختر المدينة:
//           </label>
//           <Select
//             options={cityOptions}
//             onChange={handleCityChange}
//             value={cityOptions.find(
//               (option) => option.value === selectedCity?.name,
//             )}
//             placeholder="-- اختر المدينة --"
//             isClearable
//             isSearchable
//             theme={customTheme}
//             styles={customStyles}
//             className="w-full text-md text-start text-white rounded select-none z-40"
//             classNamePrefix="select"
//             classNames={{
//               control: (state) =>
//                 `${
//                   state.isFocused ? 'border-primary-500' : 'border-gray-300'
//                 } sm:h-12 h-9 w-full`,
//             }}
//           />
//         </div>
//         {selectedCity && (
//           <div className="mb-4 relative z-40">
//             <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap">
//               <span className="text-primary-500 text-lg xl:text-2xl ml-2">
//                 <FaTreeCity />
//               </span>
//               اختر البلدة:
//             </label>
//             <Select
//               options={townOptions}
//               onChange={handleTownChange}
//               value={townOptions.find(
//                 (option) => option.value === selectedTown?.name,
//               )}
//               placeholder="-- اختر البلدة --"
//               isClearable
//               isSearchable
//               theme={customTheme}
//               styles={customStyles}
//               className="w-full text-md text-start text-white rounded select-none z-30"
//               classNamePrefix="select"
//               classNames={{
//                 control: (state) =>
//                   `${
//                     state.isFocused ? 'border-primary-500' : 'border-gray-300'
//                   } sm:h-12 h-9 w-full`,
//               }}
//             />
//           </div>
//         )}
//       </>

//       <div className="w-full h-72 sm:h-[500px] rounded-lg overflow-hidden shadow-lg relative">
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             setMapType(mapType === 'normal' ? 'satellite' : 'normal');
//           }}
//           className="absolute top-3 right-3 bg-white p-1 sm:p-2 rounded shadow-md text-white text-[10px] sm:text-md z-20"
//         >
//           {mapType === 'normal' ? 'عرض القمر الصناعي' : 'عرض الخريطة العادية'}
//         </button>

//         <MapContainer
//           center={selectedLocation}
//           zoom={7}
//           className="w-full h-full z-10"
//           ref={mapRef}
//         >
//           {mapType === 'normal' ? (
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//           ) : (
//             <TileLayer
//               attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
//               url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
//             />
//           )}

//           <AddMarker onLocationSelect={handleLocationSelect} />
//           {/* دبوس للإحداثيات المحددة */}
//           {lat && lng && (
//             <Marker
//               position={[parseFloat(lat), parseFloat(lng)]}
//               icon={redIcon}
//             >
//               <Tooltip permanent>موقع العقار المحدد</Tooltip>
//             </Marker>
//           )}
//           {/* دبوس المحافظة */}
//           {selectedCity && (
//             <Marker position={selectedCity.latlng} icon={redIcon}>
//               <Tooltip permanent>موقع محافظة {selectedCity.name}</Tooltip>
//             </Marker>
//           )}
//           {/* دبوس البلدة */}
//           {selectedTown && (
//             <Marker position={selectedTown.latlng} icon={redIcon}>
//               <Tooltip permanent>موقع منطقة {selectedTown.name}</Tooltip>
//             </Marker>
//           )}
//         </MapContainer>
//       </div>

//       {selectedLocation && (
//         <div className="mt-4 p-4 bg-white rounded  shadow-sm border border-gray-300">
//           <p>
//             <span className="sm:font-bold"> الموقع الذي قمت بتحديده:</span>
//             {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { inputsContext } from '@/features/auth/inputs-context';
import { cities } from '../lists/Cities';
import { FaMapMarkedAlt } from 'react-icons/fa';
import Select from 'react-select';
import { GiModernCity } from 'react-icons/gi';
import { FaTreeCity } from 'react-icons/fa6';

function AddMarker({ onLocationSelect, iconProp }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect([lat, lng]);
    },
  });

  return position ? (
    <Marker position={position} icon={iconProp} className="relative">
      <Tooltip
        permanent
        className="absolute -top-8 right-4 left-4 mx-auto z-50 w-20 "
      >
        موقع العقار هنا
      </Tooltip>
    </Marker>
  ) : null;
}

export default function OnClickMap({
  chosenCity,
  chosentown,
  propertyCityLocation,
  propertyTownLocation,
  lat,
  lng,
  onCoordinatesChange,
}) {
  const redIcon = icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
  });

  const [selectedLocation, setSelectedLocation] = useState(
    propertyTownLocation || propertyCityLocation || [34.8021, 38.9968],
  );
  const [selectedCity, setSelectedCity] = useState(chosenCity || null);
  const [selectedTown, setSelectedTown] = useState(chosentown || null);
  const { dispatch } = useContext(inputsContext);
  const mapRef = useRef();
  const [minHeight, setMinHeight] = useState('20px');
  const [mapType, setMapType] = useState('normal');

  // ✅ 1. حالة للتأكد من أن الكود يعمل في المتصفح فقط
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);

      const updateSize = () => {
        setMinHeight(window.innerWidth >= 640 ? '48px' : '20px');
      };
      updateSize();
      window.addEventListener('resize', updateSize);

      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  useEffect(() => {
    if (lat && lng) {
      const newLocation = [parseFloat(lat), parseFloat(lng)];
      setSelectedLocation(newLocation);
      if (mapRef.current) {
        mapRef.current.setView(newLocation, 14);
      }
    }
  }, [lat, lng]);

  useEffect(() => {
    if (propertyCityLocation) setSelectedLocation(propertyCityLocation);
    if (propertyTownLocation) setSelectedLocation(propertyTownLocation);
  }, [propertyCityLocation, propertyTownLocation]);

  const handleLocationSelect = useCallback(
    (location) => {
      setSelectedLocation(location);
      dispatch({ type: 'LOCATION', payload: location });
      onCoordinatesChange?.(location);
    },
    [dispatch, onCoordinatesChange],
  );

  const handleCityChange = useCallback((selectedOption) => {
    const city = cities?.find((c) => c.name === selectedOption?.value);
    setSelectedCity(city);
    setSelectedTown(null);
    if (city && mapRef?.current) {
      mapRef.current.setView(city?.latlng, 12);
      setSelectedLocation(city.latlng);
      onCoordinatesChange?.(city.latlng);
    }
  }, [onCoordinatesChange]);

  const handleTownChange = useCallback(
    (selectedOption) => {
      const town = selectedCity?.towns.find(
        (t) => t.name === selectedOption.value,
      );
      setSelectedTown(town);
      if (town && mapRef?.current) {
        mapRef.current.setView(town?.latlng, 14);
        setSelectedLocation(town?.latlng);
        onCoordinatesChange?.(town.latlng);
      }
    },
    [onCoordinatesChange, selectedCity],
  );

  const cityOptions = cities?.map((city) => ({
    value: city?.name,
    label: city?.name,
  }));

  const townOptions =
    selectedCity?.towns?.map((town) => ({
      value: town?.name,
      label: town?.name,
    })) || [];

  const customTheme = (theme) => ({
    ...theme,
    borderRadius: 5,
    colors: {
      ...theme.colors,
      primary: '#FF8500',
      primary25: '#4C321A',
      neutral0: '#242A28',
      neutral5: '#303936',
      neutral10: '#414B48',
      neutral20: '#53605C',
      neutral30: '#73817D',
      neutral80: '#F4F4EF',
    },
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: minHeight,
      height: 'auto',
      backgroundColor: '#242A28',
      color: '#F4F4EF',
      borderColor: state.isFocused ? '#FF8500' : '#53605C',
      '&:hover': { borderColor: '#FF8500' },
    }),
    valueContainer: (provided) => ({
      ...provided,
      minHeight: minHeight,
      padding: '0 1rem',
      display: 'flex',
      alignItems: 'center',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      minHeight: minHeight,
    }),
  };

  // ✅ 4. عرض شاشة تحميل أنيقة حتى يتم التأكد من بيئة المتصفح وتوليد المفتاح
  if (!isMounted) {
    return (
      <div className="w-full h-72 sm:h-[500px] flex items-center justify-center bg-ak-raised rounded-lg text-ak-muted border border-ak-line animate-pulse">
        جاري تحضير الخريطة...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col justify-start items-start gap-2 w-full my-3">
        <div className="flex">
          <span className="flex text-primary-500 text-lg xl:text-2xl ml-2">
            <FaMapMarkedAlt />
          </span>
          <span className="flex text-sm sm:text-lg select-none text-nowrap text-white">
            حدد الموقع على الخريطة :
          </span>
        </div>
        <h1 className="text-right text-sm sm:text-lg select-none text-gray-400">
          اختر المدينة من القائمة ثم اختر المنطقة من القائمة الثانية ثم قم بعمل
          زووم على الخريطة واضغط على الموقع بدقة
        </h1>
      </div>

      <div className="mb-4 relative z-50">
        <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap text-white">
          <span className="text-primary-500 text-lg xl:text-2xl ml-2">
            <GiModernCity />
          </span>
          اختر المدينة:
        </label>
        <Select
          options={cityOptions}
          onChange={handleCityChange}
          value={cityOptions.find(
            (option) => option.value === selectedCity?.name,
          )}
          placeholder="-- اختر المدينة --"
          isClearable
          isSearchable
          theme={customTheme}
          styles={customStyles}
          className="w-full text-md text-start text-white rounded select-none z-40"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${state.isFocused ? 'border-primary-500' : 'border-gray-300'} sm:h-12 h-9 w-full`,
          }}
        />
      </div>

      {selectedCity && (
        <div className="mb-4 relative z-40">
          <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap text-white">
            <span className="text-primary-500 text-lg xl:text-2xl ml-2">
              <FaTreeCity />
            </span>
            اختر البلدة:
          </label>
          <Select
            options={townOptions}
            onChange={handleTownChange}
            value={townOptions.find(
              (option) => option.value === selectedTown?.name,
            )}
            placeholder="-- اختر البلدة --"
            isClearable
            isSearchable
            theme={customTheme}
            styles={customStyles}
            className="w-full text-md text-start text-white rounded select-none z-30"
            classNamePrefix="select"
            classNames={{
              control: (state) =>
                `${state.isFocused ? 'border-primary-500' : 'border-gray-300'} sm:h-12 h-9 w-full`,
            }}
          />
        </div>
      )}

      <div
        className="w-full h-72 sm:h-[500px] rounded-lg overflow-hidden shadow-lg relative"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setMapType(mapType === 'normal' ? 'satellite' : 'normal');
          }}
          className="absolute top-3 right-3 bg-white p-1 sm:p-2 rounded shadow-md text-white text-[10px] sm:text-md z-20"
        >
          {mapType === 'normal' ? 'عرض القمر الصناعي' : 'عرض الخريطة العادية'}
        </button>

        <MapContainer
          center={selectedLocation}
          zoom={7}
          className="w-full h-full z-10"
          ref={mapRef}
        >
          {mapType === 'normal' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
          )}

          <AddMarker
            onLocationSelect={handleLocationSelect}
            iconProp={redIcon}
          />

          {lat && lng && (
            <Marker
              position={[parseFloat(lat), parseFloat(lng)]}
              icon={redIcon}
            >
              <Tooltip permanent>موقع العقار المحدد</Tooltip>
            </Marker>
          )}

          {selectedCity && (
            <Marker position={selectedCity.latlng} icon={redIcon}>
              <Tooltip permanent>موقع محافظة {selectedCity.name}</Tooltip>
            </Marker>
          )}

          {selectedTown && (
            <Marker position={selectedTown.latlng} icon={redIcon}>
              <Tooltip permanent>موقع منطقة {selectedTown.name}</Tooltip>
            </Marker>
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="mt-4 p-4 bg-white rounded shadow-sm border border-gray-300">
          <p>
            <span className="sm:font-bold"> الموقع الذي قمت بتحديده:</span>
            {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
}
