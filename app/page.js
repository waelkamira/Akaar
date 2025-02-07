import SideBar from '../components/SideBar';
import MainNavbar from '../components/navbars/MainNavbar';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center overflow-hidden z-50 h-fit w-full bg-white rounded-b">
      <MainNavbar />
      <div className="h-2 w-full bg-one"></div>
    </main>
  );
}
