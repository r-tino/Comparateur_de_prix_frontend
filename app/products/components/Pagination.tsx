// app/products/components/Pagination.tsx
'use client';

type PaginationProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Pagination({ page, setPage }: PaginationProps) {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-300 rounded-l-lg text-gray-700"
      >
        Précédent
      </button>
      <span className="px-4 py-2 bg-gray-100 text-gray-700">{page}</span>
      <button
        onClick={() => setPage((prev) => prev + 1)}
        className="px-4 py-2 bg-gray-300 rounded-r-lg text-gray-700"
      >
        Suivant
      </button>
    </div>
  );
}
