import React from 'react';
import { MdEdit } from 'react-icons/md';

export default function EditItem({
  inputs,
  setInputs,
  title,
  property, // القيمة المتغيرة للخاصية
  handleEditPost,
  editedPost,
}) {
  return (
    <div className="flex flex-col justify-start items-start gap-1 sm:gap-4 text-black">
      <div className=" flex justify-between items-center my-2 lg:my-4 h-10 sm:h-16 w-full overflow-visible">
        <h1 className="  text-lg lg:text-xl xl:text-2xl w-full my-2 select-none">
          <span className="text-one text-xl lg:text-2xl mx-2 select-none">
            #
          </span>
          {title}
        </h1>
      </div>
      <h1
        className="relative grow p-2 text-lg lg:text-xl text-start select-none h-12 border rounded-md w-full focus:outline-one"
        autoFocus="true"
        contentEditable="true"
        onInput={(e) =>
          setInputs({
            ...inputs,
            [property]: e.currentTarget.textContent,
          })
        }
      >
        {inputs?.[property] || editedPost?.[property]}{' '}
        {/* //? هذا السبان لابقاء الفوكس */}
        <span
          contentEditable="false"
          className={
            inputs?.[property] && editedPost?.[property] ? 'hidden' : ''
          }
        >
          &#13;&#10;
        </span>
        <MdEdit className="absolute -top-4 right-0 text-2xl text-one" />
      </h1>

      <button
        onClick={() => handleEditPost()}
        className="bg-nine mb-2 w-full mt-4 sm:w-fit text-white duration-300 transition-colors ease-in-out hover:bg-one hover:scale-105 border rounded-md text-center select-none p-2"
      >
        حفظ التعديلات
      </button>
    </div>
  );
}
