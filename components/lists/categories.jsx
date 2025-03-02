'use client';
import {
  FaHome,
  FaCar,
  FaMobile,
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
  FaTools,
  FaGift,
  FaSeedling,
  FaStethoscope,
  FaChevronLeft,
} from 'react-icons/fa';

//! لهذه الفئة categoryFields قبل ازالة التهميش عن اي فئة تأكد من ضبط
const categories = [
  { id: 1, name: 'عقارات', path: '/categories/1', icon: <FaHome /> },
  { id: 2, name: 'سيارات', path: '/categories/2', icon: <FaCar /> },
  { id: 3, name: 'هواتف', path: '/categories/3', icon: <FaMobile /> },
  { id: 4, name: 'كمبيوترات', path: '/categories/4', icon: <FaLaptop /> },
  { id: 5, name: 'إلكترونيات', path: '/categories/5', icon: <FaLaptop /> },
  { id: 6, name: 'مطبخ', path: '/categories/6', icon: <FaLaptop /> },
  { id: 7, name: 'أثاث', path: '/categories/7', icon: <FaCouch /> },
  { id: 8, name: 'موضة', path: '/categories/8', icon: <FaTshirt /> },
  { id: 9, name: 'أجهزة', path: '/categories/9', icon: <FaMobile /> },
  { id: 10, name: 'رياضة', path: '/categories/10', icon: <FaGamepad /> },
  { id: 11, name: 'ألعاب', path: '/categories/11', icon: <FaGamepad /> },
  { id: 12, name: 'كتب', path: '/categories/12', icon: <FaBook /> },
  { id: 13, name: 'جمال', path: '/categories/13', icon: <FaSmile /> },
  { id: 14, name: 'أغذية', path: '/categories/14', icon: <FaUtensils /> },
  { id: 15, name: 'أدوات', path: '/categories/15', icon: <FaPaw /> },
  { id: 16, name: 'دراجات', path: '/categories/16', icon: <FaBicycle /> },
  { id: 17, name: 'سياحة', path: '/categories/17', icon: <FaPlane /> },
  { id: 18, name: 'أدوات', path: '/categories/18', icon: <FaTools /> },
  { id: 19, name: 'هدايا', path: '/categories/19', icon: <FaGift /> },
  { id: 20, name: 'زراعة', path: '/categories/20', icon: <FaSeedling /> },
  {
    id: 21,
    name: 'طبية',
    path: '/categories/21',
    icon: <FaStethoscope />,
  },
];

export default categories;
