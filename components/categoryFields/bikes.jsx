import {
  FaMotorcycle,
  FaBicycle,
  FaGasPump,
  FaBattery,
  FaTachometerAlt,
  FaWeight,
  FaPalette,
  FaCog,
} from 'react-icons/fa';
import {
  GiBicycle,
  GiMotorcycle,
  GiScooter,
  GiMountainRoad,
  GiRaceCar,
  GiRollingSuitcase,
} from 'react-icons/gi';

const bikes = [
  {
    name: 'bikeType',
    label: 'نوع الدراجة',
    icon: <GiBicycle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'دراجة جبلية',
      2: 'دراجة طريق',
      3: 'دراجة مدينة',
      4: 'دراجة هوائية كهربائية',
      5: 'دراجة ثابتة',
      6: 'دراجة أطفال',
      7: 'دراجة تندم',
      8: 'دراجة شحن',
      9: 'سكوتر كهربائي',
      10: 'أخرى',
    },
  },
  {
    name: 'motorcycleType',
    label: 'نوع الدراجة النارية',
    icon: <GiMotorcycle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'رياضية',
      2: 'كلاسيكية',
      3: 'طرق وعرة',
      4: 'سكوتر',
      5: 'كروزر',
      6: 'تاورنج',
      7: 'أخرى',
    },
  },
  {
    name: 'engineType',
    label: 'نوع المحرك',
    icon: <FaGasPump className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'بنزين',
      2: 'كهربائي',
      3: 'هايبرد',
      4: 'ديزل',
    },
  },
  {
    name: 'engineSize',
    label: 'سعة المحرك (للنارية)',
    icon: <FaTachometerAlt className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '50-125 سي سي',
      2: '126-250 سي سي',
      3: '251-500 سي سي',
      4: '501-750 سي سي',
      5: '751-1000 سي سي',
      6: 'أكثر من 1000 سي سي',
    },
  },
  {
    name: 'batteryRange',
    label: 'مدى البطارية (للدراجات الكهربائية)',
    icon: <FaBattery className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أقل من 50 كم',
      2: '50-100 كم',
      3: '101-150 كم',
      4: 'أكثر من 150 كم',
    },
  },
  {
    name: 'frameMaterial',
    label: 'مادة الهيكل',
    icon: <FaWeight className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'ألومنيوم',
      2: 'كربون',
      3: 'حديد',
      4: 'تيتانيوم',
      5: 'أخرى',
    },
  },
  {
    name: 'suspensionType',
    label: 'نوع التعليق',
    icon: <FaCog className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أمامي فقط',
      2: 'أمامي وخلفي',
      3: 'بدون تعليق',
    },
  },
  {
    name: 'brakeType',
    label: 'نوع الفرامل',
    icon: <FaCog className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'قرصية أمامية',
      2: 'قرصية أمامية وخلفية',
      3: 'حذاء فرامل',
    },
  },
  {
    name: 'color',
    label: 'اللون',
    icon: <FaPalette className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أسود',
      2: 'أبيض',
      3: 'أحمر',
      4: 'أزرق',
      5: 'أخضر',
      6: 'فضي',
      7: 'أصفر',
      8: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: <GiMotorcycle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل - ممتازة',
      3: 'مستعمل - جيدة',
      4: 'بحاجة لصيانة',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: <GiMotorcycle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'هارلي ديفيدسون',
      2: 'هوندا',
      3: 'ياماها',
      4: 'كاواساكي',
      5: 'تريك',
      6: 'جاينت',
      7: 'أخرى',
    },
  },
  {
    name: 'year',
    label: 'سنة الصنع',
    icon: <GiMotorcycle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'أدخل سنة الصنع',
  },
];

export default bikes;
