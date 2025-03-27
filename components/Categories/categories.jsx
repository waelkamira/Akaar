'use client';
import {
  MdSportsBasketball,
  MdWork,
  MdMiscellaneousServices,
} from 'react-icons/md';
import {
  FaCar,
  FaMobileAlt,
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
  FaTv,
  FaBasketballBall,
  FaShoppingBag,
  FaHome,
} from 'react-icons/fa';
import { FaKitchenSet } from 'react-icons/fa6';
import { BsFillHouseFill } from 'react-icons/bs';

const categories = [
  // العقارات والسيارات - الفئات الرئيسية
  {
    id: 1,
    name: 'عقارات',
    path: '/categories/1?category=عقارات',
    icon: <BsFillHouseFill />,
    description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار',
  },
  {
    id: 2,
    name: 'سيارات',
    path: '/categories/2?category=سيارات',
    icon: <FaCar />,
    description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات',
  },

  // الإلكترونيات والتقنية
  {
    id: 3,
    name: 'هواتف',
    path: '/categories/3?category=هواتف',
    icon: <FaMobileAlt />,
    description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها',
  },
  {
    id: 4,
    name: 'كمبيوترات',
    path: '/categories/4?category=كمبيوترات',
    icon: <FaLaptop />,
    description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها',
  },
  {
    id: 5,
    name: 'إلكترونيات',
    path: '/categories/5?category=إلكترونيات',
    icon: <FaTv />,
    description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية',
  },

  // المنزل والأثاث
  {
    id: 6,
    name: 'أثاث',
    path: '/categories/7?category=أثاث',
    icon: <FaCouch />,
    description: 'أثاث غرف، مفروشات، وديكورات منزلية',
  },
  {
    id: 7,
    name: 'مطبخ',
    path: '/categories/6?category=مطبخ',
    icon: <FaKitchenSet />,
    description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل',
  },

  // الموضة والجمال
  {
    id: 8,
    name: 'موضة',
    path: '/categories/8?category=موضة',
    icon: <FaTshirt />,
    description: 'ملابس، أحذية، حقائب، واكسسوارات',
  },
  {
    id: 9,
    name: 'جمال',
    path: '/categories/12?category=جمال',
    icon: <FaSmile />,
    description: 'مستحضرات تجميل، عطور، ومنتجات العناية',
  },

  // الرياضة والترفيه
  {
    id: 10,
    name: 'رياضة',
    path: '/categories/9?category=رياضة',
    icon: <FaBasketballBall />,
    description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين',
  },
  {
    id: 11,
    name: 'ألعاب',
    path: '/categories/10?category=ألعاب',
    icon: <FaGamepad />,
    description: 'ألعاب فيديو، ألعاب أطفال، وهوايات',
  },

  // الخدمات والوظائف
  {
    id: 12,
    name: 'وظائف',
    path: '/categories/19?category=وظائف',
    icon: <MdWork />,
    description: 'فرص عمل، وظائف شاغرة، وتوظيف',
  },
  {
    id: 13,
    name: 'خدمات',
    path: '/categories/20?category=خدمات',
    icon: <MdMiscellaneousServices />,
    description: 'خدمات مهنية، صيانة، وخدمات منزلية',
  },

  // الحيوانات والزراعة
  {
    id: 14,
    name: 'حيوانات',
    path: '/categories/21?category=حيوانات',
    icon: <FaPaw />,
    description: 'حيوانات أليفة، مستلزمات، وخدمات بيطرية',
  },
  {
    id: 15,
    name: 'زراعة',
    path: '/categories/13?category=زراعة',
    icon: <FaSeedling />,
    description: 'نباتات، بذور، معدات زراعية، ومستلزمات',
  },

  // فئات متنوعة
  {
    id: 16,
    name: 'أدوات',
    path: '/categories/18?category=أدوات',
    icon: <FaTools />,
    description: 'أدوات يدوية، معدات، وأدوات مهنية',
  },
  {
    id: 17,
    name: 'هدايا',
    path: '/categories/15?category=هدايا',
    icon: <FaGift />,
    description: 'هدايا، مناسبات خاصة، وتغليف',
  },
  {
    id: 18,
    name: 'كتب',
    path: '/categories/11?category=كتب',
    icon: <FaBook />,
    description: 'كتب، مجلات، وأدوات مكتبية',
  },
  {
    id: 19,
    name: 'طبية',
    path: '/categories/14?category=طبية',
    icon: <FaStethoscope />,
    description: 'مستلزمات طبية، أجهزة طبية، وأدوية',
  },
  {
    id: 20,
    name: 'سياحة',
    path: '/categories/16?category=سياحة',
    icon: <FaPlane />,
    description: 'حجوزات سفر، رحلات سياحية، ومستلزمات سفر',
  },
  {
    id: 21,
    name: 'دراجات',
    path: '/categories/22?category=دراجات',
    icon: <FaBicycle />,
    description: 'دراجات هوائية، دراجات نارية، وملحقاتها',
  },
];

export default categories;
