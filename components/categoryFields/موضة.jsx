import { FaTshirt, FaPalette, FaExpand } from 'react-icons/fa';
import {
  GiClothes,
  GiTie,
  GiRunningShoe,
  GiHandBag,
  GiUnderwearShorts,
  GiArmoredPants,
  GiPocketWatch,
} from 'react-icons/gi';
import { PiEyeglassesLight } from 'react-icons/pi';

let Icons = {};

try {
  Icons = {
    Type: GiClothes,
    ClothingType: FaTshirt,
    Gender: GiTie,
    Size: FaExpand,
    Color: FaPalette,
    Brand: FaTshirt,
    Material: FaTshirt,
    Condition: FaTshirt,
    Season: FaTshirt,
    // Additional icons for better representation
    Shoes: GiRunningShoe,
    Bags: GiHandBag,
    Underwear: GiUnderwearShorts,
    Belts: GiArmoredPants,
    Glasses: PiEyeglassesLight,
    Watches: GiPocketWatch,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات الأزياء غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const fashion = [
  {
    name: 'type',
    label: 'نوع المنتج',
    icon: Icons.Type ? (
      <Icons.Type className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'ملابس',
      2: 'أحذية',
      3: 'حقائب',
      4: 'إكسسوارات',
      5: 'ملابس داخلية',
      6: 'أحزمة',
      7: 'نظارات',
      8: 'ساعات',
      9: 'أخرى',
    },
  },
  {
    name: 'clothingType',
    label: 'نوع الملابس',
    icon: Icons.ClothingType ? (
      <Icons.ClothingType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'تيشرت',
      2: 'قميص',
      3: 'بنطال',
      4: 'جاكيت',
      5: 'بدلة',
      6: 'تنورة',
      7: 'فساتين',
      8: 'ملابس رياضية',
      9: 'أخرى',
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
      3: 'أطفال',
      4: 'للجنسين',
      5: 'أخرى',
    },
  },
  {
    name: 'size',
    label: 'المقاس',
    icon: Icons.Size ? (
      <Icons.Size className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'XS',
      2: 'S',
      3: 'M',
      4: 'L',
      5: 'XL',
      6: 'XXL',
      7: 'XXXL',
      8: 'مقاسات أطفال',
      9: 'أخرى',
    },
  },
  {
    name: 'color',
    label: 'اللون',
    icon: Icons.Color ? (
      <Icons.Color className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'أسود',
      2: 'أبيض',
      3: 'أحمر',
      4: 'أزرق',
      5: 'أخضر',
      6: 'أصفر',
      7: 'وردي',
      8: 'رمادي',
      9: 'بني',
      10: 'بيج',
      11: 'أخرى',
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
      1: 'نايكي',
      2: 'أديداس',
      3: 'زارا',
      4: 'H&M',
      5: 'جيس',
      6: 'بولو',
      7: 'لويس فويتون',
      8: 'جوتشي',
      9: 'أخرى',
    },
  },
  {
    name: 'material',
    label: 'المادة المصنوعة منها',
    icon: Icons.Material ? (
      <Icons.Material className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'قطن',
      2: 'حرير',
      3: 'صوف',
      4: 'دنة',
      5: 'جينز',
      6: 'جلد',
      7: 'بوليستر',
      8: 'أخرى',
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
      4: 'مستعمل - بحالة مقبولة',
      5: 'أخرى',
    },
  },
  {
    name: 'season',
    label: 'الموسم',
    icon: Icons.Season ? (
      <Icons.Season className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'شتوي',
      2: 'صيفي',
      3: 'ربيعي/خريفي',
      4: 'طوال السنة',
      5: 'أخرى',
    },
  },
];

export default fashion;
