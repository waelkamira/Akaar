// components/PriceInput.js
import { MdOutlinePriceCheck } from 'react-icons/md';

export default function PriceInput({ label, name, value, onChange }) {
  return (
    <div className="relative flex items-center w-fit border rounded focus:outline-2 focus:outline-one bg-white text-nowrap">
      <input
        type="number"
        name={name}
        placeholder={`${label}`}
        value={value}
        onChange={onChange}
        className="w-28 bg-transparent focus:outline-none h-6 px-2 bg-white rounded-[5px] text-black"
      />
    </div>
  );
}
