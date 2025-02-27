import React from 'react';
import { MdDescription } from 'react-icons/md';

const FormSubmitButton = () => {
  return (
    <button
      type="submit"
      className="btn flex justify-center items-center sm:text-lg text-sm p-2 lg:p-3 my-2 text-one hover:text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover:scale-[101%]"
    >
      <MdDescription className="text-lg sm:text-xl" />
      ارسال
    </button>
  );
};

export default FormSubmitButton;
