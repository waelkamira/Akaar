'use client';
import CarsBrandSelector from '../Cars/CarsBrandSelector';
import YearsSelector from '../Selectors/yearSelector';
import Selector from '../Selectors/Selector';
import { usedNewList } from '../Cars/UsedNewList';

import {
  FaHome,
  FaBed,
  FaRulerCombined,
  FaCar,
  FaTools,
  FaCalendarAlt,
  FaMobile,
  FaMemory,
  FaBatteryFull,
  FaLaptop,
  FaCouch,
  FaTshirt,
  FaGamepad,
  FaBook,
  FaSmile,
  FaUtensils,
  FaPaw,
  FaBicycle,
  FaPlane,
  FaGift,
  FaSeedling,
  FaStethoscope,
  FaShower,
} from 'react-icons/fa';
import { VscUngroupByRefType } from 'react-icons/vsc';
import { MdOutlineBedroomParent } from 'react-icons/md';

const categoryFields = {
  1: [
    {
      name: 'بيع/أجار',
      icon: <MdOutlineBedroomParent className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'بيع',
        2: 'أجار',
      },
    },
    {
      name: 'نوع العقار',
      icon: <FaHome className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'بيت',
        2: 'شقة',
        3: 'أرض',
        4: 'مزرعة',
        5: 'فيلا',
        6: 'معمل',
        7: 'غير ذلك',
      },
    },
    {
      name: 'عدد الغرف',
      icon: <FaBed className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: '1 + 1',
        2: '2 + 1',
        3: '3 + 1',
        4: '4 + 1',
        5: '5 + 1',
        6: 'غير ذلك',
      },
    },
    {
      name: 'عدد الحمامات',
      icon: <FaShower className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: 'غير ذلك',
      },
    },
    {
      name: 'المساحة',
      icon: <FaRulerCombined className="text-one text-lg sm:text-xl" />,
      placeholder: '200 م2',
    },
  ],
  2: [
    {
      name: 'الماركة',
      icon: <FaCar className="text-one text-lg sm:text-xl" />,
      placeholder: 'تويوتا',
    },
    {
      name: 'الموديل',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: 'كورولا',
    },
    {
      name: 'السنة',
      icon: <FaCalendarAlt className="text-one text-lg sm:text-xl" />,
      placeholder: '2021',
    },
    {
      name: 'الحالة',
      icon: <FaCar className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديدة',
        2: 'مستعملة',
      },
      component: <CarsBrandSelector />,
    },
    {
      name: 'نوع الوقود',
      icon: <FaCar className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'بنزين',
        2: 'ديزل',
        3: 'كهرباء',
        4: 'هجين',
      },
      component: <YearsSelector />,
    },

    {
      name: 'عدد الكيلومترات',
      icon: <FaCar className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل عدد الكيلومترات',
      component: (
        <Selector
          list={usedNewList}
          placeholder={'الحالة'}
          contextType={'CAR_USED_NEW'}
          icon={<VscUngroupByRefType className="text-one text-lg sm:text-xl" />}
        />
      ),
    },
  ],

  3: [
    {
      name: 'الماركة',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: 'سامسونج',
    },
    {
      name: 'الموديل',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: 'Galaxy S21',
    },
    {
      name: 'سعة التخزين',
      icon: <FaMemory className="text-one text-lg sm:text-xl" />,
      placeholder: '128 جيجابايت',
    },
    {
      name: 'حالة البطارية',
      icon: <FaBatteryFull className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديدة',
        2: 'جيدة',
        3: 'ضعيفة',
      },
    },
    {
      name: 'الحالة العامة',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
    {
      name: 'نظام التشغيل',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'أندرويد',
        2: 'iOS',
        3: 'غير ذلك',
      },
    },
  ],
  4: [
    {
      name: 'نوع الجهاز',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'لابتوب',
        2: 'كمبيوتر مكتبي',
        3: 'شاشة',
        4: 'طابعة',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: 'ديل',
    },
    {
      name: 'الموديل',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: 'XPS 13',
    },
    {
      name: 'سعة التخزين',
      icon: <FaMemory className="text-one text-lg sm:text-xl" />,
      placeholder: '512 جيجابايت',
    },
    {
      name: 'نوع الهارد',
      icon: <FaMemory className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'HDD',
        2: 'SSD',
        3: 'NVMe',
      },
    },
    {
      name: 'نوع المعالج',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'Intel Core i3',
        2: 'Intel Core i5',
        3: 'Intel Core i7',
        4: 'AMD Ryzen 5',
        5: 'AMD Ryzen 7',
      },
    },
    {
      name: 'كرت الشاشة',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'مدمج',
        2: 'NVIDIA GeForce GTX',
        3: 'NVIDIA GeForce RTX',
        4: 'AMD Radeon',
      },
    },
    {
      name: 'الحالة',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  5: [
    {
      name: 'نوع الجهاز',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'لابتوب',
        2: 'كمبيوتر مكتبي',
        3: 'شاشة',
        4: 'طابعة',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: 'ديل',
    },
    {
      name: 'الموديل',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: 'XPS 13',
    },
    {
      name: 'سعة التخزين',
      icon: <FaMemory className="text-one text-lg sm:text-xl" />,
      placeholder: '512 جيجابايت',
    },
    {
      name: 'الحالة',
      icon: <FaLaptop className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  6: [
    {
      name: 'نوع الأثاث',
      icon: <FaCouch className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'كنبة',
        2: 'طاولة',
        3: 'كرسي',
        4: 'خزانة',
        5: 'سرير',
        6: 'غير ذلك',
      },
    },
    {
      name: 'المادة',
      icon: <FaCouch className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'خشب',
        2: 'حديد',
        3: 'زجاج',
        4: 'بلاستيك',
      },
    },
    {
      name: 'الحالة',
      icon: <FaCouch className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
    {
      name: 'اللون',
      icon: <FaCouch className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'أسود',
        2: 'أبيض',
        3: 'بني',
        4: 'رمادي',
      },
    },
  ],
  7: [
    {
      name: 'نوع الأثاث',
      icon: <FaCouch className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'كنبة',
        2: 'طاولة',
        3: 'كرسي',
        4: 'خزانة',
        5: 'سرير',
        6: 'غير ذلك',
      },
    },
    {
      name: 'المادة',
      icon: <FaCouch className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'خشب',
        2: 'حديد',
        3: 'زجاج',
        4: 'بلاستيك',
      },
    },
    {
      name: 'الحالة',
      icon: <FaCouch className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
    {
      name: 'اللون',
      icon: <FaCouch className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'أسود',
        2: 'أبيض',
        3: 'بني',
        4: 'رمادي',
      },
    },
  ],
  8: [
    {
      name: 'نوع الملابس',
      icon: <FaTshirt className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'ملابس رجالية',
        2: 'ملابس نسائية',
        3: 'ملابس أطفال',
        4: 'أحذية',
        5: 'إكسسوارات',
      },
    },
    {
      name: 'المقاس',
      icon: <FaTshirt className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'S',
        2: 'M',
        3: 'L',
        4: 'XL',
        5: 'XXL',
      },
    },
    {
      name: 'الحالة',
      icon: <FaTshirt className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  9: [
    {
      name: 'نوع الجهاز',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'هاتف ذكي',
        2: 'تابلت',
        3: 'ساعة ذكية',
        4: 'سماعات',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: 'سامسونج',
    },
    {
      name: 'الموديل',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: 'Galaxy S21',
    },
    {
      name: 'الحالة',
      icon: <FaMobile className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  10: [
    {
      name: 'نوع الرياضة',
      icon: <FaGamepad className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'كرة قدم',
        2: 'كرة سلة',
        3: 'تنس',
        4: 'سباحة',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaGamepad className="text-one text-lg sm:text-xl" />,
      placeholder: 'نايك',
    },
    {
      name: 'الحالة',
      icon: <FaGamepad className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  11: [
    {
      name: 'نوع اللعبة',
      icon: <FaGamepad className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'أكشن',
        2: 'رياضة',
        3: 'إستراتيجية',
        4: 'ألغاز',
        5: 'غير ذلك',
      },
    },
    {
      name: 'المنصة',
      icon: <FaGamepad className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'بلايستيشن',
        2: 'إكس بوكس',
        3: 'كمبيوتر',
        4: 'نينتندو',
      },
    },
    {
      name: 'الحالة',
      icon: <FaGamepad className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  12: [
    {
      name: 'نوع الكتاب',
      icon: <FaBook className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'رواية',
        2: 'علمي',
        3: 'تاريخي',
        4: 'أدبي',
        5: 'غير ذلك',
      },
    },
    {
      name: 'المؤلف',
      icon: <FaBook className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل اسم المؤلف',
    },
    {
      name: 'الحالة',
      icon: <FaBook className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  13: [
    {
      name: 'نوع المنتج',
      icon: <FaSmile className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'مستحضرات تجميل',
        2: 'عطور',
        3: 'عناية بالبشرة',
        4: 'عناية بالشعر',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaSmile className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الماركة',
    },
    {
      name: 'الحالة',
      icon: <FaSmile className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  14: [
    {
      name: 'نوع الغذاء',
      icon: <FaUtensils className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'فواكه',
        2: 'خضروات',
        3: 'لحوم',
        4: 'معلبات',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الوزن',
      icon: <FaUtensils className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الوزن',
    },
    {
      name: 'الحالة',
      icon: <FaUtensils className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  15: [
    {
      name: 'نوع الأداة',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'أدوات يدوية',
        2: 'أدوات كهربائية',
        3: 'أدوات حدائق',
        4: 'أدوات مطبخ',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الماركة',
    },
    {
      name: 'الحالة',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  16: [
    {
      name: 'نوع الدراجة',
      icon: <FaBicycle className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'دراجة جبلية',
        2: 'دراجة طريق',
        3: 'دراجة كهربائية',
        4: 'دراجة أطفال',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaBicycle className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الماركة',
    },
    {
      name: 'الحالة',
      icon: <FaBicycle className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  17: [
    {
      name: 'نوع الرحلة',
      icon: <FaPlane className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'رحلة سياحية',
        2: 'رحلة عمل',
        3: 'رحلة علاجية',
        4: 'رحلة ترفيهية',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الوجهة',
      icon: <FaPlane className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الوجهة',
    },
    {
      name: 'الحالة',
      icon: <FaPlane className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  18: [
    {
      name: 'نوع الأداة',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'أدوات يدوية',
        2: 'أدوات كهربائية',
        3: 'أدوات حدائق',
        4: 'أدوات مطبخ',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الماركة',
    },
    {
      name: 'الحالة',
      icon: <FaTools className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  19: [
    {
      name: 'نوع الهدية',
      icon: <FaGift className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'هدايا عيد ميلاد',
        2: 'هدايا زفاف',
        3: 'هدايا أعياد',
        4: 'هدايا تذكارية',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaGift className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الماركة',
    },
    {
      name: 'الحالة',
      icon: <FaGift className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  20: [
    {
      name: 'نوع المنتج الزراعي',
      icon: <FaSeedling className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'بذور',
        2: 'أسمدة',
        3: 'معدات زراعية',
        4: 'محاصيل',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaSeedling className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الماركة',
    },
    {
      name: 'الحالة',
      icon: <FaSeedling className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  21: [
    {
      name: 'نوع الجهاز الطبي',
      icon: <FaStethoscope className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'أجهزة قياس ضغط الدم',
        2: 'أجهزة قياس السكر',
        3: 'أجهزة تنفس',
        4: 'أجهزة أشعة',
        5: 'غير ذلك',
      },
    },
    {
      name: 'الماركة',
      icon: <FaStethoscope className="text-one text-lg sm:text-xl" />,
      placeholder: 'أدخل الماركة',
    },
    {
      name: 'الحالة',
      icon: <FaStethoscope className="text-one text-lg sm:text-xl" />,
      placeholder: '-اختر-',
      options: {
        1: 'جديد',
        2: 'مستعمل',
      },
    },
  ],
  // يمكنك إضافة المزيد من الفئات هنا
};
export default categoryFields;
