'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

export default function SyriaMap({ lng = '', lat = '' }) {
  // Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // State
  const [coords, setCoords] = useState({ lat: 33.5138, lng: 36.2765 });

  // Update coordinates when props change
  useEffect(() => {
    setCoords({
      lat: Number.parseFloat(lat) || 33.5138,
      lng: Number.parseFloat(lng) || 36.2765,
    });
  }, [lat, lng]);

  // Initialize and update map
  useEffect(() => {
    // Make sure we're on the client side
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet
    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;

      // Clean up any existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Create map instance
      const map = L.map(mapContainerRef.current).setView(
        [coords.lat, coords.lng],
        13
      );
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Create custom icon
      const customIcon = L.icon({
        iconUrl:
          'https://images.vexels.com/media/users/3/131261/isolated/lists/b2e48580147ca0ed3f970f30bf8bb009-map-location-marker.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Add marker
      const marker = L.marker([coords.lat, coords.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup('موقع العقار هنا');

      markerRef.current = marker;

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
    };
  }, [coords.lat, coords.lng]);

  return (
    <div className="w-full z-40">
      <div className="w-full h-72 sm:h-[500px] rounded-[5px] overflow-hidden">
        {/* Map container div */}
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{ position: 'relative' }}
        />
      </div>
    </div>
  );
}
