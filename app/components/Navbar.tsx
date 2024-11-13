// app/components/Navbar.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname  } from 'next/navigation'
import Image from 'next/image'
import { Search, Bell, Menu, LogOut, User, Settings, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import router from 'next/router'

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/produits', label: 'Produits' },
  { href: '/offres', label: 'Offres' },
  { href: '/categories', label: 'Catégories' },
  { href: '/historique-prix', label: 'Historique des Prix' },
]

export default function Navbar() {
  const [isLoggedIn] = useState(true) // Placeholder pour l'état de connexion
  const [searchQuery, setSearchQuery] = useState('') // État pour la recherche
  const pathname  = usePathname ()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle search logic here
  }

  return (
    <nav className="bg-night-blue shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image src="/Logo_Orion.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
            </Link>
            <div className="hidden md:block ml-10">
            <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white' // Couleur vive pour le lien actif
                          : 'text-gray-200 hover:bg-gray-100 hover:text-gray-900' // Couleurs claires pour liens inactifs
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`} 
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center px-2 lg:px-6">
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch} className="relative w-full max-w-lg lg:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Rechercher un produit"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 font-semibold text-gray-800 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </form>
            </div>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-4 flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="flex justify-center items-center">Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Facturation</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.push('/login')} className="ml-4">
                Se connecter
              </Button>
            )}
          </div>
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="mt-5 px-2 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer no-underline"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
