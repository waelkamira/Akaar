'use client';
import { MdSportsBasketball } from 'react-icons/md';
import {
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
  FaMobileAlt,
  FaTv,
  FaBasketballBall,
} from 'react-icons/fa';
import { FaKitchenSet } from 'react-icons/fa6';
import { SlScreenDesktop } from 'react-icons/sl';
import { BsFillHouseFill } from 'react-icons/bs';

//! لهذه الفئة categoryFields قبل ازالة التهميش عن اي فئة تأكد من ضبط
const categories = [
  {
    id: 1,
    name: 'عقارات',
    path: '/categories/1?category=عقارات',
    icon: <BsFillHouseFill className="text-2xl" />,
  },
  {
    id: 2,
    name: 'سيارات',
    path: '/categories/2?category=سيارات',
    icon: <FaCar className="text-2xl" />,
  },
  {
    id: 3,
    name: 'هواتف',
    path: '/categories/3?category=هواتف',
    icon: <FaMobileAlt className="text-2xl" />,
  },
  {
    id: 4,
    name: 'كمبيوترات',
    path: '/categories/4?category=كمبيوترات',
    icon: <FaLaptop className="text-2xl" />,
  },
  {
    id: 5,
    name: 'إلكترونيات',
    path: '/categories/5?category=إلكترونيات',
    icon: <FaTv className="text-2xl" />,
  },
  {
    id: 6,
    name: 'مطبخ',
    path: '/categories/6?category=مطبخ',
    icon: <FaUtensils className="text-2xl" />,
  },
  {
    id: 7,
    name: 'أثاث',
    path: '/categories/7?category=أثاث',
    icon: <FaCouch className="text-2xl" />,
  },
  {
    id: 8,
    name: 'موضة',
    path: '/categories/8?category=موضة',
    icon: <FaTshirt className="text-2xl" />,
  },
  {
    id: 9,
    name: 'رياضة',
    path: '/categories/9?category=رياضة',
    icon: <FaBasketballBall className="text-2xl" />,
  },
  {
    id: 10,
    name: 'ألعاب',
    path: '/categories/10?category=ألعاب',
    icon: <FaGamepad className="text-2xl" />,
  },
  {
    id: 11,
    name: 'كتب',
    path: '/categories/11?category=كتب',
    icon: <FaBook className="text-2xl" />,
  },
  {
    id: 12,
    name: 'جمال',
    path: '/categories/12?category=جمال',
    icon: <FaSmile className="text-2xl" />,
  },
  {
    id: 13,
    name: 'زراعة',
    path: '/categories/13?category=زراعة',
    icon: <FaSeedling className="text-2xl" />,
  },
  {
    id: 14,
    name: 'طبية',
    path: '/categories/14?category=طبية',
    icon: <FaStethoscope className="text-2xl" />,
  },
  {
    id: 15,
    name: 'هدايا',
    path: '/categories/15?category=هدايا',
    icon: <FaGift className="text-2xl" />,
  },
  {
    id: 16,
    name: 'سياحة',
    path: '/categories/16?category=سياحة',
    icon: <FaPlane className="text-2xl" />,
  },
  {
    id: 17,
    name: 'دراجات',
    path: '/categories/17?category=دراجات',
    icon: <FaBicycle className="text-2xl" />,
  },
  {
    id: 18,
    name: 'أدوات',
    path: '/categories/18?category=أدوات',
    icon: <FaTools className="text-2xl" />,
  },
];

export default categories;
