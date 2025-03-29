// 'use client';
// import {
//   FaCar,
//   FaMobileAlt,
//   FaLaptop,
//   FaCouch,
//   FaTshirt,
//   FaGamepad,
//   FaBook,
//   FaSmile,
//   FaKitchenSet,
//   FaPaw,
//   FaBicycle,
//   FaTools,
//   FaGift,
//   FaSeedling,
//   FaStethoscope,
//   FaTv,
//   FaShoppingBag,
//   FaHome,
//   FaShoePrints,
// } from 'react-icons/fa';
// import { BsFillHouseFill } from 'react-icons/bs';
// import { MdWork, MdMiscellaneousServices } from 'react-icons/md';
// import { GiHandbag, GiJewelCrown } from 'react-icons/gi';
// import { CgBaby } from 'react-icons/cg';

// const categories = [
//   // العقارات والسيارات - الفئات الرئيسية
//   {
//     id: 1,
//     name: 'عقارات',
//     path: '/categories/1?category=عقارات',
//     icon: <BsFillHouseFill />,
//     description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار',
//   },
//   {
//     id: 2,
//     name: 'سيارات',
//     path: '/categories/2?category=سيارات',
//     icon: <FaCar />,
//     description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات',
//   },

//   // الإلكترونيات والتقنية
//   {
//     id: 3,
//     name: 'هواتف',
//     path: '/categories/3?category=هواتف',
//     icon: <FaMobileAlt />,
//     description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها',
//   },
//   {
//     id: 4,
//     name: 'كمبيوترات',
//     path: '/categories/4?category=كمبيوترات',
//     icon: <FaLaptop />,
//     description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها',
//   },
//   {
//     id: 5,
//     name: 'إلكترونيات',
//     path: '/categories/5?category=إلكترونيات',
//     icon: <FaTv />,
//     description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية',
//   },

//   // المنزل والأثاث
//   {
//     id: 6,
//     name: 'أثاث',
//     path: '/categories/7?category=أثاث',
//     icon: <FaCouch />,
//     description: 'أثاث غرف، مفروشات، وديكورات منزلية',
//   },
//   {
//     id: 7,
//     name: 'مطبخ',
//     path: '/categories/6?category=مطبخ',
//     icon: <FaKitchenSet />,
//     description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل',
//   },

//   // الموضة والجمال
//   {
//     id: 8,
//     name: 'موضة',
//     path: '/categories/8?category=موضة',
//     icon: <FaTshirt />,
//     description: 'ملابس، أحذية، حقائب، واكسسوارات',
//   },
//   {
//     id: 9,
//     name: 'جمال',
//     path: '/categories/12?category=جمال',
//     icon: <FaSmile />,
//     description: 'مستحضرات تجميل، عطور، ومنتجات العناية',
//   },

//   // الرياضة والترفيه
//   {
//     id: 10,
//     name: 'رياضة',
//     path: '/categories/9?category=رياضة',
//     icon: <MdWork />,
//     description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين',
//   },
//   {
//     id: 11,
//     name: 'ألعاب',
//     path: '/categories/10?category=ألعاب',
//     icon: <FaGamepad />,
//     description: 'ألعاب فيديو، ألعاب أطفال، وهوايات',
//   },
//   {
//     id: 12,
//     name: 'أدوات',
//     path: '/categories/11?category=أدوات',
//     icon: <FaTools />,
//     description: 'أدوات يدوية، معدات، وأدوات مهنية',
//   },
//   {
//     id: 13,
//     name: 'كتب',
//     path: '/categories/13?category=كتب',
//     icon: <FaBook />,
//     description: 'كتب، مجلات، وأدوات مكتبية',
//   },
//   {
//     id: 14,
//     name: 'هدايا',
//     path: '/categories/14?category=هدايا',
//     icon: <FaGift />,
//     description: 'هدايا، مناسبات خاصة، وتغليف',
//   },
//   {
//     id: 15,
//     name: 'زراعة',
//     path: '/categories/15?category=زراعة',
//     icon: <FaSeedling />,
//     description: 'نباتات، بذور، معدات زراعية، ومستلزمات',
//   },
//   {
//     id: 16,
//     name: 'دراجات',
//     path: '/categories/16?category=دراجات',
//     icon: <FaBicycle />,
//     description: 'دراجات هوائية، دراجات نارية، وملحقاتها',
//   },
//   {
//     id: 17,
//     name: 'صحة',
//     path: '/categories/17?category=صحة',
//     icon: <FaStethoscope />,
//     description: 'مستلزمات طبية، أجهزة طبية، وأدوية',
//   },
//   {
//     id: 18,
//     name: 'أحذية',
//     path: '/categories/18?category=أحذية',
//     icon: <FaShoePrints />,
//     description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال',
//   },
//   {
//     id: 19,
//     name: 'حقائب',
//     path: '/categories/19?category=حقائب',
//     icon: <GiHandbag />,
//     description: 'حقائب يد، حقائب سفر، وحقائب مدرسية',
//   },
//   {
//     id: 20,
//     name: 'مجوهرات',
//     path: '/categories/20?category=مجوهرات',
//     icon: <GiJewelCrown />,
//     description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات',
//   },
//   {
//     id: 21,
//     name: 'مستلزمات أطفال',
//     path: '/categories/21?category=مستلزمات أطفال',
//     icon: <CgBaby />,
//     description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية',
//   },
//   {
//     id: 22,
//     name: 'عمل',
//     path: '/categories/22?category=عمل',
//     icon: <MdWork />,
//     description: 'فرص عمل، وظائف شاغرة، وتوظيف',
//   },
// ];

// export default categories;
// import {
//   FaCar,
//   FaMobileAlt,
//   FaLaptop,
//   FaCouch,
//   FaTshirt,
//   FaGamepad,
//   FaBook,
//   FaSmile,
//   FaKitchenSet,
//   FaPaw,
//   FaBicycle,
//   FaTools,
//   FaGift,
//   FaSeedling,
//   FaStethoscope,
//   FaTv,
//   FaShoppingBag,
//   FaHome,
//   FaShoePrints,
// } from 'react-icons/fa';
// import { BsFillHouseFill } from 'react-icons/bs';
// import { MdWork, MdMiscellaneousServices } from 'react-icons/md';
// import { GiHandbag, GiJewelCrown } from 'react-icons/gi';
// import { CgBaby } from 'react-icons/cg';

// const categories = [
//   // Real Estate and Cars - Main Categories
//   {
//     id: 1,
//     name: 'realEstate',
//     path: '/categories/1?category=realEstate',
//     icon: <BsFillHouseFill />,
//     description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار',
//   },
//   {
//     id: 2,
//     name: 'cars',
//     path: '/categories/2?category=cars',
//     icon: <FaCar />,
//     description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات',
//   },

//   // Electronics and Technology
//   {
//     id: 3,
//     name: 'phones',
//     path: '/categories/3?category=phones',
//     icon: <FaMobileAlt />,
//     description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها',
//   },
//   {
//     id: 4,
//     name: 'computers',
//     path: '/categories/4?category=computers',
//     icon: <FaLaptop />,
//     description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها',
//   },
//   {
//     id: 5,
//     name: 'electronics',
//     path: '/categories/5?category=electronics',
//     icon: <FaTv />,
//     description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية',
//   },

//   // Home and Furniture
//   {
//     id: 6,
//     name: 'furniture',
//     path: '/categories/7?category=furniture',
//     icon: <FaCouch />,
//     description: 'أثاث غرف، مفروشات، وديكورات منزلية',
//   },
//   {
//     id: 7,
//     name: 'kitchen',
//     path: '/categories/6?category=kitchen',
//     icon: <FaKitchenSet />,
//     description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل',
//   },

//   // Fashion and Beauty
//   {
//     id: 8,
//     name: 'fashion',
//     path: '/categories/8?category=fashion',
//     icon: <FaTshirt />,
//     description: 'ملابس، أحذية، حقائب، واكسسوارات',
//   },
//   {
//     id: 9,
//     name: 'beauty',
//     path: '/categories/12?category=beauty',
//     icon: <FaSmile />,
//     description: 'مستحضرات تجميل، عطور، ومنتجات العناية',
//   },

//   // Sports and Entertainment
//   {
//     id: 10,
//     name: 'sports',
//     path: '/categories/9?category=sports',
//     icon: <MdWork />,
//     description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين',
//   },
//   {
//     id: 11,
//     name: 'games',
//     path: '/categories/10?category=games',
//     icon: <FaGamepad />,
//     description: 'ألعاب فيديو، ألعاب أطفال، وهوايات',
//   },
//   {
//     id: 12,
//     name: 'tools',
//     path: '/categories/11?category=tools',
//     icon: <FaTools />,
//     description: 'أدوات يدوية، معدات، وأدوات مهنية',
//   },
//   {
//     id: 13,
//     name: 'books',
//     path: '/categories/13?category=books',
//     icon: <FaBook />,
//     description: 'كتب، مجلات، وأدوات مكتبية',
//   },
//   {
//     id: 14,
//     name: 'gifts',
//     path: '/categories/14?category=gifts',
//     icon: <FaGift />,
//     description: 'هدايا، مناسبات خاصة، وتغليف',
//   },
//   {
//     id: 15,
//     name: 'agriculture',
//     path: '/categories/15?category=agriculture',
//     icon: <FaSeedling />,
//     description: 'نباتات، بذور، معدات زراعية، ومستلزمات',
//   },
//   {
//     id: 16,
//     name: 'bikes',
//     path: '/categories/16?category=bikes',
//     icon: <FaBicycle />,
//     description: 'دراجات هوائية، دراجات نارية، وملحقاتها',
//   },
//   {
//     id: 17,
//     name: 'health',
//     path: '/categories/17?category=health',
//     icon: <FaStethoscope />,
//     description: 'مستلزمات طبية، أجهزة طبية، وأدوية',
//   },
//   {
//     id: 18,
//     name: 'shoes',
//     path: '/categories/18?category=shoes',
//     icon: <FaShoePrints />,
//     description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال',
//   },
//   {
//     id: 19,
//     name: 'bags',
//     path: '/categories/19?category=bags',
//     icon: <GiHandbag />,
//     description: 'حقائب يد، حقائب سفر، وحقائب مدرسية',
//   },
//   {
//     id: 20,
//     name: 'jewelry',
//     path: '/categories/20?category=jewelry',
//     icon: <GiJewelCrown />,
//     description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات',
//   },
//   {
//     id: 21,
//     name: 'babySupplies',
//     path: '/categories/21?category=babySupplies',
//     icon: <CgBaby />,
//     description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية',
//   },
//   {
//     id: 22,
//     name: 'jobs',
//     path: '/categories/22?category=jobs',
//     icon: <MdWork />,
//     description: 'فرص عمل، وظائف شاغرة، وتوظيف',
//   },
// ];

// export default categories;
import {
  FaCar,
  FaMobileAlt,
  FaLaptop,
  FaCouch,
  FaTshirt,
  FaGamepad,
  FaBook,
  FaSmile,
  FaBicycle,
  FaTools,
  FaGift,
  FaSeedling,
  FaStethoscope,
  FaTv,
} from 'react-icons/fa';
import { BsFillHouseFill } from 'react-icons/bs';
import { FaKitchenSet } from 'react-icons/fa6';
import { GiJewelCrown } from 'react-icons/gi';
import { FaBagShopping } from 'react-icons/fa6';
import { GiConverseShoe } from 'react-icons/gi';
import { MdWork } from 'react-icons/md';
import { PiBabyDuotone } from 'react-icons/pi';

const categories = [
  // Real Estate and Cars - Main Categories
  {
    id: 1,
    name: 'realEstate',
    path: '/categories/1?category=realEstate',
    icon: <BsFillHouseFill />,
    description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار',
  },
  {
    id: 2,
    name: 'cars',
    path: '/categories/2?category=cars',
    icon: <FaCar />,
    description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات',
  },

  // Electronics and Technology
  {
    id: 3,
    name: 'phones',
    path: '/categories/3?category=phones',
    icon: <FaMobileAlt />,
    description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها',
  },
  {
    id: 4,
    name: 'computers',
    path: '/categories/4?category=computers',
    icon: <FaLaptop />,
    description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها',
  },
  {
    id: 5,
    name: 'electronics',
    path: '/categories/5?category=electronics',
    icon: <FaTv />,
    description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية',
  },

  // Home and Furniture
  {
    id: 6,
    name: 'furniture',
    path: '/categories/7?category=furniture',
    icon: <FaCouch />,
    description: 'أثاث غرف، مفروشات، وديكورات منزلية',
  },
  {
    id: 7,
    name: 'kitchen',
    path: '/categories/6?category=kitchen',
    icon: <FaKitchenSet />,
    description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل',
  },

  // Fashion and Beauty
  {
    id: 8,
    name: 'fashion',
    path: '/categories/8?category=fashion',
    icon: <FaTshirt />,
    description: 'ملابس، أحذية، حقائب، واكسسوارات',
  },
  {
    id: 9,
    name: 'beauty',
    path: '/categories/12?category=beauty',
    icon: <FaSmile />,
    description: 'مستحضرات تجميل، عطور، ومنتجات العناية',
  },

  // Sports and Entertainment
  {
    id: 10,
    name: 'sports',
    path: '/categories/9?category=sports',
    icon: <MdWork />,
    description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين',
  },
  {
    id: 11,
    name: 'games',
    path: '/categories/10?category=games',
    icon: <FaGamepad />,
    description: 'ألعاب فيديو، ألعاب أطفال، وهوايات',
  },
  {
    id: 12,
    name: 'tools',
    path: '/categories/11?category=tools',
    icon: <FaTools />,
    description: 'أدوات يدوية، معدات، وأدوات مهنية',
  },
  {
    id: 13,
    name: 'books',
    path: '/categories/13?category=books',
    icon: <FaBook />,
    description: 'كتب، مجلات، وأدوات مكتبية',
  },
  {
    id: 14,
    name: 'gifts',
    path: '/categories/14?category=gifts',
    icon: <FaGift />,
    description: 'هدايا، مناسبات خاصة، وتغليف',
  },
  {
    id: 15,
    name: 'agriculture',
    path: '/categories/15?category=agriculture',
    icon: <FaSeedling />,
    description: 'نباتات، بذور، معدات زراعية، ومستلزمات',
  },
  {
    id: 16,
    name: 'bikes',
    path: '/categories/16?category=bikes',
    icon: <FaBicycle />,
    description: 'دراجات هوائية، دراجات نارية، وملحقاتها',
  },
  {
    id: 17,
    name: 'health',
    path: '/categories/17?category=health',
    icon: <FaStethoscope />,
    description: 'مستلزمات طبية، أجهزة طبية، وأدوية',
  },
  {
    id: 18,
    name: 'shoes',
    path: '/categories/18?category=shoes',
    icon: <GiConverseShoe />,
    description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال',
  },
  {
    id: 19,
    name: 'bags',
    path: '/categories/19?category=bags',
    icon: <FaBagShopping />,
    description: 'حقائب يد، حقائب سفر، وحقائب مدرسية',
  },
  {
    id: 20,
    name: 'jewelry',
    path: '/categories/20?category=jewelry',
    icon: <GiJewelCrown />,
    description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات',
  },
  {
    id: 21,
    name: 'babySupplies',
    path: '/categories/21?category=babySupplies',
    icon: <PiBabyDuotone />,
    description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية',
  },
  {
    id: 22,
    name: 'jobs',
    path: '/categories/22?category=jobs',
    icon: <MdWork />,
    description: 'فرص عمل، وظائف شاغرة، وتوظيف',
  },
];

export default categories;
