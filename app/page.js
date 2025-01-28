import SideBar from '../components/SideBar';
import HomePage from '../components/HomePage';
import Navbar from '../components/navbar';
export default function Home() {
  return (
    <div className="relative w-full flex justify-center">
      <main className="flex flex-col items-start justify-center overflow-hidden z-50 h-fit w-full bg-four rounded-b-[5px]">
        {/* <Navbar /> */}
        <HomePage />
      </main>
    </div>
  );
}
