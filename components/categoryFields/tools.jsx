import {
  FaTools,
  FaHammer,
  FaScrewdriver,
  FaWrench,
  FaPaintBrush,
  FaLightbulb,
  FaHome,
  FaPlug,
  FaRulerCombined,
  FaPalette,
  FaBolt,
  FaTape,
} from 'react-icons/fa';
import {
  GiDrill,
  GiSawBlade,
  GiScrew,
  GiWoodBeam,
  GiBrickWall,
  GiFloorPolisher,
  GiPaintRoller,
} from 'react-icons/gi';

const tools = [
  {
    name: 'productType',
    label: 'نوع المنتج',
    icon: <FaTools className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أدوات يدوية',
      2: 'أدوات كهربائية',
      3: 'معدات إضاءة',
      4: 'لوازم السباكة',
      5: 'مواد دهان',
      6: 'أجهزة ومسامير',
      7: 'مواد بناء',
      8: 'أرضيات وبلاط',
      9: 'أخرى',
    },
  },
  {
    name: 'toolCategory',
    label: 'تصنيف الأداة',
    icon: <GiDrill className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أدوات قياس',
      2: 'أدوات قطع',
      3: 'أدوات تثبيت',
      4: 'أدوات لحام',
      5: 'أدوات نجارة',
      6: 'أدوات سباكة',
      7: 'أدوات كهرباء',
      8: 'أخرى',
    },
  },
  {
    name: 'powerSource',
    label: 'مصدر الطاقة',
    icon: <FaBolt className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'سلكي (كهرباء)',
      2: 'لاسلكي (بطارية)',
      3: 'يعمل بالبنزين',
      4: 'يدوي',
      5: 'أخرى',
    },
  },
  {
    name: 'powerToolType',
    label: 'نوع الأداة الكهربائية',
    icon: <GiSawBlade className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'مثقاب',
      2: 'منشار',
      3: 'ماكينة صنفرة',
      4: 'طاحونة زاوية',
      5: 'مسحاج خشب',
      6: 'مفك براغي كهربائي',
      7: 'أخرى',
    },
  },
  {
    name: 'voltage',
    label: 'الجهد الكهربائي',
    icon: <FaPlug className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '110 فولت',
      2: '220 فولت',
      3: '12 فولت (بطارية)',
      4: '18 فولت (بطارية)',
      5: 'أخرى',
    },
  },
  {
    name: 'lightingType',
    label: 'نوع الإضاءة',
    icon: <FaLightbulb className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'LED',
      2: 'متوهجة',
      3: 'فلورسنت',
      4: 'هالوجين',
      5: 'إضاءة ذكية',
      6: 'أخرى',
    },
  },
  {
    name: 'material',
    label: 'المادة المصنوعة',
    icon: <GiWoodBeam className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'فولاذ',
      2: 'ألومنيوم',
      3: 'خشب',
      4: 'بلاستيك',
      5: 'مطاط',
      6: 'أخرى',
    },
  },
  {
    name: 'measurement',
    label: 'القياسات',
    icon: <FaTape className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'صغير (أقل من 30 سم)',
      2: 'متوسط (30-60 سم)',
      3: 'كبير (60-120 سم)',
      4: 'ضخم (أكثر من 120 سم)',
      5: 'مقاس خاص',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: <FaTools className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'بوش',
      2: 'ماكيتا',
      3: 'ديوالت',
      4: 'ستانلي',
      5: 'بلاك آند ديكر',
      6: 'أخرى',
    },
  },
  {
    name: 'safetyRating',
    label: 'تصنيف السلامة',
    icon: <FaHome className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'CE معتمد',
      2: 'UL معتمد',
      3: 'ISO معتمد',
      4: 'غير معروف',
    },
  },
];

export default tools;
