// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { FaMapMarkedAlt } from 'react-icons/fa';
// import { GiModernCity } from 'react-icons/gi';
// import { FaTreeCity } from 'react-icons/fa6';
// import Select from 'react-select';
// import { cities } from '../lists/Cities';
// import { inputsContext } from '../authContext/Context';
// import { useContext } from 'react';

// // Import Leaflet CSS
// import 'leaflet/dist/leaflet.css';

// export default function LeafletMap({
//   chosenCity,
//   chosentown,
//   propertyCityLocation,
//   propertyTownLocation,
//   lat,
//   lng,
// }) {
//   // Refs
//   const mapContainerRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markersRef = useRef([]);

//   // State
//   const [selectedLocation, setSelectedLocation] = useState(
//     propertyTownLocation || propertyCityLocation || [34.8021, 38.9968]
//   );
//   const [selectedCity, setSelectedCity] = useState(chosenCity || null);
//   const [selectedTown, setSelectedTown] = useState(chosentown || null);
//   const [minHeight, setMinHeight] = useState('20px');
//   const [mapType, setMapType] = useState('normal');
//   const { dispatch } = useContext(inputsContext);

//   // Initialize map when component mounts
//   useEffect(() => {
//     // Make sure Leaflet is available (client-side only)
//     if (typeof window === 'undefined') return;

//     // Dynamically import Leaflet
//     const loadLeaflet = async () => {
//       const L = (await import('leaflet')).default;

//       // Clean up any existing map
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }

//       // Clear markers array
//       markersRef.current = [];

//       // Create map instance
//       const initialLocation = selectedLocation || [34.8021, 38.9968];
//       const map = L.map(mapContainerRef.current).setView(initialLocation, 14);
//       mapInstanceRef.current = map;

//       // Add tile layer based on map type
//       if (mapType === 'normal') {
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution:
//             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//         }).addTo(map);
//       } else {
//         L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
//           attribution:
//             '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
//         }).addTo(map);
//       }

//       // Create custom icon
//       const redIcon = L.icon({
//         iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
//         iconSize: [30, 30],
//       });

//       // Add markers for lat/lng if provided
//       if (lat && lng) {
//         const marker = L.marker(
//           [Number.parseFloat(lat), Number.parseFloat(lng)],
//           { icon: redIcon }
//         )
//           .addTo(map)
//           .bindTooltip('موقع العقار المحدد', { permanent: true });
//         markersRef.current.push(marker);
//       }

//       // Add markers for city if provided
//       if (selectedCity && selectedCity.latlng) {
//         const marker = L.marker(selectedCity.latlng, { icon: redIcon })
//           .addTo(map)
//           .bindTooltip(`موقع محافظة ${selectedCity.name}`, { permanent: true });
//         markersRef.current.push(marker);
//       }

//       // Add markers for town if provided
//       if (selectedTown && selectedTown.latlng) {
//         const marker = L.marker(selectedTown.latlng, { icon: redIcon })
//           .addTo(map)
//           .bindTooltip(`موقع منطقة ${selectedTown.name}`, { permanent: true });
//         markersRef.current.push(marker);
//       }

//       // Handle map clicks
//       map.on('click', (e) => {
//         const { lat, lng } = e.latlng;
//         const newLocation = [lat, lng];

//         // Remove any existing click markers
//         markersRef.current = markersRef.current.filter((marker) => {
//           if (marker._isClickMarker) {
//             marker.remove();
//             return false;
//           }
//           return true;
//         });

//         // Add new marker
//         const marker = L.marker([lat, lng], { icon: redIcon })
//           .addTo(map)
//           .bindTooltip('موقع العقار هنا', { permanent: true });

//         // Mark this as a click marker for later filtering
//         marker._isClickMarker = true;
//         markersRef.current.push(marker);

//         // Update state and dispatch location
//         setSelectedLocation(newLocation);
//         dispatch({ type: 'LOCATION', payload: newLocation });
//       });

//       // Force a map redraw after mounting
//       setTimeout(() => {
//         map.invalidateSize();
//       }, 100);
//     };

//     loadLeaflet();

//     // Cleanup function
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, [lat, lng, selectedCity, selectedTown, mapType, dispatch]);

//   // Update min height based on screen size
//   useEffect(() => {
//     const updateSize = () => {
//       setMinHeight(window.innerWidth >= 640 ? '48px' : '20px');
//     };

//     updateSize();
//     window.addEventListener('resize', updateSize);

//     return () => window.removeEventListener('resize', updateSize);
//   }, []);

//   // Handle city selection
//   const handleCityChange = (selectedOption) => {
//     const city = cities?.find((c) => c.name === selectedOption?.value);
//     setSelectedCity(city);
//     setSelectedTown(null);

//     if (city && city.latlng && mapInstanceRef.current) {
//       mapInstanceRef.current.setView(city.latlng, 12);
//       setSelectedLocation(city.latlng);
//     }
//   };

//   // Handle town selection
//   const handleTownChange = (selectedOption) => {
//     const town = selectedCity?.towns.find(
//       (t) => t.name === selectedOption.value
//     );
//     setSelectedTown(town);

//     if (town && town.latlng && mapInstanceRef.current) {
//       mapInstanceRef.current.setView(town.latlng, 14);
//       setSelectedLocation(town.latlng);
//     }
//   };

//   // Toggle map type
//   const toggleMapType = () => {
//     setMapType((prev) => (prev === 'normal' ? 'satellite' : 'normal'));
//   };

//   // Prepare options for select components
//   const cityOptions = cities?.map((city) => ({
//     value: city?.name,
//     label: city?.name,
//   }));

//   const townOptions =
//     selectedCity?.towns?.map((town) => ({
//       value: town?.name,
//       label: town?.name,
//     })) || [];

//   // Custom theme for react-select
//   const customTheme = (theme) => ({
//     ...theme,
//     borderRadius: 5,
//     colors: {
//       ...theme.colors,
//       primary: '#FF7C34',
//       primary25: '#fadfae',
//     },
//   });

//   // Custom styles for react-select
//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: minHeight,
//       height: 'auto',
//       backgroundColor: 'white',
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
//     <div className="w-full">
//       <div className="flex flex-col justify-start items-start gap-2 w-full my-3">
//         <div className="flex">
//           <span className="flex text-primary-500 text-lg xl:text-2xl ml-2">
//             <FaMapMarkedAlt />
//           </span>
//           <span className="flex text-sm sm:text-lg select-none text-nowrap">
//             حدد الموقع على الخريطة :
//           </span>
//         </div>
//         <h1 className="text-right text-sm sm:text-lg select-none">
//           اختر المدينة من القائمة ثم اختر المنطقة من القائمة الثانية ثم قم بعمل
//           زووم على الخريطة واضغط على الموقع بدقة
//         </h1>
//       </div>

//       {/* City Selection */}
//       <div className="mb-4 relative z-50">
//         <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap">
//           <span className="text-primary-500 text-lg xl:text-2xl ml-2">
//             <GiModernCity />
//           </span>
//           اختر المدينة:
//         </label>
//         <Select
//           options={cityOptions}
//           onChange={handleCityChange}
//           value={cityOptions.find(
//             (option) => option.value === selectedCity?.name
//           )}
//           placeholder="-- اختر المدينة --"
//           isClearable
//           isSearchable
//           theme={customTheme}
//           styles={customStyles}
//           className="w-full text-md text-start text-black rounded select-none z-40"
//           classNamePrefix="select"
//           classNames={{
//             control: (state) =>
//               `${
//                 state.isFocused ? 'border-primary-500' : 'border-gray-300'
//               } sm:h-12 h-9 w-full`,
//           }}
//         />
//       </div>

//       {/* Town Selection */}
//       {selectedCity && (
//         <div className="mb-4 relative z-40">
//           <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap">
//             <span className="text-primary-500 text-lg xl:text-2xl ml-2">
//               <FaTreeCity />
//             </span>
//             اختر البلدة:
//           </label>
//           <Select
//             options={townOptions}
//             onChange={handleTownChange}
//             value={townOptions.find(
//               (option) => option.value === selectedTown?.name
//             )}
//             placeholder="-- اختر البلدة --"
//             isClearable
//             isSearchable
//             theme={customTheme}
//             styles={customStyles}
//             className="w-full text-md text-start text-black rounded select-none z-30"
//             classNamePrefix="select"
//             classNames={{
//               control: (state) =>
//                 `${
//                   state.isFocused ? 'border-primary-500' : 'border-gray-300'
//                 } sm:h-12 h-9 w-full`,
//             }}
//           />
//         </div>
//       )}

//       {/* Map Container */}
//       <div className="w-full h-72 sm:h-[500px] rounded-[5px] overflow-hidden shadow-lg relative">
//         <button
//           onClick={toggleMapType}
//           className="absolute top-3 right-3 bg-white p-1 sm:p-2 rounded shadow-md text-black text-[10px] sm:text-md z-20"
//         >
//           {mapType === 'normal' ? 'عرض القمر الصناعي' : 'عرض الخريطة العادية'}
//         </button>

//         {/* Map container div */}
//         <div
//           ref={mapContainerRef}
//           className="w-full h-full z-10"
//           style={{ position: 'relative' }}
//         />
//       </div>

//       {/* Display selected location */}
//       {selectedLocation && (
//         <div className="mt-4 p-4 bg-white rounded shadow-sm border border-gray-300">
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

import { useEffect, useRef, useState } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { GiModernCity } from 'react-icons/gi';
import { FaTreeCity } from 'react-icons/fa6';
import Select from 'react-select';
import { cities } from '../lists/Cities';
import { inputsContext } from '../authContext/Context';
import { useContext } from 'react';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({
  chosenCity,
  chosentown,
  propertyCityLocation,
  propertyTownLocation,
  lat,
  lng,
}) {
  // Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const syriaRectangleRef = useRef(null);

  // State
  const [selectedLocation, setSelectedLocation] = useState(
    propertyTownLocation || propertyCityLocation || [35.0, 38.5] // Center of Syria
  );
  const [selectedCity, setSelectedCity] = useState(chosenCity || null);
  const [selectedTown, setSelectedTown] = useState(chosentown || null);
  const [minHeight, setMinHeight] = useState('20px');
  const [mapType, setMapType] = useState('normal');
  const { dispatch } = useContext(inputsContext);

  // Initialize map when component mounts
  useEffect(() => {
    // Make sure Leaflet is available (client-side only)
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet
    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;

      // Clean up any existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Clear markers array
      markersRef.current = [];

      // Create map instance
      const initialLocation = selectedLocation || [35.0, 38.5]; // Center of Syria

      // Determine appropriate zoom level
      // If specific location is provided, zoom closer
      // Otherwise, show all of Syria
      const hasSpecificLocation =
        (lat && lng) ||
        propertyTownLocation ||
        propertyCityLocation ||
        selectedCity ||
        selectedTown;
      const initialZoom = hasSpecificLocation ? 14 : 7;

      const map = L.map(mapContainerRef.current).setView(
        initialLocation,
        initialZoom
      );
      mapInstanceRef.current = map;

      // Add tile layer based on map type
      if (mapType === 'normal') {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      } else {
        L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          attribution:
            '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
        }).addTo(map);
      }

      // Add Syria border (approximate) if no specific location is provided
      if (!hasSpecificLocation) {
        const syriaBounds = [
          [32.31, 35.7], // Southwest corner
          [37.32, 42.4], // Northeast corner
        ];

        // // Add a rectangle to highlight Syria
        // syriaRectangleRef.current = L.rectangle(syriaBounds, {
        //   color: '#ff7c34',
        //   weight: 2,
        //   fillColor: '#ff7c34',
        //   fillOpacity: 0.1,
        // }).addTo(map);
      }

      // Create custom icon
      const redIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [30, 30],
      });

      // Add markers for lat/lng if provided
      if (lat && lng) {
        const marker = L.marker(
          [Number.parseFloat(lat), Number.parseFloat(lng)],
          { icon: redIcon }
        )
          .addTo(map)
          .bindTooltip('موقع العقار المحدد', { permanent: true });
        markersRef.current.push(marker);
      }

      // Add markers for city if provided
      if (selectedCity && selectedCity.latlng) {
        const marker = L.marker(selectedCity.latlng, { icon: redIcon })
          .addTo(map)
          .bindTooltip(`موقع محافظة ${selectedCity.name}`, { permanent: true });
        markersRef.current.push(marker);
      }

      // Add markers for town if provided
      if (selectedTown && selectedTown.latlng) {
        const marker = L.marker(selectedTown.latlng, { icon: redIcon })
          .addTo(map)
          .bindTooltip(`موقع منطقة ${selectedTown.name}`, { permanent: true });
        markersRef.current.push(marker);
      }

      // Handle map clicks
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        const newLocation = [lat, lng];

        // Remove Syria rectangle if it exists
        if (syriaRectangleRef.current) {
          syriaRectangleRef.current.remove();
          syriaRectangleRef.current = null;
        }

        // Remove any existing click markers
        markersRef.current = markersRef.current.filter((marker) => {
          if (marker._isClickMarker) {
            marker.remove();
            return false;
          }
          return true;
        });

        // Add new marker
        const marker = L.marker([lat, lng], { icon: redIcon })
          .addTo(map)
          .bindTooltip('موقع العقار هنا', { permanent: true });

        // Mark this as a click marker for later filtering
        marker._isClickMarker = true;
        markersRef.current.push(marker);

        // Update state and dispatch location
        setSelectedLocation(newLocation);
        dispatch({ type: 'LOCATION', payload: newLocation });
      });

      // Force a map redraw after mounting
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    loadLeaflet();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      syriaRectangleRef.current = null;
    };
  }, [
    lat,
    lng,
    selectedCity,
    selectedTown,
    mapType,
    dispatch,
    propertyTownLocation,
    propertyCityLocation,
  ]);

  // Update min height based on screen size
  useEffect(() => {
    const updateSize = () => {
      setMinHeight(window.innerWidth >= 640 ? '48px' : '20px');
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    const city = cities?.find((c) => c.name === selectedOption?.value);
    setSelectedCity(city);
    setSelectedTown(null);

    if (city && city.latlng && mapInstanceRef.current) {
      // Remove Syria rectangle if it exists
      if (syriaRectangleRef.current) {
        syriaRectangleRef.current.remove();
        syriaRectangleRef.current = null;
      }

      mapInstanceRef.current.setView(city.latlng, 12);
      setSelectedLocation(city.latlng);
    }
  };

  // Handle town selection
  const handleTownChange = (selectedOption) => {
    const town = selectedCity?.towns.find(
      (t) => t.name === selectedOption.value
    );
    setSelectedTown(town);

    if (town && town.latlng && mapInstanceRef.current) {
      // Remove Syria rectangle if it exists
      if (syriaRectangleRef.current) {
        syriaRectangleRef.current.remove();
        syriaRectangleRef.current = null;
      }

      mapInstanceRef.current.setView(town.latlng, 14);
      setSelectedLocation(town.latlng);
    }
  };

  // Toggle map type
  const toggleMapType = () => {
    setMapType((prev) => (prev === 'normal' ? 'satellite' : 'normal'));
  };

  // Prepare options for select components
  const cityOptions = cities?.map((city) => ({
    value: city?.name,
    label: city?.name,
  }));

  const townOptions =
    selectedCity?.towns?.map((town) => ({
      value: town?.name,
      label: town?.name,
    })) || [];

  // Custom theme for react-select
  const customTheme = (theme) => ({
    ...theme,
    borderRadius: 5,
    colors: {
      ...theme.colors,
      primary: '#FF7C34',
      primary25: '#fadfae',
    },
  });

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: minHeight,
      height: 'auto',
      backgroundColor: 'white',
      '&:hover': {
        borderColor: '#FF7C34',
      },
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

  return (
    <div className="w-full">
      <div className="flex flex-col justify-start items-start gap-2 w-full my-3">
        <div className="flex">
          <span className="flex text-primary-500 text-lg xl:text-2xl ml-2">
            <FaMapMarkedAlt />
          </span>
          <span className="flex text-sm sm:text-lg select-none text-nowrap">
            حدد الموقع على الخريطة :
          </span>
        </div>
        <h1 className="text-right text-sm sm:text-lg select-none">
          اختر المدينة من القائمة ثم اختر المنطقة من القائمة الثانية ثم قم بعمل
          زووم على الخريطة واضغط على الموقع بدقة
        </h1>
      </div>

      {/* City Selection */}
      <div className="mb-4 relative z-50">
        <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap">
          <span className="text-primary-500 text-lg xl:text-2xl ml-2">
            <GiModernCity />
          </span>
          اختر المدينة:
        </label>
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
          className="w-full text-md text-start text-black rounded select-none z-40"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-primary-500' : 'border-gray-300'
              } sm:h-12 h-9 w-full`,
          }}
        />
      </div>

      {/* Town Selection */}
      {selectedCity && (
        <div className="mb-4 relative z-40">
          <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap">
            <span className="text-primary-500 text-lg xl:text-2xl ml-2">
              <FaTreeCity />
            </span>
            اختر البلدة:
          </label>
          <Select
            options={townOptions}
            onChange={handleTownChange}
            value={townOptions.find(
              (option) => option.value === selectedTown?.name
            )}
            placeholder="-- اختر البلدة --"
            isClearable
            isSearchable
            theme={customTheme}
            styles={customStyles}
            className="w-full text-md text-start text-black rounded select-none z-30"
            classNamePrefix="select"
            classNames={{
              control: (state) =>
                `${
                  state.isFocused ? 'border-primary-500' : 'border-gray-300'
                } sm:h-12 h-9 w-full`,
            }}
          />
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-72 sm:h-[500px] rounded-[5px] overflow-hidden shadow-lg relative">
        <button
          onClick={toggleMapType}
          className="absolute top-3 right-3 bg-white p-1 sm:p-2 rounded shadow-md text-black text-[10px] sm:text-md z-20"
        >
          {mapType === 'normal' ? 'عرض القمر الصناعي' : 'عرض الخريطة العادية'}
        </button>

        {/* Map container div */}
        <div
          ref={mapContainerRef}
          className="w-full h-full z-10"
          style={{ position: 'relative' }}
        />
      </div>

      {/* Display selected location */}
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
