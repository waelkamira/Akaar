'use client';

import { FaKitchenSet, FaBlender, FaCoffee } from 'react-icons/fa6';
import { MdCategory, MdPower, MdOutlineCleaningServices } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiCookingPot, GiWaterGallon } from 'react-icons/gi';

const kitchen = [
  {
    name: 'نوع المنتج',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المنتج',
    options: {
      1: 'أجهزة كهربائية',
      2: 'أواني طبخ',
      3: 'أدوات تقديم',
      4: 'أدوات تخزين',
      5: 'أدوات تحضير',
      6: 'مستلزمات مطبخ',
      7: 'أجهزة تنظيف',
      8: 'أخرى',
    },
  },
  {
    name: 'الفئة',
    icon: <FaKitchenSet className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الفئة',
    options: {
      1: 'ثلاجة',
      2: 'فرن',
      3: 'غسالة صحون',
      4: 'ميكروويف',
      5: 'خلاط',
      6: 'محضر طعام',
      7: 'قلاية هوائية',
      8: 'صانع قهوة',
      9: 'غلاية',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة المنتج',
    options: {
      1: 'جديد',
      2: 'مستعمل - كالجديد',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - يحتاج صيانة',
      5: 'للقطع',
    },
  },
  {
    name: 'الماركة',
    icon: <FaBlender className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'Samsung',
      2: 'LG',
      3: 'Philips',
      4: 'Tefal',
      5: 'Braun',
      6: 'Kenwood',
      7: 'Bosch',
      8: 'Panasonic',
      9: 'أخرى',
    },
  },
  {
    name: 'القدرة',
    icon: <MdPower className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر القدرة',
    options: {
      1: 'أقل من 500 واط',
      2: '500-1000 واط',
      3: '1000-1500 واط',
      4: '1500-2000 واط',
      5: 'أكثر من 2000 واط',
    },
  },
  {
    name: 'السعة',
    icon: <GiWaterGallon className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر السعة',
    options: {
      1: 'أقل من 1 لتر',
      2: '1-2 لتر',
      3: '2-5 لتر',
      4: '5-10 لتر',
      5: 'أكثر من 10 لتر',
    },
  },
  {
    name: 'المواد',
    icon: <GiCookingPot className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المواد',
    options: {
      1: 'ستانلس ستيل',
      2: 'ألمنيوم',
      3: 'زجاج',
      4: 'سيراميك',
      5: 'تيفال',
      6: 'بلاستيك',
      7: 'سيليكون',
      8: 'متعدد المواد',
    },
  },
  {
    name: 'الضمان',
    icon: <FaCoffee className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر مدة الضمان',
    options: {
      1: 'بدون ضمان',
      2: '6 أشهر',
      3: 'سنة',
      4: 'سنتين',
      5: '3 سنوات',
      6: 'أكثر من 3 سنوات',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'كوريا الجنوبية',
      2: 'اليابان',
      3: 'الصين',
      4: 'ألمانيا',
      5: 'فرنسا',
      6: 'أخرى',
    },
  },
];

export default kitchen;
