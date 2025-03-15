// components/PriceInput.js
import { MdOutlinePriceCheck } from 'react-icons/md';

export default function PriceInput({ label, name, value, onChange }) {
  return (
    <div className="relative flex items-center w-full sm:w-28 border rounded focus:outline-2 focus:outline-one bg-white text-nowrap text-sm">
      <input
        type="number"
        name={name}
        placeholder={`${label}`}
        value={value}
        onChange={onChange}
        className="w-full sm:w-28 bg-transparent focus:outline-none h-8 sm:h-6 px-2 bg-white rounded-[5px] text-black text-sm"
      />
    </div>
  );
}
