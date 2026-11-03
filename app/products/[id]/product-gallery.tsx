'use client';

import Image from 'next/image';
import { useState } from 'react';

type GalleryImage = {
  src: string;
  alt: string;
  isPrimary: boolean;
};

export default function ProductGallery({
  productTitle,
  images,
}: {
  productTitle: string;
  images: GalleryImage[];
}) {
  const primaryIndex = images.findIndex((image) => image.isPrimary);
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-ak-raised">
        {selectedImage ? (
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt || productTitle}
            fill
            unoptimized
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ak-muted">الصورة غير متاحة</div>
        )}
      </div>
      {images.length > 1 && (
        <div role="group" aria-label="صور المنتج" className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`عرض الصورة ${index + 1} لـ ${productTitle}`}
              aria-pressed={selectedIndex === index}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-ak-raised ${
                selectedIndex === index ? 'border-ak-amber' : 'border-ak-line'
              }`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                unoptimized
                sizes="25vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
