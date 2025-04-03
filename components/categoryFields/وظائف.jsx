import React from 'react'; // استيراد React ضروري لاستخدام JSX
import {
  MdWork,
  MdLocationOn,
  MdAttachMoney,
  MdAccessTime,
  MdDescription,
  MdDateRange,
} from 'react-icons/md';
import {
  FaBuilding,
  FaUserTie,
  FaLaptopCode,
  FaChartLine,
  FaGraduationCap,
} from 'react-icons/fa';

// تعريف المتغير خارج try لضمان بقائه في النطاق وتوفير قيمة افتراضية
let jobs = [];

try {
  // كائن لتجميع مكونات الأيقونات المستخدمة لتجنب التكرار
  const JobIconComponents = {
    Title: <FaUserTie className="text-primary-500 text-lg sm:text-xl" />,
    Company: <FaBuilding className="text-primary-500 text-lg sm:text-xl" />,
    Location: <MdLocationOn className="text-primary-500 text-lg sm:text-xl" />,
    Salary: <MdAttachMoney className="text-primary-500 text-lg sm:text-xl" />,
    EmploymentType: (
      <MdAccessTime className="text-primary-500 text-lg sm:text-xl" />
    ),
    JobCategory: <MdWork className="text-primary-500 text-lg sm:text-xl" />,
    EducationLevel: (
      <FaGraduationCap className="text-primary-500 text-lg sm:text-xl" />
    ),
    Experience: <FaChartLine className="text-primary-500 text-lg sm:text-xl" />,
    Skills: <FaLaptopCode className="text-primary-500 text-lg sm:text-xl" />,
    Description: (
      <MdDescription className="text-primary-500 text-lg sm:text-xl" />
    ),
    Deadline: <MdDateRange className="text-primary-500 text-lg sm:text-xl" />,
  };

  // تعريف مصفوفة البيانات الرئيسية باستخدام الأيقونات المُجمعة
  jobs = [
    {
      name: 'title',
      label: 'المسمى الوظيفي',
      icon: JobIconComponents.Title,
      placeholder: 'مثال: مهندس برمجيات، محاسب، مدير مبيعات',
    },
    {
      name: 'company',
      label: 'الشركة',
      icon: JobIconComponents.Company,
      placeholder: 'اسم الشركة أو المؤسسة',
    },
    {
      name: 'location',
      label: 'المحافظة',
      icon: JobIconComponents.Location,
      placeholder: '-اختر-',
      options: {
        1: 'دمشق',
        2: 'حلب',
        3: 'حمص',
        4: 'اللاذقية',
        5: 'حماة',
        6: 'طرطوس',
        7: 'درعا',
        8: 'السويداء',
        9: 'القنيطرة',
        10: 'دير الزور',
        11: 'الحسكة',
        12: 'الرقة',
        13: 'إدلب',
        14: 'أخرى',
      },
    },
    {
      name: 'salary',
      label: 'الراتب',
      icon: JobIconComponents.Salary,
      placeholder: 'يرجى تحديد الراتب بالليرة السورية',
    },
    {
      name: 'employmentType',
      label: 'نوع الوظيفة',
      icon: JobIconComponents.EmploymentType,
      placeholder: '-اختر-',
      options: {
        1: 'دوام كامل',
        2: 'دوام جزئي',
        3: 'عقد مؤقت',
        4: 'عمل حر',
        5: 'تدريب',
        6: 'عن بعد',
        7: 'أخرى',
      },
    },
    {
      name: 'jobCategory',
      label: 'مجال الوظيفة',
      icon: JobIconComponents.JobCategory,
      placeholder: '-اختر-',
      options: {
        1: 'تكنولوجيا المعلومات',
        2: 'المالية والمحاسبة',
        3: 'المبيعات والتسويق',
        4: 'الموارد البشرية',
        5: 'الهندسة',
        6: 'الرعاية الصحية',
        7: 'التعليم',
        8: 'البناء والمقاولات',
        9: 'الخدمات',
        10: 'أخرى',
      },
    },
    {
      name: 'educationLevel',
      label: 'المؤهل العلمي',
      icon: JobIconComponents.EducationLevel,
      placeholder: '-اختر-',
      options: {
        1: 'ثانوية عامة',
        2: 'دبلوم',
        3: 'بكالوريوس',
        4: 'ماجستير',
        5: 'دكتوراه',
        6: 'لا يشترط مؤهل',
      },
    },
    {
      name: 'experience',
      label: 'الخبرة المطلوبة',
      icon: JobIconComponents.Experience,
      placeholder: '-اختر-',
      options: {
        1: 'لا تشترط خبرة',
        2: 'أقل من سنة',
        3: '1-3 سنوات',
        4: '3-5 سنوات',
        5: '5-10 سنوات',
        6: 'أكثر من 10 سنوات',
      },
    },
    {
      name: 'skills',
      label: 'المهارات المطلوبة',
      icon: JobIconComponents.Skills,
      placeholder: 'مثال: لغة انكليزية، برمجة، إدارة مشاريع...',
    },
    {
      name: 'description',
      label: 'وصف الوظيفة',
      icon: JobIconComponents.Description,
      placeholder: 'أدخل وصفاً مفصلاً للوظيفة والمهام المطلوبة',
    },
    {
      name: 'deadline',
      label: 'آخر موعد للتقديم',
      icon: JobIconComponents.Deadline,
      placeholder: 'حدد تاريخ انتهاء التقديم',
    },
  ];
} catch (error) {
  // التعامل مع الخطأ في حالة فشل إنشاء الأيقونات أو تعريف المصفوفة
  console.warn(
    '⚠️ حدث خطأ أثناء تهيئة بيانات الوظائف أو أيقوناتها. تحقق من مكتبة react-icons والمكونات المستخدمة.',
    error
  );
  // التأكد من أن القيمة المصدرة هي مصفوفة فارغة في حالة الخطأ
  jobs = [];
}

// تصدير النتيجة النهائية (إما المصفوفة المعبأة أو الفارغة)
export default jobs;
