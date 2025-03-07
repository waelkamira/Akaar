'use client';
import { FaCalendarAlt, FaCar, FaTools } from 'react-icons/fa';
import YearsSelector from '../Selectors/yearSelector';
import { BsFillFuelPumpDieselFill } from 'react-icons/bs';
import { IoSpeedometerOutline } from 'react-icons/io5';
import { GiCarWheel } from 'react-icons/gi';
import { FaCarSide } from 'react-icons/fa';

const realEstate = [
  {
    name: 'adType', // المفتاح الإنجليزي
    label: 'نوع الإعلان', // الاسم العربي
    icon: <FaCarSide className="text-one text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'بيع',
      2: 'أجار',
    },
  },
  {
    name: 'brand', // المفتاح الإنجليزي
    label: 'الماركة', // الاسم العربي
    icon: <FaCar className="text-one text-lg sm:text-xl" />,
    placeholder: 'تويوتا',
    options: {
      1: 'تويوتا Toyota',
      2: 'فورد Ford',
      3: 'شيفروليه Chevrolet',
      4: 'هوندا Honda',
      5: 'نيسان Nissan',
      6: 'هيونداي Hyundai',
      7: 'كيا Kia',
      8: 'فولكسفاغن Volkswagen',
      9: 'مرسيدس-بنز Mercedes-Benz',
      10: 'بي إم دبليو BMW',
      11: 'أودي Audi',
      12: 'رينو Renault',
      13: 'بيجو Peugeot',
      14: 'سوزوكي Suzuki',
      15: 'مازدا Mazda',
      16: 'ميتسوبيشي Mitsubishi',
      17: 'لكزس Lexus',
      18: 'جيب Jeep',
      19: 'دودج Dodge',
      20: 'فيات Fiat',
      21: 'فولفو Volvo',
      22: 'سوبارو Subaru',
      23: 'جاغوار Jaguar',
      24: 'لاند روفر Land Rover',
      25: 'تيسلا Tesla',
      26: 'بورش Porsche',
      27: 'ميني Mini',
      28: 'سانغ يونغ SsangYong',
      29: 'دايهاتسو Daihatsu',
      30: 'إيسوزو Isuzu',
      31: 'أوبل Opel',
      32: 'سيات SEAT',
      33: 'سكودا Skoda',
      34: 'ألفا روميو Alfa Romeo',
      35: 'فيراري Ferrari',
      36: 'لامبورغيني Lamborghini',
      37: 'بنتلي Bentley',
      38: 'رولز رويس Rolls-Royce',
      39: 'أستون مارتن Aston Martin',
      40: 'ماكلارين McLaren',
      41: 'لوتس Lotus',
      42: 'مازيراتي Maserati',
      43: 'كاديلاك Cadillac',
      44: 'لينكولن Lincoln',
      45: 'كرايسلر Chrysler',
      46: 'رام RAM',
      47: 'جي إم سي GMC',
      48: 'بونتياك Pontiac',
      49: 'هولدين Holden',
      50: 'بروتون Proton',
      51: 'بيرلاي Perodua',
      52: 'تاتا Tata',
      53: 'ماهيندرا Mahindra',
      54: 'ماروتي سوزوكي Maruti Suzuki',
      55: 'فاو FAW',
      56: 'جاك JAC',
      57: 'جريت وول Great Wall',
      58: 'بريليانس Brilliance',
      59: 'تشانجان Changan',
      60: 'جيلي Geely',
      61: 'بورغوارد Borgward',
      62: 'دونغفنغ Dongfeng',
      63: 'زوتي Zotye',
      64: 'ليفان Lifan',
      65: 'هافال Haval',
      66: 'فوتون Foton',
      67: 'سينوفا Sinova',
      68: 'روز رايز Roewe',
      69: 'إم جي MG',
      70: 'لادا Lada',
      71: 'غاز GAZ',
      72: 'فاز VAZ',
      73: 'سايبا Saipa',
      74: 'إيران خودرو Iran Khodro',
      75: 'أبولو Apollo',
      76: 'أرتيجا Artega',
      77: 'أرييل Ariel',
      78: 'أستون مارتن Aston Martin',
      79: 'ألفا روميو Alfa Romeo',
      80: 'أوبل Opel',
      81: 'أودي Audi',
      82: 'أوروس Aurus',
      83: 'أوسكار Osca',
      84: 'أوليسيس Ulysse',
      85: 'إدون Edon',
      86: 'إسكاليد Escalade',
      87: 'إف سي في FCV',
      88: 'إكستريم Extreme',
      89: 'إلكتروميكانيكا Electromeccanica',
      90: 'إم جي MG',
      91: 'إم في أي MVI',
      92: 'إميريتي Emirati',
      93: 'إنفينيتي Infiniti',
      94: 'إي دي إس EDS',
      95: 'إي تي في ETV',
      96: 'إيجل Eagle',
      97: 'إيكو Eco',
      98: 'إيماك Emak',
      99: 'إيفوك Evoke',
      100: 'إيكاروس Ikarus',
      101: 'إيلو Elio',
      102: 'إيماك Emak',
      103: 'أباريث Abarth',
      104: 'أراش Arash',
      105: 'أرتينجا Artega',
      106: 'أرينو Arrinera',
      107: 'أستون مارتن Aston Martin',
      108: 'ألفا روميو Alfa Romeo',
      109: 'أميركان لايفان American LaFrance',
      110: 'أميريكان موتورز American Motors',
      111: 'أوبل Opel',
      112: 'أوتوموبيلي تورينو Automobili Torino',
      113: 'أوتوموبيلي لامبورغيني Automobili Lamborghini',
      114: 'أوتوموبيلي ماتيراتسي Automobili Matarazzi',
      115: 'أوتوموبيلي نوتشيولا Automobili Nucciola',
      116: 'غير ذلك',
    },
  },
  {
    name: 'model', // المفتاح الإنجليزي
    label: 'الموديل', // الاسم العربي
    icon: <FaTools className="text-one text-lg sm:text-xl" />,
    placeholder: 'كورولا',
  },
  {
    name: 'year', // المفتاح الإنجليزي
    label: 'السنة', // الاسم العربي
    icon: <FaCalendarAlt className="text-one text-lg sm:text-xl" />,
    placeholder: '2021',
  },
  {
    name: 'condition', // المفتاح الإنجليزي
    label: 'الحالة', // الاسم العربي
    icon: <GiCarWheel className="text-one text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'جديدة',
      2: 'مستعملة',
    },
  },

  {
    name: 'fuelType', // المفتاح الإنجليزي
    label: 'نوع الوقود', // الاسم العربي
    icon: <BsFillFuelPumpDieselFill className="text-one text-lg sm:text-xl" />,
    placeholder: '-اختر-',
    options: {
      1: 'بنزين',
      2: 'ديزل',
      3: 'كهرباء',
      4: 'هجين',
    },
    component: <YearsSelector />,
  },
  {
    name: 'mileage', // المفتاح الإنجليزي
    label: 'عدد الكيلومترات', // الاسم العربي
    icon: <IoSpeedometerOutline className="text-one text-lg sm:text-xl" />,
    placeholder: '20.000',
  },
];

export default realEstate;
