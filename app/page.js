import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import MainNavbar from '../components/navbars/MainNavbar';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-white rounded-b">
      <MainNavbar />

      <Footer />

      {/* <div className="hidden lg:block relative w-full h-[300px] lg:h-[400px] border overflow-hidden">
        <Image
          src="https://i.imgur.com/1fGMLUK.png"
          fill
          alt="home_photo"
          className="object-contain object-center w-1/3 h-auto px-14"
          objectPosition="center"
        />
      </div> */}
      <h1
        className="text-one font-bold font-stratos w-full tracking-wider select-none text-center pt-8 pb-4 border uppercase"
        style={{ fontFamily: 'vanguardcf-heavy' }}
      >
        Copyright © 2025 Akar Real Estate. All Rights Reserved
      </h1>
    </main>
  );
}
