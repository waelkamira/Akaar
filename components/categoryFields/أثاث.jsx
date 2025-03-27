'use client';

import { FaCouch, FaBed, FaChair } from 'react-icons/fa';
import { MdCategory, MdStyle, MdOutlineTexture } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiWoodBeam, GiSofa } from 'react-icons/gi';

const furniture = [
  {
    name: 'نوع الأثاث',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الأثاث',
    options: {
      1: 'غرفة نوم',
      2: 'صالة',
      3: 'غرفة طعام',
      4: 'مكتب',
      5: 'مطبخ',
      6: 'حديقة',
      7: 'إضاءة',
      8: 'سجاد وموكيت',
      9: 'ستائر ومفروشات',
      10: 'تحف وديكور',
    },
  },
  {
    name: 'القطعة',
    icon: <FaCouch className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع القطعة',
    options: {
      1: 'سرير',
      2: 'كنب',
      3: 'طاولة',
      4: 'كرسي',
      5: 'خزانة',
      6: 'مكتبة',
      7: 'تسريحة',
      8: 'كومودينو',
      9: 'مرآة',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة الأثاث',
    options: {
      1: 'جديد',
      2: 'مستعمل - كالجديد',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - يحتاج صيانة',
      5: 'أثاث قديم (أنتيك)',
    },
  },
  {
    name: 'النمط',
    icon: <MdStyle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر النمط',
    options: {
      1: 'عصري',
      2: 'كلاسيكي',
      3: 'مودرن',
      4: 'ريفي',
      5: 'صناعي',
      6: 'بوهيمي',
      7: 'مينيمال',
      8: 'أخرى',
    },
  },
  {
    name: 'المادة',
    icon: <GiWoodBeam className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المادة',
    options: {
      1: 'خشب',
      2: 'معدن',
      3: 'زجاج',
      4: 'قماش',
      5: 'جلد',
      6: 'بلاستيك',
      7: 'رخام',
      8: 'متعدد المواد',
    },
  },
  {
    name: 'اللون',
    icon: <MdOutlineTexture className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر اللون',
    options: {
      1: 'بني',
      2: 'أسود',
      3: 'أبيض',
      4: 'رمادي',
      5: 'بيج',
      6: 'أزرق',
      7: 'أخضر',
      8: 'متعدد الألوان',
    },
  },
  {
    name: 'الحجم',
    icon: <GiSofa className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الحجم',
    options: {
      1: 'صغير',
      2: 'متوسط',
      3: 'كبير',
      4: 'كبير جداً',
    },
  },
  {
    name: 'الضمان',
    icon: <FaChair className="text-primary-500 text-lg sm:text-xl" />,
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
      1: 'محلي',
      2: 'تركيا',
      3: 'ماليزيا',
      4: 'الصين',
      5: 'إيطاليا',
      6: 'أخرى',
    },
  },
];

export default furniture;
