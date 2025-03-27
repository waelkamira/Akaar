'use client';

import { FaRunning, FaWeight, FaTshirt } from 'react-icons/fa';
import { MdCategory, MdSportsBasketball, MdFitness } from 'react-icons/md';
import { GiMuscleUp } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiWorld } from 'react-icons/bi';

const sports = [
  {
    name: 'نوع المعدات',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المعدات',
    options: {
      1: 'معدات رياضية',
      2: 'ملابس رياضية',
      3: 'أحذية رياضية',
      4: 'معدات كمال أجسام',
      5: 'معدات يوجا',
      6: 'معدات تخييم',
      7: 'معدات سباحة',
      8: 'إكسسوارات رياضية',
    },
  },
  {
    name: 'الرياضة',
    icon: (
      <MdSportsBasketball className="text-primary-500 text-lg sm:text-xl" />
    ),
    placeholder: 'اختر نوع الرياضة',
    options: {
      1: 'كرة قدم',
      2: 'كرة سلة',
      3: 'كمال أجسام',
      4: 'جري',
      5: 'سباحة',
      6: 'يوجا',
      7: 'تنس',
      8: 'كرة طائرة',
      9: 'دراجات',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة المعدات',
    options: {
      1: 'جديد',
      2: 'مستعمل - كالجديد',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - مقبول',
      5: 'يحتاج صيانة',
    },
  },
  {
    name: 'الماركة',
    icon: <FaRunning className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'Nike',
      2: 'Adidas',
      3: 'Puma',
      4: 'Under Armour',
      5: 'Reebok',
      6: 'New Balance',
      7: 'Asics',
      8: 'أخرى',
    },
  },
  {
    name: 'مستوى الاستخدام',
    icon: <MdFitness className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر مستوى الاستخدام',
    options: {
      1: 'مبتدئ',
      2: 'متوسط',
      3: 'محترف',
      4: 'مستوى تنافسي',
      5: 'جميع المستويات',
    },
  },
  {
    name: 'نوع التمرين',
    icon: <GiMuscleUp className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع التمرين',
    options: {
      1: 'كارديو',
      2: 'قوة',
      3: 'مرونة',
      4: 'توازن',
      5: 'تحمل',
      6: 'متعدد',
    },
  },
  {
    name: 'الوزن',
    icon: <FaWeight className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الوزن',
    options: {
      1: 'خفيف',
      2: 'متوسط',
      3: 'ثقيل',
      4: 'قابل للتعديل',
      5: 'غير محدد',
    },
  },
  {
    name: 'المقاس',
    icon: <FaTshirt className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المقاس',
    options: {
      1: 'XS',
      2: 'S',
      3: 'M',
      4: 'L',
      5: 'XL',
      6: 'XXL',
      7: 'مقاس موحد',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'أمريكا',
      2: 'الصين',
      3: 'فيتنام',
      4: 'إندونيسيا',
      5: 'تايلاند',
      6: 'أخرى',
    },
  },
];

export default sports;
