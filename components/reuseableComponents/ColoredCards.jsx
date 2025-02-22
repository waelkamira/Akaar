import { motion } from 'framer-motion';
import { FaComment, FaCarSide, FaLock, FaClock, FaHome } from 'react-icons/fa';

// ✅ تحديد الألوان والأيقونات حسب الرقم
const cardStyles = {
  1: {
    gradient: 'from-orange-500 to-orange-300',
    icon: <FaHome />,
  },
  2: { gradient: 'from-blue-600 to-blue-400', icon: <FaCarSide /> },
  3: { gradient: 'from-cyan-500 to-cyan-300', icon: <FaLock /> },
  4: { gradient: 'from-green-500 to-green-300', icon: <FaClock /> },
  5: { gradient: 'from-purple-700 to-purple-500', icon: <FaHome /> },
};

// ✅ مكون الكارد القابل لإعادة الاستخدام
export default function RotatedCard({ number, text }) {
  const { gradient, icon } = cardStyles[number] || cardStyles[1]; // افتراضيًا الرقم 1 إذا لم يكن موجودًا

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex items-center justify-center w-48 h-16 bg-gradient-to-l ${gradient} text-white rounded-full shadow-xl p-4`}
    >
      {/* الرقم الكبير + النص */}
      <span className="flex justify-center items-center text-5xl font-bold opacity-70">
        {number}{' '}
        <span className="text-lg font-semibold opacity-95">{text}</span>
      </span>

      {/* الأيقونة داخل دائرة رمادية */}
      <div className="absolute right-[-22px] w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full shadow-lg ">
        <span className="text-gray-700 text-2xl">{icon}</span>
      </div>
    </motion.div>
  );
}
