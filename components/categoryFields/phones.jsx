import {
  FaMobileAlt,
  FaSdCard,
  FaCamera,
  FaBatteryFull,
  FaPaintBrush,
  FaMemory,
  FaExpand,
  FaSimCard,
  FaShieldAlt,
  FaNetworkWired,
} from 'react-icons/fa';
import { GiProcessor } from 'react-icons/gi';
import { MdPriceChange, MdScreenshot } from 'react-icons/md';

const phones = [
  {
    name: 'brand',
    label: 'الماركة',
    icon: <FaMobileAlt className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'سامسونج',
      2: 'آبل',
      3: 'هواوي',
      4: 'شاومي',
      5: 'أوبو',
      6: 'ريلمي',
      7: 'فيفو',
      8: 'نوكيا',
      9: 'أخرى',
    },
  },
  {
    name: 'model',
    label: 'الموديل',
    icon: <FaMobileAlt className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'مثال: جالكسي S23، آيفون 15، ريدمي نوت 12',
  },
  {
    name: 'storage',
    label: 'سعة التخزين',
    icon: <FaSdCard className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '32 جيجابايت',
      2: '64 جيجابايت',
      3: '128 جيجابايت',
      4: '256 جيجابايت',
      5: '512 جيجابايت',
      6: '1 تيرابايت',
      7: 'أخرى',
    },
  },
  {
    name: 'ram',
    label: 'الذاكرة العشوائية (RAM)',
    icon: <FaMemory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '2 جيجابايت',
      2: '4 جيجابايت',
      3: '6 جيجابايت',
      4: '8 جيجابايت',
      5: '12 جيجابايت',
      6: '16 جيجابايت',
      7: 'أخرى',
    },
  },
  {
    name: 'camera',
    label: 'الكاميرا',
    icon: <FaCamera className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'كاميرا أحادية',
      2: 'كاميرا مزدوجة',
      3: 'كاميرا ثلاثية',
      4: 'كاميرا رباعية',
      5: 'أخرى',
    },
  },
  {
    name: 'battery',
    label: 'سعة البطارية',
    icon: <FaBatteryFull className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '3000 مللي أمبير',
      2: '4000 مللي أمبير',
      3: '5000 مللي أمبير',
      4: '6000 مللي أمبير',
      5: 'أخرى',
    },
  },
  {
    name: 'color',
    label: 'اللون',
    icon: <FaPaintBrush className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أسود',
      2: 'أبيض',
      3: 'فضي',
      4: 'ذهبي',
      5: 'أزرق',
      6: 'أخضر',
      7: 'أحمر',
      8: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: <FaMobileAlt className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل',
      3: 'مجدد',
      4: 'أخرى',
    },
  },
];

export default phones;
