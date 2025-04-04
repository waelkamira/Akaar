'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Home,
  Heart,
  PlusCircle,
  MessageCircle,
  User,
  LogIn,
  MapPin,
  Facebook,
  Linkedin,
  Mail,
  ArrowDown,
  Instagram,
  Twitter,
  Phone,
} from 'lucide-react';

export default function Footer() {
  const session = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/images/image (1).jpg',
    '/images/image (2).jpg',
    '/images/image (3).jpg',
    '/images/image (4).jpg',
    '/images/image (5).jpg',
    '/images/image (6).jpg',
    '/images/image (7).jpg',
    '/images/image (8).jpg',
    '/images/image (9).jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const quickLinks = [
    { name: 'الرئيسية', path: '/', icon: <Home size={16} className="ml-2" /> },
    {
      name: 'المفضلة',
      path: '/favorite',
      icon: <Heart size={16} className="ml-2" />,
    },
    {
      name: 'إنشاء إعلان',
      path: '/newPost',
      icon: <PlusCircle size={16} className="ml-2" />,
    },
    {
      name: 'متجري',
      path: '/myPosts',
      icon: <User size={16} className="ml-2" />,
    },
    {
      name: 'اتصل بنا',
      path: '/contactUs',
      icon: <MessageCircle size={16} className="ml-2" />,
    },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: <Facebook size={16} className="ml-2" />,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: <Linkedin size={16} className="ml-2" />,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: <Instagram size={16} className="ml-2" />,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: <Twitter size={16} className="ml-2" />,
    },
  ];

  const workingHours = [
    { day: 'الاثنين', hours: '09:00 - 18:00' },
    { day: 'الثلاثاء', hours: '09:00 - 18:00' },
    { day: 'الأربعاء', hours: '09:00 - 18:00' },
    { day: 'الخميس', hours: '09:00 - 18:00' },
    { day: 'الجمعة', hours: '09:00 - 18:00' },
    { day: 'السبت', hours: '09:00 - 18:00' },
    { day: 'الأحد', hours: '09:00 - 18:00' },
  ];

  return (
    <footer className="bg-neutral-900 text-white w-full">
      {/* App Download Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 py-12">
        <div className="container-custom mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden mb-8 lg:mb-0"
            >
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentImageIndex] || '/placeholder.svg'}
                  alt={`Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover rounded-xl"
                  priority={currentImageIndex === 0}
                />
              </motion.div>
            </motion.div>

            {/* Download Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2 text-center lg:text-right"
            >
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                حمل تطبيقنا الآن
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto lg:mr-0">
                استمتع بتجربة تصفح أفضل وإشعارات فورية للإعلانات الجديدة. متاح
                الآن للتحميل المباشر.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium"
                >
                  <ArrowDown size={18} />
                  <span>تحميل التطبيق</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container-custom mx-auto">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12">
            {/* Logo and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-0 text-center md:text-right md:w-1/3"
            >
              <Link href="/" className="inline-block mb-4">
                <div className="relative h-16 w-48 hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/logo.png"
                    fill
                    className="object-contain"
                    alt="Matjar Logo"
                  />
                </div>
              </Link>
              <p className="text-neutral-400 max-w-md">
                يتميز موقع عقار بخاصية البحث المتقدمة، مما يسمح للمستخدمين
                بالبحث بسهولة عن العقارات والسيارات. كما يوفر الموقع إمكانية
                التواصل المباشر بين البائعين والمشترين، مما يعزز الثقة ويسهل
                إتمام الصفقات بنجاح.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-0"
            >
              <h3 className="text-xl font-semibold mb-6 text-primary-300">
                روابط سريعة
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.path}
                      className="flex items-center text-neutral-400 hover:text-primary-300 transition-colors duration-200"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
                {session?.status === 'unauthenticated' ? (
                  <li>
                    <Link
                      href="/login"
                      className="flex items-center text-neutral-400 hover:text-primary-300 transition-colors duration-200"
                    >
                      <LogIn size={16} className="ml-2" />
                      <span>تسجيل الدخول</span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center text-neutral-400 hover:text-primary-300 transition-colors duration-200"
                    >
                      <User size={16} className="ml-2" />
                      <span>الملف الشخصي</span>
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary-300">
                معلومات الاتصال
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-neutral-400">
                  <MapPin size={16} className="ml-2 text-primary-300" />
                  <span>سوريا - دمشق</span>
                </li>
                <li className="flex items-center text-neutral-400">
                  <Phone size={16} className="ml-2 text-primary-300" />
                  <span>+963 11 123 4567</span>
                </li>
                <li className="flex items-center text-neutral-400">
                  <Mail size={16} className="ml-2 text-primary-300" />
                  <span>info@Matjar.com</span>
                </li>

                {/* Social Media */}
                <li className="pt-3">
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-primary-500 hover:text-white transition-colors duration-200"
                        aria-label={social.name}
                      >
                        {React.cloneElement(social.icon, {
                          size: 14,
                          className: '',
                        })}
                      </a>
                    ))}
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary-300">
                ساعات العمل
              </h3>
              <ul className="space-y-2">
                {workingHours.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2"
                  >
                    <span className="text-neutral-400">{item.day}</span>
                    <span className="text-primary-300 font-medium">
                      {item.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-neutral-800 text-center">
            <p className="text-neutral-500 text-sm">
              Copyright © {new Date().getFullYear()} Matjar. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
