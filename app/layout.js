import './globals.css';
import { Rubik } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { InputsContextProvider } from '../components/authContext/Context';
import AuthContextProvider from '../components/authContext/AuthContext';
import MainNavBar from '../components/navbars/MainNavbar';
import { SearchProvider } from '../contexts/SearchContext';
import { Suspense } from 'react';
import SideBarMenu from '../components/navbars/SideBarMenu';
import { CommerceProvider } from '../contexts/CommerceContext';
import Footer from '../components/ReusableComponents/Footer';
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-rubik',
});

export const metadata = {
  title: 'متجر - سوقك الإلكتروني',
  description: 'اكتشف المنتجات وأضفها إلى سلتك بسهولة.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'متجر',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" className="!scroll-smooth" dir="rtl">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="متجر" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={rubik.className}>
        <Toaster />
        <CommerceProvider>
          <AuthContextProvider>
            <InputsContextProvider>
              <Suspense fallback={null}>
                <SearchProvider>
                  <SideBarMenu />
                  <MainNavBar />
                  {children}
                </SearchProvider>
              </Suspense>
              <Footer />
            </InputsContextProvider>
          </AuthContextProvider>
        </CommerceProvider>
      </body>
    </html>
  );
}
