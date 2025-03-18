'use client';
import OnClickMap from '../../../components/map/onClickMap';
import React from 'react';
import { TbFileDescription } from 'react-icons/tb';

const PostForm = ({
  post,
  fields,
  handleFieldChange,
  commonFields,
  categoryFields,
  handleSave,
}) => {
  return (
    <div className="flex flex-col gap-4 mt-8 w-full h-full">
      {/* الحقول الأساسية */}
      {commonFields.map((field, index) => (
        <div key={index} className="flex flex-col gap-2">
          <label className="flex justify-start items-center gap-1 text-gray-700 text-nowrap">
            <span>{field?.icon}</span> {field?.label || field?.name}
          </label>

          <input
            type="text"
            value={field.value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      ))}

      {/* الحقول الفرعية */}
      {categoryFields.map((field, index) => (
        <div key={index} className="flex flex-col gap-2">
          <label className="flex justify-start items-center gap-1 text-gray-700 text-nowrap">
            <span>{field?.icon}</span> {field?.label || field?.name}
          </label>{' '}
          <input
            type="text"
            value={fields.details?.[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      ))}

      {/* وصف الإعلان */}
      <label className="flex justify-start items-center gap-1 text-gray-700 text-nowrap">
        <TbFileDescription className="text-one text-lg sm:text-xl" />
        وصف الإعلان
      </label>
      <textarea
        value={fields.description}
        onChange={(e) => handleFieldChange('description', e.target.value)}
        placeholder="وصف الإعلان"
        className="p-2 border border-gray-300 rounded mb-4 min-h-44"
      />
      {/* الخريطة */}
      <div className="my-4">
        <OnClickMap lat={post?.lat} lng={post?.lng} />
      </div>
      {/* زر الحفظ */}
      <button onClick={handleSave} className="btn text-white p-2 rounded my-4">
        حفظ التعديلات
      </button>
    </div>
  );
};

export default PostForm;
