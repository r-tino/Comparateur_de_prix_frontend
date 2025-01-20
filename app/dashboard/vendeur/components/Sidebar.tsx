// app/dashboard/vendeur/components/Sidebar.tsx

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ArrowRightOnRectangleIcon, ChartBarIcon,  QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, TagIcon, GiftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  { name: "Accueil", path: "/dashboard/vendeur", icon: <HomeIcon className="w-6 h-6" /> },
  { name: "Mes Produits", path: "/dashboard/vendeur/produits", icon: <TagIcon className="w-6 h-6" /> },
  { name: "Mes Offres", path: "/dashboard/vendeur/offres", icon: <ChartBarIcon className="w-6 h-6" /> },
  { name: "Promotions", path: "/dashboard/vendeur/promotions", icon: <GiftIcon className="w-6 h-6" /> },
  { name: "Historique des Prix", path: "/dashboard/vendeur/historique-prix", icon: <ClockIcon className="w-6 h-6" /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-gray-800 dark:border-gray-300 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 text-2xl font-bold mb-12 text-highlight dark:text-black">
          <ChartBarIcon className="w-8 h-8 " />
          <span>salence</span>
        </div>
        <nav className="space-y-3">
          {menuItems.map((item) => {
            return (
              <Link key={item.name} href={item.path}>
                <span
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    pathname === item.path
                      ? 'text-white dark:text-black bg-gray-700 dark:bg-gray-200 text-lg font-semibold shadow-md scale-105 animate-pulse'
                      : 'text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                  }`}
                >
                  {item.icon}
                  <span className={`text-sm font-medium ${item.name ? 'text-lg' : ''}`}>{item.name}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <Separator className="bg-gray-700 dark:bg-gray-300 rounded-full my-3" />
      <div className="mt-auto p-6">
        <div className="space-y-2">
          <Link href="/help">
            <span className="flex items-center gap-3 px-3 py-2 text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors">
              <QuestionMarkCircleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Aide</span>
            </span>
          </Link>
          <Link href="/contact">
            <span className="flex items-center gap-3 px-3 py-2 text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Contactez-nous</span>
            </span>
          </Link>
        </div>
      </div>
      <Separator className="bg-gray-800 dark:bg-gray-300" />
      <div className="p-6">
        <Button variant="ghost" className="w-full justify-start text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Se déconnecter</span>
        </Button>
      </div>
    </div>
  );
}