// MobileFilterMenu.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Search, XIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import FilterContent from './FilterContent';

const MobileFilterMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  searchData,
  setSearchData,
  onSearch,
  onReset,
  rerender,
  fields,
  loading,
  error,
  selectedValues,
  showArrow,
  priceRange,
  handleChange,
  handleInputChange,
  handleDetailsChange,
  handlePriceChange,
  expandedSections,
  toggleSection,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-0 bg-white z-40 sm:hidden overflow-y-auto p-4 pt-16"
      >
        <FilterContent
          searchData={searchData || {}}
          setSearchData={setSearchData}
          onSearch={onSearch}
          onReset={onReset}
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

        <div className="fixed bottom-4 left-4 right-4 flex gap-2">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => {
                onSearch();
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white py-2 rounded-md flex items-center justify-center gap-2 shadow-lg"
            >
              <Search size={18} />
              <span>بحث</span>
            </Button>
          </motion.div>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={() => setIsMenuOpen(false)}
              className="w-full border-amber-300 text-amber-700 py-2 rounded-md flex items-center justify-center gap-2"
            >
              <XIcon size={18} />
              <span>إغلاق</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileFilterMenu;
