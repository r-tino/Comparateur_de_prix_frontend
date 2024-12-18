'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, User, Heart, BellRing, ChevronDown, LogOut, Settings, UserIcon, BellIcon, CogIcon, LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SearchBar from './SearchBar';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/ma-selection', label: 'Ma sélection', icon: Heart },
  { href: '/alertes-prix', label: 'Alertes des prix', icon: BellRing },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simule l'état connecté de l'utilisateur
  const [user] = useState({
    name: 'John Doe',
    avatar: '/Logo_Orion.jpg', // Remplacez par l'URL de l'avatar de l'utilisateur
  });

  return (
    <nav className="bg-night-blue shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Image src="/Logo_Orion.jpg" alt="Logo" width={45} height={40} className="rounded-full" style={{ width: 'auto', height: 'auto' }} priority />
          </Link>
          <div className="flex-1 flex justify-center items-center px-2 lg:px-6">
            <div className="max-w-lg w-full lg:max-w-xs">
              <SearchBar />
            </div>
          </div>
          <div className="flex items-center">
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
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-200 hover:bg-gray-100 hover:text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center`}
                    >
                      <item.icon className="h-6 w-6 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="items-center">
            {!isAuthenticated ? (
              // Utilisateur connectéimport

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    src={user.avatar}
                    alt="Avatar"
                    width={30}
                    height={30}
                    className="rounded-full ml-4 cursor-pointer"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/selection" className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-gray-600" />
                      <span>Sélection</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/alerts" className="flex items-center space-x-2">
                      <BellIcon className="h-5 w-5 text-gray-600" />
                      <span>Alerte prix</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="parametres" className="flex items-center space-x-2">
                      <CogIcon className="h-5 w-5 text-gray-600" />
                      <span>Paramètres du compte</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => setIsAuthenticated(false)}
                      className="flex items-center space-x-2 w-full"
                    >
                      <LogOutIcon className="h-5 w-5 text-gray-600" />
                      <span>Déconnexion</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>


            ) : (
              // Utilisateur non connecté
              <Link href="/login" passHref>
                <Button
                  variant="ghost"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-100 hover:text-gray-900"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span>Connexion</span>
                </Button>
              </Link>
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
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer no-underline flex items-center"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
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
  );
}
