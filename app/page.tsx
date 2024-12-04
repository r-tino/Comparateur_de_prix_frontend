// app/page.tsx

'use client'

import Link from 'next/link';
import Image from 'next/image';
import CategoryBar from '@/app/components/CategoryBar';
import { Star, ChevronRight } from 'lucide-react';

// Mock data (replace with actual data fetching in production)
const topCategories = [
  { id: 1, name: 'Électronique', image: '/images/smartphone.jpg' },
  { id: 2, name: 'Mode', image: '/images/fashion.jpg' },
  { id: 3, name: 'Maison', image: '/images/home.png' },
  { id: 4, name: 'Sports', image: '/images/sports.avif' },
  { id: 5, name: 'Beauté', image: '/images/beauty.png' },
];

const mostFollowedProducts = [
  { id: 1, name: 'Smartphone XYZ', image: '/images/smartphone.jpg', followers: 1500 },
  { id: 2, name: 'Laptop ABC', image: '/images/laptop.png', followers: 1200 },
  { id: 3, name: 'Frigos', image: '/images/frigo.png', followers: 1000 },
  { id: 4, name: 'Casques Gameurs', image: '/images/casque.jpg', followers: 1800 },
];

const bestDeals = [
  { id: 1, name: 'Smart TV 4K', image: '/images/tv.png', description: 'Écran 55 pouces, HDR, Smart TV', rating: 9, price: 599.99, discount: 20 },
  { id: 2, name: 'Robot Aspirateur', image: '/images/vacuum.png', description: 'Navigation intelligente, compatible avec app', rating: 8, price: 299.99, discount: 15 },
  { id: 3, name: 'Machine à Café', image: '/images/coffee-machine.jpg', description: 'Espresso automatique, mousseur de lait', rating: 9, price: 199.99, discount: 25 },
];

export default function HomePage() {
  return (
    <main className="bg-gray-100 min-h-screen">
      <CategoryBar />

      {/* Top Categories Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-night-blue mb-6">Top Catégories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {topCategories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-24 flex items-center">
                <div className="w-1/2 h-full flex items-center justify-center pl-4">
                  <h3 className="text-sm font-semibold text-gray-800 text-center">{category.name}</h3>
                </div>
                <div className="w-1/2 h-full flex items-center justify-center">
                  <Image src={category.image} alt={category.name} width={80} height={80} className="object-contain" />
                </div>
              </div>
            </Link>
          ))}
          <Link href="/categories" className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-24 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600 flex items-center">
                Voir plus de catégories
                <ChevronRight className="ml-1 w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Most Followed Products Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-night-blue mb-6">Produits les plus suivis</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mostFollowedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-40 object-contain" />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-600">{product.followers} suivis</p>
              </div>
            </div>
          ))}
          <Link href="/produits-populaires" className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-24 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600 flex items-center">
                Voir plus de produits
                <ChevronRight className="ml-1 w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Best Deals Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-night-blue mb-6">Nos meilleurs bons plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <Image src={deal.image} alt={deal.name} width={400} height={300} className="w-full h-48 object-contain rounded-t-lg" />
                {deal.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    -{deal.discount}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{deal.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{deal.description}</p>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < deal.rating / 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{deal.rating}/10</span>
                </div>
                <p className="text-lg font-bold">
                  à partir de <br />
                  <span className="text-lg font-bold text-green-600">
                    {deal.price.toFixed(2)} Ar
                  </span> 
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
