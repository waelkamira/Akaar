import categories from '../components/Categories/categories';
import { cities } from '../components/lists/Cities';
export const products = [
  {
    adCategory: null,
    basePrice: 4000,
    categoryId: 2,
    categoryName: 'سيارات', // Cars
    city: 'دمشق', // Damascus
    createdAt: '2025-03-26T21:29:44.514Z',
    deletedAt: null,
    description:
      'سيارة هوندا مستعملة بحالة ممتازة، موديل 2020، ماشية 50 ألف كم فقط. صيانة دورية في الوكالة.', // Used Honda car in excellent condition, 2020 model, only 50k km. Regular maintenance at the dealership.
    details: {
      year: '10',
      brand: '4',
      model: 'كورولا', // Corolla
      adType: '1',
      mileage: '9',
    },
    id: '4a191bd8-39a0-497b-b07b-b212a22c7d54',
    image1: 'https://i.imgur.com/Q3nSpVO.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 35.52328517910782,
    link: 'https://www.youtube.com/watch?v=NVFWHTl8DIE&ab_channel=DreamWorldScenicRelaxation4K',
    lng: 36.67785644531251,
    phoneNumber: '05362547',
    stockQuantity: 0,
    title: 'سيارة هوندا', // Honda car
    town: 'المزة', // Al-Mazza
    updatedAt: '2025-03-26T21:29:44.514Z',
    userId: '408ddbae-7754-411f-897b',
  },
  {
    adCategory: null,
    basePrice: 49999,
    categoryId: 1,
    categoryName: 'عقارات', // Real Estate
    city: 'دمشق', // Damascus
    createdAt: '2025-03-25T17:42:04.592Z',
    deletedAt: null,
    description:
      'شقة فاخرة للبيع في منطقة القدم، 3 غرف نوم، 2 حمام، صالتين، مطبخ مجهز بالكامل، تشطيبات فاخرة، إطلالة رائعة.', // Luxury apartment for sale in Al-Qadam area, 3 bedrooms, 2 bathrooms, 2 living rooms, fully equipped kitchen, luxury finishes, great view.
    details: {
      area: '200',
      rooms: '3',
      adType: '1',
      bathrooms: '2',
      livingrooms: '2',
    },
    id: 'f87aafc0-1c2c-48a4-a746-6da89f6d07e1',
    image1: 'https://i.imgur.com/egQLjNB.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 33.5138,
    link: '',
    lng: 36.2765,
    phoneNumber: '41545',
    stockQuantity: 0,
    title: 'بيت للبيع في القدم', // House for sale in Al-Qadam
    town: 'القدم', // Al-Qadam
    updatedAt: '2025-03-25T17:42:04.592Z',
    userId: '408ddbae-7754-411f',
  },
  {
    adCategory: null,
    basePrice: 3500,
    categoryId: 2,
    categoryName: 'سيارات', // Cars
    city: 'حلب', // Aleppo
    createdAt: '2025-03-24T14:15:30.000Z',
    deletedAt: null,
    description:
      'سيارة تويوتا كامري بحالة ممتازة، موديل 2018، ماشية 120 ألف كم، لون أبيض، فرش جلد، كاميرا خلفية، سنسور.', // Toyota Camry in excellent condition, 2018 model, 120k km, white color, leather seats, rear camera, sensors.
    details: {
      year: '8',
      brand: '2',
      model: 'كامري', // Camry
      adType: '1',
      mileage: '12',
    },
    id: '5b292cd9-48a1-498c-b0c8-c3d1a23e5f67',
    image1: 'https://i.imgur.com/dMVYVpH.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 36.2021,
    lng: 37.1343,
    phoneNumber: '09876543',
    stockQuantity: 0,
    title: 'سيارة تويوتا للبيع', // Toyota car for sale
    town: 'الجميلية', // Al-Jamiliyah
    updatedAt: '2025-03-24T14:15:30.000Z',
    userId: '509edbaf-8865-522g-998c',
  },
  {
    adCategory: null,
    basePrice: 75000,
    categoryId: 1,
    categoryName: 'عقارات', // Real Estate
    city: 'حلب', // Aleppo
    createdAt: '2025-03-23T09:30:15.000Z',
    deletedAt: null,
    description:
      'شقة فاخرة للإيجار في وسط المدينة، 4 غرف نوم، 3 حمامات، صالة كبيرة، مطبخ حديث، تدفئة مركزية، موقف سيارات.', // Luxury apartment for rent in city center, 4 bedrooms, 3 bathrooms, large living room, modern kitchen, central heating, parking.
    details: {
      area: '150',
      rooms: '4',
      adType: '2',
      bathrooms: '3',
      livingrooms: '1',
    },
    id: '6c393de0-2d3e-499d-b8f9-d4e2b34f6g78',
    image1: 'https://i.imgur.com/7FGH5iJ.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 36.1921,
    lng: 37.1643,
    phoneNumber: '01234567',
    stockQuantity: 0,
    title: 'شقة للإيجار في وسط المدينة', // Apartment for rent in city center
    town: 'العزيزية', // Al-Aziziyah
    updatedAt: '2025-03-23T09:30:15.000Z',
    userId: '610fcbag-9976-633h-009d',
  },
  {
    adCategory: null,
    basePrice: 1200,
    categoryId: 3,
    categoryName: 'إلكترونيات', // Electronics
    city: 'دمشق', // Damascus
    createdAt: '2025-03-22T16:45:22.000Z',
    deletedAt: null,
    description:
      'هاتف آيفون 16 برو جديد مع ضمان لمدة سنة، ذاكرة 256 جيجابايت، لون أسود، مع جميع الملحقات الأصلية.', // New iPhone 16 Pro with 1-year warranty, 256GB storage, black color, with all original accessories.
    details: {
      brand: '1', // Apple
      model: 'iPhone 16 Pro',
      storage: '256',
      color: 'أسود', // Black
      condition: 'جديد', // New
    },
    id: '7d404ef1-3e4f-500e-c9g0-e5f3c45h7i89',
    image1: 'https://i.imgur.com/8HIJ6jK.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 33.5238,
    lng: 36.2965,
    phoneNumber: '09876543',
    stockQuantity: 5,
    title: 'آيفون 16 برو', // iPhone 16 Pro
    town: 'المزة', // Al-Mazza
    updatedAt: '2025-03-22T16:45:22.000Z',
    userId: '711gdcbh-0087-744i-110e',
  },
  {
    adCategory: null,
    basePrice: 900,
    categoryId: 3,
    categoryName: 'إلكترونيات', // Electronics
    city: 'دمشق', // Damascus
    createdAt: '2025-03-21T11:20:18.000Z',
    deletedAt: null,
    description:
      'هاتف آيفون 16 بحالة ممتازة، استخدام 3 أشهر فقط، ذاكرة 128 جيجابايت، لون أزرق، مع الشاحن والكفر الأصلي.', // iPhone 16 in excellent condition, used for only 3 months, 128GB storage, blue color, with original charger and case.
    details: {
      brand: '1', // Apple
      model: 'iPhone 16',
      storage: '128',
      color: 'أزرق', // Blue
      condition: 'مستعمل', // Used
    },
    id: '8e515fg2-4f5g-601f-d0h1-f6g4d56i8j90',
    image1: 'https://i.imgur.com/9IJK7lL.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 33.5338,
    lng: 36.3065,
    phoneNumber: '01234567',
    stockQuantity: 2,
    title: 'آيفون 16', // iPhone 16
    town: 'الشعلان', // Al-Sha'lan
    updatedAt: '2025-03-21T11:20:18.000Z',
    userId: '812hejci-1198-855j-221f',
  },
  {
    adCategory: null,
    basePrice: 1500,
    categoryId: 3,
    categoryName: 'إلكترونيات', // Electronics
    city: 'حلب', // Aleppo
    createdAt: '2025-03-20T13:10:45.000Z',
    deletedAt: null,
    description:
      'هاتف آيفون 16 برو ماكس جديد، ذاكرة 512 جيجابايت، لون ذهبي، مع جميع الملحقات وكفالة الوكيل لمدة سنتين.', // New iPhone 16 Pro Max, 512GB storage, gold color, with all accessories and 2-year dealer warranty.
    details: {
      brand: '1', // Apple
      model: 'iPhone 16 Pro Max',
      storage: '512',
      color: 'ذهبي', // Gold
      condition: 'جديد', // New
    },
    id: '9f626gh3-5g6h-702g-e1i2-g7h5e67j9k01',
    image1: 'https://i.imgur.com/0JKL8mM.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 36.2121,
    lng: 37.1543,
    phoneNumber: '09876543',
    stockQuantity: 3,
    title: 'آيفون 16 برو ماكس', // iPhone 16 Pro Max
    town: 'السليمانية', // Al-Sulaymaniyah
    updatedAt: '2025-03-20T13:10:45.000Z',
    userId: '913ifkdj-2209-966k-332g',
  },
  {
    adCategory: null,
    basePrice: 800,
    categoryId: 3,
    categoryName: 'إلكترونيات', // Electronics
    city: 'حمص', // Homs
    createdAt: '2025-03-19T10:25:33.000Z',
    deletedAt: null,
    description:
      'هاتف سامسونج جالاكسي إس 24 بحالة ممتازة، استخدام شهر واحد فقط، ذاكرة 256 جيجابايت، لون أسود، مع جميع الملحقات.', // Samsung Galaxy S24 in excellent condition, used for only 1 month, 256GB storage, black color, with all accessories.
    details: {
      brand: '2', // Samsung
      model: 'Galaxy S24',
      storage: '256',
      color: 'أسود', // Black
      condition: 'مستعمل', // Used
    },
    id: '0g737hi4-6h7i-803h-f2j3-h8i6f78k0l12',
    image1: 'https://i.imgur.com/1KLM9nN.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 34.7324,
    lng: 36.7137,
    phoneNumber: '09876543',
    stockQuantity: 1,
    title: 'سامسونج جالاكسي إس 24', // Samsung Galaxy S24
    town: 'الحميدية', // Al-Hamidiyah
    updatedAt: '2025-03-19T10:25:33.000Z',
    userId: '014jgldk-3310-077l-443h',
  },
  {
    adCategory: null,
    basePrice: 600,
    categoryId: 3,
    categoryName: 'إلكترونيات', // Electronics
    city: 'اللاذقية', // Latakia
    createdAt: '2025-03-18T14:40:12.000Z',
    deletedAt: null,
    description:
      'هاتف هواوي بي 60 برو جديد، ذاكرة 256 جيجابايت، لون فضي، كاميرا احترافية، بطارية تدوم طويلاً، مع جميع الملحقات.', // New Huawei P60 Pro, 256GB storage, silver color, professional camera, long-lasting battery, with all accessories.
    details: {
      brand: '3', // Huawei
      model: 'P60 Pro',
      storage: '256',
      color: 'فضي', // Silver
      condition: 'جديد', // New
    },
    id: '1h848ij5-7i8j-904i-g3k4-i9j7g89l1m23',
    image1: 'https://i.imgur.com/2LMN0oO.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 35.5225,
    lng: 35.7915,
    phoneNumber: '01234567',
    stockQuantity: 4,
    title: 'هواوي بي 60 برو', // Huawei P60 Pro
    town: 'الشاطئ الأزرق', // Blue Beach
    updatedAt: '2025-03-18T14:40:12.000Z',
    userId: '115khmle-4421-188m-554i',
  },
  {
    adCategory: null,
    basePrice: 550,
    categoryId: 3,
    categoryName: 'إلكترونيات', // Electronics
    city: 'حمص', // Homs
    createdAt: '2025-03-17T09:15:55.000Z',
    deletedAt: null,
    description:
      'هاتف شاومي 14 ألترا جديد، ذاكرة 512 جيجابايت، لون أخضر، كاميرا بدقة 200 ميجابكسل، شاشة AMOLED، شحن سريع.', // New Xiaomi 14 Ultra, 512GB storage, green color, 200MP camera, AMOLED display, fast charging.
    details: {
      brand: '4', // Xiaomi
      model: '14 Ultra',
      storage: '512',
      color: 'أخضر', // Green
      condition: 'جديد', // New
    },
    id: '2i959jk6-8j9k-005j-h4l5-j0k8h90m2n34',
    image1: 'https://i.imgur.com/3MNO1pP.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 34.7424,
    lng: 36.7237,
    phoneNumber: '09876543',
    stockQuantity: 2,
    title: 'شاومي 14 ألترا', // Xiaomi 14 Ultra
    town: 'الوعر', // Al-Waer
    updatedAt: '2025-03-17T09:15:55.000Z',
    userId: '216linmf-5532-299n-665j',
  },
  {
    adCategory: null,
    basePrice: 120000,
    categoryId: 1,
    categoryName: 'عقارات', // Real Estate
    city: 'اللاذقية', // Latakia
    createdAt: '2025-03-16T11:30:40.000Z',
    deletedAt: null,
    description:
      'فيلا فاخرة للبيع على الشاطئ، 5 غرف نوم، 4 حمامات، مسبح خاص، حديقة واسعة، إطلالة بحرية رائعة، تشطيبات فاخرة.', // Luxury villa for sale on the beach, 5 bedrooms, 4 bathrooms, private pool, large garden, amazing sea view, luxury finishes.
    details: {
      area: '400',
      rooms: '5',
      adType: '1',
      bathrooms: '4',
      livingrooms: '3',
    },
    id: '3j060kl7-9k0l-106k-i5m6-k1l9i01n3o45',
    image1: 'https://i.imgur.com/4NOP2qQ.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 35.5325,
    lng: 35.8015,
    phoneNumber: '01234567',
    stockQuantity: 0,
    title: 'فيلا فاخرة على الشاطئ', // Luxury beach villa
    town: 'الشاطئ الأزرق', // Blue Beach
    updatedAt: '2025-03-16T11:30:40.000Z',
    userId: '317mjong-6643-300o-776k',
  },
  {
    adCategory: null,
    basePrice: 6500,
    categoryId: 2,
    categoryName: 'سيارات', // Cars
    city: 'حمص', // Homs
    createdAt: '2025-03-15T15:20:25.000Z',
    deletedAt: null,
    description:
      'سيارة مرسيدس E200 موديل 2019، ماشية 80 ألف كم، لون أسود، فرش جلد بيج، فتحة سقف، كاميرا 360 درجة، رادار.', // Mercedes E200 2019 model, 80k km, black color, beige leather interior, sunroof, 360-degree camera, radar.
    details: {
      year: '9',
      brand: '1',
      model: 'E200',
      adType: '1',
      mileage: '8',
    },
    id: '4k171lm8-0l1m-207l-j6n7-l2m0j12o4p56',
    image1: 'https://i.imgur.com/5OPQ3rR.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 34.7524,
    lng: 36.7337,
    phoneNumber: '09876543',
    stockQuantity: 0,
    title: 'مرسيدس E200 للبيع', // Mercedes E200 for sale
    town: 'الإنشاءات', // Al-Inshaat
    updatedAt: '2025-03-15T15:20:25.000Z',
    userId: '418nkpoh-7754-411p-887l',
  },
  {
    adCategory: null,
    basePrice: 5500,
    categoryId: 2,
    categoryName: 'سيارات', // Cars
    city: 'اللاذقية', // Latakia
    createdAt: '2025-03-14T12:45:18.000Z',
    deletedAt: null,
    description:
      'سيارة بي إم دبليو 520i موديل 2017، ماشية 100 ألف كم، لون أبيض، فرش جلد أسود، نظام ملاحة، حساسات أمامية وخلفية.', // BMW 520i 2017 model, 100k km, white color, black leather interior, navigation system, front and rear sensors.
    details: {
      year: '7',
      brand: '3',
      model: '520i',
      adType: '1',
      mileage: '10',
    },
    id: '5l282mn9-1m2n-308m-k7o8-m3n1k23p5q67',
    image1: 'https://i.imgur.com/6PQR4sS.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 35.5425,
    lng: 35.8115,
    phoneNumber: '01234567',
    stockQuantity: 0,
    title: 'بي إم دبليو 520i للبيع', // BMW 520i for sale
    town: 'الزراعة', // Al-Ziraa
    updatedAt: '2025-03-14T12:45:18.000Z',
    userId: '519olqpi-8865-522q-998m',
  },
  {
    adCategory: null,
    basePrice: 35000,
    categoryId: 1,
    categoryName: 'عقارات', // Real Estate
    city: 'حمص', // Homs
    createdAt: '2025-03-13T10:35:50.000Z',
    deletedAt: null,
    description:
      'شقة للبيع في منطقة الإنشاءات، 2 غرفة نوم، حمام، صالة، مطبخ، بلكون، الطابق الثالث، تشطيبات جيدة.', // Apartment for sale in Al-Inshaat area, 2 bedrooms, 1 bathroom, living room, kitchen, balcony, 3rd floor, good finishes.
    details: {
      area: '120',
      rooms: '2',
      adType: '1',
      bathrooms: '1',
      livingrooms: '1',
    },
    id: '6m393no0-2n3o-409n-l8p9-n4o2l34q6r78',
    image1: 'https://i.imgur.com/7QRS5tT.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 34.7624,
    lng: 36.7437,
    phoneNumber: '09876543',
    stockQuantity: 0,
    title: 'شقة للبيع في الإنشاءات', // Apartment for sale in Al-Inshaat
    town: 'الإنشاءات', // Al-Inshaat
    updatedAt: '2025-03-13T10:35:50.000Z',
    userId: '620pmrqj-9976-633r-009n',
  },
  {
    adCategory: null,
    basePrice: 30000,
    categoryId: 1,
    categoryName: 'عقارات', // Real Estate
    city: 'دمشق', // Damascus
    createdAt: '2025-03-12T14:25:30.000Z',
    deletedAt: null,
    description:
      'شقة للإيجار السنوي في المزة، 3 غرف نوم، 2 حمام، صالة كبيرة، مطبخ أمريكي، تدفئة مركزية، مفروشة بالكامل.', // Apartment for yearly rent in Al-Mazza, 3 bedrooms, 2 bathrooms, large living room, American kitchen, central heating, fully furnished.
    details: {
      area: '180',
      rooms: '3',
      adType: '2',
      bathrooms: '2',
      livingrooms: '1',
    },
    id: '7n404op1-3o4p-510o-m9q0-o5p3m45r7s89',
    image1: 'https://i.imgur.com/8RST6uU.jpeg',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    isDeleted: false,
    lat: 33.5438,
    lng: 36.3065,
    phoneNumber: '01234567',
    stockQuantity: 0,
    title: 'شقة مفروشة للإيجار في المزة', // Furnished apartment for rent in Al-Mazza
    town: 'المزة', // Al-Mazza
    updatedAt: '2025-03-12T14:25:30.000Z',
    userId: '721qnsrk-0087-744s-110o',
  },
];

// Define filter options for each category
export const filterOptions = {
  // Static filters (available for all categories)
  static: {
    cities: cities.map((city) => ({
      ...city,
      id: city.name, // Use name as id for compatibility
      towns: city.towns.map((town) => ({
        ...town,
        id: town.name, // Use name as id for compatibility
      })),
    })),

    priceRange: {
      min: 0,
      max: 150000,
    },
  },
  // Dynamic filters (specific to each category)
  dynamic: {
    // Real Estate (categoryId: 1)
    1: {
      rooms: [
        { id: '1', name: '1 غرفة' }, // 1 room
        { id: '2', name: '2 غرف' }, // 2 rooms
        { id: '3', name: '3 غرف' }, // 3 rooms
        { id: '4', name: '4 غرف' }, // 4 rooms
        { id: '5', name: '5+ غرف' }, // 5+ rooms
      ],
      bathrooms: [
        { id: '1', name: '1 حمام' }, // 1 bathroom
        { id: '2', name: '2 حمام' }, // 2 bathrooms
        { id: '3', name: '3+ حمام' }, // 3+ bathrooms
      ],
      livingrooms: [
        { id: '1', name: '1 صالة' }, // 1 living room
        { id: '2', name: '2 صالة' }, // 2 living rooms
        { id: '3', name: '3+ صالة' }, // 3+ living rooms
      ],
      adType: [
        { id: '1', name: 'بيع' }, // Sale
        { id: '2', name: 'إيجار' }, // Rent
      ],
      area: {
        min: 0,
        max: 500,
      },
    },
    // Cars (categoryId: 2)
    2: {
      brand: [
        { id: '1', name: 'مرسيدس' }, // Mercedes
        { id: '2', name: 'تويوتا' }, // Toyota
        { id: '3', name: 'بي إم دبليو' }, // BMW
        { id: '4', name: 'هوندا' }, // Honda
      ],
      year: [
        { id: '5', name: '2015' },
        { id: '6', name: '2016' },
        { id: '7', name: '2017' },
        { id: '8', name: '2018' },
        { id: '9', name: '2019' },
        { id: '10', name: '2020' },
      ],
      adType: [
        { id: '1', name: 'بيع' }, // Sale
        { id: '2', name: 'إيجار' }, // Rent
      ],
      mileage: {
        min: 0,
        max: 200000,
      },
    },
    // Electronics (categoryId: 3)
    3: {
      brand: [
        { id: '1', name: 'آبل' }, // Apple
        { id: '2', name: 'سامسونج' }, // Samsung
        { id: '3', name: 'هواوي' }, // Huawei
        { id: '4', name: 'شاومي' }, // Xiaomi
      ],
      model: [
        { id: 'iPhone 16', name: 'آيفون 16' }, // iPhone 16
        { id: 'iPhone 16 Pro', name: 'آيفون 16 برو' }, // iPhone 16 Pro
        { id: 'iPhone 16 Pro Max', name: 'آيفون 16 برو ماكس' }, // iPhone 16 Pro Max
        { id: 'Galaxy S24', name: 'جالاكسي إس 24' }, // Galaxy S24
        { id: 'P60 Pro', name: 'بي 60 برو' }, // P60 Pro
        { id: '14 Ultra', name: '14 ألترا' }, // 14 Ultra
      ],
      condition: [
        { id: 'جديد', name: 'جديد' }, // New
        { id: 'مستعمل', name: 'مستعمل' }, // Used
      ],
      storage: [
        { id: '64', name: '64 جيجابايت' }, // 64GB
        { id: '128', name: '128 جيجابايت' }, // 128GB
        { id: '256', name: '256 جيجابايت' }, // 256GB
        { id: '512', name: '512 جيجابايت' }, // 512GB
        { id: '1024', name: '1 تيرابايت' }, // 1TB
      ],
    },
  },
  // Categories
  // categories: [
  //   { id: 1, name: "عقارات" }, // Real Estate
  //   { id: 2, name: "سيارات" }, // Cars
  //   { id: 3, name: "إلكترونيات" }, // Electronics
  // ],
  categories: categories,
};
