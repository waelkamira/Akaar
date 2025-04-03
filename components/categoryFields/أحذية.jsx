import React from 'react';

let Icons = {};

try {
  const { FaExpand } = require('react-icons/fa');
  const { GiSandal, GiRunningShoe, GiSportMedal } = require('react-icons/gi');
  const {
    MdOutlineSportsHandball,
    MdOutlineCleaningServices,
  } = require('react-icons/md');
  const { BiSolidColor } = require('react-icons/bi');
  const { IoShirtOutline } = require('react-icons/io5');

  Icons = {
    Expand: FaExpand || null,
    Sandal: GiSandal || null,
    RunningShoe: GiRunningShoe || null,
    SportMedal: GiSportMedal || null,
    SportsHandball: MdOutlineSportsHandball || null,
    CleaningServices: MdOutlineCleaningServices || null,
    Color: BiSolidColor || null,
    ShirtOutline: IoShirtOutline || null,
  };
} catch (error) {
  console.warn('⚠️ حدث خطأ أثناء تحميل بعض الأيقونات من react-icons.');
}

const shoes = [
  {
    name: 'type',
    label: 'نوع الحذاء',
    icon: Icons.RunningShoe ? (
      <Icons.RunningShoe className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'حذاء رياضي',
      2: 'حذاء طويل (بوت)',
      3: 'صندل',
      4: 'حذاء رسمي',
      5: 'حذاء منزلي',
      6: 'حذاء كاجوال',
      7: 'حذاء أطفال',
      8: 'حذاء تزلج',
      9: 'أخرى',
    },
  },
  {
    name: 'category',
    label: 'التصنيف',
    icon: Icons.ShirtOutline ? (
      <Icons.ShirtOutline className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'رجالي',
      2: 'نسائي',
      3: 'أطفال',
      4: 'للجنسين',
    },
  },
  {
    name: 'size',
    label: 'المقاس',
    icon: Icons.Expand ? (
      <Icons.Expand className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '18',
      2: '19',
      3: '20',
      4: '21',
      5: '22',
      6: '23',
      7: '24',
      8: '25',
      9: '26',
      10: '27',
      11: '28',
      12: '29',
      13: '30',
      14: '31',
      15: '32',
      16: '33',
      17: '34',
      18: '35',
      19: '36',
      20: '37',
      21: '38',
      22: '39',
      23: '40',
      24: '41',
      25: '42',
      26: '43',
      27: '44',
      28: '45',
      29: '46',
      30: '47',
      31: '48',
      32: 'أخرى',
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
      3: 'بني',
      4: 'رمادي',
      5: 'أحمر',
      6: 'أزرق',
      7: 'أخضر',
      8: 'زهري',
      9: 'أصفر',
      10: 'بيج',
      11: 'متعدد الألوان',
      12: 'أخرى',
    },
  },
  {
    name: 'material',
    label: 'المادة',
    icon: Icons.Sandal ? (
      <Icons.Sandal className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'جلد طبيعي',
      2: 'جلد صناعي',
      3: 'قماش',
      4: 'مطاط',
      5: 'بلاستيك',
      6: 'شامواه',
      7: 'أخرى',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: Icons.SportMedal ? (
      <Icons.SportMedal className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'نايكي',
      2: 'أديداس',
      3: 'بوما',
      4: 'سكيتشرز',
      5: 'كالفن كلاين',
      6: 'جيس',
      7: 'كونفيرس',
      8: 'أخرى',
    },
  },
  {
    name: 'usage',
    label: 'الاستخدام',
    icon: Icons.SportsHandball ? (
      <Icons.SportsHandball className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'رياضة',
      2: 'يومي',
      3: 'عمل',
      4: 'مناسبات',
      5: 'تزلج',
      6: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: Icons.CleaningServices ? (
      <Icons.CleaningServices className="text-primary-500 text-lg sm:text-xl" />
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

export default shoes;
