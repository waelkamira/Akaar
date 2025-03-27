'use client';

import { FaLaptop, FaMemory, FaHdd } from 'react-icons/fa';
import { MdCategory, MdStorage, MdMonitor } from 'react-icons/md';
import { BiWorld, BiChip } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiProcessor, GiVideoCard } from 'react-icons/gi';

const computers = [
  {
    name: 'نوع الجهاز',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الجهاز',
    options: {
      1: 'لابتوب',
      2: 'كمبيوتر مكتبي',
      3: 'قطع كمبيوتر',
      4: 'شاشات',
      5: 'طابعات',
      6: 'ملحقات',
    },
  },
  {
    name: 'الماركة',
    icon: <FaLaptop className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الماركة',
    options: {
      1: 'HP',
      2: 'Dell',
      3: 'Lenovo',
      4: 'Apple',
      5: 'Asus',
      6: 'Acer',
      7: 'MSI',
      8: 'أخرى',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة الجهاز',
    options: {
      1: 'جديد',
      2: 'مستعمل - كالجديد',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - يحتاج صيانة',
      5: 'للقطع',
    },
  },
  {
    name: 'المعالج',
    icon: <GiProcessor className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المعالج',
    options: {
      1: 'Intel Core i3',
      2: 'Intel Core i5',
      3: 'Intel Core i7',
      4: 'Intel Core i9',
      5: 'AMD Ryzen 3',
      6: 'AMD Ryzen 5',
      7: 'AMD Ryzen 7',
      8: 'AMD Ryzen 9',
      9: 'Apple M1/M2',
      10: 'أخرى',
    },
  },
  {
    name: 'الذاكرة العشوائية',
    icon: <FaMemory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حجم الذاكرة',
    options: {
      1: '4GB',
      2: '8GB',
      3: '16GB',
      4: '32GB',
      5: '64GB',
      6: 'أكثر من 64GB',
    },
  },
  {
    name: 'التخزين',
    icon: <FaHdd className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع وحجم التخزين',
    options: {
      1: 'HDD 256GB',
      2: 'HDD 512GB',
      3: 'HDD 1TB',
      4: 'SSD 256GB',
      5: 'SSD 512GB',
      6: 'SSD 1TB',
      7: 'SSD 2TB',
      8: 'أخرى',
    },
  },
  {
    name: 'كرت الشاشة',
    icon: <GiVideoCard className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع كرت الشاشة',
    options: {
      1: 'NVIDIA GeForce',
      2: 'AMD Radeon',
      3: 'Intel Graphics',
      4: 'Apple Graphics',
      5: 'بدون كرت شاشة منفصل',
    },
  },
  {
    name: 'حجم الشاشة',
    icon: <MdMonitor className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حجم الشاشة',
    options: {
      1: '13 إنش',
      2: '14 إنش',
      3: '15.6 إنش',
      4: '16 إنش',
      5: '17 إنش',
      6: 'أكبر من 17 إنش',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'الصين',
      2: 'الولايات المتحدة',
      3: 'تايوان',
      4: 'اليابان',
      5: 'كوريا الجنوبية',
      6: 'أخرى',
    },
  },
];

export default computers;
