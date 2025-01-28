import React from 'react';
import BackButton from './BackButton';

export default function MiddleBarAndPhoto() {
  return (
    <div className="relative flex justify-between items-center w-full gap-2 my-2 bg-one p-1 md:p-2 rounded-[5px]">
      <div>
        <TfiMenuAlt
          className="text-[30px] lg:text-5xl text-white cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <div className="absolute top-14 lg:top-20 right-0 z-50">
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
        </div>
      </div>
      <button
        onClick={() => setIsShow(!isShow)}
        className="relative text-sm lg:text-xl bg-white h-8 lg:h-11 w-3/4 border-r-[30%] shadow-lg border-one z-40 rounded-[5px] hover:scale-[101%]"
      >
        فلاتر البحث{' '}
        <span className="absolute left-3/4 top-1/4 mx-auto my-auto">
          {isShow ? (
            <LuArrowDownNarrowWide className="text-one sm:text-sm lg:text-xl" />
          ) : (
            <LuArrowUpNarrowWide className="text-one sm:text-sm lg:text-xl" />
          )}
        </span>
      </button>
      <BackButton />
    </div>
  );
}
