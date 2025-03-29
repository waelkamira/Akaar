import {
  FaGift,
  FaRing,
  FaBook,
  FaWineGlassAlt,
  FaTshirt,
  FaHome,
  FaMusic,
  FaGamepad,
  FaPalette,
  FaSpa,
  FaUtensils,
  FaPlane,
} from 'react-icons/fa';
import {
  GiJeweledChalice,
  GiPerfumeBottle,
  GiCookingPot,
  GiFlowerPot,
  GiChocolateBar,
  GiTeddyBear,
  GiWoodenFrame,
  GiCrystalBall,
  GiPocketWatch,
} from 'react-icons/gi';

const gifts = [
  {
    name: 'giftCategory',
    label: 'فئة الهدية',
    icon: <FaGift className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'مجوهرات',
      2: 'إكسسوارات',
      3: 'كتب ومجلات',
      4: 'مشروبات',
      5: 'ملابس',
      6: 'ديكور منزلي',
      7: 'أجهزة إلكترونية',
      8: 'ألعاب',
      9: 'أعمال فنية',
      10: 'منتجات تجميل',
      11: 'أدوات مطبخ',
      12: 'نباتات وزهور',
      13: 'حلويات وشوكولاتة',
      14: 'دمى ولعب أطفال',
      15: 'هدايا سفر',
      16: 'أخرى',
    },
  },

  {
    name: 'wrapping',
    label: 'التغليف',
    icon: <GiWoodenFrame className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'متوفر تغليف هدايا',
      2: 'بدون تغليف',
      3: 'تغليف مميز (بطلب خاص)',
    },
  },
  {
    name: 'personalization',
    label: 'التخصيص',
    icon: <GiCrystalBall className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'إضافة اسم',
      2: 'إضافة تاريخ',
      3: 'إضافة صورة',
      4: 'إضافة رسالة',
      5: 'بدون تخصيص',
    },
  },
  {
    name: 'delivery',
    label: 'التوصيل',
    icon: <FaPlane className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'توصيل سريع',
      2: 'توصيل في نفس اليوم',
      3: 'توصيل مجاني',
      4: 'استلام من المحل',
    },
  },
];

export default gifts;
