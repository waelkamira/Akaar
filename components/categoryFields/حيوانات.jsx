'use client';

import { FaPaw, FaVenusMars, FaWeight } from 'react-icons/fa';
import { MdCategory, MdPets, MdVaccines } from 'react-icons/md';
import { GiDogBowl } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiCalendar } from 'react-icons/bi';

const pets = [
  {
    name: 'نوع الحيوان',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الحيوان',
    options: {
      1: 'قطط',
      2: 'كلاب',
      3: 'طيور',
      4: 'أسماك',
      5: 'أرانب',
      6: 'حيوانات المزرعة',
      7: 'زواحف',
      8: 'خيول',
      9: 'حيوانات نادرة',
      10: 'أخرى',
    },
  },
  {
    name: 'نوع المعاملة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المعاملة',
    options: {
      1: 'بيع',
      2: 'تبني',
      3: 'تزاوج',
      4: 'مستلزمات',
      5: 'خدمات بيطرية',
      6: 'تدريب',
    },
  },
  {
    name: 'السلالة',
    icon: <FaPaw className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر السلالة',
    options: {
      1: 'سلالة نقية',
      2: 'سلالة مختلطة',
      3: 'سلالة محلية',
      4: 'غير معروف',
    },
  },
  {
    name: 'العمر',
    icon: <BiCalendar className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر العمر',
    options: {
      1: 'أقل من شهر',
      2: '1-3 أشهر',
      3: '3-6 أشهر',
      4: '6-12 شهر',
      5: '1-2 سنة',
      6: '2-5 سنوات',
      7: 'أكثر من 5 سنوات',
    },
  },
  {
    name: 'الجنس',
    icon: <FaVenusMars className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الجنس',
    options: {
      1: 'ذكر',
      2: 'أنثى',
    },
  },
  {
    name: 'الحجم',
    icon: <FaWeight className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الحجم',
    options: {
      1: 'صغير جداً',
      2: 'صغير',
      3: 'متوسط',
      4: 'كبير',
      5: 'كبير جداً',
    },
  },
  {
    name: 'التطعيمات',
    icon: <MdVaccines className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة التطعيمات',
    options: {
      1: 'مطعم بالكامل',
      2: 'مطعم جزئياً',
      3: 'غير مطعم',
      4: 'غير معروف',
    },
  },
  {
    name: 'الحالة الصحية',
    icon: <MdPets className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الحالة الصحية',
    options: {
      1: 'ممتازة',
      2: 'جيدة',
      3: 'تحتاج رعاية',
      4: 'تحت العلاج',
    },
  },
  {
    name: 'المستلزمات',
    icon: <GiDogBowl className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المستلزمات المرفقة',
    options: {
      1: 'طعام',
      2: 'أدوات نظافة',
      3: 'ألعاب',
      4: 'سرير/قفص',
      5: 'ملابس/إكسسوارات',
      6: 'أدوية',
      7: 'لا شيء',
    },
  },
];

export default pets;
