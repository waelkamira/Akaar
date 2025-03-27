'use client';

import { FaGift, FaHeart, FaBirthdayCake } from 'react-icons/fa';
import { MdCategory, MdCelebration, MdEvent } from 'react-icons/md';
import { GiPartyPopper, GiWrappedGift } from 'react-icons/gi';
import { IoMdPricetag } from 'react-icons/io';
import { BiWorld } from 'react-icons/bi';

const gifts = [
  {
    name: 'نوع الهدية',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الهدية',
    options: {
      1: 'هدايا عامة',
      2: 'هدايا أعياد الميلاد',
      3: 'هدايا زواج',
      4: 'هدايا مواليد',
      5: 'هدايا تخرج',
      6: 'هدايا رمضان',
      7: 'هدايا العيد',
      8: 'هدايا رجالية',
      9: 'هدايا نسائية',
      10: 'هدايا أطفال',
      11: 'هدايا تذكارية',
      12: 'غير ذلك',
    },
  },
  {
    name: 'الحالة',
    icon: <FaGift className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة الهدية',
    options: {
      1: 'جديد',
      2: 'مستعمل - ممتاز',
      3: 'مستعمل - جيد',
      4: 'تغليف أصلي',
      5: 'بدون تغليف',
    },
  },
  {
    name: 'نوع المعاملة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المعاملة',
    options: {
      1: 'بيع',
      2: 'تبادل',
      3: 'إهداء',
      4: 'تغليف فقط',
    },
  },
  {
    name: 'المناسبة',
    icon: <MdEvent className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر المناسبة',
    options: {
      1: 'عيد ميلاد',
      2: 'زواج',
      3: 'مولود جديد',
      4: 'تخرج',
      5: 'عيد',
      6: 'مناسبة خاصة',
      7: 'شكر وتقدير',
      8: 'غير ذلك',
    },
  },
  {
    name: 'الفئة المستهدفة',
    icon: <FaHeart className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الفئة المستهدفة',
    options: {
      1: 'رجال',
      2: 'نساء',
      3: 'أطفال',
      4: 'عائلات',
      5: 'أزواج',
      6: 'مواليد',
      7: 'الجميع',
    },
  },
  {
    name: 'خدمة التغليف',
    icon: <GiWrappedGift className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع التغليف',
    options: {
      1: 'تغليف فاخر',
      2: 'تغليف بسيط',
      3: 'تغليف حسب الطلب',
      4: 'بدون تغليف',
      5: 'علبة هدايا',
    },
  },
  {
    name: 'التوصيل',
    icon: <MdCelebration className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر خدمة التوصيل',
    options: {
      1: 'توصيل مجاني',
      2: 'توصيل بمقابل',
      3: 'استلام من المحل',
      4: 'توصيل مع مفاجأة',
      5: 'حسب الاتفاق',
    },
  },
];

export default gifts;
