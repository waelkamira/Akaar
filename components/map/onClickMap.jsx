'use client';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { useState, useRef, useEffect, useContext } from 'react';
import { inputsContext } from '../Context';

// قائمة المحافظات السورية والبلدات الرئيسية
const cities = [
  {
    name: 'دمشق',
    latlng: [33.5138, 36.2765],
    zoom: 12, // مستوى التكبير عند اختيار المحافظة
    towns: [
      { name: 'المزة', latlng: [33.505, 36.2782], zoom: 14 },
      { name: 'كفرسوسة', latlng: [33.493, 36.2743], zoom: 14 },
    ],
  },
  {
    name: 'حلب',
    latlng: [36.2021, 37.1343],
    zoom: 12,
    towns: [
      { name: 'منبج', latlng: [36.5287, 37.9561], zoom: 14 },
      { name: 'عفرين', latlng: [36.5111, 36.8667], zoom: 14 },
    ],
  },
  {
    name: 'حمص',
    latlng: [34.7324, 36.7139],
    zoom: 12,
    towns: [
      { name: 'الرستن', latlng: [34.9212, 36.7321], zoom: 14 },
      { name: 'تلبيسة', latlng: [34.8396, 36.7312], zoom: 14 },
    ],
  },
];

// أيقونة مخصصة للدبابيس
const customIcon = icon({
  iconUrl:
    'https://images.vexels.com/media/users/3/131261/isolated/lists/b2e48580147ca0ed3f970f30bf8bb009-map-location-marker.png',
  iconSize: [30, 30],
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
    <Marker position={position} icon={customIcon}>
      <Popup>
        موقع العقار: {position[0].toFixed(5)}, {position[1].toFixed(5)}
      </Popup>
    </Marker>
  ) : null;
}

export default function OnClickMap() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const { dispatch } = useContext(inputsContext);
  const mapRef = useRef(); // مرجع للخريطة
  console.log('selectedLocation', selectedLocation);

  useEffect(() => {
    dispatch({ type: 'LOCATION', payload: selectedLocation });
  }, [selectedLocation]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    console.log('تم اختيار الموقع:', location);
  };

  const handleCityChange = (e) => {
    const city = cities.find((c) => c.name === e.target.value);
    setSelectedCity(city);
    setSelectedTown(null);

    if (city && mapRef.current) {
      const map = mapRef.current;
      map.setView(city.latlng, city.zoom); // تحريك الخريطة إلى المحافظة وتحديد التكبير
      setSelectedLocation(city.latlng);
    }
  };

  const handleTownChange = (e) => {
    const town = selectedCity.towns.find((t) => t.name === e.target.value);
    setSelectedTown(town);

    if (town && mapRef.current) {
      const map = mapRef.current;
      map.setView(town.latlng, town.zoom); // تحريك الخريطة إلى البلدة وتحديد التكبير
      setSelectedLocation(town.latlng);
    }
  };

  return (
    <div className="w-full text-white">
      <div className="my-4">
        <h2 className="text-lg font-bold mb-4">
          حدد موقع العقار على الخريطة أو أقرب نقطة لموقع العقار, قم بعمل زووم
          على الخريطة بعد اختيار المحافظة ثم البلدة ثم اضغط على موقع العقار على
          الخريطة بدقة
        </h2>
      </div>

      {/* قوائم المحافظات والبلدات */}
      <div className="mb-4 ">
        <label className="block font-medium mb-2">اختر المحافظة:</label>
        <select
          className="border p-2 rounded w-full text-black"
          onChange={handleCityChange}
          value={selectedCity?.name || ''}
        >
          <option value="">-- اختر المحافظة --</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div className="mb-4 ">
          <label className="block font-medium mb-2">اختر البلدة:</label>
          <select
            className="border p-2 rounded w-full text-black"
            onChange={handleTownChange}
            value={selectedTown?.name || ''}
          >
            <option value="">-- اختر البلدة --</option>
            {selectedCity.towns.map((town) => (
              <option key={town.name} value={town.name}>
                {town.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="w-full h-72 sm:h-[500px]  rounded-md overflow-hidden">
        <MapContainer
          center={selectedLocation || [34.8021, 38.9968]} // مركز الخريطة الافتراضي على سوريا أو الموقع المحدد
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
            <Marker position={selectedCity.latlng} icon={customIcon}>
              <Popup>موقع المحافظة: {selectedCity.name}</Popup>
            </Marker>
          )}
          {/* دبوس البلدة */}
          {selectedTown && (
            <Marker position={selectedTown.latlng} icon={customIcon}>
              <Popup>موقع البلدة: {selectedTown.name}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-black">
          <p>
            <strong>موقع العقار الذي قمت بتحديده:</strong>{' '}
            {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
}
