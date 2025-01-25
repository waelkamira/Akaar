// 'use client';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { icon } from 'leaflet';
// import { useState, useRef, useEffect, useContext } from 'react';
// import { inputsContext } from '../Context';
// import { cities } from './Cities';

// // أيقونة مخصصة للدبابيس
// const customIcon = icon({
//   iconUrl:
//     'https://images.vexels.com/media/users/3/131261/isolated/lists/b2e48580147ca0ed3f970f30bf8bb009-map-location-marker.png',
//   iconSize: [30, 30],
// });

// // مكون لالتقاط الأحداث على الخريطة
// function AddMarker({ onLocationSelect }) {
//   const [position, setPosition] = useState(null);

//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setPosition([lat, lng]);
//       onLocationSelect([lat, lng]); // تمرير الإحداثيات إلى المكون الأب
//     },
//   });

//   return position ? (
//     <Marker position={position} icon={customIcon}>
//       <Popup>
//         موقع العقار: {position[0].toFixed(5)}, {position[1].toFixed(5)}
//       </Popup>
//     </Marker>
//   ) : null;
// }

// export default function OnClickMap({
//   chosenCity,
//   chosentown,
//   propertyCityLocation,
//   propertyTownLocation,
// }) {
//   const [selectedLocation, setSelectedLocation] = useState(
//     propertyTownLocation || propertyCityLocation || [34.8021, 38.9968]
//   );
//   const [selectedCity, setSelectedCity] = useState(chosenCity || null);
//   const [selectedTown, setSelectedTown] = useState(chosentown || null);
//   const { dispatch } = useContext(inputsContext);
//   const mapRef = useRef(); // مرجع للخريطة

//   useEffect(() => {
//     if (propertyCityLocation) {
//       setSelectedLocation(propertyCityLocation);
//     }
//     if (propertyTownLocation) {
//       setSelectedLocation(propertyTownLocation);
//     }
//   }, [propertyCityLocation, propertyTownLocation]);

//   const handleLocationSelect = (location) => {
//     setSelectedLocation(location);
//     dispatch({ type: 'LOCATION', payload: location });

//     console.log('تم اختيار الموقع:', location);
//   };

//   const handleCityChange = (e) => {
//     const city = cities.find((c) => c.name === e.target.value);
//     setSelectedCity(city);
//     setSelectedTown(null);

//     if (city && mapRef.current) {
//       const map = mapRef.current;
//       map.setView(city.latlng, city.zoom); // تحريك الخريطة إلى المحافظة وتحديد التكبير
//       setSelectedLocation(city.latlng);
//     }
//   };

//   const handleTownChange = (e) => {
//     const town = selectedCity.towns.find((t) => t.name === e.target.value);
//     setSelectedTown(town);

//     if (town && mapRef.current) {
//       const map = mapRef.current;
//       map.setView(town.latlng, town.zoom); // تحريك الخريطة إلى البلدة وتحديد التكبير
//       setSelectedLocation(town.latlng);
//     }
//   };

//   return (
//     <div className="w-full text-white">
//       <div className="my-4">
//         <h2 className="text-lg mb-4">
//           حدد موقع العقار على الخريطة أو أقرب نقطة لموقع العقار, قم بعمل زووم
//           على الخريطة بعد اختيار المحافظة ثم البلدة ثم اضغط على موقع العقار على
//           الخريطة بدقة
//         </h2>
//       </div>

//       {/* قوائم المحافظات والبلدات */}
//       <div className="mb-4 ">
//         <label className="block font-medium mb-2">اختر المحافظة:</label>
//         <select
//           className="w-full text-md text-start z-20 h-12 rounded-[5px] select-none text-black"
//           onChange={handleCityChange}
//           value={selectedCity?.name || ''}
//         >
//           <option value="">-- اختر المحافظة --</option>
//           {cities.map((city) => (
//             <option key={city.name} value={city.name || chosenCity}>
//               {city.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedCity && (
//         <div className="mb-4 ">
//           <label className="block font-medium mb-2">اختر البلدة:</label>
//           <select
//             className="border p-2 rounded w-full text-black"
//             onChange={handleTownChange}
//             value={selectedTown?.name || ''}
//           >
//             <option value="">-- اختر البلدة --</option>
//             {selectedCity?.towns?.map((town) => (
//               <option key={town.name} value={town.name || chosentown}>
//                 {town.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       <div className="w-full h-72 sm:h-[500px]  rounded-md overflow-hidden">
//         <MapContainer
//           center={selectedLocation} // مركز الخريطة الافتراضي
//           zoom={7}
//           className="w-full h-full"
//           ref={mapRef} // مرجع للخريطة
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <AddMarker onLocationSelect={handleLocationSelect} />
//           {/* دبوس المحافظة */}
//           {selectedCity && (
//             <Marker position={selectedCity.latlng} icon={customIcon}>
//               <Popup>موقع المحافظة: {selectedCity.name}</Popup>
//             </Marker>
//           )}
//           {/* دبوس البلدة */}
//           {selectedTown && (
//             <Marker position={selectedTown.latlng} icon={customIcon}>
//               <Popup>موقع البلدة: {selectedTown.name}</Popup>
//             </Marker>
//           )}
//         </MapContainer>
//       </div>

//       {selectedLocation && (
//         <div className="mt-4 p-4 bg-gray-100 rounded text-black">
//           <p>
//             <strong>موقع العقار الذي قمت بتحديده:</strong>{' '}
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
import { inputsContext } from '../Context';
import { cities } from './Cities';
import { FaMapMarkedAlt } from 'react-icons/fa';

// أيقونة مخصصة للدبوس الأحمر
const redIcon = icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // رابط أيقونة حمراء
  iconSize: [30, 30], // حجم الأيقونة
});

// مكون لالتقاط الأحداث على الخريطة
function AddMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect([lat, lng]); // تمرير الإحداثيات إلى المكون الأب
    },
  });

  return position ? (
    <Marker position={position} icon={redIcon}>
      <Tooltip permanent>موقع العقار هنا</Tooltip> {/* Tooltip دائم الظهور */}
    </Marker>
  ) : null;
}

export default function OnClickMap({
  chosenCity,
  chosentown,
  propertyCityLocation,
  propertyTownLocation,
}) {
  const [selectedLocation, setSelectedLocation] = useState(
    propertyTownLocation || propertyCityLocation || [34.8021, 38.9968]
  );
  const [selectedCity, setSelectedCity] = useState(chosenCity || null);
  const [selectedTown, setSelectedTown] = useState(chosentown || null);
  const { dispatch } = useContext(inputsContext);
  const mapRef = useRef(); // مرجع للخريطة

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
      console.log('تم اختيار الموقع:', location);
    },
    [dispatch]
  );

  const handleCityChange = useCallback((e) => {
    const city = cities.find((c) => c.name === e.target.value);
    setSelectedCity(city);
    setSelectedTown(null);

    if (city && mapRef.current) {
      const map = mapRef.current;
      map.setView(city.latlng, 10); // تكبير على المحافظة (zoom level 10)
      setSelectedLocation(city.latlng);
    }
  }, []);

  const handleTownChange = useCallback(
    (e) => {
      const town = selectedCity?.towns.find((t) => t.name === e.target.value);
      setSelectedTown(town);

      if (town && mapRef.current) {
        const map = mapRef.current;
        map.setView(town.latlng, 14); // تكبير أكبر على المنطقة (zoom level 14)
        setSelectedLocation(town.latlng);
      }
    },
    [selectedCity]
  );

  return (
    <div className="w-full text-white">
      <div className="flex flex-col justify-start items-start gap-2 w-full my-3">
        <div className="flex">
          {' '}
          <span className="flex text-one text-lg xl:text-2xl ml-2">
            <FaMapMarkedAlt />
          </span>
          <span className="flex text-sm sm:text-lg select-none text-nowrap text-white">
            {' '}
            حدد موقع عقارك على الخريطة :
          </span>{' '}
        </div>
        <h1 className="text-right text-sm sm:text-lg select-none text-white">
          اختر المدينة من القائمة ثم اختر المنطقة من القائمة الثانية او اقرب
          منطقة الى مكان عقارك ثم قم بعمل زووم على الخريطة واضغط على مكان عقارك
          بدقة{' '}
        </h1>
      </div>

      {/* قوائم المحافظات والبلدات */}
      <div className="mb-4">
        <label className="block font-medium mb-2">اختر المحافظة:</label>
        <select
          className="w-full text-md text-start z-20 h-12 rounded-[5px] select-none text-black bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          onChange={handleCityChange}
          value={selectedCity?.name || ''}
        >
          <option value="">-- اختر المحافظة --</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name || chosenCity}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div className="mb-4">
          <label className="block font-medium mb-2">اختر البلدة:</label>
          <select
            className="w-full text-md text-start z-20 h-12 rounded-[5px] select-none text-black bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            onChange={handleTownChange}
            value={selectedTown?.name || ''}
          >
            <option value="">-- اختر البلدة --</option>
            {selectedCity?.towns?.map((town) => (
              <option key={town.name} value={town.name || chosentown}>
                {town.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="w-full h-72 sm:h-[500px] rounded-md overflow-hidden shadow-lg">
        <MapContainer
          center={selectedLocation} // مركز الخريطة الافتراضي
          zoom={7}
          className="w-full h-full"
          ref={mapRef} // مرجع للخريطة
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AddMarker onLocationSelect={handleLocationSelect} />
          {/* دبوس المحافظة */}
          {selectedCity && (
            <Marker position={selectedCity.latlng} icon={redIcon}>
              <Tooltip permanent>موقع المحافظة: {selectedCity.name}</Tooltip>
            </Marker>
          )}
          {/* دبوس البلدة */}
          {selectedTown && (
            <Marker position={selectedTown.latlng} icon={redIcon}>
              <Tooltip permanent>موقع البلدة: {selectedTown.name}</Tooltip>
            </Marker>
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-black shadow-sm">
          <p>
            <h1 className="sm:font-bold">موقع العقار الذي قمت بتحديده:</h1>{' '}
            {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
}
