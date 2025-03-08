import Select from 'react-select';

export default function DynamicField({ field, value, onChange }) {
  return (
    <div
      className={`relative flex items-center w-full border rounded focus:outline-2 focus:outline-one bg-white text-nowrap`}
    >
      <div className="flex-grow min-w-[100px]">
        {field?.options ? (
          <Select
            options={Object.entries(field?.options).map(([key, value]) => ({
              value: key,
              label: (
                <div className="flex items-center gap-2">
                  <span className="text-one">{field?.icon}</span>
                  <span>{value}</span>
                </div>
              ),
            }))}
            formatOptionLabel={(option) => option.label}
            onChange={(selectedOption) =>
              onChange(field?.name, selectedOption.value)
            }
            placeholder={
              <div className="flex items-center gap-2">
                <span className="text-one">{field?.icon}</span>
                <span>{field?.label}</span>
              </div>
            }
            classNamePrefix="select"
            className="w-full bg-transparent focus:outline-none h-12"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '3rem',
                border: 'none',
                boxShadow: 'none',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#fadfae' : 'white',
                color: state.isFocused ? '#1a202c' : '#4a5568',
              }),
              menu: (provided) => ({
                ...provided,
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }),
            }}
          />
        ) : (
          <div className="relative flex items-center w-full border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
            <h1
              className={`flex justify-start items-center gap-1 text-black transition-all duration-300 text-nowrap ${
                value
                  ? 'absolute top-0 right-0 scale-75 text-xs'
                  : 'px-2 scale-100 text-base'
              } peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base`}
            >
              <span className="text-one xl:text-xl transition-all duration-300">
                {field?.icon}
              </span>
              {field?.label}
            </h1>
            <input
              placeholder={field?.placeholder}
              className="w-full bg-transparent focus:outline-none h-12 px-2 pt-4 peer bg-white rounded-[5px] text-black"
              onChange={(e) => onChange(field?.name, e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
