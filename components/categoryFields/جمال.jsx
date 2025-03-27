'use client';

import { FaSprayCan, FaLeaf, FaShoppingBag } from 'react-icons/fa';
import { MdCategory, MdFace, MdSpa } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiLipstick, GiPerfumeBottle } from 'react-icons/gi';

const beauty = [
  {
    name: 'نوع المنتج',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المنتج',
    options: {
      1: 'مستحضرات تجميل',
      2: 'عناية بالبشرة',
      3: 'عناية بالشعر',
      4: 'عطور',
      5: 'مستلزمات استحمام',
      6: 'أدوات تجميل',
      7: 'عناية بالأظافر',
      8: 'منتجات طبيعية',
    },
  },
  {
    name: 'الفئة',
    icon: <GiLipstick className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الفئة',
    options: {
      1: 'كريمات',
      2: 'مكياج',
      3: 'شامبو وبلسم',
      4: 'صبغات شعر',
      5: 'مرطبات',
      6: 'مقشرات',
      7: 'ماسكات',
      8: 'زيوت',
      9: 'صابون',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة المنتج',
    options: {
      1: 'جديد',
      2: 'مستعمل - لم يفتح',
      3: 'مستعمل - تم الاستخدام مرة واحدة',
      4: 'مستعمل - متبقي أكثر من النصف',
      5: 'عينات تجريبية',
    },
  },
  {
    name: 'الماركة',
    icon: <FaShoppingBag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'MAC',
      2: 'Nivea',
      3: "L'Oreal",
      4: 'Maybelline',
      5: 'The Ordinary',
      6: 'Dove',
      7: "Johnson's",
      8: 'أخرى',
    },
  },
  {
    name: 'نوع البشرة',
    icon: <MdFace className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع البشرة',
    options: {
      1: 'عادية',
      2: 'دهنية',
      3: 'جافة',
      4: 'مختلطة',
      5: 'حساسة',
      6: 'جميع أنواع البشرة',
    },
  },
  {
    name: 'نوع العطر',
    icon: <GiPerfumeBottle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع العطر',
    options: {
      1: 'شرقي',
      2: 'فرنسي',
      3: 'زهري',
      4: 'فواكه',
      5: 'خشبي',
      6: 'مسك',
      7: 'عود',
      8: 'أخرى',
    },
  },
  {
    name: 'المكونات الرئيسية',
    icon: <FaLeaf className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المكونات الرئيسية',
    options: {
      1: 'فيتامينات',
      2: 'زيوت طبيعية',
      3: 'أعشاب',
      4: 'مستخلصات طبيعية',
      5: 'كولاجين',
      6: 'حمض الهيالورونيك',
      7: 'ريتينول',
      8: 'أخرى',
    },
  },
  {
    name: 'الاستخدام',
    icon: <MdSpa className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الاستخدام',
    options: {
      1: 'يومي',
      2: 'أسبوعي',
      3: 'شهري',
      4: 'حسب الحاجة',
      5: 'مناسبات خاصة',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'فرنسا',
      2: 'الولايات المتحدة',
      3: 'كوريا الجنوبية',
      4: 'اليابان',
      5: 'ألمانيا',
      6: 'أخرى',
    },
  },
];

export default beauty;
