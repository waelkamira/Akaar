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
        categoryId: 1,
        categoryName: 'عقارات',
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
