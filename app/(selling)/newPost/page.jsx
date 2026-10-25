
// 'use client';

// import { useState, useEffect, useContext } from 'react';
// import { useForm } from 'react-hook-form';
// import categories from '@/components/Categories/categories';
// import UploadingAndDisplayingImage from '@/components/photos/UploadingAndDisplayingImage';
// import { inputsContext } from '@/features/auth/inputs-context';
// import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation';
// import LoginButton from '@/components/Buttons/LoginButton';
// import {
//   MdCategory,
//   MdTitle,
//   MdPhone,
//   MdDescription,
//   MdAttachMoney,
//   MdCheckCircle,
// } from 'react-icons/md';
// import FormInput from './FormInput';
// import FormSelect from './FormSelect';
// import FormTextarea from './FormTextarea';
// import FormSubmitButton from './FormSubmitButton';
// import { useSession } from 'next-auth/react';
// import { FaTreeCity, FaMapLocationDot } from 'react-icons/fa6';
// import { PiBuildingsDuotone } from 'react-icons/pi';
// import { FaObjectGroup } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import dynamic from 'next/dynamic';

// // الاستيراد الديناميكي لمكون الخريطة مع تعطيل SSR وتحديث ستايل التحميل ليتناسب مع الثيم الداكن
// const OnClickMap = dynamic(() => import('../../../components/map/onClickMap'), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-72 sm:h-[400px] flex flex-col items-center justify-center bg-neutral-800/50 rounded-2xl text-white border border-neutral-700 animate-pulse gap-3">
//       <FaMapLocationDot className="text-3xl text-orange-500/50" />
//       <span className="text-sm font-medium">جاري تحميل الخريطة...</span>
//     </div>
//   ),
// });

// export default function NewPost() {
//   const [categoryFields, setCategoryFields] = useState([]);
//   const { register, handleSubmit } = useForm();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [emptyFields, setEmptyFields] = useState([]);
//   const router = useRouter();
//   const { addImages, location, dispatch } = useContext(inputsContext);
//   const session = useSession();
//   const [error, setError] = useState(null);

//   const [formState, setFormState] = useState({
//     userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
//     userImage: '/placeholder.jpg',
//     userName: 'wael',
//     title: '',
//     categoryId: '',
//     categoryName: '',
//     images: [
//       '/images/house.png',
//       '/images/house.png',
//       '/images/house.png',
//       '/images/house.png',
//     ],
//     city: '',
//     town: '',
//     stockQuantity: 1,
//     basePrice: '',
//     phoneNumber: '',
//     description: '',
//     link: '',
//     lng: 36.2765,
//     lat: 33.5138,
//     details: {},
//   });

//   const handleCategoryChange = (category) => {
//     if (category) {
//       const selected = categories[category - 1];
//       setSelectedCategory(selected);
//       setFormState((prev) => ({
//         ...prev,
//         categoryId: selected?.id || '',
//         categoryName: selected?.name || '',
//       }));
//     } else {
//       setSelectedCategory(null);
//       setFormState((prev) => ({
//         ...prev,
//         categoryId: '',
//         categoryName: '',
//       }));
//     }
//   };

//   useEffect(() => {
//     if (selectedCategory) {
//       import(`../../../components/categoryFields/${selectedCategory?.name}.jsx`)
//         .then((module) => {
//           setCategoryFields(module.default);
//           setError(null);
//         })
//         .catch((err) => {
//           console.error('Failed to load fields:', err);
//           setCategoryFields([]);
//           setError('فشل في تحميل الحقول');
//         });
//     } else {
//       setCategoryFields([]);
//     }
//   }, [selectedCategory]);

//   useEffect(() => {
//     setFormState((prev) => ({
//       ...prev,
//       categoryId: selectedCategory?.id || '',
//       categoryName: selectedCategory?.name || '',
//       images: addImages.length ? addImages : prev.images,
//       lng: location?.[1] !== undefined ? location[1] : prev.lng,
//       lat: location?.[0] !== undefined ? location[0] : prev.lat,
//     }));
//   }, [selectedCategory, location, addImages]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormState((prev) => ({ ...prev, [name]: value }));
//     if (value.trim()) {
//       setEmptyFields((prev) => prev.filter((item) => item !== name));
//     }
//   };

//   const handleDetailsChange = (field, value) => {
//     setFormState((prev) => ({
//       ...prev,
//       details: { ...prev.details, [field]: value },
//     }));
//     if (value.trim()) {
//       setEmptyFields((prev) => prev.filter((item) => item !== field));
//     }
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'userId', 'title', 'categoryId', 'categoryName', 'city', 'town', 'phoneNumber', 'basePrice', 'description',
//     ];
//     let emptyFieldsList = [];

//     const hasEmptyRequiredField = requiredFields.some((field) => {
//       if (typeof formState[field] === 'string' && !formState[field].trim()) {
//         emptyFieldsList.push(field);
//         return true;
//       }
//       return false;
//     });

//     if (!hasEmptyRequiredField && selectedCategory && categoryFields) {
//       categoryFields.forEach((field) => {
//         if (!formState.details[field?.name]?.trim()) {
//           emptyFieldsList.push(field?.name);
//         }
//       });
//     }

//     setEmptyFields(emptyFieldsList);
//     return emptyFieldsList.length === 0;
//   };

//   const onSubmit = async () => {
//     if (!selectedCategory) {
//       toast.error('يجب اختيار فئة قبل إرسال النموذج.');
//       return;
//     }

//     const formData = {
//       ...formState,
//       basePrice: parseInt(formState.basePrice) || 0,
//       stockQuantity: parseInt(formState.stockQuantity) || 1,
//       lng: formState.lng ? parseFloat(formState.lng) : null,
//       lat: formState.lat ? parseFloat(formState.lat) : null,
//     };

//     try {
//       const response = await fetch('/api/product', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         toast.success('تم إنشاء الإعلان بنجاح', { icon: <MdCheckCircle className="text-emerald-500" /> });
//         dispatch({ type: 'ADD_IMAGE', payload: [] });
//         router.push('/posts');
//       } else {
//         toast.error('حدث خطأ ما، حاول مرة أخرى');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('حدث خطأ ما، حاول مرة أخرى');
//     }
//   };

//   if (session?.status === 'unauthenticated') {
//     // return <LoginButton />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden mt-60" dir="rtl">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
//       </div>

//       {/* Vertical Text Decoration */}
//       <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
//         <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
//           NEW POST
//         </h1>
//       </div>

//       <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               if (validateForm()) onSubmit();
//             }}
//             className="space-y-8 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl"
//           >
//             {/* Header */}
//             <div className="border-b border-neutral-800 pb-6 mb-6">
//               <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
//                 <span className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
//                 إنشاء إعلان جديد
//               </h1>
//               <p className="text-white mt-2 mr-5 text-sm">قم بتعبئة جميع الحقول المطلوبة لإضافة إعلانك إلى المنصة</p>
//             </div>

//             {/* Image Upload Section */}
//             <div className="bg-neutral-800/30 rounded-2xl p-4 border border-neutral-700/50">
//               <UploadingAndDisplayingImage />
//             </div>

//             {/* Form Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="md:col-span-2">
//                 <FormSelect
//                   label="الفئة"
//                   icon={<MdCategory className="text-orange-500 text-lg sm:text-xl" />}
//                   name="category"
//                   options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
//                   register={register}
//                   errors={emptyFields}
//                   onChange={(e) => handleCategoryChange(e.target.value)}
//                   placeholder="- اختر الفئة -"
//                   // ملاحظة: تأكد من أن مكون FormSelect يدعم تمرير className أو أنه مصمم داخلياً ليدعم الثيم الداكن
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <FormInput
//                   label="عنوان الإعلان"
//                   icon={<MdTitle className="text-orange-500 text-lg sm:text-xl" />}
//                   name="title"
//                   placeholder="ضع عنواناً جذاباً ومناسباً للإعلان"
//                   register={register}
//                   errors={emptyFields}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <FormInput
//                 label="المدينة"
//                 icon={<PiBuildingsDuotone className="text-orange-500 text-lg sm:text-xl" />}
//                 name="city"
//                 placeholder="مثال: دمشق"
//                 register={register}
//                 errors={emptyFields}
//                 onChange={handleInputChange}
//               />

//               <FormInput
//                 label="المنطقة"
//                 icon={<FaTreeCity className="text-orange-500 text-lg sm:text-xl" />}
//                 name="town"
//                 placeholder="مثال: المزة"
//                 register={register}
//                 errors={emptyFields}
//                 onChange={handleInputChange}
//               />

//               <FormInput
//                 label="رقم الهاتف"
//                 icon={<MdPhone className="text-orange-500 text-lg sm:text-xl" />}
//                 name="phoneNumber"
//                 placeholder="09xxxxxxxx"
//                 type="tel"
//                 register={register}
//                 errors={emptyFields}
//                 onChange={handleInputChange}
//               />

//               <FormInput
//                 label="السعر"
//                 icon={<MdAttachMoney className="text-orange-500 text-lg sm:text-xl" />}
//                 name="basePrice"
//                 placeholder="0"
//                 type="number"
//                 register={register}
//                 errors={emptyFields}
//                 onChange={handleInputChange}
//               />

//               <FormInput
//                 label="الكمية المتاحة"
//                 icon={<FaObjectGroup className="text-orange-500 text-lg sm:text-xl" />}
//                 name="stockQuantity"
//                 placeholder="1"
//                 type="number"
//                 register={register}
//                 errors={emptyFields}
//                 onChange={handleInputChange}
//                 value={formState.stockQuantity}
//               />
//             </div>

//             {/* Dynamic Category Fields */}
//             {selectedCategory && Array.isArray(categoryFields) && categoryFields.length > 0 && (
//               <div className="space-y-6 pt-4 border-t border-neutral-800">
//                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                   <span className="w-1.5 h-5 bg-amber-500 rounded-full" />
//                   تفاصيل إضافية ({selectedCategory.name})
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {categoryFields.map((field, index) => (
//                     <div key={index} className="space-y-1.5">
//                       <label className="block text-sm font-bold text-neutral-300 flex items-center gap-2">
//                         {field?.icon} {field?.label}
//                       </label>
//                       {field?.options ? (
//                         <select
//                           className={`w-full bg-neutral-800/50 border rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none transition-all appearance-none ${
//                             emptyFields.includes(field?.name)
//                               ? 'border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
//                               : 'border-neutral-700/50 focus-within:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20'
//                           }`}
//                           required
//                           onChange={(e) => handleDetailsChange(field?.name, e.target.value)}
//                         >
//                           <option value="">{field?.placeholder || '- اختر -'}</option>
//                           {Object.entries(field?.options).map(([key, value]) => (
//                             <option key={key} value={key} className="bg-neutral-800">
//                               {value}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           type="text"
//                           placeholder={field?.placeholder || 'أدخل القيمة'}
//                           className={`w-full bg-neutral-800/50 border rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none transition-all ${
//                             emptyFields.includes(field?.name)
//                               ? 'border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
//                               : 'border-neutral-700/50 focus-within:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20'
//                           }`}
//                           required
//                           onChange={(e) => handleDetailsChange(field?.name, e.target.value)}
//                         />
//                       )}
//                       {emptyFields.includes(field?.name) && (
//                         <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
//                           <span>•</span> هذا الحقل مطلوب
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
//                 <span>⚠️</span> {error}
//               </div>
//             )}

//             <div className="space-y-6 pt-4 border-t border-neutral-800">
//               <FormTextarea
//                 label="وصف الإعلان"
//                 icon={<MdDescription className="text-orange-500 text-lg sm:text-xl" />}
//                 name="description"
//                 placeholder="اكتب وصفاً تفصيلياً وواضحاً للمنتج أو الخدمة..."
//                 register={register}
//                 errors={emptyFields}
//                 onChange={handleInputChange}
//               />

//               <FormInput
//                 label="رابط الفيديو (يوتيوب أو تيك توك)"
//                 icon={<MdAttachMoney className="text-orange-500 text-lg sm:text-xl" />}
//                 name="link"
//                 placeholder="https://..."
//                 register={register}
//                 errors={emptyFields}
//                 onChange={handleInputChange}
//               />

//               {/* Map Section */}
//               <div className="space-y-1.5">
//                 <label className="block text-sm font-bold text-neutral-300 flex items-center gap-2">
//                   <FaMapLocationDot className="text-orange-500 text-lg" />
//                   تحديد الموقع على الخريطة
//                 </label>
//                 <div className="rounded-2xl overflow-hidden border border-neutral-700/50">
//                   <OnClickMap
//                     chosenCity={formState.city}
//                     chosentown={formState.town}
//                     lat={formState.lat}
//                     lng={formState.lng}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6 border-t border-neutral-800">
//               {/* ملاحظة: إذا كان FormSubmitButton لا يدعم الثيم الداكن داخلياً، يمكنك استبداله بالزر أدناه */}
//               {/* 
//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
//               >
//                 <MdCheckCircle className="text-xl" />
//                 نشر الإعلان
//               </button> 
//               */}
//               <FormSubmitButton />
//             </div>
//           </form>
//         </motion.div>
//       </main>
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import categories from '@/components/Categories/categories';
import UploadingAndDisplayingImage from '@/components/photos/UploadingAndDisplayingImage';
import { inputsContext } from '@/features/auth/inputs-context';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  MdCategory,
  MdTitle,
  MdPhone,
  MdDescription,
  MdAttachMoney,
  MdCheckCircle,
  MdImage,
} from 'react-icons/md';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import FormSubmitButton from './FormSubmitButton';
import { useSession } from 'next-auth/react';
import { FaTreeCity, FaMapLocationDot, FaBoxOpen } from 'react-icons/fa6';
import { PiBuildingsDuotone } from 'react-icons/pi';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const OnClickMap = dynamic(() => import('../../../components/map/onClickMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 flex flex-col items-center justify-center bg-neutral-800/50 rounded-2xl text-white border border-neutral-700 animate-pulse gap-3">
      <FaMapLocationDot className="text-3xl text-orange-500/50" />
      <span className="text-sm font-medium">جاري تحميل الخريطة...</span>
    </div>
  ),
});

export default function NewPost() {
  const [categoryFields, setCategoryFields] = useState([]);
  const { register, handleSubmit } = useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const router = useRouter();
  const { addImages, location, dispatch } = useContext(inputsContext);
  const session = useSession();
  const [error, setError] = useState(null);

  const [formState, setFormState] = useState({
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    userImage: '/placeholder.jpg',
    userName: 'wael',
    title: '',
    categoryId: '',
    categoryName: '',
    images: ['/images/house.png', '/images/house.png', '/images/house.png', '/images/house.png'],
    city: '',
    town: '',
    stockQuantity: 1,
    basePrice: '',
    phoneNumber: '',
    description: '',
    link: '',
    lng: 36.2765,
    lat: 33.5138,
    details: {},
  });

  const handleCategoryChange = (category) => {
    if (category) {
      const selected = categories[category - 1];
      setSelectedCategory(selected);
      setFormState((prev) => ({
        ...prev,
        categoryId: selected?.id || '',
        categoryName: selected?.name || '',
      }));
    } else {
      setSelectedCategory(null);
      setFormState((prev) => ({ ...prev, categoryId: '', categoryName: '' }));
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      import(`../../../components/categoryFields/${selectedCategory?.name}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
          setError(null);
        })
        .catch(() => {
          setCategoryFields([]);
          setError('فشل في تحميل الحقول');
        });
    } else {
      setCategoryFields([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      categoryId: selectedCategory?.id || '',
      categoryName: selectedCategory?.name || '',
      images: addImages.length ? addImages : prev.images,
      lng: location?.[1] !== undefined ? location[1] : prev.lng,
      lat: location?.[0] !== undefined ? location[0] : prev.lat,
    }));
  }, [selectedCategory, location, addImages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) setEmptyFields((prev) => prev.filter((item) => item !== name));
  };

  const handleDetailsChange = (field, value) => {
    setFormState((prev) => ({ ...prev, details: { ...prev.details, [field]: value } }));
    if (value.trim()) setEmptyFields((prev) => prev.filter((item) => item !== field));
  };

  const validateForm = () => {
    const requiredFields = ['userId', 'title', 'categoryId', 'categoryName', 'city', 'town', 'phoneNumber', 'basePrice', 'description'];
    let emptyFieldsList = [];

    const hasEmptyRequiredField = requiredFields.some((field) => {
      if (typeof formState[field] === 'string' && !formState[field].trim()) {
        emptyFieldsList.push(field);
        return true;
      }
      return false;
    });

    if (!hasEmptyRequiredField && selectedCategory && categoryFields) {
      categoryFields.forEach((field) => {
        if (!formState.details[field?.name]?.trim()) emptyFieldsList.push(field?.name);
      });
    }

    setEmptyFields(emptyFieldsList);
    return emptyFieldsList.length === 0;
  };

  const onSubmit = async () => {
    if (!selectedCategory) {
      toast.error('يجب اختيار فئة قبل إرسال النموذج.');
      return;
    }

    const formData = {
      ...formState,
      basePrice: parseInt(formState.basePrice) || 0,
      stockQuantity: parseInt(formState.stockQuantity) || 1,
      lng: formState.lng ? parseFloat(formState.lng) : null,
      lat: formState.lat ? parseFloat(formState.lat) : null,
    };

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('تم إنشاء الإعلان بنجاح', { icon: <MdCheckCircle className="text-emerald-500" /> });
        dispatch({ type: 'ADD_IMAGE', payload: [] });
        router.push('/posts');
      } else {
        toast.error('حدث خطأ ما، حاول مرة أخرى');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ ما، حاول مرة أخرى');
    }
  };

  if (session?.status === 'unauthenticated') {
    // return <LoginButton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden mt-60" dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          {/* Page Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-1.5 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">إنشاء إعلان جديد</h1>
              <p className="text-white mt-1">قم بتعبئة البيانات بدقة لضمان ظهور إعلانك بشكل احترافي</p>
            </div>
          </div>

          {/* 🌟 NEW LAYOUT: Two-Column Asymmetric Grid 🌟 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (validateForm()) onSubmit();
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            
            {/* ================= RIGHT COLUMN: Main Content (8/12) ================= */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 1: Media Upload */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6"
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <MdImage className="text-orange-500 text-xl" /> صور الإعلان
                </h2>
                <div className="bg-neutral-800/30 rounded-2xl p-4 border border-neutral-700/50">
                  <UploadingAndDisplayingImage />
                </div>
              </motion.div>

              {/* Card 2: Core Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 space-y-6"
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MdTitle className="text-orange-500 text-xl" /> المعلومات الأساسية
                </h2>
                
                <FormSelect
                  label="الفئة"
                  icon={<MdCategory className="text-orange-500 text-lg" />}
                  name="category"
                  options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                  register={register}
                  errors={emptyFields}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  placeholder="- اختر الفئة -"
                />

                <FormInput
                  label="عنوان الإعلان"
                  icon={<MdTitle className="text-orange-500 text-lg" />}
                  name="title"
                  placeholder="عنوان جذاب يوضح محتوى الإعلان"
                  register={register}
                  errors={emptyFields}
                  onChange={handleInputChange}
                />

                <FormTextarea
                  label="وصف الإعلان"
                  icon={<MdDescription className="text-orange-500 text-lg" />}
                  name="description"
                  placeholder="اكتب وصفاً تفصيلياً وواضحاً للمنتج أو الخدمة..."
                  register={register}
                  errors={emptyFields}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Card 3: Dynamic Category Fields */}
              {selectedCategory && Array.isArray(categoryFields) && categoryFields.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 space-y-6"
                >
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-amber-500 rounded-full" />
                    تفاصيل إضافية ({selectedCategory.name})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {categoryFields.map((field, index) => (
                      <div key={index} className="space-y-1.5">
                        <label className="block text-sm font-bold text-neutral-300 flex items-center gap-2">
                          {field?.icon} {field?.label}
                        </label>
                        {field?.options ? (
                          <select
                            className={`w-full bg-neutral-800/50 border rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none transition-all appearance-none ${
                              emptyFields.includes(field?.name)
                                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
                                : 'border-neutral-700/50 focus-within:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20'
                            }`}
                            required
                            onChange={(e) => handleDetailsChange(field?.name, e.target.value)}
                          >
                            <option value="">{field?.placeholder || '- اختر -'}</option>
                            {Object.entries(field?.options).map(([key, value]) => (
                              <option key={key} value={key} className="bg-neutral-800">{value}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder={field?.placeholder || 'أدخل القيمة'}
                            className={`w-full bg-neutral-800/50 border rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none transition-all ${
                              emptyFields.includes(field?.name)
                                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
                                : 'border-neutral-700/50 focus-within:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20'
                            }`}
                            required
                            onChange={(e) => handleDetailsChange(field?.name, e.target.value)}
                          />
                        )}
                        {emptyFields.includes(field?.name) && (
                          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <span>•</span> هذا الحقل مطلوب
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Card 4: Video Link */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6"
              >
                <FormInput
                  label="رابط الفيديو (يوتيوب أو تيك توك) - اختياري"
                  icon={<MdDescription className="text-orange-500 text-lg" />}
                  name="link"
                  placeholder="https://..."
                  register={register}
                  errors={emptyFields}
                  onChange={handleInputChange}
                />
              </motion.div>
            </div>

            {/* ================= LEFT COLUMN: Sticky Sidebar (4/12) ================= */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* Sidebar Card 1: Pricing & Stock */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-950 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-xl"
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <MdAttachMoney className="text-amber-500 text-xl" /> التسعير والمخزون
                </h2>
                <div className="space-y-4">
                  <FormInput
                    label="السعر (ل.س)"
                    icon={<MdAttachMoney className="text-amber-500 text-lg" />}
                    name="basePrice"
                    placeholder="0"
                    type="number"
                    register={register}
                    errors={emptyFields}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    label="الكمية المتاحة"
                    icon={<FaBoxOpen className="text-amber-500 text-lg" />}
                    name="stockQuantity"
                    placeholder="1"
                    type="number"
                    register={register}
                    errors={emptyFields}
                    onChange={handleInputChange}
                    value={formState.stockQuantity}
                  />
                </div>
              </motion.div>

              {/* Sidebar Card 2: Location & Map */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-xl"
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <FaMapLocationDot className="text-orange-500 text-xl" /> الموقع الجغرافي
                </h2>
                <div className="space-y-4">
                  <FormInput
                    label="المدينة"
                    icon={<PiBuildingsDuotone className="text-orange-500 text-lg" />}
                    name="city"
                    placeholder="مثال: دمشق"
                    register={register}
                    errors={emptyFields}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    label="المنطقة / الحي"
                    icon={<FaTreeCity className="text-orange-500 text-lg" />}
                    name="town"
                    placeholder="مثال: المزة"
                    register={register}
                    errors={emptyFields}
                    onChange={handleInputChange}
                  />
                  
                  {/* Map Component */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-white mb-2">تحديد دقيق على الخريطة</label>
                    <div className="rounded-2xl overflow-hidden border border-neutral-700/50 shadow-inner">
                      <OnClickMap
                        chosenCity={formState.city}
                        chosentown={formState.town}
                        lat={formState.lat}
                        lng={formState.lng}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar Card 3: Contact Info */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-xl"
              >
                <FormInput
                  label="رقم الهاتف للتواصل"
                  icon={<MdPhone className="text-emerald-500 text-xl" />}
                  name="phoneNumber"
                  placeholder="09xxxxxxxx"
                  type="tel"
                  register={register}
                  errors={emptyFields}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Sidebar Card 4: Action Button */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-xl"
              >
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
                >
                  <MdCheckCircle className="text-2xl" />
                  نشر الإعلان
                </button>
                
                <p className="text-center text-xs text-neutral-300 mt-4">
                  بالضغط على "نشر"، أنت توافق على شروط وأحكام المنصة
                </p>
              </motion.div>

            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}