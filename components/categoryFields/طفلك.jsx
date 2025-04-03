import { FaBaby, FaShoppingCart, FaBabyCarriage } from 'react-icons/fa';
import { GiClothes, GiFeather } from 'react-icons/gi';
import { DiMaterializecss } from 'react-icons/di';
import { PiCertificateBold } from 'react-icons/pi';
import { TbStatusChange } from 'react-icons/tb';

let Icons = {};

try {
  Icons = {
    Type: FaBabyCarriage,
    SubType: GiClothes,
    AgeRange: FaBaby,
    Gender: GiFeather,
    Material: DiMaterializecss,
    SafetyCertification: PiCertificateBold,
    Condition: TbStatusChange,
    Brand: FaShoppingCart,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات مستلزمات الأطفال غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const babySupplies = [
  {
    name: 'type',
    label: 'نوع المنتج',
    icon: Icons.Type ? (
      <Icons.Type className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'مقاعد سيارات',
      2: 'عربات أطفال',
      3: 'ملابس أطفال',
      4: 'ألعاب تعليمية',
      5: 'أثاث أطفال',
      6: 'أدوات تغذية',
      7: 'مستلزمات الاستحمام',
      8: 'مستلزمات النوم',
      9: 'حفاضات ومنتجات العناية',
      10: 'أخرى',
    },
  },
  {
    name: 'subType',
    label: 'التفاصيل',
    icon: Icons.SubType ? (
      <Icons.SubType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'كرسي سيارة أمامي',
      2: 'كرسي سيارة خلفي',
      3: 'عربة توأم',
      4: 'عربة خفيفة',
      5: 'ملابس حديثي الولادة',
      6: 'ألعاب استحمام',
      7: 'سرير أطفال',
      8: 'كرسي هزاز',
      9: 'أخرى',
    },
  },
  {
    name: 'ageRange',
    label: 'الفئة العمرية',
    icon: Icons.AgeRange ? (
      <Icons.AgeRange className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'حديثي الولادة (0-3 أشهر)',
      2: 'رضيع (3-12 شهراً)',
      3: 'طفل صغير (1-3 سنوات)',
      4: 'ما قبل المدرسة (3-5 سنوات)',
      5: 'أكبر من 5 سنوات',
      6: 'مناسب لجميع الأعمار',
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
      1: 'ذكر',
      2: 'أنثى',
      3: 'للجنسين',
    },
  },
  {
    name: 'material',
    label: 'المادة',
    icon: Icons.Material ? (
      <Icons.Material className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'قطن',
      2: 'بوليستر',
      3: 'بلاستيك',
      4: 'خشب',
      5: 'سيليكون',
      6: 'معدن',
      7: 'أخرى',
    },
  },
  {
    name: 'safetyCertification',
    label: 'شهادات السلامة',
    icon: Icons.SafetyCertification ? (
      <Icons.SafetyCertification className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'مطابق لمعايير السلامة',
      2: 'شهادة CE',
      3: 'شهادة ASTM',
      4: 'غير معروف',
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
      4: 'مستعمل - بحاجة لتنظيف',
      5: 'أخرى',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: Icons.Brand ? (
      <Icons.Brand className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
  },
];

export default babySupplies;
