'use client';

import { FaTv, FaCamera, FaHeadphones } from 'react-icons/fa';
import { MdCategory, MdScreenSize, MdSpeaker } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiGameConsole } from 'react-icons/gi';

const electronics = [
  {
    name: 'نوع الجهاز',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الجهاز',
    options: {
      1: 'تلفزيون',
      2: 'نظام صوت',
      3: 'كاميرا',
      4: 'سماعات',
      5: 'أجهزة ألعاب',
      6: 'أجهزة منزلية',
      7: 'أجهزة مكتبية',
      8: 'ملحقات وإكسسوارات',
    },
  },
  {
    name: 'الماركة',
    icon: <FaTv className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'Samsung',
      2: 'LG',
      3: 'Sony',
      4: 'Philips',
      5: 'Panasonic',
      6: 'TCL',
      7: 'Hisense',
      8: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة الجهاز',
    options: {
      1: 'جديد',
      2: 'مستعمل - كالجديد',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - يحتاج صيانة',
      5: 'للقطع',
    },
  },
  {
    name: 'حجم الشاشة',
    icon: <MdScreenSize className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حجم الشاشة',
    options: {
      1: '32 إنش',
      2: '43 إنش',
      3: '50 إنش',
      4: '55 إنش',
      5: '65 إنش',
      6: '75 إنش',
      7: 'أكبر من 75 إنش',
    },
  },
  {
    name: 'دقة الشاشة',
    icon: <FaTv className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر دقة الشاشة',
    options: {
      1: 'HD',
      2: 'Full HD',
      3: '2K',
      4: '4K',
      5: '8K',
    },
  },
  {
    name: 'نوع الصوت',
    icon: <MdSpeaker className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نظام الصوت',
    options: {
      1: 'سماعات مدمجة',
      2: 'نظام صوت 2.1',
      3: 'نظام صوت 5.1',
      4: 'نظام صوت 7.1',
      5: 'ساوند بار',
      6: 'أخرى',
    },
  },
  {
    name: 'الميزات',
    icon: <GiGameConsole className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الميزات',
    options: {
      1: 'Smart TV',
      2: 'HDR',
      3: 'Bluetooth',
      4: 'Wi-Fi',
      5: 'Voice Control',
      6: 'Gaming Mode',
    },
  },
  {
    name: 'الضمان',
    icon: <FaHeadphones className="text-primary-500 text-lg sm:text-xl" />,
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
      1: 'كوريا الجنوبية',
      2: 'اليابان',
      3: 'الصين',
      4: 'ماليزيا',
      5: 'تايلاند',
      6: 'أخرى',
    },
  },
];

export default electronics;
