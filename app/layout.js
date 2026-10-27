import './globals.css';
import { Rubik } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { InputsContextProvider } from '@/features/auth/inputs-context';
import AuthContextProvider from '@/features/auth/auth-context';
import MainNavBar from '../components/navbars/MainNavbar';
import { SearchProvider } from '@/features/search/search-context';
import { Suspense } from 'react';
import SideBarMenu from '../components/navbars/SideBarMenu';
import { CommerceProvider } from '@/features/cart/commerce-context';
import Footer from '../components/ReusableComponents/Footer';

const rubik = Rubik({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-rubik',
});

export const metadata = {
  title: 'Akaar | سوقك الإلكتروني',
  description: 'اكتشف المنتجات، قارن الخيارات، وتسوق من البائعين على منصة أكار.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Akaar',
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#171512',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" className="!scroll-smooth" dir="rtl">
      <head>
        <meta name="theme-color" content="#171512" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Akaar" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={rubik.className}>
        <Toaster position="top-center" />
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
