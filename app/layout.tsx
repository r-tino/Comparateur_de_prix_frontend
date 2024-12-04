// app/layout.tsx

'use client';

import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import "@/styles/globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation'; // Importez usePathname
import { SearchProvider } from './context/SearchContext'; // Importer le SearchProvider

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Utilisez usePathname pour obtenir l'URL actuelle

  // Vérifiez si vous êtes sur la page de connexion ou d'inscription
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SearchProvider>
          {!isAuthPage && <Navbar />} {/* N'affichez pas la Navbar sur les pages de connexion/inscription */}
          <main>{children}</main>
          {!isAuthPage && <Footer />} {/* N'affichez pas le Footer sur les pages de connexion/inscription */}
        </SearchProvider>
      </body>
    </html>
  );
}
