import { FaBook, FaPencilAlt, FaLanguage } from 'react-icons/fa';
import {
  GiBookCover,
  GiBookshelf,
  GiNotebook,
  GiArchiveResearch,
  GiSpellBook,
} from 'react-icons/gi';

let Icons = {};

try {
  Icons = {
    ProductType: GiBookshelf,
    Genre: GiSpellBook,
    Author: FaPencilAlt,
    Publisher: GiBookCover,
    Language: FaLanguage,
    Format: GiNotebook,
    Edition: GiArchiveResearch,
    Condition: FaBook,
    ISBN: FaBook,
  };
} catch (error) {
  console.warn(
    '⚠️ بعض أيقونات الكتب غير متاحة في react-icons. تحقق من المكتبة!',
    error
  );
  Icons = {};
}

const books = [
  {
    name: 'productType',
    label: 'نوع المنتج',
    icon: Icons.ProductType ? (
      <Icons.ProductType className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'كتب عامة',
      2: 'كتب دراسية',
      3: 'كتب صوتية',
      4: 'مجلات ودوريات',
      5: 'قصص مصورة',
      6: 'موسوعات',
      7: 'كتب أكاديمية',
      8: 'أخرى',
    },
  },
  {
    name: 'genre',
    label: 'التصنيف الأدبي',
    icon: Icons.Genre ? (
      <Icons.Genre className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'خيال علمي',
      2: 'فانتازيا',
      3: 'رومانسي',
      4: 'غموض وإثارة',
      5: 'تاريخي',
      6: 'سيرة ذاتية',
      7: 'تطوير ذاتي',
      8: 'أدب رحلات',
      9: 'شعر',
      10: 'أدب عالمي',
      11: 'أخرى',
    },
  },
  {
    name: 'author',
    label: 'المؤلف/المترجم',
    icon: Icons.Author ? (
      <Icons.Author className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: 'اسم المؤلف أو المترجم',
  },
  {
    name: 'publisher',
    label: 'دار النشر',
    icon: Icons.Publisher ? (
      <Icons.Publisher className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: 'اسم دار النشر',
  },
  {
    name: 'language',
    label: 'اللغة',
    icon: Icons.Language ? (
      <Icons.Language className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'العربية',
      2: 'الإنجليزية',
      3: 'الفرنسية',
      4: 'الإسبانية',
      5: 'الألمانية',
      6: 'الفارسية',
      7: 'أخرى',
    },
  },
  {
    name: 'format',
    label: 'نوع النسخة',
    icon: Icons.Format ? (
      <Icons.Format className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'غلاف مقوى',
      2: 'غلاف ورقي',
      3: 'كتاب إلكتروني (PDF, ePub)',
      4: 'كتاب صوتي',
      5: 'نسخة أصلية',
      6: 'نسخة مستعملة',
    },
  },
  {
    name: 'edition',
    label: 'الطبعة',
    icon: Icons.Edition ? (
      <Icons.Edition className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: 'رقم الطبعة وسنة النشر',
  },
  {
    name: 'condition',
    label: 'الحالة',
    icon: Icons.Condition ? (
      <Icons.Condition className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: '-اختر-',
    options: {
      1: 'جديد',
      2: 'مستعمل - ممتازة',
      3: 'مستعمل - جيدة',
      4: 'مستعمل - بها علامات تآكل',
      5: 'نادرة/قديمة',
    },
  },
  {
    name: 'isbn',
    label: 'رقم ISBN',
    icon: Icons.ISBN ? (
      <Icons.ISBN className="text-primary-400 text-md sm:text-lg" />
    ) : null,
    placeholder: 'أدخل رقم ISBN إن وجد',
  },
];

export default books;
