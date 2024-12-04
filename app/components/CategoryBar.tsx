//  app/components/CategoryBar.tsx


import Link from 'next/link'
import { Laptop, Dumbbell, Home, ShoppingBag, Apple, Car, Heart, Briefcase } from 'lucide-react'

const categories = [
  { name: 'Produits électroniques', icon: Laptop, href: '/categories/electronique' },
  { name: 'Sports et Loisirs', icon: Dumbbell, href: '/categories/sports-loisirs' },
  { name: 'Maison et Décoration', icon: Home, href: '/categories/maison-decoration' },
  { name: 'Mode et Accessoires', icon: ShoppingBag, href: '/categories/mode-accessoires' },
  { name: 'Alimentation et Boissons', icon: Apple, href: '/categories/alimentation-boissons' },
  { name: 'Automobile', icon: Car, href: '/categories/automobile' },
  { name: 'Santé et Beauté', icon: Heart, href: '/categories/sante-beaute' },
  { name: 'Services', icon: Briefcase, href: '/categories/services' },
]

export default function CategoryBar() {
  return (
    <div className="bg-[#1B3A57] border-t border-gray-700 mt-16">
      <nav className="container mx-auto px-4 flex justify-center">
        <div className="overflow-x-auto">
          <ul className="flex py-2 gap-8 justify-center">
            {categories.map((category) => (
              <li key={category.name}>
                <Link 
                  href={category.href}
                  className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors group"
                >
                  <category.icon className="w-5 h-5 group-hover:text-blue-400" />
                  <span className="text-xs whitespace-nowrap">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}