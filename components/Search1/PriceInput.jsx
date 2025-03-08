// components/PriceInput.js
import { MdOutlinePriceCheck } from 'react-icons/md';

export default function PriceInput({ label, name, value, onChange }) {
  return (
    <div className="relative flex items-center w-full border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
      <h1
        className={`flex justify-start items-center gap-1 text-black transition-all duration-300 text-nowrap ${
          value
            ? 'absolute top-0 right-0 scale-75 text-xs'
            : 'px-2 scale-100 text-base'
        } peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base`}
      >
        <span className="text-one xl:text-xl transition-all duration-300">
          <MdOutlinePriceCheck />
        </span>
        {label}
      </h1>
      <input
        type="number"
        name={name}
        placeholder="0 $"
        value={value}
        onChange={onChange}
        className="w-full bg-transparent focus:outline-none h-12 px-2 pt-4 peer bg-white rounded-[5px] text-black"
      />
    </div>
  );
}
