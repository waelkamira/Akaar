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
    path: '/search?categoryId=1',
    icon: Icons.RealEstate ? <Icons.RealEstate /> : null,
    description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار',
  },
  {
    id: 2,
    name: 'سيارات',
    enName: 'cars',
    path: '/search?categoryId=2',
    icon: Icons.Cars ? <Icons.Cars /> : null,
    description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات',
  },

  // Electronics and Technology
  {
    id: 3,
    name: 'هواتف',
    enName: 'phones',
    path: '/search?categoryId=3',
    icon: Icons.Phones ? <Icons.Phones /> : null,
    description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها',
  },
  {
    id: 4,
    name: 'كمبيوتر',
    enName: 'computers',
    path: '/search?categoryId=4',
    icon: Icons.Computers ? <Icons.Computers /> : null,
    description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها',
  },
  {
    id: 5,
    name: 'إلكترونيات',
    enName: 'electronics',
    path: '/search?categoryId=5',
    icon: Icons.Electronics ? <Icons.Electronics /> : null,
    description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية',
  },

  // Home and Furniture
  {
    id: 6,
    name: 'أثاث',
    enName: 'furniture',
    path: '/search?categoryId=6',
    icon: Icons.Furniture ? <Icons.Furniture /> : null,
    description: 'أثاث غرف، مفروشات، وديكورات منزلية',
  },
  {
    id: 7,
    name: 'مطبخ',
    enName: 'kitchen',
    path: '/search?categoryId=7',
    icon: Icons.Kitchen ? <Icons.Kitchen /> : null,
    description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل',
  },

  // Fashion and Beauty
  {
    id: 8,
    name: 'موضة',
    enName: 'fashion',
    path: '/search?categoryId=8',
    icon: Icons.Fashion ? <Icons.Fashion /> : null,
    description: 'ملابس، أحذية، حقائب، واكسسوارات',
  },
  {
    id: 9,
    name: 'جمال',
    enName: 'beauty',
    path: '/search?categoryId=9',
    icon: Icons.Beauty ? <Icons.Beauty /> : null,
    description: 'مستحضرات تجميل، عطور، ومنتجات العناية',
  },

  // Sports and Entertainment
  {
    id: 10,
    name: 'رياضة',
    enName: 'sports',
    path: '/search?categoryId=10',
    icon: Icons.Sports ? <Icons.Sports /> : null,
    description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين',
  },
  {
    id: 11,
    name: 'ألعاب',
    enName: 'games',
    path: '/search?categoryId=11',
    icon: Icons.Games ? <Icons.Games /> : null,
    description: 'ألعاب فيديو، ألعاب أطفال، وهوايات',
  },
  {
    id: 12,
    name: 'أدوات',
    enName: 'tools',
    path: '/search?categoryId=12',
    icon: Icons.Tools ? <Icons.Tools /> : null,
    description: 'أدوات يدوية، معدات، وأدوات مهنية',
  },
  {
    id: 13,
    name: 'كتب',
    enName: 'books',
    path: '/search?categoryId=13',
    icon: Icons.Books ? <Icons.Books /> : null,
    description: 'كتب، مجلات، وأدوات مكتبية',
  },
  {
    id: 14,
    name: 'هدايا',
    enName: 'gifts',
    path: '/search?categoryId=14',
    icon: Icons.Gifts ? <Icons.Gifts /> : null,
    description: 'هدايا، مناسبات خاصة، وتغليف',
  },
  {
    id: 15,
    name: 'زراعة',
    enName: 'agriculture',
    path: '/search?categoryId=15',
    icon: Icons.Agriculture ? <Icons.Agriculture /> : null,
    description: 'نباتات، بذور، معدات زراعية، ومستلزمات',
  },
  {
    id: 16,
    name: 'دراجات',
    enName: 'bikes',
    path: '/search?categoryId=16',
    icon: Icons.Bikes ? <Icons.Bikes /> : null,
    description: 'دراجات هوائية، دراجات نارية، وملحقاتها',
  },
  {
    id: 17,
    name: 'صحة',
    enName: 'health',
    path: '/search?categoryId=17',
    icon: Icons.Health ? <Icons.Health /> : null,
    description: 'مستلزمات طبية، أجهزة طبية، وأدوية',
  },
  {
    id: 18,
    name: 'أحذية',
    enName: 'shoes',
    path: '/search?categoryId=18',
    icon: Icons.Shoes ? <Icons.Shoes /> : null,
    description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال',
  },
  {
    id: 19,
    name: 'حقائب',
    enName: 'bags',
    path: '/search?categoryId=19',
    icon: Icons.Bags ? <Icons.Bags /> : null,
    description: 'حقائب يد، حقائب سفر، وحقائب مدرسية',
  },
  {
    id: 20,
    name: 'مجوهرات',
    enName: 'jewelry',
    path: '/search?categoryId=20',
    icon: Icons.Jewelry ? <Icons.Jewelry /> : null,
    description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات',
  },
  {
    id: 21,
    name: 'طفلك',
    enName: 'babySupplies',
    path: '/search?categoryId=21',
    icon: Icons.BabySupplies ? <Icons.BabySupplies /> : null,
    description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية',
  },
  {
    id: 22,
    name: 'وظائف',
    enName: 'jobs',
    path: '/search?categoryId=22',
    icon: Icons.Jobs ? <Icons.Jobs /> : null,
    description: 'فرص عمل، وظائف شاغرة، وتوظيف',
  },
];

export default categories;
