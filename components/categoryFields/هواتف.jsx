'use client';

import { FaMobileAlt, FaMemory, FaBatteryFull } from 'react-icons/fa';
import {
  MdCategory,
  MdStorage,
  MdPhoneAndroid,
  MdScreenshot,
} from 'react-icons/md';
import { BiWorld, BiChip } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';

const phones = [
  {
    name: 'نوع الجهاز',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الجهاز',
    options: {
      1: 'هاتف ذكي',
      2: 'تابلت',
      3: 'ساعة ذكية',
      4: 'سماعات',
      5: 'اكسسوارات',
      6: 'قطع غيار',
    },
  },
  {
    name: 'الماركة',
    icon: <MdPhoneAndroid className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'Apple',
      2: 'Samsung',
      3: 'Huawei',
      4: 'Xiaomi',
      5: 'OnePlus',
      6: 'OPPO',
      7: 'Vivo',
      8: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <FaMobileAlt className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة الجهاز',
    options: {
      1: 'جديد',
      2: 'مستعمل - كالجديد',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - يحتاج صيانة',
      5: 'للقطع',
    },
  },
  {
    name: 'الذاكرة',
    icon: <FaMemory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حجم الذاكرة',
    options: {
      1: '16GB',
      2: '32GB',
      3: '64GB',
      4: '128GB',
      5: '256GB',
      6: '512GB',
      7: '1TB',
      8: 'أخرى',
    },
  },
  {
    name: 'التخزين',
    icon: <MdStorage className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حجم التخزين',
    options: {
      1: '16GB',
      2: '32GB',
      3: '64GB',
      4: '128GB',
      5: '256GB',
      6: '512GB',
      7: '1TB',
      8: 'أخرى',
    },
  },
  {
    name: 'حجم الشاشة',
    icon: <MdScreenshot className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حجم الشاشة',
    options: {
      1: 'أقل من 5 إنش',
      2: '5 - 6 إنش',
      3: '6 - 7 إنش',
      4: '7 - 8 إنش',
      5: '8 - 10 إنش',
      6: 'أكبر من 10 إنش',
    },
  },
  {
    name: 'المعالج',
    icon: <BiChip className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المعالج',
    options: {
      1: 'Apple A Series',
      2: 'Snapdragon',
      3: 'MediaTek',
      4: 'Exynos',
      5: 'Kirin',
      6: 'أخرى',
    },
  },
  {
    name: 'سعة البطارية',
    icon: <FaBatteryFull className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر سعة البطارية',
    options: {
      1: 'أقل من 3000mAh',
      2: '3000-4000mAh',
      3: '4000-5000mAh',
      4: 'أكثر من 5000mAh',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'الصين',
      2: 'كوريا الجنوبية',
      3: 'الولايات المتحدة',
      4: 'فيتنام',
      5: 'الهند',
      6: 'أخرى',
    },
  },
];

export default phones;
