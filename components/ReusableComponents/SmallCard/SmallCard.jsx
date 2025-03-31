'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, ArrowRight, MapPin, Tag } from 'lucide-react';

const SmallCard = React.memo(function SmallCard({ item, category }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('item', JSON.stringify(item));
      localStorage.setItem('category', JSON.stringify(category));
    }
    router.push(`/post/${item?.id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const navigateImage = (direction, e) => {
    e.stopPropagation();
    if (direction === 'prev') {
      setCurrentImageIndex((prev) =>
        prev === 0 ? (item.images?.length || 1) - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === (item.images?.length || 1) - 1 ? 0 : prev + 1
      );
    }
  };

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full cursor-pointer bg-white rounded-xl overflow-hidden relative shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Gallery with Navigation */}
      <div className="relative h-48 w-full overflow-hidden">
        <ImageComponent
          imageUrl={item.images?.[currentImageIndex] || item.imageUrl}
          alt={item.title}
        />

        {(item.images?.length || 0) > 1 && (
          <>
            <AnimatePresence>
              {isHovered && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10"
                    onClick={(e) => navigateImage('prev', e)}
                  >
                    <ArrowLeft className="h-4 w-4 text-gray-700" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10"
                    onClick={(e) => navigateImage('next', e)}
                  >
                    <ArrowRight className="h-4 w-4 text-gray-700" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {item.images?.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-primary w-4'
                      : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        <DetailsSection
          title={item.title}
          description={item.description}
          rating={item.rating}
        />

        {/* Additional Fields Component */}
        <div className="flex flex-wrap gap-2">
          {item.location && (
            <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
              <MapPin className="w-3 h-3 mr-1 text-gray-500" />
              {item.location}
            </span>
          )}
          {category?.name && (
            <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
              <Tag className="w-3 h-3 mr-1 text-gray-500" />
              {category.name}
            </span>
          )}
        </div>

        {/* Price and CTA */}
        <motion.div
          className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              {item.basePrice?.toLocaleString()} $
            </span>
            {item.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {item.oldPrice?.toLocaleString()} $
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            عرض التفاصيل
          </motion.button>
        </motion.div>
      </div>

      {/* Favorite Button */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        className="absolute top-3 left-3 bg-white/90 p-2 rounded-full shadow-sm z-10"
        onClick={toggleFavorite}
      >
        <Heart
          className="h-5 w-5 transition-colors"
          fill={isFavorite ? '#ef4444' : 'none'}
          stroke={isFavorite ? '#ef4444' : '#9ca3af'}
        />
      </motion.button>

      {/* Badges */}
      {item.isNew && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          جديد
        </div>
      )}
      {item.discount && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          خصم {item.discount}%
        </div>
      )}
    </motion.div>
  );
});

// Optimized Image Component
const ImageComponent = React.memo(({ imageUrl, alt }) => (
  <motion.img
    src={imageUrl}
    alt={alt}
    className="w-full h-full object-cover"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    loading="lazy"
  />
));

// Enhanced Details Section
const DetailsSection = React.memo(({ title, description, rating }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
    {rating && (
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            filled={i < Math.floor(rating)}
            half={i === Math.floor(rating) && rating % 1 >= 0.5}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      </div>
    )}
  </div>
));

// Star Rating Component
const StarIcon = ({ filled, half }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    {half ? (
      <path d="M10 1l2.5 6.5H19l-5 4.5 1.5 6.5-6-4.5-6 4.5 1.5-6.5-5-4.5h6.5L10 1z" />
    ) : filled ? (
      <path d="M10 1l3 6.5H19l-5 4.5 1.5 6.5-6-4.5-6 4.5 1.5-6.5-5-4.5h6L10 1z" />
    ) : (
      <path d="M10 1l3 6.5H19l-5 4.5 1.5 6.5-6-4.5-6 4.5 1.5-6.5-5-4.5h6L10 1z" />
    )}
  </svg>
);

export default SmallCard;
