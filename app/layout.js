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
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'rtl:text-right',
            duration: 5000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #eee',
              padding: '16px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'green',
                secondary: 'white',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: 'red',
                secondary: 'white',
              },
            },
          }}
        />
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
