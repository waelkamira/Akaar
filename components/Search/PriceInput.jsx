// components/PriceInput.js
import { MdOutlinePriceCheck } from 'react-icons/md';

export default function PriceInput({ label, name, value, onChange }) {
  return (
    <div className="relative flex items-center w-full sm:w-32 border rounded focus:outline-2 focus:outline-one bg-white text-nowrap text-sm px-2 sm:p-0">
      <input
        type="number"
        name={name}
        placeholder={`${label}`}
        value={value}
        onChange={onChange}
        className="w-full sm:w-32 bg-transparent focus:outline-none h-9 sm:h-6 bg-white rounded-[5px] text-black text-sm px-2 sm:p-0"
      />
    </div>
  );
}
