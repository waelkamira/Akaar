const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const {
  FaCar,
  FaLaptop,
  FaCouch,
  FaTshirt,
  FaGamepad,
  FaBook,
  FaSmile,
  FaUtensils,
  FaBicycle,
  FaPlane,
  FaTools,
  FaGift,
  FaSeedling,
  FaStethoscope,
  FaMobileAlt,
  FaTv,
  FaBasketballBall,
} = require('react-icons/fa');
const { BsFillHouseFill } = require('react-icons/bs');
const { FaKitchenSet } = require('react-icons/fa6');
const { GiJewelCrown } = require('react-icons/gi');
const { FaBagShopping } = require('react-icons/fa6');
const { GiConverseShoe } = require('react-icons/gi');
const { MdWork } = require('react-icons/md');
const { PiBabyDuotone } = require('react-icons/pi');

const prisma = new PrismaClient();

// دالة لتحديد نوع الإعلان (بيع/إيجار)
function extractAdType(text) {
  const saleRegex = /\bللبيع\b|\bبيع\b/i;
  const rentRegex = /\bللايجار\b|\bإيجار\b|\bاجار\b/i;

  if (saleRegex.test(text)) return 1;
  if (rentRegex.test(text)) return 2;
  return null;
}

// دالة لاستخراج عدد الغرف
function extractRooms(text) {
  const regex = /(\d+)\s*(غرف|غرفة)/i;
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

// دالة لاستخراج عدد الصالونات
function extractLivingRooms(text) {
  const regex = /(\d+)\s*(صالون|صالة)/i;
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

// دالة لاستخراج المساحة
function extractArea(text) {
  const regex = /(\d+)\s*متر/i;
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

// دالة لاستخراج رقم الهاتف
function extractPhoneNumber(text) {
  const regex = /(\+?0?9[\d\s]{8,})/g;
  const matches = text.match(regex);
  return matches ? matches[0].replace(/\s/g, '') : null;
}

// دالة لاستخراج المدينة
function extractCity(text) {
  const cities = [
    'دمشق',
    'حلب',
    'حمص',
    'حماة',
    'اللاذقية',
    'طرطوس',
    'دير الزور',
    'الرقة',
    'السويداء',
    'القنيطرة',
  ];
  const regex = new RegExp(`(${cities.join('|')})`, 'i');
  const match = text.match(regex);
  return match ? match[0] : null;
}

// دالة لاستخراج المنطقة
function extractDistrict(text) {
  const regex = /حي\s+([\w\s]+)/i;
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

const categories = [
  {
    id: 1,
    name: 'عقارات',
    path: '/categories/1?category=عقارات',
    icon: '<BsFillHouseFill className="text-2xl" />',
  },
  {
    id: 2,
    name: 'سيارات',
    path: '/categories/2?category=سيارات',
    icon: '<FaCar className="text-2xl" />',
  },
  {
    id: 3,
    name: 'هواتف',
    path: '/categories/3?category=هواتف',
    icon: '<FaMobileAlt className="text-2xl" />',
  },
  {
    id: 4,
    name: 'كمبيوترات',
    path: '/categories/4?category=كمبيوترات',
    icon: '<FaLaptop className="text-2xl" />',
  },
  {
    id: 5,
    name: 'إلكترونيات',
    path: '/categories/5?category=إلكترونيات',
    icon: '<FaTv className="text-2xl" />',
  },
  {
    id: 6,
    name: 'مطبخ',
    path: '/categories/6?category=مطبخ',
    icon: '<FaUtensils className="text-2xl" />',
  },
  {
    id: 7,
    name: 'أثاث',
    path: '/categories/7?category=أثاث',
    icon: '<FaCouch className="text-2xl" />',
  },
  {
    id: 8,
    name: 'موضة',
    path: '/categories/8?category=موضة',
    icon: '<FaTshirt className="text-2xl" />',
  },
  {
    id: 9,
    name: 'رياضة',
    path: '/categories/9?category=رياضة',
    icon: '<FaBasketballBall className="text-2xl" />',
  },
  {
    id: 10,
    name: 'ألعاب',
    path: '/categories/10?category=ألعاب',
    icon: '<FaGamepad className="text-2xl" />',
  },
  {
    id: 11,
    name: 'كتب',
    path: '/categories/11?category=كتب',
    icon: '<FaBook className="text-2xl" />',
  },
  {
    id: 12,
    name: 'جمال',
    path: '/categories/12?category=جمال',
    icon: '<FaSmile className="text-2xl" />',
  },
  {
    id: 13,
    name: 'زراعة',
    path: '/categories/13?category=زراعة',
    icon: '<FaSeedling className="text-2xl" />',
  },
  {
    id: 14,
    name: 'طبية',
    path: '/categories/14?category=طبية',
    icon: '<FaStethoscope className="text-2xl" />',
  },
  {
    id: 15,
    name: 'هدايا',
    path: '/categories/15?category=هدايا',
    icon: '<FaGift className="text-2xl" />',
  },
  {
    id: 16,
    name: 'سياحة',
    path: '/categories/16?category=سياحة',
    icon: '<FaPlane className="text-2xl" />',
  },
  {
    id: 17,
    name: 'دراجات',
    path: '/categories/17?category=دراجات',
    icon: '<FaBicycle className="text-2xl" />',
  },
  {
    id: 18,
    name: 'أدوات',
    path: '/categories/18?category=أدوات',
    icon: '<FaTools className="text-2xl" />',
  },
];
// const categories = [
//   // Real Estate and Cars - Main Categories
//   {
//     id: 1,
//     name: 'العقارات',
//     enName: 'realEstate',
//     path: '/categories/1?category=realEstate',
//     icon: <BsFillHouseFill />,
//     description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار',
//   },
//   {
//     id: 2,
//     name: 'السيارات',
//     enName: 'cars',
//     path: '/categories/2?category=cars',
//     icon: <FaCar />,
//     description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات',
//   },

//   // Electronics and Technology
//   {
//     id: 3,
//     name: 'هواتف',
//     enName: 'phones',
//     path: '/categories/3?category=phones',
//     icon: <FaMobileAlt />,
//     description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها',
//   },
//   {
//     id: 4,
//     name: 'أجهزة الكمبيوتر',
//     enName: 'computers',
//     path: '/categories/4?category=computers',
//     icon: <FaLaptop />,
//     description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها',
//   },
//   {
//     id: 5,
//     name: 'إلكترونيات',
//     enName: 'electronics',
//     path: '/categories/5?category=electronics',
//     icon: <FaTv />,
//     description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية',
//   },

//   // Home and Furniture
//   {
//     id: 6,
//     name: 'أثاث',
//     enName: 'furniture',
//     path: '/categories/7?category=furniture',
//     icon: <FaCouch />,
//     description: 'أثاث غرف، مفروشات، وديكورات منزلية',
//   },
//   {
//     id: 7,
//     name: 'مطبخ',
//     enName: 'kitchen',
//     path: '/categories/6?category=kitchen',
//     icon: <FaKitchenSet />,
//     description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل',
//   },

//   // Fashion and Beauty
//   {
//     id: 8,
//     name: 'الموضة',
//     enName: 'fashion',
//     path: '/categories/8?category=fashion',
//     icon: <FaTshirt />,
//     description: 'ملابس، أحذية، حقائب، واكسسوارات',
//   },
//   {
//     id: 9,
//     name: 'الجمال',
//     enName: 'beauty',
//     path: '/categories/12?category=beauty',
//     icon: <FaSmile />,
//     description: 'مستحضرات تجميل، عطور، ومنتجات العناية',
//   },

//   // Sports and Entertainment
//   {
//     id: 10,
//     name: 'رياضة',
//     enName: 'sports',
//     path: '/categories/9?category=sports',
//     icon: <MdWork />,
//     description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين',
//   },
//   {
//     id: 11,
//     name: 'ألعاب',
//     enName: 'games',
//     path: '/categories/10?category=games',
//     icon: <FaGamepad />,
//     description: 'ألعاب فيديو، ألعاب أطفال، وهوايات',
//   },
//   {
//     id: 12,
//     name: 'أدوات',
//     enName: 'tools',
//     path: '/categories/11?category=tools',
//     icon: <FaTools />,
//     description: 'أدوات يدوية، معدات، وأدوات مهنية',
//   },
//   {
//     id: 13,
//     name: 'كتب',
//     enName: 'books',
//     path: '/categories/13?category=books',
//     icon: <FaBook />,
//     description: 'كتب، مجلات، وأدوات مكتبية',
//   },
//   {
//     id: 14,
//     name: 'هدايا',
//     enName: 'gifts',
//     path: '/categories/14?category=gifts',
//     icon: <FaGift />,
//     description: 'هدايا، مناسبات خاصة، وتغليف',
//   },
//   {
//     id: 15,
//     name: 'زراعة',
//     enName: 'agriculture',
//     path: '/categories/15?category=agriculture',
//     icon: <FaSeedling />,
//     description: 'نباتات، بذور، معدات زراعية، ومستلزمات',
//   },
//   {
//     id: 16,
//     name: 'دراجات',
//     enName: 'bikes',
//     path: '/categories/16?category=bikes',
//     icon: <FaBicycle />,
//     description: 'دراجات هوائية، دراجات نارية، وملحقاتها',
//   },
//   {
//     id: 17,
//     name: 'صحة',
//     enName: 'health',
//     path: '/categories/17?category=health',
//     icon: <FaStethoscope />,
//     description: 'مستلزمات طبية، أجهزة طبية، وأدوية',
//   },
//   {
//     id: 18,
//     name: 'أحذية',
//     enName: 'shoes',
//     path: '/categories/18?category=shoes',
//     icon: <GiConverseShoe />,
//     description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال',
//   },
//   {
//     id: 19,
//     name: 'حقائب',
//     enName: 'bags',
//     path: '/categories/19?category=bags',
//     icon: <FaBagShopping />,
//     description: 'حقائب يد، حقائب سفر، وحقائب مدرسية',
//   },
//   {
//     id: 20,
//     name: 'مجوهرات',
//     enName: 'jewelry',
//     path: '/categories/20?category=jewelry',
//     icon: <GiJewelCrown />,
//     description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات',
//   },
//   {
//     id: 21,
//     name: 'مستلزمات الأطفال',
//     enName: 'babySupplies',
//     path: '/categories/21?category=babySupplies',
//     icon: <PiBabyDuotone />,
//     description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية',
//   },
//   {
//     id: 22,
//     name: 'وظائف',
//     enName: 'jobs',
//     path: '/categories/22?category=jobs',
//     icon: <MdWork />,
//     description: 'فرص عمل، وظائف شاغرة، وتوظيف',
//   },
// ];
async function main() {
  const filePath = path.join(__dirname, 'posts.json');
  const rawData = fs.readFileSync(filePath);
  const posts = JSON.parse(rawData);

  for (const post of posts) {
    const caption = post.caption || '';

    // استخراج البيانات
    const adType = extractAdType(caption);
    const rooms = extractRooms(caption);
    const livingRooms = extractLivingRooms(caption);
    const area = extractArea(caption);
    const phone = extractPhoneNumber(caption);
    const city = extractCity(caption);
    const district = extractDistrict(caption);

    // إعداد الصور
    const defaultImage = 'https://i.imgur.com/vGpGUAj.png';
    const mediaUrls = post.media_url || [];

    await prisma.product.create({
      data: {
        title: caption.substring(0, 100) || 'No Title',
        userId: '408ddbae-7754-411f-897b-db19fcf4c00b',
        categoryId: categories.map((category) => category.id)[0],
        categoryName: categories.map((category) => category.name)[1],
        image1: mediaUrls[0] || defaultImage,
        image2: mediaUrls[1] || null,
        image3: mediaUrls[2] || null,
        image4: mediaUrls[3] || null,
        image5: mediaUrls[4] || null,
        basePrice: 0, // يمكن تفعيل استخراج السعر إذا لزم
        city: city,
        town: district,
        phoneNumber: phone,
        lng: null,
        lat: null,
        link: post.video_url || '',
        details: {
          adType: adType?.toString(),
          rooms: rooms?.toString(),
          livingrooms: livingRooms?.toString(),
          area: area?.toString(),
          propertyType: '1', // نوع العقار يمكن استخراجه مستقبلًا
        },
        description: caption,
        stockQuantity: 1,
        isDeleted: false,
        createdAt: new Date(post.timestamp * 1000),
        updatedAt: new Date(),
      },
    });

    console.log(`تمت معالجة الإعلان: ${post.post_id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
