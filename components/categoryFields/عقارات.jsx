'use client';

import { FaHome, FaBuilding, FaKey } from 'react-icons/fa';
import { MdCategory, MdLocationOn, MdApartment } from 'react-icons/md';
import { BiWorld, BiArea } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiHomeGarage, GiBed } from 'react-icons/gi';

const realestate = [
  {
    name: 'نوع العقار',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع العقار',
    options: {
      1: 'شقة',
      2: 'فيلا',
      3: 'بيت',
      4: 'أرض',
      5: 'عمارة',
      6: 'محل تجاري',
      7: 'مكتب',
      8: 'مستودع',
    },
  },
  {
    name: 'نوع المعاملة',
    icon: <FaKey className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المعاملة',
    options: {
      1: 'بيع',
      2: 'إيجار',
      3: 'استثمار',
      4: 'رهن',
      5: 'مشاركة',
      6: 'إدارة أملاك',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة العقار',
    options: {
      1: 'جديد',
      2: 'مستعمل - ممتاز',
      3: 'مستعمل - جيد',
      4: 'يحتاج صيانة',
      5: 'تحت الإنشاء',
    },
  },
  {
    name: 'المنطقة',
    icon: <MdLocationOn className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المنطقة',
    options: {
      1: 'شمال المدينة',
      2: 'جنوب المدينة',
      3: 'شرق المدينة',
      4: 'غرب المدينة',
      5: 'وسط المدينة',
      6: 'ضواحي المدينة',
    },
  },
  {
    name: 'المساحة',
    icon: <BiArea className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المساحة',
    options: {
      1: 'أقل من 100 متر',
      2: '100-150 متر',
      3: '150-200 متر',
      4: '200-300 متر',
      5: '300-500 متر',
      6: 'أكثر من 500 متر',
    },
  },
  {
    name: 'عدد الغرف',
    icon: <GiBed className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر عدد الغرف',
    options: {
      1: 'استديو',
      2: 'غرفة واحدة',
      3: 'غرفتين',
      4: '3 غرف',
      5: '4 غرف',
      6: '5 غرف فأكثر',
    },
  },
  {
    name: 'الطابق',
    icon: <FaBuilding className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الطابق',
    options: {
      1: 'أرضي',
      2: 'أول',
      3: 'ثاني',
      4: 'ثالث',
      5: 'رابع',
      6: 'خامس فأعلى',
      7: 'روف',
      8: 'بدروم',
    },
  },
  {
    name: 'المرافق',
    icon: <GiHomeGarage className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المرافق',
    options: {
      1: 'موقف سيارات',
      2: 'مصعد',
      3: 'حديقة',
      4: 'مسبح',
      5: 'نادي رياضي',
      6: 'حراسة',
      7: 'خدمات صيانة',
      8: 'مولد كهرباء',
    },
  },
  {
    name: 'التشطيب',
    icon: <MdApartment className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع التشطيب',
    options: {
      1: 'سوبر لوكس',
      2: 'لوكس',
      3: 'نصف تشطيب',
      4: 'على العظم',
      5: 'تشطيب قياسي',
      6: 'تحت التشطيب',
    },
  },
];

export default realestate;
