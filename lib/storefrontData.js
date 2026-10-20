export const storefrontCategories = [
  { id: 'home', name: 'المنزل والمطبخ', icon: '⌂', tone: 'sand' },
  { id: 'fashion', name: 'الأزياء والإكسسوارات', icon: '✦', tone: 'rose' },
  { id: 'tech', name: 'إلكترونيات', icon: '⌁', tone: 'blue' },
  { id: 'beauty', name: 'العناية والجمال', icon: '✿', tone: 'mint' },
  { id: 'gifts', name: 'هدايا مختارة', icon: '◇', tone: 'lavender' },
];

export const storefrontProducts = [
  { id: 'p1', name: 'طقم قهوة خزفي', category: 'home', categoryName: 'المنزل والمطبخ', price: 285000, oldPrice: 340000, rating: 4.9, reviews: 128, image: '/images/image (1).jpg', badge: 'الأكثر مبيعاً', seller: 'بيت الشام' },
  { id: 'p2', name: 'حقيبة جلد طبيعية', category: 'fashion', categoryName: 'الأزياء والإكسسوارات', price: 420000, oldPrice: 495000, rating: 4.8, reviews: 86, image: '/images/image (2).jpg', badge: 'عرض اليوم', seller: 'لمسة' },
  { id: 'p3', name: 'سماعات لاسلكية Pro', category: 'tech', categoryName: 'إلكترونيات', price: 650000, oldPrice: null, rating: 4.7, reviews: 214, image: '/images/image (3).jpg', badge: 'جديد', seller: 'تك زون' },
  { id: 'p4', name: 'مجموعة عناية يومية', category: 'beauty', categoryName: 'العناية والجمال', price: 195000, oldPrice: 240000, rating: 4.9, reviews: 64, image: '/images/image (4).jpg', badge: 'اختيارنا', seller: 'نقاء' },
  { id: 'p5', name: 'مصباح مكتب دافئ', category: 'home', categoryName: 'المنزل والمطبخ', price: 175000, oldPrice: null, rating: 4.6, reviews: 41, image: '/images/image (5).jpg', badge: null, seller: 'نور' },
  { id: 'p6', name: 'ساعة معدنية أنيقة', category: 'fashion', categoryName: 'الأزياء والإكسسوارات', price: 380000, oldPrice: 450000, rating: 4.8, reviews: 73, image: '/images/image (6).jpg', badge: 'هدية مميزة', seller: 'وقت' },
  { id: 'p7', name: 'سلة هدايا شرقية', category: 'gifts', categoryName: 'هدايا مختارة', price: 315000, oldPrice: null, rating: 5, reviews: 35, image: '/images/image (7).jpg', badge: 'محدود', seller: 'حكايا' },
  { id: 'p8', name: 'لوحة فنية يدوية', category: 'gifts', categoryName: 'هدايا مختارة', price: 525000, oldPrice: null, rating: 4.9, reviews: 29, image: '/images/image (8).jpg', badge: 'صنع محلي', seller: 'مرسم' },
];

export const formatPrice = (value) => `${new Intl.NumberFormat('ar-SY').format(value)} ل.س`;
