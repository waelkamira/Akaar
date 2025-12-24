import React from 'react';
import { FaExpand, FaPalette, FaPlane } from 'react-icons/fa';
import {
  GiTravelDress,
  GiLargeDress,
  GiSuitcase,
  GiLockedBox,
} from 'react-icons/gi';
import { BsFillHandbagFill } from 'react-icons/bs';

let Icons = {};

try {
  Icons = {
    ProductType: GiSuitcase,
    Style: GiLargeDress,
    Material: GiTravelDress,
    Color: FaPalette,
    Size: FaExpand,
    Capacity: GiLockedBox,
    Features: FaPlane,
    Brand: BsFillHandbagFill,
    Condition: GiSuitcase,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات الحقائب غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const bags = [
  {
    name: 'productType',
    label: 'نوع الحقيبة',
    icon: Icons.ProductType ? (
      <Icons.ProductType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Style ? (
      <Icons.Style className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Material ? (
      <Icons.Material className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Color ? (
      <Icons.Color className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Size ? (
      <Icons.Size className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Capacity ? (
      <Icons.Capacity className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Features ? (
      <Icons.Features className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Brand ? (
      <Icons.Brand className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Condition ? (
      <Icons.Condition className="text-primary-400 text-md sm:text-lg" />
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
];

export default bags;
