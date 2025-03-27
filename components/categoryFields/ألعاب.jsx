'use client';

import { FaGamepad, FaChild, FaPuzzlePiece } from 'react-icons/fa';
import { MdCategory, MdSportsEsports, MdToys } from 'react-icons/md';
import { GiAges } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiWorld } from 'react-icons/bi';

const games = [
  {
    name: 'نوع الألعاب',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الألعاب',
    options: {
      1: 'ألعاب فيديو',
      2: 'ألعاب تعليمية',
      3: 'ألعاب أطفال',
      4: 'ألعاب رياضية',
      5: 'ألعاب إلكترونية',
      6: 'ألعاب لوحية',
      7: 'ألعاب تركيب',
      8: 'دمى وعرائس',
      9: 'ألعاب خارجية',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <FaGamepad className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة اللعبة',
    options: {
      1: 'جديد',
      2: 'مستعمل - ممتاز',
      3: 'مستعمل - جيد',
      4: 'يحتاج إصلاح',
      5: 'غير كامل',
    },
  },
  {
    name: 'نوع المعاملة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المعاملة',
    options: {
      1: 'بيع',
      2: 'تأجير',
      3: 'تبادل',
      4: 'إهداء',
    },
  },
  {
    name: 'المنصة',
    icon: <MdSportsEsports className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المنصة',
    options: {
      1: 'PlayStation',
      2: 'Xbox',
      3: 'Nintendo',
      4: 'PC',
      5: 'Mobile',
      6: 'غير إلكتروني',
    },
  },
  {
    name: 'الفئة العمرية',
    icon: <GiAges className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الفئة العمرية',
    options: {
      1: '0-2 سنوات',
      2: '3-5 سنوات',
      3: '6-8 سنوات',
      4: '9-12 سنة',
      5: '13-17 سنة',
      6: '18+',
      7: 'جميع الأعمار',
    },
  },
  {
    name: 'نوع اللعب',
    icon: <FaChild className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع اللعب',
    options: {
      1: 'فردي',
      2: 'ثنائي',
      3: 'جماعي',
      4: 'عبر الإنترنت',
      5: 'متعدد اللاعبين',
    },
  },
  {
    name: 'التصنيف',
    icon: <FaPuzzlePiece className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر التصنيف',
    options: {
      1: 'مغامرات',
      2: 'أكشن',
      3: 'رياضة',
      4: 'سباقات',
      5: 'استراتيجية',
      6: 'تعليمي',
      7: 'ألغاز',
      8: 'محاكاة',
      9: 'أخرى',
    },
  },
  {
    name: 'الملحقات',
    icon: <MdToys className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الملحقات',
    options: {
      1: 'علبة أصلية',
      2: 'دليل المستخدم',
      3: 'وحدات تحكم إضافية',
      4: 'بطاريات',
      5: 'شاحن',
      6: 'ملحقات إضافية',
      7: 'لا يوجد',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'اليابان',
      2: 'أمريكا',
      3: 'الصين',
      4: 'كوريا',
      5: 'ألمانيا',
      6: 'محلي',
      7: 'أخرى',
    },
  },
];

export default games;
