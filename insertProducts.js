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
        userId: '516ed8a0-52b3-4b49-8a9a-286d56c262c5',
        categoryId: categories.map((category) => category.id)[0],
        categoryName: categories.map((category) => category.name)[0],
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
