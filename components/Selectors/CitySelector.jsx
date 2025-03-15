// 'use client';
// import React, { useState, useEffect, useContext } from 'react';
// import Select from 'react-select';
// import { cities } from '../lists/Cities';
// import { GiModernCity } from 'react-icons/gi';
// import { FaTreeCity } from 'react-icons/fa6';
// import { inputsContext } from '../Context';

// export default function CitySelector({ check }) {
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedTown, setSelectedTown] = useState(null);
//   const { dispatch } = useContext(inputsContext);
//   const [minHeight, setMinHeight] = useState('48px');

//   useEffect(() => {
//     if (selectedCity?.value && selectedCity?.latlng) {
//       dispatch({
//         type: 'PROPERTY_CITY',
//         payload: {
//           propertyCity: selectedCity?.value,
//         },
//       });
//     }

//     if (selectedTown?.value && selectedTown?.latlng) {
//       dispatch({
//         type: 'PROPERTY_TOWN',
//         payload: {
//           propertyTown: selectedTown.value,
//         },
//       });
//     }
//   }, [selectedCity, selectedTown]);

//   const cityOptions = cities.map((city) => ({
//     value: city?.name,
//     label: city?.name,
//     latlng: city?.latlng || [0, 0],
//     towns: (city?.towns || []).map((town) => ({
//       value: town?.name,
//       label: town?.name,
//       latlng: town?.latlng || [0, 0],
//     })),
//   }));

//   const handleCityChange = (selectedOption) => {
//     setSelectedCity(selectedOption);
//     setSelectedTown(null);
//   };

//   const handleTownChange = (selectedOption) => {
//     setSelectedTown(selectedOption);
//   };

//   function customTheme(theme) {
//     return {
//       ...theme,
//       borderRadius: 5,
//       colors: {
//         ...theme.colors,
//         primary: '#FF7C34',
//         primary25: '#fadfae',
//       },
//     };
//   }

//   const customStyles = {
//     control: (provided, state) => ({
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

//   // ✅ تخصيص النص داخل الحقل عند اختيار قيمة
//   const CitySingleValue = ({ data }) => (
//     <div className="flex items-center gap-2">
//       <GiModernCity className="text-one text-lg" />
//       {data.label}
//     </div>
//   );

//   const TownSingleValue = ({ data }) => (
//     <div className="flex items-center gap-2">
//       <FaTreeCity className="text-one text-lg" />
//       {data.label}
//     </div>
//   );

//   // ✅ تخصيص النص داخل الحقل عند عدم اختيار أي قيمة
//   const CityPlaceholder = () => (
//     <div className="flex items-center gap-2 text-gray-500">
//       <GiModernCity className="text-one text-lg" />
//       <span>المدينة</span>
//     </div>
//   );

//   const TownPlaceholder = () => (
//     <div className="flex items-center gap-2 text-gray-500">
//       <FaTreeCity className="text-one text-lg" />
//       <span>المنطقة</span>
//     </div>
//   );

//   return (
//     <div className="flex flex-col sm:flex-row gap-2 w-full justify-start items-center">
//       <div className="w-full">
//         <Select
//           value={selectedCity}
//           onChange={handleCityChange}
//           options={cityOptions}
//           isClearable
//           isSearchable
//           theme={customTheme}
//           styles={customStyles}
//           className="w-full min-w-56 text-md text-start text-black rounded select-none z-[100]"
//           classNamePrefix="select"
//           components={{
//             SingleValue: CitySingleValue,
//             Placeholder: CityPlaceholder,
//           }}
//         />
//       </div>

//       <div className="w-full">
//         <Select
//           value={selectedTown}
//           onChange={handleTownChange}
//           options={selectedCity?.towns || []}
//           isClearable
//           isSearchable
//           isDisabled={!selectedCity}
//           theme={customTheme}
//           styles={customStyles}
//           className="w-full min-w-56 text-md text-start text-black rounded select-none z-[99]"
//           classNamePrefix="select"
//           components={{
//             SingleValue: TownSingleValue,
//             Placeholder: TownPlaceholder,
//           }}
//         />
//       </div>
//     </div>
//   );
// }
'use client';
import React, { useState, useEffect, useContext } from 'react';
import { cities } from '../lists/Cities';
import { inputsContext } from '../authContext/Context';

export default function CitySelector({ check }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const { dispatch } = useContext(inputsContext);

  useEffect(() => {
    if (selectedCity) {
      dispatch({
        type: 'PROPERTY_CITY',
        payload: { propertyCity: selectedCity },
      });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedTown) {
      dispatch({
        type: 'PROPERTY_TOWN',
        payload: { propertyTown: selectedTown },
      });
    }
  }, [selectedTown]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedTown(''); // إعادة تعيين المنطقة عند تغيير المدينة
  };

  const handleTownChange = (e) => {
    setSelectedTown(e.target.value);
  };

  const selectedCityData = cities.find((city) => city.name === selectedCity);

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-start items-center text-sm">
      {/* قائمة المدن */}
      <div className="w-full sm:w-28">
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full sm:w-28 border rounded focus:outline-2 focus:outline-one bg-white text-black h-8 sm:h-[27px] px-2"
        >
          <option value="" disabled>
            المدينة
          </option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* قائمة المناطق */}
      <div className="w-full sm:w-28">
        <select
          value={selectedTown}
          onChange={handleTownChange}
          className="w-full sm:w-28 border rounded focus:outline-2 focus:outline-one bg-white text-black h-8 sm:h-[27px] px-2"
          disabled={!selectedCity}
        >
          <option value="" disabled>
            المنطقة
          </option>
          {selectedCityData?.towns.map((town) => (
            <option key={town.name} value={town.name}>
              {town.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
