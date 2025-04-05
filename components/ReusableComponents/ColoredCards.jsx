'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaHome } from 'react-icons/fa';
import { useEffect, useState } from 'react';

// مكون بديل في حالة حدوث خطأ في تحميل الأيقونة
const DefaultIcon = () => <div className="text-4xl text-white">🏠</div>;

// دالة لتحميل الأيقونات بشكل آمن مع معالجة الأخطاء
const loadIconSafely = (iconName) => {
  return dynamic(() =>
    import('react-icons/fa')
      .then((mod) => mod[iconName])
      .catch(() => DefaultIcon)
  );
};

// إنشاء كائن الأيقونات مع معالجة الأخطاء
const icons = {
  FaHome,
  FaCar: loadIconSafely('FaCar'),
  FaMobile: loadIconSafely('FaMobile'),
  FaLaptop: loadIconSafely('FaLaptop'),
  FaUtensils: loadIconSafely('FaUtensils'),
  FaCouch: loadIconSafely('FaCouch'),
  FaTshirt: loadIconSafely('FaTshirt'),
  FaCamera: loadIconSafely('FaCamera'),
  FaSkating: loadIconSafely('FaSkating'),
  FaGamepad: loadIconSafely('FaGamepad'),
  FaBook: loadIconSafely('FaBook'),
  FaSmile: loadIconSafely('FaSmile'),
  FaTools: loadIconSafely('FaTools'),
  FaBicycle: loadIconSafely('FaBicycle'),
  FaPlane: loadIconSafely('FaPlane'),
  FaGift: loadIconSafely('FaGift'),
  FaSeedling: loadIconSafely('FaSeedling'),
  FaStethoscope: loadIconSafely('FaStethoscope'),
  FaMusic: loadIconSafely('FaMusic'),
  FaPaintBrush: loadIconSafely('FaPaintBrush'),
  FaFilm: loadIconSafely('FaFilm'),
  FaDumbbell: loadIconSafely('FaDumbbell'),
  FaMedkit: loadIconSafely('FaMedkit'),
};

const cardStyles = {
  1: {
    gradient: 'from-orange-400 via-orange-300 to-orange-400',
    iconName: 'FaHome',
  },
  2: {
    gradient: 'from-red-400 via-red-300 to-red-400',
    iconName: 'FaCar',
  },
  3: {
    gradient: 'from-sky-400 via-sky-300 to-sky-400',
    iconName: 'FaMobile',
  },
  4: {
    gradient: 'from-pink-400 via-pink-300 to-pink-400',
    iconName: 'FaLaptop',
  },
  5: {
    gradient: 'from-red-400 via-red-300 to-red-400',
    iconName: 'FaLaptop',
  },
  6: {
    gradient: 'from-amber-400 via-amber-300 to-amber-400',
    iconName: 'FaUtensils',
  },
  7: {
    gradient: 'from-green-400 via-green-300 to-green-400',
    iconName: 'FaCouch',
  },
  8: {
    gradient: 'from-pink-400 via-pink-300 to-pink-400',
    iconName: 'FaTshirt',
  },
  9: {
    gradient: 'from-sky-400 via-sky-300 to-sky-400',
    iconName: 'FaCamera',
  },
  10: {
    gradient: 'from-lime-400 via-lime-300 to-lime-400',
    iconName: 'FaSkating',
  },
  11: {
    gradient: 'from-purple-400 via-purple-300 to-purple-400',
    iconName: 'FaGamepad',
  },
  12: {
    gradient: 'from-sky-400 via-sky-300 to-sky-400',
    iconName: 'FaBook',
  },
  13: {
    gradient: 'from-rose-400 via-rose-300 to-rose-400',
    iconName: 'FaSmile',
  },
  14: {
    gradient: 'from-emerald-400 via-emerald-300 to-emerald-400',
    iconName: 'FaUtensils',
  },
  15: {
    gradient: 'from-cyan-400 via-cyan-300 to-cyan-400',
    iconName: 'FaTools',
  },
  16: {
    gradient: 'from-red-400 via-red-300 to-red-400',
    iconName: 'FaBicycle',
  },
  17: {
    gradient: 'from-teal-400 via-teal-300 to-teal-400',
    iconName: 'FaPlane',
  },
  18: {
    gradient: 'from-gray-400 via-gray-300 to-gray-400',
    iconName: 'FaTools',
  },
  19: {
    gradient: 'from-amber-400 via-amber-300 to-amber-400',
    iconName: 'FaGift',
  },
  20: {
    gradient: 'from-green-400 via-green-300 to-green-400',
    iconName: 'FaSeedling',
  },
  21: {
    gradient: 'from-teal-400 via-teal-300 to-teal-400',
    iconName: 'FaStethoscope',
  },
  22: {
    gradient: 'from-violet-400 via-violet-300 to-violet-400',
    iconName: 'FaMusic',
  },
  23: {
    gradient: 'from-orange-400 via-orange-300 to-orange-400',
    iconName: 'FaPaintBrush',
  },
  24: {
    gradient: 'from-gray-400 via-gray-300 to-gray-400',
    iconName: 'FaFilm',
  },
  25: {
    gradient: 'from-lime-400 via-lime-300 to-lime-400',
    iconName: 'FaDumbbell',
  },
  26: {
    gradient: 'from-sky-400 via-sky-300 to-sky-400',
    iconName: 'FaMedkit',
  },
};

export default function RotatedCard({ number, text }) {
  const [IconComponent, setIconComponent] = useState(() => DefaultIcon);
  const { gradient, iconName } = cardStyles[number] || cardStyles[1];

  useEffect(() => {
    const loadIcon = async () => {
      try {
        if (icons[iconName]) {
          if (typeof icons[iconName] === 'function') {
            setIconComponent(() => icons[iconName]);
          } else {
            const Icon = await icons[iconName];
            setIconComponent(() => Icon);
          }
        }
      } catch (error) {
        console.error(`Failed to load icon ${iconName}:`, error);
        setIconComponent(() => DefaultIcon);
      }
    };

    loadIcon();
  }, [iconName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.03, // تقليل تأثير التحويم للشاشات الأصغر
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)', // تقليل الظل
      }}
      className={`relative flex items-center justify-between w-full sm:w-64 md:w-72 lg:w-80 h-8 sm:h-10 bg-gradient-to-r ${gradient} text-white rounded-full shadow-md p-3 sm:p-4 md:p-5 cursor-pointer transition-all duration-200`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <motion.div
          whileHover={{ rotate: 3 }} // تقليل تأثير التحويم للشاشات الأصغر
          className="size-10 sm:size-12 md:size-16 lg:size-20 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-full shadow-sm border border-white/30"
        >
          {/* افترض أن IconComponent يقبل خاصية size لتغيير حجم الأيقونة */}
          {IconComponent && (
            <IconComponent className="text-2xl sm:text-3xl md:text-4xl text-white" />
          )}
        </motion.div>

        <div className="flex items-center">
          <motion.span
            whileHover={{ scale: 1.02 }} // تقليل تأثير التحويم للشاشات الأصغر
            className="text-4xl sm:text-6xl md:text-8xl font-bold opacity-90 text-white leading-none"
          >
            {number}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.01 }} // تقليل تأثير التحويم للشاشات الأصغر
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white/90"
          >
            {text}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
