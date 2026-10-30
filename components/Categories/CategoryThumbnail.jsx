import Image from 'next/image';

export default function CategoryThumbnail({
  category,
  className = 'size-12',
  sizes = '96px',
}) {
  if (!category?.enName) return category?.icon || null;

  return (
    <Image
      src={`/images/categories/${category.enName}.png`}
      alt=""
      aria-hidden="true"
      width={96}
      height={96}
      sizes={sizes}
      className={`object-contain ${className}`}
    />
  );
}
