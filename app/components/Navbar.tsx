// app/components/Navbar.tsx

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, User, Heart, Bell, Cog, LogOut, Home, ShoppingBag, Gift, Percent, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '../../store/store.js';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/products', label: 'Produits', icon: ShoppingBag },
  { href: '/offre', label: 'Offre', icon: Gift },
  { href: '/promotion', label: 'Promotion', icon: Percent },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.auth.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const user = useAuthStore((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleDashboardNavigation = () => {
    if (user?.role === 'Vendeur') {
      router.push('/dashboard/vendeur');
    } else if (user?.role === 'Admin') {
      router.push('/dashboard/admin');
    }
  };

  const userAvatar = user?.photoProfil
    ? user.photoProfil.startsWith('http')
      ? user.photoProfil
      : `/${user.photoProfil}`
    : null;

  return (
    <nav className="bg-white/10 backdrop-filter backdrop-blur-lg bg-opacity-30 border-b border-gray-200 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out hover:bg-white/20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center flex-shrink-0 mr-20"
          >
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/Logo_Orion.jpg" alt="Logo" width={50} height={50} className="rounded-full mb-1" priority style={{ width: 'auto', height: 'auto' }}/>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="ml-3 text-xl font-semibold text-gray-800"
              >
                Orion Sarl
              </motion.span>
            </Link>
          </motion.div>
          <div className="hidden md:flex flex-grow justify-center">
            <div className="flex items-baseline space-x-8">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`px-4 py-3 rounded-md text-base font-medium transition-all duration-200 flex items-center ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800 hover:shadow-md'
                      }`}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                      </motion.div>
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white/10 backdrop-filter backdrop-blur-lg rounded-full px-3 py-2 transition-all duration-200 ease-in-out hover:bg-white/20"
                  >
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="rounded-full mb-1"
                        priority
                        style={{ width: 'auto', height: 'auto' }} 
                      />
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full text-white">
                        {user?.nom_user.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 py-2 bg-white/80 backdrop-filter backdrop-blur-lg rounded-md shadow-lg">
                  {(user?.role === 'Vendeur' || user?.role === 'Admin') && (
                    <DropdownMenuItem asChild>
                      <button
                        onClick={handleDashboardNavigation}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition-colors duration-200"
                      >
                        <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Tableau de bord
                      </button>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/selection" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition-colors duration-200">
                      <Heart className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Sélection
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/alerts" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition-colors duration-200">
                      <Bell className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Alerte prix
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/parametres" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition-colors duration-200">
                      <Cog className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Paramètres du compte
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition-colors duration-200"
                    >
                      <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Déconnexion
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login" passHref>
                  <Button
                    variant="outline"
                    size="lg"
                    className="ml-4 bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 font-semibold rounded-full px-6 shadow-md hover:shadow-lg"
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span>Connexion</span>
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 ease-in-out"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </motion.button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/80 backdrop-filter backdrop-blur-lg">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <item.icon className="inline-block h-5 w-5 mr-2" />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      {userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt="Avatar"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full text-white">
                          {user?.nom_user.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user?.nom_user}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {(user?.role === 'Vendeur' || user?.role === 'Admin') && (
                      <button
                        onClick={handleDashboardNavigation}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      >
                        Tableau de bord
                      </button>
                    )}
                    <Link
                      href="/selection"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Sélection
                    </Link>
                    <Link
                      href="/alerts"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Alerte prix
                    </Link>
                    <Link
                      href="/parametres"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Paramètres du compte
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}