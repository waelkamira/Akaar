'use client';
import Image from 'next/image';
import mainButtons from '../lists/mainButtons';
import Link from 'next/link';
export default function FirstNavBar() {
  return (
    <div
      className={`hidden xl:flex xl:flex-col xl:justify-start w-full overflow-hidden bg-two text-white border-b-[10px] border-one px-4`}
    >
      <div className="flex justify-between items-center w-full">
        <ul className="flex justify-evenly gap-4 items-center h-20 py-4 w-[60%]">
          {mainButtons?.map((button) => (
            <Link
              href={button?.path}
              key={button?.title}
              className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            >
              <span className="text-one"> {button?.emoji}</span>
              <li className=" text-xl select-none">{button?.title}</li>
            </Link>
          ))}
        </ul>
        <div className="flex items-center justify-center">
          <Link
            href={'/'}
            className="relative flex justify-end w-fit min-w-[218px] cursor-pointer "
          >
            <div className="relative h-16 w-56 my-2 hover:scale-[103%] z-20">
              <Image
                src="https://i.imgur.com/0oHqzqF.png"
                fill
                objectFit="contain"
                alt="home_photo"
                objectPosition="top"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-radial from-white/30 via-transparent to-two z-10"></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
