// app/components/SearchBar.tsx

import { useSearchContext } from '../context/SearchContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearchContext();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique de recherche ici
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg lg:max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="search"
        placeholder="Rechercher un produit"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-2 py-5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 font-semibold text-gray-800 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </form>
  );
}