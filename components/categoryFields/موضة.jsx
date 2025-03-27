'use client';

import { FaTshirt, FaRulerCombined } from 'react-icons/fa';
import { MdCategory, MdStyle, MdColorLens } from 'react-icons/md';
import { GiClothes, GiSewingNeedle } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiWorld } from 'react-icons/bi';

const fashion = [
  {
    name: 'نوع الملابس',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الملابس',
    options: {
      1: 'ملابس رجالية',
      2: 'ملابس نسائية',
      3: 'ملابس أطفال',
      4: 'أحذية',
      5: 'حقائب',
      6: 'إكسسوارات',
      7: 'ملابس رياضية',
      8: 'ملابس رسمية',
      9: 'ملابس تقليدية',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <FaTshirt className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة الملابس',
    options: {
      1: 'جديد بالتاج',
      2: 'جديد',
      3: 'مستعمل - ممتاز',
      4: 'مستعمل - جيد',
      5: 'تحتاج إصلاح',
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
    name: 'الماركة',
    icon: <GiClothes className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'Zara',
      2: 'H&M',
      3: 'Nike',
      4: 'Adidas',
      5: 'Puma',
      6: 'Gucci',
      7: 'Louis Vuitton',
      8: 'Chanel',
      9: 'Dior',
      10: 'أخرى',
    },
  },
  {
    name: 'المقاس',
    icon: <FaRulerCombined className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المقاس',
    options: {
      1: 'XS',
      2: 'S',
      3: 'M',
      4: 'L',
      5: 'XL',
      6: 'XXL',
      7: 'XXXL',
      8: 'مقاس موحد',
    },
  },
  {
    name: 'المادة',
    icon: <GiSewingNeedle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المادة',
    options: {
      1: 'قطن',
      2: 'بوليستر',
      3: 'حرير',
      4: 'صوف',
      5: 'جلد',
      6: 'جينز',
      7: 'ساتان',
      8: 'شيفون',
      9: 'أخرى',
    },
  },
  {
    name: 'النمط',
    icon: <MdStyle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر النمط',
    options: {
      1: 'كاجوال',
      2: 'رسمي',
      3: 'رياضي',
      4: 'تقليدي',
      5: 'عصري',
      6: 'كلاسيك',
      7: 'أنيق',
      8: 'بوهيمي',
    },
  },
  {
    name: 'اللون',
    icon: <MdColorLens className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر اللون',
    options: {
      1: 'أسود',
      2: 'أبيض',
      3: 'أحمر',
      4: 'أزرق',
      5: 'أخضر',
      6: 'أصفر',
      7: 'بني',
      8: 'رمادي',
      9: 'وردي',
      10: 'متعدد الألوان',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'تركيا',
      2: 'الصين',
      3: 'إيطاليا',
      4: 'فرنسا',
      5: 'الولايات المتحدة',
      6: 'اليابان',
      7: 'كوريا',
      8: 'محلي',
      9: 'أخرى',
    },
  },
];

export default fashion;
