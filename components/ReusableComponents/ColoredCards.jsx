'use client';
import { motion } from 'framer-motion';

import {
  FaHome,
  FaCar,
  FaMobile,
  FaLaptop,
  FaUtensils,
  FaCouch,
  FaTshirt,
  FaCamera,
  FaSkating,
  FaGamepad,
  FaBook,
  FaSmile,
  FaTools,
  FaBicycle,
  FaPlane,
  FaGift,
  FaSeedling,
  FaStethoscope,
  FaMusic,
  FaPaintBrush,
  FaFilm,
  FaDumbbell,
  FaMedkit,
  FaLeaf,
  FaSunset,
} from 'react-icons/fa';

const cardStyles = {
  1: {
    gradient: 'from-orange-400 via-orange-300 to-orange-400',
    icon: <FaHome />,
  },
  2: {
    gradient: 'from-red-400 via-red-300 to-red-400',
    icon: <FaCar />,
  },
  3: {
    gradient: 'from-sky-400 via-sky-300 to-sky-400',
    icon: <FaMobile />,
  },
  4: {
    gradient: 'from-pink-400 via-pink-300 to-pink-400',
    icon: <FaLaptop />,
  },
  5: {
    gradient: 'from-red-400 via-red-300 to-red-400',
    icon: <FaLaptop />,
  },
  6: {
    gradient: 'from-amber-400 via-amber-300 to-amber-400',
    icon: <FaUtensils />,
  },
  7: {
    gradient: 'from-green-400 via-green-300 to-green-400',
    icon: <FaCouch />,
  },
  8: {
    gradient: 'from-pink-400 via-pink-300 to-pink-400',
    icon: <FaTshirt />,
  },
  9: {
    gradient: 'from-sky-400 via-sky-300 to-sky-400',
    icon: <FaCamera />,
  },
  10: {
    gradient: 'from-lime-400 via-lime-300 to-lime-400',
    icon: <FaSkating />,
  },
  11: {
    gradient: 'from-purple-400 via-purple-300 to-purple-400',
    icon: <FaGamepad />,
  },
  12: {
    gradient: 'from-sky-400 via-sky-300 to-sky-400',
    icon: <FaBook />,
  },
  13: {
    gradient: 'from-rose-400 via-rose-300 to-rose-400',
    icon: <FaSmile />,
  },
  14: {
    gradient: 'from-emerald-400 via-emerald-300 to-emerald-400',
    icon: <FaUtensils />,
  },
  15: {
    gradient: 'from-cyan-400 via-cyan-300 to-cyan-400',
    icon: <FaTools />,
  },
  16: {
    gradient: 'from-red-400 via-red-300 to-red-400',
    icon: <FaBicycle />,
  },
  17: {
    gradient: 'from-teal-400 via-teal-300 to-teal-400',
    icon: <FaPlane />,
  },
  18: {
    gradient: 'from-gray-400 via-gray-300 to-gray-400',
    icon: <FaTools />,
  },
  19: {
    gradient: 'from-amber-400 via-amber-300 to-amber-400',
    icon: <FaGift />,
  },
  20: {
    gradient: 'from-green-400 via-green-300 to-green-400',
    icon: <FaSeedling />,
  },
  21: {
    gradient: 'from-teal-400 via-teal-300 to-teal-400',
    icon: <FaStethoscope />,
  },
  22: {
    gradient: 'from-violet-400 via-violet-300 to-violet-400',
    icon: <FaMusic />,
  },
  23: {
    gradient: 'from-orange-400 via-orange-300 to-orange-400',
    icon: <FaPaintBrush />,
  },
  24: {
    gradient: 'from-gray-400 via-gray-300 to-gray-400',
    icon: <FaFilm />,
  },
  25: {
    gradient: 'from-lime-400 via-lime-300 to-lime-400',
    icon: <FaDumbbell />,
  },
  26: {
    gradient: 'from-sky-400 via-sky-300 to-sky-400',
    icon: <FaMedkit />,
  },
};

// ✅ مكون الكارد القابل لإعادة الاستخدام
export default function RotatedCard({ number, text }) {
  const { gradient, icon } = cardStyles[number] || cardStyles[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{
        scale: 1.08,
        boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.25)',
      }}
      className={`relative flex items-center justify-between w-72 xl:w-80 h-10 xl:h-12 bg-gradient-to-r ${gradient} text-white rounded-full shadow-xl p-5 cursor-pointer hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        {/* الأيقونة داخل دائرة بتدرج لوني */}
        <motion.div
          whileHover={{ rotate: 10 }}
          className="size-16 xl:size-20 bg-white/20 backdrop-blur-lg flex items-center justify-center rounded-full shadow-lg border border-white/40"
        >
          <span
            className="text-4xl text-white"
            style={{ textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)' }}
          >
            {icon}
          </span>
        </motion.div>

        {/* النصوص مع تحسين التصميم */}
        <div className="flex items-center">
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="text-8xl font-bold opacity-90 text-white leading-none"
            style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
          >
            {number}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-2xl xl:text-3xl font-medium text-white/90"
            style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)' }}
          >
            {text}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
