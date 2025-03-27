'use client';

import { FaTools, FaHammer, FaWrench } from 'react-icons/fa';
import { MdCategory, MdPower, MdBuild } from 'react-icons/md';
import { GiPowerGenerator } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiWorld } from 'react-icons/bi';

const tools = [
  {
    name: 'نوع الأدوات',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الأدوات',
    options: {
      1: 'أدوات يدوية',
      2: 'أدوات كهربائية',
      3: 'معدات بناء',
      4: 'معدات حدائق',
      5: 'معدات ورش',
      6: 'معدات سباكة',
      7: 'معدات نجارة',
      8: 'معدات كهربائية',
      9: 'معدات تكييف',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <FaTools className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة الأدوات',
    options: {
      1: 'جديد',
      2: 'مستعمل - ممتاز',
      3: 'مستعمل - جيد',
      4: 'يحتاج صيانة',
      5: 'قطع غيار',
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
      4: 'صيانة',
    },
  },
  {
    name: 'الماركة',
    icon: <FaHammer className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'Bosch',
      2: 'DeWalt',
      3: 'Makita',
      4: 'Milwaukee',
      5: 'Stanley',
      6: 'Black & Decker',
      7: 'Hilti',
      8: 'Craftsman',
      9: 'أخرى',
    },
  },
  {
    name: 'مصدر الطاقة',
    icon: <MdPower className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر مصدر الطاقة',
    options: {
      1: 'كهرباء مباشر',
      2: 'بطارية',
      3: 'بنزين',
      4: 'ديزل',
      5: 'يدوي',
      6: 'هوائي',
    },
  },
  {
    name: 'الاستخدام',
    icon: <FaWrench className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الاستخدام',
    options: {
      1: 'منزلي',
      2: 'مهني',
      2: 'حرفي',
      3: 'صناعي',
      4: 'مهني',
      5: 'تجاري',
    },
  },
  {
    name: 'مصدر الطاقة',
    icon: <MdPower className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر مصدر الطاقة',
    options: {
      1: 'كهرباء مباشر',
      2: 'بطارية',
      3: 'هوائي',
      4: 'يدوي',
      5: 'هيدروليكي',
      6: 'بنزين',
      7: 'غير ذلك',
    },
  },
  {
    name: 'الضمان',
    icon: <GiScrewdriver className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الضمان',
    options: {
      1: 'ضمان المصنع',
      2: 'ضمان الوكيل',
      3: 'ضمان المحل',
      4: 'بدون ضمان',
    },
  },
];

export default tools;
