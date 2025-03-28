import {
  FaStethoscope,
  FaPills,
  FaBandAid,
  FaWeight,
  FaShower,
  FaHome,
  FaTooth,
  FaHandHoldingHeart,
  FaSun,
  FaBroom,
  FaTeeth,
  FaLungs,
} from 'react-icons/fa';
import {
  GiBodyMassIndex,
  GiMedicinePills,
  GiSoap,
  GiToothbrush,
  GiWaterBottle,
  GiSpray,
} from 'react-icons/gi';

const health = [
  {
    name: 'productType',
    label: 'نوع المنتج',
    icon: <GiMedicinePills className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'فيتامينات ومكملات',
      2: 'أدوية بدون وصفة',
      3: 'إسعافات أولية',
      4: 'العناية الشخصية',
      5: 'منتجات تنظيف المنزل',
      6: 'العناية بالفم',
      7: 'العناية بالبشرة',
      8: 'مستلزمات طبية',
      9: 'أخرى',
    },
  },
  {
    name: 'healthCategory',
    label: 'التصنيف الصحي',
    icon: (
      <FaHandHoldingHeart className="text-primary-500 text-lg sm:text-xl" />
    ),
    placeholder: '-اختر-',
    options: {
      1: 'دعم المناعة',
      2: 'صحة المفاصل',
      3: 'تحسين النوم',
      4: 'صحة الجهاز الهضمي',
      5: 'صحة القلب',
      6: 'زيادة الطاقة',
      7: 'إنقاص الوزن',
      8: 'صحة العظام',
      9: 'أخرى',
    },
  },
  {
    name: 'productForm',
    label: 'شكل المنتج',
    icon: <GiMedicinePills className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'أقراص',
      2: 'كبسولات',
      3: 'سائل',
      4: 'مسحوق',
      5: 'جل',
      6: 'كريم',
      7: 'بخاخ',
      8: 'أخرى',
    },
  },
  {
    name: 'personalCareType',
    label: 'نوع العناية الشخصية',
    icon: <GiSoap className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'صابون',
      2: 'شامبو',
      3: 'بلسم',
      4: 'غسول الجسم',
      5: 'مزيل العرق',
      6: 'مستحضرات حلاقة',
      7: 'أخرى',
    },
  },
  {
    name: 'cleaningType',
    label: 'نوع المنظفات',
    icon: <GiSpray className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'منظفات أرضيات',
      2: 'منظفات زجاج',
      3: 'منظفات مطابخ',
      4: 'منظفات حمامات',
      5: 'معطرات جو',
      6: 'مناديل مبللة',
      7: 'أخرى',
    },
  },
  {
    name: 'oralCareType',
    label: 'نوع العناية بالفم',
    icon: <GiToothbrush className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'معجون أسنان',
      2: 'فرشاة أسنان',
      3: 'غسول فم',
      4: 'خيط أسنان',
      5: 'مبيض أسنان',
      6: 'أخرى',
    },
  },
  {
    name: 'sizeVolume',
    label: 'الحجم/الكمية',
    icon: <GiWaterBottle className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: '50 مل',
      2: '100 مل',
      3: '200 مل',
      4: '500 مل',
      5: '1 لتر',
      6: 'أكثر من 1 لتر',
    },
  },
  {
    name: 'brand',
    label: 'الماركة',
    icon: <FaHome className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'ديتول',
      2: 'فاين',
      3: 'كولجيت',
      4: 'سنسوداين',
      5: 'بانادول',
      6: 'ناتشورال',
      7: 'أخرى',
    },
  },
  {
    name: 'specialFeatures',
    label: 'مميزات خاصة',
    icon: <FaStethoscope className="text-primary-500 text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'عضوي',
      2: 'خالي من الكحول',
      3: 'مناسب للحساسية',
      4: 'نباتي',
      5: 'خالي من البارابين',
      6: 'أخرى',
    },
  },
];

export default health;
