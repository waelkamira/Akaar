import {
  FaGamepad,
  FaDice,
  FaPuzzlePiece,
  FaBook,
  FaRobot,
  FaChess,
  FaHeadset,
  FaMobileAlt,
  FaLaptop,
  FaChild,
} from 'react-icons/fa';
import {
  GiCardPlay,
  GiConsoleController,
  GiCardboardBox,
  GiPistolGun,
  GiSwordman,
  GiRaceCar,
} from 'react-icons/gi';

const games = [
  {
    name: 'type',
    label: 'نوع اللعبة',
    icon: <FaGamepad className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'لعبة فيديو',
      2: 'لعبة لوحية',
      3: 'لعبة أطفال',
      4: 'أحجية',
      5: 'مقتنيات',
      6: 'ألعاب بطاقات',
      7: 'ألعاب تعليمية',
      8: 'أخرى',
    },
  },
  {
    name: 'platform',
    label: 'المنصة',
    icon: (
      <GiConsoleController className="text-primary-500 text-lg sm:text-xl" />
    ),
    placeholder: '-اختر-',
    options: {
      1: 'بلاي ستيشن 5',
      2: 'إكس بوكس سيريس إكس',
      3: 'نينتندو سويتش',
      4: 'بلاي ستيشن 4',
      5: 'إكس بوكس ون',
      6: 'كمبيوتر',
      7: 'موبايل',
      8: 'أخرى',
    },
  },
  {
    name: 'genre',
    label: 'النوع',
    icon: <FaGamepad className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أكشن',
      2: 'مغامرة',
      3: 'استراتيجية',
      4: 'رياضية',
      5: 'RPG',
      6: 'سباقات',
      7: 'قتال',
      8: 'رعب',
      9: 'محاكاة',
      10: 'أخرى',
    },
  },
  {
    name: 'boardGameType',
    label: 'نوع اللعبة اللوحية',
    icon: <FaDice className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'إستراتيجية',
      2: 'حظ',
      3: 'تعليمية',
      4: 'أحاجي',
      5: 'بطاقات',
      6: 'أخرى',
    },
  },
  {
    name: 'minAge',
    label: 'الحد الأدنى للعمر',
    icon: <FaChild className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '3 سنوات+',
      2: '6 سنوات+',
      3: '12 سنوات+',
      4: '16 سنوات+',
      5: '18 سنوات+',
      6: 'للجميع',
    },
  },
  {
    name: 'players',
    label: 'عدد اللاعبين',
    icon: <GiCardPlay className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'لاعب واحد',
      2: 'لاعبان',
      3: '2-4 لاعبين',
      4: '4-6 لاعبين',
      5: '6+ لاعبين',
      6: 'متعدد اللاعبين',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: (
      <GiConsoleController className="text-primary-500 text-lg sm:text-xl" />
    ),
    placeholder: '-اختر-',
    options: {
      1: 'سوني',
      2: 'مايكروسوفت',
      3: 'نينتندو',
      4: 'إلكترونيك آرتس',
      5: 'أكتيفجن',
      6: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: <GiCardboardBox className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل - بحالة ممتازة',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - بحالة مقبولة',
      5: 'أخرى',
    },
  },
];

export default games;
