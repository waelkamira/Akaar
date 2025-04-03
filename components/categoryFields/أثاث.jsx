let Icons = {};

try {
  const { FaRulerCombined, FaBoxes } = require('react-icons/fa');
  const { GiWoodenChair, GiSofa, GiOfficeChair } = require('react-icons/gi');
  const { MdOutlineMeetingRoom } = require('react-icons/md');
  const { BiSolidColorFill } = require('react-icons/bi');

  Icons = {
    Ruler: FaRulerCombined || null,
    Boxes: FaBoxes || null,
    WoodenChair: GiWoodenChair || null,
    Sofa: GiSofa || null,
    OfficeChair: GiOfficeChair || null,
    MeetingRoom: MdOutlineMeetingRoom || null,
    ColorFill: BiSolidColorFill || null,
  };
} catch (error) {
  console.warn('⚠️ بعض الأيقونات غير متاحة في react-icons. تحقق من المكتبة!');
}

const furniture = [
  {
    name: 'type',
    label: 'نوع الأثاث',
    icon: Icons.Sofa ? (
      <Icons.Sofa className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'كنبة',
      2: 'كرسي',
      3: 'طاولة',
      4: 'سرير',
      5: 'خزانة',
      6: 'مكتب',
      7: 'رف',
      8: 'دولاب',
      9: 'أثاث حديقة',
      10: 'أخرى',
    },
  },
  {
    name: 'material',
    label: 'المادة المصنوعة',
    icon: Icons.WoodenChair ? (
      <Icons.WoodenChair className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'خشب طبيعي',
      2: 'خشب MDF',
      3: 'معدن',
      4: 'قماش',
      5: 'جلد طبيعي',
      6: 'جلد صناعي',
      7: 'زجاج',
      8: 'بلاستيك',
      9: 'رخام',
      10: 'أخرى',
    },
  },
  {
    name: 'color',
    label: 'اللون',
    icon: Icons.ColorFill ? (
      <Icons.ColorFill className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'أسود',
      2: 'أبيض',
      3: 'بني',
      4: 'رمادي',
      5: 'أحمر',
      6: 'أزرق',
      7: 'أخضر',
      8: 'بيج',
      9: 'ذهبي',
      10: 'فضي',
      11: 'أخرى',
    },
  },
  {
    name: 'dimensions',
    label: 'الأبعاد',
    icon: Icons.Ruler ? (
      <Icons.Ruler className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'صغير',
      2: 'متوسط',
      3: 'كبير',
      4: 'ضخم',
      5: 'مقاس خاص',
    },
  },
  {
    name: 'style',
    label: 'النمط التصميمي',
    icon: Icons.MeetingRoom ? (
      <Icons.MeetingRoom className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'حديث',
      2: 'كلاسيكي',
      3: 'ريفي',
      4: 'بسيط',
      5: 'صناعي',
      6: 'اسكندنافي',
      7: 'شرقي',
      8: 'فخم',
      9: 'أخرى',
    },
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: Icons.Boxes ? (
      <Icons.Boxes className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل - بحالة ممتازة',
      3: 'مستعمل - بحالة جيدة',
      4: 'مستعمل - بحاجة ترميم',
      5: 'أخرى',
    },
  },
  {
    name: 'assembly',
    label: 'التجميع',
    icon: Icons.OfficeChair ? (
      <Icons.OfficeChair className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'مجمّع بالكامل',
      2: 'يحتاج تجميع بسيط',
      3: 'يحتاج تجميع كامل',
      4: 'غير متوفر تجميع',
    },
  },
];

export default furniture;
