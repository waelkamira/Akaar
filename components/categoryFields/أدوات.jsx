import React from 'react';
import { FaLightbulb, FaRuler, FaBatteryFull } from 'react-icons/fa';
import {
  GiDrill,
  GiPowerLightning,
  GiScrewdriver,
  GiMetalBar,
} from 'react-icons/gi';
import {
  MdPrecisionManufacturing,
  MdOutlineSafetyDivider,
} from 'react-icons/md';
import { BiSolidFactory } from 'react-icons/bi';

let Icons = {};

try {
  Icons = {
    ProductType: MdPrecisionManufacturing,
    ToolCategory: GiScrewdriver,
    PowerSource: GiPowerLightning,
    PowerToolType: GiDrill,
    Voltage: FaBatteryFull,
    LightingType: FaLightbulb,
    Material: GiMetalBar,
    Measurement: FaRuler,
    Brand: BiSolidFactory,
    SafetyRating: MdOutlineSafetyDivider,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض الأيقونات غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {}; // تأكد من أن Icons يبقى كائنًا حتى في حالة حدوث خطأ
}

const tools = [
  {
    name: 'productType',
    label: 'نوع المنتج',
    icon: Icons.ProductType ? (
      <Icons.ProductType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.ToolCategory ? (
      <Icons.ToolCategory className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.PowerSource ? (
      <Icons.PowerSource className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.PowerToolType ? (
      <Icons.PowerToolType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Voltage ? (
      <Icons.Voltage className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.LightingType ? (
      <Icons.LightingType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Material ? (
      <Icons.Material className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Measurement ? (
      <Icons.Measurement className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.Brand ? (
      <Icons.Brand className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
    icon: Icons.SafetyRating ? (
      <Icons.SafetyRating className="text-primary-400 text-md sm:text-lg" />
    ) : null,
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
