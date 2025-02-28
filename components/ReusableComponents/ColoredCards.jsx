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
import { FaBullseye, FaClock, FaComment, FaLock } from 'react-icons/fa6';

// // ✅ تخصيص الألوان والأيقونات بناءً على الفئات مع تحسين التدرجات

// //! الافضل
const cardStyles = {
  1: {
    gradient: 'from-[#F6D365] to-[#FDA085]',
    icon: <FaHome />,
  }, // عقارات
  2: { gradient: 'to-[#A1C4FD] from-[#C2E9FB]', icon: <FaCar /> }, // سيارات
  3: {
    gradient: 'from-[#84FAB0] to-[#8FD3F4]',
    icon: <FaMobile />,
  }, // هواتف
  4: {
    gradient: 'to-[#8FD3F4] from-[#B5FFFC]',
    icon: <FaLaptop />,
  }, // كمبيوترات
  5: {
    gradient: 'to-[#FF9A9E] from-[#FECFEF]',
    icon: <FaLaptop />,
  }, // إلكترونيات
  6: {
    gradient: 'from-[#F6D365] to-[#FDA085]',
    icon: <FaUtensils />,
  }, // مطبخ
  7: { gradient: 'from-[#FFAFBD] to-[#FFC3A0]', icon: <FaCouch /> }, // أثاث
  8: { gradient: 'to-[#FF7E5F] from-[#FEB47B]', icon: <FaTshirt /> }, // موضة
  9: {
    gradient: 'to-[#A18CD1] from-[#FBC2EB]',
    icon: <FaCamera />,
  }, // أجهزة
  10: {
    gradient: 'to-[#96E6A1] from-[#D4FC79]',
    icon: <FaSkating />,
  }, // رياضة
  11: {
    gradient: 'to-[#D3CCE3] from-[#E9E4F0]',
    icon: <FaGamepad />,
  }, // ألعاب
  12: {
    gradient: 'from-[#F0C27B] to-[#FF7E5F]',
    icon: <FaBook />,
  }, // كتب
  13: { gradient: 'to-[#FFAFBD] from-[#FFC3A0]', icon: <FaSmile /> }, // جمال
  14: {
    gradient: 'from-[#B5FFFC] to-[#6DD5FA]',
    icon: <FaUtensils />,
  }, // أغذية
  15: { gradient: 'to-[#A1C4FD] from-[#C2E9FB]', icon: <FaTools /> }, // أدوات
  16: {
    gradient: 'to-[#FF9A9E] from-[#FAD0C4]',
    icon: <FaBicycle />,
  }, // دراجات
  17: {
    gradient: 'to-[#A18CD1] from-[#FBC2EB]',
    icon: <FaPlane />,
  }, // سياحة
  18: { gradient: 'to-[#D3CCE3] from-[#E9E4F0]', icon: <FaTools /> }, // أدوات صناعية
  19: {
    gradient: 'to-[#6DD5FA] from-[#B5FFFC]',
    icon: <FaGift />,
  }, // هدايا
  20: {
    gradient: 'to-[#96E6A1] from-[#D4FC79]',
    icon: <FaSeedling />,
  }, // زراعة
  21: {
    gradient: 'from-[#84FAB0] to-[#8FD3F4]',
    icon: <FaStethoscope />,
  }, // أجهزة طبية
  22: {
    gradient: 'from-[#FF7E5F] to-[#FEB47B]',
    icon: <FaMusic />,
  }, // موسيقى
  23: {
    gradient: 'from-[#F0C27B] to-[#4B1248]',
    icon: <FaPaintBrush />,
  }, // فنون
  24: { gradient: 'from-[#FFAFBD] to-[#FFC3A0]', icon: <FaFilm /> }, // أفلام
  25: {
    gradient: 'from-[#A1C4FD] to-[#C2E9FB]',
    icon: <FaDumbbell />,
  }, // معدات رياضية
  26: {
    gradient: 'from-[#F6D365] to-[#FDA085]',
    icon: <FaMedkit />,
  }, // مستلزمات طبية
};

// const cardStyles = {
//   1: {
//     gradient: 'to-[#FF5733] from-[#FFC300]',
//     icon: <FaHome />,
//   }, // عقارات
//   2: {
//     gradient: 'to-[#1F618D] from-[#85C1E9] ',
//     icon: <FaCar />,
//   }, // سيارات
//   3: {
//     gradient: 'to-[#C0392B] from-[#E6B0AA] ',
//     icon: <FaMobile />,
//   }, // هواتف
//   4: {
//     gradient: 'to-[#6C3483] from-[#D2B4DE] ',
//     icon: <FaLaptop />,
//   }, // كمبيوترات
//   5: {
//     gradient: 'to-[#1E8449] from-[#82E0AA] ',
//     icon: <FaLaptop />,
//   }, // إلكترونيات
//   6: {
//     gradient: 'to-[#A93226] from-[#F5B7B1] ',
//     icon: <FaUtensils />,
//   }, // مطبخ
//   7: {
//     gradient: 'to-[#5D4037] from-[#D7CCC8] ',
//     icon: <FaCouch />,
//   }, // أثاث
//   8: {
//     gradient: 'to-[#4A235A] from-[#C39BD3] ',
//     icon: <FaTshirt />,
//   }, // موضة
//   9: {
//     gradient: 'to-[#2980B9] from-[#AED6F1] ',
//     icon: <FaCamera />,
//   }, // أجهزة
//   10: {
//     gradient: 'to-[#1D8348] from-[#ABEBC6] ',
//     icon: <FaSkating />,
//   }, // رياضة
//   11: {
//     gradient: 'to-[#F39C12] from-[#F9E79F] ',
//     icon: <FaGamepad />,
//   }, // ألعاب
//   12: {
//     gradient: 'to-[#922B21] from-[#E6B0AA] ',
//     icon: <FaBook />,
//   }, // كتب
//   13: {
//     gradient: 'to-[#D98880] from-[#FADBD8] ',
//     icon: <FaSmile />,
//   }, // جمال
//   14: {
//     gradient: 'to-[#E74C3C] from-[#F5B7B1] ',
//     icon: <FaUtensils />,
//   }, // أغذية
//   15: {
//     gradient: 'to-[#34495E] from-[#D5D8DC] ',
//     icon: <FaTools />,
//   }, // أدوات
//   16: {
//     gradient: 'to-[#196F3D] from-[#7DCEA0] ',
//     icon: <FaBicycle />,
//   }, // دراجات
//   17: {
//     gradient: 'to-[#1A5276] from-[#7FB3D5] ',
//     icon: <FaPlane />,
//   }, // سياحة
//   18: {
//     gradient: 'to-[#2C3E50] from-[#AEB6BF] ',
//     icon: <FaTools />,
//   }, // أدوات صناعية
//   19: {
//     gradient: 'to-[#B7950B] from-[#F4D03F] ',
//     icon: <FaGift />,
//   }, // هدايا
//   20: {
//     gradient: 'to-[#145A32] from-[#7DCEA0] ',
//     icon: <FaSeedling />,
//   }, // زراعة
//   21: {
//     gradient: 'to-[#1F618D] from-[#AED6F1] ',
//     icon: <FaStethoscope />,
//   }, // أجهزة طبية
//   22: {
//     gradient: 'to-[#4A235A] from-[#C39BD3] ',
//     icon: <FaMusic />,
//   }, // موسيقى
//   23: {
//     gradient: 'to-[#641E16] from-[#F5B7B1] ',
//     icon: <FaPaintBrush />,
//   }, // فنون
//   24: {
//     gradient: 'to-[#1B2631] from-[#D5D8DC] ',
//     icon: <FaFilm />,
//   }, // أفلام
//   25: {
//     gradient: 'to-[#186A3B] from-[#82E0AA] ',
//     icon: <FaDumbbell />,
//   }, // معدات رياضية
//   26: {
//     gradient: 'to-[#154360] from-[#85C1E9] ',
//     icon: <FaMedkit />,
//   }, // مستلزمات طبية
// };

// //! جميلة
// const cardStyles = {
//   1: {
//     gradient: ' from-[#FFD7A6] to-[#FF956B]',
//     icon: <FaHome />,
//   }, // عقارات (أخضر-سيان)
//   2: { gradient: 'from-[#BDE4F4] to-[#4FC3F7]', icon: <FaCar /> }, // سيارات (أزرق فاتح)
//   3: { gradient: 'from-[#A8E6CF] to-[#50C9C3]', icon: <FaMobile /> }, // هواتف (برتقالي)
//   4: { gradient: 'from-[#D4A5A5] to-[#757575]', icon: <FaLaptop /> }, // كمبيوترات (رمادي داكن)
//   5: { gradient: 'from-[#FFB47E] to-[#FF7C5D]', icon: <FaLaptop /> }, // إلكترونيات (برتقالي دافئ)
//   6: { gradient: 'from-[#FFECB3] to-[#FFB74D]', icon: <FaUtensils /> }, // مطبخ (أصفر-برتقالي)
//   7: { gradient: 'from-[#C8E6C9] to-[#81C784]', icon: <FaCouch /> }, // أثاث (أخضر فاتح)
//   8: { gradient: 'from-[#FFAB91] to-[#FF5722]', icon: <FaTshirt /> }, // موضة (برتقالي-أحمر)
//   9: { gradient: 'from-[#BBDEFB] to-[#2196F3]', icon: <FaCamera /> }, // أجهزة (أزرق)
//   10: { gradient: 'from-[#C8E6C9] to-[#4CAF50]', icon: <FaSkating /> }, // رياضة (أخضر)
//   11: { gradient: 'from-[#E1BEE7] to-[#9C27B0]', icon: <FaGamepad /> }, // ألعاب (بنفسجي)
//   12: { gradient: 'from-[#FFF9C4] to-[#FFEB3B]', icon: <FaBook /> }, // كتب (أصفر)
//   13: { gradient: 'from-[#F8BBD0] to-[#E91E63]', icon: <FaSmile /> }, // جمال (وردي)
//   14: { gradient: 'from-[#C5E1A5] to-[#689F38]', icon: <FaUtensils /> }, // أغذية (أخضر زاهي)
//   15: { gradient: 'from-[#B2EBF2] to-[#00BCD4]', icon: <FaTools /> }, // أدوات (سيان)
//   16: { gradient: 'from-[#FFCCBC] to-[#FF5722]', icon: <FaBicycle /> }, // دراجات (برتقالي-أحمر)
//   17: { gradient: 'from-[#B3E5FC] to-[#03A9F4]', icon: <FaPlane /> }, // سياحة (أزرق)
//   18: { gradient: 'from-[#ECEFF1] to-[#607D8B]', icon: <FaTools /> }, // أدوات صناعية (رمادي)
//   19: { gradient: 'from-[#FFF8E1] to-[#FFC107]', icon: <FaGift /> }, // هدايا (ذهبي)
//   20: { gradient: 'from-[#DCEDC8] to-[#388E3C]', icon: <FaSeedling /> }, // زراعة (أخضر داكن)
//   21: { gradient: 'from-[#B2EBF2] to-[#00ACC1]', icon: <FaStethoscope /> }, // أجهزة طبية (سيان)
//   22: { gradient: 'from-[#D1C4E9] to-[#673AB7]', icon: <FaMusic /> }, // موسيقى (بنفسجي)
//   23: { gradient: 'from-[#FFF3E0] to-[#FF9800]', icon: <FaPaintBrush /> }, // فنون (برتقالي)
//   24: { gradient: 'from-[#F5F5F5] to-[#212121]', icon: <FaFilm /> }, // أفلام (أسود وأبيض)
//   25: { gradient: 'from-[#C8E6C9] to-[#388E3C]', icon: <FaDumbbell /> }, // معدات رياضية (أخضر)
//   26: { gradient: 'from-[#E1F5FE] to-[#0288D1]', icon: <FaMedkit /> }, // مستلزمات طبية (أزرق)
// };

// const cardStyles = {
//   1: {
//     gradient: 'to-[#FFA726] from-[#FFB74D]',
//     icon: <FaHome />,
//   }, // عقارات (برتقالي)
//   2: {
//     gradient: 'to-[#64B5F6] from-[#90CAF9]',
//     icon: <FaCar />,
//   }, // سيارات (أزرق)
//   3: {
//     gradient: 'to-[#FFD54F] from-[#FFE082]',
//     icon: <FaMobile />,
//   }, // هواتف (أصفر-برتقالي)
//   4: {
//     gradient: 'to-[#A1887F] from-[#BCAAA4]',
//     icon: <FaLaptop />,
//   }, // كمبيوترات (بني)
//   5: {
//     gradient: 'to-[#FF8A65] from-[#FFAB91]',
//     icon: <FaLaptop />,
//   }, // إلكترونيات (برتقالي-أحمر)
//   6: {
//     gradient: 'to-[#FFE082] from-[#FFECB3]',
//     icon: <FaUtensils />,
//   }, // مطبخ (أصفر-برتقالي)
//   7: {
//     gradient: 'to-[#81C784] from-[#A5D6A7]',
//     icon: <FaCouch />,
//   }, // أثاث (أخضر)
//   8: {
//     gradient: 'to-[#FFAB91] from-[#FFCCBC]',
//     icon: <FaTshirt />,
//   }, // موضة (برتقالي-أحمر)
//   9: {
//     gradient: 'to-[#4FC3F7] from-[#81D4FA]',
//     icon: <FaCamera />,
//   }, // أجهزة (أزرق فاتح)
//   10: {
//     gradient: 'to-[#AED581] from-[#C5E1A5]',
//     icon: <FaSkating />,
//   }, // رياضة (أخضر)
//   11: {
//     gradient: 'to-[#BA68C8] from-[#CE93D8]',
//     icon: <FaGamepad />,
//   }, // ألعاب (بنفسجي)
//   12: {
//     gradient: 'to-[#FFF176] from-[#FFF59D]',
//     icon: <FaBook />,
//   }, // كتب (أصفر)
//   13: {
//     gradient: 'to-[#F48FB1] from-[#F8BBD0]',
//     icon: <FaSmile />,
//   }, // جمال (وردي)
//   14: {
//     gradient: 'to-[#9CCC65] from-[#C5E1A5]',
//     icon: <FaUtensils />,
//   }, // أغذية (أخضر زاهي)
//   15: {
//     gradient: 'to-[#80DEEA] from-[#B2EBF2]',
//     icon: <FaTools />,
//   }, // أدوات (سيان)
//   16: {
//     gradient: 'to-[#FF8A80] from-[#FFCDD2]',
//     icon: <FaBicycle />,
//   }, // دراجات (أحمر)
//   17: {
//     gradient: 'to-[#4DD0E1] from-[#80DEEA]',
//     icon: <FaPlane />,
//   }, // سياحة (أزرق سماوي)
//   18: {
//     gradient: 'to-[#B0BEC5] from-[#CFD8DC]',
//     icon: <FaTools />,
//   }, // أدوات صناعية (رمادي)
//   19: {
//     gradient: 'to-[#FFE57F] from-[#FFECB3]',
//     icon: <FaGift />,
//   }, // هدايا (ذهبي)
//   20: {
//     gradient: 'to-[#7CB342] from-[#9CCC65]',
//     icon: <FaSeedling />,
//   }, // زراعة (أخضر داكن)
//   21: {
//     gradient: 'to-[#80CBC4] from-[#B2DFDB]',
//     icon: <FaStethoscope />,
//   }, // أجهزة طبية (أخضر-سيان)
//   22: {
//     gradient: 'to-[#9575CD] from-[#B39DDB]',
//     icon: <FaMusic />,
//   }, // موسيقى (بنفسجي)
//   23: {
//     gradient: 'to-[#FFCC80] from-[#FFE0B2]',
//     icon: <FaPaintBrush />,
//   }, // فنون (برتقالي)
//   24: {
//     gradient: 'to-[#E0E0E0] from-[#F5F5F5]',
//     icon: <FaFilm />,
//   }, // أفلام (رمادي)
//   25: {
//     gradient: 'to-[#96E6A1] from-[#C8E6C9]',
//     icon: <FaDumbbell />,
//   }, // معدات رياضية (أخضر)
//   26: {
//     gradient: 'to-[#4FC3F7] from-[#81D4FA]',
//     icon: <FaMedkit />,
//   }, // مستلزمات طبية (أزرق)
// };

// const cardStyles = {
//   1: {
//     gradient: 'to-[#FFA726] from-[#FFE0B2]',
//     icon: <FaHome />,
//   }, // عقارات (برتقالي)
//   2: {
//     gradient: 'to-[#64B5F6] from-[#90CAF9]',
//     icon: <FaCar />,
//   }, // سيارات (أزرق)
//   3: {
//     gradient: 'to-[#FFD54F] from-[#FFE082]',
//     icon: <FaMobile />,
//   }, // هواتف (أصفر-برتقالي)
//   4: {
//     gradient: 'to-[#A1887F] from-[#BCAAA4]',
//     icon: <FaLaptop />,
//   }, // كمبيوترات (بني)
//   5: {
//     gradient: 'to-[#FF8A65] from-[#FFAB91]',
//     icon: <FaLaptop />,
//   }, // إلكترونيات (برتقالي-أحمر)
//   6: {
//     gradient: 'to-[#FFE082] from-[#FFECB3]',
//     icon: <FaUtensils />,
//   }, // مطبخ (أصفر-برتقالي)
//   7: {
//     gradient: 'to-[#81C784] from-[#A5D6A7]',
//     icon: <FaCouch />,
//   }, // أثاث (أخضر)
//   8: {
//     gradient: 'to-[#FFAB91] from-[#FFCCBC]',
//     icon: <FaTshirt />,
//   }, // موضة (برتقالي-أحمر)
//   9: {
//     gradient: 'to-[#4FC3F7] from-[#81D4FA]',
//     icon: <FaCamera />,
//   }, // أجهزة (أزرق فاتح)
//   10: {
//     gradient: 'to-[#AED581] from-[#C5E1A5]',
//     icon: <FaSkating />,
//   }, // رياضة (أخضر)
//   11: {
//     gradient: 'to-[#BA68C8] from-[#CE93D8]',
//     icon: <FaGamepad />,
//   }, // ألعاب (بنفسجي)
//   12: {
//     gradient: 'to-[#FFF176] from-[#FFF59D]',
//     icon: <FaBook />,
//   }, // كتب (أصفر)
//   13: {
//     gradient: 'to-[#F48FB1] from-[#F8BBD0]',
//     icon: <FaSmile />,
//   }, // جمال (وردي)
//   14: {
//     gradient: 'to-[#9CCC65] from-[#C5E1A5]',
//     icon: <FaUtensils />,
//   }, // أغذية (أخضر زاهي)
//   15: {
//     gradient: 'to-[#80DEEA] from-[#B2EBF2]',
//     icon: <FaTools />,
//   }, // أدوات (سيان)
//   16: {
//     gradient: 'to-[#FF8A80] from-[#FFCDD2]',
//     icon: <FaBicycle />,
//   }, // دراجات (أحمر)
//   17: {
//     gradient: 'to-[#4DD0E1] from-[#80DEEA]',
//     icon: <FaPlane />,
//   }, // سياحة (أزرق سماوي)
//   18: {
//     gradient: 'to-[#B0BEC5] from-[#CFD8DC]',
//     icon: <FaTools />,
//   }, // أدوات صناعية (رمادي)
//   19: {
//     gradient: 'to-[#FFE57F] from-[#FFECB3]',
//     icon: <FaGift />,
//   }, // هدايا (ذهبي)
//   20: {
//     gradient: 'to-[#7CB342] from-[#9CCC65]',
//     icon: <FaSeedling />,
//   }, // زراعة (أخضر داكن)
//   21: {
//     gradient: 'to-[#80CBC4] from-[#B2DFDB]',
//     icon: <FaStethoscope />,
//   }, // أجهزة طبية (أخضر-سيان)
//   22: {
//     gradient: 'to-[#9575CD] from-[#B39DDB]',
//     icon: <FaMusic />,
//   }, // موسيقى (بنفسجي)
//   23: {
//     gradient: 'to-[#FFCC80] from-[#FFE0B2]',
//     icon: <FaPaintBrush />,
//   }, // فنون (برتقالي)
//   24: {
//     gradient: 'to-[#E0E0E0] from-[#F5F5F5]',
//     icon: <FaFilm />,
//   }, // أفلام (رمادي)
//   25: {
//     gradient: 'to-[#96E6A1] from-[#C8E6C9]',
//     icon: <FaDumbbell />,
//   }, // معدات رياضية (أخضر)
//   26: {
//     gradient: 'to-[#4FC3F7] from-[#81D4FA]',
//     icon: <FaMedkit />,
//   }, // مستلزمات طبية (أزرق)
// };

// ✅ مكون الكارد القابل لإعادة الاستخدام
export default function RotatedCard({ number, text }) {
  const { gradient, icon } = cardStyles[number] || cardStyles[1]; // افتراضيًا الرقم 1 إذا لم يكن موجودًا

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex items-center justify-between w-64 h-20 bg-gradient-to-r ${gradient} text-white rounded-full shadow-lg p-4`}
    >
      <div className="flex items-center justify-center gap-2">
        {/* الأيقونة داخل دائرة بتدرج لوني */}
        <div className="w-16 h-16 bg-gradient-to-br from-white/20 via-white/10 to-transparent flex items-center justify-center rounded-full shadow-md">
          <span className="text-3xl text-white">{icon}</span>
        </div>
        {/* النص مع ظل يتناسب مع انحناءات الرقم */}
        <span
          className="flex items-center justify-center text-5xl font-bold opacity-70"
          style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
        >
          {number}
        </span>
        <span
          className="text-xl font-semibold"
          style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
        >
          {text}
        </span>
      </div>
    </motion.div>
  );
}

// import {
//   FaHome,
//   FaCar,
//   FaMobile,
//   FaLaptop,
//   FaCouch,
//   FaTshirt,
//   FaGamepad,
//   FaBook,
//   FaSmile,
//   FaUtensils,
//   FaBicycle,
//   FaPlane,
//   FaTools,
//   FaGift,
//   FaSeedling,
//   FaStethoscope,
//   FaCamera,
//   FaMusic,
//   FaPaintBrush,
//   FaFilm,
//   FaDumbbell,
//   FaMedkit,
//   FaRunning,
//   FaCoffee,
//   FaShoppingBag,
//   FaSwimmer,
// } from 'react-icons/fa';
// import {
//   FaBaby,
//   FaCampground,
//   FaFire,
//   FaGraduationCap,
//   FaHeart,
//   FaLeaf,
//   FaMountain,
//   FaPaw,
//   FaTree,
// } from 'react-icons/fa6';

// const cardStyles = {
//   1: {
//     gradient: 'to-[#FF4500] from-[#FFA500]',
//     icon: <FaHome />,
//     number: '1',
//     text: 'عقارات',
//   }, // عقارات (بنفسجي)
//   2: {
//     gradient: 'to-[#4682B4] from-[#87CEFA]',
//     icon: <FaCar />,
//     number: '2',
//     text: 'سيارات',
//   }, // سيارات (أزرق)
//   3: {
//     gradient: 'to-[#008000] from-[#32CD32]',
//     icon: <FaMobile />,
//     number: '3',
//     text: 'هواتف',
//   }, // هواتف (أخضر)
//   4: {
//     gradient: 'to-[#FFA500] from-[#FFD700]',
//     icon: <FaLaptop />,
//     number: '4',
//     text: 'كمبيوترات',
//   }, // كمبيوترات (برتقالي)
//   5: {
//     gradient: 'to-[#FF4500] from-[#FF8C00]',
//     icon: <FaLaptop />,
//     number: '5',
//     text: 'إلكترونيات',
//   }, // إلكترونيات (أحمر-برتقالي)
//   6: {
//     gradient: 'to-[#FF1493] from-[#FF69B4]',
//     icon: <FaHeart />,
//     number: '6',
//     text: 'موضة',
//   }, // موضة (وردي)
//   7: {
//     gradient: 'to-[#800080] from-[#DA70D6]',
//     icon: <FaBook />,
//     number: '7',
//     text: 'كتب',
//   }, // كتب (بنفسجي فاتح)
//   8: {
//     gradient: 'to-[#00CED1] from-[#40E0D0]',
//     icon: <FaTshirt />,
//     number: '8',
//     text: 'ملابس',
//   }, // ملابس (تركواز)
//   9: {
//     gradient: 'to-[#FFD700] from-[#FFFF00]',
//     icon: <FaUtensils />,
//     number: '9',
//     text: 'مطاعم',
//   }, // مطاعم (ذهبي)
//   10: {
//     gradient: 'from-[#8A2BE2] to-[#4B0082]',
//     icon: <FaMusic />,
//     number: '10',
//     text: 'فنون',
//   }, // فنون (بنفسجي غامق)
//   11: {
//     gradient: 'to-[#FF6347] from-[#FF7F50]',
//     icon: <FaRunning />,
//     number: '11',
//     text: 'رياضة',
//   }, // رياضة (برتقالي محمر)
//   12: {
//     gradient: 'to-[#20B2AA] from-[#00FA9A]',
//     icon: <FaLeaf />,
//     number: '12',
//     text: 'طبيعة',
//   }, // طبيعة (أخضر مائي)
//   13: {
//     gradient: 'to-[#FF69B4] from-[#FFC0CB]',
//     icon: <FaBaby />,
//     number: '13',
//     text: 'أطفال',
//   }, // أطفال (وردي فاتح)
//   14: {
//     gradient: 'to-[#A0522D] from-[#D2691E]',
//     icon: <FaCoffee />,
//     number: '14',
//     text: 'مقاهي',
//   }, // مقاهي (بني)
//   15: {
//     gradient: 'to-[#000080] from-[#1E90FF]',
//     icon: <FaPlane />,
//     number: '15',
//     text: 'سفر',
//   }, // سفر (أزرق غامق)
//   16: {
//     gradient: 'to-[#FF8C00] from-[#FFA07A]',
//     icon: <FaPaw />,
//     number: '16',
//     text: 'حيوانات',
//   }, // حيوانات (برتقالي فاتح)
//   17: {
//     gradient: 'to-[#8B0000] from-[#DC143C]',
//     icon: <FaGift />,
//     number: '17',
//     text: 'هدايا',
//   }, // هدايا (أحمر غامق)
//   18: {
//     gradient: 'to-[#2E8B57] from-[#3CB371]',
//     icon: <FaTree />,
//     number: '18',
//     text: 'حدائق',
//   }, // حدائق (أخضر غامق)
//   19: {
//     gradient: 'to-[#483D8B] from-[#6A5ACD]',
//     icon: <FaGraduationCap />,
//     number: '19',
//     text: 'تعليم',
//   }, // تعليم (بنفسجي غامق)
//   20: {
//     gradient: 'to-[#FFDAB9] from-[#FFE4B5]',
//     icon: <FaShoppingBag />,
//     number: '20',
//     text: 'تسوق',
//   }, // تسوق (بيج فاتح)
//   21: {
//     gradient: 'to-[#556B2F] from-[#6B8E23]',
//     icon: <FaMountain />,
//     number: '21',
//     text: 'تخييم',
//   }, // تخييم (أخضر زيتوني)
//   22: {
//     gradient: 'to-[#9932CC] from-[#BA55D3]',
//     icon: <FaFilm />,
//     number: '22',
//     text: 'سينما',
//   }, // سينما (بنفسجي متوسط)
//   23: {
//     gradient: 'to-[#B22222] from-[#CD5C5C]',
//     icon: <FaFire />,
//     number: '23',
//     text: 'حفلات',
//   }, // حفلات (أحمر ناري)
//   24: {
//     gradient: 'to-[#00BFFF] from-[#87CEEB]',
//     icon: <FaSwimmer />,
//     number: '24',
//     text: 'سباحة',
//   }, // سباحة (أزرق سماوي)
//   25: {
//     gradient: 'to-[#FF00FF] from-[#DA70D6]',
//     icon: <FaGamepad />,
//     number: '25',
//     text: 'ألعاب',
//   }, // ألعاب (فوشيا)
//   26: {
//     gradient: 'to-[#FF7F50] from-[#FFA07A]',
//     icon: <FaCampground />,
//     number: '26',
//     text: 'رحلات',
//   }, // رحلات (برتقالي مرجاني)
// };

// export default function RotatedCard({ number }) {
//   const {
//     gradient,
//     icon,
//     number: cardNumber,
//     text,
//   } = cardStyles[number] || cardStyles[1]; // افتراضيًا الرقم 1 إذا لم يكن موجودًا

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className={`relative flex items-center justify-between w-56 h-20 bg-gradient-to-r ${gradient} text-white rounded-full shadow-lg p-4`}
//     >
//       <div className="flex items-center justify-center gap-2">
//         {/* الأيقونة داخل دائرة بتدرج لوني */}
//         <div className="w-16 h-16 bg-gradient-to-br from-white/20 via-white/10 to-transparent flex items-center justify-center rounded-full shadow-md">
//           <span className="text-3xl text-white">{icon}</span>
//         </div>
//         <span className="flex justify-center items-center gap-2  text-5xl font-bold opacity-70">
//           {number} <span className="text-lg font-semibold">{text}</span>
//         </span>
//       </div>
//     </motion.div>
//   );
// }

// // استخدم هذا المكون في مكون أعلى مستوى لعرض البطاقات
// function App() {
//   return (
//     <div className="flex items-center justify-center gap-4">
//       {[1, 2, 3, 4, 5].map((num) => (
//         <RotatedCard key={num} number={num} />
//       ))}
//     </div>
//   );
// }
