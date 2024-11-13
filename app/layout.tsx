
'use client';

import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import "@/styles/globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer'

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

// export const metadata = {
//   title: 'Comparateur de Prix',
//   description: 'Application de comparateur de prix pour Madagascar',
// };

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`} >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
