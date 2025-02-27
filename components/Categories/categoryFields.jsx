'use client';
import {
  FaBed,
  FaRulerCombined,
  FaHome,
  FaCar,
  FaCalendarAlt,
  FaTools,
} from 'react-icons/fa';

const categoryFields = {
  1: [
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
      name: 'المساحة بالمتر المربع',
      icon: <FaRulerCombined className="text-one text-lg sm:text-xl" />,
      placeholder: '200 م2',
    },
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
  ],
  2: [
    {
      name: 'الماركة',
      icon: <FaCar className="text-one text-lg sm:text-xl" />,
      placeholder: 'تويوتا',
    },
    {
      name: 'موديل السيارة',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: 'كورولا',
    },
    {
      name: 'السنة',
      icon: <FaCalendarAlt className="text-one text-lg sm:text-xl" />,
      placeholder: '2021',
    },
    {
      name: 'حالة السيارة',
      icon: <FaCar className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديدة',
        2: 'مستعملة',
      },
    },
  ],
};

export default categoryFields;
