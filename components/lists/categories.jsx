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
    path: '/categories/1',
    icon: <BsFillHouseFill className="text-2xl" />,
  },
  {
    id: 2,
    name: 'سيارات',
    path: '/categories/2',
    icon: <FaCar className="text-2xl" />,
  },
  {
    id: 3,
    name: 'هواتف',
    path: '/categories/3',
    icon: <FaMobileAlt className="text-2xl" />,
  },
  {
    id: 4,
    name: 'كمبيوترات',
    path: '/categories/4',
    icon: <FaLaptop className="text-2xl" />,
  },
  {
    id: 5,
    name: 'إلكترونيات',
    path: '/categories/5',
    icon: <FaTv className="text-2xl" />,
  },
  {
    id: 6,
    name: 'مطبخ',
    path: '/categories/6',
    icon: <FaUtensils className="text-2xl" />,
  },
  {
    id: 7,
    name: 'أثاث',
    path: '/categories/7',
    icon: <FaCouch className="text-2xl" />,
  },
  {
    id: 8,
    name: 'موضة',
    path: '/categories/8',
    icon: <FaTshirt className="text-2xl" />,
  },
  {
    id: 9,
    name: 'رياضة',
    path: '/categories/9',
    icon: <FaBasketballBall className="text-2xl" />,
  },
  {
    id: 10,
    name: 'ألعاب',
    path: '/categories/10',
    icon: <FaGamepad className="text-2xl" />,
  },
  {
    id: 11,
    name: 'كتب',
    path: '/categories/11',
    icon: <FaBook className="text-2xl" />,
  },
  {
    id: 12,
    name: 'جمال',
    path: '/categories/12',
    icon: <FaSmile className="text-2xl" />,
  },
  {
    id: 13,
    name: 'زراعة',
    path: '/categories/13',
    icon: <FaSeedling className="text-2xl" />,
  },
  {
    id: 14,
    name: 'طبية',
    path: '/categories/14',
    icon: <FaStethoscope className="text-2xl" />,
  },
  {
    id: 15,
    name: 'هدايا',
    path: '/categories/15',
    icon: <FaGift className="text-2xl" />,
  },
  {
    id: 16,
    name: 'سياحة',
    path: '/categories/16',
    icon: <FaPlane className="text-2xl" />,
  },
  {
    id: 17,
    name: 'دراجات',
    path: '/categories/17',
    icon: <FaBicycle className="text-2xl" />,
  },
  {
    id: 18,
    name: 'أدوات',
    path: '/categories/18',
    icon: <FaTools className="text-2xl" />,
  },
];

export default categories;
