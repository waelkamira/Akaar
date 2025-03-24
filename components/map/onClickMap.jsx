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
// import { inputsContext } from '../authContext/Context';
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
//     propertyTownLocation || propertyCityLocation || [34.8021, 38.9968]
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
//     [dispatch]
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
//         (t) => t.name === selectedOption.value
//       );
//       setSelectedTown(town);

//       if (town && mapRef?.current) {
//         const map = mapRef?.current;
//         map.setView(town?.latlng, 14);
//         setSelectedLocation(town?.latlng);
//       }
//     },
//     [selectedCity]
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
//       primary: '#FF7C34',
//       primary25: '#fadfae',
//     },
//   });

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       minHeight: minHeight,
//       height: 'auto',
//       backgroundColor: 'white',
//       // borderColor: state.isFocused ? '#FF7C34' : '#A1A5AD',
//       '&:hover': {
//         borderColor: '#FF7C34',
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
//               (option) => option.value === selectedCity?.name
//             )}
//             placeholder="-- اختر المدينة --"
//             isClearable
//             isSearchable
//             theme={customTheme}
//             styles={customStyles}
//             className="w-full text-md text-start text-black rounded select-none z-40"
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
//                 (option) => option.value === selectedTown?.name
//               )}
//               placeholder="-- اختر البلدة --"
//               isClearable
//               isSearchable
//               theme={customTheme}
//               styles={customStyles}
//               className="w-full text-md text-start text-black rounded select-none z-30"
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

//       <div className="w-full h-72 sm:h-[500px] rounded-[5px] overflow-hidden shadow-lg relative">
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             setMapType(mapType === 'normal' ? 'satellite' : 'normal');
//           }}
//           className="absolute top-3 right-3 bg-white p-1 sm:p-2 rounded shadow-md text-black text-[10px] sm:text-md z-20"
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
//             <h1 className="sm:font-bold"> الموقع الذي قمت بتحديده:</h1>
//             {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
// 'use client';

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Tooltip,
//   useMapEvents,
//   ZoomControl,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { icon } from 'leaflet';
// import { useState, useRef, useEffect, useContext, useCallback } from 'react';
// import { inputsContext } from '../authContext/Context';
// import { cities } from '../lists/Cities';
// import Select from 'react-select';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   MapPin,
//   Building2,
//   Home,
//   Layers,
//   Search,
//   CheckCircle2,
//   MapPinned,
//   Navigation,
//   Compass,
//   Info,
//   X,
//   ChevronDown,
//   Sparkles,
// } from 'lucide-react';

// // Custom marker icon
// const customIcon = icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
//   iconSize: [38, 38],
//   iconAnchor: [19, 38],
//   popupAnchor: [0, -38],
// });

// // Selected marker icon with different color
// const selectedIcon = icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
//   iconSize: [45, 45],
//   iconAnchor: [22, 45],
//   popupAnchor: [0, -45],
// });

// // Map click event handler component
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
//     <Marker position={position} icon={selectedIcon}>
//       <Tooltip
//         permanent
//         direction="top"
//         offset={[0, -45]}
//         className="custom-tooltip"
//       >
//         <div className="flex items-center space-x-1 rtl:space-x-reverse">
//           <CheckCircle2 className="w-4 h-4 text-[#8e44ad]" />
//           <span>موقع العقار المحدد</span>
//         </div>
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
//     propertyTownLocation || propertyCityLocation || [34.8021, 38.9968]
//   );
//   const [selectedCity, setSelectedCity] = useState(chosenCity || null);
//   const [selectedTown, setSelectedTown] = useState(chosentown || null);
//   const { dispatch } = useContext(inputsContext);
//   const mapRef = useRef();
//   const [mapType, setMapType] = useState('normal');
//   const [showTip, setShowTip] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCoordinates, setShowCoordinates] = useState(false);

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: 'spring', stiffness: 300, damping: 24 },
//     },
//   };

//   useEffect(() => {
//     // Simulate loading state
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (lat && lng) {
//       const newLocation = [Number.parseFloat(lat), Number.parseFloat(lng)];
//       setSelectedLocation(newLocation);

//       if (mapRef.current) {
//         const map = mapRef.current;
//         map.setView(newLocation, 14);
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
//       setShowCoordinates(true);
//     },
//     [dispatch]
//   );

//   const handleCityChange = useCallback((selectedOption) => {
//     const city = cities?.find((c) => c.name === selectedOption?.value);
//     setSelectedCity(city);
//     setSelectedTown(null);

//     if (city && mapRef?.current) {
//       const map = mapRef?.current;
//       map.setView(city?.latlng, 12);
//       setSelectedLocation(city.latlng);
//       setShowCoordinates(true);
//     }
//   }, []);

//   const handleTownChange = useCallback(
//     (selectedOption) => {
//       const town = selectedCity?.towns.find(
//         (t) => t.name === selectedOption.value
//       );
//       setSelectedTown(town);

//       if (town && mapRef?.current) {
//         const map = mapRef?.current;
//         map.setView(town?.latlng, 14);
//         setSelectedLocation(town?.latlng);
//         setShowCoordinates(true);
//       }
//     },
//     [selectedCity]
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
//     borderRadius: 8,
//     colors: {
//       ...theme.colors,
//       primary: '#8e44ad',
//       primary25: '#f3e5f5',
//     },
//   });

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       height: 'auto',
//       backgroundColor: 'white',
//       boxShadow: state.isFocused ? '0 0 0 2px #8e44ad' : 'none',
//       borderColor: state.isFocused ? '#8e44ad' : '#e2e8f0',
//       '&:hover': {
//         borderColor: '#8e44ad',
//       },
//       transition: 'all 0.2s ease',
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       padding: '8px 12px',
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? '#8e44ad'
//         : state.isFocused
//         ? '#f3e5f5'
//         : 'white',
//       color: state.isSelected ? 'white' : '#333',
//       '&:hover': {
//         backgroundColor: state.isSelected ? '#8e44ad' : '#f3e5f5',
//       },
//     }),
//     dropdownIndicator: (provided, state) => ({
//       ...provided,
//       transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
//       transition: 'transform 0.2s ease',
//     }),
//   };

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="w-full bg-white rounded-xl shadow-lg p-6 overflow-hidden"
//     >
//       {/* Header */}
//       <motion.div variants={itemVariants} className="mb-6">
//         <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
//           <div className="p-2 bg-[#8e44ad]/10 rounded-full">
//             <MapPin className="w-6 h-6 text-[#8e44ad]" />
//           </div>
//           <h2 className="text-xl font-bold text-gray-800">
//             حدد الموقع على الخريطة
//           </h2>
//         </div>

//         <p className="text-gray-600 text-sm">
//           اختر المدينة من القائمة ثم اختر المنطقة من القائمة الثانية ثم قم بعمل
//           زووم على الخريطة واضغط على الموقع بدقة
//         </p>
//       </motion.div>

//       {/* Tip message */}
//       <AnimatePresence>
//         {showTip && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="bg-[#f3e5f5] border-l-4 border-[#8e44ad] p-4 mb-6 rounded-md flex items-start"
//           >
//             <Info className="w-5 h-5 text-[#8e44ad] shrink-0 mt-0.5 mr-2" />
//             <div className="flex-1">
//               <p className="text-sm text-gray-700">
//                 يمكنك تحديد الموقع بدقة عن طريق الضغط مباشرة على الخريطة بعد
//                 اختيار المدينة والمنطقة
//               </p>
//             </div>
//             <button
//               onClick={() => setShowTip(false)}
//               className="shrink-0 text-gray-500 hover:text-gray-700"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* City and Town Selection */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <motion.div variants={itemVariants} className="relative z-30">
//           <label className="flex items-center mb-2 text-gray-700 font-medium">
//             <Building2 className="w-4 h-4 text-[#8e44ad] mr-1" />
//             اختر المدينة:
//           </label>
//           <div className="relative">
//             <Select
//               options={cityOptions}
//               onChange={handleCityChange}
//               value={cityOptions.find(
//                 (option) => option.value === selectedCity?.name
//               )}
//               placeholder="-- اختر المدينة --"
//               isClearable
//               isSearchable
//               theme={customTheme}
//               styles={customStyles}
//               className="w-full text-gray-800 rounded-md"
//               classNamePrefix="select"
//               components={{
//                 DropdownIndicator: (props) => (
//                   <div {...props.innerProps}>
//                     <ChevronDown className="w-4 h-4 text-gray-500 mr-2" />
//                   </div>
//                 ),
//                 IndicatorSeparator: () => null,
//               }}
//             />
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//               <Search className="w-4 h-4 text-gray-400" />
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           className={`relative z-20 ${
//             !selectedCity ? 'opacity-50' : 'opacity-100'
//           }`}
//         >
//           <label className="flex items-center mb-2 text-gray-700 font-medium">
//             <Home className="w-4 h-4 text-[#8e44ad] mr-1" />
//             اختر البلدة:
//           </label>
//           <div className="relative">
//             <Select
//               options={townOptions}
//               onChange={handleTownChange}
//               value={townOptions.find(
//                 (option) => option.value === selectedTown?.name
//               )}
//               placeholder="-- اختر البلدة --"
//               isClearable
//               isSearchable
//               isDisabled={!selectedCity}
//               theme={customTheme}
//               styles={customStyles}
//               className="w-full text-gray-800 rounded-md"
//               classNamePrefix="select"
//               components={{
//                 DropdownIndicator: (props) => (
//                   <div {...props.innerProps}>
//                     <ChevronDown className="w-4 h-4 text-gray-500 mr-2" />
//                   </div>
//                 ),
//                 IndicatorSeparator: () => null,
//               }}
//             />
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//               <Search className="w-4 h-4 text-gray-400" />
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Map Container */}
//       <motion.div
//         variants={itemVariants}
//         className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200"
//       >
//         {/* Loading overlay */}
//         <AnimatePresence>
//           {isLoading && (
//             <motion.div
//               initial={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 bg-white z-50 flex items-center justify-center"
//             >
//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 border-4 border-t-[#8e44ad] border-b-[#8e44ad] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
//                 <p className="mt-4 text-gray-600">جاري تحميل الخريطة...</p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Map type toggle button */}
//         <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() =>
//               setMapType(mapType === 'normal' ? 'satellite' : 'normal')
//             }
//             className="bg-white px-3 py-2 rounded-lg shadow-md text-gray-800 text-sm flex items-center space-x-2 rtl:space-x-reverse"
//           >
//             <Layers className="w-4 h-4 text-[#8e44ad]" />
//             <span>
//               {mapType === 'normal'
//                 ? 'عرض القمر الصناعي'
//                 : 'عرض الخريطة العادية'}
//             </span>
//           </motion.button>

//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className="bg-white px-3 py-2 rounded-lg shadow-md text-gray-800 text-sm flex items-center space-x-2 rtl:space-x-reverse"
//           >
//             <Compass className="w-4 h-4 text-[#8e44ad]" />
//             <span>اضغط على الخريطة لتحديد الموقع</span>
//           </motion.div>
//         </div>

//         {/* Map */}
//         <MapContainer
//           center={selectedLocation}
//           zoom={7}
//           className="w-full h-full z-10"
//           ref={mapRef}
//           zoomControl={false}
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

//           <ZoomControl position="bottomright" />
//           <AddMarker onLocationSelect={handleLocationSelect} />

//           {/* Existing markers */}
//           {lat && lng && (
//             <Marker
//               position={[Number.parseFloat(lat), Number.parseFloat(lng)]}
//               icon={customIcon}
//             >
//               <Tooltip
//                 direction="top"
//                 offset={[0, -38]}
//                 className="custom-tooltip"
//               >
//                 <div className="flex items-center space-x-1 rtl:space-x-reverse">
//                   <MapPinned className="w-4 h-4 text-[#8e44ad]" />
//                   <span>موقع العقار المحدد</span>
//                 </div>
//               </Tooltip>
//             </Marker>
//           )}

//           {selectedCity && (
//             <Marker position={selectedCity.latlng} icon={customIcon}>
//               <Tooltip
//                 direction="top"
//                 offset={[0, -38]}
//                 className="custom-tooltip"
//               >
//                 <div className="flex items-center space-x-1 rtl:space-x-reverse">
//                   <Building2 className="w-4 h-4 text-[#8e44ad]" />
//                   <span>محافظة {selectedCity.name}</span>
//                 </div>
//               </Tooltip>
//             </Marker>
//           )}

//           {selectedTown && (
//             <Marker position={selectedTown.latlng} icon={customIcon}>
//               <Tooltip
//                 direction="top"
//                 offset={[0, -38]}
//                 className="custom-tooltip"
//               >
//                 <div className="flex items-center space-x-1 rtl:space-x-reverse">
//                   <Home className="w-4 h-4 text-[#8e44ad]" />
//                   <span>منطقة {selectedTown.name}</span>
//                 </div>
//               </Tooltip>
//             </Marker>
//           )}
//         </MapContainer>

//         {/* Decorative elements */}
//         <div className="absolute bottom-4 left-4 opacity-10 pointer-events-none">
//           <Sparkles className="w-20 h-20 text-[#8e44ad]" />
//         </div>
//       </motion.div>

//       {/* Coordinates display */}
//       <AnimatePresence>
//         {selectedLocation && showCoordinates && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 24 }}
//             className="mt-6 bg-[#f3e5f5] rounded-lg p-4 border border-[#8e44ad]/20"
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                 <div className="p-2 bg-[#8e44ad]/20 rounded-full">
//                   <Navigation className="w-5 h-5 text-[#8e44ad]" />
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-800">
//                     الموقع الذي قمت بتحديده:
//                   </h3>
//                   <div className="flex items-center mt-1 space-x-2 rtl:space-x-reverse">
//                     <span className="text-[#8e44ad] font-mono font-medium">
//                       {selectedLocation[0].toFixed(5)}
//                     </span>
//                     <span className="text-gray-500">،</span>
//                     <span className="text-[#8e44ad] font-mono font-medium">
//                       {selectedLocation[1].toFixed(5)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowCoordinates(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Global CSS for custom tooltips */}
//       <style jsx global>{`
//         .custom-tooltip {
//           background-color: white;
//           border: none;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//           padding: 5px 10px;
//           border-radius: 4px;
//           font-size: 12px;
//           font-weight: 500;
//         }

//         .custom-tooltip::before {
//           border-top-color: white;
//         }

//         .leaflet-container {
//           font-family: inherit;
//         }
//       `}</style>
//     </motion.div>
//   );
// }
'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { inputsContext } from '../authContext/Context';
import { cities } from '../lists/Cities';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  Layers,
  Search,
  CheckCircle2,
  MapPinned,
  Navigation,
  Compass,
  Info,
  X,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

// Custom marker icon
const customIcon = icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Selected marker icon with different color
const selectedIcon = icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

// Map click event handler component
function AddMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect([lat, lng]);
    },
  });

  return position ? (
    <Marker position={position} icon={selectedIcon}>
      <Tooltip
        permanent
        direction="top"
        offset={[0, -45]}
        className="custom-tooltip"
      >
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <CheckCircle2 className="w-4 h-4 text-orange-500" />
          <span>موقع العقار المحدد</span>
        </div>
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
}) {
  const [selectedLocation, setSelectedLocation] = useState(
    propertyTownLocation || propertyCityLocation || [34.8021, 38.9968]
  );
  const [selectedCity, setSelectedCity] = useState(chosenCity || null);
  const [selectedTown, setSelectedTown] = useState(chosentown || null);
  const { dispatch } = useContext(inputsContext);
  const mapRef = useRef();
  const [mapType, setMapType] = useState('normal');
  const [showTip, setShowTip] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [activeTab, setActiveTab] = useState('map');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (lat && lng) {
      const newLocation = [Number.parseFloat(lat), Number.parseFloat(lng)];
      setSelectedLocation(newLocation);

      if (mapRef.current) {
        const map = mapRef.current;
        map.setView(newLocation, 14);
      }
    }
  }, [lat, lng]);

  useEffect(() => {
    if (propertyCityLocation) {
      setSelectedLocation(propertyCityLocation);
    }
    if (propertyTownLocation) {
      setSelectedLocation(propertyTownLocation);
    }
  }, [propertyCityLocation, propertyTownLocation]);

  const handleLocationSelect = useCallback(
    (location) => {
      setSelectedLocation(location);
      dispatch({ type: 'LOCATION', payload: location });
      setShowCoordinates(true);
    },
    [dispatch]
  );

  const handleCityChange = useCallback((selectedOption) => {
    const city = cities?.find((c) => c.name === selectedOption?.value);
    setSelectedCity(city);
    setSelectedTown(null);

    if (city && mapRef?.current) {
      const map = mapRef?.current;
      map.setView(city?.latlng, 12);
      setSelectedLocation(city.latlng);
      setShowCoordinates(true);
    }
  }, []);

  const handleTownChange = useCallback(
    (selectedOption) => {
      const town = selectedCity?.towns.find(
        (t) => t.name === selectedOption.value
      );
      setSelectedTown(town);

      if (town && mapRef?.current) {
        const map = mapRef?.current;
        map.setView(town?.latlng, 14);
        setSelectedLocation(town?.latlng);
        setShowCoordinates(true);
      }
    },
    [selectedCity]
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
    borderRadius: 8,
    colors: {
      ...theme.colors,
      primary: '#f97316',
      primary25: '#ffedd5',
    },
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: 'auto',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: state.isFocused ? '0 0 0 2px #f97316' : 'none',
      borderColor: state.isFocused ? '#f97316' : 'rgba(255, 255, 255, 0.2)',
      '&:hover': {
        borderColor: '#f97316',
      },
      transition: 'all 0.2s ease',
      color: 'white',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '8px 12px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#f97316'
        : state.isFocused
        ? '#ffedd5'
        : '#1e293b',
      color: state.isSelected ? 'white' : state.isFocused ? '#1e293b' : 'white',
      '&:hover': {
        backgroundColor: state.isSelected ? '#f97316' : '#ffedd5',
        color: state.isSelected ? 'white' : '#1e293b',
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
      transition: 'transform 0.2s ease',
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1e293b',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.7)',
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
    }),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full bg-gradient-to-br from-orange-600 to-orange-900 rounded-xl shadow-2xl p-6 overflow-hidden relative"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -left-20 top-0 text-[300px] font-bold text-white opacity-20 rotate-90 origin-top-left">
            LOCATION
          </div>
        </div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-orange-400/20 blur-3xl"></div>
        <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-orange-300/10 blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 mb-8 flex justify-between items-start"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            LOCATION
          </h2>
          <p className="text-orange-200 text-sm max-w-md">
            اختر المدينة والمنطقة ثم حدد موقع العقار بدقة على الخريطة
          </p>
        </div>

        <div className="flex space-x-2 rtl:space-x-reverse">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'map'
                ? 'bg-orange-500 text-white'
                : 'bg-white/10 text-white/70'
            }`}
          >
            MAP
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('satellite')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'satellite'
                ? 'bg-orange-500 text-white'
                : 'bg-white/10 text-white/70'
            }`}
          >
            SATELLITE
          </motion.button>
        </div>
      </motion.div>

      {/* Tip message */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/10 backdrop-blur-md border-l-4 border-orange-500 p-4 mb-6 rounded-md flex items-start relative z-10"
          >
            <Info className="w-5 h-5 text-orange-300 shrink-0 mt-0.5 mr-2" />
            <div className="flex-1">
              <p className="text-sm text-orange-50">
                يمكنك تحديد الموقع بدقة عن طريق الضغط مباشرة على الخريطة بعد
                اختيار المدينة والمنطقة
              </p>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="shrink-0 text-orange-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* City and Town Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
        <motion.div variants={itemVariants} className="relative z-30">
          <label className="flex items-center mb-2 text-orange-100 font-medium">
            <Building2 className="w-4 h-4 text-orange-300 mr-1" />
            اختر المدينة:
          </label>
          <div className="relative">
            <Select
              options={cityOptions}
              onChange={handleCityChange}
              value={cityOptions.find(
                (option) => option.value === selectedCity?.name
              )}
              placeholder="-- اختر المدينة --"
              isClearable
              isSearchable
              theme={customTheme}
              styles={customStyles}
              className="w-full rounded-md"
              classNamePrefix="select"
              components={{
                DropdownIndicator: (props) => (
                  <div {...props.innerProps}>
                    <ChevronDown className="w-4 h-4 text-orange-300 mr-2" />
                  </div>
                ),
                IndicatorSeparator: () => null,
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 text-orange-300" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`relative z-20 ${
            !selectedCity ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <label className="flex items-center mb-2 text-orange-100 font-medium">
            <Home className="w-4 h-4 text-orange-300 mr-1" />
            اختر البلدة:
          </label>
          <div className="relative">
            <Select
              options={townOptions}
              onChange={handleTownChange}
              value={townOptions.find(
                (option) => option.value === selectedTown?.name
              )}
              placeholder="-- اختر البلدة --"
              isClearable
              isSearchable
              isDisabled={!selectedCity}
              theme={customTheme}
              styles={customStyles}
              className="w-full rounded-md"
              classNamePrefix="select"
              components={{
                DropdownIndicator: (props) => (
                  <div {...props.innerProps}>
                    <ChevronDown className="w-4 h-4 text-orange-300 mr-2" />
                  </div>
                ),
                IndicatorSeparator: () => null,
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 text-orange-300" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Map Container */}
      <motion.div
        variants={itemVariants}
        className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl border border-orange-400/20 relative z-10"
      >
        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-900 z-50 flex items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-t-orange-500 border-b-orange-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-orange-100">جاري تحميل الخريطة...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map type toggle button */}
        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setMapType(mapType === 'normal' ? 'satellite' : 'normal')
            }
            className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg text-white text-sm flex items-center space-x-2 rtl:space-x-reverse border border-white/20"
          >
            <Layers className="w-4 h-4 text-orange-300" />
            <span>
              {mapType === 'normal'
                ? 'عرض القمر الصناعي'
                : 'عرض الخريطة العادية'}
            </span>
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg text-white text-sm flex items-center space-x-2 rtl:space-x-reverse border border-white/20"
          >
            <Compass className="w-4 h-4 text-orange-300" />
            <span>اضغط على الخريطة لتحديد الموقع</span>
          </motion.div>
        </div>

        {/* Map */}
        <MapContainer
          center={selectedLocation}
          zoom={7}
          className="w-full h-full z-10"
          ref={mapRef}
          zoomControl={false}
        >
          {activeTab === 'map' ? (
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

          <ZoomControl position="bottomright" />
          <AddMarker onLocationSelect={handleLocationSelect} />

          {/* Existing markers */}
          {lat && lng && (
            <Marker
              position={[Number.parseFloat(lat), Number.parseFloat(lng)]}
              icon={customIcon}
            >
              <Tooltip
                direction="top"
                offset={[0, -38]}
                className="custom-tooltip"
              >
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <MapPinned className="w-4 h-4 text-orange-500" />
                  <span>موقع العقار المحدد</span>
                </div>
              </Tooltip>
            </Marker>
          )}

          {selectedCity && (
            <Marker position={selectedCity.latlng} icon={customIcon}>
              <Tooltip
                direction="top"
                offset={[0, -38]}
                className="custom-tooltip"
              >
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  <span>محافظة {selectedCity.name}</span>
                </div>
              </Tooltip>
            </Marker>
          )}

          {selectedTown && (
            <Marker position={selectedTown.latlng} icon={customIcon}>
              <Tooltip
                direction="top"
                offset={[0, -38]}
                className="custom-tooltip"
              >
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Home className="w-4 h-4 text-orange-500" />
                  <span>منطقة {selectedTown.name}</span>
                </div>
              </Tooltip>
            </Marker>
          )}
        </MapContainer>
      </motion.div>

      {/* Coordinates display */}
      <AnimatePresence>
        {selectedLocation && showCoordinates && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-orange-500/20 relative z-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="p-2 bg-orange-500/20 rounded-full">
                  <Navigation className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    الموقع الذي قمت بتحديده:
                  </h3>
                  <div className="flex items-center mt-1 space-x-2 rtl:space-x-reverse">
                    <span className="text-orange-300 font-mono font-medium">
                      {selectedLocation[0].toFixed(5)}
                    </span>
                    <span className="text-white/50">،</span>
                    <span className="text-orange-300 font-mono font-medium">
                      {selectedLocation[1].toFixed(5)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="text-orange-200 text-sm">
                  ID:{' '}
                  <span className="font-mono">
                    {Math.floor(Math.random() * 900000) + 100000}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCoordinates(false)}
                  className="text-orange-200 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-6 relative z-10">
        <div className="text-xs text-orange-200 flex space-x-4 rtl:space-x-reverse">
          <span>IN</span>
          <span>TW</span>
          <span>YT</span>
          <span>OS</span>
        </div>

        <div className="flex space-x-2 rtl:space-x-reverse">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-md border border-white/20"
          >
            Style
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-orange-500 text-white rounded-md shadow-lg shadow-orange-500/30"
          >
            Place Bid
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-white"
        >
          <span className="mr-1">Next</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Credits */}
      <div className="absolute top-6 left-6 text-xs text-orange-200/70 z-10">
        <div>CREDITS</div>
        <div>Design: OpenAI</div>
        <div>UI: Shadow-meta</div>
        <div>Producing: @nextjs</div>
      </div>

      {/* Global CSS for custom tooltips */}
      <style jsx global>{`
        .custom-tooltip {
          background-color: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          color: white;
        }

        .custom-tooltip::before {
          border-top-color: rgba(15, 23, 42, 0.8);
        }

        .leaflet-container {
          font-family: inherit;
        }

        .leaflet-control-zoom {
          border: none !important;
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px);
        }

        .leaflet-control-zoom a {
          background: transparent !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .leaflet-control-zoom a:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </motion.div>
  );
}
