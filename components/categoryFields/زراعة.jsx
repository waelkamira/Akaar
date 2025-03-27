'use client';

import { FaSeedling, FaLeaf, FaWarehouse } from 'react-icons/fa';
import { MdCategory, MdNature, MdWater } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import { IoMdPricetag } from 'react-icons/io';
import { GiPlantRoots, GiFruitTree } from 'react-icons/gi';

const agriculture = [
  {
    name: 'نوع المنتج',
    icon: <MdCategory className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المنتج',
    options: {
      1: 'خضروات',
      2: 'فواكه',
      3: 'حبوب',
      4: 'أشتال وبذور',
      5: 'أشجار مثمرة',
      6: 'نباتات زينة',
      7: 'أعلاف',
      8: 'معدات زراعية',
    },
  },
  {
    name: 'الفئة',
    icon: <GiFruitTree className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الفئة',
    options: {
      1: 'منتجات عضوية',
      2: 'منتجات تقليدية',
      3: 'منتجات موسمية',
      4: 'منتجات محمية',
      5: 'منتجات مائية',
      6: 'منتجات بعلية',
      7: 'شتلات',
      8: 'بذور',
    },
  },
  {
    name: 'الحالة',
    icon: <IoMdPricetag className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر حالة المنتج',
    options: {
      1: 'طازج',
      2: 'مجفف',
      3: 'مبرد',
      4: 'مجمد',
      5: 'معالج',
      6: 'معبأ',
    },
  },
  {
    name: 'نوع التربة',
    icon: <GiPlantRoots className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع التربة',
    options: {
      1: 'طينية',
      2: 'رملية',
      3: 'صحراوية',
      4: 'طمي',
      5: 'جيرية',
      6: 'مختلطة',
    },
  },
  {
    name: 'نوع الري',
    icon: <MdWater className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع الري',
    options: {
      1: 'ري بالتنقيط',
      2: 'ري بالرش',
      3: 'ري سطحي',
      4: 'ري محوري',
      5: 'ري تقليدي',
      6: 'بعلي',
    },
  },
  {
    name: 'الموسم',
    icon: <MdNature className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر الموسم',
    options: {
      1: 'ربيعي',
      2: 'صيفي',
      3: 'خريفي',
      4: 'شتوي',
      5: 'على مدار السنة',
    },
  },
  {
    name: 'طريقة الزراعة',
    icon: <FaSeedling className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر طريقة الزراعة',
    options: {
      1: 'زراعة تقليدية',
      2: 'زراعة عضوية',
      3: 'زراعة محمية',
      4: 'زراعة مائية',
      5: 'زراعة بدون تربة',
      6: 'زراعة مختلطة',
    },
  },
  {
    name: 'التخزين',
    icon: <FaWarehouse className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر طريقة التخزين',
    options: {
      1: 'تخزين مبرد',
      2: 'تخزين مجمد',
      3: 'تخزين جاف',
      4: 'تخزين بدرجة الحرارة العادية',
      5: 'تخزين في أجواء متحكم بها',
    },
  },
  {
    name: 'المعالجة',
    icon: <FaLeaf className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر نوع المعالجة',
    options: {
      1: 'بدون معالجة',
      2: 'معالجة عضوية',
      3: 'معالجة كيميائية',
      4: 'معالجة حيوية',
      5: 'معالجة متكاملة',
    },
  },
  {
    name: 'بلد المنشأ',
    icon: <BiWorld className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: 'اختر بلد المنشأ',
    options: {
      1: 'محلي',
      2: 'مستورد',
      3: 'إنتاج مشترك',
      4: 'أخرى',
    },
  },
];

export default agriculture;
