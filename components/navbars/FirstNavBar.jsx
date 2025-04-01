'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import mainButtons from '../lists/mainButtons';
import Image from 'next/image';

export default function FirstNavBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      className="hidden xl:flex xl:flex-col xl:justify-start w-full overflow-hidden z-[1000] shadow-lg"
    >
      {/* شريط التنقل الرئيسي */}
      <div className="flex justify-between items-center w-full px-4 py-2">
        {/* الأزرار الجانبية */}
        <ul className="flex justify-evenly gap-8 items-center h-20 w-full 2xl:w-[60%]">
          {mainButtons?.map((button) => (
            <li
              key={button?.title}
              className="relative flex justify-center w-full"
            >
              <Link
                href={button?.path}
                className="relative flex items-center justify-center gap-1 w-full text-white font-bold text-lg transition-all duration-300 ease-in-out group hover:scale-105"
              >
                {/* أيقونة الزر */}
                <span className="mb-2 text-primary">{button?.icon}</span>

                {/* نص الزر */}
                <span className="relative text-center">{button?.title}</span>
                {/* خط أسفل الزر - تصميم جديد */}
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-primary group-hover:to-transparent transition-transform duration-500">
                  <motion.span
                    className="absolute inset-0 bg-primary"
                    initial={{ scaleX: 0, originX: 0.5 }}
                    whileHover={{
                      scaleX: 1,
                      opacity: [0, 1, 0],
                      originX: 0.5,
                      transition: {
                        duration: 0.6,
                        ease: [0.43, 0.13, 0.23, 0.96],
                      },
                    }}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* الشعار الجانبي */}
        <div className="flex items-center justify-center">
          <Link href={'/'} className="relative flex justify-end cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative h-16 w-64 my-2"
            >
              <Image
                src="/logo.png"
                alt="luxury_logo"
                fill
                className="object-contain drop-shadow-xl"
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
