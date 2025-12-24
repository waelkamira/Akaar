import { FaBed, FaHome, FaRulerCombined } from 'react-icons/fa';
import { FaShower } from 'react-icons/fa6';
import { MdOutlineBedroomParent, MdOutlineLiving } from 'react-icons/md';

let Icons = {};

try {
  Icons = {
    AdType: MdOutlineBedroomParent,
    Rooms: FaBed,
    Livingrooms: MdOutlineLiving,
    Area: FaRulerCombined,
    PropertyType: FaHome,
    Bathrooms: FaShower,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات العقارات غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const realEstate = [
  {
    name: 'adType',
    label: 'بيع/أجار',
    icon: Icons.AdType ? (
      <Icons.AdType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'بيع',
      2: 'أجار',
    },
  },
  {
    name: 'rooms',
    label: 'الغرف',
    icon: Icons.Rooms ? (
      <Icons.Rooms className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    name: 'livingrooms',
    label: 'الصالونات',
    icon: Icons.Livingrooms ? (
      <Icons.Livingrooms className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    name: 'area',
    label: 'المساحة',
    icon: Icons.Area ? (
      <Icons.Area className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '200 م²',
  },
  {
    name: 'propertyType',
    label: 'نوع العقار',
    icon: Icons.PropertyType ? (
      <Icons.PropertyType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    name: 'bathrooms',
    label: 'الحمامات',
    icon: Icons.Bathrooms ? (
      <Icons.Bathrooms className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
