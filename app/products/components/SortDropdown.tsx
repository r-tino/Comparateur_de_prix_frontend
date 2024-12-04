// app/products/components/SortDropdown.tsx
'use client';

type SortDropdownProps = {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
};

export default function SortDropdown({ sort, setSort }: SortDropdownProps) {
  return (
    <div className="flex items-center">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
        Trier par :
      </label>
      <select
        id="sort"
        name="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 w-48 text-gray-800 bg-white px-4 py-2" // Augmentation du padding
      >
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="rating-desc">Les mieux notés</option>
      </select>
    </div>
  );
}
