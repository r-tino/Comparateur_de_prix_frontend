// app/dashboard/vendeur/layout.tsx

"use client";

import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-950 dark:bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 bg-gray-950 dark:bg-gray-100 text-white dark:text-black">
          {children}
        </main>
      </div>
    </div>
  );
}