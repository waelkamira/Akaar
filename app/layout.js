import './globals.css';
import { Rubik } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { InputsContextProvider } from '../components/authContext/Context';
import AuthContextProvider from '../components/authContext/AuthContext';
import MainNavBar from '../components/navbars/MainNavBar';
import { SearchProvider } from '../contexts/SearchContext';
import Script from 'next/script';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-rubik',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth" dir="rtl">
      <body className={rubik.className}>
        <Toaster />
        <AuthContextProvider>
          <InputsContextProvider>
            <SearchProvider>
              <MainNavBar />
              {children}
            </SearchProvider>
          </InputsContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
