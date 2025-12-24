import React from 'react';
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
  FaHome,
} from 'react-icons/fa';
import { FaKitchenSet } from 'react-icons/fa6';
import { GiJewelCrown, GiConverseShoe } from 'react-icons/gi';
import { FaBagShopping } from 'react-icons/fa6';
import { MdWork, MdOutlineSportsSoccer } from 'react-icons/md';
import { PiBabyDuotone } from 'react-icons/pi';

let Icons = {};

try {
  Icons = {
    RealEstate: FaHome,
    Cars: FaCar,
    Phones: FaMobileAlt,
    Computers: FaLaptop,
    Electronics: FaTv,
    Furniture: FaCouch,
    Kitchen: FaKitchenSet,
    Fashion: FaTshirt,
    Beauty: FaSmile,
    Sports: MdOutlineSportsSoccer,
    Games: FaGamepad,
    Tools: FaTools,
    Books: FaBook,
    Gifts: FaGift,
    Agriculture: FaSeedling,
    Bikes: FaBicycle,
    Health: FaStethoscope,
    Shoes: GiConverseShoe,
    Bags: FaBagShopping,
    Jewelry: GiJewelCrown,
    BabySupplies: PiBabyDuotone,
    Jobs: MdWork,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض الأيقونات غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const categories = [
  // Real Estate and Cars - Main Categories
  {
    id: 1,
    name: 'عقارات',
    enName: 'realEstate',
    path: '/categories/1?category=realEstate',
    icon: Icons.RealEstate ? <Icons.RealEstate /> : null,
    description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار',
  },
  {
    id: 2,
    name: 'سيارات',
    enName: 'cars',
    path: '/categories/2?category=cars',
    icon: Icons.Cars ? <Icons.Cars /> : null,
    description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات',
  },

  // Electronics and Technology
  {
    id: 3,
    name: 'هواتف',
    enName: 'phones',
    path: '/categories/3?category=phones',
    icon: Icons.Phones ? <Icons.Phones /> : null,
    description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها',
  },
  {
    id: 4,
    name: 'كمبيوتر',
    enName: 'computers',
    path: '/categories/4?category=computers',
    icon: Icons.Computers ? <Icons.Computers /> : null,
    description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها',
  },
  {
    id: 5,
    name: 'إلكترونيات',
    enName: 'electronics',
    path: '/categories/5?category=electronics',
    icon: Icons.Electronics ? <Icons.Electronics /> : null,
    description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية',
  },

  // Home and Furniture
  {
    id: 6,
    name: 'أثاث',
    enName: 'furniture',
    path: '/categories/7?category=furniture',
    icon: Icons.Furniture ? <Icons.Furniture /> : null,
    description: 'أثاث غرف، مفروشات، وديكورات منزلية',
  },
  {
    id: 7,
    name: 'مطبخ',
    enName: 'kitchen',
    path: '/categories/6?category=kitchen',
    icon: Icons.Kitchen ? <Icons.Kitchen /> : null,
    description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل',
  },

  // Fashion and Beauty
  {
    id: 8,
    name: 'موضة',
    enName: 'fashion',
    path: '/categories/8?category=fashion',
    icon: Icons.Fashion ? <Icons.Fashion /> : null,
    description: 'ملابس، أحذية، حقائب، واكسسوارات',
  },
  {
    id: 9,
    name: 'جمال',
    enName: 'beauty',
    path: '/categories/12?category=beauty',
    icon: Icons.Beauty ? <Icons.Beauty /> : null,
    description: 'مستحضرات تجميل، عطور، ومنتجات العناية',
  },

  // Sports and Entertainment
  {
    id: 10,
    name: 'رياضة',
    enName: 'sports',
    path: '/categories/9?category=sports',
    icon: Icons.Sports ? <Icons.Sports /> : null,
    description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين',
  },
  {
    id: 11,
    name: 'ألعاب',
    enName: 'games',
    path: '/categories/10?category=games',
    icon: Icons.Games ? <Icons.Games /> : null,
    description: 'ألعاب فيديو، ألعاب أطفال، وهوايات',
  },
  {
    id: 12,
    name: 'أدوات',
    enName: 'tools',
    path: '/categories/11?category=tools',
    icon: Icons.Tools ? <Icons.Tools /> : null,
    description: 'أدوات يدوية، معدات، وأدوات مهنية',
  },
  {
    id: 13,
    name: 'كتب',
    enName: 'books',
    path: '/categories/13?category=books',
    icon: Icons.Books ? <Icons.Books /> : null,
    description: 'كتب، مجلات، وأدوات مكتبية',
  },
  {
    id: 14,
    name: 'هدايا',
    enName: 'gifts',
    path: '/categories/14?category=gifts',
    icon: Icons.Gifts ? <Icons.Gifts /> : null,
    description: 'هدايا، مناسبات خاصة، وتغليف',
  },
  {
    id: 15,
    name: 'زراعة',
    enName: 'agriculture',
    path: '/categories/15?category=agriculture',
    icon: Icons.Agriculture ? <Icons.Agriculture /> : null,
    description: 'نباتات، بذور، معدات زراعية، ومستلزمات',
  },
  {
    id: 16,
    name: 'دراجات',
    enName: 'bikes',
    path: '/categories/16?category=bikes',
    icon: Icons.Bikes ? <Icons.Bikes /> : null,
    description: 'دراجات هوائية، دراجات نارية، وملحقاتها',
  },
  {
    id: 17,
    name: 'صحة',
    enName: 'health',
    path: '/categories/17?category=health',
    icon: Icons.Health ? <Icons.Health /> : null,
    description: 'مستلزمات طبية، أجهزة طبية، وأدوية',
  },
  {
    id: 18,
    name: 'أحذية',
    enName: 'shoes',
    path: '/categories/18?category=shoes',
    icon: Icons.Shoes ? <Icons.Shoes /> : null,
    description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال',
  },
  {
    id: 19,
    name: 'حقائب',
    enName: 'bags',
    path: '/categories/19?category=bags',
    icon: Icons.Bags ? <Icons.Bags /> : null,
    description: 'حقائب يد، حقائب سفر، وحقائب مدرسية',
  },
  {
    id: 20,
    name: 'مجوهرات',
    enName: 'jewelry',
    path: '/categories/20?category=jewelry',
    icon: Icons.Jewelry ? <Icons.Jewelry /> : null,
    description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات',
  },
  {
    id: 21,
    name: 'طفلك',
    enName: 'babySupplies',
    path: '/categories/21?category=babySupplies',
    icon: Icons.BabySupplies ? <Icons.BabySupplies /> : null,
    description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية',
  },
  {
    id: 22,
    name: 'وظائف',
    enName: 'jobs',
    path: '/categories/22?category=jobs',
    icon: Icons.Jobs ? <Icons.Jobs /> : null,
    description: 'فرص عمل، وظائف شاغرة، وتوظيف',
  },
];

export default categories;
