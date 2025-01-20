/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/vendeur/components/Header.tsx

import { BellIcon, Moon, Sun, 
  //Search 
  } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { useTheme } from 'next-themes'

export function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-gray-900 text-white dark:border-gray-300 bg-gray-950 dark:bg-gray-100 dark:text-black">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-highlight">Bienvenue, Jenny</h1>
          <p className="text-sm text-gray-400 dark:text-gray-600">Voici ce qui se passe avec votre boutique aujourd&apos;hui.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* {showSearch ? (
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-64 bg-gray-900 border-gray-800 dark:bg-gray-100 dark:border-gray-300"
            />
          ) : (
            <Button size="icon" variant="ghost" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-600" />
            </Button>
          )} */}
          <Button size="icon" variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5 text-gray-400" /> : <Moon className="h-5 w-5 text-gray-400" />}
          </Button>
          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white dark:text-gray-600 dark:hover:text-black">
            <BellIcon className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JW</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}