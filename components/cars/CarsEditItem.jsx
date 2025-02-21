'use client';
import React from 'react';
import { MdEdit } from 'react-icons/md';

export default function CarsEditItem({
  inputs,
  setInputs,
  title,
  property, // القيمة المتغيرة للخاصية
  handleEditPost,
  editedPost,
  postId,
}) {
  // دالة لتحديث القيمة
  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputs({
      ...inputs,
      [property]: newValue, // تحديث القيمة حتى إذا كانت فارغة
    });
  };

  return (
    <div className="flex flex-col justify-start items-start gap-1 sm:gap-4">
      <div className=" flex justify-between items-center my-2 lg:my-4 h-10 sm:h-16 w-full overflow-visible">
        <h1 className="  text-lg lg:text-xl xl:text-2xl w-full my-2 select-none">
          <span className="text-one text-xl lg:text-2xl mx-2 select-none">
            #
          </span>
          {title}
        </h1>
      </div>
      <div className="relative w-full">
        <input
          type={
            ['distance', 'price', 'year'].includes(property) ? 'number' : 'text'
          }
          //🚨 المشكلة: بسبب ||، تم اعتبار "" قيمة غير صالحة، لذلك أعاد editedPost?.property.
          //الضبط! عند استخدام ||، فإنه يتحقق من أي قيمة "falsy" (null, undefined, '', 0, false, NaN) ويستبدلها بالقيمة الافتراضية، مما قد يؤدي إلى استبدال القيم الفارغة ("") أو الأصفار (0) بالقيمة القديمة بشكل غير مرغوب فيه.

          //بينما ?? (Nullish Coalescing Operator) يتحقق فقط من null و undefined، مما يعني أنه إذا كانت القيمة موجودة ولكنها فارغة ("") أو صفر (0)، فستظل كما هي ولن يتم استبدالها بالقيمة القديمة.

          value={inputs?.[property] ?? editedPost?.[property] ?? ''} // استخدام القيمة الحالية أو القديمة أو فارغة
          onChange={handleChange}
          className="grow p-2 text-lg lg:text-xl text-start select-none h-12 border rounded-[5px] w-full focus:outline-one"
        />
        <MdEdit className="absolute -top-4 right-0 text-2xl text-one " />
      </div>

      <button
        onClick={() => handleEditPost(postId)}
        className="bg-gray-600 mb-2 w-full mt-4 sm:w-fit text-white duration-300 transition-colors ease-in-out hover:bg-one hover:scale-105 border rounded-[5px] text-center select-none p-2"
      >
        حفظ التعديلات
      </button>
    </div>
  );
}
