// app/products/components/Sidebar.tsx
'use client';

type SidebarProps = {
  filters: {
    category: string;
    priceRange: [number, number];
    brand: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string;
      priceRange: [number, number];
      brand: string;
    }>
  >;
};

export default function Sidebar({ filters, setFilters }: SidebarProps) {
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <aside className="w-64 bg-night-blue border-gray-200 text-gray-100 shadow-lg rounded-lg p-5">
      <h2 className="text-lg font-semibold mb-6 text-gray-100">Filtres</h2>

      {/* Categories Filter */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">
          Catégorie
        </label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="w-full mt-2 rounded-lg border-blue-300 bg-white py-2 text-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" className="text-gray-500">Toutes</option>
          <option value="Électronique">Électronique</option>
          <option value="fashion">Mode</option>
          <option value="home">Maison</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label htmlFor="priceRange" className="block text-sm font-medium text-gray-300">
          Prix (Ar)
        </label>
        <input
          type="range"
          id="priceRange"
          name="priceRange"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: [0, Number(e.target.value)],
            }))
          }
          className="w-full mt-2 bg-gray-900 accent-blue-500"
        />
        <span className="block text-sm text-gray-400 mt-1">
          0 - {filters.priceRange[1]} Ar
        </span>
      </div>

      {/* Brand Filter */}
      <div className="mb-4">
        <label htmlFor="brand" className="block text-sm font-medium text-gray-300">
          Marque
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          placeholder="Rechercher une marque..."
          className="w-full mt-3 rounded-md border-gray-700 bg-white py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
        />
      </div>
    </aside>
  );
}
