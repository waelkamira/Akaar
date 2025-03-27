'use client';

import { FaMedkit, FaStethoscope, FaClinicMedical } from 'react-icons/fa';
import { MdCategory, MdLocalOffer } from 'react-icons/md';
import { GiMedicines } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiWorld } from 'react-icons/bi';

const medical = [
  {
    name: 'نوع المنتج',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المنتج',
    options: {
      1: 'أجهزة طبية',
      2: 'معدات طبية',
      3: 'مستلزمات طبية',
      4: 'أدوات جراحية',
      5: 'أجهزة تنفس',
      6: 'كراسي متحركة',
      7: 'أسرّة طبية',
      8: 'أجهزة قياس',
      9: 'معدات مختبرات',
      10: 'معدات أسنان',
      11: 'معدات بصريات',
      12: 'معدات علاج طبيعي',
      13: 'غير ذلك',
    },
  },
  {
    name: 'الحالة',
    icon: <FaMedkit className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة المنتج',
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
      3: 'صيانة',
      4: 'تبادل',
    },
  },
  {
    name: 'الماركة',
    icon: <FaStethoscope className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'Philips',
      2: 'Siemens',
      3: 'GE Healthcare',
      4: 'Medtronic',
      5: 'Johnson & Johnson',
      6: 'Fresenius',
      7: 'Abbott',
      8: 'Stryker',
      9: 'Becton Dickinson',
      10: 'Boston Scientific',
      11: 'Baxter',
      12: 'Zimmer Biomet',
      13: 'غير ذلك',
    },
  },
  {
    name: 'التخصص',
    icon: <FaClinicMedical className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر التخصص',
    options: {
      1: 'طب عام',
      2: 'جراحة',
      3: 'أسنان',
      4: 'عيون',
      5: 'نساء وولادة',
      6: 'أطفال',
      7: 'مختبرات',
      8: 'أشعة',
      9: 'علاج طبيعي',
      10: 'طوارئ',
      11: 'عناية مركزة',
      12: 'غير ذلك',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'ألمانيا',
      2: 'الولايات المتحدة',
      3: 'اليابان',
      4: 'سويسرا',
      5: 'فرنسا',
      6: 'المملكة المتحدة',
      7: 'كوريا الجنوبية',
      8: 'الصين',
      9: 'غير ذلك',
    },
  },
  {
    name: 'الضمان',
    icon: <GiMedicines className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الضمان',
    options: {
      1: 'ضمان المصنع',
      2: 'ضمان الوكيل',
      3: 'ضمان المحل',
      4: 'بدون ضمان',
    },
  },
];

export default medical;
