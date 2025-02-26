'use client';
import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import categories from '../../components/Categories/categories';
import UploadingAndDisplayingImage from '../../components/photos/UploadingAndDisplayingImage';
import { inputsContext } from '../../components/Context';
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
import categoryFields from '../../components/Categories/categoryFields';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import FormSubmitButton from './FormSubmitButton';
import OnClickMap from '../../components/map/onClickMap';
import { useSession } from 'next-auth/react';

export default function DynamicForm() {
  const { register, handleSubmit } = useForm();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);
  const router = useRouter();
  const { data, addImages, location } = useContext(inputsContext);
  const session = useSession();
  const [formState, setFormState] = useState({
    id: uuidv4(),
    userId: '',
    title: '',
    category: selectedCategory || '',
    images: addImages || [],
    adCategory: '',
    city: data?.propertyCity || '',
    town: data?.propertyTown || '',
    basePrice: '',
    phoneNumber: '',
    description: '',
    link: '',
    lng: location?.[1] || 36.2765,
    lat: location?.[0] || 33.5138,
    details: {},
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('CurrentUser'));
    setFormState((prev) => ({
      ...prev,
      userId: user?.id || '',
      category: selectedCategory || prev.category,
      images: addImages.length ? addImages : prev.images,
      city: data?.propertyCity || prev.city,
      town: data?.propertyTown || prev.town,
      lng: location?.[1] || prev.lng,
      lat: location?.[0] || prev.lat,
    }));
  }, [selectedCategory, data, location, addImages]);

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
      'category',
      'adCategory',
      'city',
      'town',
      'phoneNumber',
      'basePrice',
      'description',
    ];

    const emptyFieldsList = requiredFields.filter(
      (field) => !formState[field]?.trim()
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

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    if (!selectedCategory) {
      toast.error('يجب اختيار فئة قبل إرسال النموذج.');
      return;
    }

    const formData = { ...formState, category: selectedCategory };
    console.log('Form Data to be sent:', formData);

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Product added successfully:', await response.json());
        toast.success('تم إنشاء الإعلان بنجاح');
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
    <div className="flex justify-center items-center w-full bg-five text-sm sm:text-lg">
      {session?.user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4 p-4 border rounded-lg shadow-md w-full xl:w-1/2"
        >
          <UploadingAndDisplayingImage />

          <FormSelect
            label="الفئة"
            icon={<MdCategory className="text-one text-lg sm:text-xl" />}
            name="category"
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            register={register}
            errors={emptyFields}
            onChange={(e) => setSelectedCategory(e.target.value)}
            placeholder="-اختر-"
          />

          <FormInput
            label="عنوان الإعلان"
            icon={<MdTitle className="text-one text-lg sm:text-xl" />}
            name="title"
            placeholder="عنوان الإعلان"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          <FormSelect
            label="نوع الإعلان"
            icon={<MdCategory className="text-one text-lg sm:text-xl" />}
            name="adCategory"
            options={[
              { value: 'بيع', label: 'بيع' },
              { value: 'أجار', label: 'أجار' },
            ]}
            register={register}
            errors={emptyFields}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, adCategory: e.target.value }))
            }
            placeholder="-اختر-"
          />

          <FormInput
            label="المدينة"
            icon={<MdLocationCity className="text-one text-lg sm:text-xl" />}
            name="city"
            placeholder="المدينة"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          <FormInput
            label="المنطقة"
            icon={<MdLocationOn className="text-one text-lg sm:text-xl" />}
            name="town"
            placeholder="المنطقة"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          <FormInput
            label="رقم الهاتف"
            icon={<MdPhone className="text-one text-lg sm:text-xl" />}
            name="phoneNumber"
            placeholder="رقم الهاتف"
            type="number"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          {selectedCategory &&
            categoryFields[selectedCategory]?.map((field, index) => (
              <div key={index}>
                <label className="font-medium mb-2 flex items-center gap-2">
                  {field?.icon} {field?.name}
                </label>
                {field?.options ? (
                  <select
                    className={`w-full p-1 sm:p-2 lg:p-3 border rounded focus:outline-2 focus:outline-one ${
                      emptyFields.includes(field?.name)
                        ? 'outline-2 outline-red-500'
                        : ''
                    }`}
                    required
                    onChange={(e) =>
                      handleDetailsChange(field?.name, e.target.value)
                    }
                  >
                    <option value="">{field?.placeholder}</option>
                    {Object.entries(field?.options).map(([key, value]) => (
                      <option key={value} value={value}>
                        {value}
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
                    onChange={(e) =>
                      handleDetailsChange(field?.name, e.target.value)
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
            placeholder="السعر"
            type="number"
            register={register}
            errors={emptyFields}
            onChange={handleInputChange}
          />

          <FormTextarea
            label="وصف الإعلان"
            icon={<MdDescription className="text-one text-lg sm:text-xl" />}
            name="description"
            placeholder="وصف الإعلان"
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
