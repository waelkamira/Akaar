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
//             <span className="sm:font-bold"> الموقع الذي قمت بتحديده:</span>
//             {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
// components/OnClickMap.jsx
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
import { inputsContext } from '../authContext/Context';
import { cities } from '../lists/Cities';
import { FaMapMarkedAlt } from 'react-icons/fa';
import Select from 'react-select';
import { GiModernCity } from 'react-icons/gi';
import { FaTreeCity } from 'react-icons/fa6';

// --- Fix for default Leaflet Icon ---
// Sometimes the default icon paths break with bundlers. This explicitly sets them.
// You might only need this if the default blue markers are broken.
// If your redIcon works fine, you might not strictly need this part.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
// --- End Icon Fix ---

// أيقونة مخصصة للدبوس الأحمر
const redIcon = icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Make sure this URL is valid and accessible
  iconSize: [30, 30],
  iconAnchor: [15, 30], // Anchor point at the bottom center of the icon
  popupAnchor: [0, -30], // Anchor for popups relative to iconAnchor
});

// مكون لالتقاط الأحداث على الخريطة
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
    <Marker position={position} icon={redIcon} className="relative">
      <Tooltip
        permanent
        direction="top" // More conventional direction
        offset={[0, -30]} // Offset tooltip above the icon anchor
        className="z-50" // Removed fixed width and margin for better auto-sizing
      >
        موقع العقار هنا
      </Tooltip>
    </Marker>
  ) : null;
}

export default function OnClickMap({
  chosenCity, // Pass the city *object* or just its name
  chosentown, // Pass the town *object* or just its name
  propertyCityLocation, // [lat, lng] array
  propertyTownLocation, // [lat, lng] array
  lat, // string or number
  lng, // string or number
}) {
  // Initial location logic: prioritize specific lat/lng, then town, then city, then default
  const getInitialLocation = () => {
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      return [parseFloat(lat), parseFloat(lng)];
    }
    if (propertyTownLocation) return propertyTownLocation;
    if (propertyCityLocation) return propertyCityLocation;
    const initialCity = cities.find((c) => c.name === chosenCity?.name); // Use name if object passed
    if (initialCity) return initialCity.latlng;
    return [34.8021, 38.9968]; // Default Syria coordinates
  };

  const [selectedLocation, setSelectedLocation] = useState(
    getInitialLocation()
  );
  const [selectedCity, setSelectedCity] = useState(
    cities.find(
      (c) =>
        c.name ===
        (typeof chosenCity === 'string' ? chosenCity : chosenCity?.name)
    ) || null
  );
  const [selectedTown, setSelectedTown] = useState(
    selectedCity?.towns.find(
      (t) =>
        t.name ===
        (typeof chosentown === 'string' ? chosentown : chosentown?.name)
    ) || null
  );

  const { dispatch } = useContext(inputsContext);
  const mapRef = useRef();
  const [minHeight, setMinHeight] = useState('20px');
  const [mapType, setMapType] = useState('normal'); // 'normal' or 'satellite'

  // Effect for responsive select height
  useEffect(() => {
    const updateSize = () => {
      // Check window exists - belt-and-braces check, although dynamic import should prevent server execution
      if (typeof window !== 'undefined') {
        setMinHeight(window.innerWidth >= 640 ? '48px' : '20px'); // sm: 640px
      }
    };

    updateSize(); // Initial call
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Effect to update map view when lat/lng props change
  useEffect(() => {
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      const newLocation = [parseFloat(lat), parseFloat(lng)];
      setSelectedLocation(newLocation); // Also update the selected location state

      if (mapRef.current) {
        mapRef.current.setView(newLocation, 15); // Zoom closer (e.g., 15) for specific coords
      }
    }
  }, [lat, lng]);

  // Effect to update location if initial property locations are provided (runs once)
  // This might conflict with the lat/lng effect if both are provided initially.
  // Consider consolidating the initial location logic.
  useEffect(() => {
    const initialLoc = getInitialLocation();
    setSelectedLocation(initialLoc);
    // Optional: setView on initial load based on props
    // if (mapRef.current) {
    //    const initialZoom = (lat && lng) ? 15 : (propertyTownLocation ? 14 : (propertyCityLocation ? 12 : 7));
    //    mapRef.current.setView(initialLoc, initialZoom);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyCityLocation, propertyTownLocation]); // Dependencies for initial setup

  const handleLocationSelect = useCallback(
    (location) => {
      setSelectedLocation(location);
      dispatch({ type: 'LOCATION', payload: location });
    },
    [dispatch]
  );

  const handleCityChange = useCallback((selectedOption) => {
    const city = cities?.find((c) => c.name === selectedOption?.value);
    setSelectedCity(city);
    setSelectedTown(null); // Reset town when city changes

    if (city && mapRef?.current) {
      const map = mapRef?.current;
      const cityLatLng = city.latlng;
      map.setView(cityLatLng, 12); // Zoom to city level
      // Don't automatically set marker location to city center, let user click
      // setSelectedLocation(cityLatLng);
    } else if (!city && mapRef?.current) {
      // Optional: Zoom out or reset view if city is cleared
      mapRef.current.setView([34.8021, 38.9968], 7);
    }
  }, []); // No dependencies needed if cities list is static

  const handleTownChange = useCallback(
    (selectedOption) => {
      const town = selectedCity?.towns.find(
        (t) => t.name === selectedOption?.value
      );
      setSelectedTown(town);

      if (town && mapRef?.current) {
        const map = mapRef?.current;
        const townLatLng = town.latlng;
        map.setView(townLatLng, 14); // Zoom to town level
        // Don't automatically set marker location to town center
        // setSelectedLocation(townLatLng);
      } else if (!town && selectedCity && mapRef?.current) {
        // Optional: Zoom back to city level if town is cleared
        mapRef.current.setView(selectedCity.latlng, 12);
      }
    },
    [selectedCity] // Depends on the currently selected city
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
      primary: '#FF7C34',
      primary25: '#fadfae',
    },
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: minHeight,
      height: 'auto', // Allow height to adjust based on minHeight
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#FF7C34' : '#A1A5AD', // Use provided border color or focused color
      boxShadow: state.isFocused ? `0 0 0 1px #FF7C34` : 'none', // Add focus ring
      '&:hover': {
        borderColor: '#FF7C34',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      minHeight: minHeight, // Ensure consistency
      height: minHeight, // Match height
      padding: '0 1rem',
      display: 'flex',
      alignItems: 'center',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px', // Reset margin if needed
      padding: '0px', // Reset padding
    }),
    indicatorSeparator: () => ({ display: 'none' }), // Hide separator
    indicatorsContainer: (provided) => ({
      ...provided,
      height: minHeight, // Match height
      minHeight: minHeight, // Ensure consistency
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 55, // Ensure dropdown is above map controls
    }),
  };

  return (
    <div className="w-full ">
      {/* Input Section */}
      <div className="mb-6 space-y-4">
        {' '}
        {/* Added margin-bottom and spacing */}
        <div className="flex flex-col justify-start items-start gap-2 w-full">
          <div className="flex items-center">
            {' '}
            {/* Align icon and text */}
            <span className="flex text-primary-500 text-lg xl:text-2xl ml-2">
              <FaMapMarkedAlt />
            </span>
            <span className="flex text-sm sm:text-lg select-none text-nowrap font-medium">
              {' '}
              {/* Added font-medium */}
              حدد الموقع على الخريطة :
            </span>
          </div>
          <p className="text-right text-xs sm:text-sm select-none text-gray-600">
            {' '}
            {/* Adjusted text size/color */}
            اختر المدينة والمنطقة المطلوبة, ثم قم بتقريب الخريطة (Zoom) وانقر
            بدقة على موقع العقار.
          </p>
        </div>
        {/* City Select */}
        <div className="relative z-50">
          {' '}
          {/* Increased z-index */}
          <label className="flex items-center text-right mb-2 text-sm sm:text-base select-none text-nowrap font-medium">
            {' '}
            {/* Adjusted size/weight */}
            <span className="text-primary-500 text-lg xl:text-xl ml-2">
              {' '}
              {/* Adjusted icon size */}
              <GiModernCity />
            </span>
            اختر المدينة:
          </label>
          <Select
            instanceId="city-select" // Added for SSR hydration safety with react-select
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
            className="w-full text-sm sm:text-base text-start text-black rounded select-none"
            classNamePrefix="select"
          />
        </div>
        {/* Town Select (Conditional) */}
        {selectedCity && (
          <div className="relative z-40">
            {' '}
            {/* Adjusted z-index */}
            <label className="flex items-center text-right mb-2 text-sm sm:text-base select-none text-nowrap font-medium">
              <span className="text-primary-500 text-lg xl:text-xl ml-2">
                <FaTreeCity />
              </span>
              اختر المنطقة/البلدة:
            </label>
            <Select
              instanceId="town-select" // Added for SSR hydration safety
              options={townOptions}
              onChange={handleTownChange}
              value={townOptions.find(
                (option) => option.value === selectedTown?.name
              )}
              placeholder="-- اختر المنطقة --"
              isClearable
              isSearchable
              isDisabled={!selectedCity || townOptions.length === 0} // Disable if no city or no towns
              theme={customTheme}
              styles={customStyles}
              className="w-full text-sm sm:text-base text-start text-black rounded select-none"
              classNamePrefix="select"
            />
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="w-full h-72 sm:h-[500px] rounded-[5px] overflow-hidden shadow-lg relative border border-gray-200">
        {' '}
        {/* Added border */}
        {/* Map Type Toggle Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setMapType(mapType === 'normal' ? 'satellite' : 'normal');
          }}
          // Style the button better
          className="absolute top-2.5 right-2.5 bg-white p-1.5 sm:p-2 rounded border border-gray-300 shadow-md text-gray-700 text-[10px] sm:text-xs z-[400] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
          aria-label={
            mapType === 'normal'
              ? 'Switch to Satellite View'
              : 'Switch to Map View'
          } // Accessibility
        >
          {mapType === 'normal' ? 'عرض القمر الصناعي' : 'عرض الخريطة العادية'}
        </button>
        {/* Map Container */}
        <MapContainer
          center={selectedLocation}
          zoom={selectedCity ? (selectedTown ? 14 : 12) : 7} // Adjust initial zoom based on selection
          className="w-full h-full z-10" // Ensure map is below controls
          ref={mapRef} // Assign ref
          scrollWheelZoom={true} // Default is true, explicitly set
        >
          {/* Tile Layers */}
          {mapType === 'normal' ? (
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='© <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" // 's' for satellite
              maxZoom={20} // Google Satellite often supports higher zoom
            />
          )}

          {/* Component to add marker on click */}
          <AddMarker onLocationSelect={handleLocationSelect} />

          {/* Marker for specific lat/lng props (if provided and different from AddMarker) */}
          {/* Consider if you need this AND AddMarker's marker */}
          {lat &&
            lng &&
            !isNaN(parseFloat(lat)) &&
            !isNaN(parseFloat(lng)) &&
            (selectedLocation[0] !== parseFloat(lat) ||
              selectedLocation[1] !== parseFloat(lng)) && (
              <Marker
                position={[parseFloat(lat), parseFloat(lng)]}
                icon={redIcon}
              >
                <Tooltip direction="top" offset={[0, -30]}>
                  موقع العقار المحدد مسبقاً
                </Tooltip>
              </Marker>
            )}

          {/* Optional: Markers for City/Town Centers (Consider if needed) */}
          {/*
          {selectedCity && (
            <Marker position={selectedCity.latlng} icon={L.icon({ iconUrl: '/path/to/city-icon.png', ... })} >
              <Tooltip permanent>مركز مدينة {selectedCity.name}</Tooltip>
            </Marker>
          )}
          {selectedTown && (
            <Marker position={selectedTown.latlng} icon={L.icon({ iconUrl: '/path/to/town-icon.png', ... })}>
              <Tooltip permanent>مركز منطقة {selectedTown.name}</Tooltip>
            </Marker>
          )}
          */}
        </MapContainer>
      </div>

      {/* Display Selected Coordinates */}
      {selectedLocation && (
        <div className="mt-4 p-3 bg-gray-50 rounded shadow-sm border border-gray-200 text-sm sm:text-base">
          {' '}
          {/* Adjusted styling */}
          <p className="text-gray-800">
            <span className="font-medium">الموقع المحدد على الخريطة:</span>{' '}
            <span className="font-mono text-gray-600">
              {' '}
              {/* Use mono for coords */}
              {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
