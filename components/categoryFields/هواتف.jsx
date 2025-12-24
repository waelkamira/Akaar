import React from 'react'; // استيراد React ضروري لاستخدام JSX (<Icon />)
import {
  FaMobileAlt,
  FaSdCard,
  FaCamera,
  FaBatteryFull,
  FaPaintBrush,
  FaMemory,
} from 'react-icons/fa';

// قم بتعريف المتغيرات خارج try للسماح بالوصول إليها لاحقًا
let PhoneIconComponents = {};
let phones = []; // قيمة افتراضية آمنة

try {
  // 1. إنشاء كائن لمكونات الأيقونات المستخدمة
  PhoneIconComponents = {
    Mobile: <FaMobileAlt className="text-primary-400 text-md sm:text-lg" />,
    Storage: <FaSdCard className="text-primary-400 text-md sm:text-lg" />,
    Memory: <FaMemory className="text-primary-400 text-md sm:text-lg" />,
    Camera: <FaCamera className="text-primary-400 text-md sm:text-lg" />,
    Battery: <FaBatteryFull className="text-primary-400 text-md sm:text-lg" />,
    Color: <FaPaintBrush className="text-primary-400 text-md sm:text-lg" />,
  };

  // 2. تعريف مصفوفة البيانات باستخدام الأيقونات من الكائن أعلاه
  phones = [
    {
      name: 'brand',
      label: 'الماركة',
      icon: PhoneIconComponents.Mobile, // استخدام الأيقونة من الكائن
      placeholder: '-اختر-',
      options: {
        /* ... الخيارات ... */ 1: 'سامسونج',
        2: 'آبل',
        3: 'هواوي',
        4: 'شاومي',
        5: 'أوبو',
        6: 'ريلمي',
        7: 'فيفو',
        8: 'نوكيا',
        9: 'أخرى',
      },
    },
    {
      name: 'model',
      label: 'الموديل',
      icon: PhoneIconComponents.Mobile, // استخدام الأيقونة من الكائن
      placeholder: 'مثال: جالكسي S23، آيفون 15، ريدمي نوت 12',
      // لا يوجد options هنا، هذا حقل نصي على الأغلب
    },
    {
      name: 'storage',
      label: 'سعة التخزين',
      icon: PhoneIconComponents.Storage, // استخدام الأيقونة من الكائن
      placeholder: '-اختر-',
      options: {
        /* ... الخيارات ... */ 1: '32 جيجابايت',
        2: '64 جيجابايت',
        3: '128 جيجابايت',
        4: '256 جيجابايت',
        5: '512 جيجابايت',
        6: '1 تيرابايت',
        7: 'أخرى',
      },
    },
    {
      name: 'ram',
      label: 'الذاكرة العشوائية (RAM)',
      icon: PhoneIconComponents.Memory, // استخدام الأيقونة من الكائن
      placeholder: '-اختر-',
      options: {
        /* ... الخيارات ... */ 1: '2 جيجابايت',
        2: '4 جيجابايت',
        3: '6 جيجابايت',
        4: '8 جيجابايت',
        5: '12 جيجابايت',
        6: '16 جيجابايت',
        7: 'أخرى',
      },
    },
    {
      name: 'camera',
      label: 'الكاميرا',
      icon: PhoneIconComponents.Camera, // استخدام الأيقونة من الكائن
      placeholder: '-اختر-',
      options: {
        /* ... الخيارات ... */ 1: 'كاميرا أحادية',
        2: 'كاميرا مزدوجة',
        3: 'كاميرا ثلاثية',
        4: 'كاميرا رباعية',
        5: 'أخرى',
      },
    },
    {
      name: 'battery',
      label: 'سعة البطارية',
      icon: PhoneIconComponents.Battery, // استخدام الأيقونة من الكائن
      placeholder: '-اختر-',
      options: {
        /* ... الخيارات ... */ 1: '3000 مللي أمبير',
        2: '4000 مللي أمبير',
        3: '5000 مللي أمبير',
        4: '6000 مللي أمبير',
        5: 'أخرى',
      },
    },
    {
      name: 'color',
      label: 'اللون',
      icon: PhoneIconComponents.Color, // استخدام الأيقونة من الكائن
      placeholder: '-اختر-',
      options: {
        /* ... الخيارات ... */ 1: 'أسود',
        2: 'أبيض',
        3: 'فضي',
        4: 'ذهبي',
        5: 'أزرق',
        6: 'أخضر',
        7: 'أحمر',
        8: 'أخرى',
      },
    },
    {
      name: 'condition',
      label: 'الحالة',
      icon: PhoneIconComponents.Mobile, // إعادة استخدام أيقونة الهاتف
      placeholder: '-اختر-',
      options: {
        /* ... الخيارات ... */ 1: 'جديد',
        2: 'مستعمل',
        3: 'مجدد',
        4: 'أخرى',
      },
    },
  ];
} catch (error) {
  // 3. التعامل مع أي خطأ قد يحدث أثناء إنشاء الأيقونات أو المصفوفة
  console.warn(
    '⚠️ حدث خطأ أثناء تهيئة بيانات الهواتف أو أيقوناتها. تحقق من مكتبة react-icons والمكونات المستخدمة.',
    error
  );
  // يمكن تعيين phones إلى مصفوفة فارغة كقيمة افتراضية نهائية إذا فشل كل شيء
  phones = [];
  // يمكنك أيضًا مسح كائن الأيقونات إذا أردت
  PhoneIconComponents = {};
}

export default phones;
