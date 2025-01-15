'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { useEffect } from 'react';

// أيقونة مخصصة للدبابيس مع حجم أكبر ولون أحمر
const customIcon = icon({
  iconUrl:
    'https://images.vexels.com/media/users/3/131261/isolated/lists/b2e48580147ca0ed3f970f30bf8bb009-map-location-marker.png',
  iconSize: [40, 40], // تكبير الحجم
  iconAnchor: [20, 40], // مركز الأيقونة على القاعدة
  popupAnchor: [0, -40], // جعل البوب-أب يظهر فوق الدبوس
});

// مكون لإدارة الزووم والانتقال
function SetZoomAndCenter({ latitude, longitude }) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], 16); // تحديد الموقع والتكبير إلى 16
  }, [map, latitude, longitude]);

  return null;
}

export default function SyriaMap({ lng = '', lat = '' }) {
  // التأكد من تحويل lng و lat إلى أرقام باستخدام parseFloat
  const latitude = parseFloat(lat) || 33.5138; // القيمة الافتراضية لسوريا إذا كانت فارغة
  const longitude = parseFloat(lng) || 36.2765; // القيمة الافتراضية لسوريا إذا كانت فارغة

  const tileLayers = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
  };

  return (
    <div className="w-full">
      {/* الخريطة التفاعلية */}
      <div className="w-full h-[500px] rounded-md overflow-hidden ">
        <MapContainer
          center={[latitude, longitude]} // استخدام القيم المحوّلة
          zoom={13} // التكبير الافتراضي
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileLayers.streets} // أو tileLayers.terrain حسب اختيار المستخدم
          />
          {/* إضافة دبوس في الموقع المحدد */}
          <Marker position={[latitude, longitude]} icon={customIcon}>
            <Popup closeButton={false}>موقع العقار هنا</Popup>{' '}
            {/* إغلاق البوب-أب يدويًا */}
          </Marker>

          {/* استخدام SetZoomAndCenter لضبط الزووم والانتقال */}
          <SetZoomAndCenter latitude={latitude} longitude={longitude} />
        </MapContainer>
      </div>
    </div>
  );
}
