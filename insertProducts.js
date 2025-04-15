const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

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
    name: 'كمبيوترات',
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
    description: 'مستلزمات صحة، أجهزة صحة، وأدوية',
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

const carProducts = [
  {
    id: 'b7829a1f-6234-4e8c-951a-a9d73b8f52e1',
    title: 'سيارة تويوتا كامري 2020',
    userId: '7c9d2e5b-8a6c-4f3e-9b1d-5f0a2b7c1e9f',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/camry2020.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 18000,
    adCategory: 'مستعملة',
    city: 'حلب',
    town: 'السريان',
    phoneNumber: '0933123456',
    lng: 37.15,
    lat: 36.2,
    link: null,
    details: {
      year: '2020',
      brand: 'تويوتا',
      model: 'كامري',
      adType: 'للبيع',
      mileage: '85000',
      fuelType: 'بنزين',
      condition: 'ممتازة',
    },
    description:
      'تويوتا كامري موديل 2020 بحالة ممتازة، صيانة دورية، لا يوجد حوادث.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T10:00:00.000Z',
    updatedAt: '2023-10-27T10:00:00.000Z',
  },
  {
    id: 'e35a7c4d-1b2e-489f-8a3b-9c567d2e1a3f',
    title: 'سيارة هيونداي النترا 2022',
    userId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/elantra2022.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 22000,
    adCategory: 'جديدة',
    city: 'اللاذقية',
    town: 'الرمل الجنوبي',
    phoneNumber: '0944789012',
    lng: 35.78,
    lat: 35.52,
    link: null,
    details: {
      year: '2022',
      brand: 'هيونداي',
      model: 'النترا',
      adType: 'للبيع',
      mileage: '0',
      fuelType: 'بنزين',
      condition: 'جديدة',
    },
    description: 'هيونداي النترا 2022، زيرو، جميع الكماليات.',
    stockQuantity: 5,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T10:15:00.000Z',
    updatedAt: '2023-10-27T10:15:00.000Z',
  },
  {
    id: 'f9130e2a-7d7e-494e-b892-344b936d5695',
    title: 'نيسان صني 2015 للبيع',
    userId: '3b62e8f7-9f2d-4e1a-b24d-2a6b8a7e5c4a',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/nissan_sunny.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 8500,
    adCategory: 'مستعملة',
    city: 'دمشق',
    town: 'ركن الدين',
    phoneNumber: '0991234567',
    lng: 36.31,
    lat: 33.51,
    link: null,
    details: {
      year: '2015',
      brand: 'نيسان',
      model: 'صني',
      adType: 'للبيع',
      mileage: '120000',
      fuelType: 'بنزين',
      condition: 'جيدة',
    },
    description:
      'نيسان صني 2015 بحالة جيدة جداً، تحتاج إلى بعض الصيانة البسيطة.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T10:30:00.000Z',
    updatedAt: '2023-10-27T10:30:00.000Z',
  },
  {
    id: 'd46f2b8c-9a5d-4b7e-a12f-4c8e6d0a5f7b',
    title: 'كيا سيراتو 2018 - فرصة',
    userId: '9d8e7f6a-5b4c-4d3e-a21b-6c7a8f9e0d1c',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/kia_cerato.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 14500,
    adCategory: 'مستعملة',
    city: 'طرطوس',
    town: 'المدينة',
    phoneNumber: '0955555555',
    lng: 35.89,
    lat: 34.89,
    link: null,
    details: {
      year: '2018',
      brand: 'كيا',
      model: 'سيراتو',
      adType: 'للبيع',
      mileage: '90000',
      fuelType: 'بنزين',
      condition: 'جيدة جداً',
    },
    description: 'كيا سيراتو موديل 2018 بحالة جيدة جداً، السعر قابل للتفاوض.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T10:45:00.000Z',
    updatedAt: '2023-10-27T10:45:00.000Z',
  },
  {
    id: 'a39e0e75-22ff-4996-8d5c-e32d5e5a4a8a',
    title: 'مرسيدس C200 موديل 2016',
    userId: '5e6d4c2b-1a3f-4e8d-9c7b-3a5e2d1c4b3a',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/mercedes_c200.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 28000,
    adCategory: 'مستعملة',
    city: 'حمص',
    town: 'الوعر',
    phoneNumber: '0966777888',
    lng: 36.72,
    lat: 34.73,
    link: null,
    details: {
      year: '2016',
      brand: 'مرسيدس',
      model: 'C200',
      adType: 'للبيع',
      mileage: '75000',
      fuelType: 'بنزين',
      condition: 'ممتازة',
    },
    description: 'مرسيدس C200 موديل 2016 بحالة ممتازة جداً، فحص كامل، فرش جلد.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T11:00:00.000Z',
    updatedAt: '2023-10-27T11:00:00.000Z',
  },
  {
    id: '81c69d3f-6928-4698-8987-6e7f5d4c3b2a',
    title: 'BMW 320i - بحالة ممتازة',
    userId: '7a9b1c2d-3e4f-4a6b-8c9d-5e7f9a1b3c2d',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/bmw_320i.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 25000,
    adCategory: 'مستعملة',
    city: 'دمشق',
    town: 'المالكي',
    phoneNumber: '0988999000',
    lng: 36.3,
    lat: 33.51,
    link: null,
    details: {
      year: '2017',
      brand: 'بي إم دبليو',
      model: '320i',
      adType: 'للبيع',
      mileage: '60000',
      fuelType: 'بنزين',
      condition: 'ممتازة',
    },
    description: 'BMW 320i موديل 2017 بحالة ممتازة، صيانة بالوكالة.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T11:15:00.000Z',
    updatedAt: '2023-10-27T11:15:00.000Z',
  },
  {
    id: '6d2f8a4b-7b6c-4e9d-8f8a-6c4b9e3a2f1b',
    title: 'شيفروليه كروز 2013 - سعر مغري',
    userId: '2b4c6d8e-5a7f-4b9a-8e1d-6a4c8e0f2b4c',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/chevrolet_cruze.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 7000,
    adCategory: 'مستعملة',
    city: 'حلب',
    town: 'حلب الجديدة',
    phoneNumber: '0933444555',
    lng: 37.15,
    lat: 36.2,
    link: null,
    details: {
      year: '2013',
      brand: 'شيفروليه',
      model: 'كروز',
      adType: 'للبيع',
      mileage: '150000',
      fuelType: 'بنزين',
      condition: 'جيدة',
    },
    description: 'شيفروليه كروز 2013 بسعر مغري، تحتاج إلى بعض الصيانة البسيطة.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T11:30:00.000Z',
    updatedAt: '2023-10-27T11:30:00.000Z',
  },
  {
    id: '4e1b3d5c-9a7f-4e5a-9b3d-5c4e1b7f3d5c',
    title: 'رينو ميجان 2019 - اقتصادية',
    userId: '6f8a0c2e-7b4d-4e6a-9c8f-2d6a0c8e6f8a',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/renault_megane.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 16000,
    adCategory: 'مستعملة',
    city: 'اللاذقية',
    town: 'مشروع الزراعة',
    phoneNumber: '0944111222',
    lng: 35.78,
    lat: 35.52,
    link: null,
    details: {
      year: '2019',
      brand: 'رينو',
      model: 'ميجان',
      adType: 'للبيع',
      mileage: '70000',
      fuelType: 'بنزين',
      condition: 'جيدة جداً',
    },
    description: 'رينو ميجان 2019 اقتصادية جداً في استهلاك الوقود، فحص كامل.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T11:45:00.000Z',
    updatedAt: '2023-10-27T11:45:00.000Z',
  },
  {
    id: '3a5b7c9d-1e2f-4a6b-8c9d-5e7f9a1b3c2d',
    title: 'فولكس فاجن جولف 2014 - رياضية',
    userId: '7c9d2e5b-8a6c-4f3e-9b1d-5f0a2b7c1e9f',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/volkswagen_golf.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 12000,
    adCategory: 'مستعملة',
    city: 'دمشق',
    town: 'المزة',
    phoneNumber: '0999888777',
    lng: 36.3,
    lat: 33.51,
    link: null,
    details: {
      year: '2014',
      brand: 'فولكس فاجن',
      model: 'جولف',
      adType: 'للبيع',
      mileage: '110000',
      fuelType: 'بنزين',
      condition: 'جيدة جداً',
    },
    description: 'فولكس فاجن جولف 2014 رياضية، إضافات مميزة، فحص كامل.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T12:00:00.000Z',
    updatedAt: '2023-10-27T12:00:00.000Z',
  },
  {
    id: '9b8a7c6d-2d3e-4f7a-8b9c-6a4b8e0f2b4c',
    title: 'بيجو 301 - موديل 2021',
    userId: '5e6d4c2b-1a3f-4e8d-9c7b-3a5e2d1c4b3a',
    categoryId: 2,
    categoryName: 'سيارات',
    image1: 'https://example.com/peugeot_301.jpg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 19500,
    adCategory: 'مستعملة',
    city: 'حمص',
    town: 'باب تدمر',
    phoneNumber: '0966555444',
    lng: 36.72,
    lat: 34.73,
    link: null,
    details: {
      year: '2021',
      brand: 'بيجو',
      model: '301',
      adType: 'للبيع',
      mileage: '45000',
      fuelType: 'بنزين',
      condition: 'ممتازة',
    },
    description: 'بيجو 301 موديل 2021 بحالة ممتازة، اقتصادية جداً، فرش جلد.',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2023-10-27T12:15:00.000Z',
    updatedAt: '2023-10-27T12:15:00.000Z',
  },
];
async function main() {
  // التحقق من وجود المستخدم قبل البدء
  const userId = '408ddbae-7754-411f-897b-db19fcf4c00b';
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    console.error(
      `User with ID ${userId} does not exist!  Please create the user or use an existing userId.`
    );
    return; // توقف عن التنفيذ إذا لم يكن المستخدم موجودًا
  }

  // إضافة منتجات السيارات الثابتة
  for (const car of carProducts) {
    try {
      await prisma.product.create({
        data: car,
      });
    } catch (error) {
      console.error(`Error adding car ${car.title}:`, error);
    }
  }

  // معالجة ملف JSON (posts.json)
  const filePath = path.join(__dirname, 'posts.json');
  try {
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
      const defaultImage = 'https://i.imgur.com/gbtd9PE.jpg';
      const mediaUrls = post.media_url || [];

      // معالجة التاريخ
      let createdAtDate;
      if (post.timestamp) {
        createdAtDate = new Date(post.timestamp * 1000);
        if (isNaN(createdAtDate.getTime())) {
          console.warn(
            `Invalid timestamp for post: ${post.post_id}. Using default date.`
          );
          createdAtDate = new Date(); // استخدم التاريخ الحالي كقيمة افتراضية
        }
      } else {
        createdAtDate = new Date(); // استخدم التاريخ الحالي كقيمة افتراضية إذا كان timestamp مفقودًا
        console.warn(
          `Timestamp missing for post: ${post.post_id}. Using default date.`
        );
      }

      try {
        // حلقة على جميع الفئات في المصفوفة
        for (const category of categories) {
          await prisma.product.create({
            data: {
              title: caption.substring(0, 100) || 'No Title',
              userId: userId,
              categoryId: category.id, // استخدام معرف الفئة الحالية
              categoryName: category.name, // استخدام اسم الفئة الحالية
              image1: mediaUrls[0] || defaultImage,
              image2: mediaUrls[1] || null,
              image3: mediaUrls[2] || null,
              image4: mediaUrls[3] || null,
              image5: mediaUrls[4] || null,
              basePrice: 0,
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
                propertyType: '1',
              },
              description: caption,
              stockQuantity: 1,
              isDeleted: false,
              createdAt: createdAtDate,
              updatedAt: new Date(),
            },
          });
        }
      } catch (error) {
        console.error(`Error processing post ${post.post_id}:`, error);
      }
    }
  } catch (error) {
    console.error(
      'Error reading or processing posts.json.  Make sure the file exists and is valid JSON.',
      error
    );
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
