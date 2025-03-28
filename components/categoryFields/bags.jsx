import {
  FaHandbag,
  FaSuitcaseRolling,
  FaShoppingBag,
  FaBriefcase,
  FaWallet,
  FaExpand,
  FaPalette,
  FaLaptop,
  FaTshirt,
  FaPlane,
} from 'react-icons/fa';
import {
  GiBackpack,
  GiSchoolBag,
  GiTravelDress,
  GiLargeDress,
  GiSuitcase,
  GiLockedBox,
} from 'react-icons/gi';

const bags = [
  {
    name: 'productType',
    label: 'نوع الحقيبة',
    icon: <GiSuitcase className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'حقيبة يد',
      2: 'حقيبة ظهر',
      3: 'حقيبة سفر',
      4: 'حقيبة كمبيوتر',
      5: 'حقيبة رياضية',
      6: 'حقيبة مدرسية',
      7: 'حقيبة كتف',
      8: 'حقيبة حمل',
      9: 'حقيبة صغيرة',
      10: 'أخرى',
    },
  },
  {
    name: 'style',
    label: 'النمط التصميمي',
    icon: <GiLargeDress className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'كاجوال',
      2: 'رسمي',
      3: 'رياضي',
      4: 'عتيق',
      5: 'بوهيمي',
      6: 'سفر',
      7: 'عمل',
      8: 'ميني مال',
      9: 'أخرى',
    },
  },
  {
    name: 'material',
    label: 'المادة المصنوعة',
    icon: <GiTravelDress className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'جلد طبيعي',
      2: 'جلد صناعي',
      3: 'نايلون',
      4: 'بوليستر',
      5: 'قماش',
      6: 'قنب',
      7: 'أخرى',
    },
  },
  {
    name: 'color',
    label: 'اللون',
    icon: <FaPalette className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أسود',
      2: 'بني',
      3: 'أزرق',
      4: 'أحمر',
      5: 'أخضر',
      6: 'رمادي',
      7: 'بيج',
      8: 'ذهبي',
      9: 'فضي',
      10: 'متعدد الألوان',
      11: 'أخرى',
    },
  },
  {
    name: 'size',
    label: 'الحجم',
    icon: <FaExpand className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'صغير (أقل من 30 سم)',
      2: 'متوسط (30-45 سم)',
      3: 'كبير (45-60 سم)',
      4: 'كبير جداً (أكثر من 60 سم)',
      5: 'مقاس خاص',
    },
  },
  {
    name: 'capacity',
    label: 'السعة',
    icon: <GiLockedBox className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أقل من 20 لتر',
      2: '20-40 لتر',
      3: '40-60 لتر',
      4: '60-80 لتر',
      5: 'أكثر من 80 لتر',
    },
  },
  {
    name: 'features',
    label: 'المميزات',
    icon: <FaPlane className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'مقاوم للماء',
      2: 'جيب سري',
      3: 'قفل أمان',
      4: 'عجلات',
      5: 'قابلة للتوسيع',
      6: 'أخرى',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: <FaHandbag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'لويس فويتون',
      2: 'جوتشي',
      3: 'مايكل كورس',
      4: 'سامسونيت',
      5: 'أديداس',
      6: 'نايك',
      7: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: <GiSuitcase className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل - بحالة ممتازة',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - بحاجة لتنظيف',
      5: 'أخرى',
    },
  },
];

export default bags;
