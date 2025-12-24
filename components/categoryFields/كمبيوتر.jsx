import { FaLaptop, FaHdd, FaMemory, FaDesktop, FaExpand } from 'react-icons/fa';
import { GiProcessor, GiPowerButton } from 'react-icons/gi';

let Icons = {};

try {
  Icons = {
    Type: FaLaptop,
    Brand: FaLaptop,
    Processor: GiProcessor,
    RAM: FaMemory,
    Storage: FaHdd,
    GraphicsCard: FaDesktop,
    ScreenSize: FaExpand,
    OperatingSystem: GiPowerButton,
    Condition: FaLaptop,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات أجهزة الكمبيوتر غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const computers = [
  {
    name: 'type',
    label: 'نوع الجهاز',
    icon: Icons.Type ? (
      <Icons.Type className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'لابتوب',
      2: 'كمبيوتر مكتبي',
      3: 'الكل في واحد',
      4: 'محطة عمل',
      5: 'سيرفر',
      6: 'تابلت',
      7: 'أخرى',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: Icons.Brand ? (
      <Icons.Brand className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'ديل',
      2: 'إتش بي',
      3: 'آبل',
      4: 'لينوفو',
      5: 'أسوس',
      6: 'إيسر',
      7: 'إم إس آي',
      8: 'أخرى',
    },
  },
  {
    name: 'processor',
    label: 'المعالج',
    icon: Icons.Processor ? (
      <Icons.Processor className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'Intel Core i3',
      2: 'Intel Core i5',
      3: 'Intel Core i7',
      4: 'Intel Core i9',
      5: 'AMD Ryzen 3',
      6: 'AMD Ryzen 5',
      7: 'AMD Ryzen 7',
      8: 'AMD Ryzen 9',
      9: 'أخرى',
    },
  },
  {
    name: 'ram',
    label: 'الذاكرة العشوائية (RAM)',
    icon: Icons.RAM ? (
      <Icons.RAM className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '4 جيجابايت',
      2: '8 جيجابايت',
      3: '16 جيجابايت',
      4: '32 جيجابايت',
      5: '64 جيجابايت',
      6: 'أخرى',
    },
  },
  {
    name: 'storage',
    label: 'وحدة التخزين',
    icon: Icons.Storage ? (
      <Icons.Storage className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '128 جيجابايت SSD',
      2: '256 جيجابايت SSD',
      3: '512 جيجابايت SSD',
      4: '1 تيرابايت SSD',
      5: '1 تيرابايت HDD',
      6: '2 تيرابايت HDD',
      7: 'أخرى',
    },
  },
  {
    name: 'graphicsCard',
    label: 'كرت الشاشة',
    icon: Icons.GraphicsCard ? (
      <Icons.GraphicsCard className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'Intel UHD Graphics',
      2: 'NVIDIA GeForce GTX',
      3: 'NVIDIA GeForce RTX',
      4: 'AMD Radeon RX',
      5: 'AMD Radeon Vega',
      6: 'لا يوجد كرت شاشة منفصل',
      7: 'أخرى',
    },
  },
  {
    name: 'screenSize',
    label: 'حجم الشاشة (بالبوصة)',
    icon: Icons.ScreenSize ? (
      <Icons.ScreenSize className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '13 بوصة',
      2: '14 بوصة',
      3: '15.6 بوصة',
      4: '17 بوصة',
      5: '21.5 بوصة',
      6: '24 بوصة',
      7: '27 بوصة',
      8: '32 بوصة',
      9: 'أخرى',
    },
  },
  {
    name: 'operatingSystem',
    label: 'نظام التشغيل',
    icon: Icons.OperatingSystem ? (
      <Icons.OperatingSystem className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'Windows 10',
      2: 'Windows 11',
      3: 'macOS',
      4: 'Linux',
      5: 'بدون نظام تشغيل',
      6: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: Icons.Condition ? (
      <Icons.Condition className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل - بحالة ممتازة',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - بحاجة لصيانة',
      5: 'أخرى',
    },
  },
];

export default computers;
