'use client';

import { FaBriefcase, FaGraduationCap, FaLanguage } from 'react-icons/fa';
import { MdCategory, MdWorkHistory, MdLocationOn } from 'react-icons/md';
import { GiSkills } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiTime } from 'react-icons/bi';

const jobs = [
  {
    name: 'نوع الوظيفة',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الوظيفة',
    options: {
      1: 'دوام كامل',
      2: 'دوام جزئي',
      3: 'عمل عن بعد',
      4: 'تدريب',
      5: 'عمل حر',
      6: 'عقد مؤقت',
    },
  },
  {
    name: 'المجال',
    icon: <FaBriefcase className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المجال',
    options: {
      1: 'تقنية المعلومات',
      2: 'هندسة',
      3: 'طب وصحة',
      4: 'تعليم',
      5: 'محاسبة ومالية',
      6: 'تسويق ومبيعات',
      7: 'إدارة وأعمال',
      8: 'خدمة عملاء',
      9: 'موارد بشرية',
      10: 'قانون',
      11: 'إعلام وصحافة',
      12: 'فنون وتصميم',
      13: 'حرف ومهن',
      14: 'أخرى',
    },
  },
  {
    name: 'المؤهل العلمي',
    icon: <FaGraduationCap className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المؤهل العلمي',
    options: {
      1: 'ثانوية عامة',
      2: 'دبلوم',
      3: 'بكالوريوس',
      4: 'ماجستير',
      5: 'دكتوراه',
      6: 'شهادات مهنية',
      7: 'غير مطلوب',
    },
  },
  {
    name: 'سنوات الخبرة',
    icon: <MdWorkHistory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر سنوات الخبرة',
    options: {
      1: 'بدون خبرة',
      2: '1-2 سنوات',
      3: '3-5 سنوات',
      4: '6-10 سنوات',
      5: 'أكثر من 10 سنوات',
    },
  },
  {
    name: 'المهارات المطلوبة',
    icon: <GiSkills className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المهارات المطلوبة',
    options: {
      1: 'لغة إنجليزية',
      2: 'حاسب آلي',
      3: 'برمجة',
      4: 'تصميم',
      5: 'إدارة مشاريع',
      6: 'تحليل بيانات',
      7: 'تسويق رقمي',
      8: 'مهارات إدارية',
      9: 'مهارات فنية',
      10: 'أخرى',
    },
  },
  {
    name: 'نطاق الراتب',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نطاق الراتب',
    options: {
      1: 'أقل من 3000',
      2: '3000-5000',
      3: '5000-7000',
      4: '7000-10000',
      5: '10000-15000',
      6: 'أكثر من 15000',
      7: 'حسب الخبرة',
    },
  },
  {
    name: 'اللغات المطلوبة',
    icon: <FaLanguage className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر اللغات المطلوبة',
    options: {
      1: 'العربية',
      2: 'الإنجليزية',
      3: 'الفرنسية',
      4: 'الألمانية',
      5: 'أخرى',
    },
  },
  {
    name: 'موقع العمل',
    icon: <MdLocationOn className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر موقع العمل',
    options: {
      1: 'داخل المدينة',
      2: 'خارج المدينة',
      3: 'عن بعد',
      4: 'مرن',
    },
  },
  {
    name: 'ساعات العمل',
    icon: <BiTime className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر ساعات العمل',
    options: {
      1: '8 ساعات',
      2: '6 ساعات',
      3: '4 ساعات',
      4: 'مرن',
      5: 'حسب الاتفاق',
    },
  },
];

export default jobs;
