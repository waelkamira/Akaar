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
import { useState, useRef } from 'react';
import CitySelector from './CitySelector';

const customIcon = icon({
  iconUrl:
    'https://images.vexels.com/media/users/3/131261/isolated/lists/b2e48580147ca0ed3f970f30bf8bb009-map-location-marker.png',
  iconSize: [30, 30],
});

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
    <Marker position={position} icon={customIcon}>
      <Popup>
        موقع العقار: {position[0].toFixed(5)}, {position[1].toFixed(5)}
      </Popup>
    </Marker>
  ) : null;
}

export default function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const mapRef = useRef();

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedLocation(city?.latlng || [34.8021, 38.9968]); // Default location
    if (mapRef.current && city?.latlng) {
      mapRef.current.setView(city.latlng, city.zoom || 7);
    }
  };

  const handleTownSelect = (town) => {
    setSelectedTown(town);
    setSelectedLocation(town?.latlng || [34.8021, 38.9968]); // Default location
    if (mapRef.current && town?.latlng) {
      mapRef.current.setView(town.latlng, town.zoom || 10);
    }
  };

  return (
    <div>
      <CitySelector
        onSelectCity={handleCitySelect}
        onSelectTown={handleTownSelect}
      />
      <div className="w-full h-72 sm:h-[500px] rounded-md overflow-hidden">
        <MapContainer
          center={selectedLocation || [34.8021, 38.9968]}
          zoom={7}
          className="w-full h-full"
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AddMarker onLocationSelect={setSelectedLocation} />
          {selectedCity?.latlng && (
            <Marker position={selectedCity.latlng} icon={customIcon}>
              <Popup>موقع المحافظة: {selectedCity.name}</Popup>
            </Marker>
          )}
          {selectedTown?.latlng && (
            <Marker position={selectedTown.latlng} icon={customIcon}>
              <Popup>موقع البلدة: {selectedTown.name}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
