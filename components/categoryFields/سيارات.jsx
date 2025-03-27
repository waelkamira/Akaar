'use client';
import { FaCar, FaCog, FaGasPump } from 'react-icons/fa';
import { MdCategory, MdSpeed, MdColorLens } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiCarWheel, GiGearStickPattern } from 'react-icons/gi';

const cars = [
  {
    name: 'نوع المركبة',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المركبة',
    options: {
      1: 'سيارة',
      2: 'دراجة نارية',
      3: 'شاحنة',
      4: 'حافلة',
      5: 'قارب',
      6: 'معدات ثقيلة',
      7: 'قطع غيار',
      8: 'إكسسوارات',
    },
  },
  {
    name: 'الماركة',
    icon: <FaCar className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'تويوتا',
      2: 'هوندا',
      3: 'نيسان',
      4: 'مرسيدس',
      5: 'بي إم دبليو',
      6: 'أودي',
      7: 'هيونداي',
      8: 'كيا',
      9: 'فورد',
      10: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة المركبة',
    options: {
      1: 'جديد',
      2: 'مستعمل - كالجديد',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - يحتاج صيانة',
      5: 'للقطع',
    },
  },
  {
    name: 'سنة الصنع',
    icon: <FaCog className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر سنة الصنع',
    options: {
      1: '2024',
      2: '2023',
      3: '2022',
      4: '2021',
      5: '2020',
      6: '2019',
      7: '2018',
      8: '2017',
      9: '2016',
      10: 'أقدم',
    },
  },
  {
    name: 'نوع الوقود',
    icon: <FaGasPump className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الوقود',
    options: {
      1: 'بنزين',
      2: 'ديزل',
      3: 'كهربائي',
      4: 'هجين',
      5: 'غاز طبيعي',
    },
  },
  {
    name: 'ناقل الحركة',
    icon: (
      <GiGearStickPattern className="text-primary-500 text-lg sm:text-xl" />
    ),
    placeholder: 'اختر نوع ناقل الحركة',
    options: {
      1: 'أوتوماتيك',
      2: 'يدوي',
      3: 'نصف أوتوماتيك',
      4: 'CVT',
    },
  },
  {
    name: 'المسافة المقطوعة',
    icon: <MdSpeed className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المسافة المقطوعة',
    options: {
      1: 'أقل من 50,000 كم',
      2: '50,000-100,000 كم',
      3: '100,000-150,000 كم',
      4: '150,000-200,000 كم',
      5: 'أكثر من 200,000 كم',
    },
  },
  {
    name: 'اللون',
    icon: <MdColorLens className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر اللون',
    options: {
      1: 'أبيض',
      2: 'أسود',
      3: 'فضي',
      4: 'رمادي',
      5: 'أحمر',
      6: 'أزرق',
      7: 'بني',
      8: 'أخرى',
    },
  },
  {
    name: 'عدد السلندرات',
    icon: <GiCarWheel className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر عدد السلندرات',
    options: {
      1: '3 سلندر',
      2: '4 سلندر',
      3: '6 سلندر',
      4: '8 سلندر',
      5: '12 سلندر',
      6: 'كهربائي',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'اليابان',
      2: 'كوريا الجنوبية',
      3: 'ألمانيا',
      4: 'أمريكا',
      5: 'الصين',
      6: 'أخرى',
    },
  },
];

export default cars;
