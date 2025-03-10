// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Select from 'react-select';
// import { IoIosArrowBack } from 'react-icons/io';
// import categories from '../Categories/categories';
// import { FaTreeCity } from 'react-icons/fa6';
// import { GiModernCity } from 'react-icons/gi';
// import { TbCategoryPlus } from 'react-icons/tb';

// const CategoriesNavBar = () => {
//   const router = useRouter();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [minHeight, setMinHeight] = useState('48px');

//   // دالة لمعالجة اختيار الفئة
//   const handleCategoryChange = (selectedOption) => {
//     setSelectedCategory(selectedOption); // تحديث الحالة بالفئة المختارة
//     if (selectedOption) {
//       if (typeof window !== 'undefined') {
//         console.log('selectedOption', selectedOption);

//         // حفظ فقط القيم القابلة للتخزين بدون مكونات React
//         const { id, name, path } = selectedOption;
//         localStorage.setItem('category', JSON.stringify({ id, name, path }));
//       }
//       router.push(selectedOption.path); // توجيه المستخدم إلى المسار الخاص بالفئة المختارة
//     }
//   };

//   // تحويل قائمة الفئات إلى خيارات مناسبة لـ react-select
//   const options = categories.map((category) => ({
//     id: category?.id,
//     name: category.name,
//     label: (
//       <div className="flex items-center justify-between">
//         <div className="flex justify-start items-center gap-2">
//           <span className="ml-2 text-one">{category.icon}</span>{' '}
//           {/* أيقونة الفئة */}
//           <span>{category.name}</span> {/* اسم الفئة */}
//         </div>
//         <span>
//           <IoIosArrowBack /> {/* أيقونة السهم */}
//         </span>
//       </div>
//     ),
//     path: category.path, // المسار المرتبط بالفئة
//   }));

//   // الأنماط المخصصة لـ react-select
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
//   const CategoriesSingleValue = ({ data }) => (
//     <div className="flex items-center gap-2">{data.label}</div>
//   );

//   // ✅ تخصيص النص داخل الحقل عند عدم اختيار أي قيمة
//   const CategoriesPlaceholder = () => (
//     <div className="flex items-center gap-2 text-gray-500">
//       <TbCategoryPlus className="text-one text-lg" />
//       <span>اختر فئة أولاً</span>
//     </div>
//   );
//   return (
//     <div className="flex justify-start gap-2 items-center w-full text-white lg:bg-transparent">
//       {/* قائمة منسدلة لاختيار الفئة */}
//       <Select
//         value={selectedCategory} // القيمة المحددة حاليًا
//         onChange={handleCategoryChange} // دالة لمعالجة التغيير عند الاختيار
//         options={options} // الخيارات المتاحة للاختيار
//         placeholder="اختر الفئة" // النص الافتراضي قبل الاختيار
//         isClearable // إمكانية مسح الاختيار
//         isSearchable // إمكانية البحث داخل القائمة
//         theme={customTheme}
//         styles={customStyles} // الأنماط المخصصة
//         className="w-full text-md text-start text-black rounded select-none z-[200]"
//         classNamePrefix="select" // بادئة لفئات CSS
//         components={{
//           SingleValue: CategoriesSingleValue,
//           Placeholder: CategoriesPlaceholder,
//         }}
//       />
//     </div>
//   );
// };

// export default CategoriesNavBar;
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import categories from '../Categories/categories';

const CategoriesNavBar = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState < string > '';

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.id);

    if (typeof window !== 'undefined') {
      try {
        const { id, name, path } = category;
        localStorage.setItem('category', JSON.stringify({ id, name, path }));
      } catch (error) {
        console.error('Failed to save category to localStorage:', error);
      }
    }
    router.push(category.path);
  };

  return (
    <div className="w-60 bg-white border rounded shadow-md text-black p-4">
      <h2 className="text-lg font-bold text-gray-700 mb-3">الفئات</h2>
      <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto">
        {categories.map((category) => (
          <li
            key={category.id}
            role="button"
            tabIndex={0}
            aria-label={`Select ${category.name}`}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all 
              ${
                selectedCategory === category.id
                  ? 'bg-one text-white'
                  : 'hover:bg-gray-100'
              }`}
            onClick={() => handleCategoryChange(category)}
            onKeyPress={(e) =>
              e.key === 'Enter' && handleCategoryChange(category)
            }
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="text-one">{category.icon}</span>
              <span>{category.name}</span>
            </div>
            <IoIosArrowBack />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesNavBar;
