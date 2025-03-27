'use client';

import { FaBook, FaLanguage, FaBookReader } from 'react-icons/fa';
import { MdCategory, MdMenuBook, MdSchool } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiBookshelf, GiBookCover } from 'react-icons/gi';

const books = [
  {
    name: 'نوع الكتاب',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الكتاب',
    options: {
      1: 'كتب دراسية',
      2: 'كتب أدبية',
      3: 'كتب دينية',
      4: 'كتب علمية',
      5: 'كتب أطفال',
      6: 'مجلات',
      7: 'موسوعات',
      8: 'كتب تعليمية',
    },
  },
  {
    name: 'التصنيف',
    icon: <GiBookshelf className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر التصنيف',
    options: {
      1: 'روايات',
      2: 'قصص قصيرة',
      3: 'شعر',
      4: 'تنمية بشرية',
      5: 'تاريخ',
      6: 'سياسة',
      7: 'اقتصاد',
      8: 'علوم',
      9: 'فلسفة',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة الكتاب',
    options: {
      1: 'جديد',
      2: 'مستعمل - كالجديد',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - مقبول',
      5: 'قديم - نادر',
    },
  },
  {
    name: 'اللغة',
    icon: <FaLanguage className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر لغة الكتاب',
    options: {
      1: 'العربية',
      2: 'الإنجليزية',
      3: 'الفرنسية',
      4: 'الألمانية',
      5: 'التركية',
      6: 'متعدد اللغات',
      7: 'أخرى',
    },
  },
  {
    name: 'المستوى التعليمي',
    icon: <MdSchool className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المستوى التعليمي',
    options: {
      1: 'ابتدائي',
      2: 'متوسط',
      3: 'ثانوي',
      4: 'جامعي',
      5: 'دراسات عليا',
      6: 'عام',
    },
  },
  {
    name: 'نوع الغلاف',
    icon: <GiBookCover className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الغلاف',
    options: {
      1: 'غلاف صلب',
      2: 'غلاف ورقي',
      3: 'غلاف فني',
      4: 'نسخة إلكترونية',
      5: 'غلاف جلدي',
    },
  },
  {
    name: 'الفئة العمرية',
    icon: <FaBookReader className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الفئة العمرية',
    options: {
      1: '3-6 سنوات',
      2: '7-12 سنة',
      3: '13-17 سنة',
      4: '18 فما فوق',
      5: 'جميع الأعمار',
    },
  },
  {
    name: 'دار النشر',
    icon: <MdMenuBook className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر دار النشر',
    options: {
      1: 'دار العلم للملايين',
      2: 'مكتبة جرير',
      3: 'دار الشروق',
      4: 'دار المعارف',
      5: 'دار الساقي',
      6: 'أخرى',
    },
  },
  {
    name: 'بلد النشر',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد النشر',
    options: {
      1: 'مصر',
      2: 'لبنان',
      3: 'السعودية',
      4: 'الأردن',
      5: 'المغرب',
      6: 'أخرى',
    },
  },
];

export default books;
