// app/products/components/ProductGrid.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
};

type ProductGridProps = {
  filters: {
    priceRange: [number, number];
  };
  sort: string;
  page: number;
};

const products: Product[] = [
  { id: 1, name: 'Smartphone XYZ', image: '/images/smartphone.jpg', price: 499.99, rating: 4 },
  { id: 2, name: 'Laptop ABC', image: '/images/laptop.png', price: 899.99, rating: 5 },
  { id: 3, name: 'Machine à Café', image: '/images/coffee-machine.jpg', price: 299.99, rating: 3 },
];

export default function ProductGrid({ filters, sort }: ProductGridProps) {
  const filteredProducts = products
    .filter((product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1])
    .sort((a, b) => (sort === 'price-asc' ? a.price - b.price : b.price - a.price));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 p-4">
            <Image src={product.image} alt={product.name} width={200} height={200} className="object-contain w-full h-32 rounded-md mx-auto" />
            <h3 className="text-sm font-semibold text-gray-800  mt-4 text-center">{product.name}</h3>
            <p className="text-lg font-bold text-green-600 text-center mt-2">{product.price.toFixed(2)} Ar</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
