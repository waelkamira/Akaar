'use client';

import { FaTools, FaClock, FaUserTie } from 'react-icons/fa';
import { MdCategory, MdLocationOn, MdPayment } from 'react-icons/md';
import { GiSkills } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiCertification } from 'react-icons/bi';

const services = [
  {
    name: 'نوع الخدمة',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الخدمة',
    options: {
      1: 'صيانة وإصلاح',
      2: 'تنظيف',
      3: 'نقل وتوصيل',
      4: 'تعليم وتدريب',
      5: 'تصميم وبرمجة',
      6: 'استشارات',
      7: 'خدمات منزلية',
      8: 'خدمات سيارات',
      9: 'خدمات طبية',
      10: 'خدمات قانونية',
      11: 'خدمات محاسبية',
      12: 'خدمات تسويقية',
      13: 'أخرى',
    },
  },
  {
    name: 'مستوى الخبرة',
    icon: <FaUserTie className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر مستوى الخبرة',
    options: {
      1: 'مبتدئ',
      2: 'متوسط',
      3: 'محترف',
      4: 'خبير',
    },
  },
  {
    name: 'المؤهلات',
    icon: <BiCertification className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المؤهلات',
    options: {
      1: 'شهادة مهنية',
      2: 'رخصة مزاولة',
      3: 'شهادة جامعية',
      4: 'دورات تدريبية',
      5: 'خبرة عملية',
      6: 'غير مطلوب',
    },
  },
  {
    name: 'نطاق السعر',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نطاق السعر',
    options: {
      1: 'أقل من 100',
      2: '100-300',
      3: '300-500',
      4: '500-1000',
      5: 'أكثر من 1000',
      6: 'حسب الاتفاق',
    },
  },
  {
    name: 'وقت التنفيذ',
    icon: <FaClock className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر وقت التنفيذ',
    options: {
      1: 'ساعات',
      2: '1-3 أيام',
      3: '4-7 أيام',
      4: 'أسبوعين',
      5: 'شهر',
      6: 'حسب الاتفاق',
    },
  },
  {
    name: 'المهارات',
    icon: <GiSkills className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المهارات',
    options: {
      1: 'مهارات تقنية',
      2: 'مهارات إدارية',
      3: 'مهارات فنية',
      4: 'مهارات تواصل',
      5: 'مهارات تحليلية',
      6: 'مهارات يدوية',
      7: 'أخرى',
    },
  },
  {
    name: 'طريقة الدفع',
    icon: <MdPayment className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر طريقة الدفع',
    options: {
      1: 'نقداً',
      2: 'تحويل بنكي',
      3: 'بطاقة ائتمان',
      4: 'محفظة إلكترونية',
      5: 'دفع عند الاستلام',
    },
  },
  {
    name: 'نطاق الخدمة',
    icon: <MdLocationOn className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نطاق الخدمة',
    options: {
      1: 'داخل المدينة',
      2: 'خارج المدينة',
      3: 'عن بعد',
      4: 'جميع المناطق',
    },
  },
  {
    name: 'الأدوات المستخدمة',
    icon: <FaTools className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الأدوات المستخدمة',
    options: {
      1: 'أدوات خاصة',
      2: 'معدات احترافية',
      3: 'برامج وتطبيقات',
      4: 'أدوات يدوية',
      5: 'غير مطلوب',
    },
  },
];

export default services;
