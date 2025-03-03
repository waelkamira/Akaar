'use client';
import React, { useState, useEffect } from 'react';

function CarSelector() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  // استرداد الماركات من NHTSA API
  useEffect(() => {
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json')
      .then((response) => response.json())
      .then((data) => {
        setBrands(data.Results);
      })
      .catch((error) => console.error('Error fetching brands:', error));
  }, []);

  // استرداد الموديلات بناءً على الماركة المختارة
  useEffect(() => {
    if (selectedBrand) {
      fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${selectedBrand}?format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          setModels(data.Results);
        })
        .catch((error) => console.error('Error fetching models:', error));
    }
  }, [selectedBrand]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* قائمة اختيار الماركة */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
          اختر ماركة السيارة:
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel(''); // إعادة تعيين الموديل عند تغيير الماركة
          }}
        >
          <option value="">-- اختر ماركة --</option>
          {brands.map((brand) => (
            <option key={brand.Make_ID} value={brand.Make_Name}>
              {brand.Make_Name}
            </option>
          ))}
        </select>
      </div>

      {/* قائمة اختيار الموديل */}
      {selectedBrand && (
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
            اختر موديل السيارة:
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">-- اختر موديل --</option>
            {models.map((model) => (
              <option key={model.Model_ID} value={model.Model_Name}>
                {model.Model_Name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* عرض الاختيارات النهائية */}
      {selectedBrand && selectedModel && (
        <div style={{ marginTop: '20px', fontSize: '18px' }}>
          <strong>اختيارك:</strong> {selectedBrand} - {selectedModel}
        </div>
      )}
    </div>
  );
}

export default CarSelector;
