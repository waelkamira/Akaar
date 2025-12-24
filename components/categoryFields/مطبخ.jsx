import {
  FaCouch,
  FaPalette,
  FaBlender,
  FaFire,
  FaRulerCombined,
  FaHome,
} from 'react-icons/fa';
import { FaKitchenSet } from 'react-icons/fa6';
import { GiSofa } from 'react-icons/gi';
import { LuTable2 } from 'react-icons/lu';

let Icons = {};

try {
  Icons = {
    ProductType: FaHome,
    FurnitureType: GiSofa,
    TableShape: LuTable2,
    ApplianceType: FaBlender,
    CooktopType: FaFire,
    Capacity: FaKitchenSet,
    Material: FaCouch,
    Color: FaPalette,
    Style: FaHome,
    Dimensions: FaRulerCombined,
    Condition: FaHome,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات أدوات المطبخ غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const kitchen = [
  {
    name: 'productType',
    label: 'نوع المنتج',
    icon: Icons.ProductType ? (
      <Icons.ProductType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'أثاث',
      2: 'جهاز مطبخ',
      3: 'أدوات مطبخ',
      4: 'ديكور',
      5: 'مفروشات السرير',
      6: 'إضاءة',
      7: 'تخزين',
      8: 'أخرى',
    },
  },
  {
    name: 'furnitureType',
    label: 'نوع الأثاث',
    icon: Icons.FurnitureType ? (
      <Icons.FurnitureType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'كنبة',
      2: 'كرسي',
      3: 'طاولة',
      4: 'سرير',
      5: 'خزانة',
      6: 'مكتب',
      7: 'رف',
      8: 'أخرى',
    },
  },
  {
    name: 'tableShape',
    label: 'شكل الطاولة',
    icon: Icons.TableShape ? (
      <Icons.TableShape className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'دائري',
      2: 'مربع',
      3: 'مستطيل',
      4: 'بيضاوي',
      5: 'أخرى',
    },
  },
  {
    name: 'applianceType',
    label: 'نوع الجهاز',
    icon: Icons.ApplianceType ? (
      <Icons.ApplianceType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'ثلاجة',
      2: 'فرن',
      3: 'ميكروويف',
      4: 'غسالة صحون',
      5: 'خلاط',
      6: 'آلة صنع القهوة',
      7: 'خلاط كهربائي',
      8: 'محمصة خبز',
      9: 'عصارة',
      10: 'أخرى',
    },
  },
  {
    name: 'cooktopType',
    label: 'نوع الموقد',
    icon: Icons.CooktopType ? (
      <Icons.CooktopType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'غاز',
      2: 'كهرباء',
      3: 'حث',
      4: 'أخرى',
    },
  },
  {
    name: 'capacity',
    label: 'السعة',
    icon: Icons.Capacity ? (
      <Icons.Capacity className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: 'باللتر أو القدم المكعب',
    options: {
      1: 'صغير (أقل من 50 لتر)',
      2: 'متوسط (50-100 لتر)',
      3: 'كبير (أكثر من 100 لتر)',
      4: 'أخرى',
    },
  },
  {
    name: 'material',
    label: 'المادة',
    icon: Icons.Material ? (
      <Icons.Material className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'خشب',
      2: 'معدن',
      3: 'زجاج',
      4: 'بلاستيك',
      5: 'سيراميك',
      6: 'ستانلس ستيل',
      7: 'رخام',
      8: 'أخرى',
    },
  },
  {
    name: 'color',
    label: 'اللون',
    icon: Icons.Color ? (
      <Icons.Color className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'أسود',
      2: 'أبيض',
      3: 'بني',
      4: 'رمادي',
      5: 'أحمر',
      6: 'أزرق',
      7: 'أخضر',
      8: 'بيج',
      9: 'ذهبي',
      10: 'فضي',
      11: 'أخرى',
    },
  },
  {
    name: 'style',
    label: 'النمط',
    icon: Icons.Style ? (
      <Icons.Style className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'حديث',
      2: 'كلاسيكي',
      3: 'ريفي',
      4: 'بسيط',
      5: 'صناعي',
      6: 'منزل ريفي',
      7: 'اسكندنافي',
      8: 'أخرى',
    },
  },
  {
    name: 'dimensions',
    label: 'الأبعاد',
    icon: Icons.Dimensions ? (
      <Icons.Dimensions className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: 'الطول x العرض x الارتفاع',
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: Icons.Condition ? (
      <Icons.Condition className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل',
      3: 'مجدد',
      4: 'أخرى',
    },
  },
];

export default kitchen;
