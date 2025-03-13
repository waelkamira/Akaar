import { FaBed, FaHome, FaRulerCombined } from 'react-icons/fa';
import { FaShower } from 'react-icons/fa6';
import { MdOutlineBedroomParent } from 'react-icons/md';

const realEstate = [
  {
    name: 'adType', // المفتاح الإنجليزي
    label: 'بيع/أجار', // الاسم العربي
    icon: <MdOutlineBedroomParent className="text-one text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'بيع',
      2: 'أجار',
    },
  },
  {
    name: 'rooms', // المفتاح الإنجليزي
    label: 'عدد الغرف', // الاسم العربي
    icon: <FaBed className="text-one text-lg sm:text-xl" />,
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
    name: 'livingrooms', // المفتاح الإنجليزي
    label: 'عدد الصالونات', // الاسم العربي
    icon: <FaBed className="text-one text-lg sm:text-xl" />,
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
    name: 'area', // المفتاح الإنجليزي
    label: 'المساحة', // الاسم العربي
    icon: <FaRulerCombined className="text-one text-lg sm:text-xl" />,
    placeholder: '200 م²',
  },

  {
    name: 'propertyType', // المفتاح الإنجليزي
    label: 'نوع العقار', // الاسم العربي
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
    name: 'bathrooms', // المفتاح الإنجليزي
    label: 'عدد الحمامات', // الاسم العربي
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
];

export default realEstate;
