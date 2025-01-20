// app/products/page.tsx

'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import SortDropdown from './components/SortDropdown';

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000] as [number, number],
    brand: '',
  });
  const [sort, setSort] = useState('price-asc');
  const [page, setPage] = useState(1);


  return (
    <main className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          <Sidebar filters={filters} setFilters={setFilters} />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <SortDropdown sort={sort} setSort={setSort} />
            </div>
            <ProductGrid filters={filters} sort={sort} page={page} />
            <Pagination page={page} setPage={setPage} totalPages={1} />
          </div>
        </div>
      </div>
    </main>
  );
}

