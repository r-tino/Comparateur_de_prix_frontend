interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function Pagination({ page, setPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-l-md"
      >
        Previous
      </button>
      <span className="px-4 py-2 bg-gray-100">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-r-md"
      >
        Next
      </button>
    </div>
  );
}

