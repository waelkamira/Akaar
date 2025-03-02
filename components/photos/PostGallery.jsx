'use client';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import LoadingPhoto from './LoadingPhoto'; // تأكد من استيراد مكون التحميل
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        zIndex: 2,
        width: '30px',
        height: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // لون الخلفية الشفافة
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <MdKeyboardArrowLeft style={{ color: 'white', fontSize: '24px' }} />
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        zIndex: 2,
        width: '30px',
        height: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // لون الخلفية الشفافة
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <MdKeyboardArrowRight style={{ color: 'white', fontSize: '24px' }} />
    </div>
  );
};

const PostGallery = ({ post }) => {
  const path = usePathname();
  // console.log('post ********', post);
  // جمع الصور من الحقول المختلفة في مصفوفة واحدة
  const images = [
    post?.image1,
    post?.image2,
    post?.image3,
    post?.image4,
    post?.image5,
  ].filter((img) => img); // تصفية الحقول الفارغة

  if (images.length === 1) {
    // عرض الصورة الوحيدة مباشرةً دون استخدام السلايدر
    return (
      <div
        className={`relative h-64
          ${
            path.includes('myPosts') || path.includes('favoritePosts')
              ? ''
              : 'sm:h-96'
          }  overflow-hidden ronded-[5px] w-full`}
      >
        <Image
          priority
          src={images[0]}
          layout="fill"
          objectFit="cover"
          alt={`${post.propertyName} - Single Image`}
        />
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: images.length > 1, // إظهار الأسهم فقط إذا كان عدد الصور أكبر من 1
    prevArrow: <CustomPrevArrow />, // استخدام السهم السابق المخصص
    nextArrow: <CustomNextArrow />, // استخدام السهم التالي المخصص
  };

  return (
    <div className="overflow-hidden rounded w-full relative">
      <Link href={'#post1'}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative h-64
          ${
            path.includes('myPosts') || path.includes('favoritePosts')
              ? ''
              : 'sm:h-96'
          }  overflow-hidden ronded-[5px] w-full`}
            >
              <Image
                priority
                src={image}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={`${post.propertyName} - Image ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      </Link>
    </div>
  );
};

export default PostGallery;
