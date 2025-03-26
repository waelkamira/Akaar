'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import mainButtons from '../lists/mainButtons';
import Link from 'next/link';

export default function FirstNavBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      className="hidden xl:flex xl:flex-col xl:justify-start w-full overflow-hidden z-[1000] shadow-2xl"
    >
      {/* Main Navigation Bar */}
      <div className="flex justify-between items-center w-full px-6 py-4">
        {/* Left Side Buttons */}
        <ul className="flex justify-evenly gap-6 items-center h-16 w-full 2xl:w-[60%]">
          {mainButtons?.map((button) => (
            <Link
              href={button?.path}
              key={button?.title}
              className="relative flex items-center justify-center w-full rounded-full bg-gradient-to-r from-primary via-orange-400 to-primary text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300 ease-in-out h-12 group"
            >
              {/* Floating Icon */}

              <motion.div whileHover={{ rotate: 10 }} className="w-full">
                <span
                  className="size-16 xl:size-14 bg-white/20 backdrop-blur-lg flex items-center justify-center rounded-full shadow-lg border border-white/40"
                  style={{ textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)' }}
                >
                  {button?.emoji}
                </span>
              </motion.div>
              {/* Button Title */}
              <span className="select-none text-nowrap w-full text-center">
                {button?.title}
              </span>
            </Link>
          ))}
        </ul>

        {/* Right Side Logo */}
        <div className="flex items-center justify-center">
          <Link
            href={'/'}
            className="relative flex justify-end w-full min-w-[218px] cursor-pointer"
          >
            <motion.div
              whileHover={{
                scale: 1.08,
                boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.25)',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative h-12 w-56 my-2 hover:scale-[103%] transition-transform duration-300 ease-in-out"
            >
              <Image
                src="/logo.png"
                fill
                objectFit="contain"
                alt="home_photo"
                objectPosition="center"
                className="object-cover"
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
