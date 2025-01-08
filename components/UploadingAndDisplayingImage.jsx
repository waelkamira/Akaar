import { useContext } from 'react';
import Image from 'next/image';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { inputsContext } from './Context';

export default function ImageUploader() {
  const { dispatch, addImages } = useContext(inputsContext);

  const handleFileChange = async (event) => {
    const selectedFiles = event.target.files;

    // منع رفع أكثر من 5 صور
    if (addImages.length + selectedFiles.length > 5) {
      alert('لا يمكن رفع أكثر من 5 صور للبوست الواحد');
      return;
    }

    const newImages = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // رفع الصور إلى Imgur
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/uploadImageToImgur', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          newImages.push(data.data.link); // رابط الصورة على Imgur
        } else {
          console.error('Error uploading image:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    // تحديث الصور في الـ Context
    dispatch({ type: 'ADD_IMAGE', payload: [...addImages, ...newImages] });
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-center mb-4">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer animate-pulse text-white"
        >
          <MdOutlineAddPhotoAlternate className="text-one text-3xl" />
          <h1 className="text-white text-sm sm:text-lg">أضف صورة</h1>
          تستطيع اضافة حتى خمسة صور
        </label>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
      </div>

      <div className="flex flex-col">
        {addImages.length > 0 && (
          <div className="col-span-1 md:col-span-3 relative h-72 sm:h-96 border border-one rounded-lg">
            <Image
              priority
              src={addImages[0]}
              alt="الصورة المرفوعة"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}

        <div className="flex w-full gap-4 my-4">
          {addImages.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative w-full h-48 border border-one rounded-lg"
            >
              <Image
                priority
                src={image}
                alt={`الصورة ${index + 2}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
