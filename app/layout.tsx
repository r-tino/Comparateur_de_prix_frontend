// app/layout.tsx

'use client';

import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import "@/styles/globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation'; // Importez usePathname
import { SearchProvider } from './context/SearchContext'; // Importer le SearchProvider
import { ThemeProvider } from 'next-themes'; // Importer ThemeProvider

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

  // Vérifiez si vous êtes sur une page de connexion/inscription ou dans le dashboard
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isDashboard = pathname.startsWith('/dashboard'); // Vérifiez si la route commence par '/dashboard'

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
          <SearchProvider>
            {/* N'affichez pas le Navbar et Footer sur les pages de connexion/inscription ou dans le dashboard */}
            {!isAuthPage && !isDashboard && <Navbar />}
            <main>{children}</main>
            {!isAuthPage && !isDashboard && <Footer />}
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
