import React from 'react';
import { FaSeedling, FaTree, FaSun, FaTemperatureHigh } from 'react-icons/fa';
import { GiFruitBowl, GiCorn, GiWheat, GiPlantWatering } from 'react-icons/gi';

let Icons = {};

try {
  Icons = {
    Type: FaSeedling,
    PlantType: FaTree,
    FruitType: GiFruitBowl,
    VegetableType: GiCorn,
    GrowthCondition: FaSun,
    WateringNeeds: GiPlantWatering,
    SoilType: FaSeedling,
    Season: FaTemperatureHigh,
    HarvestTime: GiWheat,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات مستلزمات الزراعة غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const agriculture = [
  {
    name: 'type',
    label: 'نوع المنتج',
    icon: Icons.Type ? (
      <Icons.Type className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'نباتات',
      2: 'بذور',
      3: 'أدوات زراعية',
      4: 'معدات زراعية',
      5: 'أسمدة ومبيدات',
      6: 'تربة وبيئات زراعية',
      7: 'أخرى',
    },
  },
  {
    name: 'plantType',
    label: 'نوع النبات',
    icon: Icons.PlantType ? (
      <Icons.PlantType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'نباتات زينة',
      2: 'أشجار فواكه',
      3: 'خضروات',
      4: 'أعشاب ونباتات عطرية',
      5: 'نباتات طبية',
      6: 'حبوب',
      7: 'أخرى',
    },
  },
  {
    name: 'fruitType',
    label: 'نوع الفاكهة (إن وجدت)',
    icon: Icons.FruitType ? (
      <Icons.FruitType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'تفاح',
      2: 'برتقال',
      3: 'ليمون',
      4: 'زيتون',
      5: 'عنب',
      6: 'رمان',
      7: 'توت',
      8: 'أخرى',
    },
  },
  {
    name: 'vegetableType',
    label: 'نوع الخضار (إن وجدت)',
    icon: Icons.VegetableType ? (
      <Icons.VegetableType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'طماطم',
      2: 'خيار',
      3: 'باذنجان',
      4: 'فلفل',
      5: 'بصل',
      6: 'ثوم',
      7: 'بطاطا',
      8: 'أخرى',
    },
  },
  {
    name: 'growthCondition',
    label: 'ظروف النمو',
    icon: Icons.GrowthCondition ? (
      <Icons.GrowthCondition className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'شمس كاملة',
      2: 'ظل جزئي',
      3: 'ظل كامل',
      4: 'داخل المنزل',
      5: 'بيت بلاستيكي',
      6: 'أخرى',
    },
  },
  {
    name: 'wateringNeeds',
    label: 'احتياجات الري',
    icon: Icons.WateringNeeds ? (
      <Icons.WateringNeeds className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'ري يومي',
      2: 'ري كل يومين',
      3: 'ري أسبوعي',
      4: 'ري قليل',
      5: 'ري حسب الطقس',
      6: 'أخرى',
    },
  },
  {
    name: 'soilType',
    label: 'نوع التربة المناسبة',
    icon: Icons.SoilType ? (
      <Icons.SoilType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'تربة طينية',
      2: 'تربة رملية',
      3: 'تربة صفراء',
      4: 'بيتموس',
      5: 'بيئة مائية',
      6: 'أخرى',
    },
  },
  {
    name: 'season',
    label: 'الموسم المناسب',
    icon: Icons.Season ? (
      <Icons.Season className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'شتوي',
      2: 'صيفي',
      3: 'ربيعي',
      4: 'خريفي',
      5: 'طوال السنة',
      6: 'أخرى',
    },
  },
  {
    name: 'harvestTime',
    label: 'وقت الحصاد',
    icon: Icons.HarvestTime ? (
      <Icons.HarvestTime className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: '30 يوم',
      2: '3 أشهر',
      3: '6 أشهر',
      4: 'سنة',
      5: 'عدة سنوات',
      6: 'أخرى',
    },
  },
];

export default agriculture;
