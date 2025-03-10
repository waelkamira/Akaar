'use client';
import Select from 'react-select';
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minheight: '20px', // تقليل الارتفاع
    height: '20px', // تحديد ارتفاع ثابت
    backgroundColor: 'white',
    borderRadius: '4px', // تقليل نصف قطر الزوايا
    borderColor: state.isFocused ? '#FF7C34' : '#e2e8f0', // لون الحدود
    boxShadow: state.isFocused ? '0 0 0 1px #FF7C34' : 'none', // تأثير التركيز
    '&:hover': {
      borderColor: '#FF7C34', // لون الحدود عند التمرير
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px', // تقليل الهوامش الداخلية (أفقيًا فقط)
    height: '32px', // تحديد ارتفاع ثابت
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap', // منع النص من الالتفاف
    overflow: 'hidden', // إخفاء النص الزائد
    textOverflow: 'ellipsis', // إظهار نقاط (...) عند تجاوز النص
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '32px', // تحديد ارتفاع ثابت
    padding: '0 4px', // تقليل الهوامش الداخلية
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '0', // إزالة الهوامش الداخلية
  }),
  option: (provided) => ({
    ...provided,
    padding: '2px 12px', // تقليل الهوامش الداخلية للخيارات
    fontSize: '14px', // تقليل حجم الخط
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '14px', // حجم الخط للنص المختار
    whiteSpace: 'nowrap', // منع النص من الالتفاف
    overflow: 'hidden', // إخفاء النص الزائد
    textOverflow: 'ellipsis', // إظهار نقاط (...) عند تجاوز النص
    margin: '0', // إزالة الهوامش العلوية والسفلية
    padding: '0', // إزالة الهوامش الداخلية
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '14px', // حجم الخط للنص الافتراضي
    color: '#718096', // لون النص الافتراضي
    margin: '0', // إزالة الهوامش العلوية والسفلية
    padding: '0', // إزالة الهوامش الداخلية
  }),
};
export default function DynamicField({ field, value, onChange }) {
  return (
    // <div
    //   className={`relative flex items-center w-fit border rounded focus:outline-2 focus:outline-one bg-white text-nowrap`}
    // >
    //   <div className="flex-grow text-black">
    //     {field?.options ? (
    //       <Select
    //         options={Object.entries(field?.options).map(([key, value]) => ({
    //           value: key,
    //           label: (
    //             <div className="flex items-center gap-2">
    //               <span className="text-one">{field?.icon}</span>
    //               <span>{value}</span>
    //             </div>
    //           ),
    //         }))}
    //         formatOptionLabel={(option) => option.label}
    //         onChange={(selectedOption) =>
    //           onChange(field?.name, selectedOption.value)
    //         }
    //         placeholder={
    //           <div className="flex items-center gap-2">
    //             <span className="text-one">{field?.icon}</span>
    //             <span>{field?.label}</span>
    //           </div>
    //         }
    //         classNamePrefix="select"
    //         className="w-fit bg-transparent focus:outline-none"
    //         styles={customStyles} // الأنماط المخصصة
    //       />
    //     ) : (
    //       <div className="relative flex items-center w-fit border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
    //         <h1
    //           className={`flex justify-start items-center gap-1 text-black transition-all duration-30 text-nowrap `}
    //         >
    //           <span className="text-one xl:text-xl transition-all duration-300">
    //             {field?.icon}
    //           </span>
    //           {field?.label}
    //         </h1>
    //         <input
    //           placeholder={field?.placeholder}
    //           className="w-fit bg-transparent focus:outline-none h-8 bg-white rounded-[5px] text-black"
    //           onChange={(e) => onChange(field?.name, e.target.value)}
    //         />
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div
      className={`relative flex items-center w-fit border rounded focus:outline-2 focus:outline-one bg-white text-nowrap`}
    >
      <div className="flex-grow text-black">
        {field?.options ? (
          <select
            onChange={(e) => onChange(field?.name, e.target.value)}
            className="w-28 bg-transparent focus:outline-none"
          >
            <option value="" disabled selected>
              <div className="flex items-center gap-2">
                <span className="text-one">{field?.icon}</span>
                <span>{field?.label}</span>
              </div>
            </option>
            {Object.entries(field?.options).map(([key, value]) => (
              <option key={key} value={key}>
                <div className="flex items-center gap-2">
                  <span className="text-one">{field?.icon}</span>
                  <span>{value}</span>
                </div>
              </option>
            ))}
          </select>
        ) : (
          <div className="relative flex items-center w-fit border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
            <input
              placeholder={field?.placeholder}
              className="w-28 bg-transparent focus:outline-none h-6 bg-white rounded-[5px] text-black"
              onChange={(e) => onChange(field?.name, e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
