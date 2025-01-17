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
import { cities } from './Cities';

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

export default function OnClickMap({
  chosenCity,
  chosentown,
  propertyCityLocation,
  propertyTownLocation,
}) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(chosenCity || null);
  const [selectedTown, setSelectedTown] = useState(chosentown || null);
  const { dispatch } = useContext(inputsContext);
  const mapRef = useRef(); // مرجع للخريطة

  useEffect(() => {
    dispatch({ type: 'LOCATION', payload: selectedLocation });
    if (chosenCity) {
      setSelectedCity(chosenCity);
    }
    if (chosentown) {
      setSelectedTown(chosentown);
    }
  }, [selectedLocation, chosenCity, chosentown]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    console.log('تم اختيار الموقع:', location);
  };

  const handleCityChange = (e) => {
    const city = cities.find((c) => c.name === e.target.value);
    setSelectedCity(city || null);
    setSelectedTown(null);

    if (city && city.latlng && mapRef.current) {
      mapRef.current.setView(city.latlng, city.zoom);
      setSelectedLocation(city.latlng);
    }
  };

  const handleTownChange = (e) => {
    if (!selectedCity || !selectedCity.towns) return;

    const town = selectedCity.towns.find((t) => t.name === e.target.value);
    setSelectedTown(town || null);

    if (town && town.latlng && mapRef.current) {
      mapRef.current.setView(town.latlng, town.zoom);
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
          className="border p-2 h-12 w-full text-black"
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
        <div className="mb-4 ">
          <label className="block font-medium mb-2">اختر البلدة:</label>
          <select
            className="border p-2 h-12 w-full text-black"
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

      <div className="w-full h-72 sm:h-[500px]  h-12-md overflow-hidden">
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
        <div className="mt-4 p-4 bg-gray-100 h-12 text-black">
          <p>
            <strong>موقع العقار الذي قمت بتحديده:</strong>{' '}
            {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
}
