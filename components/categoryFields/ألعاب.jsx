import React from 'react';
import { FaUsers } from 'react-icons/fa';
import {
  GiConsoleController,
  GiCardboardBox,
  GiFamilyHouse,
} from 'react-icons/gi';
import { MdOutlineGames, MdSportsEsports } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi'; // استيراد BiCategory
import { SiGamemaker } from 'react-icons/si';

let Icons = {};

try {
  Icons = {
    Type: MdOutlineGames,
    Platform: GiConsoleController,
    Genre: BiCategory,
    BoardGameType: SiGamemaker,
    MinAge: GiFamilyHouse,
    Players: FaUsers,
    Brand: MdSportsEsports,
    Condition: GiCardboardBox,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات الألعاب غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const games = [
  {
    name: 'type',
    label: 'نوع اللعبة',
    icon: Icons.Type ? (
      <Icons.Type className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
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
    icon: Icons.Platform ? (
      <Icons.Platform className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
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
    icon: Icons.Genre ? (
      <Icons.Genre className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
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
    icon: Icons.BoardGameType ? (
      <Icons.BoardGameType className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
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
    icon: Icons.MinAge ? (
      <Icons.MinAge className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
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
    icon: Icons.Players ? (
      <Icons.Players className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
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
    icon: Icons.Brand ? (
      <Icons.Brand className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
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
    icon: Icons.Condition ? (
      <Icons.Condition className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
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
