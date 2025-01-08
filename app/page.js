import SideBar from '../components/SideBar';
import HomePage from '../components/HomePage';

export default function Home() {
  return (
    <div className="relative w-full flex justify-center ">
      <main className="flex items-start justify-center sm:rounded-3xl overflow-hidden z-50 h-fit w-full">
        <SideBar />
        <HomePage />
      </main>
    </div>
  );
}
