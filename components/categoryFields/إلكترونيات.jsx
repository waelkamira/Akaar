import React from 'react';
import { FaVolumeUp, FaExpand } from 'react-icons/fa';
import { GiSmartphone, GiPowerLightning } from 'react-icons/gi';
import {
  MdBrandingWatermark,
  MdHighQuality,
  MdDevicesOther,
} from 'react-icons/md';
import { GrConnectivity } from 'react-icons/gr';

import { BiCategory } from 'react-icons/bi';

let Icons = {};

try {
  Icons = {
    Type: MdDevicesOther,
    Brand: MdBrandingWatermark,
    ScreenSize: FaExpand,
    Resolution: MdHighQuality,
    AudioOutput: FaVolumeUp,
    SmartFeatures: GiSmartphone,
    Connectivity: GrConnectivity,
    Condition: BiCategory,
    Power: GiPowerLightning,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات الأجهزة الإلكترونية غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const electronics = [
  {
    name: 'type',
    label: 'نوع الجهاز',
    icon: Icons.Type ? (
      <Icons.Type className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'تلفزيون',
      2: 'نظام صوت',
      3: 'كاميرات',
      4: 'أجهزة منزلية',
      5: 'هواتف ذكية',
      6: 'ألعاب إلكترونية',
      7: 'أجهزة كمبيوتر',
      8: 'ملحقات إلكترونية',
      9: 'أخرى',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: Icons.Brand ? (
      <Icons.Brand className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'سامسونج',
      2: 'إل جي',
      3: 'سوني',
      4: 'باناسونيك',
      5: 'توشيبا',
      6: 'شاومي',
      7: 'هواوي',
      8: 'أخرى',
    },
  },
  {
    name: 'screenSize',
    label: 'حجم الشاشة',
    icon: Icons.ScreenSize ? (
      <Icons.ScreenSize className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '24 بوصة',
      2: '32 بوصة',
      3: '40 بوصة',
      4: '43 بوصة',
      5: '50 بوصة',
      6: '55 بوصة',
      7: '65 بوصة',
      8: '75 بوصة',
      9: '85 بوصة',
      10: 'أخرى',
    },
  },
  {
    name: 'resolution',
    label: 'دقة العرض',
    icon: Icons.Resolution ? (
      <Icons.Resolution className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'HD',
      2: 'Full HD',
      3: '4K Ultra HD',
      4: '8K Ultra HD',
      5: 'OLED',
      6: 'QLED',
      7: 'أخرى',
    },
  },
  {
    name: 'audioOutput',
    label: 'قوة الصوت',
    icon: Icons.AudioOutput ? (
      <Icons.AudioOutput className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '20 واط',
      2: '50 واط',
      3: '100 واط',
      4: '200 واط',
      5: '500 واط',
      6: 'أخرى',
    },
  },
  {
    name: 'smartFeatures',
    label: 'الميزات الذكية',
    icon: Icons.SmartFeatures ? (
      <Icons.SmartFeatures className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'ذكي (Smart TV)',
      2: 'دعم تطبيقات',
      3: 'مساعد صوتي',
      4: 'تحكم عن بعد',
      5: 'أخرى',
    },
  },
  {
    name: 'connectivity',
    label: 'إمكانيات الاتصال',
    icon: Icons.Connectivity ? (
      <Icons.Connectivity className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'واي فاي',
      2: 'بلوتوث',
      3: 'HDMI',
      4: 'USB',
      5: 'إيثرنت',
      6: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: Icons.Condition ? (
      <Icons.Condition className="text-primary-500 text-lg sm:text-xl" />
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
  {
    name: 'power',
    label: 'الجهد الكهربائي',
    icon: Icons.Power ? (
      <Icons.Power className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '110 فولت',
      2: '220 فولت',
      3: '240 فولت',
      4: 'أخرى',
    },
  },
];

export default electronics;
