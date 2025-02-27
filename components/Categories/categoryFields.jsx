'use client';
import {
  FaBed,
  FaRulerCombined,
  FaHome,
  FaCar,
  FaCalendarAlt,
  FaTools,
  FaMobile,
  FaMemory,
  FaBatteryFull,
} from 'react-icons/fa';

const categoryFields = {
  1: [
    {
      name: 'نوع العقار',
      icon: <FaHome className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'بيت',
        2: 'شقة',
        3: 'أرض',
        4: 'مزرعة',
        5: 'فيلا',
        6: 'معمل',
        7: 'غير ذلك',
      },
    },
    {
      name: 'عدد الغرف',
      icon: <FaBed className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: '1 + 1',
        2: '2 + 1',
        3: '3 + 1',
        4: '4 + 1',
        5: '5 + 1',
        6: 'غير ذلك',
      },
    },
    {
      name: 'المساحة',
      icon: <FaRulerCombined className="text-one text-lg sm:text-xl" />,
      placeholder: '200 م2',
    },
  ],
  2: [
    {
      name: 'الماركة',
      icon: <FaCar className="text-one text-lg sm:text-xl" />,
      placeholder: 'تويوتا',
    },
    {
      name: 'الموديل',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: 'كورولا',
    },
    {
      name: 'السنة',
      icon: <FaCalendarAlt className="text-one text-lg sm:text-xl" />,
      placeholder: '2021',
    },
    {
      name: 'الحالة',
      icon: <FaCar className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديدة',
        2: 'مستعملة',
      },
    },
  ],
  3: [
    {
      name: 'الماركة',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: 'سامسونج',
    },
    {
      name: 'الموديل',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: 'Galaxy S21',
    },
    {
      name: 'سعة التخزين',
      icon: <FaMemory className="text-one text-lg sm:text-xl" />,
      placeholder: '128 جيجابايت',
    },
    {
      name: 'حالة البطارية',
      icon: <FaBatteryFull className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديدة',
        2: 'جيدة',
        3: 'ضعيفة',
      },
    },
    {
      name: 'الحالة العامة',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
};

export default categoryFields;
