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
import Select from 'react-select';
import { GiModernCity } from 'react-icons/gi';
import { FaTreeCity } from 'react-icons/fa6';

// أيقونة مخصصة للدبوس الأحمر
const redIcon = icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
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
    <Marker position={position} icon={redIcon}>
      <Tooltip permanent>موقع العقار هنا</Tooltip>
    </Marker>
  ) : null;
}

export default function OnClickMap({
  chosenCity,
  chosentown,
  propertyCityLocation,
  propertyTownLocation,
  lat,
  lng,
}) {
  const [selectedLocation, setSelectedLocation] = useState(
    propertyTownLocation || propertyCityLocation || [34.8021, 38.9968]
  );
  const [selectedCity, setSelectedCity] = useState(chosenCity || null);
  const [selectedTown, setSelectedTown] = useState(chosentown || null);
  const { dispatch } = useContext(inputsContext);
  const mapRef = useRef();
  const [minHeight, setMinHeight] = useState('20px');

  useEffect(() => {
    const updateSize = () => {
      setMinHeight(window.innerWidth >= 640 ? '48px' : '20px'); // sm: 640px
    };

    updateSize(); // استدعاء أولي عند التحميل
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (lat && lng) {
      const newLocation = [parseFloat(lat), parseFloat(lng)];
      setSelectedLocation(newLocation);

      // عمل زووم على الموقع الجديد
      if (mapRef.current) {
        const map = mapRef.current;
        map.setView(newLocation, 14); // مستوى الزووم 14
      }
    }
  }, [lat, lng]);

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
    },
    [dispatch]
  );

  const handleCityChange = useCallback((selectedOption) => {
    const city = cities?.find((c) => c.name === selectedOption?.value);
    setSelectedCity(city);
    setSelectedTown(null);

    if (city && mapRef?.current) {
      const map = mapRef?.current;
      map.setView(city?.latlng, 12);
      setSelectedLocation(city.latlng);
    }
  }, []);

  const handleTownChange = useCallback(
    (selectedOption) => {
      const town = selectedCity?.towns.find(
        (t) => t.name === selectedOption.value
      );
      setSelectedTown(town);

      if (town && mapRef?.current) {
        const map = mapRef?.current;
        map.setView(town?.latlng, 14);
        setSelectedLocation(town?.latlng);
      }
    },
    [selectedCity]
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
      primary: '#ffa500',
      primary25: '#fadfae',
    },
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: minHeight,
      height: 'auto',
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#ffa500' : '#d1d5db',
      '&:hover': {
        borderColor: '#ffa500',
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
    <div className="w-full text-white">
      {!lat && !lng && (
        <>
          <div className="flex flex-col justify-start items-start gap-2 w-full my-3">
            <div className="flex">
              <span className="flex text-one text-lg xl:text-2xl ml-2">
                <FaMapMarkedAlt />
              </span>
              <span className="flex text-sm sm:text-lg select-none text-nowrap text-white">
                حدد موقع عقارك على الخريطة :
              </span>
            </div>
            <h1 className="text-right text-sm sm:text-lg select-none text-white">
              اختر المدينة من القائمة ثم اختر المنطقة من القائمة الثانية او اقرب
              منطقة الى مكان عقارك ثم قم بعمل زووم على الخريطة واضغط على مكان
              عقارك بدقة
            </h1>
          </div>
          <div className="mb-4 relative z-50">
            <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap">
              <span className="text-one text-lg xl:text-2xl ml-2">
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
              className="w-full text-md text-start rounded-[5px] select-none text-black"
              classNamePrefix="select"
              classNames={{
                control: (state) =>
                  `${
                    state.isFocused ? 'border-orange-500' : 'border-gray-300'
                  } sm:h-12 h-8 w-full`,
              }}
            />
          </div>
          {selectedCity && (
            <div className="mb-4 relative z-40">
              <label className="flex text-right mb-2 text-lg sm:text-md select-none text-nowrap">
                <span className="text-one text-lg xl:text-2xl ml-2">
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
                className="w-full text-md text-start rounded-[5px] select-none text-black"
                classNamePrefix="select"
                classNames={{
                  control: (state) =>
                    `${
                      state.isFocused ? 'border-orange-500' : 'border-gray-300'
                    } sm:h-12 h-8 w-full`,
                }}
              />
            </div>
          )}
        </>
      )}

      <div className="w-full h-72 sm:h-[500px] rounded-md overflow-hidden shadow-lg relative z-30">
        <MapContainer
          center={selectedLocation}
          zoom={7}
          className="w-full h-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AddMarker onLocationSelect={handleLocationSelect} />
          {/* دبوس للإحداثيات المحددة */}
          {lat && lng && (
            <Marker
              position={[parseFloat(lat), parseFloat(lng)]}
              icon={redIcon}
            >
              <Tooltip permanent>موقع العقار المحدد</Tooltip>
            </Marker>
          )}
          {/* دبوس المحافظة */}
          {selectedCity && (
            <Marker position={selectedCity.latlng} icon={redIcon}>
              <Tooltip permanent>موقع محافظة {selectedCity.name}</Tooltip>
            </Marker>
          )}
          {/* دبوس البلدة */}
          {selectedTown && (
            <Marker position={selectedTown.latlng} icon={redIcon}>
              <Tooltip permanent>موقع منطقة {selectedTown.name}</Tooltip>
            </Marker>
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-black shadow-sm">
          <p>
            <h1 className="sm:font-bold">موقع العقار الذي قمت بتحديده:</h1>{' '}
            {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}{' '}
          </p>
        </div>
      )}
    </div>
  );
}
