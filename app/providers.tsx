// app/providers.tsx

"use client"

import { SearchProvider } from "./context/SearchContext"
import { ThemeProvider } from "next-themes"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { usePathname } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/register"
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
      <SearchProvider>
        {!isAuthPage && !isDashboard && <Navbar />}
        <main>{children}</main>
        {!isAuthPage && !isDashboard && <Footer />}
      </SearchProvider>
    </ThemeProvider>
  )
}