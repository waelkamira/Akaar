import React from 'react';
import { GiHairStrands, GiLipstick, GiPerfumeBottle } from 'react-icons/gi';
import { PiHairDryerFill } from 'react-icons/pi';

import {
  MdFaceRetouchingNatural,
  MdOutlineSpa,
  MdOutlineCleanHands,
  MdOutlineColorLens,
} from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';

let Icons = {};

try {
  Icons = {
    ProductType: MdOutlineSpa,
    MakeupType: GiLipstick,
    SkinCareType: MdFaceRetouchingNatural,
    SkinType: MdOutlineCleanHands,
    HairType: GiHairStrands,
    HairCareType: PiHairDryerFill,
    FragranceType: GiPerfumeBottle,
    Color: MdOutlineColorLens,
    Condition: BiCategory,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات مستحضرات التجميل غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const beauty = [
  {
    name: 'productType',
    label: 'نوع المنتج',
    icon: Icons.ProductType ? (
      <Icons.ProductType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'مكياج',
      2: 'العناية بالبشرة',
      3: 'العناية بالشعر',
      4: 'عطور',
      5: 'أدوات تجميل',
      6: 'حلاقة',
      7: 'العناية بالفم',
      8: 'الاستحمام والجسم',
      9: 'العناية بالأظافر',
      10: 'أخرى',
    },
  },
  {
    name: 'makeupType',
    label: 'نوع المكياج',
    icon: Icons.MakeupType ? (
      <Icons.MakeupType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'وجه (أساس، كونسيلر، بودرة)',
      2: 'عيون (ظلال، كحل، ماسكارا)',
      3: 'شفاه (أحمر شفاه، ملمع شفاه)',
      4: 'خدود (بلاشر، برونزر)',
      5: 'مثبت مكياج',
      6: 'أخرى',
    },
  },
  {
    name: 'skinCareType',
    label: 'نوع العناية بالبشرة',
    icon: Icons.SkinCareType ? (
      <Icons.SkinCareType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'مرطب',
      2: 'منظف',
      3: 'مقشر',
      4: 'مصل',
      5: 'واقي شمس',
      6: 'كريم عيون',
      7: 'علاج حب الشباب',
      8: 'أخرى',
    },
  },
  {
    name: 'skinType',
    label: 'نوع البشرة',
    icon: Icons.SkinType ? (
      <Icons.SkinType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'عادية',
      2: 'جافة',
      3: 'دهنية',
      4: 'مختلطة',
      5: 'حساسة',
      6: 'معرضة لحب الشباب',
      7: 'ناضجة',
      8: 'أخرى',
    },
  },
  {
    name: 'hairType',
    label: 'نوع الشعر',
    icon: Icons.HairType ? (
      <Icons.HairType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'عادي',
      2: 'جاف',
      3: 'دهني',
      4: 'تالف',
      5: 'معالج بالصبغة',
      6: 'ناعم',
      7: 'سميك',
      8: 'مجعد',
      9: 'مستقيم',
      10: 'أخرى',
    },
  },
  {
    name: 'hairCareType',
    label: 'نوع العناية بالشعر',
    icon: Icons.HairCareType ? (
      <Icons.HairCareType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'شامبو',
      2: 'بلسم',
      3: 'ماسك',
      4: 'زيت',
      5: 'مصل',
      6: 'علاج تساقط',
      7: 'صبغة شعر',
      8: 'أخرى',
    },
  },
  {
    name: 'fragranceType',
    label: 'نوع العطر',
    icon: Icons.FragranceType ? (
      <Icons.FragranceType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'بارفان',
      2: 'أودي تواليت',
      3: 'أودي بيرفوم',
      4: 'كولونيا',
      5: 'عطر زيتي',
      6: 'أخرى',
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
      2: 'بني',
      3: 'أشقر',
      4: 'أحمر',
      5: 'وردي',
      6: 'لون بشري',
      7: 'بنفسجي',
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
      2: 'مستعمل',
      3: 'مفتوح وغير مستخدم',
      4: 'أخرى',
    },
  },
];

export default beauty;
