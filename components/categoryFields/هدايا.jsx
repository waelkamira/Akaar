import React from 'react'; // استيراد React ضروري لاستخدام JSX (<Icon />)
import {
  FaGift,
  FaPlane,
  FaBook,
  FaWineGlassAlt,
  FaTshirt,
  FaHome,
  FaLaptop,
  FaGamepad,
  FaPalette,
  FaSprayCan,
  FaUtensils,
  FaLeaf,
  FaCookieBite,
  FaBaby,
  FaSuitcase,
  FaGlasses, // تم التأكد من وجودها واستخدامها
} from 'react-icons/fa';
import {
  GiWoodenFrame,
  GiCrystalBall,
  GiJewelCrown,
  // الأيقونات التي تم استبدالها أو غير مستخدمة تم حذفها من هنا
} from 'react-icons/gi';

let Icons = {};
let categoryIconsMap = {}; // كائن منفصل لتخزين أيقونات الفئات

try {
  // تعيين أيقونات الفئات أولاً لسهولة الإشارة إليها
  categoryIconsMap = {
    1: GiJewelCrown, // مجوهرات
    2: FaGlasses, // إكسسوارات
    3: FaBook, // كتب
    4: FaWineGlassAlt, // مشروبات
    5: FaTshirt, // ملابس
    6: FaHome, // ديكور منزلي
    7: FaLaptop, // أجهزة إلكترونية
    8: FaGamepad, // ألعاب
    9: FaPalette, // أعمال فنية
    10: FaSprayCan, // منتجات تجميل
    11: FaUtensils, // أدوات مطبخ
    12: FaLeaf, // نباتات وزهور
    13: FaCookieBite, // حلويات
    14: FaBaby, // دمى
    15: FaSuitcase, // سفر
    16: FaGift, // أخرى (استخدام أيقونة الهدية العامة)
  };

  Icons = {
    GiftCategory: FaGift,
    Wrapping: GiWoodenFrame,
    Personalization: GiCrystalBall,
    Delivery: FaPlane,
    // يمكنك الإبقاء على المفاتيح القديمة إذا كانت مستخدمة في مكان آخر،
    // أو الاعتماد فقط على categoryIconsMap للوصول لأيقونات الفئات.
    // للوضوح، يمكن إزالتها من هنا إذا كان الوصول يتم فقط عبر categoryIconsMap
    Jewelry: categoryIconsMap[1],
    Accessories: categoryIconsMap[2],
    Books: categoryIconsMap[3],
    Beverages: categoryIconsMap[4],
    Clothing: categoryIconsMap[5],
    HomeDecor: categoryIconsMap[6],
    Electronics: categoryIconsMap[7],
    Toys: categoryIconsMap[8],
    Art: categoryIconsMap[9],
    Beauty: categoryIconsMap[10],
    Kitchenware: categoryIconsMap[11],
    Plants: categoryIconsMap[12],
    Sweets: categoryIconsMap[13],
    Dolls: categoryIconsMap[14],
    Travel: categoryIconsMap[15],
    // إضافة المرجع إلى خريطة الأيقونات الكاملة
    categoryIcons: categoryIconsMap,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات الهدايا غير متاحة في react-icons أو حدث خطأ في التهيئة. تحقق من المكتبة!',
    error
  );
  // Fallback to prevent crashes
  Icons = { categoryIcons: {} };
  categoryIconsMap = {};
}

const gifts = [
  {
    name: 'giftCategory',
    label: 'فئة الهدية',
    // استخدام أيقونة الحقل الرئيسي كما كانت
    icon: Icons.GiftCategory ? (
      <Icons.GiftCategory className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    // *** التغيير الرئيسي هنا ***
    // القيم أصبحت سلاسل نصية (أسماء الفئات فقط)
    options: {
      1: 'مجوهرات',
      2: 'إكسسوارات',
      3: 'كتب ومجلات',
      4: 'مشروبات',
      5: 'ملابس',
      6: 'ديكور منزلي',
      7: 'أجهزة إلكترونية',
      8: 'ألعاب',
      9: 'أعمال فنية',
      10: 'منتجات تجميل',
      11: 'أدوات مطبخ',
      12: 'نباتات وزهور',
      13: 'حلويات وشوكولاتة',
      14: 'دمى ولعب أطفال',
      15: 'هدايا سفر',
      16: 'أخرى',
    },
    // إضافة مرجع إلى خريطة الأيقونات المقابلة لهذه الخيارات
    optionIcons: Icons.categoryIcons,
  },
  {
    name: 'wrapping',
    label: 'التغليف',
    icon: Icons.Wrapping ? (
      <Icons.Wrapping className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    // الخيارات هنا كانت بالفعل سلاسل نصية وهي صحيحة
    options: {
      1: 'متوفر تغليف هدايا',
      2: 'بدون تغليف',
      3: 'تغليف مميز (بطلب خاص)',
    },
  },
  {
    name: 'personalization',
    label: 'التخصيص',
    icon: Icons.Personalization ? (
      <Icons.Personalization className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    // الخيارات هنا كانت بالفعل سلاسل نصية وهي صحيحة
    options: {
      1: 'إضافة اسم',
      2: 'إضافة تاريخ',
      3: 'إضافة صورة',
      4: 'إضافة رسالة',
      5: 'بدون تخصيص',
    },
  },
  {
    name: 'delivery',
    label: 'التوصيل',
    icon: Icons.Delivery ? (
      <Icons.Delivery className="text-primary-500 text-lg sm:text-xl" />
    ) : null,
    placeholder: '-اختر-',
    // الخيارات هنا كانت بالفعل سلاسل نصية وهي صحيحة
    options: {
      1: 'توصيل سريع',
      2: 'توصيل في نفس اليوم',
      3: 'توصيل مجاني',
      4: 'استلام من المحل',
    },
  },
];

export default gifts;
