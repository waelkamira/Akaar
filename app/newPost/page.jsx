'use client';
import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import categories from '../../components/Categories/categories';
import UploadingAndDisplayingImage from '../../components/photos/UploadingAndDisplayingImage';
import { inputsContext } from '../../components/authContext/Context';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import LoginButton from '../../components/Buttons/LoginButton';
import {
  MdCategory,
  MdTitle,
  MdLocationCity,
  MdLocationOn,
  MdPhone,
  MdDescription,
  MdAttachMoney,
} from 'react-icons/md';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import FormSubmitButton from './FormSubmitButton';
import OnClickMap from '../../components/map/onClickMap';
import { useSession } from 'next-auth/react';
import { FaTreeCity } from 'react-icons/fa6';
import { PiBuildingsDuotone } from 'react-icons/pi';
export default function NewPost() {
  const [categoryFields, setCategoryFields] = useState([]);
  const { register, handleSubmit } = useForm();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);
  const router = useRouter();
  const { addImages, location, dispatch } = useContext(inputsContext);
  const session = useSession();
  const [error, setError] = useState(null);

  const [formState, setFormState] = useState({
    id: '',
    userId: '',
    title: '',
    categoryId: selectedCategory?.id || '',
    images: addImages || [],
    city: '',
    town: '',
    basePrice: '',
    phoneNumber: '',
    description: '',
    link: '',
    lng: location?.[1] || 36.2765,
    lat: location?.[0] || 33.5138,
    details: {},
  });

  // ✅ جلب الفئة`category`
  const handleCategoryChange = (catagory) => {
    if (catagory) {
      setSelectedCategory(categories[catagory - 1]); // تخزين نص الـ option المحدد
    } else {
      setSelectedCategory(null); // إعادة تعيين الحالة إذا لم يتم اختيار شيء
    }
  };

  // ✅ تحميل الحقول بناءً على الفئة عند تغيير `category`
  useEffect(() => {
    if (selectedCategory) {
      import(`../../components/categoryFields/${selectedCategory?.name}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
          setError('فشل في تحميل الحقول');
        });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('CurrentUser'));
      setFormState((prev) => ({
        ...prev,
        userId: user?.id || '',
        categoryId: selectedCategory?.id || '',
        images: addImages.length ? addImages : prev.images,
        lng: location?.[1] || prev.lng,
        lat: location?.[0] || prev.lat,
      }));
    }
  }, [selectedCategory, location, addImages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // إزالة الحقل من قائمة الحقول الفارغة إذا تم ملؤه
    if (value.trim()) {
      setEmptyFields((prev) => prev.filter((item) => item !== name));
    }
  };

  const handleDetailsChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value,
      },
    }));

    // إزالة الحقل من قائمة الحقول الفارغة إذا تم ملؤه
    if (value.trim()) {
      setEmptyFields((prev) => prev.filter((item) => item !== field));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'userId',
      'title',
      'categoryId',
      'city',
      'town',
      'phoneNumber',
      'basePrice',
      'description',
    ];

    const emptyFieldsList = requiredFields.filter(
      (field) =>
        typeof formState[field] === 'string' && !formState[field].trim()
    );

    // التحقق من الحقول الإضافية
    if (selectedCategory && categoryFields[selectedCategory]) {
      categoryFields[selectedCategory].forEach((field) => {
        if (!formState.details[field?.name]?.trim()) {
          emptyFieldsList.push(field?.name);
        }
      });
    }

    setEmptyFields(emptyFieldsList);
    return emptyFieldsList.length === 0;
  };

  // التحقق من الصور
  const validateImages = () => {
    if (addImages.length === 0) {
      toast.error('يرجى إضافة صورة على الأقل.');
      return false;
    }
    return true;
  };

  // إرسال النموذج
  const onSubmit = async () => {
    if (!validateImages()) {
      return;
    }
    if (!validateForm()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    if (!selectedCategory) {
      toast.error('يجب اختيار فئة قبل إرسال النموذج.');
      return;
    }

    const formData = { ...formState, category: selectedCategory?.id };
    console.log('formData to be sent:', formData);

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Product added successfully:', await response.json());
        toast.success('تم إنشاء الإعلان بنجاح');
        dispatch({ type: 'ADD_IMAGE', payload: [] });
        router.push('/myPosts');
      } else {
        console.error('Failed to add product:', await response.text());
        toast.error('حدث خطأ ما، حاول مرة أخرى');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ ما، حاول مرة أخرى');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-five text-sm sm:text-lg ">
      {session?.status === 'authenticated' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4 p-4 mt-16 border rounded-lg shadow-md w-full xl:w-1/2"
        >
          <UploadingAndDisplayingImage />

          <FormSelect
            label="الفئة"
            icon={<MdCategory className="text-one text-lg sm:text-xl" />}
            name="category"
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name, // النص المعروض في القائمة
            }))}
            register={register}
            errors={emptyFields}
            onChange={(e) => handleCategoryChange(e.target.value)} // تمرير الدالة المعدلة
            placeholder="-اختر-"
          />

          <FormInput
            label="عنوان الإعلان"
            icon={<MdTitle className="text-one text-lg sm:text-xl" />}
            name="title"
            placeholder="ضع عنوان مناسب للإعلان"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />
          <FormInput
            label="المدينة"
            icon={
              <PiBuildingsDuotone className="text-one text-lg sm:text-xl" />
            }
            name="city"
            placeholder="دمشق"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />
          <FormInput
            label="المنطقة"
            icon={<FaTreeCity className="text-one text-lg sm:text-xl" />}
            name="town"
            placeholder="المزة"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          <FormInput
            label="رقم الهاتف"
            icon={<MdPhone className="text-one text-lg sm:text-xl" />}
            name="phoneNumber"
            placeholder="+963 955555555"
            type="number"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          {selectedCategory &&
            categoryFields?.map((field, index) => (
              <div key={index}>
                <label className="font-medium mb-2 flex items-center gap-2">
                  {field?.icon} {field?.label} {/* عرض الاسم العربي */}
                </label>
                {field?.options ? (
                  <select
                    className={`w-full p-1 sm:p-2 lg:p-3 border rounded focus:outline-2 focus:outline-one ${
                      emptyFields.includes(field?.name)
                        ? 'outline-2 outline-red-500'
                        : ''
                    }`}
                    required
                    onChange={
                      (e) => handleDetailsChange(field?.name, e.target.value) // استخدام `name` لحفظ القيمة
                    }
                  >
                    <option value="">{field?.placeholder}</option>
                    {Object.entries(field?.options).map(([key, value]) => (
                      <option key={key} value={key}>
                        {' '}
                        {/* حفظ القيمة باللغة الإنجليزية */}
                        {value} {/* عرض الاسم العربي */}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    placeholder={field?.placeholder}
                    className={`w-full p-1 sm:p-2 lg:p-3 border rounded focus:outline-2 focus:outline-one ${
                      emptyFields.includes(field?.name)
                        ? 'outline-2 outline-red-500'
                        : ''
                    }`}
                    required
                    onChange={
                      (e) => handleDetailsChange(field?.name, e.target.value) // استخدام `name` لحفظ القيمة
                    }
                  />
                )}
                {emptyFields.includes(field?.name) && (
                  <p className="text-red-500 text-sm mt-1">هذا الحقل مطلوب</p>
                )}
              </div>
            ))}

          <FormInput
            label="السعر"
            icon={<MdAttachMoney className="text-one text-lg sm:text-xl" />}
            name="basePrice"
            placeholder="500 $"
            type="number"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          <FormTextarea
            label="وصف الإعلان"
            icon={<MdDescription className="text-one text-lg sm:text-xl" />}
            name="description"
            placeholder="اكتب وصف للشيء الذي تريد بيعه ..."
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          <OnClickMap />
          <FormInput
            label="رابط الفيديو من يوتيوب أو تيك توك"
            icon={<MdAttachMoney className="text-one text-lg sm:text-xl" />}
            name="link"
            placeholder="رابط الفيديو"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          <FormSubmitButton />
        </form>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
