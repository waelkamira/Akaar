// FilterContent.jsx
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  RefreshCw,
  CircleDollarSign,
  Building,
  MapPin,
  Sparkles,
  ChevronDown,
  Home,
  Bed,
  Bath,
  SquareUser,
  Landmark,
  Palmtree,
  Droplets,
  Warehouse,
  Zap,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Slider } from '../../ui/slider';
import { Skeleton } from '../../ui/skeleton';
import CategoriesSelector from '../../Selectors/CategoriesSelector';
const FilterContent = ({
  isMenuOpen,
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
}) => (
  <div className="relative">
    {/* Top gradient border */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

    {/* Bottom gradient border */}
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400"></div>

    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-xl overflow-hidden relative"
    >
      {/* Animated background sparkles */}
      <div className="absolute -z-10 inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200 opacity-20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute -z-5 inset-0 bg-gradient-to-br from-white/80 via-white/90 to-white/80"></div>

      <div className="flex flex-col space-y-6 relative z-10">
        {/* Categories section */}
        <div className="relative">
          <motion.div
            className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200 cursor-pointer"
            onClick={() => toggleSection('categories')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-amber-100">
                <Building className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-800">الفئات</h3>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.categories ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-5 w-5 text-amber-500" />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-lg border border-amber-100 shadow-inner bg-amber-50/50 p-2">
                  <CategoriesSelector />

                  {showArrow && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-center w-full mt-2"
                    >
                      <ArrowUp className="text-amber-500 animate-bounce" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location section */}
        <div className="relative">
          <motion.div
            className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200 cursor-pointer"
            onClick={() => toggleSection('location')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-amber-100">
                <MapPin className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-800">الموقع</h3>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.location ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-5 w-5 text-amber-500" />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {expandedSections.location && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg border border-amber-100 shadow-inner bg-amber-50/50">
                  {/* City selector */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-amber-500" />
                      <label className="text-sm font-medium text-gray-700">
                        المدينة
                      </label>
                    </div>
                    <div className="relative">
                      <select
                        className="w-full p-2 pr-8 rounded-md border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white appearance-none"
                        value={searchData.city || ''}
                        onChange={(e) =>
                          setSearchData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                      >
                        <option value="">اختر المدينة</option>
                        <option value="riyadh">الرياض</option>
                        <option value="jeddah">جدة</option>
                        <option value="dammam">الدمام</option>
                        <option value="mecca">مكة</option>
                        <option value="medina">المدينة</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-amber-500" />
                      </div>
                    </div>
                  </div>

                  {/* District/Town selector */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <Palmtree className="h-4 w-4 text-amber-500" />
                      <label className="text-sm font-medium text-gray-700">
                        الحي
                      </label>
                    </div>
                    <div className="relative">
                      <select
                        className="w-full p-2 pr-8 rounded-md border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white appearance-none"
                        value={searchData.town || ''}
                        onChange={(e) =>
                          setSearchData((prev) => ({
                            ...prev,
                            town: e.target.value,
                          }))
                        }
                      >
                        <option value="">اختر الحي</option>
                        <option value="district1">الحي الأول</option>
                        <option value="district2">الحي الثاني</option>
                        <option value="district3">الحي الثالث</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Property details section */}
        <div className="relative">
          <motion.div
            className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200 cursor-pointer"
            onClick={() => toggleSection('properties')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-amber-100">
                <Home className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-800">تفاصيل العقار</h3>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.properties ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-5 w-5 text-amber-500" />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {expandedSections.properties && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-3 rounded-lg border border-amber-100 shadow-inner bg-amber-50/50">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-[72px] w-full rounded-md" />
                      <Skeleton className="h-[72px] w-full rounded-md" />
                      <Skeleton className="h-[72px] w-full rounded-md" />
                    </div>
                  ) : error ? (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
                      {error}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fields.map((field, index) => {
                        // Choose icon based on field name
                        let FieldIcon = Sparkles;
                        if (field.name === 'bedrooms') FieldIcon = Bed;
                        else if (field.name === 'bathrooms') FieldIcon = Bath;
                        else if (field.name === 'propertyType')
                          FieldIcon = Warehouse;
                        else if (field.name === 'area') FieldIcon = SquareUser;
                        else if (field.name === 'waterSupply')
                          FieldIcon = Droplets;
                        else if (field.name === 'electricity') FieldIcon = Zap;

                        return (
                          <motion.div
                            key={index}
                            className="flex flex-col space-y-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-2">
                              <FieldIcon className="h-4 w-4 text-amber-500" />
                              <label className="text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                            </div>
                            <div className="relative">
                              <select
                                className="w-full p-2 pr-8 rounded-md border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white appearance-none"
                                value={selectedValues[field.name] || ''}
                                onChange={(e) =>
                                  handleChange(field.name, e.target.value)
                                }
                              >
                                <option value="">اختر {field.label}</option>
                                {field.options?.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-amber-500" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price range section */}
        <div className="relative">
          <motion.div
            className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200 cursor-pointer"
            onClick={() => toggleSection('price')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-amber-100">
                <CircleDollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-800">نطاق السعر</h3>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.price ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-5 w-5 text-amber-500" />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {expandedSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-3 rounded-lg border border-amber-100 shadow-inner bg-amber-50/50">
                  <div className="px-3 py-6">
                    <Slider
                      defaultValue={[0, 100000]}
                      max={100000}
                      step={1000}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="my-6"
                    />
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <div className="text-sm font-medium bg-white px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                      <span className="text-gray-600">الحد الأدنى:</span>
                      <span className="text-amber-600 font-bold">
                        {' '}
                        {priceRange[0].toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium bg-white px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                      <span className="text-gray-600">الحد الأعلى:</span>
                      <span className="text-amber-600 font-bold">
                        {' '}
                        {priceRange[1].toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={onReset}
              className="font-medium border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              إعادة ضبط
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={onSearch}
              className="font-medium bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-md"
            >
              {/* <Search className="mr-2 h-4 w-4" /> */}
              بحث
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default FilterContent;
