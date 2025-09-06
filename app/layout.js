import './globals.css';
import { Inter } from 'next/font/google';
import { Rubik } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { InputsContextProvider } from '../components/authContext/Context';
import AuthContextProvider from '../components/authContext/AuthContext';
import MainNavBar from '../components/navbars/MainNavbar';
import { SearchProvider } from '../contexts/SearchContext';
import Script from 'next/script';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-rubik',
});

export const metadata = {
  title: 'Bayya - Your Online Store',
  description: 'Bayya is your one-stop shop for all your needs',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bayya',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bayya" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content={viewport} />
      </head>
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
        <Script src="/register-sw.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
