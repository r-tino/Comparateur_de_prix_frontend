'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { products, categories, brands, Product } from '../../data/exampleData';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PAGE_SIZE = 6;

interface Filters {
  category: string;
  priceRange: [number, number];
  brand: string;
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({
    category: '',
    priceRange: [0, 2000000],
    brand: '',
  });
  const [sort, setSort] = useState<'price-asc' | 'price-desc'>('price-asc');
  const [page, setPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let result = products;

    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    if (filters.brand) {
      result = result.filter(product => product.brand === filters.brand);
    }

    result = result.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
    setIsLoading(false);
  }, [filters, sort]);

  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const displayedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <main className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen pt-24">
      <motion.section 
        className="container mx-auto px-4 py-12 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Produits en vedette</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3).fill(0).map((_, index) => (
                <Card key={index} className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-0">
                  <div className="w-full h-64 bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2" />
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse mb-2" />
                    <div className="h-4 w-full bg-gray-200 animate-pulse mb-2" />
                    <div className="h-6 w-1/3 bg-gray-200 animate-pulse" />
                  </CardContent>
                </Card>
              ))
            : products.slice(0, 3).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  onClick={() => handleProductClick(product.id)}
                  className="cursor-pointer"
                >
                  <Card className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-full flex flex-col border-0 transition-all duration-300 ease-in-out">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="relative">
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} width={400} height={300} priority className="w-full h-64 object-contain" />
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-3">
                          Vedette
                        </div>
                      </div>
                    </motion.div>
                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{product.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-4">
                        {product.category}
                      </CardDescription>
                      <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-indigo-600">{product.price.toLocaleString()} Ar</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </motion.section>
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          <Sidebar filters={filters} setFilters={setFilters} />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <SortDropdown sort={sort} setSort={setSort} />
            </div>
            <ProductGrid products={displayedProducts} onProductClick={handleProductClick} />
            <Pagination page={page} setPage={setPage} totalPages={pageCount} />
          </div>
        </div>
      </div>
    </main>
  );
}

interface SidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function Sidebar({ filters, setFilters }: SidebarProps) {
  return (
    <Card className="w-64 h-fit sticky top-24 bg-white/70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border-0">
      <CardHeader>
        <CardTitle>Filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Catégorie</label>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Marque</label>
          <Select
            value={filters.brand}
            onValueChange={(value) => setFilters({ ...filters, brand: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les marques" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les marques</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Prix</label>
          <Slider
            min={0}
            max={2000000}
            step={100000}
            value={filters.priceRange}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
            className="mt-2"
          />
          <div className="flex justify-between mt-2">
            <span>{filters.priceRange[0].toLocaleString()} Ar</span>
            <span>{filters.priceRange[1].toLocaleString()} Ar</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductGridProps {
  products: Product[];
  onProductClick: (productId: string) => void;
}

function ProductGrid({ products, onProductClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => onProductClick(product.id)}
          >
            <Card className="bg-white/70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500 mb-2">{product.category}</CardDescription>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
                <p className="text-lg font-bold text-indigo-600">{product.price.toLocaleString()} Ar</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Voir le produit
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface SortDropdownProps {
  sort: 'price-asc' | 'price-desc';
  setSort: React.Dispatch<React.SetStateAction<'price-asc' | 'price-desc'>>;
}

function SortDropdown({ sort, setSort }: SortDropdownProps) {
  return (
    <Select value={sort} onValueChange={(value: 'price-asc' | 'price-desc') => setSort(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price-asc">Prix croissant</SelectItem>
        <SelectItem value="price-desc">Prix décroissant</SelectItem>
      </SelectContent>
    </Select>
  );
}

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

function Pagination({ page, setPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center mt-8 space-x-2">
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        variant="outline"
      >
        Précédent
      </Button>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        variant="outline"
      >
        Suivant
      </Button>
    </div>
  );
}

