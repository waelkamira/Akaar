import './globals.css';
import { Inter } from 'next/font/google';
import { Rubik } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { InputsContextProvider } from '../components/Context';
import AuthContextProvider from '../components/authContext/AuthContext';
import Navbar from '../components/navbar';

const inter = Inter({ subsets: ['latin'] });
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
});

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth" dir="rtl">
      <body className={rubik.className}>
        <Toaster />
        <AuthContextProvider>
          <Navbar />
          <InputsContextProvider>{children}</InputsContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
