// app/dashboard/admin/layout.tsx

"use client";

import React, { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart, LineChart, Package, Tag, Percent, Settings, HelpCircle, Bell, FolderTree, MessageSquare, LogOut, Menu } from 'lucide-react';
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UnreadMessagesProvider, useUnreadMessages } from "@/app/context/UnreadMessagesContext";
import { useAuthStore } from '@/store/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { href: "/dashboard/admin", icon: BarChart, label: "Accueil" },
  { href: "/dashboard/admin/produits", icon: Package, label: "Produits" },
  { href: "/dashboard/admin/categories", icon: FolderTree, label: "Catégories" },
  { href: "/dashboard/admin/offres", icon: Tag, label: "Offres" },
  { href: "/dashboard/admin/promotions", icon: Percent, label: "Promotions" },
  { href: "/dashboard/admin/historique-prix", icon: LineChart, label: "Historique des prix" },
  { href: "/dashboard/admin/messages", icon: MessageSquare, label: "Messages" },
];

const AdminSidebar = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useUnreadMessages();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = useAuthStore((state) => state.auth.user);

  const isActive = (path: string) => pathname === path;

  const sidebarVariants = {
    open: { width: "16rem", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: "4rem", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const userInitials = user ? getInitials(user.nom_user) : 'U';

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <motion.div
        className="shadow-lg bg-white/80 backdrop-filter backdrop-blur-lg overflow-hidden z-20"
        variants={sidebarVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        initial="open"
      >
        {/* Logo section */}
        <div className="flex h-16 items-center gap-2 px-4 shadow-sm">
          <motion.div 
            className={`h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out ${isSidebarOpen ? "" : "rotate-180"}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSidebarOpen ? (
              <div className="w-4 h-4 bg-white rounded-sm" />
            ) : (
              <Menu className="text-white" size={20} />
            )}
          </motion.div>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="font-semibold text-gray-800"
            >
              E-Commerce Admin
            </motion.span>
          )}
        </div>

        <nav className="space-y-1 p-3">
          {menuItems.map((item) => (
            <motion.div
              key={item.href}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive(item.href)
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-800"
                }`}
                asChild
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : "mx-auto"}`} />
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {item.label === "Messages" && unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className={`ml-auto text-xs ${isSidebarOpen ? "" : "absolute top-0 right-0"}`}
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </motion.div>
          ))}
        </nav>

        <div className="absolute bottom-4 space-y-1 px-3 w-full">
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive("/dashboard/admin/parametres")
                  ? "bg-indigo-100 text-indigo-800"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-800"
              }`}
              asChild
            >
              <Link href="/dashboard/admin/parametres" className="flex items-center">
                <Settings className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : "mx-auto"}`} />
                {isSidebarOpen && <span>Paramètres</span>}
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive("/dashboard/admin/aide")
                  ? "bg-indigo-100 text-indigo-800"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-800"
              }`}
              asChild
            >
              <Link href="/dashboard/admin/aide" className="flex items-center">
                <HelpCircle className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : "mx-auto"}`} />
                {isSidebarOpen && <span>Centre d&apos;aide</span>}
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 shadow-sm px-6 flex items-center justify-between bg-white/80 backdrop-filter backdrop-blur-lg rounded-bl-3xl z-10">
          <div className="flex items-center">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Bienvenue, {user?.nom_user || 'Utilisateur'}
            </motion.h1>
          </div>
          {/* Right section */}
          <div className="flex items-center gap-6">
            {/* Notification bell */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* User profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.nom_user || 'Utilisateur'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'utilisateur@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-tl-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <UnreadMessagesProvider>
      <AdminSidebar>{children}</AdminSidebar>
    </UnreadMessagesProvider>
  );
}

