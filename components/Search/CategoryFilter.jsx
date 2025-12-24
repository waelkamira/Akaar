// 'use client';

// import { useSearch } from '../../contexts/SearchContext';
// import { useEffect } from 'react';
// import categories from '../Categories/categories';
// import { ChevronLeft } from 'lucide-react';

// export default function CategoryFilter() {
//   const { category, setCategory } = useSearch();

//   // Handle category selection
//   const handleCategoryChange = (selectedCategory) => {
//     // If clicking the already selected category, deselect it
//     if (category && selectedCategory && category.id === selectedCategory?.id) {
//       setCategory(null);
//       localStorage.removeItem('category');
//     } else {
//       // Update category in context with the full category object
//       setCategory(selectedCategory);

//       // Save to localStorage for persistence
//       if (selectedCategory) {
//         localStorage.setItem('category', JSON.stringify(selectedCategory));
//       } else {
//         localStorage.removeItem('category');
//       }
//     }
//     // Remove automatic search trigger
//     // performSearch();
//   };

//   // Load category from localStorage on mount
//   useEffect(() => {
//     const storedCategory = localStorage.getItem('category');
//     if (storedCategory && !category) {
//       try {
//         const parsedCategory = JSON.parse(storedCategory);
//         setCategory(parsedCategory);
//       } catch (error) {
//         console.error('Error parsing stored category:', error);
//         localStorage.removeItem('category');
//       }
//     }
//   }, [category, setCategory]);

//   // The selected category is directly from the context
//   const selectedCategory = category;

//   return (
//     <div className="bg-white p-2 rounded-lg shadow-sm mb-4 text-lg">
//       <h2 className="font-medium mb-3">اختر فئة</h2>

//       <div className="space-y-2">
//         {/* Always show the "All Categories" option */}
//         <div className="flex items-center">
//           <input
//             id="category-all"
//             type="checkbox"
//             checked={!category}
//             onChange={() => handleCategoryChange(null)}
//             className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
//           />
//           <label htmlFor="category-all" className="mr-2">
//             كل الفئات
//           </label>
//         </div>

//         {/* Show only the selected category if one is selected */}
//         {selectedCategory ? (
//           <div className="flex items-center">
//             <input
//               id={`category-${selectedCategory?.id}`}
//               type="checkbox"
//               checked={true}
//               onChange={() => {}} // No need to handle change here
//               className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 border"
//             />
//             <label
//               htmlFor={`category-${selectedCategory?.id}`}
//               className="mr-2 flex items-center"
//             >
//               <span className="mr-1">{selectedCategory?.icon}</span>
//               {selectedCategory?.name}
//             </label>
//           </div>
//         ) : (
//           // If no category is selected, show all categories
//           categories?.map((cat) => (
//             <div
//               key={cat?.id}
//               className="flex items-center p-2 hover:scale-105 border border-gray-100 hover:shadow-md hover:border-green-400 rounded-lg m-2 transition-all ease-in-out duration-300 hover:cursor-pointer"
//               onClick={() => handleCategoryChange(cat)}
//             >
//               <input
//                 id={`category-${cat?.id}`}
//                 type="checkbox"
//                 checked={category && category.id === cat?.id}
//                 onChange={() => handleCategoryChange(cat)}
//                 className="h-4 w-4 text-primary-500 focus:ring-primary-500 hover:cursor-pointer"
//               />
//               <label
//                 htmlFor={`category-${cat?.id}`}
//                 className="mr-2 flex items-center text-sm"
//               >
//                 <span className="mx-1 text-primary-400">{cat?.icon}</span>
//                 {cat?.name}
//               </label>
//             </div>
//           ))
//         )}

//         {/* If a category is selected, show a button to view all categories */}
//         {selectedCategory && (
//           <button
//             onClick={() => handleCategoryChange(null)}
//             className="text-primary-500 hover:text-blue-800 flex items-center mt-2"
//           >
//             <ChevronLeft size={16} className="mr-1" />
//             عرض جميع الفئات
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useSearch } from '../../contexts/SearchContext';
import { useEffect } from 'react';
import categories from '../Categories/categories';
import { ChevronLeft, Check, SlidersHorizontalIcon } from 'lucide-react';

export default function CategoryFilter() {
  const { category, setCategory } = useSearch();

  // Handle category selection
  const handleCategoryChange = (selectedCategory) => {
    if (category && selectedCategory && category.id === selectedCategory?.id) {
      setCategory(null);
      localStorage.removeItem('category');
    } else {
      setCategory(selectedCategory);
      if (selectedCategory) {
        localStorage.setItem('category', JSON.stringify(selectedCategory));
      } else {
        localStorage.removeItem('category');
      }
    }
  };

  // Load category from localStorage on mount
  useEffect(() => {
    const storedCategory = localStorage.getItem('category');
    if (storedCategory && !category) {
      try {
        const parsedCategory = JSON.parse(storedCategory);
        setCategory(parsedCategory);
      } catch (error) {
        console.error('Error parsing stored category:', error);
        localStorage.removeItem('category');
      }
    }
  }, [category, setCategory]);

  const selectedCategory = category;

  return (
    <div className="bg-white p-2 rounded-lg mb-6">
      <div className="flex justify-start items-center gap-2 mb-6 w-full">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
          <SlidersHorizontalIcon className="size-5 text-white" />
        </div>
        <h2 className="font-bold text-xl text-gray-800 text-right">اختر فئة</h2>
      </div>

      <div className="space-y-3">
        {/* All Categories Option */}
        <div
          className={`flex justify-center items-center gap-2 p-2 rounded-lg transition-all duration-300 cursor-pointer border-2 ${
            !category
              ? 'bg-green-50 border-green-500 shadow-md'
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
          onClick={() => handleCategoryChange(null)}
        >
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 transition-all duration-300 ${
              !category
                ? 'bg-green-500 border-green-500 gap-2'
                : 'bg-white border-gray-400 gap-2'
            }`}
          >
            {!category && <Check size={14} className="text-white" />}
          </div>
          <span
            className={`font-medium transition-colors duration-300 ${
              !category ? 'text-green-700' : 'text-gray-700'
            }`}
          >
            كل الفئات
          </span>
        </div>

        {/* Categories List */}
        {selectedCategory ? (
          // Selected Category View
          <div className="flex items-center p-4 rounded-lg bg-green-50 border-2 border-green-500 shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 border-2 border-green-500 mr-3">
              <Check size={14} className="text-white" />
            </div>
            <label className="flex items-center font-medium text-green-700">
              <span className="mx-2 text-green-600">
                {selectedCategory?.icon}
              </span>
              {selectedCategory?.name}
            </label>
          </div>
        ) : (
          // All Categories View
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories?.map((cat) => (
              <div
                key={cat?.id}
                className={`flex items-center justify-center p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer group hover:shadow-md ${
                  category && category.id === cat?.id
                    ? 'bg-green-50 border-green-500 shadow-md scale-[1.02]'
                    : 'bg-gray-50 border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handleCategoryChange(cat)}
              >
                {/* <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 transition-all duration-300 ${
                    category && category.id === cat?.id
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-400 group-hover:border-green-400'
                  }`}
                >
                  {category && category.id === cat?.id && (
                    <Check size={14} className="text-white" />
                  )}
                </div> */}
                <div className="flex items-center flex-1">
                  <span
                    className={`mx-2 transition-colors duration-300 ${
                      category && category.id === cat?.id
                        ? 'text-green-600'
                        : 'text-gray-500 group-hover:text-green-600'
                    }`}
                  >
                    {cat?.icon}
                  </span>
                  <span
                    className={`font-medium transition-colors duration-300 ${
                      category && category.id === cat?.id
                        ? 'text-green-700'
                        : 'text-gray-700 group-hover:text-green-700'
                    }`}
                  >
                    {cat?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to All Categories Button */}
        {selectedCategory && (
          <button
            onClick={() => handleCategoryChange(null)}
            className="flex items-center justify-center w-full p-3 mt-4 text-green-600 hover:text-green-700 font-medium bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 border border-green-200 hover:border-green-300"
          >
            <ChevronLeft size={18} className="ml-1" />
            عرض جميع الفئات
          </button>
        )}
      </div>

      {/* Selected Category Indicator */}
      {selectedCategory && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center text-green-700 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
            <span>
              الفئة المحددة: <strong>{selectedCategory?.name}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
