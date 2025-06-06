import React from 'react';
import {
  FaBasketballBall,
  FaRunning,
  FaWeight,
  FaTshirt,
} from 'react-icons/fa';

let Icons = {};

try {
  Icons = {
    Type: FaBasketballBall,
    Sport: FaRunning,
    EquipmentType: FaWeight,
    ClothingType: FaTshirt,
    Size: FaTshirt,
    Brand: FaBasketballBall,
    Material: FaBasketballBall,
    Condition: FaBasketballBall,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات الأدوات الرياضية غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const sports = [
  {
    name: 'type',
    label: 'نوع المنتج',
    icon: Icons.Type ? (
      <Icons.Type className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'معدات رياضية',
      2: 'ملابس رياضية',
      3: 'أحذية رياضية',
      4: 'مستلزمات رياضية',
      5: 'مكملات رياضية',
      6: 'أخرى',
    },
  },
  {
    name: 'sport',
    label: 'الرياضة',
    icon: Icons.Sport ? (
      <Icons.Sport className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'كرة سلة',
      2: 'كرة قدم',
      3: 'جري',
      4: 'ركوب الدراجات',
      5: 'رفع الأثقال',
      6: 'تنس',
      7: 'سباحة',
      8: 'كرة طائرة',
      9: 'هوكي',
      10: 'ملاكمة',
      11: 'تنس الطاولة',
      12: 'جولف',
      13: 'أخرى',
    },
  },
  {
    name: 'equipmentType',
    label: 'نوع المعدات',
    icon: Icons.EquipmentType ? (
      <Icons.EquipmentType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'كرات رياضية',
      2: 'أحزمة وأثقال',
      3: 'مضارب',
      4: 'قفازات',
      5: 'شبكات وأهداف',
      6: 'أجهزة رياضية',
      7: 'معدات حماية',
      8: 'أخرى',
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
      1: 'تيشرت رياضية',
      2: 'سراويل رياضية',
      3: 'جوارب رياضية',
      4: 'سترات رياضية',
      5: 'ملابس سباحة',
      6: 'ملابس تدريب',
      7: 'أخرى',
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
    name: 'brand',
    label: 'الماركة',
    icon: Icons.Brand ? (
      <Icons.Brand className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'نايكي',
      2: 'أديداس',
      3: 'بوما',
      4: 'أندر آرمور',
      5: 'ريبوك',
      6: 'أخرى',
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
      1: 'بوليستر',
      2: 'قطن',
      3: 'نايلون',
      4: 'مطاط',
      5: 'جلد',
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
      4: 'مستعمل - بحالة مقبولة',
      5: 'أخرى',
    },
  },
];

export default sports;
