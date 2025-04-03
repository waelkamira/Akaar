import { FaCrown } from 'react-icons/fa';
import {
  GiDiamondRing,
  GiGemNecklace,
  GiGoldBar,
  GiSilverBullet,
  GiPearlNecklace,
  GiBrokenHeart,
} from 'react-icons/gi';
import { CgArrowsExpandUpLeft } from 'react-icons/cg';

let Icons = {};

try {
  Icons = {
    ProductType: GiDiamondRing,
    MetalType: GiGoldBar,
    Karat: GiGoldBar,
    Gemstone: GiGemNecklace,
    Style: GiBrokenHeart,
    Brand: FaCrown,
    Gender: CgArrowsExpandUpLeft,
    Occasion: GiPearlNecklace,
    Condition: GiSilverBullet,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات المجوهرات غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const jewelry = [
  {
    name: 'productType',
    label: 'نوع المجوهرات',
    icon: Icons.ProductType ? (
      <Icons.ProductType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'خواتم',
      2: 'قلائد',
      3: 'أقراط',
      4: 'أساور',
      5: 'ساعات',
      6: 'دبابيس',
      7: 'أطقم مجوهرات',
      8: 'إكسسوارات شعر',
      9: 'أخرى',
    },
  },
  {
    name: 'metalType',
    label: 'نوع المعدن',
    icon: Icons.MetalType ? (
      <Icons.MetalType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'ذهب أصفر',
      2: 'ذهب أبيض',
      3: 'ذهب وردي',
      4: 'فضة',
      5: 'بلاتين',
      6: 'ستانلس ستيل',
      7: 'تيتانيوم',
      8: 'أخرى',
    },
  },
  {
    name: 'karat',
    label: 'العيار',
    icon: Icons.Karat ? (
      <Icons.Karat className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '24 قيراط',
      2: '21 قيراط',
      3: '18 قيراط',
      4: '14 قيراط',
      5: '10 قيراط',
      6: '925 فضة',
      7: '950 بلاتين',
      8: 'غير معروف',
    },
  },
  {
    name: 'gemstone',
    label: 'الحجر الكريم',
    icon: Icons.Gemstone ? (
      <Icons.Gemstone className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'ألماس',
      2: 'ياقوت',
      3: 'زمرد',
      4: 'لؤلؤ',
      5: 'توباز',
      6: 'أكوامارين',
      7: 'عقيق',
      8: 'زفير',
      9: 'أخرى',
    },
  },
  {
    name: 'style',
    label: 'النمط التصميمي',
    icon: Icons.Style ? (
      <Icons.Style className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'كلاسيكي',
      2: 'حديث',
      3: 'عتيق',
      4: 'فاخر',
      5: 'بوهيمي',
      6: 'مينيماليست',
      7: 'أخرى',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: Icons.Brand ? (
      <Icons.Brand className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'تيفاني',
      2: 'كارتييه',
      3: 'بوليغاري',
      4: 'دامياني',
      5: 'سواروفسكي',
      6: 'ماركة محلية',
      7: 'أخرى',
    },
  },
  {
    name: 'gender',
    label: 'الجنس',
    icon: Icons.Gender ? (
      <Icons.Gender className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'رجالي',
      2: 'نسائي',
      3: 'للجنسين',
      4: 'أطفال',
    },
  },
  {
    name: 'occasion',
    label: 'المناسبة',
    icon: Icons.Occasion ? (
      <Icons.Occasion className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'خطوبة',
      2: 'زفاف',
      3: 'يومية',
      4: 'مناسبات خاصة',
      5: 'هدايا',
      6: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: Icons.Condition ? (
      <Icons.Condition className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل - بحالة ممتازة',
      3: 'مستعمل - بحالة جيدة',
      4: 'بحاجة لتنظيف',
      5: 'نادر/قديم',
    },
  },
];

export default jewelry;
