'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { useEffect } from 'react';

// أيقونة مخصصة للدبابيس
const customIcon = icon({
  iconUrl:
    'https://images.vexels.com/media/users/3/131261/isolated/lists/b2e48580147ca0ed3f970f30bf8bb009-map-location-marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// مكون لضبط الزووم والانتقال
function SetZoomAndCenter({ latitude, longitude }) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], 16);
  }, [map, latitude, longitude]);

  return null;
}

export default function SyriaMap({ lng = '', lat = '' }) {
  // تحويل القيم إلى أرقام
  const latitude = parseFloat(lat) || 33.5138;
  const longitude = parseFloat(lng) || 36.2765;

  const tileLayers = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
  };

  return (
    <div className="w-full z-40">
      <div className="w-full h-72 sm:h-[500px] rounded-md overflow-hidden">
        <MapContainer
          key={`${latitude}-${longitude}`} // 🔹 هذا يحل المشكلة
          center={[latitude, longitude]}
          zoom={13}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileLayers.streets}
          />
          <Marker position={[latitude, longitude]} icon={customIcon}>
            <Popup closeButton={false}>موقع العقار هنا</Popup>
          </Marker>
          <SetZoomAndCenter latitude={latitude} longitude={longitude} />
        </MapContainer>
      </div>
    </div>
  );
}
