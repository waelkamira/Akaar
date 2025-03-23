// Filters.jsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Search, Filter, XIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { cn } from '../../lib/utils';
import FilterContent from './FilterContent';
import MobileFilterMenu from './MobileFilterMenu';

const Filters = ({
  searchData,
  setSearchData,
  onSearch,
  onReset,
  rerender = false,
}) => {
  // State management
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});
  const [showArrow, setShowArrow] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    properties: true,
    price: true,
  });

  // Hooks
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams?.get('category');
  const id = searchParams?.get('id');

  // Handlers
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (name, value) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
    handleDetailsChange(name, value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (setSearchData) {
      setSearchData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDetailsChange = (field, value) => {
    if (setSearchData) {
      setSearchData((prev) => ({
        ...prev,
        details: { ...prev.details, [field]: value },
      }));
    }
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    if (setSearchData) {
      setSearchData((prev) => ({
        ...prev,
        minPrice: value[0],
        maxPrice: value[1],
      }));
    }
  };

  const handleSearch = () => {
    toast('جاري البحث...', {
      description: 'نبحث عن أفضل النتائج لك',
      action: {
        label: 'إلغاء',
        onClick: () => toast.dismiss(),
      },
    });
    if (onSearch) onSearch();
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleReset = () => {
    setSelectedValues({});
    setPriceRange([0, 100000]);
    if (onReset) onReset();
    toast('تم إعادة ضبط البحث', {
      description: 'تم مسح جميع الفلاتر',
    });
  };

  // Effects
  useEffect(() => {
    // When component mounts or category changes
    if (setSearchData) {
      setSearchData((prev) => ({
        ...prev,
        category: id,
        city: searchData?.propertyCity || '',
        town: searchData?.propertyTown || '',
      }));
    }

    // Simulating loading fields based on category
    if (category) {
      setLoading(true);
      setError(null);

      // Simulate async loading of fields
      setTimeout(() => {
        // Mock fields data
        const mockFields = [
          {
            name: 'bedrooms',
            label: 'غرف النوم',
            type: 'select',
            options: [
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3+' },
            ],
          },
          {
            name: 'bathrooms',
            label: 'حمامات',
            type: 'select',
            options: [
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3+' },
            ],
          },
          {
            name: 'propertyType',
            label: 'نوع العقار',
            type: 'select',
            options: [
              { value: 'apartment', label: 'شقة' },
              { value: 'villa', label: 'فيلا' },
              { value: 'house', label: 'بيت' },
            ],
          },
          {
            name: 'area',
            label: 'المساحة',
            type: 'select',
            options: [
              { value: '100', label: 'أقل من 100 م²' },
              { value: '200', label: '100-200 م²' },
              { value: '300', label: 'أكثر من 200 م²' },
            ],
          },
        ];

        setFields(mockFields);
        setLoading(false);
      }, 1000);
    }
  }, [
    category,
    id,
    rerender,
    searchData?.propertyCity,
    searchData?.propertyTown,
    setSearchData,
  ]);

  useEffect(() => {
    // Show arrow for a limited time
    setShowArrow(true);
    const timer = setTimeout(() => {
      setShowArrow(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [rerender]);

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="sticky top-0 z-40 flex justify-between items-center w-full p-4 bg-white shadow-md">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 border-amber-200"
          >
            {isMenuOpen ? <XIcon size={15} /> : <Filter size={15} />}
            <span
              className={cn(
                'text-sm font-medium',
                isMenuOpen ? 'text-red-500' : 'text-amber-600'
              )}
            >
              الفلاتر
            </span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            onClick={handleSearch}
            className="text-amber-600"
          >
            <Search size={18} />
          </Button>
        </motion.div>
      </div>

      {/* Desktop filter toggle */}
      {/* <div className="hidden sm:flex sticky top-0 z-40  justify-between items-center w-full p-4 bg-white shadow-md">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 border-amber-200"
          >
            {isMenuOpen ? <XIcon size={15} /> : <Filter size={15} />}
            <span
              className={cn(
                'text-sm font-medium',
                isMenuOpen ? 'text-red-500' : 'text-amber-600'
              )}
            >
              الفلاتر
            </span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            onClick={handleSearch}
            className="text-amber-600"
          >
            <Search size={18} />
          </Button>
        </motion.div>
      </div> */}
      {/* Desktop View */}
      <div className="hidden sm:block">
        {isMenuOpen && (
          <FilterContent
            isMenuOpen={isMenuOpen}
            searchData={searchData || {}}
            setSearchData={setSearchData}
            onSearch={handleSearch}
            onReset={handleReset}
            rerender={rerender}
            fields={fields}
            loading={loading}
            error={error}
            selectedValues={selectedValues}
            showArrow={showArrow}
            priceRange={priceRange}
            handleChange={handleChange}
            handleInputChange={handleInputChange}
            handleDetailsChange={handleDetailsChange}
            handlePriceChange={handlePriceChange}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden">
        {isMenuOpen && (
          <MobileFilterMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            searchData={searchData || {}}
            setSearchData={setSearchData}
            onSearch={handleSearch}
            onReset={handleReset}
            rerender={rerender}
            fields={fields}
            loading={loading}
            error={error}
            selectedValues={selectedValues}
            showArrow={showArrow}
            priceRange={priceRange}
            handleChange={handleChange}
            handleInputChange={handleInputChange}
            handleDetailsChange={handleDetailsChange}
            handlePriceChange={handlePriceChange}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
      </div>

      {/* Add global styles for glass card effect */}
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 251, 235, 0.5);
          box-shadow: 0 8px 32px rgba(249, 168, 37, 0.1);
        }
      `}</style>
    </>
  );
};

export default Filters;
