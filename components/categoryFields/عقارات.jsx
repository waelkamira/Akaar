import { FaBed, FaHome, FaRulerCombined } from 'react-icons/fa';
import { FaShower } from 'react-icons/fa6';
import { MdOutlineBedroomParent } from 'react-icons/md';

const realEstate = [
  {
    name: 'نوع الإعلان',
    icon: <MdOutlineBedroomParent className="text-one text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'بيع',
      2: 'أجار',
    },
  },
  {
    name: 'نوع العقار',
    icon: <FaHome className="text-one text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'بيت',
      2: 'شقة',
      3: 'أرض',
      4: 'مزرعة',
      5: 'فيلا',
      6: 'معمل',
      7: 'غير ذلك',
    },
  },
  {
    name: 'عدد الغرف',
    icon: <FaBed className="text-one text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '1 + 1',
      2: '2 + 1',
      3: '3 + 1',
      4: '4 + 1',
      5: '5 + 1',
      6: 'غير ذلك',
    },
  },
  {
    name: 'عدد الحمامات',
    icon: <FaShower className="text-one text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: 'غير ذلك',
    },
  },
  {
    name: 'المساحة',
    icon: <FaRulerCombined className="text-one text-lg sm:text-xl" />,
    placeholder: '200 م2',
  },
];
export default realEstate;
