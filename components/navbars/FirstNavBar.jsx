'use client';
import Image from 'next/image';
import mainButtons from '../lists/mainButtons';
import Link from 'next/link';
export default function FirstNavBar() {
  return (
    <div
      className={`hidden xl:flex xl:flex-col xl:justify-start w-full overflow-hidden z-[1000] bg-white`}
    >
      <div className="flex justify-between items-center w-full">
        <ul className="flex justify-evenly gap-4 items-center h-16 py-4 w-full 2xl:w-[60%]">
          {mainButtons?.map((button) => (
            <Link
              href={button?.path}
              key={button?.title}
              className="flex items-center justify-center gap-2 border-primary-500 hover:border-t-4 shadow-primary-500 hover:shadow-lg rounded-lg  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-12 transition-all duration-300"
            >
              <span className="text-primary-500 text-2xl">
                {' '}
                {button?.emoji}
              </span>
              <li className=" text-lg select-none">{button?.title}</li>
            </Link>
          ))}
        </ul>
        <div className="flex items-center justify-center">
          <Link
            href={'/'}
            className="relative flex justify-end w-full min-w-[218px] cursor-pointer "
          >
            <div className="relative h-12 w-56 my-2 hover:scale-[103%] z-20 ">
              <Image
                src="/logo.png"
                fill
                objectFit="contain"
                alt="home_photo"
                objectPosition="top"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
