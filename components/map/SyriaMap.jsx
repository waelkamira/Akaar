// 'use client';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { icon } from 'leaflet';
// import { useEffect, useState } from 'react';
// // أيقونة مخصصة للدبابيس
// const customIcon = icon({
//   iconUrl:
//     'https://images.vexels.com/media/users/3/131261/isolated/lists/b2e48580147ca0ed3f970f30bf8bb009-map-location-marker.png',
//   iconSize: [40, 40],
//   iconAnchor: [20, 40],
//   popupAnchor: [0, -40],
// });
// // مكون لضبط الزووم والانتقال
// function SetZoomAndCenter({ latitude, longitude }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView([latitude, longitude], 16);
//   }, [latitude, longitude]); // إزالة `map` من التبعيات لتجنب الأخطاء
//   return null;
// }
// export default function SyriaMap({ lng = '', lat = '' }) {
//   // تحويل القيم إلى أرقام
//   const latitude = parseFloat(lat) || 33.5138;
//   const longitude = parseFloat(lng) || 36.2765;
//   const tileLayers = {
//     streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//     terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
//   };
//   // **إضافة `key` يجبر React على إعادة تحميل المكون فقط عند تغير `lat` أو `lng`**
//   return (
//     <div className="w-full z-40">
//       <div className="w-full h-72 sm:h-[500px] rounded-[5px] overflow-hidden">
//         <MapContainer
//           key={`${latitude}-${longitude}`} // ✅ يجعل الخريطة تعيد التحميل فقط عند تغير الإحداثيات
//           center={[latitude, longitude]}
//           zoom={13}
//           className="w-full h-full"
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url={tileLayers.streets}
//           />
//           <Marker position={[latitude, longitude]} icon={customIcon}>
//             <Popup closeButton={false}>موقع العقار هنا</Popup>
//           </Marker>
//           <SetZoomAndCenter latitude={latitude} longitude={longitude} />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }
'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { useEffect, useState } from 'react';

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
  }, [latitude, longitude]); // إزالة `map` من التبعيات لتجنب الأخطاء

  return null;
}

export default function SyriaMap({ lng = '', lat = '' }) {
  const [coords, setCoords] = useState({ lat: 33.5138, lng: 36.2765 });

  useEffect(() => {
    setCoords({
      lat: parseFloat(lat) || 33.5138,
      lng: parseFloat(lng) || 36.2765,
    });
  }, [lat, lng]); // ✅ تأخير التحديث حتى يتم التأكد من تغيير القيم

  return (
    <div key={`${coords.lat}-${coords.lng}`} className="w-full z-40">
      <div className="w-full h-72 sm:h-[500px] rounded-[5px] overflow-hidden">
        <MapContainer
          key={`${coords.lat}-${coords.lng}`}
          center={[coords.lat, coords.lng]}
          zoom={13}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
          />
          <Marker position={[coords.lat, coords.lng]} icon={customIcon}>
            <Popup closeButton={false}>موقع العقار هنا</Popup>
          </Marker>
          <SetZoomAndCenter latitude={coords.lat} longitude={coords.lng} />
        </MapContainer>
      </div>
    </div>
  );
}
